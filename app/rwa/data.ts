/* ── RWA Mock Data ─────────────────────────────────────────────────── */

export interface RwaProject {
  id: string
  name: string
  tokenName: string
  location: string
  image: string
  tokenPrice: number
  expectedYield: number
  totalSupply: number
  soldCount: number
  investors: number
  startDate: string
  endDate: string
  status: "open" | "coming-soon" | "closed"
  description: string
  area: string
  developer: string
  properties: RwaProperty[]
}

export interface RwaProperty {
  id: string
  name: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  floor: number
  type: "apartment" | "villa" | "penthouse" | "shophouse"
  projectId: string
  image: string
  tokensRequired: number
  redemptionStatus: "coming-soon" | "available" | "redeemed"
}

export interface RwaCampaign {
  id: string
  projectId: string
  name: string
  status: "open" | "coming-soon" | "calculating" | "completed" | "cancelled"
  targetAmount: number
  raisedAmount: number
  startDate: string
  endDate: string
  commitmentCount: number
  allocationRatio?: number
}

export interface RwaHolding {
  id: string
  projectId: string
  shares: number
  avgPrice: number
  currentValue: number
  profitPct: number
  status: "active" | "pending" | "locked"
  lockDaysLeft?: number
}

export interface RwaTransaction {
  id: string
  projectId: string
  type: "register" | "allocate" | "refund" | "transfer"
  amount: number
  shares?: number
  date: string
  status: "pending" | "success" | "refunded" | "failed"
}

export interface RwaUserProfile {
  name: string
  phone: string
  totalBalance: number
}

/* ── Projects ──────────────────────────────────────────────────────── */
export const PROJECTS: RwaProject[] = [
  {
    id: "vgp-s12",
    name: "Vinhomes Grand Park Tower S12",
    tokenName: "VGP-S12",
    location: "Quận 9, TP. Hồ Chí Minh",
    image: "/rwa/vgp-s12.jpg",
    tokenPrice: 5_000_000,
    expectedYield: 8.5,
    totalSupply: 10_000,
    soldCount: 7_850,
    investors: 1_247,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    status: "open",
    description:
      "Tòa S12 thuộc phân khu The Origami, Vinhomes Grand Park. Vị trí đắc địa, tiện ích đầy đủ, kết nối thuận lợi đến trung tâm TP.HCM.",
    area: "68.5 m² – 95 m²",
    developer: "Vingroup",
    properties: [
      {
        id: "s12-05-t12",
        name: "S12.05, Tầng 12 – Căn hộ Vinhomes Grand Park",
        price: 3_500_000_000,
        area: 68.5,
        bedrooms: 2,
        bathrooms: 2,
        floor: 12,
        type: "apartment",
        projectId: "vgp-s12",
        image: "/rwa/prop-1.jpg",
        tokensRequired: 700,
        redemptionStatus: "coming-soon",
      },
      {
        id: "s12-08-t15",
        name: "S12.08, Tầng 15 – Căn hộ Vinhomes Grand Park",
        price: 4_200_000_000,
        area: 82,
        bedrooms: 3,
        bathrooms: 2,
        floor: 15,
        type: "apartment",
        projectId: "vgp-s12",
        image: "/rwa/prop-2.jpg",
        tokensRequired: 840,
        redemptionStatus: "coming-soon",
      },
    ],
  },
  {
    id: "eco-b6",
    name: "Ecopark Hai Dương Villa B6",
    tokenName: "ECO-B6",
    location: "Văn Giang, Hưng Yên",
    image: "/rwa/eco-b6.jpg",
    tokenPrice: 10_000_000,
    expectedYield: 10.2,
    totalSupply: 5_000,
    soldCount: 2_100,
    investors: 432,
    startDate: "2026-02-15",
    endDate: "2026-06-30",
    status: "open",
    description:
      "Biệt thự B6 thuộc khu đô thị sinh thái Ecopark Hải Dương, không gian xanh, chuẩn resort 5 sao.",
    area: "200 m² – 350 m²",
    developer: "Ecopark Group",
    properties: [
      {
        id: "b6-12",
        name: "B6.12 – Biệt thự Ecopark Hải Dương",
        price: 8_500_000_000,
        area: 220,
        bedrooms: 4,
        bathrooms: 3,
        floor: 1,
        type: "villa",
        projectId: "eco-b6",
        image: "/rwa/prop-3.jpg",
        tokensRequired: 850,
        redemptionStatus: "coming-soon",
      },
    ],
  },
  {
    id: "masteri-t5",
    name: "Masteri Thảo Điền T5",
    tokenName: "MST-T5",
    location: "Quận 2, TP. Hồ Chí Minh",
    image: "/rwa/masteri-t5.jpg",
    tokenPrice: 8_000_000,
    expectedYield: 7.8,
    totalSupply: 8_000,
    soldCount: 8_000,
    investors: 890,
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    status: "closed",
    description:
      "Tòa T5 Masteri Thảo Điền, dự án cao cấp tại trung tâm Thảo Điền, Quận 2.",
    area: "70 m² – 110 m²",
    developer: "Masterise Homes",
    properties: [],
  },
  {
    id: "lm81-sky",
    name: "Landmark 81 SkyVilla",
    tokenName: "LM81-SKY",
    location: "Bình Thạnh, TP. Hồ Chí Minh",
    image: "/rwa/lm81.jpg",
    tokenPrice: 20_000_000,
    expectedYield: 12.5,
    totalSupply: 3_000,
    soldCount: 0,
    investors: 0,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    status: "coming-soon",
    description:
      "SkyVilla tầng cao tại Landmark 81, tòa nhà cao nhất Việt Nam. Dự án siêu cao cấp dành cho nhà đầu tư lớn.",
    area: "150 m² – 300 m²",
    developer: "Vingroup",
    properties: [],
  },
]

