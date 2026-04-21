import dns from 'dns';
import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required. Set it to your Neon/PostgreSQL connection string.');
}

// Resolve the Neon hostname via Google DNS (8.8.8.8) because some ISP DNS
// servers do not resolve Neon's pooler subdomains correctly.
const _parsedUrl = new URL(DATABASE_URL);
const _hostname  = _parsedUrl.hostname;

const _resolver = new dns.Resolver();
_resolver.setServers(['8.8.8.8', '1.1.1.1']);

const _resolvedIp = await new Promise((resolve, reject) => {
  _resolver.resolve4(_hostname, (err, addresses) => {
    if (err) reject(new Error(`DNS resolution failed for ${_hostname}: ${err.message}`));
    else resolve(addresses[0]);
  });
});

const pgPool = new Pool({
  host:     _resolvedIp,
  port:     parseInt(_parsedUrl.port) || 5432,
  database: _parsedUrl.pathname.replace(/^\//, ''),
  user:     decodeURIComponent(_parsedUrl.username),
  password: decodeURIComponent(_parsedUrl.password),
  ssl: { rejectUnauthorized: false, servername: _hostname },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Convert a MySQL-style query to PostgreSQL:
 *  - ? positional params   → $1, $2, ...
 *  - :name named params    → $1, $2, ... (object params)
 *  - INSERT ...            → appends RETURNING id automatically
 */
function convertQuery(sql, params) {
  let pgSql;
  let pgParams;

  if (params && !Array.isArray(params) && typeof params === 'object') {
    // Named placeholder style  e.g. WHERE id = :id   with  { id: 5 }
    const paramNames = [];
    pgSql = sql.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return `$${paramNames.length}`;
    });
    pgParams = paramNames.map(name => params[name]);
  } else {
    // Positional ?  style  e.g. WHERE id = ?  with  [5]
    let i = 0;
    pgSql = sql.replace(/\?/g, () => `$${++i}`);
    pgParams = Array.isArray(params) ? params : [];
  }

  // Auto-append RETURNING id so INSERT result has insertId
  const isInsert = /^\s*INSERT\s/i.test(pgSql.trimStart());
  if (isInsert && !/RETURNING/i.test(pgSql)) {
    pgSql = `${pgSql.trimEnd()} RETURNING id`;
  }

  return { pgSql, pgParams, isInsert };
}

/**
 * Execute a query on the given pg client/pool and return mysql2-compatible result.
 * SELECT/UPDATE/DELETE  →  [rows, null]        (rows is an array)
 * INSERT                →  [{ insertId, affectedRows }, null]
 */
async function execQuery(client, sql, params) {
  const { pgSql, pgParams, isInsert } = convertQuery(sql, params);
  const result = await client.query(pgSql, pgParams.length > 0 ? pgParams : undefined);

  if (isInsert) {
    return [{ insertId: result.rows[0]?.id ?? null, affectedRows: result.rowCount }, null];
  }
  return [result.rows, null];
}

/**
 * mysql2-compatible pool wrapper.
 * Supports:  pool.query()  pool.execute()  pool.getConnection()
 */
export const pool = {
  /** Run a query (no transaction). */
  async query(sql, params) {
    return execQuery(pgPool, sql, params);
  },

  /** Alias for query() — mysql2 uses execute() for prepared statements. */
  async execute(sql, params) {
    return execQuery(pgPool, sql, params);
  },

  /**
   * Acquire a connection for manual transaction control.
   * Returns an object with beginTransaction / commit / rollback / release / query / execute.
   */
  async getConnection() {
    const client = await pgPool.connect();
    return {
      async query(sql, params)   { return execQuery(client, sql, params); },
      async execute(sql, params) { return execQuery(client, sql, params); },
      async beginTransaction()   { await client.query('BEGIN'); },
      async commit()             { await client.query('COMMIT'); },
      async rollback()           { await client.query('ROLLBACK'); },
      release()                  { client.release(); },
    };
  },

  /** Expose raw pool for server startup health check. */
  async end() {
    await pgPool.end();
  },
};