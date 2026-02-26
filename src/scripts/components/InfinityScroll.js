import { mvJs, root } from '@config';

class InfinityScroll {
  /**
   * Create a InfinityScroll
   * @class InfinityScroll
   * @param {Element} target - 생성 타겟
   * @description 무한 스크롤 기능을 제공하는 컴포넌트
   */
  constructor(target) {
    const devMode = false;
    let total = 0; // 총 데이터 개수
    let loading = false; // 로딩 상태

    const el = {
      target: target,
      mutationObserver: null
    };

    const selector = {
      loading: '.loading'
    };

    const handler = {
      scroll() {
        method.checkScroll();
      }
    };

    const method = {
      /**
       * @function isMore
       * @memberof InfinityScroll
       * @description 데이터 추가 여부 체크
       */
      isMore() {
        total = el.target.dataset.total
          ? parseInt(el.target.dataset.total || 0)
          : 0;

        return total > 0 && el.target.children.length < total;
      },

      /**
       * @function isHidden
       * @memberof InfinityScroll
       * @description 타겟 숨김 여부 체크
       */
      isHidden() {
        return el.target.offsetParent === null;
      },

      /**
       * @function checkScroll
       * @memberof InfinityScroll
       * @description 스크롤 체크
       */
      checkScroll() {
        if (loading || method.isHidden() || !method.isMore()) {
          return;
        }

        const rect = el.target.getBoundingClientRect();
        const targetHeight = el.target.offsetHeight;
        const threshold = targetHeight * 0.7; // 타겟 높이의 70% 지점
        const intersection = rect.top + threshold <= window.innerHeight;

        if (intersection) {
          method.more();
        }
      },

      /**
       * @function initMutationObserver
       * @memberof InfinityScroll
       * @description MutationObserver 초기화
       */
      initMutationObserver() {
        el.mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              /* console.log(
                '자식 요소가 변경되었습니다:',
                mutation.addedNodes.length,
                '개 추가'
              ); */

              if (loading) {
                method.complete();
              }
            }
          });
        });

        el.mutationObserver.observe(el.target, {
          childList: true, // 자식 요소 추가/제거 감지
          subtree: false // 하위 요소는 감지하지 않음
        });
      },

      /**
       * @function destroyMutationObserver
       * @memberof InfinityScroll
       * @description MutationObserver 제거
       */
      destroyMutationObserver() {
        if (el.mutationObserver) {
          el.mutationObserver.disconnect();
          el.mutationObserver = null;
        }
      },

      /**
       * @function more
       * @memberof InfinityScroll
       * @description 데이터 추가 시 호출
       */
      more() {
        // console.log('more()');
        method.showLoading();

        if (devMode) {
          method.fetchData().then(() => {
            method.appendData();
          });
        } else {
          if (typeof window.movePage === 'function') {
            window.movePage();
          }
        }
      },

      /**
       * @function complete
       * @memberof InfinityScroll
       * @description 데이터 추가 완료 시 호출
       */
      complete() {
        //console.log('complete()');
        method.hideLoading();
      },

      // 테스트 함수
      fetchData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      },

      // 테스트 함수
      appendData() {
        // append data
        for (let i = 0; i < 10; i++) {
          const item = document.createElement('div');
          const dumyColor = Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0');
          item.classList.add('item');
          item.innerHTML = `
            <a href="#" style="background-color: #${dumyColor};">
                <div class="img">
                 item-${i}   
                </div>
                <div class="text-wrap">
                    <strong class="title">title</strong>
                    <div class="desc">desc</div>
                </div>
            </a>
          `;

          el.target.appendChild(item.cloneNode(true));
        }
      },

      showLoading() {
        loading = true;
        el.loading?.classList.add('active');
      },

      hideLoading() {
        loading = false;
        el.loading?.classList.remove('active');
      }
    };

    const setProperty = () => {
      el.loading = document.querySelector(selector.loading);
    };

    const bind = () => {
      window.addEventListener('scroll', handler.scroll);
      window.addEventListener('resize', handler.scroll);
      method.initMutationObserver();
    };

    const unbind = () => {
      window.removeEventListener('scroll', handler.scroll);
      window.removeEventListener('resize', handler.scroll);
      method.destroyMutationObserver();
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
     * @function reInit
     * @memberof InfinityScroll
     * @description InfinityScroll 인스턴스 재생성
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

export const infinityScrollController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new InfinityScroll(el));
      }
    });
  }
};

/**
 * @namespace infinityScroll
 * @alias mvJS.infinityScroll
 * @memberof mvJs
 * @description infinityScroll 활성화
 */
mvJs.infinityScroll = {};
/**
 * @param {String} selector - element selector
 * @memberof infinityScroll
 * @function init
 * @description infinityScroll 인스턴스 생성
 **/
mvJs.infinityScroll.init = infinityScrollController.init;
