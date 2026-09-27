/* SAHNE 3 — GÖRÜNÜMDEN YAPIYA (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "From views to a structure", nameTr: "Görünümden yapıya", concept: "Build it from its views", conceptTr: "Görünümlerden kur", render });
})(window.LI = window.LI || {});
