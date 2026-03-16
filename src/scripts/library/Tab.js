import { mvJs, root } from "@config";

class Tab {
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
      dataOptions: null,
    };

    const selector = {
      tabPanel: ":scope > div[role=tabpanel]",
      tabUL: ":scope > ul[role=tablist] > li[role=presentation] > a[role=tab]",
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
            targetIndex =
              currentIndex === 0 ? el.tabList.length - 1 : currentIndex - 1;
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

        return requestAnimationFrame(() =>
          checkScroll(
            [...el.tabPanelList],
            topH,
            (idx) => {
              if (idx !== undefined) {
                method.activateTab(el.tabList[idx]);
              }
            },
            {
              yArr: [...el.tabPanelList].map((panel) => panel.offsetTop),
              heightArr: [...el.tabPanelList].map(
                (panel) =>
                  panel.offsetHeight +
                  parseInt(window.getComputedStyle(panel.parentElement).rowGap),
              ),
            },
          ),
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
          el.tabWrap.parentElement,
        );

        if (position === "sticky") {
          const { height } = el.tabWrap.parentElement.getBoundingClientRect();
          topH = height + parseInt(top);
        }
      },
    };

    const method = {
      activateTab: (target) => {
        if (!target) return;

        [...el.tabList].forEach((el) => {
          el.setAttribute("aria-selected", "false");
          el.parentElement.classList.remove("is-on");
        });

        // 활성화 된 role="tab" 항목은 aria-selected="true"로 변경
        target.setAttribute("aria-selected", "true");
        target.parentElement.classList.add("is-on");
        [...el.tabPanelList].forEach((el) => {
          el.setAttribute("aria-hidden", "true");
        });
      },

      activeContent: (target) => {
        // 활성화 된 role="tabpanel"은 aria-hidden="false"로 변경
        const panelId = target.getAttribute("aria-controls");
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
      scrollToContent: (target) => {
        if (!target) return;

        const panelId = target.getAttribute("href");
        const panel = document.querySelector(panelId);

        const y = panel.getBoundingClientRect().top + window.pageYOffset - topH;

        window.scrollTo({
          top: y + 1, // 1px 추가하여 정확히 패널이 보이도록 조정
          behavior: "smooth",
        });
      },

      /**
       * @callback centerTab
       * @memberof Tab
       * @description 활성화 된 탭이 탭 리스트 영역의 중앙에 오도록 스크롤 이동
       */
      centerTab: (target) => {
        const tabBox = el.tabWrap;
        const tab = target
          ? target
          : tabBox.querySelector("[aria-selected=true]");

        if (!tab) return;

        const scrollLeft =
          tab.offsetLeft - tabBox.clientWidth / 2 + tab.clientWidth / 2;

        tabBox.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      },
    };

    const bind = () => {
      if (el.tabList) {
        [...el.tabList].forEach((el) => {
          el.addEventListener("click", handler.clickTab);
          el.addEventListener("keydown", handler.keyDown);
        });
      }

      window.addEventListener("scroll", handler.scroll);
      window.addEventListener("resize", handler.resize);
    };

    const unbind = () => {
      if (el.tabList) {
        [...el.tabList].forEach((el) => {
          el.removeEventListener("click", handler.clickTab);
          el.removeEventListener("keydown", handler.keyDown);
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
        const tabContentIds = [...el.tabList]
          .map((tab) => {
            return tab.getAttribute("href");
          })
          .join(",");

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

    const checkScroll = (
      visualDIV,
      exceptionHeight,
      callbackFunction,
      options,
    ) => {
      var defaults = {
        yArr: undefined,
        heightArr: undefined,
      };

      var opts = Object.assign({}, defaults, options);

      var topHeight = exceptionHeight;
      var onIdx = undefined;

      //각각
      var visualYPos, visualDIVHeight;
      for (var idx = 0; idx < visualDIV.length; idx += 1) {
        var item = visualDIV[idx];

        visualYPos =
          opts.yArr === undefined
            ? item.getBoundingClientRect().top + window.scrollY
            : opts.yArr[idx]; //각각의 비주얼 Y 위치
        visualDIVHeight =
          opts.heightArr === undefined
            ? item.offsetHeight
            : opts.heightArr[idx]; //각각의 비주얼 높이

        if (
          visualDIV[0] &&
          window.scrollY <
            visualDIV[0].getBoundingClientRect().top +
              window.scrollY +
              topHeight
        ) {
          //최초 visual 보다 작은 경우
          onIdx = undefined;
          break;
        } else if (visualYPos + visualDIVHeight > window.scrollY + topHeight) {
          onIdx = idx;
          break;
        }
      }

      //마지막
      const documentHeight = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement.scrollHeight,
      );
      if (
        window.scrollY !== 0 &&
        window.scrollY === documentHeight - window.innerHeight
      ) {
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

    /**
     * @function reInit
     * @memberof Tab
     * @description 재생성
     */
    const reInit = () => {
      unbind();

      removeRole();

      setProperty();

      bind();
    };

    init();

    this.reInit = reInit;
  }
}

export const tabController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new Tab(el));
      }
    });
  },
};

/**
 * @namespace tab
 * @alias mvJS.tab
 * @memberof mvJs
 * @description tab 제어
 */
mvJs.tab = {};
/**
 * @param {String} selector - element selector
 * @memberof tab
 * @function init
 * @description tab 인터페이스 모음
 **/
mvJs.tab.init = tabController.init;
