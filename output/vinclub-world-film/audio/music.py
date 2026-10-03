"""Original 120 BPM future-pop score for 'Cả thế giới trong tay bạn' + VO mix.
Writes audio/music.wav, audio/vo.wav, audio/final.wav (48 kHz stereo)."""
import json, pathlib, subprocess, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = pathlib.Path(__file__).parent
TL = json.loads((ROOT.parent / 'comp/timeline.json').read_text())
SR, DUR, BPM = 48000, TL['duration'], TL['bpm']
B = 60 / BPM                       # beat = .5s
N = int(SR * DUR)
rng = np.random.default_rng(3)
t_all = np.arange(N) / SR

def buf(): return np.zeros((N, 2))
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)
def place(bus, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0: return
    s = sig if sig.ndim == 2 else np.stack([sig * (1 - max(0, pan)), sig * (1 + min(0, pan))], 1)
    j = min(N, i + len(s)); k = max(0, -i)
    bus[max(0, i):j] += s[k:j - i] * gain
def env(n, a=.002, d=.2):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / a) * np.exp(-tt / d)
def note(m): return 440 * 2 ** ((m - 69) / 12)

# ── instruments ─────────────────────────────────────────────────────
def kick(len_=.45):
    n = int(len_ * SR); tt = np.arange(n) / SR
    f = 46 + 140 * np.exp(-tt * 38)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-tt * 7.5)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-tt * 260) * .25
    return np.tanh((body + click) * 1.6) * .9
def clap():
    n = int(.35 * SR); tt = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 900, 5000)
    e = sum(np.exp(-np.maximum(0, tt - o) * 140) * (tt >= o) for o in (0, .011, .022)) * .6 + np.exp(-tt * 18) * (tt >= .022) * .7
    return nz * e * .55
def hat(open_=False):
    n = int((.32 if open_ else .06) * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-tt * (12 if open_ else 70)) * (.22 if open_ else .16)
def shaker():
    n = int(.08 * SR); tt = np.arange(n) / SR
    return bp(rng.standard_normal(n), 5000, 12000) * np.sin(np.pi * np.minimum(1, tt / .08)) * .09
def saw(f, n, detune=0.0):
    ph = (np.arange(n) * f * (1 + detune) / SR + rng.random()) % 1
    return 2 * ph - 1
def supersaw(midis, n):
    out = np.zeros(n)
    for m in midis:
        for d in (-.012, -.006, 0, .006, .012):
            out += saw(note(m), n, d) * .11
    return out
def pluck(m, len_=.28, bright=3800):
    n = int(len_ * SR); tt = np.arange(n) / SR
    x = saw(note(m), n) * .6 + np.sign(np.sin(2 * np.pi * note(m) * tt)) * .25
    return lp(x * np.exp(-tt * 14), bright) * .5
def bell(m, len_=1.6, g=.35):
    n = int(len_ * SR); tt = np.arange(n) / SR; f = note(m)
    x = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * k) for r, a, k in ((1, 1, 2.6), (2.76, .5, 4.5), (5.4, .25, 8), (8.93, .12, 11)))
    return x * np.minimum(1, tt / .002) * g
def sub(m, len_):
    n = int(len_ * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(m) * tt) + .25 * np.sin(4 * np.pi * note(m) * tt)
    return np.tanh(x * 1.4) * np.minimum(1, tt / .005) * np.minimum(1, (len_ - tt) / .02) * .5
def sweep_noise(len_, f0, f1, shape=1.0):
    n = int(len_ * SR); x = rng.standard_normal(n); out = np.zeros(n); blk = 512
    for i in range(0, n, blk):
        q = (i / n) ** shape; f = f0 * (f1 / f0) ** q
        lo, hi = max(40, f * .6), min(SR / 2 - 100, f * 1.6)
        out[i:i + blk] = bp(x[i:i + blk], lo, hi, 1)
    return out
def riser(len_):
    n = int(len_ * SR); tt = np.arange(n) / SR
    nz = sweep_noise(len_, 300, 9000, 1.6) * (tt / len_) ** 2 * .9
    f = 220 * 2 ** (2 * tt / len_)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / len_) ** 3 * .18
    return nz + tone
def whoosh(len_=.7):
    n = int(len_ * SR); tt = np.arange(n) / SR
    up = sweep_noise(len_, 400, 7000, .8)
    return up * np.sin(np.pi * tt / len_) ** 2 * .9
