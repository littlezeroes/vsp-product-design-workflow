'use client'

import { GlassLaunchPreview } from './glass-launch-preview'
import './glass-studies.css'

export default function PrismaticLaunch() {
  return <main className="glass-studies prism-fullscreen"><GlassLaunchPreview look="jewel-glass" paused={false} /></main>
}
