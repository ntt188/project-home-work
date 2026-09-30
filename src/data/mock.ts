export type Food = {
  id: string
  restaurantId: string
  name: string
  price: number
  description: string
  image: string
  emoji: string
  category: string
  popular?: boolean
}

export type Review = {
  author: string
  rating: number
  comment: string
  date: string
}

export type Restaurant = {
  id: string
  name: string
  category: string
  tags: string[]
  rating: number
  ratingCount: number
  hours: string
  location: string
  description: string
  image: string
  emoji: string
  prepTime: string
  foods: Food[]
  reviews: Review[]
}

export type Employee = {
  name: string
  initials: string
  employeeId: string
  department: string
  site: string
}

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const employee: Employee = {
  name: 'Nguyễn Thanh Thắng',
  initials: 'NT',
  employeeId: 'FPT-DN-02417',
  department: 'FPT Software Đà Nẵng',
  site: 'FPT Complex Đà Nẵng',
}

export const INITIAL_GOLD = 250

export const categories = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'rice', label: 'Rice', emoji: '🍚' },
  { id: 'noodles', label: 'Noodles', emoji: '🍜' },
  { id: 'chicken', label: 'Chicken', emoji: '🍗' },
  { id: 'drinks', label: 'Drinks', emoji: '☕' },
]

