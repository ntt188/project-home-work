# MyFPT Canteen – Interactive UI Prototype

🇻🇳 Tiếng Việt · [🇬🇧 English](README.EN.md)

Prototype di động có thể bấm thử của tính năng **Canteen** trong ứng dụng MyFPT: xem các quầy ăn tại site công ty, đặt món và thanh toán bằng **Gold** (ứng trước lương), **Momo** hoặc **Tài khoản ngân hàng**.

> Đây là prototype UI/UX. Toàn bộ dữ liệu, thanh toán, nạp Gold và quét QR đều là **giả lập**. Không có giao dịch tiền thật và không kết nối dịch vụ bên ngoài nào.

### Yêu cầu

- Node.js 20 trở lên (đã thử với Node 22) và npm
- Có kết nối internet để tải ảnh món ăn và font chữ. Nếu ảnh không tải được, app sẽ hiện emoji thay thế.

### Cách chạy

```bash
npm install
npm run dev
```

Mở http://localhost:5173.

- Trên trình duyệt máy tính (rộng từ 640px trở lên), app hiện trong khung điện thoại.
- Trên điện thoại, hoặc ở chế độ thiết bị (device mode) của DevTools, app hiện toàn màn hình.
- Để mở trên điện thoại thật cùng mạng Wi-Fi: chạy `npm run dev -- --host`, rồi mở địa chỉ "Network" mà Vite in ra.

Các lệnh khác:

| Lệnh              | Tác dụng                                   |
| ----------------- | ------------------------------------------ |
| `npm run build`   | Kiểm tra type và build ra thư mục `dist/`  |
| `npm run preview` | Chạy thử bản build production              |
| `npm run lint`    | Kiểm tra code bằng oxlint                  |

State chỉ lưu trong bộ nhớ, nên **tải lại trang sẽ reset toàn bộ**: Gold về 250, giỏ hàng và đơn hàng bị xoá.

### Cách sử dụng (kịch bản demo)

**1. Thanh toán bằng Gold**

1. Ở màn hình chính MyFPT, bấm **Canteen** (hoặc banner **Open Canteen**).
2. Ở Canteen Home, bạn thấy số dư Gold (**250 Gold**), các nút thao tác nhanh và danh sách nhà hàng.
3. Bấm **Canteen Food Court**, xem thông tin và đánh giá, rồi bấm **Order Now**.
4. Bấm vào một món (ví dụ **Grilled Chicken Rice**), tăng số lượng lên 2 bằng nút **+**, rồi bấm **Add to Cart**. Bạn cũng có thể bấm **+ Add** ngay trên menu.
5. Bấm thanh **View Cart** nổi ở dưới cùng. Tại đây bạn có thể đổi số lượng hoặc xoá món bằng biểu tượng thùng rác.
6. Bấm **Proceed to Payment**, chọn **Gold** (cần 90 Gold), rồi bấm **Confirm Payment**.
7. Màn hình thành công hiện mã đơn, số thứ tự và thời gian chuẩn bị. Bấm **Close**, Canteen Home sẽ hiện **160 Gold** và đơn hàng đang được chuẩn bị.

**2. Không đủ Gold → Nạp Gold**

1. Ở Canteen Home, bấm tab **Account** để mở bảng *Prototype controls*. Đặt số dư về **50 Gold**.
2. Đặt món có giá trên 50,000 VND rồi vào màn hình thanh toán.
3. Lựa chọn Gold bị khoá và hiện **Insufficient balance**. Bấm **Top Up Gold**.
4. Chọn mức nạp (app chọn sẵn mức nhỏ nhất đủ trả cho đơn), rồi bấm **Confirm Top Up**.
5. Bấm **Return to Payment**. Gold đã được mở lại và chọn sẵn, bạn xác nhận thanh toán.

**3. Thanh toán bằng Momo / Tài khoản ngân hàng**

Ở màn hình thanh toán, chọn **Momo** hoặc **Bank Account**, rồi bấm **Confirm Payment**. App mở màn hình chuyển hướng giả lập. Bấm **Confirm payment** trên màn hình giả lập đó, app sẽ quay về màn hình thành công. Gold không bị trừ.

**Các tương tác khác**

- **Scan QR** (ở Canteen Home): hiện camera giả lập, sau vài giây tự "nhận diện" mã QR và mở Canteen Food Court.
- **Top Up Gold** (nút thao tác nhanh hoặc nút trên thẻ Gold): nạp Gold bất cứ lúc nào.
- **Ô tìm kiếm và các chip danh mục**: lọc nhà hàng.
- Tab **Orders**: danh sách các đơn đã đặt trong phiên.
- Mỗi giỏ hàng chỉ chứa món của một nhà hàng. Thêm món từ nhà hàng khác sẽ tạo giỏ hàng mới.

### Cấu trúc dự án

```
src/
├── App.tsx               # Khung điện thoại + chuyển màn hình
├── store/AppContext.tsx  # State: điều hướng, Gold, giỏ hàng, thanh toán, đơn hàng
├── data/mock.ts          # Nhân viên, nhà hàng, món ăn, đánh giá
├── utils/format.ts       # Định dạng VND/Gold (1 Gold = 1,000 VND)
├── components/           # Header, GoldBalanceCard, QuickAction, RestaurantCard,
│                         # FoodCard, CartBar, BottomNavigation, Icon, ui (dùng chung)
└── screens/              # MyFPTHome, CanteenHome, RestaurantDetail, FoodMenu,
                          # FoodDetail, Cart, Payment, GoldTopUp, ExternalPayment,
                          # OrderSuccess, Orders, ScanQRModal
```

Muốn đổi nhà hàng, món ăn, giá hoặc số Gold ban đầu, bạn sửa file `src/data/mock.ts`.

Công nghệ: React 19, TypeScript, Vite, Tailwind CSS v4.
