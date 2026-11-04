"use client";

import { useState } from "react";
import { ArrowDownToLine, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { TextField } from "@/components/ui/text-field";

export function VPointWallet() {
  const [balance, setBalance] = useState(12450);
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const value = Number(amount);
  const invalid = !Number.isSafeInteger(value) || value <= 0;
  const insufficient = action === "withdraw" && value > balance;
  const open = (next: "deposit" | "withdraw") => { setAmount(""); setMessage(""); setAction(next); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (invalid || insufficient || !Number.isSafeInteger(balance + value)) return;
    setBalance(current => action === "deposit" ? current + value : current - value);
    setMessage(`Đã ${action === "deposit" ? "nạp" : "rút"} ${value.toLocaleString("vi-VN")} VPoint minh họa.`);
    setAction(null);
  };
  return <>
    <section className="rk-vpoint px-[22px]" aria-label="Ví VPoint">
      <div><p>VPoint của bạn</p><strong>{balance.toLocaleString("vi-VN")} <small>VPoint</small></strong><span>Số dư minh họa</span></div>
      <div className="rk-vpoint-actions"><Button variant="secondary" size="32" onClick={() => open("deposit")}><Plus size={16}/>Nạp</Button><Button variant="secondary" size="32" onClick={() => open("withdraw")}><ArrowDownToLine size={16}/>Rút</Button></div>
      {message && <p className="rk-vpoint-message" role="status">{message}</p>}
    </section>
    {action && <div className="rk-vpoint-dialog"><BottomSheet open onClose={() => setAction(null)} className="rk-vpoint-sheet"><form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="vpoint-action-title"><header><h2 id="vpoint-action-title">{action === "deposit" ? "Nạp" : "Rút"} VPoint</h2><Button variant="secondary" size="32" aria-label="Đóng" type="button" onClick={() => setAction(null)}><X size={18}/></Button></header><p>Số dư: {balance.toLocaleString("vi-VN")} VPoint</p><TextField aria-label="Số VPoint" label="Số VPoint" inputMode="numeric" type="number" min="1" step="1" autoFocus value={amount} onChange={event => setAmount(event.target.value)} error={insufficient ? "Số VPoint vượt quá số dư hiện có" : amount && invalid ? "Nhập số VPoint nguyên lớn hơn 0" : undefined}/><p>Thao tác minh họa, chưa nạp hoặc rút VPoint thật.</p><Button variant="primary" size="48" type="submit" disabled={invalid || insufficient || !Number.isSafeInteger(balance + value)}>Xác nhận {action === "deposit" ? "nạp" : "rút"}</Button></form></BottomSheet></div>}
  </>;
}
