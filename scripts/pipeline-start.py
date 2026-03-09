#!/usr/bin/env python3
"""V-Smart Pay Design Team — Pipeline startup splash screen."""
import sys
import os
import time
from datetime import datetime

# ── Colors ──
R  = "\033[0m"      # reset
B  = "\033[1m"      # bold
D  = "\033[2m"      # dim
CY = "\033[36m"     # cyan
GR = "\033[32m"     # green
YL = "\033[33m"     # yellow
RD = "\033[31m"     # red
MG = "\033[35m"     # magenta
BL = "\033[34m"     # blue
WH = "\033[97m"     # white
GY = "\033[90m"     # gray

W = 62

def ln(ch="─"):
    return f"{GY}{ch * W}{R}"

def cen(text, w=W):
    # strip ANSI for length calc
    import re
    clean = re.sub(r'\033\[[0-9;]*m', '', text)
    pad = (w - len(clean)) // 2
    return " " * max(0, pad) + text

def splash():
    # pixel art logo
    logo = f"""
{GY}                ╔══════════════════╗{R}
{GY}                ║{R}  {CY}{B}╦  ╦{R}{WH}{B}╔═╗╔╦╗╔═╗╦═╗╔╦╗{R}  {GY}║{R}
{GY}                ║{R}  {CY}{B}╚╗╔╝{R}{WH}{B}╚═╗║║║╠═╣╠╦╝ ║{R}   {GY}║{R}
{GY}                ║{R}  {CY}{B} ╚╝{R} {WH}{B}╚═╝╩ ╩╩ ╩╩╚═ ╩{R}   {GY}║{R}
{GY}                ║{R}          {CY}{B}P A Y{R}          {GY}║{R}
{GY}                ╚══════════════════╝{R}"""

    print(logo)
    print()
    print(cen(f"{WH}{B}D E S I G N   T E A M{R}"))
    print()

def team():
    members = [
        ("🤖", "Vi",   "Design Lead",       CY),
        ("🔍", "Nate", "UX Researcher",     GR),
        ("👹", "Đức",  "UX Reviewer",       RD),
        ("🎨", "Ivy",  "UI Designer",       MG),
        ("📋", "Khoa", "QA Design",         YL),
    ]
    for emoji, name, role, color in members:
        print(f"  {emoji}  {color}{B}{name:<6}{R} {role}")
    print()

def pipeline_mini():
    print(f"  {GR}A{R} Understand  {D}→{R}  {YL}B{R} Plan  {D}→{R}  {MG}C{R} Build  {D}→{R}  {GR}{B}✓ Ship{R}")
    print(f"  {D}11 steps · 4 checkpoints · 5 agents{R}")
    print()

def arch():
    print(f"  {GR}▸{R} {B}Tại bàn{R}   Claude Code {D}(Vi + agents){R}  {GR}FREE{R}")
    print(f"  {YL}▸{R} {B}Ra ngoài{R}  Vi Telegram {D}(status only){R}  {D}~$2/mo{R}")
    print()

def features():
    features_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".claude", "features")
    if not os.path.exists(features_dir):
        return
    dirs = sorted([f for f in os.listdir(features_dir) if os.path.isdir(os.path.join(features_dir, f))])
    if not dirs:
        return

    print(ln())
    print()
    print(f"  {WH}{B}FEATURES{R}")
    print()
    for f in dirs:
        status_file = os.path.join(features_dir, f, "status.md")
        if os.path.exists(status_file):
            with open(status_file, "r") as sf:
                for l in sf:
                    if l.startswith("## Current"):
                        current = l.replace("## Current:", "").strip()
                        print(f"  {CY}●{R} {B}{f}{R}  {D}— {current}{R}")
                        break
        else:
            files = [x for x in os.listdir(os.path.join(features_dir, f)) if x.endswith(".md")]
            print(f"  {D}○{R} {B}{f}{R}  {D}— {len(files)} files{R}")
    print()

def footer():
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    stack = "Next.js 16 · TypeScript · Tailwind v4 · CVA"
    print(ln("━"))
    print(f"  {D}{stack}{R}")
    print(f"  {D}{now} · Powered by Claude Max · Cost: $0{R}")
    print()

def shortcuts():
    print(f"  {D}Gửi BRD hoặc nói tên feature để bắt đầu pipeline{R}")
    print()

def main():
    print()
    print(ln("━"))
    splash()
    print(ln())
    print()
    print(f"  {WH}{B}TEAM{R}")
    print()
    team()
    pipeline_mini()
    arch()
    features()
    footer()
    shortcuts()

if __name__ == "__main__":
    main()
