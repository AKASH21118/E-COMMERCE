import { z } from 'zod';
import { createPaymentIntent } from '../services/payment.service.js';
import { pool } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function createIntent(req, res) {
  const schema = z.object({
    paymentMethod: z.enum(['upi', 'cod']),
    customerEmail: z.string().email().optional(),
    items: z.array(z.object({
      productId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive(),
      size: z.enum(['S', 'M', 'L', 'XL']),
    })).min(1),
    couponCode: z.string().optional(),
  });

  const payload = schema.parse(req.body);

  let subtotal = 0;
  for (const item of payload.items) {
    const [rows] = await pool.query(
      `
        SELECT p.price
        FROM products p
        INNER JOIN product_inventory inv ON inv.product_id = p.id
        WHERE p.id = ? AND inv.size = ?
      `,
      [item.productId, item.size],
    );

    const product = rows[0];
    if (!product) {
      throw new HttpError(404, `Product ${item.productId} with size ${item.size} not found`);
    }

    subtotal += Number(product.price) * item.quantity;
  }

  const shippingAmount = subtotal > 200 ? 0 : 15;
  let discountAmount = 0;

  if (payload.couponCode) {
    const [couponRows] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE',
      [payload.couponCode],
    );
    const coupon = couponRows[0];
    if (coupon) {
      const now = new Date();
      const validStart = !coupon.starts_at || new Date(coupon.starts_at) <= now;
      const validEnd = !coupon.expires_at || new Date(coupon.expires_at) >= now;
      const validUses = !coupon.max_uses || coupon.used_count < coupon.max_uses;
      const validMin = subtotal >= Number(coupon.min_order_amount);

      if (validStart && validEnd && validUses && validMin) {
        if (coupon.type === 'percentage') {
          discountAmount = Math.round((subtotal * Number(coupon.value)) / 100 * 100) / 100;
        } else {
          discountAmount = Math.min(Number(coupon.value), subtotal);
        }
      }
    }
  }

  const amount = subtotal + shippingAmount - discountAmount;

  if (amount <= 0 && payload.paymentMethod !== 'cod') {
    throw new HttpError(400, 'Invalid payment amount');
  }

  const paymentIntent = await createPaymentIntent({
    amount,
    receipt: `receipt_${Date.now()}`,
    notes: {
      paymentMethod: payload.paymentMethod,
      customerEmail: payload.customerEmail || '',
    },
  });

  res.status(201).json(paymentIntent);
}