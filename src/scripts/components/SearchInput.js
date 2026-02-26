import { mvJs, root } from '@config';

class SearchInput {
  /**
   * Create a SearchInput
   * @class SearchInput
   * @param {Element} target - 생성 타겟
   * @description search 검색 시 삭제버튼 노출
   */
  constructor(target) {
    const el = {
      target: target,
      input: null,
      delete: null
    };

    const selector = {
      input: 'input',
      delete: '.btnDelete'
    };

    const handler = {
      keyup() {
        method.update();
      },
      delete() {
        el.delete.style.display = '';
        el.input.value = '';
      }
    };

    const method = {
      update() {
        if (!el.delete) {
          return;
        }

        if (el.input.value === '') {
          el.delete.style.display = '';
        } else {
          el.delete.style.display = 'block';
        }
      }
    };

    const setProperty = () => {
      el.input = el.target.querySelector(selector.input);
      el.delete = el.target.querySelector(selector.delete);
    };

    const bind = () => {
      el.input.addEventListener('keyup', handler.keyup);
      if (el.delete) {
        el.delete.addEventListener('click', handler.delete);
      }
    };

    const unbind = () => {
      el.input.removeEventListener('keyup', handler.keyup);
      if (el.delete) {
        el.delete.removeEventListener('click', handler.delete);
      }
    };

    const init = () => {
      setProperty();
      bind();

      method.update();
    };

    /**
     * @function reInit
     * @memberof SearchInput
     * @description SearchInput 인스턴스 재생성
     */
    const reInit = () => {
      unbind();
      setProperty();
      bind();

      method.update();
    };

    init();

    this.reInit = reInit;
  }
}

export const searchInputController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new SearchInput(el));
      }
    });
  }
};

/**
 * @namespace searchInput
 * @alias mvJS.searchInput
 * @memberof mvJs
 * @description SearchInput 활성화
 */
mvJs.searchInput = {};
/**
 * @param {String} selector - element selector
 * @memberof searchInput
 * @function init
 * @description SearchInput 인스턴스 생성
 **/
mvJs.searchInput.init = searchInputController.init;
