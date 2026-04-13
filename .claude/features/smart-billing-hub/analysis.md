# BRD Analysis — Smart Billing Hub
> Analyst: Nate | Date: 2026-03-10

---

## Da hieu tu BRD

### Tong quan
- SBH la miniapp thanh toan hoa don tu 3 PnL VinGroup: VHR (Vinhomes), VGreen (Vinfast), VSC (Vinschool)
- Tien di thang ve tung PnL, khong qua VSF. Moi PnL co terminal rieng tren Payment Hub (Terminal VHR, Terminal VG/VF, Terminal VSC)
- He thong dinh tuyen giao dich den dung terminal dua tren serviceType cua bill

### AC1 — Add billing profile
- 3 dich vu: Nha o (Vinhomes), Pin va Sac (VGreen/Vinfast), Giao duc (Vinschool)
- Moi dich vu co input/output khac nhau:
  - **Nha o:** Nha cung cap (dropdown, hien chi co Vinhomes) + Ma can ho (text, max 64 ky tu) -> tra ve apartmentID + areaName
  - **Pin va Sac:** Loai phuong tien (O to/Xe may/Taxi Xanh) + So VIN -> tra ve vehicleID + vehicleModel + serviceType[]
  - **Giao duc:** Nha cung cap (dropdown, chi co Vinschool) + Ma hoc sinh -> tra ve studentID + studentName
- Sau khi validate thanh cong, SBH luu profile va goi API get bill ngay -> neu co bill thi hien thi luon
- Billing Aggregator cung tra ve danh sach serviceType se phat sinh voi profile (phuc vu auto payment config)
- Chua co API rieng cho SBH o ca 3 PnL, can custom them

### AC2 — Hien thi hoa don
- 2 noi xem: ngay khi add profile (neu co bill san) + muc "Hoa don cua toi"
- Hoa don group theo profile, hien thi trong tung profile card
- 6+ loai bill voi cau truc detail khac nhau:
  - VHR: Hoa don dich vu Vinhomes (phu quan ly, dich vu tien ich, phi gui xe...)
  - VGreen: Sac Pin o to/GSM, Thue Pin o to, Tra gop Pin o to, Sac Pin xe may, Thue Pin xe may
  - VSC: Trong som, Don muon, Hoc phi (de cap nhung khong co detail structure)
- **Bill Adhoc** (VGreen sac pin, VSC trong som/don muon): PnL noti ve SBH khi phat sinh -> SBH goi get bill
- **Bill Recurring** (VHR, VGreen thue/tra gop, VSC hoc phi): Job quet hang ngay 9h sang, check genBillDate == today -> call API get bill cho tat ca profile co serviceType tuong ung
- 3 edge cases cho recurring: (1) khong lay duoc bill truoc han -> ngung goi den ky tiep, (2) bill da thanh toan o nguon khac -> bo qua, (3) ky cu chua thanh toan + ky moi -> tiep tuc goi hang ngay
- DB config cho recurring: service, billCode (VHRService, BikeCharging, CarLeasing, BikeLeasing, CarInstallment), cycle, genBillDate, dueDate
- Co label "Qua han" khi bill qua due date

### AC3 — Thanh toan thu cong
- 2 entry point: khi add profile co bill san + tu "Hoa don cua toi"
- Multi-select bang checkbox, co option chon tat ca
- CTA la "Xac nhan" (khong phai "Thanh toan") -> chuyen sang man "Thanh toan tap trung"
- Bottom sheet chon phuong thuc thanh toan
- SBH detect terminal dua tren serviceType, init payment sang Payment Hub
- Truoc khi init payment, SBH goi lai Billing Aggregator de get bill moi nhat -> neu bill da thanh toan thi popup bao va refresh
- Sau thanh toan thanh cong: SBH callback bao cho Billing Aggregator. Neu BA tu choi -> refund va bao user
- Multi-bill: moi hoa don callback mot lan. Hoa don bi tu choi chi refund hoa don do, khong anh huong hoa don khac

