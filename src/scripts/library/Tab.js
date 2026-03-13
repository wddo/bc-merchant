import { mvJs, root } from "@config";

import { utils } from "@utils";

class Tab {
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
      type: null,
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

        [...el.tabList].forEach((el) => {
          el.setAttribute("aria-selected", "false");
          el.parentElement.classList.remove("is-on");
        });

        // 활성화 된 role="tab" 항목은 aria-selected="true"로 변경
        evt.target.setAttribute("aria-selected", "true");
        evt.target.parentElement.classList.add("is-on");
        [...el.tabPanelList].forEach((el) => {
          el.setAttribute("aria-hidden", "true");
        });

        if (el.type === "anchor") {
          const contentId = evt.target.getAttribute("href").startsWith("#");
          const content = document.querySelector("#" + contentId);
          if (content) {
            method.scrollTo(content);
          }
        } else {
          // 활성화 된 role="tabpanel"은 aria-hidden="false"로 변경
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
      scroll: () => {},
    };

    const method = {
      scrollTo: (target) => {},
    };

    const bind = () => {
      if (el.tabList) {
        [...el.tabList].forEach((el) => {
          el.addEventListener("click", handler.clickTab);
          el.addEventListener("keydown", handler.keyDown);
        });
      }

      window.addEventListener("resize", utils.throttle(handler.scroll, 100));
    };

    const unbind = () => {
      if (el.tabList) {
        [...el.tabList].forEach((el) => {
          el.removeEventListener("click", handler.clickTab);
          el.removeEventListener("keydown", handler.keyDown);
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
