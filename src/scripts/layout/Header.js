import { device } from "@root";

const Header = (function () {
  // let isPointerDown = false; // focus 인지 click 인지 구별해 중복 이벤트 방지
  let activated = null; // 활성화 되어있는 index
  let scrollPosition = 0; // scroll lock 스크롤 위치 저장

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
      el.topItems.forEach((item) => {
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
    /* focusinDepth2LI: (e) => {
      // if (isPointerDown) return;

      const depth2LI = e.currentTarget;
      const depth2A = depth2LI.querySelector("a.depth2");
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (!depth3List) {
        // 하위 없으면 닫기만
        method.collapseDepth2All();
      } else {
        if (!depth3List.parentElement.classList.contains("active")) {
          method.expandDepth2(depth2A);
        }
      }
    }, */
    clickDepth3: (e) => {
      const depth3A = e.currentTarget;

      depth3A.parentElement.classList.toggle("active");
    },
    clickOpener: () => {
      method.toggleTotalMenu();
    },
    transEndDepth3: (e) => {
      const depth3List = e.currentTarget;

      if (depth3List) {
        depth3List.style.setProperty("display", "none");
      }
    },
    transEndAllNav: () => {
      el.header.parentElement.classList.remove("opened");
      el.allnav.style.setProperty("height", "");
      el.allnav.style.setProperty("display", "");
      el.allnav.style.setProperty("transform", "");

      console.log("transEndAllNav !!!");

      document.body.parentElement.style.removeProperty("overflow");
    },
  };

  const method = {
    // 2뎁스 열기
    expandDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        method.collapseDepth2All(); // 전부 닫고

        depth3List.style.setProperty("display", "block");

        //requestAnimationFrame
        setTimeout(() => {
          depth2A.parentElement.classList.add("active");
        }, 30);
      }
    },
    // 2뎁스 닫기
    collapseDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        depth2A.parentElement.classList.remove("active");

        depth3List.removeEventListener("transitionend", handler.transEndDepth3);
        depth3List.addEventListener("transitionend", handler.transEndDepth3, {
          once: true,
        });
      }
    },
    // single open 위해 depth2 모두 닫기
    collapseDepth2All: () => {
      const allDepth2Items = el.allnav.querySelectorAll(".depth2-list > li");

      allDepth2Items.forEach((item) => {
        item.classList.remove("active");
      });
    },
    // 전체메뉴 뒤 스크롤 방지
    toggleScrollLock: (value) => {
      const container = document.querySelector("#container");
      const footer = document.querySelector("#footer");

      if (value) {
        // 현재 스크롤 위치 저장
        scrollPosition =
          window.pageYOffset || document.documentElement.scrollTop;

        document.body.parentElement.style.setProperty("overflow", "clip");

        // 스크롤 잠금
        /* container.style.position = "fixed";
        container.style.top = `-${scrollPosition}px`;
        container.style.width = "100%";
        footer.style.display = "none"; */
      } else {
        // 스크롤 잠금 해제
        /* container.style.position = "";
        container.style.top = "";
        container.style.width = "";
        footer.style.display = ""; */

        //document.body.parentElement.style.removeProperty("overflow");

        // 이전 위치로 복귀
        window.scrollTo(0, scrollPosition);
      }
    },
    // 전체 메뉴
    toggleTotalMenu: () => {
      if (!el.header.parentElement.classList.contains("opened")) {
        // 열기
        el.opener.setAttribute("aria-expanded", "true");
        el.opener.setAttribute("aria-label", "전체 메뉴 닫기");

        el.allnav.style.setProperty("display", "block"); // transition 위해 선행

        method.setVariableAllNav();
        method.toggleScrollLock(true);

        el.header.parentElement.classList.add("opened");

        if (device !== "desktop") {
          el.allnav.style.setProperty("transform", "translateX(0)");
        }
      } else {
        // 닫기
        el.opener.setAttribute("aria-expanded", "false");
        el.opener.setAttribute("aria-label", "전체 메뉴 열기");

        el.allnav.removeEventListener("transitionend", handler.transEndAllNav);
        el.allnav.addEventListener("transitionend", handler.transEndAllNav, {
          once: true,
        });

        method.toggleScrollLock(false);

        // transitionend 트리거
        if (device !== "desktop") {
          el.allnav.style.setProperty("transform", "translateX(100%)");
        } else {
          el.allnav.style.setProperty("height", "0");
        }
      }
    },
    // topnav 변수 정의
    setVariableTopNav: () => {
      if (!el.header) return;

      const { HOVER_HEIGHT, ON_WIDTH, OFF_WIDTH } = CSSVar;

      el.topnav.style.setProperty("display", "block"); // 숨겨진 상태에서 크기 계산이 안되는 경우가 있어 계산 전 block 처리

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

      el.topnav.style.setProperty("display", "");
    },
    // allnav 변수 정의
    setVariableAllNav: () => {
      if (!el.allnav) return;

      if (device === "desktop") {
        el.allnav.style.setProperty("--height", `${el.allnav.scrollHeight}px`);
      } else {
        el.allnav.style.removeProperty("--height");

        el.allnav.querySelectorAll(".depth3-list").forEach((item) => {
          item.style.setProperty("--height", `${item.scrollHeight}px`);
          item.style.setProperty("display", "none");
        });
      }
    },
    // mo 아코디언 expand 연결
    setA11yAllNav: () => {
      const depth3List = el.allnav.querySelectorAll(".depth3-list");
      depth3List.forEach((list, idx) => {
        const depth2A = list.parentElement.querySelector("a.depth2");

        depth2A.setAttribute("aria-controls", `depth3-list-${idx}`);
        list.setAttribute("id", `depth3-list-${idx}`);

        if (depth2A) {
          const isExpanded = list.parentElement.classList.contains("active");
          depth2A.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        }
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

          /* depth2.parentElement.addEventListener(
            "focusin",
            handler.focusinDepth2LI,
          );

          depth2.parentElement.addEventListener("pointerdown", () => {
            isPointerDown = true;
          });

          depth2.parentElement.addEventListener("click", () => {
            isPointerDown = false;
          }); */
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
    }

    // total menu
    el.opener.addEventListener("click", handler.clickOpener);
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

    el.header.parentElement.classList.remove("opened");
    el.allnav.removeAttribute("style");
    el.topnav.removeAttribute("style");
    el.header.removeAttribute("style");

    scrollPosition = 0;
    activated = null;
    //isPointerDown = false;
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
    method.setVariableTopNav();
    method.setA11yAllNav();
  };

  const reInit = () => {
    unbind();
    setProperty();
    bind();
    method.setVariableTopNav();
    method.setA11yAllNav();
  };

  return {
    init,
    breakpointChecker,
  };
})();

export default Header;