/* ── Campaigns ─────────────────────────────────────────────────────── */
export const CAMPAIGNS: RwaCampaign[] = [
  {
    id: "camp-vgp-3",
    projectId: "vgp-s12",
    name: "VGP Tower S12 — Đợt 3",
    status: "open",
    targetAmount: 25_000_000_000,
    raisedAmount: 37_500_000_000,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    commitmentCount: 245,
  },
  {
    id: "camp-eco-1",
    projectId: "eco-b6",
    name: "Ecopark B6 — Đợt 1",
    status: "open",
    targetAmount: 50_000_000_000,
    raisedAmount: 21_000_000_000,
    startDate: "2026-02-15",
    endDate: "2026-06-30",
    commitmentCount: 68,
  },
  {
    id: "camp-masteri-2",
    projectId: "masteri-t5",
    name: "Masteri T5 — Đợt 2",
    status: "completed",
    targetAmount: 40_000_000_000,
    raisedAmount: 48_000_000_000,
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    commitmentCount: 520,
    allocationRatio: 83,
  },
  {
    id: "camp-lm81-1",
    projectId: "lm81-sky",
    name: "Landmark 81 SkyVilla — Đợt 1",
    status: "coming-soon",
    targetAmount: 60_000_000_000,
    raisedAmount: 0,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    commitmentCount: 0,
  },
]

/* ── Portfolio / Holdings ──────────────────────────────────────────── */
export const HOLDINGS: RwaHolding[] = [
  {
    id: "hold-1",
    projectId: "masteri-t5",
    shares: 8,
    avgPrice: 8_000_000,
    currentValue: 69_600_000,
    profitPct: 8.7,
    status: "active",
  },
  {
    id: "hold-2",
    projectId: "vgp-s12",
    shares: 10,
    avgPrice: 5_000_000,
    currentValue: 50_000_000,
    profitPct: 0,
    status: "pending",
  },
]

/* ── Transactions ──────────────────────────────────────────────────── */
export const TRANSACTIONS: RwaTransaction[] = [
  {
    id: "tx-1",
    projectId: "vgp-s12",
    type: "register",
    amount: 50_000_000,
    shares: 10,
    date: "2026-03-02",
    status: "pending",
  },
  {
    id: "tx-2",
    projectId: "masteri-t5",
    type: "allocate",
    amount: 64_000_000,
    shares: 8,
    date: "2026-02-15",
    status: "success",
  },
  {
    id: "tx-3",
    projectId: "masteri-t5",
    type: "refund",
    amount: 16_000_000,
    date: "2026-02-15",
    status: "refunded",
  },
  {
    id: "tx-4",
    projectId: "eco-b6",
    type: "register",
    amount: 100_000_000,
    shares: 10,
    date: "2026-03-01",
    status: "pending",
  },
]

/* ── User Profile ──────────────────────────────────────────────────── */
export const USER: RwaUserProfile = {
  name: "Trần Mai Linh",
  phone: "0912 *** 789",
  totalBalance: 499_000_000,
}

/* ── User-Project Relationship ─────────────────────────────────────── */
export type UserProjectStatus = "none" | "whitelisted" | "committed"

export interface UserCommitment {
  projectId: string
  status: UserProjectStatus
  shares?: number
  amount?: number
}

export const USER_COMMITMENTS: UserCommitment[] = [
  { projectId: "vgp-s12", status: "committed", shares: 10, amount: 50_000_000 },
  { projectId: "eco-b6", status: "whitelisted" },
  { projectId: "masteri-t5", status: "committed", shares: 8, amount: 64_000_000 },
]

export function getUserCommitment(projectId: string): UserCommitment {
  return USER_COMMITMENTS.find((c) => c.projectId === projectId)
    ?? { projectId, status: "none" }
}

/* ── Helpers ───────────────────────────────────────────────────────── */
export function formatVND(n: number): string {
  return n.toLocaleString("vi-VN") + " đ"
}

export function formatVNDShort(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(".0", "") + " tỷ"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + " tr"
  return formatVND(n)
}

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id)
}

export function getCampaignsForProject(projectId: string) {
  return CAMPAIGNS.filter((c) => c.projectId === projectId)
}

export function getAllProperties(): RwaProperty[] {
  return PROJECTS.flatMap((p) => p.properties)
}
