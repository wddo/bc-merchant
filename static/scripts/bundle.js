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

  // src/scripts/utils/index.js
  var dynamicListenerHandlers = [];
  var getConditionalCallback = (selector, callback) => {
    return function(e) {
      if (e.target && e.target.matches(selector)) {
        e.delegatedTarget = e.target;
        callback.apply(this, arguments);
        return;
      }
      let path = e.path || e.composedPath && e.composedPath();
      if (!path) {
        return;
      }
      for (let i = 0; i < path.length; ++i) {
        let el = path[i];
        if (el.matches(selector)) {
          e.delegatedTarget = el;
          callback.apply(this, arguments);
        }
        if (el === e.currentTarget) {
          return;
        }
      }
    };
  };
  var utils = {
    getIndex(el) {
      if (!el.parentNode) {
        return -1;
      }
      let list = el.parentNode.children;
      let temp = [];
      [...list].forEach((tel) => {
        if (el.nodeName === tel.nodeName || el.tagName === tel.tagName) {
          temp.push(tel);
        }
      });
      list = temp;
      if (!list) {
        return -1;
      }
      let indexof = [].indexOf;
      let len = list.length;
      if (indexof) {
        return indexof.call(list, el);
      }
      for (let i = 0; i < len; ++i) {
        if (el === list[i]) {
          return i;
        }
      }
      return -1;
    },
    trigger(el, event, otions = null) {
      const evt = otions ? new CustomEvent(event, otions) : new CustomEvent(event);
      el.dispatchEvent(evt);
    },
    setAttributes(el, attrs) {
      for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    },
    isPc() {
      let value = false;
      const moSize = 767;
      if (moSize < window.innerWidth) {
        value = true;
      }
      return value;
    },
    keyCode: {
      ENTER: 13,
      SPACE: 32,
      UP: 38,
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39
    },
    addDynamicEventListener(rootSelector, eventType, selector, callback, options) {
      let rootElement = document.body;
      if (rootSelector !== "body") {
        rootElement = document.querySelector(rootSelector);
      }
      let cb = getConditionalCallback(selector, callback);
      rootElement.addEventListener(eventType, cb, options);
      if (!dynamicListenerHandlers[selector + " " + eventType]) {
        dynamicListenerHandlers[selector + " " + eventType] = cb;
      }
    },
    removeDynamicEventListener(rootSelector, eventType, selector) {
      let handler = dynamicListenerHandlers[`${selector} ${eventType}`];
      let rootElement = document.body;
      if (rootSelector !== "body") {
        rootElement = document.querySelector(rootSelector);
      }
      rootElement.removeEventListener(eventType, handler);
    },
    leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    },
    toStringByFormatting(source, delimiter = "-") {
      const year = source.getFullYear();
      const month = utils.leftPad(source.getMonth() + 1);
      const day = utils.leftPad(source.getDate());
      return [year, month, day].join(delimiter);
    },
    /**
     * @description 문자열을 불리언 타입으로 변환
     * @param {string} value
     * @returns {boolean}
     * @example
     *
     * parseBoolean(true);       // true
     * parseBoolean("true");     // true
     * parseBoolean("FALSE");    // false
     * parseBoolean("1");        // true
     * parseBoolean("0");        // false
     * parseBoolean(1);          // true
     * parseBoolean(null);       // false
     * parseBoolean(undefined);  // false
     * parseBoolean("yes");      // false
     */
    parseBoolean(value) {
      try {
        if (typeof value === "boolean") {
          return value;
        }
        if (typeof value === "string") {
          const val = value.trim().toLowerCase();
          if (val === "true" || val === "1") {
            return true;
          }
          if (val === "false" || val === "0" || val === "") {
            return false;
          }
        }
        if (typeof value === "number") {
          return value !== 0;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    /**
     * @description 다양한 타입의 target을 받아서 element를 반환
     * @param {string|Element|NodeList} target - 셀렉터 문자열, 엘리먼트, 노드 컬렉션
     * @returns {Element|null} - 엘리먼트 또는 null
     * @example
     *
     * getElement('.class');           // 클래스 셀렉터
     * getElement('#id');              // ID 셀렉터
     * getElement('tag');              // 태그 셀렉터
     * getElement(element);            // 엘리먼트
     * getElement([NodeList]);         // NodeList의 첫 번째 요소
     */
    getElement(target) {
      if (!target) {
        return null;
      }
      if (target instanceof Element) {
        return target;
      }
      if (typeof target === "string") {
        if (target && !target.startsWith("#") && !target.startsWith(".") && !target.includes(" ")) {
          return document.querySelector(`#${target}`);
        }
        return document.querySelector(target);
      }
      if (target instanceof NodeList) {
        return target.length > 0 ? target.item(0) : null;
      }
      if (Array.isArray(target)) {
        return target.length > 0 ? target[0] : null;
      }
      return null;
    },
    /**
     * @description throttle (스크롤 성능 개선)
     * @param {Function} fn
     * @param {Number} wait
     */
    throttle(fn, wait) {
      let time = Date.now();
      return function() {
        if (time + wait - Date.now() < 0) {
          fn();
          time = Date.now();
        }
      };
    }
  };

  // src/scripts/library/Tab.js
  var Tab = class {
    /**
     * Create a Tab
     * @class Tab
     * @param {Element} target - 생성 타겟
     * @description .js-tab 클래스가 있는 ui에 적용
     */
    constructor(target) {
      const el = {
        tabWrap: target,
        tabPanelList: null,
        tabList: null,
        dataOptions: null,
        type: null
      };
      const selector = {
        tabPanel: ":scope > div[role=tabpanel]",
        tabUL: ":scope > ul[role=tablist] > li[role=presentation] > a[role=tab]"
      };
      const handler = {
        /**
         * @callback clickTab
         * @memberof Tab
         * @description Tab클릭 시 해당 aria-selected="true"로 변경 및 role="tabpanel"은 aria-hidden="false"로 변경
         */
        clickTab: (evt) => {
          evt.preventDefault();
          [...el.tabList].forEach((el2) => {
            el2.setAttribute("aria-selected", "false");
            el2.parentElement.classList.remove("is-on");
          });
          evt.target.setAttribute("aria-selected", "true");
          evt.target.parentElement.classList.add("is-on");
          [...el.tabPanelList].forEach((el2) => {
            el2.setAttribute("aria-hidden", "true");
          });
          if (el.type === "anchor") {
            const contentId = evt.target.getAttribute("href").startsWith("#");
            const content = document.querySelector("#" + contentId);
            if (content) {
              method.scrollTo(content);
            }
          } else {
            const panelId = evt.target.getAttribute("aria-controls");
            const panel = document.querySelector("#" + panelId);
            if (panel) {
              panel.setAttribute("aria-hidden", "false");
            }
          }
        },
        /**
         * @callback keyDown
         * @memberof Tab
         * @description 키보드 방향키로 탭 버튼 간 포커스 이동
         */
        keyDown: (evt) => {
          const currentTab = evt.currentTarget;
          const currentIndex = Array.from(el.tabList).indexOf(currentTab);
          let targetIndex;
          switch (evt.key) {
            case "ArrowRight":
            case "ArrowDown":
              evt.preventDefault();
              targetIndex = (currentIndex + 1) % el.tabList.length;
              break;
            case "ArrowLeft":
            case "ArrowUp":
              evt.preventDefault();
              targetIndex = currentIndex === 0 ? el.tabList.length - 1 : currentIndex - 1;
              break;
            case "Home":
              evt.preventDefault();
              targetIndex = 0;
              break;
            case "End":
              evt.preventDefault();
              targetIndex = el.tabList.length - 1;
              break;
            default:
              return;
          }
          const targetTab = el.tabList[targetIndex];
          if (targetTab) {
            targetTab.focus();
          }
        },
        /**
         * @callback scroll
         * @memberof Tab
         * @description 스크롤 이동
         */
        scroll: () => {
        }
      };
      const method = {
        scrollTo: (target2) => {
        }
      };
      const bind = () => {
        if (el.tabList) {
          [...el.tabList].forEach((el2) => {
            el2.addEventListener("click", handler.clickTab);
            el2.addEventListener("keydown", handler.keyDown);
          });
        }
        window.addEventListener("resize", utils.throttle(handler.scroll, 100));
      };
      const unbind = () => {
        if (el.tabList) {
          [...el.tabList].forEach((el2) => {
            el2.removeEventListener("click", handler.clickTab);
            el2.removeEventListener("keydown", handler.keyDown);
          });
        }
      };
      const setProperty = () => {
        el.tabPanelList = el.tabWrap.querySelectorAll(selector.tabPanel);
        el.tabList = el.tabWrap.querySelectorAll(selector.tabUL);
        if (el.target.dataset.options) {
          el.dataOptions = JSON.parse(el.target.dataset.options);
        }
      };
      const addRole = () => {
        el.tabWrap.querySelector("ul").setAttribute("role", "tablist");
        [...el.tabWrap.querySelectorAll("ul > li")].forEach((li) => {
          li.setAttribute("role", "presentation");
        });
        [...el.tabWrap.querySelectorAll("ul > li > a")].forEach((a) => {
          a.setAttribute("role", "tab");
        });
      };
      const removeRole = () => {
        el.tabWrap.querySelector("ul").removeAttribute("role");
        [...el.tabWrap.querySelectorAll("ul > li")].forEach((li) => {
          li.removeAttribute("role");
        });
        [...el.tabWrap.querySelectorAll("ul > li > a")].forEach((a) => {
          a.removeAttribute("role");
        });
      };
      const init = () => {
        addRole();
        setProperty();
        bind();
      };
      const reInit = () => {
        unbind();
        removeRole();
        setProperty();
        bind();
      };
      init();
      this.reInit = reInit;
    }
  };
  var tabController = {
    init: (selector) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
        if (obj) {
          obj.reInit();
        } else {
          root.weakMap.set(el, new Tab(el));
        }
      });
    }
  };
  mvJs.tab = {};
  mvJs.tab.init = tabController.init;

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
      tabController.init(".tab-box-xxx");
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
