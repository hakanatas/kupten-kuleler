/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Eş küplerle bir yapı', en: 'A structure of equal cubes',
      note: 'Eş küpleri yan yana ve üst üste koyarak bir yapı kuralım. Bu yapıda 9 küp var.' },
    { scene: 2, start: 10.8, end: 21.6, tr: 'Önden, sağdan, üstten', en: 'From the front, the right, the top',
      note: 'Yapıya önden bakalım: sütunlar 3, 1 ve 2 kat görünür. Sağdan bakınca önde 2, arkada 3 kat görürüz. Üstten bakınca küplerin kapladığı 5 kareyi görürüz.' },
    { scene: 2, start: 22.0, end: 27.8, tr: 'Her görünüm bir yönü anlatır', en: 'Each view tells one direction',
      note: 'Görünüm, yapıya o yönden bakınca gördüğümüz çizimdir. Üç görünüm yapıyı üç yönden anlatır.' },
    { scene: 3, start: 28.8, end: 38.8, tr: 'Görünümlerden yapı kur', en: 'Build it from its views',
      note: 'Şimdi tersini yapalım. Önden 2 ve 1, sağdan 2 ve 1, üstten 2’ye 2 kare görünüyor. Üstten görünüm 4 kule olduğunu söylüyor; önde solda 2 kat, diğerleri 1 kat.' },
    { scene: 3, start: 39.4, end: 45.8, tr: '5 küp, üç görünüm de tamam', en: '5 cubes, all three views match',
      note: 'Kurduğumuz 5 küplük yapı üç görünümü de sağlıyor.' },
    { scene: 4, start: 46.8, end: 56.6, tr: 'En yüksek kule görünür', en: 'The tallest tower shows',
      note: 'Önden görünümün ilk sütunu 3 kat: o sıradaki en yüksek kule 3 kat. Sağdan görünümün ön sütunu 2 kat: öndeki en yüksek kule 2 kat.' },
    { scene: 4, start: 56.8, end: 63.8, tr: 'Üstten: kulelerin tepeleri', en: 'From the top: the tops of the towers',
      note: 'Üstten görünüm kulelerin tepelerini gösterir: 5 kare, 5 kule. Arkada kalan alçak küpler önden görünmez.' },
    { scene: 5, start: 64.8, end: 71.8, tr: 'Bir küp daha: 10 küp', en: 'One more cube: 10 cubes',
      note: 'Sağ öndeki kuleye bir küp ekleyelim. Artık 10 küp var. Peki görünümler değişti mi?' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'Görünümler aynı, yapı farklı', en: 'Same views, different structure',
      note: 'Önden, sağdan ve üstten görünümler değişmedi. Arkadaki 2 katlı kule, eklenen küpü önden gizliyor. Farklı yapıların görünümleri aynı olabilir.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Görünüm: en yüksek kuleler', en: 'Views: the tallest towers',
      note: 'Aklında kalsın: önden ve yandan görünüm her sıranın en yüksek kulesini, üstten görünüm kulelerin kapladığı kareleri gösterir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Aynı görünüm, farklı yapı olabilir!', en: 'Same views, maybe different structures!',
      note: 'Aynı görünümlere sahip farklı yapılar olabilir!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
