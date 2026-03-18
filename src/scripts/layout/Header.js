import { device } from "@root";

const Header = (function () {
  let isPointerDown = false; // focus 인지 click 인지 구별해 중복 이벤트 방지
  let activated = null; // 활성화 되어있는 index

  const CSSVar = {
    HOVER_HEIGHT: "--header-nav-height",
    ON_WIDTH: "--header-nav-on-width",
    OFF_WIDTH: "--header-nav-off-width",
  };

  const el = {
    header: null,
    nav: null,
    opener: null,
    allItems: null,
  };

  const selectors = {
    header: ".header",
    topnav: ".header-top-nav",
    allnav: ".header-all-nav",
    opener: "#menu-toggle",
    topItems: ".header-top-nav .depth1-list > li",
    allItems: ".header-all-nav .depth1-list > li",
  };

  const handler = {
    mouseenter: (e) => {
      const depth1 = e.currentTarget;

      if (activated === null) {
        const activeItem = [...el.topItems].filter((item) =>
          item.classList.contains("active"),
        );

        if (activeItem.length) {
          activated = activeItem[0];
        }
      }
      el.topItems.forEach((item, idx) => {
        if (item !== depth1) {
          item.classList.remove("active");
        }
      });
    },
    mouseleave: () => {
      if (activated) activated.classList.add("active");
      activated = null;
    },
    clickDepth2: (e) => {
      const depth2A = e.currentTarget;
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (!depth3List) {
        // 일반 링크
        e.preventDefault();
      } else {
        if (!depth3List.parentElement.classList.contains("active")) {
          method.expandDepth2(depth2A);
        } else {
          method.collapseDepth2(depth2A);
        }
      }
    },
    focusinDepth2LI: (e) => {
      if (isPointerDown) return;

      const depth2LI = e.currentTarget;
      const depth2A = depth2LI.querySelector("a.depth2");
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (!depth3List) {
        // 하위 없으면 닫기만
        method.allCollapseDepth2();
      } else {
        if (!depth3List.parentElement.classList.contains("active")) {
          method.expandDepth2(depth2A);
        }
      }
    },
    clickDepth3: (e) => {
      const depth3A = e.currentTarget;

      depth3A.parentElement.classList.toggle("active");
    },
    clickOpener: () => {
      method.toggleSideMenu();
    },
  };

  const method = {
    allCollapseDepth2: () => {
      const allDepth2Items = el.allnav.querySelectorAll(".depth2-list > li");

      // single open
      allDepth2Items.forEach((item) => {
        item.classList.remove("active");
      });
    },
    expandDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        method.allCollapseDepth2();

        depth2A.parentElement.classList.add("active");
      }
    },
    collapseDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        depth2A.parentElement.classList.remove("active");
      }
    },
    toggleSideMenu: () => {
      el.header.classList.toggle("opened");

      if (el.allnav) {
        const opened = el.header.classList.contains("opened");

        requestAnimationFrame(() => {
          if (opened) {
            el.allnav.style.setProperty("transform", "translateX(0)");

            method.setVariableSideMenu();
          } else {
            el.allnav.style.setProperty("transform", "translateX(100%)");
          }
        });
      }
    },
    setVariableTopMenu: () => {
      if (!el.header) return;

      const { HOVER_HEIGHT, ON_WIDTH, OFF_WIDTH } = CSSVar;

      // hover height
      const wrap = el.topnav.querySelector(".depth1-list");
      if (wrap) {
        el.header.style.removeProperty(HOVER_HEIGHT);
        el.header.style.setProperty(HOVER_HEIGHT, `${wrap.scrollHeight}px`);
      }

      // top menu width
      let mw = 0;
      el.topItems.forEach((item) => {
        const listWidth = item.scrollWidth;
        if (listWidth > mw) {
          mw = listWidth;
        }
      });

      const menuLen = el.topItems.length;
      if (menuLen) {
        el.topnav.style.removeProperty(ON_WIDTH);
        el.topnav.style.removeProperty(OFF_WIDTH);
        el.topnav.style.setProperty(ON_WIDTH, `${(mw + 32) * menuLen}px`);
        el.topnav.style.setProperty(OFF_WIDTH, `${mw * menuLen}px`);
      }
    },
    setVariableSideMenu: () => {
      if (!el.allnav) return;

      // side menu
      el.allnav.querySelectorAll(".depth3-list").forEach((item) => {
        item.style.setProperty("--height", `${item.scrollHeight}px`);
      });
    },
  };

  const bind = () => {
    el.topItems.forEach((item) => {
      if (device === "desktop") {
        item.addEventListener("mouseenter", handler.mouseenter);
      }
    });

    el.allItems.forEach((item) => {
      if (device !== "desktop") {
        item.querySelectorAll("a.depth2").forEach((depth2) => {
          depth2.addEventListener("click", handler.clickDepth2);

          depth2.parentElement.addEventListener(
            "focusin",
            handler.focusinDepth2LI,
          );

          depth2.parentElement.addEventListener("pointerdown", () => {
            isPointerDown = true;
          });

          depth2.parentElement.addEventListener("click", () => {
            isPointerDown = false;
          });
        });

        item.querySelectorAll("a.depth3").forEach((depth3) => {
          depth3.addEventListener("click", handler.clickDepth3);
        });
      }
    });

    // slide menu
    if (device === "desktop") {
      // desktop only
      el.header.addEventListener("mouseleave", handler.mouseleave);
    } else {
      // mobile & tablet only
      el.opener.addEventListener("click", handler.clickOpener);
    }
  };

  const unbind = () => {
    el.topItems.forEach((item) => {
      item.removeEventListener("mouseenter", handler.mouseenter);
    });

    el.allItems.forEach((item) => {
      item.querySelectorAll("a.depth2").forEach((depth2) => {
        depth2.removeEventListener("click", handler.clickDepth2);
      });

      item.querySelectorAll("a.depth3").forEach((depth3) => {
        depth3.removeEventListener("click", handler.clickDepth3);
      });
    });

    el.header.removeEventListener("mouseleave", handler.mouseleave);
    el.opener.removeEventListener("click", handler.clickOpener);

    el.header.classList.remove("opened");
    el.allnav.style.setProperty("transform", "");
    el.topnav.removeAttribute("style");
    el.header.removeAttribute("style");
  };

  function breakpointChecker() {
    reInit();

    if (device !== "desktop") {
      //console.log("breakpoint header not desktop !!!");
    } else {
      //console.log("breakpoint header desktop !!!");
    }
  }

  const setProperty = () => {
    el.header = document.querySelector(selectors.header);
    el.opener = el.header ? el.header.querySelector(selectors.opener) : null;
    el.topnav = el.header ? el.header.querySelector(selectors.topnav) : null;
    el.allnav = el.header ? el.header.querySelector(selectors.allnav) : null;

    cloneAllItemsToTopNav(); // 개발용 xxx (제거 예정)

    el.topItems = el.header
      ? el.header.querySelectorAll(selectors.topItems)
      : null;

    el.allItems = el.header
      ? el.header.querySelectorAll(selectors.allItems)
      : null;
  };

  const cloneAllItemsToTopNav = () => {
    if (el.topnav && el.allnav) {
      if (el.topnav.children.length) el.topnav.children.item(0).remove(); // 기존에 있는 샘플 메뉴 제거

      const ul = document.createElement("ul");

      ul.classList.add("depth1-list");
      el.topnav.appendChild(ul);

      const allItems = el.allnav.querySelectorAll(selectors.allItems);
      allItems.forEach((item, idx) => {
        if (idx === 4 || idx === 5 || idx === 6) return; // 4, 5, 6 번째는 제외
        ul.appendChild(item.cloneNode(true));
      });
    }
  };

  const init = () => {
    setProperty();
    bind();
    method.setVariableTopMenu();
  };

  const reInit = () => {
    unbind();
    setProperty();
    method.setVariableTopMenu();
    bind();
  };

  return {
    init,
    breakpointChecker,
  };
})();

export default Header;
