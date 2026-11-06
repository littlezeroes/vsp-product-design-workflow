'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { FixedBottom } from '@/components/ui/fixed-bottom'

const base = '/brand-splash/dark-glass-research/'
const imageSource = 'https://i.pinimg.com/736x/78/48/ac/7848ac39328e48c8abe0fb5aeba7733e.jpg'
const sources = {
  dispersion: 'https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_dispersion',
  volume: 'https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_volume',
  iridescence: 'https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_iridescence',
  three: 'https://threejs.org/docs/pages/MeshPhysicalMaterial.html',
  octane: 'https://help.otoy.com/hc/en-us/articles/34606089257115-Universal-Material-Build-Guide',
  ronald: 'https://ronald-fong.com/iridescent-glass-material-in-redshift/',
}
const views = [
  { id: 'reference', label: 'Ảnh gốc', title: 'Prismatic glass / nền đen', text: 'Ảnh bạn gửi là chuẩn thị giác. Những nhận xét bên dưới là phân tích từ ảnh; chưa xác minh được tác giả, renderer hay shader gốc.' },
  { id: 'edge', label: '01 / Cạnh sáng', title: 'Dải màu nằm trong cạnh kính', text: 'Cạnh có các dải trắng, cyan, xanh lam, cam và tím rất sáng. Màu bám theo mặt vát và đường phản chiếu; thân vật thể không được tô thành các mảng cầu vồng.' },
  { id: 'face', label: '02 / Mặt tối', title: 'Giữ vùng tối để đọc được vùng sáng', text: 'Mặt rộng có sắc đen xanh nhẹ, vẫn đọc được phản chiếu mờ bên trong. Sự tương phản giữa mặt tối và cạnh sáng giúp khối kính rõ trên nền đen.' },
  { id: 'depth', label: '03 / Độ dày', title: 'Nhiều lớp cạnh cho thấy thể tích', text: 'Nhìn thấy mặt trước, thành bên và đường cạnh phía sau. Mép bo đều, có mặt cắt rõ. Ảnh không có bề mặt nhăn hoặc các nếp gợn li ti như bản thử trước.' },
]
const failures = [
  ['Nền sáng', 'Làm mất tương phản đen / cạnh sáng vốn là đặc trưng chính của reference.'],
  ['Hạ alpha để tạo độ trong', 'Làm cả phản chiếu bị nhạt, logo thành một lớp mỏng. Cần transmission và thể tích, không lấy alpha thấp làm vật liệu kính.'],
  ['Phủ gradient cầu vồng', 'Màu nằm cố định trên thân thay vì đi theo khúc xạ và góc nhìn.'],
  ['Đẩy bề mặt theo silhouette', 'Các chỗ gãy normal và mặt cong không đều tạo nếp nhăn, nhìn như nhựa hoặc kính lỗi.'],
  ['Một mặt extrude phẳng', 'Thiếu mặt vát và chuyển tiếp cạnh sạch để tạo các dải phản chiếu có chiều sâu.'],
  ['Đổi màu toàn bộ ánh sáng', 'Dễ biến kính thành mảng vàng hoặc xanh đục; không chứng minh được tán sắc thực sự.'],
]

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">{children} ↗</a>
}