export const restaurants: Restaurant[] = [
  {
    id: 'food-court',
    name: 'Canteen Food Court',
    category: 'Vietnamese · Rice',
    tags: ['rice'],
    rating: 4.8,
    ratingCount: 1243,
    hours: '06:30 – 19:00',
    location: 'Building A – Ground Floor',
    description: 'Home-style Vietnamese rice dishes, cooked fresh every morning.',
    image: img('photo-1555396273-367ea4eb4db5'),
    emoji: '🍱',
    prepTime: '10–15 min',
    foods: [
      {
        id: 'fc-1',
        restaurantId: 'food-court',
        name: 'Grilled Chicken Rice',
        price: 45000,
        description: 'Grilled chicken, steamed rice, pickled vegetables and fish sauce.',
        image: img('photo-1598515214211-89d3c73ae83b'),
        emoji: '🍗',
        category: 'Rice',
        popular: true,
      },
      {
        id: 'fc-2',
        restaurantId: 'food-court',
        name: 'Cơm Tấm Sườn',
        price: 40000,
        description: 'Broken rice with caramelised pork chop, egg meatloaf and scallion oil.',
        image: img('photo-1512058564366-18510be2db19'),
        emoji: '🍛',
        category: 'Rice',
        popular: true,
      },
      {
        id: 'fc-3',
        restaurantId: 'food-court',
        name: 'Vegetarian Rice Set',
        price: 35000,
        description: 'Stir-fried seasonal vegetables, tofu in tomato sauce and brown rice.',
        image: img('photo-1546069901-ba9599a7e63c'),
        emoji: '🥗',
        category: 'Rice',
        popular: true,
      },
      {
        id: 'fc-4',
        restaurantId: 'food-court',
        name: 'Sour Fish Soup',
        price: 25000,
        description: 'Canh chua with catfish, pineapple, tomato and bean sprouts.',
        image: img('photo-1547592180-85f173990554'),
        emoji: '🍲',
        category: 'Sides',
      },
      {
        id: 'fc-5',
        restaurantId: 'food-court',
        name: 'Iced Tea',
        price: 5000,
        description: 'Refreshing trà đá, free refill at the counter.',
        image: img('photo-1556679343-c7306c1976bc'),
        emoji: '🧊',
        category: 'Drinks',
      },
    ],
    reviews: [
      { author: 'Minh Anh', rating: 5, comment: 'Food is good and ordering is very convenient.', date: '2 days ago' },
      { author: 'Quốc Bảo', rating: 5, comment: 'No more queueing at lunch. Paying with Gold is super quick!', date: '1 week ago' },
      { author: 'Thu Hà', rating: 4, comment: 'Tasty and affordable. Portions could be a bit bigger.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'pho-hoa',
    name: 'Phở Hòa',
    category: 'Noodle Soup',
    tags: ['noodles'],
    rating: 4.7,
    ratingCount: 862,
    hours: '06:00 – 14:00',
    location: 'Building B – Floor 1',
    description: 'Slow-simmered beef broth, 12 hours every night. A breakfast favourite.',
    image: img('photo-1582878826629-29b7ad1cdc43'),
    emoji: '🍜',
    prepTime: '5–10 min',
    foods: [
      {
        id: 'ph-1',
        restaurantId: 'pho-hoa',
        name: 'Phở Bò Tái',
        price: 50000,
        description: 'Rice noodles with rare beef slices, herbs and a clear beef broth.',
        image: img('photo-1582878826629-29b7ad1cdc43'),
        emoji: '🍜',
        category: 'Noodles',
        popular: true,
      },
      {
        id: 'ph-2',
        restaurantId: 'pho-hoa',
        name: 'Phở Gà',
        price: 45000,
        description: 'Chicken phở with shredded free-range chicken and ginger broth.',
        image: img('photo-1569718212165-3a8278d5f624'),
        emoji: '🍲',
        category: 'Noodles',
        popular: true,
      },
      {
        id: 'ph-3',
        restaurantId: 'pho-hoa',
        name: 'Phở Đặc Biệt',
        price: 65000,
        description: 'The special: rare beef, brisket, tendon and beef balls.',
        image: img('photo-1503764654157-72d979d9af2f'),
        emoji: '🥢',
        category: 'Noodles',
        popular: true,
      },
      {
        id: 'ph-4',
        restaurantId: 'pho-hoa',
        name: 'Quẩy (Fried Dough)',
        price: 5000,
        description: 'Crispy fried dough sticks, perfect for dipping.',
        image: img('photo-1509440159596-0249088772ff'),
        emoji: '🥖',
        category: 'Sides',
      },
    ],
    reviews: [
      { author: 'Hoàng Long', rating: 5, comment: 'Broth tastes just like the old shop in Hà Nội.', date: '3 days ago' },
      { author: 'Lan Chi', rating: 4, comment: 'Great phở. Gets busy after 8:00, order ahead!', date: '1 week ago' },
    ],
  },
  {
    id: 'bun-bo-hue',
    name: 'Bún Bò Huế O Hà',
    category: 'Central Vietnamese · Noodles',
    tags: ['noodles'],
    rating: 4.6,
    ratingCount: 540,
    hours: '06:30 – 13:30',
    location: 'Building A – Floor 2, Food Hall',
    description: 'Spicy lemongrass broth straight from Huế, made by O Hà herself.',
    image: img('photo-1555126634-323283e090fa'),
    emoji: '🌶️',
    prepTime: '8–12 min',
    foods: [
      {
        id: 'bb-1',
        restaurantId: 'bun-bo-hue',
        name: 'Bún Bò Đặc Biệt',
        price: 55000,
        description: 'Beef shank, pork knuckle, crab cake and a spicy lemongrass broth.',
        image: img('photo-1555126634-323283e090fa'),
        emoji: '🍜',
        category: 'Noodles',
        popular: true,
      },
      {
        id: 'bb-2',
        restaurantId: 'bun-bo-hue',
        name: 'Bún Bò Giò Heo',
        price: 50000,
        description: 'Tender pork knuckle with thick rice noodles and fresh herbs.',
        image: img('photo-1617093727343-374698b1b08d'),
        emoji: '🍲',
        category: 'Noodles',
        popular: true,
      },
      {
        id: 'bb-3',
        restaurantId: 'bun-bo-hue',
        name: 'Bún Chả Cá',
        price: 45000,
        description: 'Đà Nẵng-style fish cake noodle soup with pumpkin and tomato.',
        image: img('photo-1552611052-33e04de081de'),
        emoji: '🐟',
        category: 'Noodles',
      },
    ],
    reviews: [
      { author: 'Thanh Tâm', rating: 5, comment: 'Authentic Huế flavour, spicy just right.', date: '5 days ago' },
      { author: 'Đức Huy', rating: 4, comment: 'Delicious. Would love a less spicy option.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'chicken-rice',
    name: 'Chicken & Rice',
    category: 'Fried Chicken · Rice Bowls',
    tags: ['chicken', 'rice'],
    rating: 4.5,
    ratingCount: 978,
    hours: '10:00 – 20:00',
    location: 'Building C – Ground Floor',
    description: 'Crispy fried chicken and teriyaki bowls for the late-lunch crowd.',
    image: img('photo-1562967914-608f82629710'),
    emoji: '🍗',
    prepTime: '10–15 min',
    foods: [
      {
        id: 'cr-1',
        restaurantId: 'chicken-rice',
        name: 'Fried Chicken Combo',
        price: 59000,
        description: '2 pieces of crispy chicken, rice, coleslaw and a soft drink.',
        image: img('photo-1562967914-608f82629710'),
        emoji: '🍗',
        category: 'Combos',
        popular: true,
      },
      {
        id: 'cr-2',
        restaurantId: 'chicken-rice',
        name: 'Teriyaki Chicken Bowl',
        price: 49000,
        description: 'Glazed chicken thigh, Japanese rice, sesame and pickled cucumber.',
        image: img('photo-1604908176997-125f25cc6f3d'),
        emoji: '🍱',
        category: 'Rice Bowls',
        popular: true,
      },
      {
        id: 'cr-3',
        restaurantId: 'chicken-rice',
        name: 'Chicken Caesar Salad',
        price: 42000,
        description: 'Romaine, grilled chicken, parmesan, croutons and Caesar dressing.',
        image: img('photo-1550304943-4f24f54ddde9'),
        emoji: '🥗',
        category: 'Salads',
      },
      {
        id: 'cr-4',
        restaurantId: 'chicken-rice',
        name: 'Coca-Cola',
        price: 15000,
        description: 'Chilled 330ml can.',
        image: img('photo-1554866585-cd94860890b7'),
        emoji: '🥤',
        category: 'Drinks',
      },
    ],
    reviews: [
      { author: 'Gia Huy', rating: 5, comment: 'Crispiest chicken on campus.', date: '1 day ago' },
      { author: 'Mai Phương', rating: 4, comment: 'Teriyaki bowl is my go-to for late lunch.', date: '1 week ago' },
    ],
  },
  {
    id: 'coffee-corner',
    name: 'Coffee Corner',
    category: 'Coffee · Bakery',
    tags: ['drinks'],
    rating: 4.9,
    ratingCount: 1510,
    hours: '07:00 – 18:00',
    location: 'Lobby – Building A',
    description: 'Vietnamese coffee, matcha and fresh pastries to power your day.',
    image: img('photo-1495474472287-4d71bcdd2085'),
    emoji: '☕',
    prepTime: '3–5 min',
    foods: [
      {
        id: 'cc-1',
        restaurantId: 'coffee-corner',
        name: 'Cà Phê Sữa Đá',
        price: 25000,
        description: 'Robusta drip coffee with condensed milk over ice.',
        image: img('photo-1509042239860-f550ce710b93'),
        emoji: '☕',
        category: 'Coffee',
        popular: true,
      },
      {
        id: 'cc-2',
        restaurantId: 'coffee-corner',
        name: 'Bạc Xỉu',
        price: 29000,
        description: 'Milk-forward Saigon-style coffee, sweet and smooth.',
        image: img('photo-1461023058943-07fcbe16d735'),
        emoji: '🥛',
        category: 'Coffee',
        popular: true,
      },
      {
        id: 'cc-3',
        restaurantId: 'coffee-corner',
        name: 'Matcha Latte',
        price: 39000,
        description: 'Ceremonial-grade matcha with fresh milk.',
        image: img('photo-1515823064-d6e0c04616a7'),
        emoji: '🍵',
        category: 'Tea',
        popular: true,
      },
      {
        id: 'cc-4',
        restaurantId: 'coffee-corner',
        name: 'Butter Croissant',
        price: 30000,
        description: 'Flaky, buttery and baked every morning.',
        image: img('photo-1555507036-ab1f4038808a'),
        emoji: '🥐',
        category: 'Bakery',
      },
    ],
    reviews: [
      { author: 'Khánh Linh', rating: 5, comment: 'Best cà phê sữa đá in the building.', date: 'Yesterday' },
      { author: 'Trọng Nhân', rating: 5, comment: 'Order at my desk, pick up in 3 minutes. Love it.', date: '4 days ago' },
    ],
  },
]

export const findRestaurant = (id: string | null) =>
  restaurants.find((r) => r.id === id) ?? null

export const findFood = (id: string) => {
  for (const r of restaurants) {
    const food = r.foods.find((f) => f.id === id)
    if (food) return food
  }
  return null
}
