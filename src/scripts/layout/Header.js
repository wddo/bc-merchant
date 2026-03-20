import { device } from "@root";

const Header = (function () {
  let activated = null; // 활성화 되어있는 index
  let scrollPosition = 0; // scroll lock 스크롤 위치 저장
  let isMobile = device !== "desktop";

  const CSSVar = {
    HOVER_HEIGHT: "--header-nav-height",
    ALL_NAV_HEIGHT: "--header-all-nav-height",
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
    clickDepth3: (e) => {
      const depth3A = e.currentTarget;

      depth3A.parentElement.classList.toggle("active");
    },
    clickOpener: () => {
      method.toggleTotalMenu();
    },
    // 2뎁스 닫힘 완료
    transEndDepth3: (e) => {
      const depth3List = e.currentTarget;

      if (depth3List) {
        depth3List.style.setProperty("display", "none");
      }
    },
    // 전체메뉴 닫힘 완료
    transEndAllNav: () => {
      el.header.parentElement.classList.remove("opened");

      el.allnav.style.setProperty("height", "");
      el.allnav.style.setProperty("display", "");
      el.allnav.style.setProperty("transform", "");

      method.unlockScroll();
    },
  };

  const method = {
    // 이벤트 transitionend once 등록 함수
    setTransitionEndOnce(target, callback) {
      target.removeEventListener("transitionend", callback);
      target.addEventListener("transitionend", callback, { once: true });
    },
    // 2뎁스 열기
    expandDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        method.collapseDepth2All(depth2A); // 전부 닫고

        requestAnimationFrame(() => {
          depth3List.style.setProperty("display", "block");

          requestAnimationFrame(() => {
            depth2A.parentElement.classList.add("active");
          });
        });
      }
    },
    // 2뎁스 닫기
    collapseDepth2: (depth2A) => {
      const depth3List = depth2A.parentElement.querySelector(".depth3-list");

      if (depth3List) {
        depth2A.parentElement.classList.remove("active");

        method.setTransitionEndOnce(depth3List, handler.transEndDepth3);
      }
    },
    // single open 위해 depth2 모두 닫기
    collapseDepth2All: (currentDepth2A) => {
      const depth2 = el.allnav.querySelectorAll("li.active > .depth2");

      depth2.forEach((item) => {
        // 현재 클릭한 아이템은 제외하고 닫기
        if (item !== currentDepth2A) {
          method.collapseDepth2(item);
        }
      });
    },
    // scroll lock
    lockScroll: () => {
      document.documentElement.style.setProperty("overflow", "clip");
    },
    unlockScroll: () => {
      document.documentElement.style.removeProperty("overflow");
    },
    // scroll memory
    saveScroll: () => {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    },
    restoreScroll: () => {
      window.scrollTo(0, scrollPosition);
    },
    // 전체 메뉴
    toggleTotalMenu: () => {
      if (!el.header.parentElement.classList.contains("opened")) {
        // 열기
        el.opener.setAttribute("aria-expanded", "true");
        el.opener.setAttribute("aria-label", "전체 메뉴 닫기");

        el.allnav.style.setProperty("display", "block"); // transition 전 block 처리

        method.setVariableAllNav();
        method.saveScroll();
        method.lockScroll();

        el.header.parentElement.classList.add("opened");
      } else {
        // 닫기
        el.opener.setAttribute("aria-expanded", "false");
        el.opener.setAttribute("aria-label", "전체 메뉴 열기");

        method.restoreScroll();
        method.setTransitionEndOnce(el.allnav, handler.transEndAllNav);

        // transitionend 트리거
        el.allnav.style.setProperty("height", "0");
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

      const { ALL_NAV_HEIGHT } = CSSVar;

      if (isMobile) {
        el.header.style.removeProperty(ALL_NAV_HEIGHT);

        el.allnav.querySelectorAll(".depth3-list").forEach((item) => {
          // 개별 depth3 height 계산하여 변수로 저장 (모바일에서만 사용)
          if (!item.style.getPropertyValue("--height")) {
            item.style.setProperty("--height", `${item.scrollHeight}px`);
            item.style.setProperty("display", "none");
          }
        });
      } else {
        el.allnav.querySelectorAll(".depth3-list").forEach((item) => {
          item.style.removeProperty("--height");
        });

        // 전체 메뉴 height 계산하여 변수로 저장 (desktop에서만 사용)
        el.header.style.setProperty(
          ALL_NAV_HEIGHT,
          `${el.allnav.scrollHeight}px`,
        );
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
      if (!isMobile) {
        item.addEventListener("mouseenter", handler.mouseenter);
      }
    });

    el.allItems.forEach((item) => {
      if (isMobile) {
        item.querySelectorAll("a.depth2").forEach((depth2) => {
          depth2.addEventListener("click", handler.clickDepth2);
        });

        item.querySelectorAll("a.depth3").forEach((depth3) => {
          depth3.addEventListener("click", handler.clickDepth3);
        });
      }
    });

    // slide menu
    if (!isMobile) {
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
    document.documentElement.removeAttribute("style");

    scrollPosition = 0;
    activated = null;
  };

  function breakpointChecker() {
    reInit();

    if (device !== "desktop") {
      //console.log("breakpoint header not desktop !!!");
      isMobile = true;
    } else {
      //console.log("breakpoint header desktop !!!");
      isMobile = false;
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
