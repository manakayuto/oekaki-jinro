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
.fx-claws .c-out{stroke:#4a000a;filter:drop-shadow(0 0 6px #ff000077)}
.fx-claws .c-mid{stroke:#d81e2c}
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
.fx-wolf{position:absolute;inset:0;pointer-events:auto;overflow:hidden;opacity:0;animation:fxIn .25s ease forwards;
  background:radial-gradient(circle at 68% 18%,#3a4f96 0,#16204a 34%,#070a18 68%,#020208 100%)}
.fx-wolf.blood{background:radial-gradient(circle at 50% 20%,#5a0b1a 0,#2a0611 36%,#0a0207 70%,#020102 100%)}
.fx-wolf>svg{position:absolute;left:50%;top:50%;width:min(132vmin,860px);height:min(132vmin,860px);transform:translate(-50%,-48%)}
.fx-wolf .w-face{opacity:0;transform-box:fill-box;transform-origin:50% 45%;animation:fxWFace .9s .35s cubic-bezier(.2,.8,.2,1) forwards,fxWBreath 2.4s 1.3s ease-in-out infinite}
@keyframes fxWFace{0%{opacity:0;transform:scale(1.18);filter:blur(4px) brightness(.2)}100%{opacity:1;transform:scale(1);filter:none}}
@keyframes fxWBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
.fx-wolf .w-eyes{opacity:0;transform-box:fill-box;transform-origin:50% 50%;animation:fxWEyes .5s .12s cubic-bezier(.3,1.5,.5,1) forwards,fxWFlick 1.8s 1s ease-in-out infinite}
@keyframes fxWEyes{0%{opacity:0;transform:scaleY(.05)}100%{opacity:1;transform:scaleY(1)}}
@keyframes fxWFlick{0%,100%{filter:brightness(1)}50%{filter:brightness(1.35)}}
.fx-wolf .w-sway{transform-box:fill-box;transform-origin:50% 100%;animation:fxWSway 2.2s ease-in-out infinite alternate}
.fx-wolf .w-sway.b{animation-duration:2.9s;animation-direction:alternate-reverse}
@keyframes fxWSway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
.fx-wolf .w-hand{opacity:0;transform-box:fill-box;transform-origin:30% 100%;animation:fxWHand 1.1s .85s cubic-bezier(.2,.9,.25,1) forwards}
@keyframes fxWHand{0%{opacity:0;transform:translate(-40%,45%) rotate(-28deg)}45%{opacity:1;transform:translate(0,0) rotate(0)}58%{transform:translate(9%,-6%) rotate(9deg)}100%{opacity:1;transform:translate(3%,-1%) rotate(3deg)}}
.fx-wolf .w-moon{opacity:0;animation:fxIn 1.2s .1s ease forwards}
.fx-wolf .w-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 45%,#000000cc 100%)}
.fx-wolf .fx-flash{animation-delay:1.3s}
.fx-vil{position:absolute;inset:0;pointer-events:auto;overflow:hidden;opacity:0;animation:fxIn .25s ease forwards;
  background:linear-gradient(#050a22 0,#0b1640 45%,#14214f 70%,#1b2a5c 100%)}
.fx-vil .v-dawn{position:absolute;inset:0;opacity:0;animation:fxIn 1.1s 1s ease forwards;
  background:linear-gradient(#0d2357 0,#2c5aa0 30%,#f2a35e 58%,#ffd88a 66%,#2a2f52 100%)}
.fx-vil.gold .v-dawn{background:linear-gradient(#1a4a8a 0,#4f8fd6 28%,#ffc16b 56%,#fff0b8 66%,#3a3458 100%)}
.fx-vil>svg{position:absolute;left:50%;top:50%;width:min(132vmin,860px);height:min(132vmin,860px);transform:translate(-50%,-40%)}
.fx-vil .v-ground{position:absolute;left:0;right:0;bottom:0;top:calc(50% + min(79.2vmin,516px) - 3px);background:#04060d}
.fx-vil .fx-rays{top:53%;animation-delay:0s,1.05s;opacity:0}
.fx-vil .v-sun{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:fxVSun 1.1s .85s cubic-bezier(.2,.8,.2,1) forwards,fxVPulse 2.2s 2s ease-in-out infinite}
@keyframes fxVSun{0%{opacity:0;transform:translateY(55%) scale(.7)}100%{opacity:1;transform:none}}
@keyframes fxVPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.fx-vil .v-win{opacity:0;animation:fxIn .25s ease forwards}
.fx-vil .v-crowd{transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:fxVCrowd .8s .35s cubic-bezier(.2,.9,.25,1.1) forwards}
@keyframes fxVCrowd{0%{opacity:0;transform:translateY(40%)}100%{opacity:1;transform:none}}
.fx-vil .v-raise{transform-box:fill-box;transform-origin:50% 100%;animation:fxVRaise .5s 1.05s cubic-bezier(.3,1.6,.5,1) both}
@keyframes fxVRaise{0%{transform:translateY(14%)}100%{transform:none}}
.fx-vil .v-flame{transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:fxVIgnite .35s ease-out forwards,fxVFlick .18s ease-in-out infinite alternate}
@keyframes fxVIgnite{0%{opacity:0;transform:scale(.1)}70%{opacity:1;transform:scale(1.25)}100%{opacity:1;transform:scale(1)}}
@keyframes fxVFlick{from{transform:scale(1,1) skewX(-3deg)}to{transform:scale(.92,1.08) skewX(3deg)}}
.fx-vil .v-bell{transform-box:fill-box;transform-origin:50% 0;animation:fxVBell .9s 1.05s ease-in-out infinite}
@keyframes fxVBell{0%,100%{transform:rotate(0)}25%{transform:rotate(22deg)}75%{transform:rotate(-22deg)}}
.fx-vil .v-mill{transform-box:fill-box;transform-origin:50% 50%;animation:fxSpin 6s linear infinite}
.fx-vil .v-ring{position:absolute;left:50%;top:52%;width:30vmin;height:30vmin;margin:-15vmin 0 0 -15vmin;border-radius:50%;border:3px solid #fff3c4;box-shadow:0 0 30px #ffd76a,inset 0 0 30px #ffd76a;opacity:0;animation:fxVRing 1.1s 1.05s ease-out forwards}
@keyframes fxVRing{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(5)}}
.fx-vil .fx-flash{animation-delay:1.05s}
.fx-vil .w-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 50%,#00000088 100%)}
@media (prefers-reduced-motion: reduce){.fx-flip,.fx-slam,.fx-shake,.fx-glow-wolf,.fx-glow-village{animation:none!important}
  .fx-wolf .w-face,.fx-wolf .w-eyes,.fx-wolf .w-hand,.fx-wolf .w-sway,.fx-wolf .w-moon{animation:none!important;opacity:1!important}
  .fx-vil .v-dawn,.fx-vil .v-sun,.fx-vil .v-win,.fx-vil .v-crowd,.fx-vil .v-raise,.fx-vil .v-flame,.fx-vil .v-bell,.fx-vil .v-mill{animation:none!important;opacity:1!important}.fx-vil .v-ring,.fx-vil .fx-rays{display:none}}
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
    vote() { const a = audio(); if (a) tone(a, { type: 'triangle', f0: 660, f1: 990, dur: .12, vol: .12 }); },
    /** 役職を開いたときの音。市民と人狼で同じ音にして、周りに役職が漏れないようにする */
    reveal() {
      const a = audio(); if (!a) return;
      tone(a, { f0: 90, f1: 38, dur: .7, vol: .45, filter: 260 });
      noise(a, { dur: .45, vol: .12, from: 300, to: 3000 });
      [784, 1175].forEach((f, i) => tone(a, { type: 'triangle', f0: f, t0: .18 + i * .06, dur: .6, vol: .05 }));
    },
    /** 村の鐘（市民の大きな演出用） */
    bell() {
      const a = audio(); if (!a) return;
      [0, .55].forEach((t0, k) => {
        const base = k ? 392 : 523;
        [[.5, .22], [1, .2], [1.19, .09], [1.56, .07], [2, .06], [2.74, .04]].forEach(([r, v]) =>
          tone(a, { f0: base * r, t0, dur: 2.2 - r * .3, vol: v * .9, attack: .004 }));
      });
    },
    growl() {
      const a = audio(); if (!a) return;
      const now = a.currentTime;
      const o = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(62, now); o.frequency.linearRampToValueAtTime(48, now + 1.2);
      fl.type = 'lowpass'; fl.frequency.value = 420;
      lfo.frequency.value = 23; lg.gain.value = .5; lfo.connect(lg);
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(.32, now + .15); g.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
      const am = a.createGain(); am.gain.value = .6; lg.connect(am.gain);
      o.connect(fl); fl.connect(am); am.connect(g); g.connect(a.destination);
      o.start(now); lfo.start(now); o.stop(now + 1.4); lfo.stop(now + 1.4);
      noise(a, { dur: 1.1, vol: .08, from: 500, to: 180 });
    }
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

  // ---------- 人狼の顔（SVGで描くオリジナルの絵） ----------
  function seeded(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const f1 = n => Math.round(n * 10) / 10;
  let wolfCache = {};
  function wolfArt(moon) {
    if (wolfCache[moon]) return wolfCache[moon];
    const rnd = seeded(7);
    const rr = (a, b) => a + rnd() * (b - a);
    // 毛の房（中心から外へ伸びる炎のような形）
    function tuft(cx, cy, ang, r0, r1, w, bend) {
      // 根元が太く、S字にうねって先が細く尖る毛の房
      const c = Math.cos(ang), s = Math.sin(ang);
      const bx = cx + c * r0, by = cy + s * r0;
      const ta = ang + bend, tx = cx + Math.cos(ta) * r1, ty = cy + Math.sin(ta) * r1;
      const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux;
      const k = bend >= 0 ? 1 : -1, wob = L * rr(.08, .16);
      const P = (t, off) => [bx + dx * t + px * off, by + dy * t + py * off];
      const a1 = P(0, w), a2 = P(.3, w * .8 + wob * k), a3 = P(.68, w * .25 - wob * .7 * k);
      const b3 = P(.62, -w * .2 - wob * .7 * k), b2 = P(.28, -w * .7 + wob * k), b1 = P(0, -w);
      const q = ([x, y]) => `${f1(x)} ${f1(y)}`;
      return `M${q(a1)}C${q(a2)} ${q(a3)} ${f1(tx)} ${f1(ty)}C${q(b3)} ${q(b2)} ${q(b1)}Z`;
    }
    function mane(n, r0, rmin, rmax, wmin, wmax, from, to, fill, stroke) {
      let d = '';
      for (let i = 0; i < n; i++) {
        const t = from + (to - from) * (i + rnd() * .8) / n;
        const up = Math.max(0, -Math.sin(t));            // 上向きほど長くなびく
        const r1 = rr(rmin, rmax) * (1 + up * .35);
        d += tuft(0, 0, t, r0, r1, rr(wmin, wmax), rr(.22, .55) * (Math.cos(t) > 0 ? 1 : -1) * (1 - up * .5) + up * rr(.15, .45));
      }
      return `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.4" stroke-opacity=".55"` : ''}/>`;
    }
    const D2R = Math.PI / 180;
    const back = mane(30, 70, 200, 270, 26, 44, -200 * D2R, 20 * D2R, '#05060b');
    const back2 = mane(20, 80, 170, 230, 22, 36, 15 * D2R, 165 * D2R, '#06070c');
    const midL = mane(18, 95, 170, 225, 18, 30, -190 * D2R, -95 * D2R, '#0d1020', '#2f3d78');
    const midR = mane(17, 95, 170, 230, 18, 30, -85 * D2R, 25 * D2R, '#2e3343', '#9fb0e0');
    const cheekL = mane(10, 105, 150, 185, 11, 18, 140 * D2R, 205 * D2R, '#0c0e18', '#26315f');
    const cheekR = mane(10, 105, 150, 188, 11, 18, -25 * D2R, 40 * D2R, '#6f7485', '#e1e6f2');
    const head = 'M0 -118C55 -122 95 -105 108 -80C125 -50 140 -10 138 25C136 55 110 75 78 92C62 100 55 112 52 125C60 150 40 190 0 198C-40 190 -60 150 -52 125C-55 112 -62 100 -78 92C-110 75 -136 55 -138 25C-140 -10 -125 -50 -108 -80C-95 -105 -55 -122 0 -118Z';
    // 顔の毛並み
    let darkS = '', litS = '', rimS = '';
    for (let i = 0; i < 420; i++) {
      const x = rr(-140, 140), y = rr(-120, 200);
      const ox = x, oy = y < 40 ? -40 : 60;
      let a = Math.atan2(y - oy, ox) + rr(-.35, .35);
      if (Math.abs(x) < 30 && y > -20 && y < 90) a = Math.PI / 2 + rr(-.2, .2) + x * .01;
      const L = rr(9, 24), bx = x + Math.cos(a) * L, by = y + Math.sin(a) * L;
      const mx = (x + bx) / 2 + rr(-3, 3), my = (y + by) / 2 + rr(-3, 3);
      const seg = `M${f1(x)} ${f1(y)}Q${f1(mx)} ${f1(my)} ${f1(bx)} ${f1(by)}`;
      if (x > 14 + rr(-10, 10)) litS += seg; else if (rnd() < .18) rimS += seg; else darkS += seg;
    }
    const tooth = (x, y, w, h, dir) => `M${x - w} ${y}Q${x} ${y - 2 * dir} ${x + w} ${y}Q${x + w * .4} ${y + h * .6 * dir} ${x} ${y + h * dir}Q${x - w * .3} ${y + h * .5 * dir} ${x - w} ${y}Z`;
    let teeth = '';
    [[-50, 117, 8, 44], [50, 117, 8, 44], [-63, 120, 5, 13], [63, 120, 5, 13], [-28, 116, 4.5, 11], [-14, 115, 4, 10], [0, 114, 4, 10], [14, 115, 4, 10], [28, 116, 4.5, 11]]
      .forEach(([x, y, w, h]) => { teeth += tooth(x, y, w, h, 1); });
    [[-38, 178, 7, 36], [38, 178, 7, 36], [-18, 183, 4, 10], [0, 185, 4, 10], [18, 183, 4, 10]]
      .forEach(([x, y, w, h]) => { teeth += tooth(x, y, w, h, -1); });
    // 爪の手（左下から）
    const fingers = [[-232, 210, -268, 40], [-200, 196, -212, 6], [-168, 200, -150, 30], [-140, 218, -98, 92]];
    let hand = '', claws = '', blood = '', knuck = '', drips = '';
    fingers.forEach(([bx, by, tx, ty], i) => {
      const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
      const side = i < 2 ? -1 : 1;
      // 関節で少し曲がった骨ばった指（付け根→第2関節→第1関節→指先）
      const j1 = [bx + dx * .42 + px * 7 * side, by + dy * .42 + py * 7 * side];
      const j2 = [bx + dx * .75 + px * 4 * side, by + dy * .75 + py * 4 * side];
      const W = [12, 10.5, 7.5, 4.5];
      const pts = [[bx, by], j1, j2, [tx, ty]];
      const left = pts.map(([x, y], k) => [x + px * W[k], y + py * W[k]]);
      const right = pts.map(([x, y], k) => [x - px * W[k], y - py * W[k]]).reverse();
      const q = ([x, y]) => `${f1(x)} ${f1(y)}`;
      hand += `M${q(left[0])}Q${q([left[1][0] + px * 2, left[1][1] + py * 2])} ${q(left[1])}L${q(left[2])}L${q(left[3])}Q${f1(tx + ux * 7)} ${f1(ty + uy * 7)} ${q(right[0])}L${q(right[1])}L${q(right[2])}Q${q([right[3][0] - px * 2, right[3][1] - py * 2])} ${q(right[3])}Z`;
      const cx0 = tx + ux * 3, cy0 = ty + uy * 3, bendx = px * side * -10, bendy = py * side * -10;
      claws += `M${f1(cx0 + px * 5.5)} ${f1(cy0 + py * 5.5)}Q${f1(cx0 + ux * 26 + bendx)} ${f1(cy0 + uy * 26 + bendy)} ${f1(cx0 + ux * 48 + bendx * 1.8)} ${f1(cy0 + uy * 48 + bendy * 1.8)}Q${f1(cx0 + ux * 18)} ${f1(cy0 + uy * 18)} ${f1(cx0 - px * 5.5)} ${f1(cy0 - py * 5.5)}Z`;
      [j1, j2].forEach(([x, y]) => { knuck += `M${f1(x + px * 8)} ${f1(y + py * 8)}Q${f1(x + ux * 3)} ${f1(y + uy * 3)} ${f1(x - px * 8)} ${f1(y - py * 8)}`; });
      // 血：指先から根元へ流れた筋と、こすれた跡
      const bl = rr(.3, .6), o = rr(-3, 3);
      blood += `M${f1(tx + px * o)} ${f1(ty + py * o)}C${f1(tx - dx * bl * .3 + px * (o + 3))} ${f1(ty - dy * bl * .3 + py * (o + 3))} ${f1(tx - dx * bl * .7 + px * (o - 2))} ${f1(ty - dy * bl * .7 + py * (o - 2))} ${f1(tx - dx * bl)} ${f1(ty - dy * bl)}`;
      drips += `M${f1(cx0 + ux * 30 + bendx)} ${f1(cy0 + uy * 30 + bendy)}l${f1(rr(-1, 1))} ${f1(rr(8, 18))}`;
    });
    const palm = 'M-262 216C-268 250 -250 300 -205 318C-160 330 -118 300 -110 262C-104 232 -118 205 -150 196C-185 186 -240 186 -262 216Z';
    let wrist = '';
    for (let i = 0; i < 9; i++) wrist += tuft(-200, 330, (200 + i * 14) * D2R, 20, rr(85, 120), rr(10, 16), rr(-.25, .25));
    const thumb = 'M-128 262C-110 236 -88 214 -70 196C-62 190 -54 196 -58 205C-70 228 -88 256 -106 282Z';
    const thumbClaw = 'M-70 194Q-58 176 -42 166Q-52 184 -58 205Z';
    const moonEl = moon === 'blood'
      ? '<circle class="w-moon" cx="0" cy="-150" r="150" fill="url(#wMoonR)"/>'
      : '<circle class="w-moon" cx="120" cy="-185" r="120" fill="url(#wMoonB)"/>';
    const svg = `<svg viewBox="-300 -300 600 600" aria-hidden="true">
<defs>
 <radialGradient id="wMoonB"><stop offset="0" stop-color="#e9f0ff" stop-opacity=".9"/><stop offset=".35" stop-color="#9fb4ff" stop-opacity=".35"/><stop offset="1" stop-color="#3a4f96" stop-opacity="0"/></radialGradient>
 <radialGradient id="wMoonR"><stop offset="0" stop-color="#ffb3a1"/><stop offset=".45" stop-color="#d81b36"/><stop offset=".72" stop-color="#6e0016" stop-opacity=".9"/><stop offset="1" stop-color="#2a0611" stop-opacity="0"/></radialGradient>
 <linearGradient id="wHead" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#07080e"/><stop offset=".46" stop-color="#151827"/><stop offset=".56" stop-color="#3b4050"/><stop offset=".8" stop-color="#7b8091"/><stop offset="1" stop-color="#a9aebc"/></linearGradient>
 <linearGradient id="wEarL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2140"/><stop offset="1" stop-color="#06070c"/></linearGradient>
 <linearGradient id="wEarR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b6072"/><stop offset="1" stop-color="#b9bfcc"/></linearGradient>
 <radialGradient id="wEyeR" gradientUnits="userSpaceOnUse" cx="-56" cy="-27" r="34"><stop offset="0" stop-color="#fff"/><stop offset=".14" stop-color="#ffd2c4"/><stop offset=".38" stop-color="#ff2236"/><stop offset=".75" stop-color="#7a0010"/><stop offset="1" stop-color="#2a0006"/></radialGradient>
 <radialGradient id="wEyeY" gradientUnits="userSpaceOnUse" cx="56" cy="-27" r="34"><stop offset="0" stop-color="#fff"/><stop offset=".16" stop-color="#fff6b0"/><stop offset=".42" stop-color="#ffc61a"/><stop offset=".78" stop-color="#8a5200"/><stop offset="1" stop-color="#2a1800"/></radialGradient>
 <linearGradient id="wMouth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14000a"/><stop offset=".6" stop-color="#4a0610"/><stop offset="1" stop-color="#7a0e1c"/></linearGradient>
 <linearGradient id="wTooth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#b9ae9c"/></linearGradient>
 <linearGradient id="wSkin" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#030305"/><stop offset=".6" stop-color="#0d0c12"/><stop offset="1" stop-color="#1f1c27"/></linearGradient>
 <linearGradient id="wClaw" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2a221c"/><stop offset=".5" stop-color="#8d8170"/><stop offset="1" stop-color="#f3ead8"/></linearGradient>
 <filter id="wGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
 <filter id="wSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
 <clipPath id="wClip"><path d="${head}"/></clipPath>
</defs>
${moonEl}
<g class="w-face">
 <g class="w-sway">${back}</g>
 <g class="w-sway b">${back2}</g>
 <g class="w-sway b">${midL}</g>
 <g class="w-sway">${midR}</g>
 <path d="M-62 -95C-75 -150 -92 -190 -104 -214C-118 -170 -128 -120 -126 -62Z" fill="url(#wEarL)" stroke="#33438a" stroke-opacity=".6" stroke-width="2"/>
 <path d="M-78 -100C-88 -140 -98 -170 -104 -190C-112 -150 -116 -115 -114 -80Z" fill="#1c0d12"/>
 <path d="M62 -95C75 -150 92 -190 104 -214C118 -170 128 -120 126 -62Z" fill="url(#wEarR)" stroke="#e6ebf7" stroke-opacity=".55" stroke-width="2"/>
 <path d="M78 -100C88 -140 98 -170 104 -190C112 -150 116 -115 114 -80Z" fill="#2b1a20"/>
 ${cheekL}${cheekR}
 <path d="${head}" fill="url(#wHead)"/>
 <g clip-path="url(#wClip)">
  <path d="M-24 -12C-32 30 -44 60 -42 86L42 86C44 60 32 30 24 -12Z" fill="#0b0c14" opacity=".75"/>
  <path d="${darkS}" fill="none" stroke="#252b44" stroke-width="1.4" stroke-opacity=".75"/>
  <path d="${rimS}" fill="none" stroke="#4a5896" stroke-width="1" stroke-opacity=".5"/>
  <path d="${litS}" fill="none" stroke="#d9dde6" stroke-width="1.2" stroke-opacity=".55"/>
 </g>
 <path d="M-118 -50Q-72 -56 -16 -16Q-62 -36 -114 -34Z" fill="#030307"/>
 <path d="M118 -50Q72 -56 16 -16Q62 -36 114 -34Z" fill="#14161f"/>
 <path d="M30 -24Q60 -40 96 -40" fill="none" stroke="#e8ecf5" stroke-opacity=".35" stroke-width="1.5"/>
 <g stroke="#030305" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-30 38Q-46 58 -64 70"/><path d="M-27 54Q-44 72 -70 84"/><path d="M30 38Q46 58 64 70"/><path d="M27 54Q44 72 70 84"/></g>
 <g stroke="#e6eaf3" stroke-opacity=".35" stroke-width="1.2" fill="none"><path d="M33 34Q49 54 67 66"/><path d="M30 50Q47 68 73 80"/></g>
 <path d="M-72 118C-50 110 -22 117 0 111C22 117 50 110 72 118C64 152 36 184 0 188C-36 184 -64 152 -72 118Z" fill="url(#wMouth)"/>
 <ellipse cx="0" cy="170" rx="28" ry="11" fill="#a3162a" opacity=".85"/>
 <path d="M-72 118C-50 110 -22 117 0 111C22 117 50 110 72 118" fill="none" stroke="#8e1424" stroke-width="7"/>
 <path d="${teeth}" fill="url(#wTooth)" stroke="#6d6252" stroke-width=".8"/>
 <path d="M-72 118C-50 108 -22 114 0 108C22 114 50 108 72 118" fill="none" stroke="#040406" stroke-width="3.5"/>
 <path d="M-72 118C-64 152 -36 184 0 188C36 184 64 152 72 118" fill="none" stroke="#040406" stroke-width="4"/>
 <path d="M50 160Q52 172 49 184M-50 160Q-47 168 -49 178" stroke="#c4102a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
 <path d="M-28 78Q0 66 28 78Q30 96 12 106Q0 112 -12 106Q-30 96 -28 78Z" fill="#030305"/>
 <path d="M-15 76Q0 70 15 76Q0 81 -15 76Z" fill="#8a8f9e" opacity=".7"/>
 <ellipse cx="-11" cy="96" rx="6" ry="3.6" fill="#000" transform="rotate(25 -11 96)"/><ellipse cx="11" cy="96" rx="6" ry="3.6" fill="#000" transform="rotate(-25 11 96)"/>
</g>
<g class="w-eyes">
 <ellipse cx="-58" cy="-26" rx="44" ry="26" fill="#ff1a2e" opacity=".55" filter="url(#wGlow)"/>
 <ellipse cx="58" cy="-26" rx="44" ry="26" fill="#ffc21a" opacity=".5" filter="url(#wGlow)"/>
 <path d="M-94 -34Q-62 -50 -24 -15Q-60 -9 -94 -34Z" fill="url(#wEyeR)"/>
 <path d="M94 -34Q62 -50 24 -15Q60 -9 94 -34Z" fill="url(#wEyeY)"/>
 <ellipse cx="-55" cy="-27" rx="3.4" ry="9.5" fill="#160002"/><ellipse cx="55" cy="-27" rx="3.4" ry="9.5" fill="#1a0f00"/>
 <circle cx="-48" cy="-33" r="2.2" fill="#fff"/><circle cx="62" cy="-33" r="2.2" fill="#fff"/>
</g>
<g class="w-hand"><g transform="translate(28 -6)">
 <path d="${wrist}" fill="#050508" stroke="#3a4a8c" stroke-width="1.2" stroke-opacity=".5"/>
 <path d="${palm}" fill="url(#wSkin)" stroke="#4a5896" stroke-width="1.4" stroke-opacity=".45"/>
 <path d="${hand}" fill="url(#wSkin)" stroke="#6f80c4" stroke-width="1.4" stroke-opacity=".55"/>
 <path d="${thumb}" fill="url(#wSkin)" stroke="#6f80c4" stroke-width="1.4" stroke-opacity=".55"/>
 <path d="${knuck}" fill="none" stroke="#6b6378" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
 <path d="${blood}" fill="none" stroke="#5a000c" stroke-width="9" stroke-linecap="round" opacity=".85" filter="url(#wSoft)"/>
 <path d="${blood}" fill="none" stroke="#8f0418" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="14 6 30 9" opacity=".9"/>
 <path d="${drips}" fill="none" stroke="#c20a24" stroke-width="2.6" stroke-linecap="round"/>
 <path d="${claws}${thumbClaw}" fill="url(#wClaw)" stroke="#120e0c" stroke-width="1"/>
</g></g>
</svg>`;
    wolfCache[moon] = svg;
    return svg;
  }
  // ---------- 市民の場面（夜明けの村と、松明を掲げる村人たち） ----------
  let vilCache = {};
  function villageArt() {
    if (vilCache.svg) return vilCache.svg;
    const rnd = seeded(11), rr = (a, b) => a + rnd() * (b - a);
    // 村の家並み（中景）
    const houses = [[-300, 60, 150], [-245, 50, 132], [-196, 70, 150], [-120, 46, 140], [70, 56, 142], [128, 62, 128], [190, 52, 146], [246, 60, 136]];
    let town = '', wins = '', wi = 0;
    houses.forEach(([x, w, top]) => {
      const roof = top - w * .55;
      town += `M${x} 230L${x} ${top}L${x + w / 2} ${f1(roof)}L${x + w} ${top}L${x + w} 230Z`;
      if (rnd() < .5) town += `M${f1(x + w * .7)} ${f1(top - w * .3)}h7v-20h-7Z`;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
        if (rnd() < .3) continue;
        const wx = x + w * (.22 + c * .38), wy = top + 14 + r * 26;
        wins += `<rect class="v-win" x="${f1(wx)}" y="${f1(wy)}" width="9" height="12" rx="1.5" style="animation-delay:${f1(.25 + (wi++ % 9) * .09)}s"/>`;
      }
    });
    // 鐘楼（中央）と風車（右）
    const tower = 'M-34 230L-34 -10L-46 -10L0 -96L46 -10L34 -10L34 230Z';
    const towerWin = 'M-18 -2h36v40h-36Z';
    // 前景の村人たち：[x, 頭のy, 体の大きさ, 持ち物]
    const people = [[-262, 196, 1.15, 'torch'], [-188, 214, 1, 'fork'], [-112, 190, 1.2, 'fist'], [-30, 206, 1.05, 'torch'], [52, 188, 1.25, 'fork'], [132, 210, 1, 'torch'], [206, 194, 1.15, 'fist'], [276, 214, 1, 'torch']];
    let crowd = '', props = '', flames = '', glows = '', fi = 0;
    people.forEach(([x, hy, k, item], i) => {
      const hr = 21 * k;
      crowd += `M${f1(x - 62 * k)} 330C${f1(x - 60 * k)} ${f1(hy + 52 * k)} ${f1(x - 40 * k)} ${f1(hy + 30 * k)} ${f1(x)} ${f1(hy + 30 * k)}C${f1(x + 40 * k)} ${f1(hy + 30 * k)} ${f1(x + 60 * k)} ${f1(hy + 52 * k)} ${f1(x + 62 * k)} 330Z`;
      crowd += `M${f1(x + hr)} ${hy}a${f1(hr)} ${f1(hr * 1.12)} 0 1 1 ${f1(-2 * hr)} 0a${f1(hr)} ${f1(hr * 1.12)} 0 1 1 ${f1(2 * hr)} 0Z`;
      const side = i % 2 ? 1 : -1, sx = x + side * 40 * k, sy = hy + 44 * k;
      const hx = x + side * 52 * k, hyy = hy - 70 * k;          // 掲げた手
      crowd += `M${f1(sx - 9 * k)} ${f1(sy)}Q${f1((sx + hx) / 2 - side * 10 * k)} ${f1((sy + hyy) / 2)} ${f1(hx - 5 * k)} ${f1(hyy + 10)}L${f1(hx + 6 * k)} ${f1(hyy + 8)}Q${f1((sx + hx) / 2 - side * 4 * k)} ${f1((sy + hyy) / 2)} ${f1(sx + 11 * k)} ${f1(sy + 8)}Z`;
      crowd += `M${f1(hx + 8 * k)} ${f1(hyy + 2)}a${f1(8 * k)} ${f1(9 * k)} 0 1 1 ${f1(-16 * k)} 0a${f1(8 * k)} ${f1(9 * k)} 0 1 1 ${f1(16 * k)} 0Z`;
      if (item === 'torch') {
        const tx = hx + side * 4, ty = hyy - 70 * k;
        props += `M${f1(hx - 3)} ${f1(hyy + 30)}L${f1(tx - 3)} ${f1(ty)}L${f1(tx + 4)} ${f1(ty)}L${f1(hx + 4)} ${f1(hyy + 30)}Z`;
        props += `M${f1(tx - 8)} ${f1(ty + 6)}h16v-12h-16Z`;
        const fh = 64 * k, fw = 20 * k;
        flames += `<g class="v-flame" style="animation-delay:${f1(.7 + fi * .1)}s,${f1(.7 + fi * .1 + rr(0, .2))}s"><path d="M${f1(tx)} ${f1(ty - 6)}C${f1(tx - fw * 1.4)} ${f1(ty - fh * .4)} ${f1(tx - fw * .2)} ${f1(ty - fh * .7)} ${f1(tx + fw * .1)} ${f1(ty - fh)}C${f1(tx + fw * .4)} ${f1(ty - fh * .6)} ${f1(tx + fw * 1.5)} ${f1(ty - fh * .45)} ${f1(tx)} ${f1(ty - 6)}Z" fill="url(#vFlame)"/><path d="M${f1(tx)} ${f1(ty - 8)}C${f1(tx - fw * .6)} ${f1(ty - fh * .3)} ${f1(tx)} ${f1(ty - fh * .5)} ${f1(tx + fw * .1)} ${f1(ty - fh * .62)}C${f1(tx + fw * .5)} ${f1(ty - fh * .35)} ${f1(tx + fw * .5)} ${f1(ty - fh * .25)} ${f1(tx)} ${f1(ty - 8)}Z" fill="#fff6c8"/></g>`;
        glows += `<circle cx="${f1(tx)}" cy="${f1(ty - fh * .45)}" r="${f1(60 * k)}" fill="url(#vGlow)" class="v-flame" style="animation-delay:${f1(.7 + fi * .1)}s,0s"/>`;
        fi++;
      } else if (item === 'fork') {
        const tx = hx + side * 6, ty = hyy - 96 * k;
        props += `M${f1(hx - 3)} ${f1(hyy + 34)}L${f1(tx - 2.5)} ${f1(ty + 22)}L${f1(tx + 3.5)} ${f1(ty + 22)}L${f1(hx + 4)} ${f1(hyy + 34)}Z`;
        props += `M${f1(tx - 20)} ${f1(ty + 24)}Q${f1(tx)} ${f1(ty + 34)} ${f1(tx + 21)} ${f1(ty + 24)}L${f1(tx + 21)} ${f1(ty)}L${f1(tx + 17)} ${f1(ty)}L${f1(tx + 17)} ${f1(ty + 20)}Q${f1(tx)} ${f1(ty + 28)} ${f1(tx - 16)} ${f1(ty + 20)}L${f1(tx - 16)} ${f1(ty)}L${f1(tx - 20)} ${f1(ty)}Z`;
        props += `M${f1(tx - 2)} ${f1(ty + 26)}L${f1(tx - 2)} ${f1(ty - 4)}L${f1(tx + 2)} ${f1(ty - 4)}L${f1(tx + 2)} ${f1(ty + 26)}Z`;
      }
    });
    const svg = `<svg viewBox="-300 -300 600 600" aria-hidden="true">
<defs>
 <radialGradient id="vSun"><stop offset="0" stop-color="#fffef2"/><stop offset=".3" stop-color="#fff3b0"/><stop offset=".55" stop-color="#ffc85a" stop-opacity=".85"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
 <radialGradient id="vGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
 <linearGradient id="vFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe7a0"/><stop offset=".45" stop-color="#ff9b2e"/><stop offset="1" stop-color="#e2361c"/></linearGradient>
 <linearGradient id="vTown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b5c"/><stop offset="1" stop-color="#0c1230"/></linearGradient>
 <linearGradient id="vBell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#e2a92c"/><stop offset="1" stop-color="#8a5a10"/></linearGradient>
</defs>
<circle class="v-sun" cx="0" cy="40" r="190" fill="url(#vSun)"/>
<path d="M-300 150Q-200 112 -90 138T120 128T300 140L300 240L-300 240Z" fill="#16224e" opacity=".9"/>
<g class="v-mill"><path d="M182 32L186 -46L194 -46L198 32ZM190 32L268 36L268 44L190 40ZM190 32L194 110L186 110L182 32ZM190 32L112 28L112 20L190 24Z" fill="#101a40"/></g>
<path d="M174 230L180 40L200 40L206 230Z" fill="url(#vTown)"/>
<path d="${town}" fill="url(#vTown)"/>
<path d="${tower}" fill="url(#vTown)"/>
<path d="${towerWin}" fill="#ffd27a" opacity=".35"/>
<g class="v-bell"><path d="M-1 0h2v6h-2Z" fill="#8a5a10"/><path d="M-13 30C-13 14 -9 6 0 6C9 6 13 14 13 30L16 34L-16 34Z" fill="url(#vBell)"/><circle cx="0" cy="36" r="3.5" fill="#8a5a10"/></g>
<g fill="#ffd27a">${wins}</g>
${glows}
<g class="v-crowd">
 <g class="v-raise"><path d="${props}" fill="#ffcf7a" opacity=".45" transform="translate(1.5 0)"/><path d="${props}" fill="#05070f"/>${flames}</g>
 <path d="${crowd}" fill="#ffcf7a" opacity=".55" transform="translate(0 -2.5)"/>
 <path d="${crowd}" fill="#04060d"/>
</g>
</svg>`;
    vilCache.svg = svg;
    return svg;
  }
  /** 夜が明けて村人が松明を掲げる全画面の演出。タップで早送り。 */
  function villagePortrait(ms, opts) {
    opts = opts || {};
    const L = layer(ms);
    L.innerHTML = `<div class="fx-vil${opts.gold ? ' gold' : ''}"><div class="v-dawn"></div>${reduce() ? '' : '<div class="fx-rays gold"></div>'}${villageArt()}<div class="v-ground"></div><div class="w-vig"></div><div class="v-ring"></div><div class="fx-flash village"></div></div>`;
    const V = L.firstElementChild;
    V.addEventListener('pointerdown', () => { L.classList.add('out'); setTimeout(() => L.remove(), 650); }, { once: true });
    setTimeout(() => {
      if (!L.isConnected) return;
      if (opts.sound !== false) SFX.bell();
      buzz([40, 40, 40, 40, 120]);
    }, reduce() ? 0 : 1050);
    particles(L, ms, (ps, W, H) => {
      sparkles(ps, W / 2, H * .52, opts.sparkles || 70, ['#fff3c4', '#ffd76a', '#ffffff', '#4fd4b4']);
      ps.forEach(p => { p.delay = 1.05; });
      if (opts.confetti) confetti(ps, W, H, opts.confetti);
    });
    return new Promise(r => setTimeout(r, ms));
  }
  /** 人狼の顔が闇から現れる全画面の演出。タップで早送り。 */
  function wolfPortrait(ms, opts) {
    opts = opts || {};
    const L = layer(ms);
    L.innerHTML = `<div class="fx-wolf${opts.moon === 'blood' ? ' blood' : ''}">${wolfArt(opts.moon || 'blue')}<div class="w-vig"></div><div class="fx-flash wolf"></div></div>`;
    const W = L.firstElementChild;
    W.addEventListener('pointerdown', () => { L.classList.add('out'); setTimeout(() => L.remove(), 650); }, { once: true });
    const slashAt = reduce() ? 0 : 1300;
    setTimeout(() => {
      if (!L.isConnected) return;
      if (!reduce()) W.insertAdjacentHTML('beforeend', clawSvg(6));
      shake(W);
      if (opts.sound !== false) SFX.slash();
      buzz([60, 30, 120]);
    }, slashAt);
    particles(L, ms, (ps, Wd, H) => embers(ps, Wd, H, opts.embers || 50));
    if (opts.sound !== false) { setTimeout(SFX.growl, 120); if (opts.howl) setTimeout(SFX.howl, 1600); }
    return new Promise(r => setTimeout(r, ms));
  }

  // ---------- 公開API ----------
  const FX = {
    sfx: SFX,
    wolfPortrait,
    villagePortrait,
    /** 役職カードを見せたとき（自分だけが見る演出） */
    role(card, role) {
      if (!card) return;
      // 音と振動は市民・人狼で同じ（周りの人に役職が漏れないように）
      SFX.reveal(); buzz([50, 40, 90]);
      if (role === 'wolf') {
        wolfPortrait(reduce() ? 1200 : 2700, { sound: false, embers: 46 }).then(() => {
          card.classList.add('fx-flip', 'fx-glow-wolf');
          const L = layer(1800);
          particles(L, 1800, (ps, W, H) => embers(ps, W, H, 30));
        });
      } else {
        villagePortrait(reduce() ? 1200 : 2700, { sound: false, sparkles: 60 }).then(() => {
          card.classList.add('fx-flip', 'fx-glow-village');
          const L = layer(1800);
          const [cx, cy] = centerOf(card);
          particles(L, 1800, ps => sparkles(ps, cx, cy, 40, ['#4fd4b4', '#f4c54a', '#ffffff']));
        });
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
      if (role === 'wolf') {
        if (textEl) textEl.style.opacity = '0';
        wolfPortrait(reduce() ? 1200 : 2600, { howl: true, embers: 70 }).then(() => {
          if (textEl) { textEl.style.opacity = ''; textEl.classList.add('fx-slam'); }
          shake(document.getElementById('app'));
          const L = layer(2000);
          particles(L, 2000, (ps, W, H) => embers(ps, W, H, 40));
        });
      } else {
        if (textEl) textEl.style.opacity = '0';
        villagePortrait(reduce() ? 1200 : 2600, { sparkles: 80 }).then(() => {
          if (textEl) { textEl.style.opacity = ''; textEl.classList.add('fx-slam'); }
          SFX.chime();
          const L = layer(2000);
          const [cx, cy] = textEl ? centerOf(textEl) : [innerWidth / 2, innerHeight / 2];
          particles(L, 2000, ps => sparkles(ps, cx, cy, 60, ['#4fd4b4', '#bdf5e8', '#ffffff']));
        });
      }
    },
    /** 勝敗発表 */
    win(side) {
      if (side === 'wolf') {
        SFX.doom();
        wolfPortrait(reduce() ? 1400 : 3400, { moon: 'blood', howl: true, embers: 90 }).then(() => {
          const L = layer(2200);
          particles(L, 2200, (ps, W, H) => embers(ps, W, H, 50));
        });
        buzz([120, 60, 120, 60, 300]);
      } else {
        villagePortrait(reduce() ? 1400 : 3400, { gold: true, sparkles: 90, confetti: 120 }).then(() => {
          SFX.fanfare();
          const L = layer(2600);
          particles(L, 2600, (ps, W, H) => confetti(ps, W, H, 100));
        });
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
