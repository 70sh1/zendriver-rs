(function (allow, seed) {
  __zdReplace(CanvasRenderingContext2D.prototype, 'measureText', (orig) => function (text) {
    const m = orig.call(this, text);
    // Reset for the same native metrics: repeated reads, different contexts
    // and page reloads must agree instead of advancing a shared PRNG.
    const rng = __zdKeyedRng(seed, [m.width, m.actualBoundingBoxLeft,
      m.actualBoundingBoxRight, m.actualBoundingBoxAscent, m.actualBoundingBoxDescent]);
    try { Object.defineProperty(m, 'width', { value: m.width + (rng() - 0.5) * 1e-3 }); }
    catch (e) {}
    return m;
  });
  // If an allow-list is provided, hide other fonts from FontFaceSet checks.
  if (Array.isArray(allow) && document.fonts && document.fonts.check) {
    __zdReplace(document.fonts, 'check', (origCheck) => function (font, text) {
      const fam = (font || '').split(/\s+/).pop();
      if (fam && allow.indexOf(fam.replace(/["']/g, '')) === -1) return false;
      return origCheck.call(document.fonts, font, text);
    });
  }
})(FONT_ALLOW, SEED);
