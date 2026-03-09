(() => {
  // src/scripts/layout/Header.js
  var Header = /* @__PURE__ */ (function() {
    let activateIndex = null;
    const el = {
      header: null,
      nav: null,
      opener: null,
      items: null
    };
    const selectors = {
      header: ".header",
      nav: ".header-nav",
      opener: "#menu-toggle",
      items: ".depth1-list > li"
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
        if (el.nav) {
          const opened = el.header.classList.contains("opened");
          requestAnimationFrame(() => {
            if (opened) {
              el.nav.style.setProperty("transform", "translateX(0)");
            } else {
              el.nav.style.setProperty("transform", "translateX(100%)");
            }
          });
        }
      }
    };
    const method = {
      setListHeight: () => {
        if (!el.header) return;
        const listWrapper = el.header.querySelector(".depth1-list");
        if (listWrapper) {
          el.header.setAttribute(
            "style",
            `--header-nav-height: ${listWrapper.scrollHeight}px`
          );
        }
      }
    };
    const bind = () => {
      el.items.forEach((item) => {
        if (device === "desktop") {
          item.addEventListener("mouseenter", handler.mouseenter);
        } else {
          item.querySelectorAll("a.depth2").forEach((depth2) => {
            depth2.addEventListener("click", handler.clickDepth2);
          });
          item.querySelectorAll("a.depth3").forEach((depth3) => {
            depth3.addEventListener("click", handler.clickDepth3);
          });
        }
      });
      if (device === "desktop") {
        el.header.addEventListener("mouseleave", handler.mouseleave);
      } else {
        el.opener.addEventListener("click", handler.clickOpener);
      }
    };
    const unbind = () => {
      el.items.forEach((item) => {
        item.removeEventListener("mouseenter", handler.mouseenter);
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
      el.nav.style.setProperty("transform", "");
    };
    function breakpointChecker() {
      reInit();
      if (device !== "desktop") {
      } else {
      }
    }
    const setProperty = () => {
      el.header = document.querySelector(selectors.header);
      el.opener = el.header ? el.header.querySelector(selectors.opener) : null;
      el.nav = el.header ? el.header.querySelector(selectors.nav) : null;
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
      breakpointChecker
    };
  })();
  var Header_default = Header;

  // src/scripts/config/index.js
  var mvJs = (() => {
    if (!window.mvJs) {
      window.mvJs = {};
    }
    return window.mvJs;
  })();
  var _weakMap = /* @__PURE__ */ new WeakMap();
  var root = {
    weakMap: _weakMap
  };

  // src/scripts/library/Accordion.js
  var Accordion = class _Accordion {
    /**
     * Create a Accordion
     * @class Accordion
     * @param {Element} target - 생성 타겟
     * @description accordion 생성
     */
    constructor(target) {
      const el = {
        target,
        accordion: null,
        dataOptions: null,
        optionId: null,
        openType: null,
        animation: null,
        animationSpeed: null,
        accHeader: null,
        accPanel: null,
        accButton: null
      };
      const selector = {
        dataOptions: "data-options",
        accHeader: ".accordion-header",
        accPanel: ".accordion-panel",
        accButton: ".accordion-btn",
        accItem: ".accordion-item"
      };
      const setProperty = () => {
        el.accordion = el.target;
        el.accButton = el.target.querySelectorAll(selector.accButton);
        if (el.target.dataset.options) {
          el.dataOptions = JSON.parse(el.target.dataset.options);
          const id = el.dataOptions.id ? el.dataOptions.id : "accordion";
          el.optionId = id + "_" + _Accordion.index;
          el.openType = el.dataOptions.openType ? el.dataOptions.openType : "single";
          el.animation = el.dataOptions.animation;
          el.animationSpeed = el.dataOptions.animationSpeed;
        }
        el.accHeader = el.target.querySelectorAll(selector.accHeader);
        el.accPanel = el.target.querySelectorAll(selector.accPanel);
        [...el.accHeader].forEach((singleAccHeader, index) => {
          singleAccHeader.setAttribute("id", el.optionId + "_btn_" + (index + 1));
          if (el.accPanel[index]) {
            el.accPanel[index].setAttribute(
              "aria-labelledby",
              singleAccHeader.id
            );
          }
          if (singleAccHeader.querySelector("button")) {
            singleAccHeader.querySelector("button").dataText = root.weakMap.get(
              singleAccHeader.querySelector("[data-text]")
            );
          }
        });
        [...el.accPanel].forEach((singleAccPanel, index) => {
          singleAccPanel.setAttribute(
            "id",
            el.optionId + "_panel_" + (index + 1)
          );
          if (el.accHeader[index] && el.accHeader[index].querySelector(".accordion-btn")) {
            el.accHeader[index].querySelector(".accordion-btn").setAttribute("aria-controls", singleAccPanel.id);
          }
        });
        [...el.target.querySelectorAll(".accordion-item")].forEach((element) => {
          if (!element.querySelector(selector.accHeader)) {
            return;
          }
          const panel = element.querySelector(selector.accPanel);
          const putton = element.querySelector(selector.accHeader).querySelector("button");
          if (!panel || !putton) {
            return;
          }
          panel.style.overflow = "hidden";
          if (putton.getAttribute("aria-expanded") === "false") {
            panel.style.height = "0px";
          }
          panel.style.display = "block";
        });
        _Accordion.index++;
      };
      const handler = {
        /**
         * @callback btnClick
         * @memberof Accordion
         * @description accordian 오픈 및 닫기
         */
        btnClick: (e) => {
          const btnArrow = e.currentTarget.getAttribute("aria-expanded");
          const elId = e.currentTarget.getAttribute("aria-controls");
          e.preventDefault();
          if (el.openType === "multi") {
            if (btnArrow === "true") {
              e.currentTarget.setAttribute("aria-expanded", "false");
              e.currentTarget.dataText ? e.currentTarget.dataText.show(1) : null;
              method.close(elId);
            } else {
              e.currentTarget.setAttribute("aria-expanded", "true");
              e.currentTarget.dataText ? e.currentTarget.dataText.show(2) : null;
              method.open(elId);
            }
          } else if (el.openType === "single") {
            if (btnArrow === "true") {
              e.currentTarget.setAttribute("aria-expanded", "false");
              e.currentTarget.dataText ? e.currentTarget.dataText.show(1) : null;
              method.close(elId);
              return;
            }
            const accSingleEl = el.target.querySelectorAll(selector.accItem);
            const thisItem = e.currentTarget.closest(selector.accItem);
            [...accSingleEl].forEach((element) => {
              if (thisItem === element) {
                e.currentTarget.setAttribute("aria-expanded", "true");
                e.currentTarget.dataText ? e.currentTarget.dataText.show(2) : null;
                method.open(elId);
                return;
              }
              if (element.querySelector(".accordion-btn")) {
                element.querySelector(".accordion-btn").setAttribute("aria-expanded", "false");
                element.querySelector(".accordion-btn").dataText ? element.querySelector(".accordion-btn").dataText.show(1) : null;
              }
              const notActiveBtn = element.querySelector(".accordion-btn");
              const notActiveElId = notActiveBtn.getAttribute("aria-controls");
              method.close(notActiveElId);
            });
          }
        }
      };
      const util = {
        getDurationMs: () => {
          const speed = Number(el.animationSpeed);
          if (Number.isNaN(speed) || speed < 0) {
            return 300;
          }
          return speed <= 10 ? speed * 1e3 : speed;
        },
        clearTransition: (panelElement) => {
          if (panelElement._accordionTransitionHandler) {
            panelElement.removeEventListener(
              "transitionend",
              panelElement._accordionTransitionHandler
            );
            panelElement._accordionTransitionHandler = null;
          }
          panelElement.style.transition = "";
        },
        setTransition: (panelElement, onComplete) => {
          const transitionHandler = (event) => {
            if (event.target !== panelElement || event.propertyName !== "height") {
              return;
            }
            panelElement.removeEventListener("transitionend", transitionHandler);
            panelElement._accordionTransitionHandler = null;
            panelElement.style.transition = "";
            if (onComplete) {
              onComplete();
            }
          };
          panelElement._accordionTransitionHandler = transitionHandler;
          panelElement.addEventListener("transitionend", transitionHandler);
          panelElement.style.transition = "height " + util.getDurationMs() + "ms ease";
        }
      };
      const method = {
        /**
         * @callback open
         * @memberof Accordion
         * @description accordion 오픈
         */
        open: (elId) => {
          const activePanelElement = el.target.querySelector("#" + elId);
          if (!activePanelElement) {
            return;
          }
          activePanelElement.style.height = "";
          activePanelElement.style.display = "";
          const height = activePanelElement.offsetHeight;
          activePanelElement.style.height = "0px";
          if (el.animation) {
            util.clearTransition(activePanelElement);
            util.setTransition(activePanelElement, () => {
              activePanelElement.style.height = "";
              activePanelElement.style.overflow = "";
            });
            requestAnimationFrame(() => {
              activePanelElement.style.height = height + "px";
            });
          } else {
            util.clearTransition(activePanelElement);
            activePanelElement.style.height = "auto";
            activePanelElement.style.display = "";
            activePanelElement.style.overflow = "";
          }
          activePanelElement.setAttribute("aria-hidden", "false");
        },
        /**
         * @callback close
         * @memberof Accordion
         * @description accordion 닫기
         */
        close: (elId) => {
          const activePanelElement = el.target.querySelector("#" + elId);
          if (!activePanelElement) {
            return;
          }
          const isAlreadyClosed = activePanelElement.getAttribute("aria-hidden") === "true" && (activePanelElement.style.height === "0px" || activePanelElement.offsetHeight === 0);
          if (isAlreadyClosed) {
            util.clearTransition(activePanelElement);
            activePanelElement.style.overflow = "hidden";
            activePanelElement.style.height = "0px";
            activePanelElement.setAttribute("aria-hidden", "true");
            return;
          }
          activePanelElement.style.overflow = "hidden";
          if (el.animation) {
            util.clearTransition(activePanelElement);
            if (activePanelElement.style.display === "none") {
              activePanelElement.style.display = "";
            }
            activePanelElement.style.height = activePanelElement.scrollHeight + "px";
            activePanelElement.offsetHeight;
            util.setTransition(activePanelElement, () => {
              activePanelElement.style.display = "none";
              activePanelElement.style.height = "0px";
            });
            requestAnimationFrame(() => {
              activePanelElement.style.height = "0px";
            });
          } else {
            util.clearTransition(activePanelElement);
            activePanelElement.style.height = "0px";
            activePanelElement.style.display = "none";
          }
          activePanelElement.setAttribute("aria-hidden", "true");
        }
      };
      const bind = () => {
        if (el.accButton) {
          el.accButton.forEach((el2) => {
            el2.addEventListener("click", handler.btnClick);
          });
        }
      };
      const unbind = () => {
        if (el.accButton) {
          el.accButton.forEach((el2) => {
            el2.removeEventListener("click", handler.btnClick);
          });
        }
      };
      const init = () => {
        setProperty();
        bind();
      };
      const reInit = () => {
        unbind();
        setProperty();
        bind();
      };
      init();
      this.reInit = reInit;
    }
  };
  Accordion.index = 0;
  Accordion.ANIMATION_TYPE = "animation";
  Accordion.ANIMATION_NONE = "animationNone";
  Accordion.animationType = Accordion.ANIMATION_TYPE;
  var accordionController = {
    init: (selector) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
        if (obj) {
          obj.reInit();
        } else {
          root.weakMap.set(el, new Accordion(el));
        }
      });
    }
  };
  mvJs.accordion = {};
  mvJs.accordion.init = (selector) => {
    accordionController.init(selector);
  };

  // src/scripts/library/DataText.js
  var DataText = class {
    /**
     * Create a DataText
     * @class DataText
     * @param {Element} target - 생성 타겟
     * @description data-text 속성(property) 이 있는 경우엔 해당 엘리먼트에 텍스트 영역에 문구 추가
     */
    constructor(target) {
      const el = {
        target,
        textContent: null
      };
      let obj = JSON.parse(el.target.dataset.text);
      let textArr = obj.text.split("|");
      let first = parseInt(obj.show);
      const bind = () => {
      };
      const unbind = () => {
      };
      const setProperty = () => {
        el.target.textContent = textArr[first - 1];
      };
      const init = () => {
        setProperty();
        bind();
      };
      const reInit = () => {
        unbind();
        setProperty();
        bind();
      };
      const show = (num) => {
        el.target.textContent = textArr[num - 1];
      };
      init();
      this.show = show;
      this.reInit = reInit;
    }
  };
  var dataTextController = {
    init: (selector) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
        if (obj) {
          obj.reInit();
        } else {
          root.weakMap.set(el, new DataText(el));
        }
      });
    }
  };
  mvJs.dataText = {};
  mvJs.dataText.init = dataTextController.init;

  // src/scripts/pages/co.js
  var Company = /* @__PURE__ */ (function() {
    function init() {
    }
    function resize() {
    }
    function breakpointChecker(e) {
      if (!e.matches) {
      } else {
      }
    }
    return {
      init,
      resize,
      breakpointChecker
    };
  })();
  var co_default = Company;

  // src/scripts/index.js
  var device = null;
  (function() {
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
      dataTextController.init("[data-text]");
      accordionController.init(".accordion");
      if (pbui) {
        if (pbui.tooltip) {
          pbui.tooltip.init(".tooltip-trigger:not([id])");
        }
        if (pbui.selectmenu) {
          pbui.selectmenu.init(".input-box select");
        }
      }
      bind();
      if (Header_default) Header_default.init();
      if (co_default) co_default.init();
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
    }
    function resizeHandler() {
      if (co_default) co_default.resize();
    }
    function breakpointChecker() {
      console.log("breakpoint !!!", device);
      if (Header_default) Header_default.breakpointChecker();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", contentReady);
    } else {
      contentReady();
    }
    document.addEventListener("DOMContentLoaded", contentReady);
  })();
})();
