export const splashOptions = [
  { id: 'light', number: '01', name: 'Gold / Ánh sáng', duration: '1,6 giây', description: 'Logo lớn đi vào nhẹ, một dải sáng quét qua vàng rồi dừng. Gọn, sang và dễ nhận diện.', reference: 'Open — nhịp vào mềm', href: 'https://60fps.design/shots/open-splash', timing: '0–450 ms: hiện logo · 350–1.200 ms: ánh sáng · 750–1.600 ms: tên thương hiệu' },
  { id: 'turn', number: '02', name: 'Gold / Một vòng', duration: '1,8 giây', description: 'Một vòng xoay 3D duy nhất, logo chiếm phần lớn chiều ngang. Chốt mặt trước, tên đi vào từ phải.', reference: 'Not Boring — vật thể 3D', href: 'https://60fps.design/shots/not-boring-apps-splash', timing: '0–1.800 ms: xoay 360° · 900–1.800 ms: chữ vào và giảm tốc' },
  { id: 'reveal', number: '03', name: 'Gold / Hé mở', duration: '1,7 giây', description: 'Lớp che mở chéo từ gốc lên đầu cánh. Giữ hình chim rõ, họa tiết chấm lộ ra theo ánh sáng.', reference: 'Snapseed — mở qua mask', href: 'https://60fps.design/shots/snapseed-splash', timing: '0–1.100 ms: mở lớp che · 650–1.450 ms: chữ · 1.450–1.700 ms: giữ' },
  { id: 'draw', number: '04', name: 'Gold / Nét thành hình', duration: '2,0 giây', description: 'Nét mảnh phác biểu tượng, mặt vàng hiện vào sau. Một nhịp chuyển từ hình học sang chất liệu.', reference: 'ZigoPay — motion nhận diện', href: 'https://www.motioncube.agency/case-studies/zigopay-upi-app-rive-animation/', timing: '0–850 ms: nét vẽ · 650–1.250 ms: mặt vàng · 1.000–2.000 ms: chữ' },
  { id: 'macro', number: '05', name: 'Gold / Từ cận cảnh', duration: '1,6 giây', description: 'Bắt đầu gần bề mặt vàng, thu về một logo vẫn lớn. Tên thương hiệu xuất hiện khi biểu tượng ổn định.', reference: 'Peaks — lớn rồi thu về', href: 'https://60fps.design/shots/peaks-splash', timing: '0–1.050 ms: thu từ cận cảnh · 750–1.600 ms: tên và giảm tốc' },
] as const;
export type SplashOption = typeof splashOptions[number]['id'] | 'launch';
export function parseSplashOption(value?: string): SplashOption {
  return splashOptions.some(option => option.id === value) ? value as SplashOption : 'launch';
}
