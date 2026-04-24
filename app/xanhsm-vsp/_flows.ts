/* Mermaid flow charts per epic — hiển thị trong Flow tab của browser.
 * Theo pattern quy-nhom: dùng classDef ep/sc/dc/ok/fl để color nodes.
 */

export const FLOW_CHARTS: Record<string, string> = {
  e3: `flowchart TD
  A[Home Xanh SM] --> B[Tap Tài khoản]
  B --> C[Profile · Kỳ Sự Xanh]
  C --> D{Có VSP?}
  D -->|Không| E[Kích hoạt PIN]
  D -->|Có| F[T&C fullscreen]
  E --> F
  F --> G[Success +50K]
  G --> H[Wallet · progress 3 step]
  H --> I{Đủ 3 bước?}
  I -->|Chưa| J[Prompt KYC/Bank]
  I -->|Đủ| K[Hiện services Xanh]
  classDef ep fill:#0b4a38,stroke:#0b4a38,color:#fff,font-weight:700
  classDef sc fill:#c9e7e8,stroke:#0b5457,color:#0b4a38,stroke-width:2px,font-weight:700
  classDef dc fill:#ffffff,stroke:#0b5457,color:#0b4a38,stroke-width:2.5px,font-weight:700
  classDef ok fill:#c7edd0,stroke:#16a34a,color:#064e3b,stroke-width:2px,font-weight:700
  classDef fl fill:#fecaca,stroke:#dc2626,color:#7f1d1d,stroke-width:2px,font-weight:700
  class A,K ep
  class B,C,E,F,H,J sc
  class D,I dc
  class G ok`,
}
