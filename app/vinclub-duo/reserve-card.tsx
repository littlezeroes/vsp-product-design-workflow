"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DuoReserveCard({onWithdraw}:{onWithdraw:()=>void}) {
  return <Card className="duo-reserve-card rounded-28 border-0 shadow-none bg-secondary p-0 gap-0">
    <div className="duo-reserve-copy"><h2>Quỹ dự phòng</h2><p>15.000.000đ</p><Button variant="secondary" size="32" onClick={onWithdraw}>Rút quỹ</Button></div>
    <Image src="/vinclub-assets/payment-custom/reserve-glass-v1.webp" width={160} height={160} alt="Hũ quỹ dự phòng bằng kính" className="duo-reserve-image" />
  </Card>;
}