export function DarkGlassResearch() {
  const [view, setView] = useState('reference')
  const selected = views.find(v => v.id === view)!
  return <main className="dark min-h-dvh bg-background text-foreground">
    <Header variant="large-title" largeTitle="VinClub / Dark glass research" />
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-foreground-secondary">Reference-led material study</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Mặt tối.<br />Cạnh kính tán sắc.</h1>
      <p className="mt-5 max-w-3xl leading-7 text-foreground-secondary">Hướng cần nghiên cứu là kính khối trong trên nền đen: mép kính dày, mặt vát sạch, phản chiếu sắc và ánh tách màu. Bảng này phân tích reference và chốt cách kiểm chứng vật liệu; chưa phải bản render VinClub mới.</p>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <div className="grid gap-6 md:grid-cols-2">
        <div><div className="relative aspect-square overflow-hidden rounded-28 bg-secondary"><Image fill unoptimized priority src={base + selected.id + '.jpg'} alt={selected.title} className="object-contain" sizes="(min-width:1024px) 55vw, 100vw" /></div><p className="mt-3 text-xs leading-5 text-foreground-secondary"><Source href={imageSource}>Ảnh do bạn cung cấp</Source> · các ảnh chi tiết là crop từ ảnh này. Tác giả chưa được xác minh.</p></div>
        <div className="lg:pt-4">
          <p className="text-xs uppercase tracking-wider text-foreground-secondary">Quan sát trực tiếp từ ảnh</p>
          <h2 className="mt-3 text-3xl font-semibold">{selected.title}</h2>
          <p className="mt-4 leading-7 text-foreground-secondary">{selected.text}</p>
          <div className="mt-6 flex flex-wrap gap-2"><Button variant="primary" size="48" onClick={() => setView('reference')}>Ảnh gốc</Button>{views.slice(1).map(v => <Button key={v.id} variant="secondary" size="48" aria-pressed={view === v.id} onClick={() => setView(v.id)}>{v.label}</Button>)}</div>
          <div className="mt-8 rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Điều ảnh này không cho biết</h3><p className="mt-3 leading-7 text-foreground-secondary">Không thể xác định chính xác IOR, số đèn, shader hay mức hậu kỳ từ một JPEG. Cạnh sáng cũng chưa chứng minh có viền kim loại. “Prismatic glass” ở đây là tên hướng hình ảnh, không phải kết luận về vật liệu vật lý của tác giả.</p></div>
        </div>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="pb-[12px] text-2xl font-semibold">Ba cơ chế cần phân biệt</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">01 / Refraction</h3><p className="mt-3 leading-7 text-foreground-secondary">Ánh sáng đổi hướng khi đi vào và đi ra khối kính. Cần hình khối kín, độ dày và normal sạch để đọc được thể tích.</p><p className="mt-4 text-sm"><Source href={sources.volume}>Khronos · Volume</Source></p></article>
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">02 / Dispersion</h3><p className="mt-3 leading-7 text-foreground-secondary">Các màu khúc xạ theo những góc khác nhau. Đây là cơ chế nên thử trước để tạo các dải màu ở cạnh kính tương tự reference.</p><p className="mt-4 text-sm"><Source href={sources.dispersion}>Khronos · Dispersion</Source></p></article>
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">03 / Iridescence</h3><p className="mt-3 leading-7 text-foreground-secondary">Màu giao thoa của lớp màng mỏng thay đổi theo góc nhìn và chiếu sáng. Có thể bổ sung sau, nhưng phủ mạnh toàn mặt sẽ dễ lệch sang dầu loang.</p><p className="mt-4 text-sm"><Source href={sources.iridescence}>Khronos · Iridescence</Source></p></article>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="pb-[12px] text-2xl font-semibold">Vì sao các bản trước đi sai?</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{failures.map(([title, text]) => <article key={title} className="rounded-28 bg-secondary p-[22px]"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-foreground-secondary">{text}</p></article>)}</div>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground-secondary">Đây là đối chiếu với implementation vừa thử: có alpha theo góc nhìn, gradient màu và biến dạng mặt kính. Three.js hướng dẫn giữ opacity bằng 1 khi dùng transmission; OTOY cũng phân biệt rõ opacity với kính khúc xạ. <Source href={sources.three}>Three.js</Source> · <Source href={sources.octane}>OTOY</Source></p>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="pb-[12px] text-2xl font-semibold">Ánh sáng để kính hiện trên nền đen</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Nền đen không đồng nghĩa với thiếu ánh sáng</h3><p className="mt-3 leading-7 text-foreground-secondary">Đề xuất thử: camera nhìn nền đen; đặt hai đèn strip dài ngoài khung, chếch sau hai cạnh. Một nguồn trắng nhỏ hơn tạo điểm sáng ở đầu và góc bo. Giữ các vùng tối giữa những dải sáng để kính còn chiều sâu.</p><p className="mt-3 text-sm leading-6 text-foreground-secondary">Đây là bố trí cần thử để đạt hình ảnh tương tự; không phải sơ đồ đèn gốc của ảnh.</p></article>
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Màu cần chạy theo mặt kính</h3><p className="mt-3 leading-7 text-foreground-secondary">Bắt đầu bằng đèn trắng để kiểm chứng tán sắc. Sau đó mới thêm phản chiếu màu nếu cần art direction. Kiểm tra ba góc 0°, 30°, 60°: vệt sáng và vùng tách màu phải thay đổi cùng góc nghiêng.</p><p className="mt-3 text-sm leading-6 text-foreground-secondary">Ảnh tĩnh không đủ để kết luận phần nào là dispersion, đèn màu hoặc hậu kỳ. Không mặc định mọi ánh cầu vồng đều đến từ một thông số shader.</p></article>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="pb-[12px] text-2xl font-semibold">Nguồn kỹ thuật có hình đối chứng</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <article className="overflow-hidden rounded-28 bg-secondary"><div className="relative aspect-[2/1]"><Image src={base + 'dispersion.jpg'} alt="Khronos: đối chiếu viên đá có và không có dispersion" fill unoptimized sizes="50vw" className="object-contain" /></div><div className="p-[22px]"><h3 className="text-xl font-semibold">Dispersion: có màu trong khúc xạ</h3><p className="mt-3 text-sm leading-6 text-foreground-secondary">Hình so sánh của Khronos: bên trái có dispersion. Tài liệu cũng lưu ý nhiều phản xạ bên trong vật thể khiến chỉ thêm dispersion trong rasterizer chưa đủ để đạt hình ảnh như render path tracing.</p><p className="mt-4 text-sm"><Source href={sources.dispersion}>Nguồn hình và giải thích · Khronos</Source></p></div></article>
        <article className="overflow-hidden rounded-28 bg-secondary"><div className="relative aspect-[2/1]"><Image src={base + 'volume.png'} alt="Khronos: đối chiếu bề mặt mỏng và thể tích kính" fill unoptimized sizes="50vw" className="object-contain" /></div><div className="p-[22px]"><h3 className="text-xl font-semibold">Kính cần thể tích</h3><p className="mt-3 text-sm leading-6 text-foreground-secondary">Hình đối chứng bề mặt mỏng và khối có độ dày. Dùng để phân biệt một lớp trong mờ với kính có khúc xạ qua thể tích.</p><p className="mt-4 text-sm"><Source href={sources.volume}>Nguồn hình và giải thích · Khronos</Source></p></div></article>
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Một cách art-direct glass nhiều màu</h3><p className="mt-3 text-sm leading-6 text-foreground-secondary">Ronald Fong công bố ví dụ Maya / Redshift với Fresnel điều khiển hue, refraction và dispersion, kèm sơ đồ shader và lighting. Đây là ví dụ có phối hợp kỹ thuật, không chứng minh ảnh Pinterest được làm cùng cách.</p><p className="mt-4 text-sm"><Source href={sources.ronald}>Iridescent Glass Material in Redshift</Source></p></article>
        <article className="rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Đối chứng realtime</h3><p className="mt-3 text-sm leading-6 text-foreground-secondary">Ví dụ chính thức của Three.js cho phép quan sát dispersion. Dùng để kiểm tra renderer có tán sắc đúng trước khi gắn vào logo, không lấy hình demo làm chuẩn art direction.</p><p className="mt-4 text-sm"><Source href="https://threejs.org/examples/webgl_loader_gltf_dispersion.html">Three.js · Dispersion demo</Source></p></article>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <h2 className="pb-[12px] text-2xl font-semibold">Cách dựng lại, theo đúng thứ tự</h2>
      <ol className="grid list-inside list-decimal gap-4 md:grid-cols-2">
        <li className="rounded-28 bg-secondary p-[22px] font-semibold">Chốt vật liệu trên khối đơn giản<p className="mt-3 text-sm font-normal leading-6 text-foreground-secondary">Dùng một thanh bo và một vòng kính gần hình trong reference. Chưa thêm logo, chữ hay animation chuyển Home.</p></li>
        <li className="rounded-28 bg-secondary p-[22px] font-semibold">So sánh ảnh tĩnh trên nền đen<p className="mt-3 text-sm font-normal leading-6 text-foreground-secondary">Kiểm tra mặt tối, cạnh sáng, độ dày, mặt vát và vùng tán sắc. Render nhiều góc để tránh một góc đẹp nhưng xoay là thành nhựa.</p></li>
        <li className="rounded-28 bg-secondary p-[22px] font-semibold">Mới chuyển sang logo VinClub<p className="mt-3 text-sm font-normal leading-6 text-foreground-secondary">Giữ hình nhận diện. Các chấm nhỏ cần bề mặt sạch và kích thước vát hợp lý để không thành nhiễu sáng hoặc lớp vảy.</p></li>
        <li className="rounded-28 bg-secondary p-[22px] font-semibold">Cuối cùng mới làm motion và out<p className="mt-3 text-sm font-normal leading-6 text-foreground-secondary">Dùng ánh sáng chạy qua các mặt cắt để tạo chuyển động có chủ đích. Chốt chất liệu trước khi quyết định số vòng xoay và đoạn vào Home.</p></li>
      </ol>
      <details className="mt-5 rounded-28 bg-secondary p-[22px]"><summary className="cursor-pointer font-semibold">Thông số khởi điểm để thử — không phải setting gốc của ảnh</summary><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead><tr><th className="py-3 pr-5">Nhóm</th><th className="py-3 pr-5">Dải thử đề xuất</th><th className="py-3">Mục đích</th></tr></thead><tbody>{[
        ['Hình khối', 'Mesh kín; cạnh bo đều; normal sạch', 'Khúc xạ qua thể tích, tránh nếp nhăn'],
        ['Transmission / opacity', '1 / 1', 'Giữ phản chiếu khi kính trong'],
        ['Metalness', '0', 'Tách kính khỏi bề mặt kim loại'],
        ['IOR', '1.50 / 1.60 / 1.65', 'So độ bẻ cong và phản xạ ở cạnh'],
        ['Roughness', '0.005 / 0.015 / 0.03', 'Giữ dải sáng sắc, tránh kính mờ'],
        ['Dispersion — Three.js', '0.3 / 0.7 / 1.0', 'Tách màu trong transmission'],
        ['Dispersion — Abbe', '55 / 35 / 20', 'Thang khác Three.js; thấp hơn là mạnh hơn'],
        ['Iridescence', 'Tắt ở lần thử đầu', 'Chứng minh refraction và dispersion trước'],
        ['Hậu kỳ', 'Bloom nhẹ ở điểm sáng', 'Giữ cạnh sắc, không phủ glow toàn logo'],
      ].map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i} className="py-3 pr-5 align-top text-foreground-secondary">{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-4 text-sm leading-6 text-foreground-secondary">Các con số là ma trận thử đề xuất. Dispersion và Abbe dùng hai thang khác nhau; không sao chép cùng một số giữa các renderer. <Source href={sources.dispersion}>Quy ước Khronos</Source></p></details>
      <div className="mt-5 rounded-28 bg-secondary p-[22px]"><h3 className="text-xl font-semibold">Hướng sản xuất nên thử</h3><p className="mt-3 max-w-3xl leading-7 text-foreground-secondary">Ưu tiên một ảnh tĩnh path-traced có nhiều phản xạ và tán sắc bên trong làm mốc chất lượng; sau đó mới cân nhắc video render sẵn hay realtime cho splash. Đây là lựa chọn triển khai đề xuất từ nghiên cứu, không phải kết luận Three.js không thể làm kính.</p></div>
    </section>
    <FixedBottom className="!relative !border-0 !shadow-none"><p className="text-xs leading-6 text-foreground-secondary">Nghiên cứu theo ảnh do bạn cung cấp. Hình kỹ thuật: Khronos Group. Các crop chỉ phục vụ phân tích. Chưa dựng render VinClub mới trong vòng nghiên cứu này.</p><div className="mx-auto mt-6 h-[5px] w-[139px] rounded-full bg-foreground" /></FixedBottom>
  </main>
}
