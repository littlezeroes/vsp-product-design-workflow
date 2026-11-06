"use client";

import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DailyIcon } from "@/components/vinclub/daily-icons";

export function AiBooking({ kind, onDismiss }: { kind: "ride" | "food"; onDismiss: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const isRide = kind === "ride";
  return <Card className="vc-ai-booking rounded-28 border-0 shadow-none p-0 gap-0" aria-label={isRide ? "Xác nhận đặt xe" : "Xác nhận đặt đồ ăn"}>
    <div className="vc-ai-booking-body">
      <div className="vc-ai-confirm-heading"><DailyIcon name={isRide ? "car" : "food"} size={48}/><div><h2 className="text-base font-semibold">{isRide ? "Xanh SM Car" : "Mì rau củ · Bếp Nhà"}</h2><p className="text-xs text-foreground-secondary mt-[4px]">{isRide ? "4 chỗ · Đón sau 4 phút" : "1 phần · Giao trong 20–30 phút"}</p></div></div>
      <div className="vc-ai-summary rounded-14">
        <p><MapPin size={15}/>{isRide ? "S2.01, Ocean Park → Vincom Mega Mall Ocean Park" : "Giao đến S2.01, Vinhomes Ocean Park"}</p>
        <div><span>Thanh toán VinPay</span><strong>{isRide ? "58.000đ" : "74.000đ"}</strong></div>
        {!isRide && <p>Đã gồm phí giao hàng 15.000đ</p>}
      </div>
      {confirmed ? <p role="status" className="vc-ai-confirm-status"><Check size={16}/>Đã xác nhận {isRide ? "chuyến xe" : "đơn ăn"} thử.</p> : <div className="vc-ai-confirm-actions"><Button variant="secondary" className="vc-ai-flow-next" onClick={() => setConfirmed(true)}>{isRide ? "Xác nhận đặt xe" : "Xác nhận đặt món"}</Button><Button variant="secondary" onClick={onDismiss}>Để sau</Button></div>}
      <p className="text-xs text-foreground-secondary mt-[12px]">Đặt thử trong bản trải nghiệm.</p>
    </div>
  </Card>;
}