def impact(len_=2.2):
    n = int(len_ * SR); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-tt * 9)) / SR) * np.exp(-tt * 2.2)
    crack = lp(rng.standard_normal(n), 2500) * np.exp(-tt * 9) * .5
    return np.tanh((boom + crack) * 1.5) * .8
def coin():
    out = np.zeros(int(1.2 * SR))
    for k, m in enumerate((88, 95)):
        b = bell(m, 1.0, .3); i = int(k * .07 * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out

# ── harmony: F#m – D – A – E (one chord per bar) ───────────────────
CH = [(66, 69, 73), (62, 66, 69), (61, 64, 69), (64, 68, 71)]   # voicings
ROOTS = [42, 38, 45, 40]
ARP = [[66, 69, 73, 78], [66, 69, 74, 78], [64, 69, 73, 76], [64, 68, 71, 76]]
def bar(tm): return int(tm // (4 * B)) % 4

drums, bass, chords, lead, fx, pad = buf(), buf(), buf(), buf(), buf(), buf()
K = kick(); C = clap(); HC = hat(); HO = hat(True); SH = shaker()

def in_(tm, *ranges): return any(a <= tm < b for a, b in ranges)
GROOVE = ((14, 82), (88.75, 91.9), (100, 104))
LIGHT_KICK = ((6.3, 10),)

for i in range(int(DUR / (B / 4))):
    tm = i * B / 4; step = i % 16; beat_i = i // 4
    if tm >= 91.95 and tm < 100: continue
    full = in_(tm, *GROOVE)
    if step % 4 == 0 and (full or in_(tm, *LIGHT_KICK)):
        place(drums, K, tm, .95 if full else .55)
    if full and step % 8 == 4: place(drums, C, tm, .9, .05)
    if full and step % 4 == 2: place(drums, HO, tm, .8, .25)
    if (full or in_(tm, (2, 10))) and step % 2 == 1: place(drums, HC, tm, .8 if full else .5, -.3)
    if full and in_(tm, (26, 82)) and step % 2 == 0: place(drums, SH, tm, 1, .4)
    if full and in_(tm, (66, 76)) and step in (3, 11, 14): place(drums, HC, tm, 1.2, .5)
    # sub bass: off-beat 8ths
    if full and step % 4 == 2:
        place(bass, sub(ROOTS[bar(tm)], B / 2 * .9), tm, .9)
    if full and step % 4 == 0 and in_(tm, (20, 82), (88.75, 92)):
        place(bass, sub(ROOTS[bar(tm)] + 12, .12), tm, .25)
    # pluck arp 16ths
    if in_(tm, (20, 82), (88.75, 92), (100, 104)) or in_(tm, (0.5, 10)) and step % 2 == 0:
        a = ARP[bar(tm)]; m = a[step % 4] + (12 if in_(tm, (46, 56), (66, 76)) and step % 8 >= 4 else 0)
        place(lead, pluck(m, .26, 2400 if tm < 14 else 4200), tm, .55 if tm >= 14 else .35, (.35 if step % 2 else -.35))
    if in_(tm, (82, 88.75)) and step % 2 == 0:
        a = ARP[bar(tm)]; place(lead, pluck(a[(step // 2) % 4] + 12, .4, 3000), tm, .4, (.3 if step % 4 else -.3))

# chords: sidechained supersaw per bar
for b0 in np.arange(0, DUR, 4 * B):
    if 91.95 <= b0 < 100: continue
    n = int(4 * B * SR); s = supersaw(CH[bar(b0)], n) + supersaw([m - 12 for m in CH[bar(b0)]], n) * .5
    tt = np.arange(n) / SR
    if in_(b0, *GROOVE) or in_(b0, (82, 88.75)):
        duck = 1 - .75 * np.exp(-((tt % B)) * 9)
        s = lp(s, 5200 if in_(b0, (14, 92)) else 3200) * duck * (.55 if in_(b0, *GROOVE) else .4)
    else:
        cut = 500 + 2600 * min(1, max(0, (b0 - 10) / 4)) if b0 < 14 else 900
        s = lp(s, cut) * (.32 if b0 < 14 else .3)
    s *= np.minimum(1, tt / .01) * np.minimum(1, (4 * B - tt) / .02)
    place(chords, np.stack([s, np.roll(s, 240)], 1), b0, 1)

# warm pad under intro / omt / end
for a, b, g in ((0, 14, .22), (92.6, 100, .18), (100, DUR, .25)):
    n = int((b - a) * SR); tt = np.arange(n) / SR
    m = CH[0] if a < 90 else CH[2]
    x = sum(np.sin(2 * np.pi * note(k - 12) * tt + j) + .4 * np.sin(2 * np.pi * note(k) * 1.003 * tt) for j, k in enumerate(m))
    x = lp(x, 1500) * np.minimum(1, tt / 1.2) * np.minimum(1, (b - a - tt) / 1.0) * g / 3
    place(pad, x, a)

# intro: tile pops on beats + glitch stutters
for k, tm in enumerate([.5, 1.6, 3.2, 4.3, 4.6, 4.9, 5.2, 5.4, 5.6, 5.8, 6.0, 6.15]):
    place(fx, bell(81 + (k * 5) % 12, .5, .22), tm, 1, (k % 2) * .6 - .3)
for tm in np.arange(6.3, 9.8, 1.0):
    g = bp(rng.standard_normal(int(.09 * SR)), 1500, 6000) * .35
    for r in range(3): place(fx, g, tm + .25 + r * .045, .6)
# risers & impacts
place(fx, riser(3.8), 10.15, .9)
for i in range(16):  # snare roll 12–14 accelerating
    tm = 12 + 2 * (1 - (1 - i / 16) ** 1.6); place(drums, C, tm, .25 + i * .03)
place(fx, impact(3), 14.0, 1.1)
place(fx, riser(2.5), 86.25, .8)
place(fx, impact(2.4), 88.75, .9)
place(fx, impact(3.5), 100.0, 1.1)
for tm in TL['cuts']:
    if tm in (14, 92, 100): continue
    place(fx, whoosh(.7), tm - .45, .55, .2 if tm % 4 else -.2)
place(fx, whoosh(1.0), 55.2, .7)
# one more thing: coin flight & landing
for k, tm in enumerate(np.arange(96.0, 98.3, .25)):
    place(fx, bell(84 + [0, 4, 7, 11, 12, 16, 19, 23, 24, 28][k % 10], .6, .14), tm, 1, .3 if k % 2 else -.3)
place(fx, coin(), 98.4, 1.3)
place(fx, impact(1.5), 98.4, .35)
# final logo stinger
for m in (69, 73, 76, 81): place(fx, bell(m, 3.0, .22), 104.0)

# ── mix ─────────────────────────────────────────────────────────────
def reverb(x, secs=2.2, mix=.22):
    n = int(secs * SR); tt = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-tt * 3.2)[:, None]; ir = lp(ir, 6000)
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], 1)
    return x + wet / np.max(np.abs(wet) + 1e-9) * np.max(np.abs(x)) * mix
music = drums * 1.0 + bass * 1.0 + chords * .55 + lead * .55 + pad + fx * .8
music = reverb(music, 2.0, .18)
music = hp(music, 28)
# master fades
music *= np.minimum(1, t_all / .4)[:, None]
music[int(91.95 * SR):int(92.0 * SR)] *= np.linspace(1, 0, int(.05 * SR))[:, None]
music *= np.where(t_all > 105.2, np.clip(1 - (t_all - 105.2) / .8, 0, 1), 1)[:, None]
music /= np.max(np.abs(music)) / .8

# ── VO track + ducking ──────────────────────────────────────────────
import wave
vo = np.zeros(N); active = np.zeros(N)
for k, st in TL['vo'].items():
    with wave.open(str(ROOT / 'voice' / f'{k}.wav')) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    i = int(st * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i]; active[i:j] = 1
vo = hp(vo, 90)
# gentle presence lift + compression-ish
vo = vo + bp(vo, 2500, 6000) * .35
vo = np.tanh(vo * 2.2) / np.tanh(2.2)
smooth = np.convolve(active, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
duck = 1 - .4 * np.clip(smooth * 1.4, 0, 1)
final = music * duck[:, None] * .78 + np.stack([vo, vo], 1) * .95
final /= np.max(np.abs(final)) / .89

def save(path, x):
    x = np.clip(x, -1, 1); x16 = (x * 32767).astype(np.int16)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2 if x.ndim == 2 else 1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x16.tobytes())
save(ROOT / 'music.wav', music)
save(ROOT / 'vo.wav', vo / max(1e-9, np.max(np.abs(vo))) * .9)
save(ROOT / 'final-raw.wav', final)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(ROOT / 'final-raw.wav'), '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11', '-ar', '48000', str(ROOT / 'final.wav')], check=True)
print('audio done', DUR, 's')
