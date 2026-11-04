"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, Gift, Grid2X2 } from "lucide-react";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { AwardHome, CatalogHome, OfferCardsHome, StackHome, VOUCHERS } from "./ref-layouts";
import { illustrationAssets as art } from "@/app/vinclub-dualsurface/illustration-assets";

/*
 * Harness: one Home renderer, driven by data. Each approach is a different answer to "why open this app?";
 * each layout arranges the same content differently. Add an approach or layout here and the menu and QA script pick it up.
 * All figures are sample data. A real build needs VPoint value, expiry, employee list.
 */
type Item = { icon: string; title: string; meta: string; action?: string };
export type Approach = {
  id: string; name: string; why: string; refs: { app: string; url: string }[];
  eyebrow: string; title: string; sub: string; cta: string;
  widget?: "gift" | "countdown" | "barcode" | "progress" | "services" | "boost" | "scratch" | "pick" | "follow" | "draw" | "report" | "voucher" | "stack" | "catalog" | "award" | "offers";
  listTitle: string; items: Item[];
};
const m = (id: string) => `https://mobbin.com/screens/${id}`;
/* Short verdict per approach, shown beside the phone. Judgement from competitor screens, no usage data. */
export const NOTES: Record<string, { pros: string; cons: string; better: string }> = {
  stack: { pros: "Giống ví thật; khung cố định, thử được nhiều header và lý do mở app.", cons: "Phần ví là thông tin tĩnh, lý do mở app phụ thuộc khối đang chọn.", better: "Giống Y Pay về cách xếp, nhưng gom cả hạng và VPoint chứ không chỉ sản phẩm thanh toán." },
  catalog: { pros: "Dễ quét, ô lệch đỡ đều đều, banner có một việc rõ.", cons: "Vẫn thiên về listing; cần ảnh 3D riêng từng thương hiệu.", better: "Rõ thương hiệu hơn trang gốc nhờ lọc theo hạng và nhân viên tập đoàn." },
  award: { pros: "Cảm xúc mạnh nhất, dễ chia sẻ, làm huy hiệu có giá trị.", cons: "Chỉ dùng được lúc vừa đạt, không làm Home thường ngày được.", better: "Gắn với thưởng VPoint thật, không chỉ là huy hiệu để khoe." },
  offers: { pros: "Một thẻ một lời đề nghị, rất rõ, số % nổi.", cons: "Thẻ cao nên ít nội dung trên một màn; toàn quảng cáo nếu không cá nhân hóa.", better: "Màu nút và nhãn theo thương hiệu nên nhận ra hệ sinh thái ngay." },
  voucher: { pros: "Một màn thấy cả hệ sinh thái; mỗi thương hiệu một màu, số % đọc lướt là hiểu; có lý do quay lại mỗi tháng.", cons: "Cần các thương hiệu góp ngân sách; nhịp tháng nên cần thêm hook hằng ngày.", better: "Yandex làm trong app thanh toán; VinClub gắn thêm được hạng và VPoint, và trải rộng cả y tế, giáo dục, nghỉ dưỡng." },
  scratch: { pros: "Có lý do mở mỗi ngày, vui, dễ hiểu.", cons: "Tốn ngân sách quà; quà nhỏ là chán; có thể cần thủ tục khuyến mại.", better: "Hơn Google Pay ở chỗ quà dùng ngay được trong hệ sinh thái Vin." },
  pick: { pros: "User tự chọn nên thấy là của mình; có nhịp hằng tuần.", cons: "Phải có đủ ưu đãi mới mỗi tuần; thêm một bước chọn.", better: "Hơn Cash App ở độ đa dạng: chọn xuyên nhiều ngành." },
  rate: { pros: "Rõ lợi ích, gấp, dễ đo hiệu quả.", cons: "Dùng nhiều thì hết tin; hút người săn deal.", better: "Hơn Rakuten ở chỗ dùng được cả tại cửa hàng Vin, không chỉ online." },
  follow: { pros: "User tự nói mình thích gì; thông báo đúng nhu cầu hơn.", cons: "Không tự kéo người mở app nếu tắt thông báo; khó thấy ngay giá trị.", better: "Hơn ShopBack ở chỗ thương hiệu cùng hệ sinh thái nên cá nhân hóa sâu được." },
  draw: { pros: "Giải lớn tạo chuyện để kể; tiêu bớt VPoint tồn.", cons: "Tỷ lệ trúng thấp dễ thất vọng; thủ tục pháp lý nặng nhất.", better: "Hơn Sweatcoin ở giải: kỳ nghỉ, xe là sản phẩm thật của tập đoàn." },
  report: { pros: "Chứng minh app đáng giữ; tạo niềm tin.", cons: "Chỉ mở mỗi tháng; user mới chưa có gì để xem.", better: "Hơn Neo ở chỗ gộp được tiền tiết kiệm từ nhiều dịch vụ." },
  value: { pros: "Con số tiền thật, hút ngay.", cons: "Dùng hết là hết lý do; cần tỷ giá VPoint.", better: "Hơn Everyday Rewards ở chỗ gộp nhiều thương hiệu thành một con số." },
  expiry: { pros: "Sợ mất rất mạnh, đẩy dùng ngay.", cons: "Chỉ hiện khi có đồ sắp hết hạn; lặp lại dễ phiền.", better: "Hơn talabat ở chỗ có đồng hồ và dùng ngay trên Home." },
  gift: { pros: "Đơn giản, thành thói quen.", cons: "Không hồi hộp bằng thẻ cào; dễ mở xong thoát.", better: "Hơn Shopee ở chỗ nhẹ, không lẫn giữa quảng cáo." },
  boost: { pros: "Một chạm là được thêm; có nhịp hằng tuần.", cons: "User có thể quên mua sau khi kích hoạt.", better: "Hơn Everyday Rewards ở chỗ kích hoạt được xuyên nhiều ngành." },
  perk: { pros: "Làm hạng có giá trị thật, tạo cảm giác được ưu tiên.", cons: "Không thay đổi hằng ngày; hạng thấp ít thấy lợi ích.", better: "Hơn Yami ở chỗ quyền lợi là dịch vụ thật của tập đoàn." },
  staff: { pros: "Lợi thế riêng, kích hoạt nhanh một nhóm lớn.", cons: "Chỉ dành cho nhân viên; xác minh một lần là hết hook.", better: "Không thấy đối thủ nào có; đây là điểm riêng của VinClub." },
  card: { pros: "Tiện thật ở quầy; có lý do mở lúc mua hàng.", cons: "Chỉ khi ra cửa hàng; không có cảm xúc.", better: "Hơn Setel ở chỗ quét được ở nhiều ngành." },
  progress: { pros: "Càng gần càng muốn đạt.", cons: "Xa đích thì nản; đòi hỏi tiêu tiền trước.", better: "Hơn Blackbird nếu nói bằng quyền lợi, không chỉ bằng số." },
  super: { pros: "Quen thuộc, đi thẳng vào dịch vụ, ưu đãi nằm đúng chỗ.", cons: "Thành danh mục; user đã có app riêng từng dịch vụ.", better: "Hơn Gojek ở chỗ có hạng và VPoint chung, nhưng thua về tần suất gọi xe, đặt món." },
  plan: { pros: "Cấu trúc rõ: hạng, sản phẩm, lên hạng, gợi ý.", cons: "Vẫn thiếu lý do mở mỗi ngày.", better: "Gọn hơn Qantas, nhưng chưa có hook mạnh như Shopee." },
};
export const LAYOUTS = ["Khối da", "Chữ lớn", "Thẻ kim loại", "Bento"];
const VOUCHER_LIMIT = 3;
export const APPROACHES: Approach[] = [
  { id: "voucher", name: "Voucher hệ sinh thái", why: "Tháng này tôi chọn thương hiệu nào", refs: [{ app: "Yandex Pay", url: "https://i.pinimg.com/736x/01/6c/06/016c067df05f4fdc5f5611aeae739122.jpg" }],
    eyebrow: "Tháng 11", title: "Chọn 3 voucher của bạn", sub: "Tháng sau chọn lại", cta: "Lưu lựa chọn", widget: "voucher", listTitle: "", items: [] },
  { id: "stack", name: "Thẻ xếp chồng", why: "Mở ra là thấy tôi có gì", refs: [{ app: "Ảnh mày gửi", url: "https://i.pinimg.com/1200x/7e/d8/20/7ed82083172d84a70d17d729b8694fa2.jpg" }], eyebrow: "", title: "", sub: "", cta: "", widget: "stack", listTitle: "", items: [] },
  { id: "catalog", name: "Danh mục lệch ô", why: "Vào xem hôm nay có gì", refs: [{ app: "Ảnh mày gửi", url: "https://i.pinimg.com/1200x/7e/d8/20/7ed82083172d84a70d17d729b8694fa2.jpg" }], eyebrow: "", title: "", sub: "", cta: "", widget: "catalog", listTitle: "", items: [] },
  { id: "award", name: "Huy hiệu toàn màn", why: "Tôi vừa đạt được thứ gì đó", refs: [{ app: "Ảnh mày gửi", url: "https://i.pinimg.com/1200x/7e/d8/20/7ed82083172d84a70d17d729b8694fa2.jpg" }], eyebrow: "", title: "", sub: "", cta: "", widget: "award", listTitle: "", items: [] },
  { id: "offers", name: "Thẻ catalog", why: "Một lời đề nghị rõ ràng", refs: [{ app: "Ảnh mày gửi", url: "https://i.pinimg.com/1200x/7e/d8/20/7ed82083172d84a70d17d729b8694fa2.jpg" }], eyebrow: "", title: "", sub: "", cta: "", widget: "offers", listTitle: "", items: [] },
  { id: "scratch", name: "Thẻ cào mỗi ngày", why: "Hôm nay tôi trúng gì", refs: [{ app: "Google Pay", url: m("1d658fff-55ed-4f08-a92c-7d59da2ad201") }, { app: "Swiggy", url: m("3f88b5ed-7117-4ee2-9a31-81f37a6790f3") }],
    eyebrow: "Cào để nhận thưởng", title: "Bạn có 1 phần quà chưa mở", sub: "Mỗi ngày một cơ hội nhận VPoint hoặc voucher", cta: "Cào ngay", widget: "scratch", listTitle: "Đã trúng gần đây",
    items: [{ icon: "grocery", title: "Voucher 30.000đ WinMart", meta: "Hôm qua · Còn 6 ngày", action: "Dùng" }, { icon: "shopping", title: "50 VPoint", meta: "2 ngày trước · Đã cộng", action: "Xem" }, { icon: "car", title: "Giảm 20.000đ GreenSM", meta: "3 ngày trước · Còn 4 ngày", action: "Dùng" }] },
  { id: "pick", name: "Chọn ưu đãi tuần", why: "Tuần này tôi chọn gì", refs: [{ app: "Cash App", url: m("9e309d99-2876-465f-9d66-d1245af5a1b7") }, { app: "Google Pay", url: m("3346fee5-fb96-40db-afdb-cc381bfff405") }],
    eyebrow: "Tuần này · Còn 4 ngày", title: "Chọn 3 ưu đãi của bạn", sub: "Tuần sau sẽ đổi ưu đãi khác", cta: "Xác nhận lựa chọn", widget: "pick", listTitle: "Ưu đãi tuần này",
    items: [{ icon: "grocery", title: "Giảm 10% tại WinMart", meta: "Tối đa 100.000đ", action: "Chọn" }, { icon: "car", title: "Hoàn 15% GreenSM", meta: "Tối đa 50.000đ", action: "Chọn" }, { icon: "shopping", title: "x3 VPoint tại Vincom", meta: "Cả tuần", action: "Chọn" }, { icon: "medical", title: "Giảm 20% gói khám", meta: "Vinmec", action: "Chọn" }, { icon: "hotel", title: "Giảm 15% phòng nghỉ", meta: "Vinpearl", action: "Chọn" }] },
  { id: "rate", name: "Giá tăng có giờ", why: "Hết hôm nay là mất", refs: [{ app: "Rakuten", url: m("98aeec60-af71-49bb-a03c-b92d37c6b4a9") }, { app: "ShopBack", url: m("8eed20a0-45bc-4745-8093-49dd3768f02e") }],
    eyebrow: "Chỉ hôm nay", title: "x5 VPoint tại WinMart, thường chỉ x1", sub: "Áp dụng mọi hóa đơn", cta: "Xem cửa hàng", widget: "countdown", listTitle: "Đang tăng",
    items: [{ icon: "shopping", title: "x3 VPoint, thường x1", meta: "Vincom · Còn 1 ngày", action: "Xem" }, { icon: "car", title: "Hoàn 15%, thường 5%", meta: "GreenSM · Còn 2 ngày", action: "Xem" }, { icon: "medical", title: "Giảm 25%, thường 10%", meta: "Vinmec · Còn 3 ngày", action: "Xem" }] },
  { id: "follow", name: "Theo dõi thương hiệu", why: "Báo tôi khi có deal", refs: [{ app: "ShopBack", url: m("8eed20a0-45bc-4745-8093-49dd3768f02e") }],
    eyebrow: "Deal của bạn", title: "WinMart vừa có deal mới", sub: "Vì bạn đang theo dõi WinMart", cta: "Xem deal", widget: "follow", listTitle: "Theo dõi để được báo trước",
    items: [{ icon: "grocery", title: "WinMart", meta: "Vừa có deal mới", action: "Theo dõi" }, { icon: "shopping", title: "Vincom", meta: "Deal gần nhất 3 ngày trước", action: "Theo dõi" }, { icon: "hotel", title: "Vinpearl", meta: "Deal gần nhất tuần trước", action: "Theo dõi" }] },
  { id: "draw", name: "Rút thăm giải lớn", why: "Biết đâu tôi trúng", refs: [{ app: "Sweatcoin", url: m("3182797a-533d-4474-b7c6-724ee93b7743") }, { app: "Lloyds", url: m("ead73f45-edb9-4077-a56a-b8f0996b43a7") }],
    eyebrow: "Quay số cuối tháng", title: "Kỳ nghỉ Vinpearl 3 ngày cho 2 người", sub: "Giải thưởng mẫu · Mỗi lượt 500 VPoint", cta: "Đổi 1 lượt", widget: "draw", listTitle: "Thêm lượt miễn phí",
    items: [{ icon: "grocery", title: "Dùng 1 voucher WinMart", meta: "+1 lượt", action: "Dùng" }, { icon: "car", title: "Đi 3 chuyến GreenSM", meta: "+1 lượt", action: "Đi" }, { icon: "shopping", title: "Mời đồng nghiệp", meta: "+2 lượt", action: "Mời" }] },
  { id: "report", name: "Báo cáo tiết kiệm", why: "App này đáng giữ", refs: [{ app: "Neo Financial", url: m("0d49f4d9-c45b-4ab9-b065-39c38af95b51") }],
    eyebrow: "Tháng 10 của bạn", title: "Bạn đã tiết kiệm 420.000đ", sub: "Nhiều hơn tháng trước 80.000đ", cta: "Xem chi tiết", widget: "report", listTitle: "Tiết kiệm nhiều nhất ở",
    items: [{ icon: "grocery", title: "WinMart", meta: "6 lần dùng · 210.000đ", action: "Xem" }, { icon: "car", title: "GreenSM", meta: "9 chuyến · 130.000đ", action: "Xem" }, { icon: "medical", title: "Vinmec", meta: "1 lần · 80.000đ", action: "Xem" }] },
  { id: "value", name: "Tiền chưa dùng", why: "Tôi đang có sẵn tiền ở đây", refs: [{ app: "Everyday Rewards", url: m("36d7db5b-4f52-4b40-93f4-fd84b603173c") }, { app: "talabat", url: m("16b0759b-b3ab-4b0d-a782-a7386a1589f0") }],
    eyebrow: "Đang chờ bạn", title: "850.000đ quyền lợi chưa dùng", sub: "Gồm voucher và VPoint đổi được", cta: "Dùng ngay", listTitle: "Bạn đang có",
    items: [{ icon: "grocery", title: "Voucher giảm 100.000đ", meta: "WinMart · Còn 2 ngày", action: "Dùng" }, { icon: "hotel", title: "Giảm 300.000đ phòng nghỉ", meta: "Vinpearl · Đến 30/11", action: "Dùng" }, { icon: "shopping", title: "12.450 VPoint đổi được 450.000đ", meta: "Dùng tại Vincom, WinMart", action: "Đổi" }] },
  { id: "expiry", name: "Sắp mất", why: "Tôi sắp mất thứ của mình", refs: [{ app: "talabat", url: m("16b0759b-b3ab-4b0d-a782-a7386a1589f0") }],
    eyebrow: "Sắp hết hạn", title: "120.000đ sẽ mất sau 2 ngày", sub: "Dùng trước 03/11 để không mất", cta: "Dùng trước khi hết", widget: "countdown", listTitle: "Hết hạn sớm nhất",
    items: [{ icon: "grocery", title: "Voucher giảm 100.000đ", meta: "WinMart · Còn 2 ngày", action: "Dùng" }, { icon: "shopping", title: "2.000 VPoint hết hạn", meta: "Cuối tháng 11", action: "Đổi" }, { icon: "hotel", title: "Giảm 15% phòng nghỉ", meta: "Vinpearl · Còn 12 ngày", action: "Dùng" }] },
  { id: "gift", name: "Quà hôm nay", why: "Hôm nay có gì bất ngờ", refs: [{ app: "Shopee", url: m("9593fc91-f7ed-4591-980a-6788579c77cc") }, { app: "Sweatcoin", url: m("1ba63c80-dade-48b3-9c86-a3445cd42d0b") }],
    eyebrow: "Quà hôm nay", title: "Hộp quà của bạn đã sẵn sàng", sub: "Mở mỗi ngày, ngày thứ 7 nhận quà lớn", cta: "Mở quà", widget: "gift", listTitle: "Kiếm thêm hôm nay",
    items: [{ icon: "car", title: "Đi 1 chuyến GreenSM", meta: "+50 VPoint", action: "Đi" }, { icon: "grocery", title: "Dùng voucher WinMart", meta: "Nhân đôi VPoint", action: "Dùng" }, { icon: "shopping", title: "Mời đồng nghiệp", meta: "+500 VPoint", action: "Mời" }] },
  { id: "boost", name: "Kích hoạt ưu đãi", why: "Bấm một cái là được thêm", refs: [{ app: "Everyday Rewards", url: m("36d7db5b-4f52-4b40-93f4-fd84b603173c") }, { app: "Woolworths", url: m("1905f118-d4d9-41ec-9a99-2cf9daa7379b") }],
    eyebrow: "Tuần này", title: "3 ưu đãi đang chờ bạn kích hoạt", sub: "Kích hoạt trước khi mua để được cộng", cta: "Kích hoạt tất cả", widget: "boost", listTitle: "Ưu đãi của tuần",
    items: [{ icon: "grocery", title: "x5 VPoint tại WinMart", meta: "Hết Chủ Nhật", action: "Kích hoạt" }, { icon: "shopping", title: "x2 VPoint tại Vincom", meta: "Hết tuần này", action: "Kích hoạt" }, { icon: "car", title: "Hoàn 20.000đ GreenSM", meta: "1 chuyến", action: "Kích hoạt" }] },
  { id: "perk", name: "Đặc quyền hạng", why: "Chỉ hạng của tôi mới có", refs: [{ app: "Yami", url: m("05993baa-605a-4062-9c91-4f773b6ce092") }, { app: "Shell", url: m("f2c99933-8eff-4348-b5f9-0c7a2a7e851f") }],
    eyebrow: "Dành riêng hạng Vàng", title: "Giảm 15% phòng nghỉ, hạng khác không có", sub: "Vinpearl · Áp dụng đến 30/11", cta: "Dùng quyền lợi", listTitle: "Quyền lợi hạng Vàng",
    items: [{ icon: "hotel", title: "Giảm 15% phòng nghỉ", meta: "Vinpearl · Đến 30/11", action: "Dùng" }, { icon: "shopping", title: "x1,5 VPoint mọi giao dịch", meta: "Tự động áp dụng", action: "Xem" }, { icon: "medical", title: "Giảm 20% gói khám", meta: "Vinmec · Hết tháng 11", action: "Dùng" }] },
  { id: "staff", name: "Nhân viên tập đoàn", why: "Tôi có sẵn quyền lợi riêng", refs: [{ app: "Target Circle", url: m("fe769e66-70e5-4ee3-a7e5-136e1f615040") }],
    eyebrow: "Nhân viên tập đoàn", title: "Bạn có thể đang có sẵn hạng nhân viên", sub: "Xác minh một lần để nhận quyền lợi", cta: "Xác minh", listTitle: "Quyền lợi nhân viên",
    items: [{ icon: "medical", title: "Giảm gói khám Vinmec", meta: "Áp dụng cho gia đình", action: "Xem" }, { icon: "school", title: "Ưu đãi học phí Vinschool", meta: "Theo chính sách mẫu", action: "Xem" }, { icon: "hotel", title: "Giá riêng Vinpearl", meta: "Quanh năm", action: "Xem" }] },
  { id: "card", name: "Thẻ tại quầy", why: "Tôi đang đứng ở quầy", refs: [{ app: "Setel", url: m("25f69654-dc9a-4d11-b5b5-ee57def75b64") }, { app: "Starbucks", url: m("0320a019-4821-47a5-9dd4-fef9c4e1748c") }],
    eyebrow: "Thẻ hội viên", title: "Đưa mã để tích VPoint", sub: "Dùng tại Vincom, WinMart, Vinmec", cta: "Phóng to mã", widget: "barcode", listTitle: "Áp dụng khi quét mã",
    items: [{ icon: "grocery", title: "Voucher giảm 100.000đ", meta: "WinMart · Tự áp dụng khi quét", action: "Xem" }, { icon: "shopping", title: "x2 VPoint", meta: "Vincom · Hết tuần này", action: "Xem" }, { icon: "medical", title: "Giảm 20% gói khám", meta: "Vinmec", action: "Xem" }] },
  { id: "progress", name: "Vòng tiến độ", why: "Tôi sắp đạt được", refs: [{ app: "Blackbird", url: m("87e0f308-30cb-41f6-be52-b3c0c82db230") }, { app: "Qantas", url: m("3685ad75-41b1-4520-9114-5d48576fa905") }],
    eyebrow: "Sắp mở quyền lợi", title: "Thêm 550 VPoint, bạn được giảm 20% phòng nghỉ", sub: "Đã đạt 96% để lên Bạch Kim", cta: "Xem cách đạt", widget: "progress", listTitle: "Việc gần đạt nhất",
    items: [{ icon: "grocery", title: "Dùng 1 voucher WinMart", meta: "Còn thiếu 1 lần", action: "Dùng" }, { icon: "shopping", title: "Mua sắm tại Vincom", meta: "Đủ để lên Bạch Kim", action: "Xem" }, { icon: "car", title: "Đi 3 chuyến GreenSM", meta: "Đã đi 2/3", action: "Đi" }] },
  { id: "super", name: "Siêu ứng dụng", why: "Tôi cần dùng dịch vụ", refs: [{ app: "Gojek", url: m("a74293bd-f572-4c6a-a3dc-4d2d826efb63") }, { app: "Grab", url: m("5913ee73-d562-4dbf-aaeb-15dc9d123e7f") }],
    eyebrow: "Ưu đãi của bạn", title: "Voucher 100.000đ tại WinMart", sub: "Ưu đãi nằm ngay trên từng dịch vụ", cta: "Dùng ngay", widget: "services", listTitle: "Dành cho bạn",
    items: [{ icon: "hotel", title: "Giảm 15% phòng nghỉ", meta: "Vinpearl · Còn 30 ngày", action: "Xem" }, { icon: "shopping", title: "Nhân đôi VPoint", meta: "Vincom · Hết tuần này", action: "Xem" }, { icon: "medical", title: "Giảm 20% gói khám", meta: "Vinmec", action: "Xem" }] },
];

