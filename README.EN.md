# MyFPT Canteen – Interactive UI Prototype

[🇻🇳 Tiếng Việt](README.md) · 🇬🇧 English

A clickable mobile prototype of the **Canteen** feature inside the MyFPT app: browse food vendors at your company site, order food, and pay with **Gold** (salary advance), **Momo**, or a **Bank Account**.

> This is a UI/UX prototype. All data, payments, top-ups and QR scanning are **mocked**. No real money is charged and no external service is contacted.

### Requirements

- Node.js 20+ (tested with Node 22) and npm
- Internet connection (for food photos and the web font; if photos fail to load, an emoji placeholder is shown)

### Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

- On a desktop browser (width ≥ 640px) the app is shown inside a phone frame.
- On a phone, or in browser DevTools device mode, it fills the whole screen.
- To open it on a real phone on the same Wi-Fi network: `npm run dev -- --host`, then open the "Network" URL that Vite prints.

Other commands:

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run build`   | Type-check and build to `dist/`      |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint the code with oxlint            |

State lives in memory, so **reloading the page resets everything** (Gold goes back to 250 and the cart and orders are cleared).

### How to use (demo script)

**1. Pay with Gold**

1. On the MyFPT home screen, tap **Canteen** (or the **Open Canteen** banner).
2. On Canteen Home, you can see your Gold balance (**250 Gold**), the quick actions and the restaurants list.
3. Tap **Canteen Food Court**, look at the details and reviews, then tap **Order Now**.
4. Tap a dish (e.g. **Grilled Chicken Rice**), set the quantity to 2 with **+**, then tap **Add to Cart**. You can also tap **+ Add** directly on the menu.
5. Tap the floating **View Cart** bar. Here you can change quantities or remove items with the trash icon.
6. Tap **Proceed to Payment**, select **Gold** (90 Gold required), then tap **Confirm Payment**.
7. The success screen shows the order number, queue number and preparation time. Tap **Close**, and Canteen Home now shows **160 Gold** and your active order.

**2. Insufficient Gold → Top Up**

1. On Canteen Home, tap the **Account** tab. This opens the *Prototype controls* sheet. Set the balance to **50 Gold**.
2. Order something that costs more than 50,000 VND and go to Payment.
3. The Gold option is disabled and shows **Insufficient balance**. Tap **Top Up Gold**.
4. Pick an amount (the smallest one that covers the order is pre-selected) and tap **Confirm Top Up**.
5. Tap **Return to Payment**. Gold is now enabled and selected. Confirm the payment.

**3. Pay with Momo / Bank Account**

On Payment, select **Momo** or **Bank Account**, then tap **Confirm Payment**. A simulated redirect screen opens. Tap **Confirm payment** in the mock screen, and it returns to the success screen. Gold is not deducted.

**Other interactions**

- **Scan QR** (Canteen Home): shows a mock camera, "detects" a QR code after a few seconds, and opens Canteen Food Court.
- **Top Up Gold** (quick action or the button on the Gold card): top up at any time.
- **Search bar and category chips**: filter restaurants.
- **Orders** tab: lists the orders placed in this session.
- A cart holds dishes from only one restaurant. Adding a dish from another restaurant starts a new cart.

### Project structure

```
src/
├── App.tsx               # Phone frame + screen switcher
├── store/AppContext.tsx  # App state: navigation, Gold, cart, payment, orders
├── data/mock.ts          # Employee, restaurants, dishes, reviews
├── utils/format.ts       # VND/Gold formatting (1 Gold = 1,000 VND)
├── components/           # Header, GoldBalanceCard, QuickAction, RestaurantCard,
│                         # FoodCard, CartBar, BottomNavigation, Icon, ui (shared)
└── screens/              # MyFPTHome, CanteenHome, RestaurantDetail, FoodMenu,
                          # FoodDetail, Cart, Payment, GoldTopUp, ExternalPayment,
                          # OrderSuccess, Orders, ScanQRModal
```

To change restaurants, dishes, prices or the starting Gold balance, edit `src/data/mock.ts`.

Tech stack: React 19, TypeScript, Vite, Tailwind CSS v4.
