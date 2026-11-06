import type { Metadata } from 'next'
import { GlassGallery } from '../../glass-gallery'

export const metadata: Metadata = { title: 'VinClub — Glass → Home', description: 'Thân kính trong suốt, viền kim loại vàng riêng biệt, video nét cao và zoom 3D mở Home. VinClub by VSF.' }
export default function Page() { return <GlassGallery /> }
