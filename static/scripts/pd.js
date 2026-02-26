(() => {
  // src/scripts/pages/pd.js
  var Product = /* @__PURE__ */ (function() {
    function init() {
      new Swiper(".swiper", {});
    }
    return {
      init
    };
  })();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Product.init);
  } else {
    Product.init();
  }
})();
