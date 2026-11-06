from pathlib import Path
import json,html,re
from PIL import Image,ImageDraw,ImageFont
from pptx import Presentation
from pptx.util import Inches,Pt
from pptx.dml.color import RGBColor
R=Path('public/reports/vinclub-lab-v3');R.mkdir(parents=True,exist_ok=True)
load=lambda n:json.loads((R/n).read_text())
ias=load('ia-strategies.json');comp=load('competitors.json');narr=load('narrative.json');ut=load('ut-plan.json');h=load('harness-results.json') if (R/'harness-results.json').exists() else {}
layouts=[('Danh sách rõ việc','Hàng dọc, đọc tuần tự.'),('Một việc nổi bật','Khối đầu lớn; lựa chọn sau gọn.'),('Lưới hai cột','Chọn bằng nhận diện nhóm.'),('Thẻ ngang','Thẻ vuốt có mép gợi ý.'),('Tóm tắt rồi chi tiết','Tài sản trước, dịch vụ sau.'),('Một điểm bắt đầu','Mở dần từng lựa chọn.'),('Tài sản và hành động','Phân biệt khối tài sản với dịch vụ.'),('Tạp chí dịch vụ','Lời dẫn lớn theo nhu cầu.'),('Theo trình tự','Đánh số nhóm để dẫn từng bước.'),('Tập trung rồi mở rộng','Hai nhóm mở sẵn, còn lại mở dần.')]
manifest=[]
for ia in ias:
 for j,(name,why) in enumerate(layouts,1):manifest.append({'ia':ia['id'],'ui':j,'layout':name,'difference':why,'url':f'/vinclub-ia-lab?ia={int(ia["id"][2:])}&ui={j}','screenshot':f'screens/{ia["id"]}-UI{j:02}.png','componentContract':'VSP Header + Button + ItemListItem + SearchBar; Lego compositions use semantic tokens'})