### AC4 — Thanh toan tu dong
- Config theo tung serviceType cua tung profile (khong phai theo profile)
- Cung mot serviceType o cac profile khac nhau co cau hinh rieng
- Config gom: Ngay thanh toan hang thang (date picker 01-28, required) + Nguon tien thanh toan (priority list)
- 2 phuong thuc thanh toan phase nay: The tin dung/ghi no + V-SmartPay
- User co the sap xep thu tu uu tien nguon tien
- Nguon tien lay tu danh sach PTTT cua Payment Hub merchant SBH

---

## Can PO confirm

### MUST ANSWER (block flow)

1. **Man "Thanh toan tap trung" trong nhu the nao?**
   - Ly do hoi: BRD noi an "Xac nhan" se chuyen qua man "Thanh toan tap trung" de hoan tat thanh toan, nhung khong dinh nghia man nay. Day la man core cua flow thanh toan — khong co thi khong design duoc.
   - Option A: Man confirm tong hop (list bill da chon + tong tien + PTTT + CTA "Thanh toan") — giong confirm screen cua VSP hien tai
   - Option B: Man chi la loading/processing screen, thanh toan duoc xu ly ngam va hien ket qua

2. **Khi thanh toan nhieu bill tu nhieu PnL khac nhau (VD: 1 bill VHR + 1 bill VGreen), payment duoc xu ly the nao?**
   - Ly do hoi: Moi PnL co terminal rieng. User chon 3 bill tu 3 PnL -> tao 1 transaction hay 3 transaction rieng? Anh huong truc tiep den UX result screen.
   - Option A: Tach thanh N transaction rieng, moi transaction di terminal rieng -> hien N ket qua
   - Option B: 1 transaction duy nhat, SBH tu split phia backend -> user thay 1 ket qua tong hop
   - Option C: Group theo PnL, thanh toan tuan tu tung PnL -> hien thi progress

3. **Auth (xac thuc giao dich) o buoc nao? PIN/Biometric co can khong?**
   - Ly do hoi: BRD khong de cap den buoc xac thuc giao dich (PIN/Biometric) truoc khi thanh toan. VSP hien tai bat buoc PIN cho moi giao dich (ref: ux-knowledge.md Auth Hierarchy). SBH co theo chuan nay khong?
   - Option A: Theo chuan VSP — PIN truoc moi giao dich, Biometric neu bat
   - Option B: Khong can PIN vi da xac thuc khi vao miniapp
   - Option C: Chi can PIN khi tong tien > threshold

4. **User co the xoa/sua billing profile khong?**
   - Ly do hoi: BRD chi dinh nghia "add profile" nhung khong de cap edit/delete. Neu user nhap sai hoac khong con o Vinhomes/ban xe thi sao?
   - Option A: Cho xoa profile (confirm dialog) + khong cho edit (phai xoa roi add lai)
   - Option B: Cho ca edit va xoa
   - Option C: Phase 1 chi co add, chua co edit/delete

5. **Vinschool bill detail structure cho tung loai (Trong som, Don muon, Hoc phi)?**
   - Ly do hoi: BRD chi liet ke ten 3 loai bill cua VSC nhung KHONG co bang cau truc list/detail nhu VHR va VGreen. Khong co detail -> khong design duoc bill card va bill detail screen cho Vinschool.
   - Option A: PO cung cap bang cau truc tuong tu VHR/VGreen
   - Option B: Dung cau truc generic (ten, ngay, so tien, trang thai) cho tat ca bill VSC

6. **Khi auto payment that bai (so du khong du o tat ca nguon tien), he thong xu ly the nao?**
   - Ly do hoi: BRD dinh nghia auto payment voi priority list nguon tien nhung khong noi gi ve truong hop tat ca nguon deu khong du.
   - Option A: Thu tuan tu cac nguon -> tat ca fail -> ghi nhan fail + push notification cho user
   - Option B: Thu tuan tu -> fail -> retry vao ngay hom sau cho den due date
   - Option C: Thu tuan tu -> fail -> tu dong chuyen sang manual va thong bao user

