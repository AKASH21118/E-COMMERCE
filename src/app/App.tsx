import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductCatalogProvider } from './context/ProductCatalogContext';
import { ProfileProvider } from './context/ProfileContext';
import { HomepageContentProvider } from './context/HomepageContentContext';
import { SplashScreen } from './components/SplashScreen';
import { router } from './routes';

export default function App() {
  return (
    <>
      <SplashScreen />
      <AuthProvider>
        <ProfileProvider>
          <ProductCatalogProvider>
            <HomepageContentProvider>
              <WishlistProvider>
                <CartProvider>
                  <RouterProvider router={router} />
                </CartProvider>
              </WishlistProvider>
            </HomepageContentProvider>
          </ProductCatalogProvider>
        </ProfileProvider>
      </AuthProvider>
    </>
  );
}