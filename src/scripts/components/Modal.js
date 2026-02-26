import { mvJs } from "@config";
import { popupController } from "../library/Popup.js";

class Modal {
  /**
   * Create a Modal
   * @class Modal
   * @param {String} openerSelector - 모달 오픈 트리거 선택자
   * @description Popup 확장 - 모달 오픈 시 body 스크롤 삭제
   */
  constructor(openerSelector) {
    let modals = [];
    const DATASET_ID = "data-popup-id";

    const el = {
      openers: null,
    };

    const selector = {
      popup: ".popup",
      popClose: ".popup-close",
    };

    const handler = {
      /**
       * @function openerClick
       * @memberof Modal
       * @description 모달 열기
       */
      openerClick(e) {
        const id = e.currentTarget.getAttribute(DATASET_ID);
        const popup = document.querySelector(`#${id}`);
        // eslint-disable-next-line no-unused-vars
        const opener = document.querySelector(`[${DATASET_ID}= '${id}']`);

        if (!popup) {
          return;
        }

        const datasetOpt = method.getDatasetOption(popup);
        const { modal } = datasetOpt;

        if (modal !== false) {
          method.lockDocScroll();
        }
      },
      /**
       * @function closeClick
       * @memberof Modal
       * @description 모달 닫기
       */
      closeClick(e) {
        const popup = e.currentTarget.closest(selector.popup);

        method.unLockDocScroll();
        method.resetVideo(popup);
      },
    };

    const method = {
      /**
       * @function getDatasetOption
       * @memberof Modal
       * @description 모달 데이터셋 옵션 조회
       * @param {HTMLElement} popup - 모달 엘리먼트
       * @returns {Object} 모달 데이터셋 옵션
       */
      getDatasetOption(popup) {
        const datasetOpt = popup.dataset.options
          ? JSON.parse(popup.dataset.options)
          : {};
        return datasetOpt;
      },
      /**
       * @function lockDocScroll
       * @memberof Modal
       * @description 모달 열리면 body overflow hidden
       */
      lockDocScroll() {
        document.body.style.overflow = "hidden";
      },
      /**
       * @function unLockDocScroll
       * @memberof Modal
       * @description 모달 닫히면 body overflow 초기화
       */
      unLockDocScroll() {
        document.body.style.overflow = "";
      },
      /**
       * @function resetVideo
       * @memberof Modal
       * @description 비디오 초기화
       * @param {HTMLElement} popup - 모달 엘리먼트
       */
      resetVideo(popup) {
        if (!popup) {
          return;
        }

        const video = popup.querySelector("video");

        if (video) {
          video.currentTime = 0;
          video.pause();
        }
      },
      /**
       * @function registerModal
       * @memberof Modal
       * @description 모달 대상 배열에 등록
       */
      registerModal() {
        modals = [];

        [...el.openers].forEach((elm) => {
          const popup = document.querySelector(
            `#${elm.getAttribute(DATASET_ID)}`,
          );
          if (popup) {
            modals.push(popup);
          }
        });
      },
    };

    const bind = () => {
      [...el.openers].forEach((elm) => {
        elm.addEventListener("click", handler.openerClick);
      });

      modals.forEach((elm) => {
        const close = elm.querySelector(selector.popClose);
        if (close) {
          close.addEventListener("click", handler.closeClick);
        }
      });
    };

    const unbind = () => {
      [...el.openers].forEach((elm) => {
        elm.removeEventListener("click", handler.openerClick);
      });

      modals.forEach((elm) => {
        const close = elm.querySelector(selector.popClose);
        if (close) {
          close.removeEventListener("click", handler.closeClick);
        }
      });
    };

    const setProperty = () => {
      el.openers = document.querySelectorAll(openerSelector);
    };

    const init = () => {
      setProperty();
      method.registerModal();
      bind();
      popupController.controller(openerSelector);

      mvJs.popup.open = (selector) => {
        popupController.open(selector);

        const popup = document.querySelector(selector);

        if (!popup) {
          return;
        }

        const datasetOpt = method.getDatasetOption(popup);
        const { modal } = datasetOpt;

        if (modal !== false) {
          method.lockDocScroll();
        }
      };

      mvJs.popup.close = (selector) => {
        popupController.close(selector);

        const popup = document.querySelector(selector);

        if (!popup) {
          return;
        }

        const datasetOpt = method.getDatasetOption(popup);
        const { modal } = datasetOpt;

        if (modal !== false) {
          method.unLockDocScroll();
        }

        method.resetVideo(popup);
      };
    };

    /**
     * @function reInit
     * @memberof Modal
     * @description Modal 인스턴스 재생성
     */
    const reInit = () => {
      unbind();
      setProperty();
      method.registerModal();
      bind();
      popupController.controller(openerSelector);
    };

    init();

    this.reInit = reInit;
  }
}

let instance = null;
export const modalController = {
  init: (selector) => {
    if (instance) {
      instance.reInit();
    } else {
      instance = new Modal(selector);
    }
  },
};