7. **User can chon nhieu bill CROSS-SERVICE (VD: bill VHR + bill VGreen) de thanh toan cung luc khong?**
   - Ly do hoi: Man "Hoa don cua toi" hien thi bills grouped by service (NHA O / PIN VA SAC / GIAO DUC). Checkbox o level bill item — nhung khong ro user co the chon bill tu nhieu group khac nhau khong.
   - Option A: Co — checkbox o moi bill, "Chon tat ca" chon het, thanh toan toan bo mot lan
   - Option B: Khong — chi thanh toan duoc bills trong cung 1 service group moi lan

### SHOULD ANSWER (block UI)

1. **Empty state khi chua co billing profile nao?**
   - Ly do: User lan dau vao SBH se thay gi? BRD chi co mockup khi da co profile.
   - Default neu khong tra loi: Illustration + "Chua co hoa don nao" + CTA "Them hoa don" — theo pattern FeedbackState cua VSP

2. **Gioi han so luong billing profile?**
   - Ly do: User co the co nhieu can ho, nhieu xe. Co gioi han max khong? Anh huong den UI scrolling va performance.
   - Default neu khong tra loi: Khong gioi han (nhung UI can handle scroll tot voi 20+ profiles)

3. **Co the add duplicate profile (cung ma can ho, cung VIN)?**
   - Ly do: Neu user add lai cung profile -> cho phep hay block?
   - Default neu khong tra loi: Block duplicate + hien thong bao "Profile nay da ton tai"

4. **Lich su thanh toan hien thi o dau va nhu the nao?**
   - Ly do: BRD co mockup "Lich su thanh toan" tren trang chu SBH (section "Xem tat ca") nhung khong dinh nghia man chi tiet lich su.
   - Default neu khong tra loi: Man lich su rieng voi filter theo service/trang thai/thoi gian, reuse pattern TransactionListItem cua VSP

5. **Bill detail screen co CTA thanh toan rieng khong (thanh toan 1 bill tu detail)?**
   - Ly do: Cac reference UI (VGreen app) co nut "Pay Now" / "Pay All" tren detail. SBH co tuong tu khong hay bat buoc phai quay lai list de check + thanh toan?
   - Default neu khong tra loi: Co CTA "Thanh toan" tren bill detail de thanh toan nhanh 1 bill

6. **Push notification cho user khi co bill moi?**
   - Ly do: BRD noi PnL noti ve SBH (system-to-system), nhung khong noi SBH co push notification den user khong.
   - Default neu khong tra loi: Co push notification voi content: "[Service] - Hoa don moi: [Ten bill] - [Amount]"

7. **Sort order cua bills trong "Hoa don cua toi"?**
   - Ly do: Nhieu bills cua nhieu profiles. Sort theo gi? Due date? Ngay phat sinh? Qua han len truoc?
   - Default neu khong tra loi: Qua han len dau -> sap theo due date gan nhat -> moi nhat

8. **Trang thai "Dang xu ly" cho bill — co khong?**
   - Ly do: Khi user da thanh toan nhung callback chua xong, bill o trang thai gi? Van hien trong list khong?
   - Default neu khong tra loi: Bill chuyen sang "Dang xu ly" (khong cho thanh toan lai), sau khi callback thanh cong -> an khoi list

9. **Man result thanh toan hien thi gi?**
   - Ly do: BRD khong dinh nghia result screen. VSP co shared Result template (40013468:41558). SBH dung chung hay co layout rieng (vi multi-bill)?
   - Default neu khong tra loi: Reuse VSP Result template. Neu multi-bill: hien summary (X thanh cong, Y that bai) + link xem chi tiet

10. **"Thanh toan tu dong" tab hien gi khi chua co profile nao?**
    - Ly do: Mockup chi hien khi da co profiles. Empty state chua dinh nghia.
    - Default neu khong tra loi: Illustration + "Them hoa don de cai dat thanh toan tu dong" + CTA "Them hoa don"