const SERVICES = [{ n: "GreenSM", i: "car", b: "-20k" }, { n: "Vinmec", i: "medical" }, { n: "Vinschool", i: "school" }, { n: "Vinpearl", i: "hotel", b: "-15%" }, { n: "VinWonders", i: "travel", b: "-10%" }, { n: "Vincom", i: "shopping", b: "x2" }, { n: "WinMart", i: "grocery", b: "-100k" }, { n: "Tất cả", i: "" }];

function Countdown() {
  const [left, setLeft] = useState(47 * 3600 + 14 * 60 + 33);
  useEffect(() => { const timer = setInterval(() => setLeft(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, []);
  return <span className="vh-clock" role="timer" aria-label="Thời gian còn lại">{[Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map((value, index) => <i key={index}>{String(value).padStart(2, "0")}</i>)}</span>;
}
function Widget({ a, opened }: { a: Approach; opened: boolean }) {
  if (a.widget === "countdown") return <Countdown />;
  if (a.widget === "progress") return <i className="vh-progress" aria-hidden><i /></i>;
  if (a.widget === "barcode") return <span className="vh-code" role="img" aria-label="Mã thành viên mẫu"><i /><small>9704 1234 5678</small></span>;
  if (a.widget === "scratch") return <span className="vh-scratch" data-open={opened || undefined} aria-hidden>{opened ? <b>30.000đ</b> : <i>Cào tại đây</i>}</span>;
  if (a.widget === "draw") return <span className="vh-entries"><b>{opened ? 4 : 3}</b> lượt của bạn · Quay sau 29 ngày</span>;
  if (a.widget === "report") return <span className="vh-bars" aria-hidden>{[40, 55, 35, 62, 68, 100].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</span>;
  if (a.widget === "gift") return <span className="vh-gift" data-open={opened || undefined} aria-hidden>{opened ? <b>+50</b> : <Gift size={44} strokeWidth={1.3} />}</span>;
  return null;
}
const Services = () => <section className="vh-services" aria-label="Dịch vụ">{SERVICES.map(item => <button type="button" key={item.n}>{item.b && <i>{item.b}</i>}{item.i ? <DailyIcon name={item.i} size={44} /> : <Grid2X2 size={28} strokeWidth={1.4} />}<small>{item.n}</small></button>)}</section>;

export function HookHome({ a, layout, tier, onPay, onMember, opts, onOption }: { a: Approach; layout: number; tier: string; onPay: () => void; onMember?: () => void; opts?: Record<string, number>; onOption?: (key: string, value: number) => void }) {
  const [opened, setOpened] = useState(false);
  const [on, setOn] = useState<string[]>([]);
  const gift = a.widget === "gift" && opened;
  const won = a.widget === "scratch" && opened;
  const title = gift ? "Bạn nhận được 50 VPoint" : won ? "Bạn trúng voucher WinMart" : a.title;
  const pickFull = a.widget === "pick" && on.length === 3;
  const allOn = a.widget === "boost" && on.length === a.items.length;
  const run = () => { if (a.widget === "gift" || a.widget === "scratch" || a.widget === "draw") setOpened(true); if (a.widget === "boost") setOn(a.items.map(item => item.title)); };
  if (a.widget === "stack") return <StackHome tier={tier} onPay={onPay} onMember={onMember} opts={opts} onOption={onOption} />;
  if (a.widget === "catalog") return <CatalogHome tier={tier} onPay={onPay} onMember={onMember} />;
  if (a.widget === "award") return <AwardHome tier={tier} onPay={onPay} onMember={onMember} />;
  if (a.widget === "offers") return <OfferCardsHome tier={tier} onPay={onPay} onMember={onMember} />;
  if (a.widget === "voucher") {
    const saved = opened && on.length === VOUCHER_LIMIT;
    return <div className="vh-home vh-v" data-layout={layout} data-approach={a.id}>
      <div className="vh-status"><button type="button" onClick={onMember}><small>Hạng {tier}</small><strong>12.450 VPoint</strong></button><button type="button" aria-label="Mở ví VinClub" onClick={onPay}><small>Ví VinClub</small><strong>28.650.000 ₫</strong></button></div>
      <header className="vh-v-head"><small>{a.eyebrow} · {a.sub}</small><h2>{saved ? "Đã lưu voucher tháng này" : a.title}</h2></header>
      <section className="vh-v-grid" aria-label="Voucher theo thương hiệu">{VOUCHERS.map(item => { const active = on.includes(item.brand); return <button type="button" key={item.brand} aria-pressed={active} style={{ "--brand-tone": item.color } as React.CSSProperties} onClick={() => { setOpened(false); setOn(list => active ? list.filter(value => value !== item.brand) : list.length >= VOUCHER_LIMIT ? list : [...list, item.brand]); }}><strong>{item.brand}</strong><i className="vh-v-check" aria-hidden>{active && <Check size={16} strokeWidth={3} />}</i><span><small>{item.lead}</small><b>{item.value}</b><small>{item.note}</small></span><span className="vh-v-art"><DailyIcon name={item.icon} size={84} /></span></button>; })}</section>
      <div className="vh-v-save"><button type="button" className="vh-cta" disabled={on.length !== VOUCHER_LIMIT || saved} onClick={() => setOpened(true)}>{saved ? "Đã lưu" : `Đã chọn ${on.length} trên ${VOUCHER_LIMIT}`}</button></div>
    </div>;
  }
  const status = <div className="vh-status"><button type="button" onClick={onMember}><small>Hạng {tier}</small><strong>{gift ? "12.500" : "12.450"} VPoint</strong></button><button type="button" aria-label="Mở ví VinClub" onClick={onPay}><small>Ví VinClub</small><strong>28.650.000 ₫</strong></button></div>;
  const hook = <div className="vh-hook"><small>{a.eyebrow}</small><h2>{title}</h2><p>{gift ? "Quay lại ngày mai để mở hộp mới" : won ? "Mai quay lại cào thẻ mới" : a.widget === "pick" ? `Đã chọn ${on.length}/3 · ${a.sub}` : a.sub}</p><Widget a={a} opened={opened} /><button type="button" className="vh-cta" disabled={gift || won || allOn || (a.widget === "pick" && !pickFull) || (a.widget === "draw" && opened)} onClick={run}>{gift || won ? "Đã nhận" : allOn ? "Đã kích hoạt" : a.widget === "draw" && opened ? "Đã đổi lượt" : a.cta}</button></div>;
  const toggles = a.widget === "boost" || a.widget === "pick" || a.widget === "follow";
  const action = (item: Item) => {
    const active = on.includes(item.title);
    const label = active ? { boost: "Đã bật", pick: "Đã chọn", follow: "Đang theo dõi" }[a.widget as "boost" | "pick" | "follow"] : item.action;
    return <b data-on={active || undefined} onClick={toggles ? event => { event.stopPropagation(); setOn(list => active ? list.filter(value => value !== item.title) : a.widget === "pick" && list.length >= 3 ? list : [...list, item.title]); } : undefined}>{label}</b>;
  };
  const list = layout === 3
    ? <div className="vh-rail">{a.items.map(item => <button type="button" key={item.title}><DailyIcon name={item.icon} size={40} /><strong>{item.title}</strong><em>{item.meta}</em>{action(item)}</button>)}</div>
    : layout === 4
      ? <div className="vh-tiles">{a.items.map(item => <button type="button" key={item.title}><DailyIcon name={item.icon} size={40} /><strong>{item.title}</strong><em>{item.meta}</em>{toggles && action(item)}</button>)}</div>
      : <div className="vh-rows">{a.items.map(item => <button type="button" key={item.title}><DailyIcon name={item.icon} size={40} /><span><strong>{item.title}</strong><em>{item.meta}</em></span>{action(item)}<ChevronRight size={16} /></button>)}</div>;
  return <div className="vh-home" data-layout={layout} data-approach={a.id}>
    {a.widget === "services" && <Services />}
    <section className="vh-hero" aria-label="Hôm nay của bạn" key={a.id}>{layout === 2 ? <>{hook}{status}</> : <>{status}{hook}</>}</section>
    <section className="vh-list" aria-label={a.listTitle}><h2>{a.listTitle}</h2>{list}</section>
    <section className="vh-more" aria-label="Dành cho bạn"><h2>Dành cho bạn</h2><div>{[{ s: art.escape, t: "Giảm 15% phòng nghỉ", m: "Vinpearl · Ưu đãi" }, { s: art.shopping, t: "Nhân đôi VPoint", m: "Vincom · Ưu đãi" }, { s: art.food, t: "Tin mẫu về quyền lợi", m: "VinClub · Tin mới" }].map(item => <button type="button" key={item.t}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.s} alt="" /><strong>{item.t}</strong><em>{item.m}</em></button>)}</div></section>
  </div>;
}
export const FIXED_LAYOUT = new Set(["stack", "catalog", "award", "offers"]);
