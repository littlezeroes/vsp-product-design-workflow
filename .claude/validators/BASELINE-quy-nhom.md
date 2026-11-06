# Baseline: Quỹ Nhóm — 2026-04-18

Feature: `app/quy-nhom/` (13/13 screens done theo memory)

## Overall

| Metric | Value |
|---|---|
| Token compliance | ✗ **0/100** (177 errors, 4 warnings) |
| 22px alignment | ✗ **96/100** (4 elements off axis, 2 là mock "9:41" status bar) |
| **Avg score** | **48/100** |

## Breakdown — token-compliance

| Rule | Count | Severity |
|---|---|---|
| raw-hex | ~107 | error |
| inline-color-style | 52 | error |
| raw-radius | 9 | error |
| content-column-padding | 4 | warn |

Top offending files:
- `app/quy-nhom/list/page.tsx` — 3 raw hex + 1 inline style
- `app/quy-nhom/moi/page.tsx` — 5+ raw hex + 2 raw radius
- `app/quy-nhom/dashboard/page.tsx` — 2 raw radius + 4 raw hex
- Các file còn lại ít hơn

## Breakdown — alignment-22px

| Route | Elements | Violations |
|---|---|---|
| /quy-nhom | 39 | 0 ✓ |
| /quy-nhom/dashboard | 31 | 0 ✓ |
| /quy-nhom/moi | 36 | 0 ✓ |
| /quy-nhom/gop | 12 | 1 (status bar mock) |
| /quy-nhom/list | 36 | 0 ✓ |
| /quy-nhom/history | — | UNREACHABLE (route không tồn tại?) |
| /quy-nhom/settings | 25 | 1 (status bar mock) |

**Real violations: 0** — 2 violation hiện tại đều là mock "9:41" iPhone status bar (known false-positive của v1 heuristic).

## Đọc ra gì từ baseline

1. **Alignment axis work tốt** — 179 text elements checked, 0 real violation. Kỷ luật 22px được giữ.
2. **Token compliance fail nặng** — code base hiện tại có 177 raw hex + inline style + raw radius. Quỹ Nhóm build nhanh theo Cash App exploration style → nhiều exception hardcoded.
3. **/quy-nhom/history unreachable** — route có trong file tree nhưng không serve được. Có thể route path khác hoặc missing page.tsx.

## Insight — validator prove lesson rồi

- **Code đã "done" theo review human** (memory: 13/13 screens) vẫn **fail mechanical validator**.
- Đây là **đúng use case** cho bitter-lesson loop: AI có thể loop fix 177 violation này tự động, không cần Huy dính tay.
- Human-time tiết kiệm = ~2-4h nếu manual fix.

## Next steps

1. Fix `raw-hex` + `inline-color-style` trong Quỹ Nhóm qua AI loop — **test thực tế xem loop fix work không**
2. Re-run validator → score phải đạt ≥ 90
3. Nếu work → rollout pattern ra feature mới qua `/design-v2`
4. Nếu không work → điều chỉnh rule weights hoặc thêm skipIf

## Commands

```bash
# Static only (fast)
npm run validate:tokens app/quy-nhom

# Runtime only (needs npm run dev)
npm run validate:align

# Both (full suite)
npm run validate app/quy-nhom /quy-nhom
```
