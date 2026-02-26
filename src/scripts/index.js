import Header from "@layout/Header";
import { datepickerController } from "@library/Datepicker";
import { selectmenuController } from "@library/Selectmenu";

import Co from "@pages/co";

export let device = null;

(function () {
  let breakpointDesktop = null;
  let breakpointMobile = null;

  function bind() {
    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", resizeHandler);

    breakpointDesktop = window.matchMedia("(min-width: 1200px)");
    breakpointMobile = window.matchMedia("(max-width: 767px)");

    breakpointDesktop.addEventListener("change", breakpointHandler);
    breakpointMobile.addEventListener("change", breakpointHandler);
  }

  function contentReady() {
    console.log("ready");

    selectmenuController.init(".select-wrap > select");
    datepickerController.init(".datepickerInner");

    bind();

    if (Header) Header.init();
    if (Co) Co.init();

    resizeHandler();
    scrollHandler();
    breakpointHandler();
  }

  function breakpointHandler() {
    let matchDevice = null;
    if (breakpointDesktop.matches) {
      matchDevice = "desktop";
    } else if (breakpointMobile.matches) {
      matchDevice = "mobile";
    } else {
      matchDevice = "tablet";
    }

    if (device !== matchDevice) {
      device = matchDevice;
      breakpointChecker();
    }
  }

  function scrollHandler() {
    //console.log("scroll !!!");
  }

  function resizeHandler() {
    //console.log("resize !!!");

    if (Co) Co.resize();
  }

  function breakpointChecker() {
    console.log("breakpoint !!!", device);

    //if (Co) Co.breakpointChecker(e);
    if (Header) Header.breakpointChecker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", contentReady);
  } else {
    contentReady();
  }

  document.addEventListener("DOMContentLoaded", contentReady);
})();