11. **Khi user tat thanh toan tu dong, co can confirm khong?**
    - Ly do: Tranh viec user tat nham. BRD khong de cap flow tat/sua auto payment.
    - Default neu khong tra loi: Confirm dialog "Ban co chac muon tat thanh toan tu dong cho [service]?" + 2 CTA

12. **Validation error messages cu the cho tung loai input?**
    - Ly do: BRD noi "thong tin khong hop le" nhung khong chi tiet message.
    - Default neu khong tra loi: "Ma can ho khong ton tai", "So VIN khong hop le", "Ma hoc sinh khong tim thay" — inline error duoi input field

13. **Entry point vao SBH miniapp tu dau?**
    - Ly do: BRD noi "User truy cap miniapp Smart Billing Hub" nhung khong noi entry point. Tu Home quick action? Tu Payment Hub? Tu VAS section?
    - Default neu khong tra loi: Payment Hub (VAS section) + Home quick action shortcut

14. **Refund flow hien thi the nao cho user?**
    - Ly do: BRD noi khi Billing Aggregator tu choi callback -> refund. User thay gi? Push notification? In-app message? Trang thai bill thay doi?
    - Default neu khong tra loi: Push notification "Hoa don [X] da duoc hoan tien" + bill trang thai "Da hoan tien" trong lich su

15. **VGreen: "Taxi Xanh" la loai phuong tien rieng — co bill types gi?**
    - Ly do: BRD liet ke Taxi Xanh trong dropdown loai phuong tien nhung khong liet ke bill types tuong ung (chi co Sac pin o to, Thue Pin o to, Tra gop, Sac xe may, Thue xe may, Sac GSM). Taxi Xanh dung cung bill types nhu o to hay co rieng?
    - Default neu khong tra loi: Taxi Xanh dung cung bill types nhu O to (sac pin + thue pin)

---

### AI ASSUMPTIONS (se dung neu PO skip)

1. **Loading states theo pattern VSP** — Skeleton loading cho list bills, spinner overlay cho action (thanh toan, add profile). Ly do: VSP da co pattern loading chuan (ref: ux-knowledge.md Loading Pattern).

2. **Error screen theo pattern VSP** — Illustration + title + body + CTA "Thu lai" / "Ve trang chu". Ly do: VSP co Error Screen Pattern chuan da document.

3. **Network error / timeout hien dialog retry** — "Khong the ket noi. Vui long thu lai." + CTA "Thu lai". Ly do: Edge case library bat buoc handle network lost mid-flow.

4. **Back navigation: ChevronLeft quay lai man truoc** — khong ve Home. Ly do: Golden rule #6 + VSP navigation pattern.

5. **Currency format: locale VN (1.000.000 d)** — tat ca so tien hien thi theo chuan. Ly do: Edge case library Financial Specific.

6. **Double tap prevention** — Disable button sau tap lan 1 cho tat ca CTA (Add profile, Thanh toan, Xac nhan). Ly do: Edge case library Form Input + Confirmation.

7. **Session timeout 5 phut** — Neu user o man confirm qua lau, re-fetch bill data truoc khi proceed. Ly do: Bill amount co the thay doi (phi phat sinh them).

8. **"Chon tat ca" checkbox o header** — Toggle select/deselect tat ca bills hien thi. Count hien o CTA: "Thanh toan (N)". Ly do: Mockup page 16 da cho thay pattern nay.

9. **Tong tien cap nhat realtime khi check/uncheck** — Sticky bottom bar hien tong tien + CTA. Ly do: Mockup page 16 co "Tong tien: 4.400.000 d" va "Thanh toan (3)".

10. **Khong cho thanh toan bill co amount = 0** — Checkbox disabled cho bill 0 dong. Ly do: Edge case library Financial Specific.

11. **Auto payment chay hang ngay vao 9h sang** — Cung thoi diem voi recurring bill job. Ly do: Hop ly ve mat he thong, tranh chay nhieu job.

12. **Pull-to-refresh tren "Hoa don cua toi"** — Re-fetch bills tu tat ca profiles. Ly do: Edge case library List/Dashboard pattern.

