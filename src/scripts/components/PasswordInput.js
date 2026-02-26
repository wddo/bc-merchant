import { mvJs, root } from '@config';

class PasswordInput {
  /**
   * Create a PasswordInput
   * @class PasswordInput
   * @param {Element} target - 생성 타겟
   * @description btnPwdViewArea 비밀번호 표시 or 해제
   */
  constructor(target) {
    const el = {
      target: target,
      button: null
    };

    const selector = {
      button: '.btnPwdView'
    };

    const handler = {
      click() {
        method.togglePwdView();
      }
    };

    const method = {
      togglePwdView() {
        const hidden = el.button.querySelector('.hidden');

        if (!el.button.classList.contains('active')) {
          hidden.textContent = '비밀번호 표시 해제';
          el.button.classList.add('active');
          el.target.setAttribute('type', 'text');
        } else {
          hidden.textContent = '비밀번호 표시';
          el.button.classList.remove('active');
          el.target.setAttribute('type', 'password');
        }
      }
    };

    const setProperty = () => {
      el.button = [el.target.nextElementSibling].find((element) =>
        element.matches(selector.button)
      );
    };

    const bind = () => {
      el.button.addEventListener('click', handler.click);
    };

    const unbind = () => {
      el.button.removeEventListener('click', handler.click);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
     * @function reInit
     * @memberof BtnPwdView
     * @description BtnPwdView 인스턴스 재생성
     */
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    init();

    this.reInit = reInit;
  }
}

export const passwordInputController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new PasswordInput(el));
      }
    });
  }
};

/**
 * @namespace passwordInput
 * @alias mvJS.passwordInput
 * @memberof mvJs
 * @description passwordInput 활성화
 */
mvJs.passwordInput = {};
/**
 * @param {String} selector - element selector
 * @memberof passwordInput
 * @function init
 * @description passwordInput 인스턴스 생성
 **/
mvJs.passwordInput.init = passwordInputController.init;
