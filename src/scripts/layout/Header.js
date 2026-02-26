import { device } from "@root";

const Header = (function () {
  let activateIndex = null;

  const el = {
    header: null,
    opener: null,
    items: null,
  };

  const selectors = {
    header: ".header",
    opener: "#menu-toggle",
    items: ".depth1-list > li",
  };

  const handler = {
    mouseenter: (e) => {
      const depth1 = e.currentTarget;

      method.setListHeight();

      if (activateIndex === null) {
        const activeItem = el.items.item(activateIndex);
        activateIndex = Array.from(el.items).indexOf(activeItem);
      }
      el.items.forEach((item, idx) => {
        if (item !== depth1) {
          item.classList.remove("active");
        }
      });
    },
    mouseleave: () => {
      const activeItem = el.items.item(activateIndex);

      if (activeItem) activeItem.classList.add("active");
      activateIndex = null;
    },
    clickDepth2: (e) => {
      const depth2 = e.currentTarget;

      depth2.parentElement.classList.toggle("active");
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

      const headerNav = el.header.querySelector(".header-nav");

      if (headerNav) {
        const opened = el.header.classList.contains("opened");

        requestAnimationFrame(() => {
          if (opened) {
            headerNav.style.setProperty("transform", "translateX(0)");
          } else {
            headerNav.style.setProperty("transform", "translateX(100%)");
          }
        });
      }
    },
  };

  const method = {
    setListHeight: () => {
      if (!el.header) return;

      const listWrapper = el.header.querySelector(".depth1-list");

      if (listWrapper) {
        el.header.setAttribute(
          "style",
          `--header-nav-height: ${listWrapper.scrollHeight}px`,
        );
      }
    },
  };

  const bind = () => {
    el.items.forEach((item) => {
      if (device === "desktop") {
        item.addEventListener("mouseenter", handler.mouseenter);
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
    el.items.forEach((item) => {
      item.removeEventListener("mouseenter", handler.mouseenter);
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
    el.items = el.header ? el.header.querySelectorAll(selectors.items) : null;
  };

  const init = () => {
    setProperty();
    bind();

    method.setListHeight();
  };

  const reInit = () => {
    unbind();
    setProperty();
    method.setListHeight();
    bind();
  };

  return {
    init,
    breakpointChecker,
  };
})();

export default Header;
