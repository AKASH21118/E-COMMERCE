import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { NewArrivals } from './pages/NewArrivals';
import { BestSellers } from './pages/BestSellers';
import { NotFound } from './pages/NotFound';
import { Sale } from './pages/Sale';
import { MyOrders } from './pages/MyOrders';
import { AllProducts } from './pages/AllProducts';

// Lazy load admin pages (heavy, only loaded when needed)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory').then(m => ({ default: m.AdminInventory })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminHomepage = lazy(() => import('./pages/admin/AdminHomepage').then(m => ({ default: m.AdminHomepage })));
const AdminSaleProducts = lazy(() => import('./pages/admin/AdminSaleProducts').then(m => ({ default: m.AdminSaleProducts })));
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos').then(m => ({ default: m.AdminVideos })));
const AdminCarousel = lazy(() => import('./pages/admin/AdminCarousel').then(m => ({ default: m.AdminCarousel })));

// Loading fallback component
const LoadingFallback = () => <div style={{ padding: '2rem', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'shop', Component: ProductListing },
      { path: 'all-products', Component: AllProducts },
      // Legacy category paths
      { path: 'casual', Component: ProductListing },
      { path: 'formal', Component: ProductListing },
      { path: 'streetwear', Component: ProductListing },
      // Top Wear parent + sub-categories
      { path: 'topwear', Component: CategoryPage },
      { path: 'tshirt', Component: CategoryPage },
      { path: 'shirt', Component: CategoryPage },
      { path: 'coord', Component: CategoryPage },
      { path: 'hoodies', Component: CategoryPage },
      // Bottom Wear parent + sub-categories
      { path: 'bottomwear', Component: CategoryPage },
      { path: 'jeans', Component: CategoryPage },
      { path: 'trousers', Component: CategoryPage },
      { path: 'shorts', Component: CategoryPage },
      { path: 'trackpants', Component: CategoryPage },
      // Other pages
      { path: 'new-arrivals', Component: NewArrivals },
      { path: 'best-sellers', Component: BestSellers },
      { path: 'sale', Component: Sale },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'search', Component: Search },
      { path: 'profile', Component: Profile },
      { path: 'my-orders', Component: MyOrders },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin/login',
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLogin />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/admin',
    Component: () => (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'products',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminProducts />
          </Suspense>
        ),
      },
      {
        path: 'inventory',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminInventory />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminOrders />
          </Suspense>
        ),
      },
      {
        path: 'customers',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminCustomers />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminAnalytics />
          </Suspense>
        ),
      },
      {
        path: 'reviews',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminReviews />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSettings />
          </Suspense>
        ),
      },
      {
        path: 'homepage',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminHomepage />
          </Suspense>
        ),
      },
      {
        path: 'sale-products',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSaleProducts />
          </Suspense>
        ),
      },
      {
        path: 'videos',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminVideos />
          </Suspense>
        ),
      },
      {
        path: 'carousel',
        Component: () => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminCarousel />
          </Suspense>
        ),
      },
    ],
  },
]);