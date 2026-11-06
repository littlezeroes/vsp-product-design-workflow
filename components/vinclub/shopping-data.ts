export const shoppingStores = [
  { id: "may", name: "Mây Studio", category: "Thời trang", floor: "Tầng 1 · Khu A", icon: "shopping", line: "Những món đồ dành cho mỗi ngày đẹp hơn." },
  { id: "lumi", name: "Lumi Beauty", category: "Làm đẹp", floor: "Tầng 1 · Khu B", icon: "medical", line: "Một chút chăm sóc. Thêm nhiều rạng rỡ." },
  { id: "pulse", name: "Pulse Lab", category: "Công nghệ", floor: "Tầng 2 · Khu C", icon: "payment", line: "Công nghệ nhỏ. Trải nghiệm lớn." },
];
export const shoppingProducts = [
  { id: "cloud", store: "may", name: "Cloud Sneakers", subtitle: "Êm nhẹ trên mọi hành trình", price: 1290000, stock: 6, image: "sneakers", sizes: ["36", "37", "38", "39", "40"], colors: ["Trắng ngà", "Xám sương"] },
  { id: "stride", store: "may", name: "Stride Sneakers", subtitle: "Tinh giản. Linh hoạt. Mỗi ngày.", price: 1590000, stock: 4, image: "sneakers", sizes: ["38", "39", "40", "41", "42"], colors: ["Trắng ngà", "Đen"] },
  { id: "dew", store: "lumi", name: "Dew Serum", subtitle: "Serum dưỡng ẩm · 30 ml", price: 690000, stock: 8, image: "serum", sizes: ["30 ml", "50 ml"], colors: ["Không hương", "Hương nhẹ"] },
  { id: "glow", store: "lumi", name: "Glow Essence", subtitle: "Tinh chất chăm sóc · 50 ml", price: 890000, stock: 5, image: "serum", sizes: ["50 ml", "75 ml"], colors: ["Không hương", "Hương nhẹ"] },
  { id: "air", store: "pulse", name: "Air Headphones", subtitle: "Âm thanh trọn vẹn. Không dây.", price: 2490000, stock: 3, image: "headphones", sizes: ["Tiêu chuẩn"], colors: ["Trắng ngà", "Xám sương"] },
  { id: "studio", store: "pulse", name: "Studio Headphones", subtitle: "Dành cho những bản nhạc yêu thích", price: 2790000, stock: 3, image: "headphones", sizes: ["Tiêu chuẩn"], colors: ["Trắng ngà", "Đen"] },
];
export type ShoppingProduct = typeof shoppingProducts[number];
export const winmartProducts: ShoppingProduct[] = [
  {id:"wm-greens",store:"winmart",name:"Giỏ rau xanh",subtitle:"Rau theo mùa · chuẩn bị cho bữa tối",price:59000,stock:12,image:"/vinclub-assets/icons/food.webp",sizes:["1 giỏ · 500 g"],colors:["Hàng tươi"]},
  {id:"wm-fruit",store:"winmart",name:"Giỏ trái cây",subtitle:"Trái cây theo mùa · dùng mỗi ngày",price:89000,stock:10,image:"/vinclub-assets/icons/food.webp",sizes:["1 giỏ · 1 kg"],colors:["Hàng tươi"]},
  {id:"wm-milk",store:"winmart",name:"Sữa tươi",subtitle:"Chuẩn bị bữa sáng cho gia đình",price:36000,stock:20,image:"/vinclub-assets/icons/food.webp",sizes:["1 hộp · 1 lít"],colors:["Không đường","Có đường"]},
  {id:"wm-eggs",store:"winmart",name:"Trứng gà",subtitle:"Một lựa chọn cho bữa ăn hàng ngày",price:42000,stock:16,image:"/vinclub-assets/icons/food.webp",sizes:["1 hộp · 10 quả"],colors:["Tiêu chuẩn"]},
];
export type ShoppingLine = { productId: string; size: string; color: string; quantity: number };
export type ShoppingAddress = { recipient: string; phone: string; address: string };
export type ShoppingOrder = { id: string; lines: ShoppingLine[]; address: ShoppingAddress; source: "wallet" | "bnpl"; months: number; subtotal: number; shipping: number; fee: number; total: number; progress: number; status: "shipping" | "delivered" };
export const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
export const SHOPPING_SESSION_KEY = "vinclub-shopping-demo-order-v1";

export const explorationLandmarks = [
  { id: "vincom", name: "Vincom Mega Mall", icon: "shopping", category: "Mua sắm & trải nghiệm", location: "Ocean Park · Hà Nội", description: "Khám phá cửa hàng, xem sản phẩm 3D và đặt giao hàng Green SM trong hành trình demo.", hours: "09:30–22:00 · lịch minh họa", choices: ["Mây Studio", "Lumi Beauty", "Pulse Lab"], action: "Khám phá Vincom" },
  { id: "winmart", name: "WinMart", icon: "food", category: "Mua sắm mỗi ngày", location: "Khu dân cư Ocean Park", description: "Chuẩn bị danh sách cho bữa ăn và nhu cầu gia đình. Danh sách được lưu trong phiên trải nghiệm; chưa đặt hàng siêu thị.", hours: "07:00–22:00 · lịch minh họa", choices: ["Thực phẩm tươi", "Đồ dùng gia đình", "Ưu đãi hội viên"], action: "Lưu danh sách mua sắm" },
  { id: "vinmec", name: "Vinmec", icon: "medical", category: "Chăm sóc sức khỏe", location: "Điểm khám minh họa · Ocean Park", description: "Chọn nhu cầu khám và ghi nhận yêu cầu tư vấn trong demo. Đây chưa phải lịch hẹn hoặc hướng dẫn y tế.", hours: "08:00–17:00 · lịch minh họa", choices: ["Khám tổng quát", "Tư vấn chuyên khoa", "Sức khỏe gia đình"], action: "Ghi nhận yêu cầu demo" },
  { id: "events", name: "Sự kiện Ocean Park", icon: "travel", category: "Những khoảnh khắc mới", location: "Quảng trường Ocean Park", description: "Khám phá những trải nghiệm cộng đồng và lưu sự kiện yêu thích. Nội dung, ngày và địa điểm đều minh họa.", hours: "Cuối tuần · lịch minh họa", choices: ["Âm nhạc cuối tuần", "Ngày hội gia đình", "Chợ phiên sáng tạo"], action: "Lưu sự kiện" },
];

export const shoppingSpecs: Record<string,string[]> = {
  sneakers: ["Lớp đế đàn hồi", "Lớp lót êm nhẹ", "Thân giày liền mạch"],
  serum: ["Nắp bảo vệ", "Đầu nhỏ giọt", "Thân chai thủy tinh"],
  headphones: ["Vòm đầu linh hoạt", "Đệm tai mềm", "Cụm loa không dây"],
};
