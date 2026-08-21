import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AuthProvider } from '@/lib/auth'
import { ToastProvider } from '@/components/ui/Toast'
import { ProtectedRoute, RoleHome } from '@/components/layout/ProtectedRoute'
import { StoreShell } from '@/components/layout/StoreShell'
import { ConsoleShell } from '@/components/layout/ConsoleShell'
import { LoginPage } from '@/pages/Login'
import { StoreHomePage } from '@/pages/store/Home'
import { StoreProductsPage } from '@/pages/store/Products'
import { StoreProductDetailPage } from '@/pages/store/ProductDetail'
import { StoreCartPage } from '@/pages/store/Cart'
import { StoreCheckoutPage } from '@/pages/store/Checkout'
import { StoreOrdersPage } from '@/pages/store/Orders'
import { StoreOrderDetailPage } from '@/pages/store/OrderDetail'
import { StoreProfilePage } from '@/pages/store/Profile'
import { ConsoleDashboardPage } from '@/pages/console/Dashboard'
import { ConsoleOrdersPage } from '@/pages/console/Orders'
import { ConsoleReviewsPage } from '@/pages/console/Reviews'
import { ConsoleInventoryPage } from '@/pages/console/Inventory'
import { ConsoleUsersPage } from '@/pages/console/Users'
import { AIAnalyticsPage } from '@/pages/AIAnalytics'
import { CapabilitiesPage } from '@/pages/Capabilities'

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.split('/').slice(0, 2).join('/')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Routes location={location}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
              <Route path="/" element={<RoleHome />} />

              <Route
                path="/store"
                element={
                  <ProtectedRoute roles={['USER', 'ADMIN']}>
                    <StoreShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StoreHomePage />} />
                <Route path="products" element={<StoreProductsPage />} />
                <Route path="products/:id" element={<StoreProductDetailPage />} />
                <Route path="cart" element={<StoreCartPage />} />
                <Route path="checkout" element={<StoreCheckoutPage />} />
                <Route path="orders" element={<StoreOrdersPage />} />
                <Route path="orders/:id" element={<StoreOrderDetailPage />} />
                <Route path="profile" element={<StoreProfilePage />} />
              </Route>

              <Route
                path="/console"
                element={
                  <ProtectedRoute roles={['ADMIN', 'ANALYST']}>
                    <ConsoleShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ConsoleDashboardPage />} />
                <Route path="orders" element={<ConsoleOrdersPage />} />
                <Route path="reviews" element={<ConsoleReviewsPage />} />
                <Route path="inventory" element={<ConsoleInventoryPage />} />
                <Route path="users" element={<ConsoleUsersPage />} />
                <Route path="ask" element={<AIAnalyticsPage />} />
                <Route path="capabilities" element={<CapabilitiesPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </ToastProvider>
    </AuthProvider>
  )
}
