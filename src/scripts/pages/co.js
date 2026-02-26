const Company = (function () {
  function init() {
    //console.log("init company !!!");
  }

  function resize() {
    //console.log("resize company !!!");
  }

  function breakpointChecker(e) {
    if (!e.matches) {
      //console.log("breakpoint company mobile !!!");
    } else {
      //console.log("breakpoint company pc !!!");
    }
  }

  return {
    init,
    resize,
    breakpointChecker,
  };
})();

export default Company;
