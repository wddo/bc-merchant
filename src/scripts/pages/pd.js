const Product = (function () {
  function init() {
    //console.log('init product !!!')

    new Swiper(".swiper", {});
  }

  return {
    init,
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", Product.init);
} else {
  Product.init();
}
