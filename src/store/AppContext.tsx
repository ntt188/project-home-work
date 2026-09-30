import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { INITIAL_GOLD, findRestaurant } from '../data/mock'
import type { Food, Restaurant } from '../data/mock'
import { vndToGold } from '../utils/format'

export type PaymentMethod = 'gold' | 'momo' | 'bank'

export type Screen =
  | { name: 'myfpt' }
  | { name: 'canteen' }
  | { name: 'restaurant' }
  | { name: 'menu' }
  | { name: 'food'; foodId: string }
  | { name: 'cart' }
  | { name: 'payment' }
  | { name: 'topup'; returnTo: 'payment' | 'canteen' }
  | { name: 'external'; method: 'momo' | 'bank' }
  | { name: 'success' }
  | { name: 'orders' }

export type CartItem = { food: Food; qty: number }

export type Order = {
  id: string
  queueNumber: number
  restaurant: Restaurant
  items: CartItem[]
  total: number
  method: PaymentMethod
  goldUsed: number
  createdAt: Date
}

type Toast = { id: number; message: string }

type AppState = {
  // navigation
  screen: Screen
  navigate: (screen: Screen) => void
  back: () => void
  resetTo: (stack: Screen[]) => void

  // gold
  gold: number
  topUpGold: (amount: number) => void
  setGoldBalance: (amount: number) => void

  // restaurant
  selectedRestaurant: Restaurant | null
  selectRestaurant: (id: string) => void

  // cart
  cart: CartItem[]
  cartRestaurant: Restaurant | null
  cartCount: number
  cartTotal: number
  addToCart: (food: Food, qty: number) => void
  changeQty: (foodId: string, delta: number) => void
  removeFromCart: (foodId: string) => void

  // payment + orders
  paymentMethod: PaymentMethod | null
  setPaymentMethod: (method: PaymentMethod | null) => void
  currentOrder: Order | null
  orders: Order[]
  placeOrder: (method: PaymentMethod) => Order | null

  // feedback
  toast: Toast | null
  showToast: (message: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: 'myfpt' }])
  const [gold, setGold] = useState(INITIAL_GOLD)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [toast, setToast] = useState<Toast | null>(null)

  const orderSeq = useRef(1024)
  const queueSeq = useRef(24)
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const navigate = useCallback((screen: Screen) => setStack((s) => [...s, screen]), [])
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const resetTo = useCallback((next: Screen[]) => setStack(next), [])

  const topUpGold = useCallback((amount: number) => setGold((g) => g + amount), [])

  const selectRestaurant = useCallback((id: string) => setSelectedRestaurantId(id), [])

  const cartRestaurant = cart.length ? findRestaurant(cart[0].food.restaurantId) : null
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.food.price, 0)

  const addToCart = useCallback(
    (food: Food, qty: number) => {
      // A cart can only hold dishes from one restaurant.
      const fromSameRestaurant = (items: CartItem[]) =>
        items.every((i) => i.food.restaurantId === food.restaurantId)
      if (!fromSameRestaurant(cart)) {
        showToast(`Started a new cart for ${findRestaurant(food.restaurantId)?.name}`)
      }
      setCart((current) => {
        const base = fromSameRestaurant(current) ? current : []
        const existing = base.find((i) => i.food.id === food.id)
        if (existing) {
          return base.map((i) => (i.food.id === food.id ? { ...i, qty: i.qty + qty } : i))
        }
        return [...base, { food, qty }]
      })
    },
    [cart, showToast],
  )

  const changeQty = useCallback((foodId: string, delta: number) => {
    setCart((current) =>
      current
        .map((i) => (i.food.id === foodId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    )
  }, [])

  const removeFromCart = useCallback((foodId: string) => {
    setCart((current) => current.filter((i) => i.food.id !== foodId))
  }, [])

  const placeOrder = useCallback(
    (method: PaymentMethod) => {
      if (!cart.length || !cartRestaurant) return null
      const goldUsed = method === 'gold' ? vndToGold(cartTotal) : 0
      if (goldUsed > gold) return null

      const order: Order = {
        id: `A${orderSeq.current++}`,
        queueNumber: queueSeq.current++,
        restaurant: cartRestaurant,
        items: cart,
        total: cartTotal,
        method,
        goldUsed,
        createdAt: new Date(),
      }
      if (goldUsed) setGold((g) => g - goldUsed)
      setOrders((o) => [order, ...o])
      setCurrentOrder(order)
      setCart([])
      setPaymentMethod(null)
      return order
    },
    [cart, cartRestaurant, cartTotal, gold],
  )

  const value = useMemo<AppState>(
    () => ({
      screen: stack[stack.length - 1],
      navigate,
      back,
      resetTo,
      gold,
      topUpGold,
      setGoldBalance: setGold,
      selectedRestaurant: findRestaurant(selectedRestaurantId),
      selectRestaurant,
      cart,
      cartRestaurant,
      cartCount,
      cartTotal,
      addToCart,
      changeQty,
      removeFromCart,
      paymentMethod,
      setPaymentMethod,
      currentOrder,
      orders,
      placeOrder,
      toast,
      showToast,
    }),
    [
      stack, navigate, back, resetTo, gold, topUpGold, selectedRestaurantId, selectRestaurant,
      cart, cartRestaurant, cartCount, cartTotal, addToCart, changeQty, removeFromCart,
      paymentMethod, currentOrder, orders, placeOrder, toast, showToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
