import { mvJs, root } from '@config';
import { gsap } from 'gsap';

class SlideDown {
  /**
   * Create a SlideDown
   * @class SlideDown
   * @param {Element} target - 생성 타겟
   * @description SlideDown 생성
   */
  constructor(target) {
    const el = {
      target: target,
      slidedownBtn: '',
      content: ''
    };

    const selector = {
      slidedownBtn: '.slideDown-btn',
      content: '.slideDown-cont'
    };

    const options = {
      animation: true,
      animationSpeed: 0.4
    };

    let dataOptions = JSON.parse(el.target.dataset.options);
    dataOptions = Object.assign(options, dataOptions);

    const animation = String(dataOptions.animation) === 'true' ? true : false;
    const animationSpeed = dataOptions.animationSpeed;
    let dataText = null;
    let timer = 0;

    const setProperty = () => {
      el.slidedownBtn = el.target.querySelector(selector.slidedownBtn);
      dataText = root.weakMap.get(el.slidedownBtn.querySelector('[data-text]'));
      el.content = el.target.querySelector(selector.content);

      // handler.button.click();
      if (method.check()) {
        el.content.style.height = 'auto';
      } else {
        el.content.style.height = '0';
      }

      el.list = el.content.querySelectorAll('a');
      el.last = el.list[el.list.length - 1];
    };

    const handler = {
      /**
       * @callback btnClick
       * @memberof SlideDown
       * @description slideDown 오픈 및 닫기
       */
      button: {
        click: () => {
          if (method.check()) {
            method.close();
          } else {
            method.open();
          }
        }
      },

      content: {
        resize: () => {
          // console.log(el.content.offsetHeight);
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (el.content.offsetHeight !== 0) {
              el.content.style.height = 'auto';
            }
            //
          }, 100);
        }
      },

      foucs: {
        out: (e) => {
          if (e.target === el.target || e.target.closest('.slideDown')) {
            return;
          }
          method.close();
        }
      }
    };

    const method = {
      /**
       * @callback open
       * @memberof SlideDown
       * @description slideDown 오픈
       */
      check() {
        return el.slidedownBtn.getAttribute('aria-expanded') === 'true'
          ? true
          : false;
      },

      open() {
        if (animation) {
          el.content.style.display = 'block';

          const theight = el.content.offsetHeight;

          el.content.style.height = 'auto';

          const height = el.content.offsetHeight;

          el.content.style.height = `${theight}px`;

          gsap.killTweensOf(el.content);

          gsap.to(el.content, animationSpeed, {
            height: height,
            ease: 'power1.out'
          });
        } else {
          el.content.style.height = 'auto';
        }

        if (dataText) {
          dataText.show(1);
        }

        el.slidedownBtn.setAttribute('aria-expanded', true);
        el.content.setAttribute('aria-hidden', false);
      },

      close() {
        if (animation) {
          gsap.killTweensOf(el.content);

          gsap.to(el.content, animationSpeed, {
            height: 0,
            ease: 'power1.out',
            onComplete: () => {
              el.content.style.display = 'none';
            }
          });
        } else {
          el.content.style.height = '0';
        }

        if (dataText) {
          dataText.show(2);
        }

        el.slidedownBtn.setAttribute('aria-expanded', false);
        el.content.setAttribute('aria-hidden', true);
      }
    };

    const bind = () => {
      el.slidedownBtn.addEventListener('click', handler.button.click);
      window.addEventListener('resize', handler.content.resize);

      el.last.addEventListener('blur', () => {
        method.close();
      });

      window.addEventListener('keyup', handler.foucs.out);

      window.addEventListener('click', handler.foucs.out);
    };

    const unbind = () => {
      el.slidedownBtn.removeEventListener('click', handler.button.click);
      window.removeEventListener('resize', handler.content.resize);

      el.last.removeEventListener('blur');
      window.addEventListener('keyup', handler.foucs.out);
      window.addEventListener('click', handler.foucs.out);
    };

    const init = () => {
      setProperty();

      bind();
    };

    /**
     * @function reInit
     * @memberof SlideDown
     * @description 재생성
     */
    const reInit = () => {
      unbind();

      setProperty();

      bind();
    };

    init();

    this.reInit = reInit;
    this.open = method.open;
    this.close = method.close;
  }
}

//  SlideDown  생성
export const slideDownController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new SlideDown(el));
      }
    });
  },

  open: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.open();
      }
    });
  },

  close: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.close();
      }
    });
  }
};

/**
 * @namespace slideDown
 * @alias mvJS.slideDown
 * @memberof mvJs
 * @description slideDown method들의 셋
 */
mvJs.slideDown = {};
/**
 * @param {String} selector - element selector
 * @memberof slideDown
 * @function init
 * @description slideDown class init
 **/
mvJs.slideDown.init = (selector) => {
  slideDownController.init(selector);
};

/**
 * @param {String} selector - element selector
 * @memberof slideDown
 * @function open
 * @description slideDown open method
 **/

mvJs.slideDown.open = (selector) => {
  slideDownController.open(selector);
};

/**
 * @param {String} selector - element selector
 * @memberof slideDown
 * @function close
 * @description slideDown close method
 **/

mvJs.slideDown.close = (selector) => {
  slideDownController.close(selector);
};
