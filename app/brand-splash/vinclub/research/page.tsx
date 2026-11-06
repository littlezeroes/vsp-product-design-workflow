import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { FixedBottom } from '@/components/ui/fixed-bottom';

export const metadata: Metadata = { title: 'VinClub · Ánh sáng vàng và splash motion' };
const sources = [
  { title: 'Uber / Video từ studio', src: '/brand-splash/research/uber-studio.mp4', href: 'https://violetoffice.com/work/uber', credit: 'Violet Office · case study rebrand 2018', observation: 'Nguồn từ studio làm bộ motion cùng đội Uber. Hai vạch dọc phát triển từ nhận diện rồi mở ra để lộ nội dung. Video có cả thao tác mở app từ màn hình điện thoại.' },
  { title: 'Uber / Bản ghi app', src: '/brand-splash/research/uber-recording.mp4', href: 'https://60fps.design/shots/uber-splash', credit: '60fps · bản ghi tham khảo, không xác định phiên bản app', observation: 'Ở khoảng 700–900 ms của đoạn ghi, vùng Home mở ngang từ tâm. Hai vạch sáng tách về hai bên; lớp tối rời đi. Không có một lần phóng texture rồi đóng vòng tròn.' },
  { title: 'Uber One / Bản ghi app', src: '/brand-splash/research/uber-one-recording.mp4', href: 'https://60fps.design/shots/uber-one-splash', credit: '60fps · một biến thể splash khác', observation: 'Logo vàng xuất hiện trên nền tối. Nội dung Home đi lên; lớp tối rời lên trên, có sự chồng thời gian giữa logo và màn mới. Không nên gộp bản này với cơ chế hai vạch của Uber.' },
];
export default function ResearchPage() {
  return <main className="min-h-dvh bg-background text-foreground">
    <Header variant="large-title" largeTitle="VinClub / Gold lighting study" />
    <section className="px-[22px] pt-[24px] pb-[12px]" id="light">
      <h1 className="text-[24px] font-semibold leading-[32px]">Logo lớn ngay từ đầu. Ánh sáng chạy trên vàng.</h1>
      <p className="mt-[12px] max-w-[950px] text-[16px] leading-[24px] text-foreground-secondary">Hướng thử mới giữ nguyên silhouette và họa tiết chấm VinClub. Logo có kích thước lớn ngay trong lúc xoay; mặt vàng mịn hơn, dải sáng hẹp di chuyển qua bề mặt, viền và các chấm bắt sáng theo góc nhìn. Cụm VINCLUB / by / VSP giữ ở dưới.</p>
      <div className="mt-[24px] grid grid-cols-1 gap-[24px] md:grid-cols-2">
        <div className="rounded-28 bg-secondary p-[12px]">
          <h2 className="text-[16px] font-semibold">Video thử vật liệu và ánh sáng mới</h2>
          <video src="/brand-splash/vinclub-gold-shimmer.mp4" controls playsInline muted preload="metadata" className="mt-[12px] aspect-square w-full rounded-14 object-contain" aria-label="VinClub vàng bóng xoay dưới dải sáng di chuyển" />
          <p className="mt-[12px] text-[13px] text-foreground-secondary">Đây là bản render VinClub mới. Ánh sáng được dựng trong scene 3D cùng với vật liệu, không lấy hình ảnh từ template tham khảo.</p>
        </div>
        <div>
          <h2 className="text-[20px] font-semibold">Ba lớp ánh sáng đã thử</h2>
          <ol className="mt-[12px] list-decimal pl-[22px] text-[14px] leading-[24px]">
            <li><strong>Dải phản chiếu:</strong> nguồn sáng dài và hẹp chạy qua mặt vàng, tạo một vệt sáng rõ khi logo đổi góc.</li>
            <li><strong>Viền bắt sáng:</strong> một nguồn sáng bên cạnh làm nổi độ dày và đường bo của biểu tượng.</li>
            <li><strong>Chấm lấp lánh:</strong> các chấm bắt nguồn sáng tại những thời điểm khác nhau trong vòng xoay.</li>
          </ol>
          <h3 className="mt-[24px] text-[16px] font-semibold">Nguồn đã xem</h3>
          <ul className="mt-[12px] list-disc pl-[22px] text-[14px] leading-[26px]">
            <li><a className="underline underline-offset-4" href="https://elements.envato.com/gold-logo-NNNRNTR" target="_blank" rel="noreferrer">Gold Logo — ruslan-ivanov / Envato</a>: tham khảo dải sáng di chuyển trên logo vàng.</li>
            <li><a className="underline underline-offset-4" href="https://help.maxon.net/c4d/en-us/Content/html/3424.html" target="_blank" rel="noreferrer">Maxon — Highlights</a>: tham khảo điểm lóe sáng trên kim loại.</li>
            <li><a className="underline underline-offset-4" href="https://docs.blender.org/manual/en/4.0/render/shader_nodes/shader/principled.html" target="_blank" rel="noreferrer">Blender — Principled BSDF</a>: vật liệu kim loại, độ nhám và phản chiếu có hướng.</li>
          </ul>
          <p className="mt-[24px] text-[14px] leading-[24px] text-foreground-secondary">Bản splash giữ thứ tự đã chốt: xoay → phóng logo lớn hơn → khung tròn thu lại → Home. Cách bố trí đèn và mức độ sáng ở video thử là lựa chọn dựng cho VinClub.</p>
          <Link href="/brand-splash/vinclub" className="mt-[16px] inline-block text-[14px] font-medium underline underline-offset-4">Mở splash với logo lớn và ánh sáng mới</Link>
        </div>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="text-[20px] font-semibold">Các nguồn chuyển cảnh đã đối chiếu trước đó</h2>
      <p className="mt-[12px] max-w-[900px] text-[16px] leading-[24px] text-foreground-secondary">Đã xem trực tiếp ba video dưới đây. Cần phân biệt chuyển động có trong bản ghi Uber với hướng chuyển động đề xuất cho VinClub. Phần video chỉ cắt khung vào điện thoại để dễ xem; không đổi tốc độ.</p>
    </section>
    <section className="px-[22px] pt-[32px] pb-[12px]" aria-label="Video tham khảo đã đối chiếu">
      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
        {sources.map(item => <article key={item.title} className="rounded-28 bg-secondary p-[12px]">
          <h2 className="text-[16px] font-semibold">{item.title}</h2>
          <p className="mt-[8px] min-h-[40px] text-[12px] text-foreground-secondary">{item.credit}</p>
          <video src={item.src} controls playsInline muted preload="metadata" className="my-[16px] h-[480px] w-full rounded-14 object-contain" aria-label={item.title} />
          <p className="text-[14px] leading-[22px] text-foreground-secondary">{item.observation}</p>
          <a className="mt-[12px] inline-block text-[14px] font-medium underline underline-offset-4" href={item.href} target="_blank" rel="noreferrer">Xem nguồn</a>
        </article>)}
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="text-[20px] font-semibold">Sáu thời điểm của đoạn thoát màn Uber</h2>
      <p className="mt-[8px] text-[14px] text-foreground-secondary">600 · 667 · 717 · 767 · 817 · 867 ms trong bản ghi. Vùng nội dung mở từ tâm ra ngoài. Mốc này thuộc clip tham khảo, không phải thông số chính thức của Uber.</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand-splash/research/uber-exit-frames.jpg" alt="Sáu khung hình: hai vạch Uber tách ngang để mở Home trong khoảng 600–867 ms" width={1500} height={720} className="mt-[16px] h-auto w-full rounded-14" />
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="text-[20px] font-semibold">Ba điểm khiến bản VinClub trước đây bị kỳ</h2>
      <ol className="mt-[12px] list-decimal pl-[22px] text-[14px] leading-[24px]">
        <li>Scale logo lên 12 lần làm mất hình chim và phóng to hạt texture thành một mảng vàng mờ.</li>
        <li>Đóng bằng circle mask đến bán kính 0 tạo cảm giác một mảng che bị hút vào tâm. Đó không phải chuyển động nhìn thấy trong hai bản ghi trên.</li>
        <li>Giữ nguyên Home phía dưới khiến hai lớp thiếu liên hệ; cảnh trước kết thúc rồi mới thấy cảnh sau.</li>
      </ol>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="text-[20px] font-semibold">Hướng đã chọn: Uber One / Bản ghi app</h2>
      <p className="mt-[8px] max-w-[950px] text-[14px] leading-[24px] text-foreground-secondary">Theo feedback mới, biểu tượng VinClub xoay 3D khoảng 1,1 giây, lấy đà rồi bay chéo ra phía trên trong 720 ms. Lớp nền tối kéo lên và Home đi vào cùng nhịp, giữ cơ chế chuyển màn của bản tham khảo Uber One. Phần xoay và bay là chuyển động thương hiệu phát triển cho VinClub; không phải mô tả chuyển động gốc của Uber One.</p>
      <p className="mt-[12px] text-[14px] text-foreground-secondary">Đã áp dụng lựa chọn Uber One vào bản mặc định tại /brand-splash/vinclub. Nếu Home chưa sẵn sàng, giữ nhận diện tới khi tải xong rồi mới chuyển; chế độ giảm chuyển động đi thẳng vào Home khi tải xong.</p>
    </section>
    <FixedBottom className="!relative !border-0 !shadow-none">
      <Link href="/brand-splash/vinclub" className="text-[14px] font-medium underline underline-offset-4">Đối chiếu với bản VinClub hiện tại</Link>
      <div className="mx-auto mt-[16px] h-[5px] w-[139px] rounded-full bg-foreground" />
    </FixedBottom>
  </main>;
}
