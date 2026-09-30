import { Toast } from './components/ui'
import { AppProvider, useApp } from './store/AppContext'
import type { Screen } from './store/AppContext'
import { CanteenHome } from './screens/CanteenHome'
import { Cart } from './screens/Cart'
import { ExternalPayment } from './screens/ExternalPayment'
import { FoodDetail } from './screens/FoodDetail'
import { FoodMenu } from './screens/FoodMenu'
import { GoldTopUp } from './screens/GoldTopUp'
import { MyFPTHome } from './screens/MyFPTHome'
import { OrderSuccess } from './screens/OrderSuccess'
import { Orders } from './screens/Orders'
import { Payment } from './screens/Payment'
import { RestaurantDetail } from './screens/RestaurantDetail'

function renderScreen(screen: Screen) {
  switch (screen.name) {
    case 'myfpt':
      return <MyFPTHome />
    case 'canteen':
      return <CanteenHome />
    case 'restaurant':
      return <RestaurantDetail />
    case 'menu':
      return <FoodMenu />
    case 'food':
      return <FoodDetail foodId={screen.foodId} />
    case 'cart':
      return <Cart />
    case 'payment':
      return <Payment />
    case 'topup':
      return <GoldTopUp returnTo={screen.returnTo} />
    case 'external':
      return <ExternalPayment method={screen.method} />
    case 'success':
      return <OrderSuccess />
    case 'orders':
      return <Orders />
  }
}

function screenKey(screen: Screen) {
  return 'foodId' in screen ? `${screen.name}-${screen.foodId}` : screen.name
}

function PhoneShell() {
  const { screen } = useApp()
  return (
    <div className="flex min-h-full items-center justify-center sm:p-6">
      {/* On phones the app fills the viewport; on larger screens it sits in a device frame. */}
      <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-50 sm:h-[844px] sm:max-h-[calc(100dvh-48px)] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl sm:ring-[10px] sm:ring-slate-900">
        <div key={screenKey(screen)} className="absolute inset-0">
          {renderScreen(screen)}
        </div>
        <Toast />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <PhoneShell />
    </AppProvider>
  )
}