13. **Profile card co indicator so bill chua thanh toan** — Badge hoac so nho canh ten profile. Ly do: Giup user nhanh chong thay profile nao can chu y.

14. **Khi add profile validation fail, hien inline error duoi input** — Khong dung dialog/toast. Ly do: VSP pattern Form Input — inline validation.

15. **Dark mode supported** — Tat ca man hinh SBH dung semantic tokens, khong hardcode color. Ly do: Golden rule #9.

16. **Auto payment: neu ngay thanh toan la ngay nghi/le, van chay binh thuong** — Khong dich chuyen ngay. Ly do: BRD khong de cap logic ngay nghi.

17. **Max 3 nguon tien thanh toan trong priority list** — Vi phase nay chi co 2 loai (the + VSP wallet), gioi han 3 de du cho tuong lai. Ly do: UI can gioi han de khong tran man hinh.

18. **Khi bill da thanh toan o nguon khac (VD: app VGreen truc tiep), bill tu dong bien mat khoi SBH** — He thong phat hien qua callback/re-fetch. Ly do: BRD Case 2 cho recurring da de cap tinh huong nay.

---

## Cross-reference voi VSP hien tai

### Flows tuong tu da co
- **Thanh toan hoa don (VAS):** VSP da co flow "Hub -> Chon dich vu -> Ma KH -> Fetch bill -> Confirm -> Auth -> Result" (node `40002431:144546`). SBH co the reuse pattern nhung khac o cho multi-select va routing nhieu terminal.
- **Ket qua giao dich:** Shared Result template (node `40013468:41558`) — dung lai cho SBH.
- **Xac thuc giao dich:** PIN/Biometric flow (node `40004769:73935`) — can confirm co ap dung cho SBH khong.

### Gap voi existing patterns
- VSP hien tai chua co flow nao co multi-select payment (chon nhieu item thanh toan cung luc)
- VSP chua co flow nao co auto payment / recurring payment config
- VSP chua co miniapp architecture (SBH la miniapp dau tien?)
- Pattern "Thanh toan tap trung" hoan toan moi — chua co reference trong VSP

### Edge cases can handle (tu edge-case-library.md)
- **Form Input:** Empty state, validation error inline, max length (64 cho ma can ho), paste clipboard, loading submit, API error, duplicate prevention
- **List/Dashboard:** Empty (no bills), loading skeleton, fetch error, pull-to-refresh, pagination (neu nhieu bills)
- **Confirmation:** Loading fetch, ready, fetch error, price changed (bill amount update), session timeout, double tap
- **Auth PIN:** Full flow neu SBH yeu cau PIN
- **Result:** Success voi details, failed retryable/non-retryable, pending/processing
- **Financial:** Amount = 0 block, currency format, fee display truoc confirm
- **Navigation:** Deep link entry, back button, app kill mid-flow, network lost, dark mode

---

## Risk flags

1. **API chua san sang** — Ca 3 PnL deu chua co API rieng cho SBH, can custom them. Risk: API response format co the thay doi, anh huong UI.
2. **Multi-terminal payment chua co precedent** — VSP chua lam flow thanh toan qua nhieu terminal trong 1 session. Can PO/Tech confirm kha thi.
3. **Bill type da dang** — 6+ loai bill voi detail structure khac nhau. Risk: moi lan them bill type moi phai update UI.
4. **Vinschool detail thieu** — Chi co ten 3 loai bill, khong co structure. Risk: block UI design cho 1/3 services.
5. **"Thanh toan tap trung" chua dinh nghia** — Day la man quan trong nhat cua flow thanh toan nhung BRD chi de cap ten, khong co mockup hay spec.

---

> **Next step:** Vi (OpenClaw) relay analysis nay cho PO. Cho PO tra loi MUST questions -> ghi vao `answers.md` -> proceed step-03 (flow design).

---
Back: [[features/index|Features]] · [[features/smart-billing-hub/status|smart-billing-hub]]
