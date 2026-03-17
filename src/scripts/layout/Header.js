import { device } from "@root";

const Header = (function () {
  let activateIndex = null;

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

      if (activateIndex === null) {
        const activeItem = el.allItems.item(activateIndex);
        activateIndex = Array.from(el.allItems).indexOf(activeItem);
      }
      el.allItems.forEach((item, idx) => {
        if (item !== depth1) {
          item.classList.remove("active");
        }
      });
    },
    mouseleave: () => {
      const activeItem = el.allItems.item(activateIndex);

      if (activeItem) activeItem.classList.add("active");
      activateIndex = null;
    },
    clickDepth2: (e) => {
      const depth2 = e.currentTarget;
      const depth3 = depth2.parentElement.querySelector(".depth3-list");

      if (depth3) {
        e.preventDefault();
        depth2.parentElement.classList.toggle("active");
      }
    },
    clickDepth3: (e) => {
      const depth3 = e.currentTarget;

      depth3.parentElement.classList.toggle("active");
    },
    /* focusoutDepth2: (e) => {
      const depth2List = e.currentTarget;
      depth2.parentElement.classList.remove("active");
    }, */
    clickOpener: () => {
      el.header.classList.toggle("opened");

      if (el.allnav) {
        const opened = el.header.classList.contains("opened");

        requestAnimationFrame(() => {
          if (opened) {
            el.allnav.style.setProperty("transform", "translateX(0)");
          } else {
            el.allnav.style.setProperty("transform", "translateX(100%)");
          }
        });
      }
    },
  };

  const method = {
    setVariable: () => {
      if (!el.header) return;

      // hover height
      const listWrapper = el.topnav.querySelector(".depth1-list");
      const depth2List = el.topnav.querySelectorAll(".depth2-list");

      depth2List.forEach((list) => {
        list.style.setProperty("display", "block");
      });

      if (listWrapper) {
        el.header.removeAttribute("style");

        el.header.setAttribute(
          "style",
          `--header-nav-height: ${listWrapper.scrollHeight}px`,
        );
      }

      // menu width
      let maxWidth = 0;

      el.topItems.forEach((item) => {
        const listWidth = item.scrollWidth;
        if (listWidth > maxWidth) {
          maxWidth = listWidth;
        }
      });

      el.topnav.setAttribute(
        "style",
        `--header-nav-on-width: ${(maxWidth + 16 * 2) * el.topItems.length}px;
        --header-nav-off-width: ${maxWidth * el.topItems.length}px`,
      );

      depth2List.forEach((list) => {
        list.style.setProperty("display", "");
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
      if (device === "desktop") {
        // item.addEventListener("mouseenter", handler.mouseenter);
      } else {
        item.querySelectorAll("a.depth2").forEach((depth2) => {
          depth2.addEventListener("click", handler.clickDepth2);

          /* depth2.parentElement.addEventListener(
            "focusout",
            handler.focusoutDepth2,
          ); */
        });

        item.querySelectorAll("a.depth3").forEach((depth3) => {
          depth3.addEventListener("click", handler.clickDepth3);
        });
      }
    });

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
      // item.removeEventListener("mouseenter", handler.mouseenter);
      item.querySelectorAll("a.depth2").forEach((depth2) => {
        depth2.removeEventListener("click", handler.clickDepth2);

        /* depth2.parentElement.removeEventListener(
          "focusout",
          handler.focusoutDepth2,
        ); */
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
    method.setVariable();
  };

  const reInit = () => {
    unbind();
    setProperty();
    method.setVariable();
    bind();
  };

  return {
    init,
    breakpointChecker,
  };
})();

export default Header;
