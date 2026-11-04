/** Only the wallet material and daily-gift surface change; the Home canvas stays saved. */
export const HOME_DIRECTIONS = [
  { id: 1, name: "Da đen · Giấy sữa", note: "Da hạt đen mịn, giấy sữa lì, viền mảnh và bạc satin.", skin: "matte" },
  { id: 2, name: "Da đen · Trắng tinh", note: "Da đen ít phản sáng; card trắng sạch và lớp bạc mịn.", skin: "matte" },
  { id: 3, name: "Titan · Kính khói", note: "Titan xước mịn; card graphite với mép sáng rất nhẹ.", skin: "titan" },
  { id: 4, name: "Carbon · Giấy champagne", note: "Giữ Carbon; card giấy champagne và bề mặt bạc dịu.", skin: "carbon" },
  { id: 5, name: "Da đen · Opal sage", note: "Da đen mịn; card opal sage nhẹ, không chấm bi.", skin: "matte" },
  { id: 6, name: "Titan · Bạc băng", note: "Titan xước; card trắng bạc hơi xanh, viền lạnh tinh gọn.", skin: "titan" },
  { id: 7, name: "Sơn mài · Giấy đào", note: "Sơn mài đen bóng; card giấy đào phấn rất nhẹ.", skin: "piano" },
  { id: 8, name: "Sơn mài · Graphite", note: "Sơn mài đen; card graphite nhấn cạnh champagne.", skin: "piano" },
  { id: 9, name: "Titan · Opal ngọc trai", note: "Titan mịn; card opal tím xanh nhẹ, điểm sáng mềm.", skin: "titan" },
  { id: 10, name: "Da đen · Bạc trắng", note: "Da đen, giấy trắng xám, không thêm màu trang trí.", skin: "matte" },
] as const;
export const SAVED_HOME_PICKS = { mode: "light", skin: 2, hook: 1, style: 2, pos: 1, giftCount: 2, giftTone: 6, direction: 0 };