(R/'variants.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# Palette from project source; no new colors.
source=Path('app/globals.css').read_text();pal=dict(re.findall(r'--color-([\w-]+):\s*(#[0-9a-fA-F]+);',source))
bg=pal['grey-50'];fg=pal['grey-900'];muted=pal['grey-600'];green=pal['green-800'];red=pal['red-800'];white=pal['grey-00']
e=html.escape
# Contact sheets: each IA has all 10 actual UI captures.
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',18)
for ia in ias:
 sheet=Image.new('RGB',(5*230,2*550),bg);draw=ImageDraw.Draw(sheet)
 for j in range(1,11):
  fp=R/f'screens/{ia["id"]}-UI{j:02}.png'
  if fp.exists():
   im=Image.open(fp).convert('RGB');im.thumbnail((218,500));x=((j-1)%5)*230+6;y=((j-1)//5)*550+32;sheet.paste(im,(x,y));draw.text((x,y-26),f'{ia["id"]} / UI{j:02}',fill=fg,font=font)
 sheet.save(R/f'{ia["id"]}-contact-sheet.jpg',quality=85)
# Reuse token CSS from previous reports.
previous=Path('public/reports/vinclub-ia-map-v2.html').read_text();base=previous[previous.index('<style>')+7:previous.index('</style>')]
styles='''.hub{max-width:1400px;margin:auto;padding:32px 22px}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.choice{background:var(--surface);padding:24px;border-radius:var(--radius-28)}.choice h3{margin:8px 0}.choice p{font-size:14px;color:var(--foreground-secondary)}.choice .links{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.choice .links a,.pill-link{padding:8px 12px;border-radius:var(--radius-8);background:var(--secondary);text-decoration:none;font-size:13px}.choice img{width:100%;height:auto;display:block;border-radius:var(--radius-14)}.hub h2{margin:32px 0 16px}.facts{display:flex;flex-wrap:wrap;gap:12px}.facts div{background:var(--surface);padding:20px;border-radius:var(--radius-14);flex:1}.facts strong{font-size:30px;display:block}.ia-analysis{overflow:auto;background:var(--surface);border-radius:var(--radius-28)}.ia-analysis table{min-width:1100px;table-layout:auto}.ia-analysis td{font-size:13px}.comp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.muted{color:var(--foreground-secondary)}.red-text{color:var(--color-red-800)}.decision-box{padding:24px;background:var(--color-green-50);color:var(--color-green-900);border-radius:var(--radius-28);margin:24px 0}.workflow{display:flex;flex-wrap:wrap;gap:8px}.workflow span{padding:12px;background:var(--surface);border-radius:var(--radius-14);font-size:13px}.ut{padding:22px;background:var(--surface);margin:12px 0;border-radius:var(--radius-14)}@media(max-width:800px){.cards,.comp-grid{grid-template-columns:1fr}.facts strong{font-size:24px}}'''
cards=''
for i,ia in enumerate(ias,1):
 links=''.join(f'<a href="/vinclub-ia-lab?ia={i}&ui={j}" target="_blank">UI{j:02}</a>' for j in range(1,11))
 cards+=f'<article class="choice"><div class="eyebrow">{ia["id"]}</div><h3>{e(ia["name"])}</h3><p>{e(ia["philosophy"])}</p><p><strong>Ra tiền:</strong> {e(str(ia["money"]))}</p><p><strong>Đánh đổi:</strong> {e(str(ia["risks"]))}</p><details><summary>Phân kỳ 02/2027 → cuối 2027</summary><p><strong>02/2027:</strong> {e(str(ia["feb2027"]))}</p><p><strong>Cuối 2027:</strong> {e(str(ia["end2027"]))}</p></details><div class="links">{links}</div><a href="{ia["id"]}-contact-sheet.jpg" target="_blank"><img loading="lazy" src="{ia["id"]}-contact-sheet.jpg" alt="10 bố cục UI của {ia["id"]}"></a></article>'
scores=''.join('<tr><td>'+ia['id']+'</td><td>'+e(ia['name'])+'</td><td>'+e(str(ia['analystScores']))+'</td><td>'+e(str(ia.get('scoreRationale','')))+'</td></tr>' for ia in ias)
analysis=''.join('<tr>'+''.join(f'<td>{e(str(ia[k]))}</td>' for k in ['id','name','organizingPrinciple','audience','strengths','risks','dependency'])+'</tr>' for ia in ias)
competitors=''
for c in comp['competitors']:
 links=' · '.join(f'<a href="{e(x["url"])}" target="_blank" rel="noopener">{e(x["title"])}</a>' for x in c['sources'])
 competitors+=f'<article class="choice"><h3>{e(c["name"])}</h3><p>{e(c["pattern"])}</p><p><strong>Học:</strong> {e(c["learn"])}</p><p><strong>Tránh:</strong> {e(c["avoid"])}</p><p><strong>Tiền:</strong> {e(c["moneyModel"])}</p><small>{links}</small></article>'
uts=''.join(f'<article class="ut"><strong>{e(t["id"])} · {e(t["title"])}</strong><p>{e(t["prompt"])}</p><p class="muted">Đạt khi: {e(t["successCriteria"])}</p></article>' for t in ut['tasks'])
checks=f'{h.get("variants",0)}/100 màn · {h.get("uniqueScreens",0)} ảnh khác nhau · '+('PASS' if h.get('pass') else 'Đang chạy')
index=f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VinClub V3 · 10 IA × 100 UI</title><style>{base}{styles}</style></head><body><header><div class="container hero"><div class="eyebrow">VINCLUB / EXPLORATION LAB / V3</div><h1>10 cách tổ chức.<br><span>100 cách thể hiện.</span></h1><p class="lead">Cùng một bộ Lego VSP, thay cách khách tìm dịch vụ, dùng quyền lợi và hoàn tất hành động tạo giá trị.</p><div class="facts"><div><strong>10</strong>Kiến trúc IA khác nhau</div><div><strong>100</strong>UI tương tác + ảnh thật</div><div><strong>5</strong>Đối thủ · nguồn chính thức</div><div><strong>6</strong>Tác vụ UT · chưa chạy người thật</div></div><div class="legend"><a class="pill-link" href="/vinclub-ia-lab?ia=2&ui=1">Mở UI tương tác ↗</a><a class="pill-link" href="slides.html">Trình chiếu slide ↗</a><a class="pill-link" href="vinclub-ia-v3.pptx">Tải PowerPoint</a><a class="pill-link" href="vinclub-ia-v3.pdf">Tải PDF</a><a class="pill-link" href="../vinclub-ia-map-v2.html">Giữ lại V2</a><a class="pill-link" href="workflow.html">Workflow & harness</a></div></div></header><main class="hub"><div class="decision-box"><strong>Triết lý thiết kế: Việc cần làm rõ trước. Quyền lợi hiện đúng lúc. Giao dịch có đường về.</strong><p>Không biến Home thành danh mục toàn tập đoàn. Tách tìm dịch vụ, tài sản điểm và quyền lợi đã có. Dùng cùng component để so cách tổ chức, thay vì bị màu sắc chi phối.</p><p><strong>Shortlist phân tích:</strong> IA02 cho bản 02/2027; IA03 cho dùng quyền lợi / giữ chân; IA06 cho lead O2O. Đây là giả thuyết chuyên gia, chưa phải phương án thắng UT.</p></div><h2>Workflow đã thiết lập</h2><div class="workflow"><span>1 · Đọc B3 + DOCX</span><span>2 · Agent IA: 10 phương án</span><span>3 · Agent đối thủ: nguồn chính thức</span><span>4 · Lego: 10 layout / IA</span><span>5 · Harness + QA → sửa → chạy lại</span><span>6 · Slide + protocol UT</span></div><p><strong>Harness:</strong> {e(checks)}. <a href="harness-results.json">Xem bằng chứng</a>. Kiểm tra tự động không thay thế usability test.</p><h2>10 IA — ưu / nhược và phụ thuộc</h2><div class="ia-analysis"><table><thead><tr><th>ID</th><th>IA</th><th>Cách tổ chức</th><th>Đối tượng</th><th>Điểm mạnh</th><th>Đánh đổi</th><th>Phụ thuộc</th></tr></thead><tbody>{analysis}</tbody></table></div><h2>Chấm chuyên gia — giả thuyết để chọn UT</h2><p class="muted">Thang 1–5 cho rõ ràng, chuyển đổi, giữ chân và khả thi. Điểm là đánh giá phân tích, không phải dữ liệu người dùng hoặc dự báo doanh thu.</p><div class="ia-analysis"><table><thead><tr><th>ID</th><th>IA</th><th>Điểm từng tiêu chí</th><th>Lý do</th></tr></thead><tbody>{scores}</tbody></table></div><h2>100 UI — chọn IA rồi so 10 bố cục</h2><p class="muted">Các biến thể là concept để so cấu trúc và bố cục, không phải 100 sản phẩm đã hoàn thiện. Ảnh dưới là ảnh chụp Playwright thật; bấm UI để thao tác. UI giữ nguyên tab và thứ tự nhóm của IA, thay hình thức trình bày / mức mở chi tiết.</p><div class="cards">{cards}</div><h2>Lego component — cùng vật liệu, khác cách ghép</h2><article class="choice"><p><strong>Primitive đang dùng:</strong> VSP Header, Button, ItemListItem và SearchBar từ components/ui. Không tạo bộ nút hay header riêng.</p><p><strong>Khối ghép:</strong> identity · points · wallet · search · services · offers · owned · bundles · events · o2o · tasks · assistant · community · activity.</p><p><strong>10 bố cục:</strong> {' · '.join(e(x[0]) for x in layouts)}.</p><p><strong>Ràng buộc:</strong> Header → Section → FixedBottom; lề 22px, section title 24/12px, một primary CTA, home indicator, semantic tokens. AI / cộng đồng gắn nhãn bản minh họa.</p></article><h2>Đối thủ — học mô hình, không chép danh mục</h2><p class="muted">Pattern dưới là diễn giải từ nguồn chính thức, không khẳng định thứ tự tab hiện hành.</p><div class="comp-grid">{competitors}</div><h2>UT — kiểm chứng trước khi chốt IA</h2><p>Đề xuất 9–12 người, chia nhóm hội viên / mua dịch vụ / O2O. Dùng 3 IA với cùng một UI trước, rồi mới so bố cục. Luân phiên thứ tự để giảm học thuộc. <strong>Chưa tuyển người và chưa có kết quả UT.</strong> Prototype hỗ trợ tìm đường và flow mẫu; chưa có 3D thật, nguồn cung thật hoặc kiểm tra ngân hàng. <a href="independent-review.json">QA độc lập</a>.</p>{uts}<p><a href="ut-plan.json">Tải protocol JSON</a> · <a href="ut-scorecard.csv">Tải bảng ghi kết quả trống</a></p><h2>Giới hạn và nguồn</h2><p class="muted">B3 là kế hoạch, không phải bằng chứng backend đã bàn giao. Không dùng hạn từ B3_ARCHIVED. IA09/10 phụ thuộc dữ liệu / SDK; không mặc định cam kết cuối 2027. Tiền bán P&L, GMV và số dư ví không đồng nghĩa doanh thu VinClub. DOCX Đảo Ngọc được dùng cho cách kể: hành trình → tác vụ → so sánh → lý do thay đổi → kế hoạch → quyết định.</p></main><footer><div class="container">V3 độc lập · V1/V2 được giữ nguyên · <a href="variants.json">Manifest 100 UI</a><div class="home-indicator"></div></div></footer></body></html>'''
(R/'index.html').write_text(index)
(R/'ut-scorecard.csv').write_text('participant_id,segment,sequence,ia,ui,task,first_click,success_without_help,time_seconds,backtracks,help_needed,confidence_1_5,notes\n')
# Source-backed competitor slide and actual QA summary override generic outline.
narr['slides'][5]['bullets']=[ia['id']+' · '+ia['name'] for ia in ias]
narr['slides'][8]['bullets']=[c['name']+': '+c['learn'] for c in comp['competitors']]
narr['slides'][10]['bullets']=[checks,'Đã thử 6 flow minh họa: điểm, đổi quà, vé, gói, lịch hẹn, ví.','QA độc lập đã sửa CTA / back / lịch sử; chưa có human UT.']
# Slide deck: narrative + 10 IA appendices, editable text and real screenshot contact sheets.
prs=Presentation();prs.slide_width=Inches(13.333);prs.slide_height=Inches(7.5)
def color(h):return RGBColor.from_string(h.lstrip('#'))
def box(sl,x,y,w,h,text,size=20,bold=False,col=fg):
 tb=sl.shapes.add_textbox(Inches(x),Inches(y),Inches(w),Inches(h));tf=tb.text_frame;tf.word_wrap=True
 for i,line in enumerate(text.split('\n')):
  par=tf.paragraphs[0] if i==0 else tf.add_paragraph();par.text=line;par.font.name='Arial';par.font.size=Pt(size);par.font.bold=bold;par.font.color.rgb=color(col);par.space_after=Pt(10)
 return tb
htmlslides=[]
for idx,slide in enumerate(narr['slides']):
 sl=prs.slides.add_slide(prs.slide_layouts[6]);sl.background.fill.solid();sl.background.fill.fore_color.rgb=color(bg)
 box(sl,.5,.25,12,.3,f'VINCLUB / V3 / {idx+1:02}',11,True,green);box(sl,.5,.8,12,1.1,slide['title'],32,True);box(sl,.5,1.9,11.8,1,slide['takeaway'],21,False,muted)
 bullets=list(slide['bullets']);image=None
 if idx==0:bullets.append('Mở 100 UI tại localhost:3250/vinclub-ia-lab')
 if idx in [1,2,5,7,9]:image=R/f'screens/IA02-UI{(idx%10)+1:02}.png'
 if idx in [6]:image=R/'IA02-contact-sheet.jpg'
 if idx==10:bullets.append('Harness: '+checks)
 if image and image.exists():
  box(sl,.5,3,7.6,3.4,'\n'.join('• '+x for x in bullets),19)
  if 'contact' in image.name:sl.shapes.add_picture(str(image),Inches(8.5),Inches(3.0),width=Inches(4.2))
  else:sl.shapes.add_picture(str(image),Inches(9.1),Inches(2.6),height=Inches(4.5))
 elif idx==5:
  box(sl,.5,3,6,3.7,'\n'.join(bullets[:5]),18)
  box(sl,6.7,3,6,3.7,'\n'.join(bullets[5:]),18)
 else:box(sl,.5,3,12,3.5,'\n'.join('• '+x for x in bullets),17 if idx==8 else 21)
 box(sl,.5,7.05,12,.25,'Prototype minh họa · Điểm chuyên gia ≠ UT · B3 chưa xác nhận tích hợp thực tế',10,False,muted)
 pic=f'<img src="{image.relative_to(R)}" alt="UI minh họa">' if image and image.exists() else ''
 htmlslides.append(f'<section class="slide"><small>VINCLUB / V3 / {idx+1:02}</small><h1>{e(slide["title"])}</h1><h2>{e(slide["takeaway"])}</h2><div class="slide-body"><ul>'+''.join(f'<li>{e(x)}</li>' for x in bullets)+f'</ul>{pic}</div><footer>Điểm chuyên gia ≠ UT · Bản dùng thử, chưa tích hợp hệ thống thật.</footer></section>')
for ia in ias:
 sl=prs.slides.add_slide(prs.slide_layouts[6]);sl.background.fill.solid();sl.background.fill.fore_color.rgb=color(bg)
 box(sl,.4,.2,12,.3,f'PHỤ LỤC / {ia["id"]} / 10 UI',11,True,green);box(sl,.4,.7,12,.7,ia['name'],28,True);box(sl,.4,1.5,5.2,1.2,ia['philosophy'],19)
 box(sl,.4,2.8,5.2,3.7,'Ra tiền: '+str(ia['money'])+'\nĐánh đổi: '+str(ia['risks']),17)
 image=R/f'{ia["id"]}-contact-sheet.jpg';sl.shapes.add_picture(str(image),Inches(6),Inches(1.4),width=Inches(6.5))
 box(sl,.4,7,12,.3,'10 layout dùng cùng IA và bộ VSP; ảnh thật từ harness. Mở UI tương tác để kiểm tra đường đi.',10,False,muted)
 htmlslides.append(f'<section class="slide"><small>PHỤ LỤC / {ia["id"]}</small><h1>{e(ia["name"])}</h1><h2>{e(ia["philosophy"])}</h2><div class="slide-body appendix"><div><p><strong>Ra tiền:</strong> {e(str(ia["money"]))}</p><p><strong>Đánh đổi:</strong> {e(str(ia["risks"]))}</p></div><img src="{image.name}" alt="10 UI {ia["id"]}"></div></section>')
# References appendix with primary links, editable in PPT.
sl=prs.slides.add_slide(prs.slide_layouts[6]);box(sl,.5,.5,12,.8,'Nguồn đối chiếu và phạm vi bằng chứng',28,True)
refs=['Excel B3 hiện hành; DOCX Báo cáo Sa bàn ảo Đảo Ngọc; prototype quan sát 01/11/2026.']
for c in comp['competitors']:refs.extend(c['name']+' — '+x['url'] for x in c['sources'][:1])
box(sl,.5,1.6,12,5,'\n'.join(refs),16)
prs.save(R/'vinclub-ia-v3.pptx')
htmlslides.append('<section class="slide"><small>SOURCES / PHỤ LỤC</small><h1>Nguồn đối chiếu</h1><div class="slide-body"><ul>'+''.join('<li>'+e(x)+'</li>' for x in refs)+'</ul></div></section>')
slidescss=f'''*{{box-sizing:border-box}}body{{margin:0;background:{bg};color:{fg};font-family:Arial,sans-serif}}.slide{{width:1280px;height:720px;padding:38px 50px;position:relative;margin:24px auto;background:{white};overflow:hidden}}small{{color:{green};letter-spacing:.12em}}h1{{font-size:38px;line-height:1.15;margin:24px 0 14px}}h2{{font-size:23px;font-weight:400;color:{muted};line-height:1.4}}.slide-body{{display:flex;gap:30px;align-items:flex-start;margin-top:30px}}ul{{flex:1;font-size:23px;line-height:1.55;padding-left:26px}}li{{margin:12px 0}}.slide-body img{{max-height:420px;max-width:44%;object-fit:contain}}.appendix img{{max-width:60%;max-height:400px}}.appendix p{{font-size:19px;line-height:1.6}}footer{{position:absolute;bottom:22px;left:50px;color:{muted};font-size:12px}}.slide:nth-child(6) ul{{display:grid;grid-template-columns:1fr 1fr;gap:0 28px;list-style-position:inside;font-size:21px}}.slide:last-of-type li{{font-size:16px;overflow-wrap:anywhere}}.controls{{position:fixed;bottom:12px;right:12px;z-index:10;padding:12px;background:{fg};color:{white};font-size:13px}}body.present .slide{{display:none;margin:0 auto}}body.present .slide.active{{display:block}}@media print{{@page{{size:13.333in 7.5in;margin:0}}.controls{{display:none}}.slide{{margin:0;break-after:page;width:1280px;height:720px}}}}'''
(R/'slides.html').write_text(f'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VinClub V3 · Slide</title><style>{slidescss}</style></head><body>'+''.join(htmlslides)+'<div class="controls">← → đổi slide · F bật / tắt trình chiếu · <a href="index.html" style="color:inherit">Về lab</a></div><script>let n=0;const slides=[...document.querySelectorAll(".slide")];function show(){slides.forEach((s,i)=>s.classList.toggle("active",i===n));}document.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="f")document.body.classList.toggle("present");if(e.key==="ArrowRight")n=Math.min(slides.length-1,n+1);if(e.key==="ArrowLeft")n=Math.max(0,n-1);show()});show();</script></body></html>')
workflow=Path('docs/workflows/vinclub-ia-exploration-v3.md').read_text()
(R/'workflow.html').write_text(f'<!doctype html><html lang="vi"><meta charset="utf-8"><title>Workflow VinClub V3</title><style>{base}pre{{white-space:pre-wrap;font:14px/1.8 system-ui}}main{{max-width:1000px;margin:auto;padding:32px 22px}}</style><main><a href="index.html">← Về lab</a><h1>Workflow nhiều agent</h1><pre>{e(workflow)}</pre><h2>Bằng chứng chạy gần nhất</h2><p>{e(checks)}</p><a href="harness-results.json">Harness JSON</a></main></html>')
print('Built hub, 100 manifest, 10 contact sheets, UT scorecard, workflow, HTML deck, PPTX',len(prs.slides),'slides')
