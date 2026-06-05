/** Google Analytics 4 — 全站共用，修改 ID 只需改此文件 */
(function () {
  var GA_MEASUREMENT_ID = "G-GMFFYVDMB1";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
})();
