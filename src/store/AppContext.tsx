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

export type CartItem = { food: Food; qty: number; note: string }

export type OrderStatus = 'preparing' | 'picked_up'

/** 1 Gold = 1,000 VND; employees may advance at most this much salary per month. */
export const MONTHLY_TOPUP_LIMIT = 2000

export type Order = {
  id: string
  queueNumber: number
  restaurant: Restaurant
  items: CartItem[]
  total: number
  method: PaymentMethod
  goldUsed: number
  createdAt: Date
  status: OrderStatus
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
  monthlyToppedUp: number
  resetMonthlyTopUp: () => void

  // restaurant
  selectedRestaurant: Restaurant | null
  selectRestaurant: (id: string) => void

  // cart
  cart: CartItem[]
  cartRestaurant: Restaurant | null
  cartCount: number
  cartTotal: number
  /** Returns false when the dish is from another restaurant; a confirm dialog is then shown. */
  addToCart: (food: Food, qty: number) => boolean
  changeQty: (foodId: string, delta: number) => void
  removeFromCart: (foodId: string) => void
  setNote: (foodId: string, note: string) => void
  pendingAdd: CartItem | null
  confirmNewCart: () => void
  cancelNewCart: () => void

  // payment + orders
  paymentMethod: PaymentMethod | null
  setPaymentMethod: (method: PaymentMethod | null) => void
  currentOrder: Order | null
  orders: Order[]
  preparingCount: number
  placeOrder: (method: PaymentMethod) => Order | null
  markPickedUp: (orderId: string) => void

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
  const [pendingAdd, setPendingAdd] = useState<CartItem | null>(null)
  const [monthlyToppedUp, setMonthlyToppedUp] = useState(0)
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

  const topUpGold = useCallback((amount: number) => {
    setGold((g) => g + amount)
    setMonthlyToppedUp((m) => m + amount)
  }, [])
  const resetMonthlyTopUp = useCallback(() => setMonthlyToppedUp(0), [])

  const selectRestaurant = useCallback((id: string) => setSelectedRestaurantId(id), [])

  const cartRestaurant = cart.length ? findRestaurant(cart[0].food.restaurantId) : null
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.food.price, 0)

  const addToCart = useCallback(
    (food: Food, qty: number) => {
      // A cart can only hold dishes from one restaurant: ask before starting a new order.
      if (cart.some((i) => i.food.restaurantId !== food.restaurantId)) {
        setPendingAdd({ food, qty, note: '' })
        return false
      }
      setCart((current) => {
        const existing = current.find((i) => i.food.id === food.id)
        if (existing) {
          return current.map((i) => (i.food.id === food.id ? { ...i, qty: i.qty + qty } : i))
        }
        return [...current, { food, qty, note: '' }]
      })
      return true
    },
    [cart],
  )

  const confirmNewCart = useCallback(() => {
    if (!pendingAdd) return
    setCart([pendingAdd])
    setPaymentMethod(null)
    setPendingAdd(null)
    showToast(`New order started at ${findRestaurant(pendingAdd.food.restaurantId)?.name}`)
  }, [pendingAdd, showToast])

  const cancelNewCart = useCallback(() => setPendingAdd(null), [])

  const setNote = useCallback((foodId: string, note: string) => {
    setCart((current) => current.map((i) => (i.food.id === foodId ? { ...i, note } : i)))
  }, [])

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
        status: 'preparing',
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

  const markPickedUp = useCallback((orderId: string) => {
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status: 'picked_up' } : o)))
  }, [])

  const preparingCount = orders.filter((o) => o.status === 'preparing').length

  const value = useMemo<AppState>(
    () => ({
      screen: stack[stack.length - 1],
      navigate,
      back,
      resetTo,
      gold,
      topUpGold,
      setGoldBalance: setGold,
      monthlyToppedUp,
      resetMonthlyTopUp,
      selectedRestaurant: findRestaurant(selectedRestaurantId),
      selectRestaurant,
      cart,
      cartRestaurant,
      cartCount,
      cartTotal,
      addToCart,
      changeQty,
      removeFromCart,
      setNote,
      pendingAdd,
      confirmNewCart,
      cancelNewCart,
      paymentMethod,
      setPaymentMethod,
      currentOrder,
      orders,
      preparingCount,
      placeOrder,
      markPickedUp,
      toast,
      showToast,
    }),
    [
      stack, navigate, back, resetTo, gold, topUpGold, monthlyToppedUp, resetMonthlyTopUp,
      selectedRestaurantId, selectRestaurant, cart, cartRestaurant, cartCount, cartTotal,
      addToCart, changeQty, removeFromCart, setNote, pendingAdd, confirmNewCart, cancelNewCart,
      paymentMethod, currentOrder, orders, preparingCount, placeOrder, markPickedUp, toast, showToast,
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
