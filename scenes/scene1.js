/* SAHNE 1 — BİR YAPI (0–10 s)  Eş küplerle kurulan bir yapı.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- cubes: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w: 3, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  function cube(ctx, O, c, x, y, z, a, h, fh, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i, y + j, z + k), H = (v) => (v > 0 ? amber(a * 0.62 * v) : null);
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.16), H(Math.max(h, fh.t || 0))], seed);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H(Math.max(h, fh.r || 0))], seed + 1);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H(Math.max(h, fh.f || 0))], seed + 2);
  }
  /** H[y][x] heights → cubes with a build index (bottom layer first, back to front) */
  function cubesOf(H) {
    const L = [];
    H.forEach((row, y) => row.forEach((n, x) => { for (let z = 0; z < n; z++) L.push({ x, y, z }); }));
    const build = L.slice().sort((p, q) => p.z - q.z || q.y - p.y || p.x - q.x);
    build.forEach((q, i) => (q.i = i));
    return L.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  /** draw a structure; cubes appear one by one from t0 every dt */
  function struct(ctx, O, c, list, t, t0, dt, a, hot, fh, seed) {
    if (a <= 0) return;
    list.forEach((q) => {
      const k = dt > 0 ? seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.45) : seg(t, t0, t0 + 0.4); if (k <= 0) return;
      const dz = (1 - inOut(k)) * 1.2;
      cube(ctx, O, c, q.x, q.y, q.z + dz, a * k, hot ? hot(q) : 0, fh ? fh(q) : {}, seed + (q.x * 9 + q.y * 3 + q.z) * 7);
    });
  }
  function sq(ctx, x, y, c, a, h, seed) {
    if (a <= 0) return; const P = [[x, y], [x + c, y], [x + c, y - c], [x, y - c]];
    poly(ctx, P, a, [amber(a * 0.16), h > 0 ? amber(a * 0.62 * h) : null], seed);
  }
  /** a front/side view: columns of squares, bottom-left at V0 */
  function colsView(ctx, V0, c, cols, t, t0, dt, a, hot, seed) {
    if (a <= 0) return; let n = 0;
    cols.forEach((m, i) => { for (let j = 0; j < m; j++, n++) sq(ctx, V0[0] + i * c, V0[1] - j * c, c, a * seg(t, t0 + n * dt, t0 + n * dt + 0.3), hot ? hot(i) : 0, seed + n * 5); });
  }
  /** a top view: G[y][x] = 1 if the cell is covered; front row at the bottom */
  function topView(ctx, V0, c, G, t, t0, dt, a, hot, seed) {
    if (a <= 0) return; let n = 0;
    G.forEach((row, y) => row.forEach((v, x) => { if (!v) return; sq(ctx, V0[0] + x * c, V0[1] - y * c, c, a * seg(t, t0 + n * dt, t0 + n * dt + 0.3), hot ? hot(x, y) : 0, seed + n * 5); n++; }));
  }
  function vlabel(ctx, env, i, text, a, ok, w) {
    if (a <= 0) return; const L = KD.L(env), V = L.VW, s = L.G.s;
    F().T(ctx, text + (ok > 0 ? ' ✓' : ''), V.x[i] + w * V.c / 2, V.y + s * 0.8, { size: s * 0.6, alpha: a, halo: true, color: ok > 0 ? A.amber : undefined });
  }
  const HA = [[2, 1, 1], [3, 0, 2]], HB = [[2, 1, 2], [3, 0, 2]], HC = [[2, 1], [1, 1]];
  const LA = cubesOf(HA), LC = cubesOf(HC);
  const front = (H) => H[0].map((_, x) => Math.max(...H.map((r) => r[x])));
  const side = (H) => H.map((r) => Math.max(...r));
  const top = (H) => H.map((r) => r.map((v) => (v > 0 ? 1 : 0)));

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Eş küplerle bir yapı kuralım'],
      [10.6, 27.8, 'Yapıya üç yönden bakalım: önden, sağdan, üstten'],
      [28.4, 45.8, 'Görünümlerden yapıyı kuralım'],
      [46.4, 63.8, 'Yapı ile görünümleri arasındaki ilişki'],
      [64.4, 79.8, 'Görünümler yapıyı her zaman belirler mi?'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), f = F(), a = END(t), s = L.G.s, c = L.ST.c, O = [L.ST.x, L.ST.y], V = L.VW, vc = V.c;
    const cnt = (txt, al, hot) => { if (al > 0) f.T(ctx, txt, L.ST.x + 4.4 * c + 44, L.ST.y - 1.6 * c, { size: s * 0.7, alpha: al, halo: true, color: hot ? A.amber : undefined }); };
    // structure A: 4.6–28 and 46.8–80
    const aA = (win(t, 4.6, 27.8) + win(t, 46.8, 79.8)) * a;
    if (aA > 0) {
      const t0 = t < 40 ? 5.0 : 47.0, dt = t < 40 ? 0.38 : 0;
      const fh = () => ({ f: win(t, 12.0, 14.8), r: win(t, 15.0, 17.8), t: win(t, 18.0, 20.8) });
      const topOf = (q) => q.z === HA[q.y][q.x] - 1;
      const hot = (q) => (q.x === 0 && q.y === 1 ? win(t, 48.4, 52.6) : 0) + (q.x === 0 && q.y === 0 ? win(t, 52.8, 56.6) : 0);
      const fh2 = (q) => (t < 40 ? fh() : { t: topOf(q) ? win(t, 56.8, 63.8) : 0 });
      struct(ctx, O, c, LA, t, t0, dt, aA, hot, fh2, 11000);
      // S5: one more cube hidden behind the back tower in the front view
      if (t > 66.8) {
        const k = seg(t, 67.0, 67.8);
        cube(ctx, O, c, 2, 0, 1 + (1 - inOut(k)) * 2.5, aA * seg(t, 67.0, 67.3), 0.9 * (1 - seg(t, 72.0, 73.0)) + 0.35, {}, 11900);
        // redraw the back tower's front cube face order is fine: the new cube is in front
      }
      cnt('9 küp', aA * win(t, 8.6, 27.8) + aA * win(t, 65.4, 68.2), false);
      cnt('10 küp', aA * seg(t, 68.4, 68.8), true);
      // views of A
      const vA = t < 40 ? win(t, 10.8, 27.8) * a : win(t, 46.8, 79.8) * a, v0 = t < 40 ? [12.0, 15.0, 18.0] : [47.2, 47.2, 47.2], vdt = t < 40 ? 0.26 : 0;
      const ok = seg(t, 70.0, 70.4) * (t > 60 ? 1 : 0);
      colsView(ctx, [V.x[0], V.y], vc, front(HA), t, v0[0], vdt, vA, (i) => (i === 0 ? win(t, 48.4, 52.6) : 0), 12000);
      colsView(ctx, [V.x[1], V.y], vc, side(HA), t, v0[1], vdt, vA, (i) => (i === 0 ? win(t, 52.8, 56.6) : 0), 12100);
      topView(ctx, [V.x[2], V.y], vc, top(HA), t, v0[2], vdt, vA, () => win(t, 56.8, 63.8), 12200);
      vlabel(ctx, env, 0, 'Önden', vA * seg(t, v0[0], v0[0] + 0.4), ok, 3);
      vlabel(ctx, env, 1, 'Sağdan', vA * seg(t, v0[1], v0[1] + 0.4), ok, 2);
      vlabel(ctx, env, 2, 'Üstten', vA * seg(t, v0[2], v0[2] + 0.4), ok, 3);
    }
    // S3: build C from its views
    const aC = win(t, 28.8, 45.8) * a;
    if (aC > 0) {
      const ok = seg(t, 39.4, 39.8);
      colsView(ctx, [V.x[0], V.y], vc, front(HC), t, 29.2, 0, aC, null, 13000);
      colsView(ctx, [V.x[1], V.y], vc, side(HC), t, 29.6, 0, aC, null, 13100);
      topView(ctx, [V.x[2], V.y], vc, top(HC), t, 30.0, 0, aC, null, 13200);
      vlabel(ctx, env, 0, 'Önden', aC * seg(t, 29.2, 29.6), ok, 2);
      vlabel(ctx, env, 1, 'Sağdan', aC * seg(t, 29.6, 30.0), ok, 2);
      vlabel(ctx, env, 2, 'Üstten', aC * seg(t, 30.0, 30.4), ok, 2);
      const q = aC * win(t, 30.6, 33.2);
      if (q > 0) f.T(ctx, '?', O[0] + 1.3 * c, O[1] - 1.2 * c, { size: s * 2.2, alpha: q, color: A.amber });
      struct(ctx, O, c, LC, t, 33.2, 0.9, aC, (qq) => (qq.z === 1 ? win(t, 36.8, 39.2) : 0), null, 13500);
      cnt('5 küp', aC * seg(t, 38.4, 38.8), true);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.0, 10.2, 'Eş küpleri yan yana ve üst üste koyalım'],
      [12.0, 14.8, 'Önden: her sütunda kaç kat görünüyor?'], [15.0, 17.8, 'Sağdan: önde 2, arkada 3 kat'], [18.0, 20.8, 'Üstten: küplerin kapladığı kareler'],
      [21.2, 27.8, 'Görünüm, yapının o yönden bakınca görülen çizimi'],
      [29.4, 45.8, 'Önden 2, 1 · sağdan 2, 1 · üstten 2×2 kare'],
      [48.4, 52.6, 'Önden 1. sütun = o sıradaki en yüksek kule: 3'], [52.8, 56.6, 'Sağdan ön sütun = öndeki en yüksek kule: 2'], [56.8, 63.8, 'Üstten görünüm = kulelerin tepeleri: 5 kare'],
      [65.4, 69.8, 'Sağ öndeki kuleye bir küp ekleyelim: 9 → 10 küp'], [70.0, 79.8, 'Önden, sağdan ve üstten görünümler değişmedi!']]);
    exprs(ctx, t, at(W, 1), [[22.0, 27.8, 'Önden 3, 1, 2 · sağdan 2, 3 · üstten 5 kare'],
      [33.4, 45.8, 'Üstten: 4 kule. Önde solda 2 kat, diğerleri 1 kat'],
      [58.0, 63.8, 'Arkada kalan alçak küpler önden görünmez'],
      [72.4, 79.8, 'Arkadaki 2 katlı kule, eklenen küpü önden gizliyor']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, 'Bu yapıda 9 küp var', true], [23.4, 27.8, 'Her görünüm yapıyı bir yönden anlatır', true],
      [39.8, 45.8, '5 küplük yapı üç görünümü de sağlıyor', true],
      [59.8, 63.8, 'Görünüm her sıradaki en yüksek kuleyi gösterir', true],
      [75.0, 79.8, 'Farklı yapıların görünümleri aynı olabilir', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Görünüm: önden, yandan, üstten çizim', 80.6], ['Önden, yandan: her sıranın en yüksek kulesi', 81.6], ['Üstten: kulelerin kapladığı kareler', 82.6], ['Aynı görünümler, farklı yapılar olabilir!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A structure', nameTr: 'Bir yapı', concept: '9 equal cubes', conceptTr: '9 eş küp', render });
})(window.LI = window.LI || {});
