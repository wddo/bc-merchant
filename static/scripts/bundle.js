(() => {
  // src/scripts/layout/Header.js
  var Header = /* @__PURE__ */ (function() {
    let activated = null;
    let scrollPosition = 0;
    let isMobile = device !== "desktop";
    const CSSVar = {
      HOVER_HEIGHT: "--header-nav-height",
      ALL_NAV_HEIGHT: "--header-all-nav-height",
      ON_WIDTH: "--header-nav-on-width",
      OFF_WIDTH: "--header-nav-off-width"
    };
    const el = {
      header: null,
      nav: null,
      opener: null,
      allItems: null
    };
    const selectors = {
      header: ".header",
      topnav: ".header-top-nav",
      allnav: ".header-all-nav",
      opener: "#menu-toggle",
      topItems: ".header-top-nav .depth1-list > li",
      allItems: ".header-all-nav .depth1-list > li"
    };
    const handler = {
      mouseenter: (e) => {
        const depth1 = e.currentTarget;
        if (activated === null) {
          const activeItem = [...el.topItems].filter(
            (item) => item.classList.contains("active")
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
      }
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
          method.collapseDepth2All(depth2A);
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
          if (item !== currentDepth2A) {
            method.collapseDepth2(item);
          }
        });
      },
      // scroll lock
      lockScroll: () => {
        document.documentElement.style.setProperty("overflow", "hidden");
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
          el.opener.setAttribute("aria-expanded", "true");
          el.opener.setAttribute("aria-label", "\uC804\uCCB4 \uBA54\uB274 \uB2EB\uAE30");
          el.allnav.style.setProperty("display", "block");
          method.setVariableAllNav();
          method.saveScroll();
          method.lockScroll();
          el.header.parentElement.classList.add("opened");
        } else {
          el.opener.setAttribute("aria-expanded", "false");
          el.opener.setAttribute("aria-label", "\uC804\uCCB4 \uBA54\uB274 \uC5F4\uAE30");
          method.restoreScroll();
          method.setTransitionEndOnce(el.allnav, handler.transEndAllNav);
          el.allnav.style.setProperty("height", "0");
        }
      },
      // topnav 변수 정의
      setVariableTopNav: () => {
        if (!el.header) return;
        const { HOVER_HEIGHT, ON_WIDTH, OFF_WIDTH } = CSSVar;
        el.topnav.style.setProperty("display", "block");
        const wrap = el.topnav.querySelector(".depth1-list");
        if (wrap) {
          el.header.style.removeProperty(HOVER_HEIGHT);
          el.header.style.setProperty(HOVER_HEIGHT, `${wrap.scrollHeight}px`);
        }
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
            if (!item.style.getPropertyValue("--height")) {
              item.style.setProperty("--height", `${item.scrollHeight}px`);
              item.style.setProperty("display", "none");
            }
          });
        } else {
          el.allnav.querySelectorAll(".depth3-list").forEach((item) => {
            item.style.removeProperty("--height");
          });
          el.header.style.setProperty(
            ALL_NAV_HEIGHT,
            `${el.allnav.scrollHeight}px`
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
      }
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
      if (!isMobile) {
        el.header.addEventListener("mouseleave", handler.mouseleave);
      }
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
        isMobile = true;
      } else {
        isMobile = false;
      }
    }
    const setProperty = () => {
      el.header = document.querySelector(selectors.header);
      el.opener = el.header ? el.header.querySelector(selectors.opener) : null;
      el.topnav = el.header ? el.header.querySelector(selectors.topnav) : null;
      el.allnav = el.header ? el.header.querySelector(selectors.allnav) : null;
      cloneAllItemsToTopNav();
      el.topItems = el.header ? el.header.querySelectorAll(selectors.topItems) : null;
      el.allItems = el.header ? el.header.querySelectorAll(selectors.allItems) : null;
    };
    const cloneAllItemsToTopNav = () => {
      if (el.topnav && el.allnav) {
        if (el.topnav.children.length) el.topnav.children.item(0).remove();
        const ul = document.createElement("ul");
        ul.classList.add("depth1-list");
        el.topnav.appendChild(ul);
        const allItems = el.allnav.querySelectorAll(selectors.allItems);
        allItems.forEach((item, idx) => {
          if (idx === 4 || idx === 5 || idx === 6) return;
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

  // src/scripts/library/Tab.js
  var Tab = class {
    /**
     * Create a Tab
     * @class Tab
     * @param {Element} target - 생성 타겟
     * @description .js-tab 클래스가 있는 ui에 적용
     */
    constructor(target) {
      let topH = 0;
      const el = {
        tabWrap: target,
        tabList: null,
        tabPanelList: null,
        dataOptions: null
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
          if (el.type === "anchor") {
            method.scrollToContent(evt.target);
          } else {
            method.activateTab(evt.target);
            method.centerTab(evt.target);
            method.activeContent(evt.target);
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
          method.centerTab();
          return requestAnimationFrame(
            () => checkScroll(
              [...el.tabPanelList],
              topH,
              (idx) => {
                if (idx !== void 0) {
                  method.activateTab(el.tabList[idx]);
                }
              },
              {
                yArr: [...el.tabPanelList].map((panel) => panel.offsetTop),
                heightArr: [...el.tabPanelList].map(
                  (panel) => panel.offsetHeight + parseInt(window.getComputedStyle(panel.parentElement).rowGap)
                )
              }
            )
          );
        },
        /**
         * @callback resize
         * @memberof Tab
         * @description 리사이즈
         */
        resize: () => {
          if (!el.tabWrap) return;
          const { position, top } = window.getComputedStyle(
            el.tabWrap.parentElement
          );
          if (position === "sticky") {
            const { height } = el.tabWrap.parentElement.getBoundingClientRect();
            topH = height + parseInt(top);
          }
        }
      };
      const method = {
        activateTab: (target2) => {
          if (!target2) return;
          [...el.tabList].forEach((el2) => {
            el2.setAttribute("aria-selected", "false");
            el2.parentElement.classList.remove("is-on");
          });
          target2.setAttribute("aria-selected", "true");
          target2.parentElement.classList.add("is-on");
          [...el.tabPanelList].forEach((el2) => {
            el2.setAttribute("aria-hidden", "true");
          });
        },
        activeContent: (target2) => {
          const panelId = target2.getAttribute("aria-controls");
          const panel = document.querySelector("#" + panelId);
          if (panel) {
            panel.setAttribute("aria-hidden", "false");
          }
        },
        /**
         * @callback scrollToContent
         * @memberof Tab
         * @description 앵커 탭 클릭 시 해당 패널로 스크롤 이동
         * @param {Element} target - 스크롤 이동할 패널 요소
         */
        scrollToContent: (target2) => {
          if (!target2) return;
          const panelId = target2.getAttribute("href");
          const panel = document.querySelector(panelId);
          const y = panel.getBoundingClientRect().top + window.pageYOffset - topH;
          window.scrollTo({
            top: y + 1,
            // 1px 추가하여 정확히 패널이 보이도록 조정
            behavior: "smooth"
          });
        },
        /**
         * @callback centerTab
         * @memberof Tab
         * @description 활성화 된 탭이 탭 리스트 영역의 중앙에 오도록 스크롤 이동
         */
        centerTab: (target2) => {
          const tabBox = el.tabWrap;
          const tab = target2 ? target2 : tabBox.querySelector("[aria-selected=true]");
          if (!tab) return;
          const scrollLeft = tab.offsetLeft - tabBox.clientWidth / 2 + tab.clientWidth / 2;
          tabBox.scrollTo({
            left: scrollLeft,
            behavior: "smooth"
          });
        }
      };
      const bind = () => {
        if (el.tabList) {
          [...el.tabList].forEach((el2) => {
            el2.addEventListener("click", handler.clickTab);
            el2.addEventListener("keydown", handler.keyDown);
          });
        }
        window.addEventListener("scroll", handler.scroll);
        window.addEventListener("resize", handler.resize);
      };
      const unbind = () => {
        if (el.tabList) {
          [...el.tabList].forEach((el2) => {
            el2.removeEventListener("click", handler.clickTab);
            el2.removeEventListener("keydown", handler.keyDown);
          });
        }
        window.removeEventListener("scroll", handler.scroll);
        window.removeEventListener("resize", handler.resize);
      };
      const setProperty = () => {
        if (el.tabWrap.dataset && el.tabWrap.dataset.options) {
          el.dataOptions = JSON.parse(el.tabWrap.dataset.options);
          el.type = el.dataOptions && el.dataOptions.type;
        }
        el.tabList = el.tabWrap.querySelectorAll(selector.tabUL);
        if (el.type === "anchor") {
          const tabContentIds = [...el.tabList].map((tab) => {
            return tab.getAttribute("href");
          }).join(",");
          el.tabPanelList = document.querySelectorAll(tabContentIds);
        } else {
          el.tabPanelList = el.tabWrap.querySelectorAll(selector.tabPanel);
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
      const checkScroll = (visualDIV, exceptionHeight, callbackFunction, options) => {
        var defaults = {
          yArr: void 0,
          heightArr: void 0
        };
        var opts = Object.assign({}, defaults, options);
        var topHeight = exceptionHeight;
        var onIdx = void 0;
        var visualYPos, visualDIVHeight;
        for (var idx = 0; idx < visualDIV.length; idx += 1) {
          var item = visualDIV[idx];
          visualYPos = opts.yArr === void 0 ? item.getBoundingClientRect().top + window.scrollY : opts.yArr[idx];
          visualDIVHeight = opts.heightArr === void 0 ? item.offsetHeight : opts.heightArr[idx];
          if (visualDIV[0] && window.scrollY < visualDIV[0].getBoundingClientRect().top + window.scrollY + topHeight) {
            onIdx = void 0;
            break;
          } else if (visualYPos + visualDIVHeight > window.scrollY + topHeight) {
            onIdx = idx;
            break;
          }
        }
        const documentHeight = Math.max(
          document.body ? document.body.scrollHeight : 0,
          document.documentElement.scrollHeight
        );
        if (window.scrollY !== 0 && window.scrollY === documentHeight - window.innerHeight) {
          onIdx = visualDIV.length - 1;
        }
        callbackFunction(onIdx);
      };
      const init = () => {
        addRole();
        setProperty();
        bind();
        handler.scroll();
        handler.resize();
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
    function setLayout() {
      const h1 = document.querySelector("h1");
      if (h1) {
        const hidden = h1.classList.contains("hidden");
        if (!hidden) {
          document.querySelector("#header").classList.add("sub");
        }
      }
    }
    function bind() {
      window.addEventListener("scroll", scrollHandler);
      window.addEventListener("resize", resizeHandler);
      breakpointDesktop = window.matchMedia("(min-width: 1024px)");
      breakpointMobile = window.matchMedia("(max-width: 767px)");
      breakpointDesktop.addEventListener("change", breakpointHandler);
      breakpointMobile.addEventListener("change", breakpointHandler);
    }
    function contentReady() {
      console.log("ready");
      dataTextController.init("[data-text]");
      accordionController.init(".accordion");
      tabController.init(".js-tab.tab-box");
      if (pbui) {
        if (pbui.tooltip) {
          pbui.tooltip.init(".tooltip-trigger:not([id])");
        }
        if (pbui.selectmenu) {
          pbui.selectmenu.init(".input-box select");
        }
      }
      setLayout();
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
