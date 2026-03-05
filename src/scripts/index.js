import Header from "@layout/Header";
import { accordionController } from "@library/Accordion";
import { dataTextController } from "@library/DataText";

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

    dataTextController.init("[data-text]"); // 타 라이브러리에서 사용하므로 상단 유지
    accordionController.init(".accordion");

    if (pbui) {
      if (pbui.tooltip) {
        pbui.tooltip.init(".tooltip-trigger", {
          position: "bottom-center",
          content: `<span>텍스트</span>`,
        });
      }

      if (pbui.selectmenu) {
        pbui.selectmenu.init(".input-box select");
      }
    }

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
