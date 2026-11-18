/* 絵描き人狼 — 演出（市民・人狼のエフェクト、効果音、振動）
 * 1台版・オンライン版の両方から読み込む。外部素材なし（CSS・Canvas・Web Audioのみ）。 */
(function () {
  'use strict';

  const CSS = `
.fx-layer{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}
.fx-layer canvas{position:absolute;inset:0;width:100%;height:100%}
.fx-layer.out{transition:opacity .6s ease;opacity:0}
.fx-flash{position:absolute;inset:0;opacity:0;animation:fxFlash .8s ease-out forwards}
.fx-flash.wolf{background:radial-gradient(circle at 50% 45%,#ff3b3baa,#5a0010dd 70%)}
.fx-flash.village{background:radial-gradient(circle at 50% 45%,#ffffffcc,#7ff0d466 45%,transparent 75%)}
@keyframes fxFlash{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
.fx-shake{animation:fxShake .55s cubic-bezier(.36,.07,.19,.97)}
@keyframes fxShake{10%,90%{transform:translate(-2px,1px)}20%,80%{transform:translate(4px,-2px)}30%,50%,70%{transform:translate(-8px,3px)}40%,60%{transform:translate(8px,-3px)}}
.fx-claws{position:absolute;inset:0;width:100%;height:100%;animation:fxFadeLate 2.6s ease forwards}
.fx-claws path{fill:none;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:fxClaw .28s cubic-bezier(.7,0,.3,1) forwards}
.fx-claws .c-out{stroke:#6b0010;filter:drop-shadow(0 0 10px #ff000099)}
.fx-claws .c-mid{stroke:#ff4545}
.fx-claws .c-core{stroke:#ffe1d6}
.fx-claws g:nth-of-type(2) path{animation-delay:.07s}.fx-claws g:nth-of-type(3) path{animation-delay:.14s}
@keyframes fxClaw{to{stroke-dashoffset:0}}
@keyframes fxFadeLate{0%,55%{opacity:1}100%{opacity:0}}
.fx-rays{position:absolute;left:50%;top:44%;width:220vmax;height:220vmax;margin:-110vmax 0 0 -110vmax;
  background:repeating-conic-gradient(from 0deg,#ffffff38 0deg 5deg,transparent 5deg 15deg);
  -webkit-mask:radial-gradient(circle,#000 0,transparent 42%);mask:radial-gradient(circle,#000 0,transparent 42%);
  opacity:0;animation:fxSpin 7s linear forwards,fxInOut 3.2s ease forwards}
.fx-rays.gold{background:repeating-conic-gradient(from 0deg,#ffd76a44 0deg 5deg,transparent 5deg 15deg)}
@keyframes fxSpin{to{transform:rotate(80deg)}}
@keyframes fxInOut{0%{opacity:0}20%{opacity:1}70%{opacity:1}100%{opacity:0}}
.fx-dim{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#00000055,#000000dd 75%);opacity:0;animation:fxIn .35s ease forwards}
.fx-heart{position:absolute;inset:0;box-shadow:inset 0 0 0 0 #ff000000;animation:fxHeart .75s ease-in-out infinite}
@keyframes fxHeart{0%,100%{box-shadow:inset 0 0 60px 10px #ff000000}20%{box-shadow:inset 0 0 120px 30px #ff1a1a55}40%{box-shadow:inset 0 0 60px 10px #ff000011}55%{box-shadow:inset 0 0 110px 26px #ff1a1a44}}
@keyframes fxIn{to{opacity:1}}
.fx-night{position:absolute;inset:0;background:linear-gradient(#05030cf0,#2a0610e6);opacity:0;animation:fxInOut 4.6s ease forwards}
.fx-moon{position:absolute;left:50%;bottom:-60vmin;width:52vmin;height:52vmin;margin-left:-26vmin;border-radius:50%;
  background:radial-gradient(circle at 38% 36%,#ffb199 0,#e0233d 45%,#7a0018 100%);
  box-shadow:0 0 90px 30px #ff1a3a77,0 0 200px 60px #ff1a3a33;animation:fxRise 1.8s cubic-bezier(.2,.8,.2,1) forwards,fxInOut 4.6s ease forwards}
@keyframes fxRise{to{bottom:44vh}}
.fx-eyes{position:absolute;left:50%;top:76%;transform:translateX(-50%);display:flex;gap:10vmin;opacity:0;animation:fxEyes 3.6s .9s ease forwards}
.fx-eyes i{display:block;width:11vmin;height:4.6vmin;border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%,#fff 0,#ffd23a 18%,#ff2d2d 42%,#8a0000 70%,transparent 72%);
  box-shadow:0 0 34px 10px #ff000077;transform:rotate(14deg)}
.fx-eyes i+i{transform:rotate(-14deg)}
@keyframes fxEyes{0%{opacity:0;transform:translateX(-50%) scaleY(.1)}15%{opacity:1;transform:translateX(-50%) scaleY(1)}45%{transform:translateX(-50%) scaleY(1)}50%{transform:translateX(-50%) scaleY(.08)}56%{transform:translateX(-50%) scaleY(1)}85%{opacity:1}100%{opacity:0}}
.fx-sun{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 115%,#fff3c4 0,#ffc977aa 28%,#4fd4b433 55%,transparent 75%);opacity:0;animation:fxSunrise 4.2s ease forwards}
@keyframes fxSunrise{0%{opacity:0;transform:translateY(30%)}25%{opacity:1;transform:none}75%{opacity:1}100%{opacity:0}}
.fx-flip{animation:fxFlip .7s cubic-bezier(.2,.9,.3,1.25) both}
@keyframes fxFlip{0%{transform:perspective(900px) rotateY(100deg) scale(.85);opacity:0}100%{transform:none;opacity:1}}
.fx-glow-wolf{animation:fxGlowW 1.6s ease-in-out infinite alternate}
.fx-glow-village{animation:fxGlowV 1.8s ease-in-out infinite alternate}
@keyframes fxGlowW{from{box-shadow:0 0 0 0 #ff4d4d00}to{box-shadow:0 0 36px 4px #ff4d4d77}}
@keyframes fxGlowV{from{box-shadow:0 0 0 0 #4fd4b400}to{box-shadow:0 0 36px 4px #4fd4b477}}
.fx-slam{animation:fxSlam .55s cubic-bezier(.2,1.6,.4,1) both}
@keyframes fxSlam{0%{transform:scale(2.6);opacity:0;filter:blur(6px)}60%{opacity:1;filter:none}100%{transform:scale(1);opacity:1}}
.fx-mute{display:inline-flex;align-items:center;gap:6px;border:1px solid #343c78;background:transparent;color:#a3aad8;border-radius:999px;padding:4px 10px;font:inherit;font-size:12px;min-height:32px;cursor:pointer}
.fx-mute svg{width:16px;height:16px}
@media (prefers-reduced-motion: reduce){.fx-flip,.fx-slam,.fx-shake,.fx-glow-wolf,.fx-glow-village{animation:none!important}}
`;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  let muted = store.get('ejr-muted', false);

  // ---------- 効果音（Web Audio で合成） ----------
  let ac = null;
  function audio() {
    if (muted) return null;
    try {
      if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); }
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return null; }
    return ac;
  }
  document.addEventListener('pointerdown', () => { if (!muted) audio(); }, { once: true, capture: true });

  function tone(a, { type = 'sine', f0, f1, t0 = 0, dur = .3, vol = .2, attack = .01, filter }) {
    const o = a.createOscillator(), g = a.createGain();
    const now = a.currentTime + t0;
    o.type = type;
    o.frequency.setValueAtTime(f0, now);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    let node = o;
    if (filter) { const fl = a.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = filter; o.connect(fl); node = fl; }
    node.connect(g); g.connect(a.destination);
    o.start(now); o.stop(now + dur + .05);
    return o;
  }
  function noise(a, { t0 = 0, dur = .25, vol = .3, from = 6000, to = 600 }) {
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = a.createBufferSource(); s.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    const now = a.currentTime + t0;
    f.frequency.setValueAtTime(from, now); f.frequency.exponentialRampToValueAtTime(to, now + dur);
    const g = a.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(a.destination);
    s.start(now);
  }
  const SFX = {
    tick() { const a = audio(); if (a) tone(a, { type: 'square', f0: 1400, dur: .04, vol: .05 }); },
    ping() { const a = audio(); if (!a) return; tone(a, { f0: 880, dur: .18, vol: .15 }); tone(a, { f0: 1320, t0: .1, dur: .3, vol: .12 }); },
    pick() { const a = audio(); if (!a) return; [523, 659, 784].forEach((f, i) => tone(a, { type: 'triangle', f0: f, t0: i * .07, dur: .35, vol: .14 })); },
    heartbeat() {
      const a = audio(); if (!a) return;
      [0, .22, .75, .97].forEach((t, i) => tone(a, { f0: i % 2 ? 50 : 62, f1: 38, t0: t, dur: .2, vol: .5, filter: 300 }));
    },
    slash() { const a = audio(); if (!a) return; [0, .07, .14].forEach(t => noise(a, { t0: t, dur: .18, vol: .35 })); },
    howl() {
      const a = audio(); if (!a) return;
      const base = a.currentTime;
      [0, 6].forEach((det, k) => {
        const o = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter(), lfo = a.createOscillator(), lg = a.createGain();
        o.type = 'sawtooth'; fl.type = 'lowpass'; fl.frequency.value = 1100;
        o.frequency.setValueAtTime(260 + det, base);
        o.frequency.exponentialRampToValueAtTime(520 + det, base + .55);
        o.frequency.setValueAtTime(520 + det, base + 1.2);
        o.frequency.exponentialRampToValueAtTime(300 + det, base + 2.1);
        lfo.frequency.value = 5.5; lg.gain.value = 9; lfo.connect(lg); lg.connect(o.frequency);
        g.gain.setValueAtTime(0.0001, base);
        g.gain.exponentialRampToValueAtTime(k ? .05 : .09, base + .3);
        g.gain.setValueAtTime(k ? .05 : .09, base + 1.5);
        g.gain.exponentialRampToValueAtTime(0.0001, base + 2.2);
        o.connect(fl); fl.connect(g); g.connect(a.destination);
        o.start(base); lfo.start(base); o.stop(base + 2.3); lfo.stop(base + 2.3);
      });
    },
    chime() { const a = audio(); if (!a) return; [1047, 1319, 1568, 2093].forEach((f, i) => tone(a, { f0: f, t0: i * .08, dur: .9, vol: .1 })); },
    doom() { const a = audio(); if (!a) return; [110, 131, 156].forEach(f => tone(a, { type: 'sawtooth', f0: f, dur: 2.2, vol: .06, attack: .25, filter: 700 })); tone(a, { f0: 55, dur: 2.4, vol: .25, attack: .05, filter: 200 }); },
    fanfare() {
      const a = audio(); if (!a) return;
      [[523, 0], [659, .12], [784, .24], [1047, .4]].forEach(([f, t]) => tone(a, { type: 'triangle', f0: f, t0: t, dur: .3, vol: .16 }));
      [523, 659, 784, 1047].forEach(f => tone(a, { type: 'triangle', f0: f, t0: .6, dur: 1.2, vol: .08 }));
    },
    vote() { const a = audio(); if (a) tone(a, { type: 'triangle', f0: 660, f1: 990, dur: .12, vol: .12 }); }
  };
  const buzz = p => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} };

  // ---------- レイヤーと粒子 ----------
  function layer(ms) {
    const el = document.createElement('div');
    el.className = 'fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 650); }, ms);
    return el;
  }
  function particles(host, ms, seed) {
    if (reduce()) return;
    const cv = document.createElement('canvas');
    host.appendChild(cv);
    const d = Math.min(2, window.devicePixelRatio || 1);
    const W = innerWidth, H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    const ctx = cv.getContext('2d'); ctx.scale(d, d);
    const ps = [];
    seed(ps, W, H);
    let last = performance.now(); const start = last;
    function frame(now) {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of ps) {
        if (p.delay > 0) { p.delay -= dt; alive++; continue; }
        p.life -= dt; if (p.life <= 0) continue; alive++;
        p.vy += (p.g || 0) * dt; p.vx *= p.drag || 1; p.vy *= p.drag || 1;
        p.x += p.vx * dt + (p.sway ? Math.sin((now - start) / 300 + p.ph) * p.sway * dt : 0);
        p.y += p.vy * dt; p.rot = (p.rot || 0) + (p.vr || 0) * dt;
        const a = Math.max(0, Math.min(1, p.life / (p.fade || .6)));
        ctx.globalAlpha = a;
        if (p.kind === 'conf') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.rot * 1.7));
          ctx.fillStyle = p.c; ctx.fillRect(-p.s, -p.s * .45, p.s * 2, p.s * .9); ctx.restore();
        } else if (p.kind === 'star') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
          ctx.shadowColor = p.c; ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) { const r = i % 2 ? p.s * .35 : p.s; const t = i * Math.PI / 4; ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r); }
          ctx.closePath(); ctx.fill(); ctx.restore();
        } else {
          ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
      if (alive && now - start < ms) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const R = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function embers(ps, W, H, n) {
    for (let i = 0; i < n; i++) ps.push({ kind: 'dot', x: R(0, W), y: H + R(0, 40), vx: R(-15, 15), vy: R(-200, -70), sway: 40, ph: R(0, 6), s: R(1.5, 4), c: pick(['#ff5a3c', '#ff2d2d', '#ffb04a']), life: R(1.6, 3.2), fade: 1, delay: R(0, 1.2) });
  }
  function sparkles(ps, cx, cy, n, colors) {
    for (let i = 0; i < n; i++) { const t = R(0, Math.PI * 2), v = R(120, 420); ps.push({ kind: pick(['star', 'dot']), x: cx, y: cy, vx: Math.cos(t) * v, vy: Math.sin(t) * v - 80, g: 260, drag: .985, s: R(2, 6), c: pick(colors), life: R(.8, 1.8), fade: .7, vr: R(-6, 6) }); }
  }
  function confetti(ps, W, H, n) {
    const cols = ['#4fd4b4', '#f4c54a', '#ffffff', '#2f6fde', '#ff8fb1', '#8fe36b'];
    for (let i = 0; i < n; i++) {
      const left = i % 2 === 0;
      ps.push({ kind: 'conf', x: left ? -10 : W + 10, y: H * R(.55, .85), vx: (left ? 1 : -1) * R(160, 520), vy: R(-760, -380), g: 620, drag: .985, s: R(4, 7), c: pick(cols), life: R(2.4, 3.6), fade: .8, vr: R(-10, 10), delay: R(0, .25) });
    }
  }
  function clawSvg(shift) {
    const lines = [[30, 10, 40, 40, 48, 64, 57, 90], [42, 6, 52, 38, 60, 62, 69, 88], [54, 10, 63, 38, 70, 60, 80, 84]];
    const g = lines.map(([a, b, c, d, e, f, x, y]) => {
      const dd = `M${a + shift} ${b} C ${c + shift} ${d}, ${e + shift} ${f}, ${x + shift} ${y}`;
      return `<g><path pathLength="1" class="c-out" d="${dd}" stroke-width="3.4"/><path pathLength="1" class="c-mid" d="${dd}" stroke-width="1.9"/><path pathLength="1" class="c-core" d="${dd}" stroke-width=".55"/></g>`;
    }).join('');
    return `<svg class="fx-claws" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}</svg>`;
  }
  function shake(el) {
    if (reduce() || !el) return;
    el.classList.remove('fx-shake'); void el.offsetWidth; el.classList.add('fx-shake');
    setTimeout(() => el.classList.remove('fx-shake'), 600);
  }
  const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  // ---------- 公開API ----------
  const FX = {
    sfx: SFX,
    /** 役職カードを見せたとき（自分だけが見る演出） */
    role(card, role) {
      if (!card) return;
      card.classList.add('fx-flip', role === 'wolf' ? 'fx-glow-wolf' : 'fx-glow-village');
      if (role === 'wolf') {
        const L = layer(2600);
        L.innerHTML = `<div class="fx-flash wolf"></div>${reduce() ? '' : clawSvg(0)}`;
        particles(L, 2600, (ps, W, H) => embers(ps, W, H, 46));
        setTimeout(() => shake(document.getElementById('app')), 120);
        SFX.slash(); setTimeout(SFX.howl, 250);
        buzz([70, 40, 140]);
      } else {
        const L = layer(2400);
        L.innerHTML = `<div class="fx-flash village"></div><div class="fx-rays"></div>`;
        const [cx, cy] = centerOf(card);
        particles(L, 2400, ps => sparkles(ps, cx, cy, 60, ['#4fd4b4', '#f4c54a', '#ffffff']));
        SFX.chime();
        buzz(40);
      }
    },
    /** 正体発表の前のため（暗転＋鼓動）。待ち時間のPromiseを返す */
    suspense() {
      const ms = reduce() ? 400 : 1700;
      const L = layer(ms);
      L.innerHTML = `<div class="fx-dim"></div>${reduce() ? '' : '<div class="fx-heart"></div>'}`;
      SFX.heartbeat(); buzz([30, 180, 30, 330, 30, 180, 30]);
      return new Promise(r => setTimeout(r, ms));
    },
    /** 正体発表（全員が見る大きな演出）。textEl は「人狼」「市民」の文字 */
    reveal(role, textEl) {
      if (textEl) textEl.classList.add('fx-slam');
      if (role === 'wolf') {
        const L = layer(3000);
        L.innerHTML = `<div class="fx-flash wolf"></div>${reduce() ? '' : clawSvg(-4)}`;
        particles(L, 3000, (ps, W, H) => embers(ps, W, H, 70));
        setTimeout(() => shake(document.getElementById('app')), 100);
        SFX.slash(); setTimeout(SFX.howl, 200);
        buzz([90, 50, 200]);
      } else {
        const L = layer(2800);
        L.innerHTML = `<div class="fx-flash village"></div><div class="fx-rays"></div>`;
        const [cx, cy] = textEl ? centerOf(textEl) : [innerWidth / 2, innerHeight / 2];
        particles(L, 2800, ps => sparkles(ps, cx, cy, 80, ['#4fd4b4', '#bdf5e8', '#ffffff']));
        SFX.chime(); buzz(50);
      }
    },
    /** 勝敗発表 */
    win(side) {
      if (side === 'wolf') {
        const L = layer(4600);
        L.innerHTML = `<div class="fx-night"></div>${reduce() ? '' : '<div class="fx-moon"></div><div class="fx-eyes"><i></i><i></i></div>'}`;
        particles(L, 4600, (ps, W, H) => embers(ps, W, H, 90));
        SFX.doom(); setTimeout(SFX.howl, 900);
        buzz([120, 60, 120, 60, 300]);
      } else {
        const L = layer(4200);
        L.innerHTML = `<div class="fx-sun"></div><div class="fx-rays gold"></div>`;
        particles(L, 4200, (ps, W, H) => confetti(ps, W, H, 140));
        SFX.fanfare();
        buzz([40, 40, 40, 40, 120]);
      }
    },
    /** 音のオン・オフボタン（data-fx-mute で自動的に動く） */
    muteButton() {
      return `<button type="button" class="fx-mute" data-fx-mute aria-pressed="${!muted}">${muteInner()}</button>`;
    },
    get muted() { return muted; }
  };
  function muteInner() {
    return muted
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>音オフ'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 8a5 5 0 0 1 0 8M19.5 5.5a8.5 8.5 0 0 1 0 13"/></svg>音オン';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-fx-mute]');
    if (!b) return;
    muted = !muted; store.set('ejr-muted', muted);
    document.querySelectorAll('[data-fx-mute]').forEach(x => { x.innerHTML = muteInner(); x.setAttribute('aria-pressed', String(!muted)); });
    if (!muted) SFX.ping();
  });

  window.FX = FX;
})();
