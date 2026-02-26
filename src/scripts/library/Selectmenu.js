import { mvJs, root } from '@config';
import { utils } from '@utils';

/**
 * Create a Selectmenu
 * @class Selectmenu
 * @param {Element} target - element selector
 * @description 디자인 셀렉트 메뉴
 * @version 1.1.1
 *
 * @history
 * 1.1.0
 * - portal 기능 추가하여 모달 창 내에서 사용 가능하도록 수정
 * - portal 은 부모가 role="dialog" 이거나 data-options 에 "portal": true 혹은 "portal": { zIndex: 9999 } 지정 시 동작
 * - portal 상태에서 리스트 크기가 브라우저 영역을 넘어서면 left 위치 조정
 * - scroll, resize 에 따라 화면내에 리스트 유지하도록 열리는 상하 방향 조정 기능 추가, 기존 direction 사용
 * - hover() 기능 제거 ( css :hover 로 대체 ), 기존 hover() 걸려있는 selected 는 선택된 상태로 사용
 * - 모바일 디자인 스크롤 대응을 위한 리스트 터치 스크롤 기능 추가
 * 1.1.1
 * - 외부 호출 함수인 update() 에 index 인자 추가 및 select() 함수 추가하여 재생성 없이 선택만 변경 가능하도록 수정
 *
 * @example
 *  e.g. 값 선택되었을 때 select 색상변경 css 선택자
 *    .select-wrap:has(.select-list-item:not(.select-list-item-disabled) .select-selected) { ... }
 *
 */
class Selectmenu {
  constructor(target) {
    const datasetOpt = target.dataset.options
      ? JSON.parse(target.dataset.options)
      : {};

    let index = 0;
    let optionsLength = 0;
    let activeIndex = 0;
    let timer = 0;
    let docBind = false;
    let initialize = false;
    let isOpen = false;
    let firstActive = 0;

    // 터치 스크롤
    let touchStartY = 0;
    let touchStartScrollTop = 0;
    let isTouching = false;
    let touchSensitivity = 0.5; // 터치 감도

    const scrollPos = {
      scroll: 0, // 리스트 컨텐츠 최대 이동가능 거리
      content: 0, // 리스트 컨텐츠 높이
      screen: 0, // 리스트 overflow 높이 ( listWrap padding 제외 )
      barScroll: 0, // 스크롤바 최대 이동가능 거리
      barPos: 0 // 브라우저 doc 기준 스크롤바 위치
    };

    const el = {
      select: target,
      doc: document,
      button: null,
      titleSpan: null,
      container: null,
      options: null,
      listWrap: null,
      lsit: null,
      listItem: null,
      listAnchor: null,
      scrollbarWrap: null,
      scrollbar: null
    };

    const className = {
      open: 'select-open',
      buttonOpen: 'select-button-open',
      button: 'select-button',
      title: 'select-title',
      listWrap: 'select-list-wrap',
      list: 'select-list',
      listItem: 'select-list-item',
      anchor: 'select-list-achor',
      selected: 'select-selected',
      disabled: 'select-disabled',
      listItemDisabled: 'select-list-item-disabled',
      scrollbarWrap: 'scrollbar-wrap',
      scrollbar: 'scrollbar'
    };

    const POS_DOWN = 'down';
    const POS_UP = 'up';

    this.direction = datasetOpt.direction ? datasetOpt.direction : POS_DOWN;

    if (
      datasetOpt.portal !== undefined &&
      typeof datasetOpt.portal === 'object'
    ) {
      this.portal = datasetOpt.portal;
    } else {
      this.portal = utils.parseBoolean(datasetOpt.portal);
    }

    const selector = {
      container: '.select-wrap'
    };

    const setProperty = () => {
      el.select.style.display = 'none';

      method.createOptions(el.options);

      el.options = el.select.options;
      optionsLength = el.select.options.length;

      el.listItem = el.list.querySelectorAll(`.${className.listItem}`);
      el.listAnchor = el.list.querySelectorAll(`.${className.anchor}`);

      if (datasetOpt.msg) {
        el.listItem[0].style.display = 'none';
        el.listItem[0].classList.add(className.listItemDisabled);
      }

      if (el.select.disabled) {
        el.button.classList.add(className.disabled);
        el.button.setAttribute('aria-disabled', true);
      }
    };

    const bind = () => {
      if (el.select.disabled) {
        return;
      }

      el.button.addEventListener('click', handler.click.button);

      [...el.listItem].forEach((element) => {
        if (!element.getAttribute('aria-disabled')) {
          element.addEventListener('click', handler.click.listItem);
          element.addEventListener('mouseover', handler.hover.listItem);
        }
      });

      el.container.addEventListener('keydown', handler.keyDown);
    };

    const unbind = () => {
      el.button.removeEventListener('click', handler.click.button);

      [...el.listItem].forEach((element) => {
        element.removeEventListener('click', handler.click.listItem);
        element.removeEventListener('mouseover', handler.hover.listItem);
      });

      el.container.removeEventListener('keydown', handler.keyDown);

      el.list.removeEventListener('mousewheel', handler.wheel);
      el.list.removeEventListener('DOMMouseScroll', handler.wheel);
      el.list.removeEventListener('scroll', handler.scroll);

      if (el.scrollbar) {
        el.scrollbar.removeEventListener('mousedown', handler.mousedown);
      }

      // 터치 이벤트
      el.list.removeEventListener('touchstart', handler.touchStart);
      el.list.removeEventListener('touchmove', handler.touchMove);
      el.list.removeEventListener('touchend', handler.touchEnd);

      window.removeEventListener('scroll', handler.winScroll);
      window.removeEventListener('resize', handler.winResize);
    };

    const init = () => {
      Selectmenu.index++;

      method.createElement();

      setProperty();

      bind();
    };

    const reInit = (index) => {
      if (index !== undefined) {
        method.listOver(index);
        method.change(index);
        return;
      }

      index = 0;
      activeIndex = 0;
      docBind = false;
      initialize = false;
      firstActive = 0;

      unbind();

      const hidden = el.select.querySelector('[hidden]');
      if (hidden) {
        el.select.removeChild(hidden);
      }

      el.container.removeChild(
        el.container.querySelector(`.${className.button}`)
      );
      el.container.removeChild(
        el.container.querySelector(`.${className.listWrap}`)
      );

      method.createElement();

      setProperty();

      bind();
    };

    // aria-disabled="true" , ui-state-disabled ui-menu-item
    // console.log(elem.options);
    const method = {
      createElement: () => {
        el.container = el.select.closest(selector.container);

        if (el.select.id) {
          el.container.id = `mv_select_${el.select.id}`;
        } else {
          el.container.id = `mv_select_${Selectmenu.index}`;
        }

        el.titleSpan = document.createElement('span');
        el.titleSpan.className = className.title;

        // button
        el.button = document.createElement('button');
        el.button.className = className.button;
        utils.setAttributes(el.button, {
          tabindex: 0,
          role: 'combobox',
          'aria-expanded': false,
          'aria-autocomplete': 'list',
          'aria-owns': el.container.id,
          'aria-haspopup': true,
          type: 'button',
          'aria-disabled': false
        });

        el.button.id = `${el.container.id}_button`;
        el.button.appendChild(el.titleSpan);

        el.list = document.createElement('ul');
        el.list.className = className.list;
        utils.setAttributes(el.list, {
          'aria-hidden': true,
          'aria-labelledby': el.button.id,
          role: 'listbox',
          tabindex: 0
        });
        el.list.id = `${el.container.id}_list`;
        el.list.style.maxHeight = `${datasetOpt.maxHeight}px`;
        el.list.style.overflow = 'hidden';

        el.listWrap = document.createElement('div');
        el.listWrap.className = className.listWrap;
        el.listWrap.appendChild(el.list);

        el.container.appendChild(el.button);
        el.container.appendChild(el.listWrap);

        // method.activeCheck();
      },

      createScroll: () => {
        if (datasetOpt.maxHeight < el.list.scrollHeight) {
          const scrollbarWrap = document.createElement('div');
          scrollbarWrap.className = className.scrollbarWrap;
          el.scrollbarWrap = scrollbarWrap;

          const scrollbar = document.createElement('div');
          scrollbar.className = className.scrollbar;
          scrollbarWrap.appendChild(scrollbar);

          el.scrollbar = scrollbar;
          el.listWrap.appendChild(scrollbarWrap);

          scrollPos.content = el.list.scrollHeight;
          scrollPos.screen =
            el.listWrap.offsetHeight -
            parseInt(
              window
                .getComputedStyle(el.listWrap, null)
                .getPropertyValue('padding-bottom')
            ) -
            parseInt(
              window
                .getComputedStyle(el.listWrap, null)
                .getPropertyValue('padding-top')
            );
          scrollPos.scroll = scrollPos.content - scrollPos.screen;

          el.scrollbarWrap.style.height = `${scrollPos.screen}px`;

          const barH = scrollPos.screen / 3;
          el.scrollbar.style.height = `${barH}px`;
          el.scrollbar.style.top = 0;

          scrollPos.barScroll = scrollPos.screen - el.scrollbar.offsetHeight;

          el.list.addEventListener('mousewheel', handler.wheel, false);
          el.list.addEventListener('DOMMouseScroll', handler.wheel, false);
          el.list.addEventListener('scroll', handler.scroll);
          el.scrollbar.addEventListener('mousedown', handler.mousedown);

          // 터치 이벤트
          el.list.addEventListener('touchstart', handler.touchStart, {
            passive: false
          });
          el.list.addEventListener('touchmove', handler.touchMove, {
            passive: false
          });
          el.list.addEventListener('touchend', handler.touchEnd, {
            passive: false
          });
        }
      },

      /**
       * @function getOptimalDirection
       * @memberof Selectmenu
       * @description 리스트가 화면을 벗어나지않도록 방향 결정
       * @returns {string} 'up' 또는 'down'
       */
      getOptimalDirection: () => {
        const rect = el.button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const listHeight = el.listWrap.offsetHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        // 기본 반환값
        let direction = this.direction;

        if (spaceBelow >= listHeight && spaceAbove >= listHeight) {
          // 위아래 모두 여유롭다면 this.direction 우선
        } else if (spaceBelow < listHeight) {
          // 위 여유로운 공간의 방향으로 설정
          direction = POS_UP;
        } else if (spaceAbove < listHeight) {
          // 아래 여유로운 공간의 방향으로 설정
          direction = POS_DOWN;
        }

        return direction;
      },

      /**
       * @function adjustListXpos
       * @memberof Selectmenu
       * @description 리스트가 화면을 벗어나지않도록 수평 위치 계산
       */
      adjustListXpos: () => {
        let { right, left, width } = el.listWrap.getBoundingClientRect();

        let xpos;
        if (left < 0) {
          // 리스트가 브라우저 왼쪽 끝을 넘어갈 경우
          xpos = 0;
        } else if (right > window.innerWidth) {
          // 리스트가 브라우저 오른쪽 끝을 넘어갈 경우
          xpos = window.innerWidth - width;
        }

        if (!isNaN(xpos)) {
          el.listWrap.style.left = `${xpos}px`;
        }
      },

      /**
       * @function updateListPos
       * @memberof Selectmenu
       * @description 리스트 위치 설정 (상하좌우 방향 고려)
       */
      updateListPos: () => {
        const direction = method.getOptimalDirection();

        if (document.querySelector('.select-portal')) {
          const rect = el.button.getBoundingClientRect();

          if (el.button.offsetWidth > el.listWrap.offsetWidth) {
            el.listWrap.style.width = `${el.button.offsetWidth}px`;
          }
          el.listWrap.style.left = `${rect.left}px`;

          // 리스트 xpos를 수정하는 함수 호출
          method.adjustListXpos();

          // 수직 위치 설정
          if (direction === POS_DOWN) {
            el.listWrap.style.top = `${rect.bottom}px`;
          } else {
            el.listWrap.style.top = `${rect.top - el.listWrap.offsetHeight}px`;
          }
        } else {
          if (direction === POS_DOWN) {
            el.listWrap.style.top = `${el.button.offsetHeight}px`;
          } else {
            el.listWrap.style.top = `${-el.listWrap.offsetHeight}px`;
          }
        }
      },

      createOptions: () => {
        const sel = el.select.querySelector('option[selected]');
        if (sel) {
          el.select.activeIndex = utils.getIndex(sel);
          // console.log(el.select.activeIndex);
        } else {
          el.select.activeIndex = 0;
        }

        if (datasetOpt.msg) {
          const op = document.createElement('option');
          op.textContent = datasetOpt.msg;
          utils.setAttributes(op, {
            hidden: '',
            selected: ''
          });

          el.select.insertAdjacentElement('afterbegin', op);

          if (!sel) {
            el.titleSpan.textContent = datasetOpt.msg;
            activeIndex = 0;
            el.select.activeIndex = 0;
            firstActive = 1;
          } else {
            el.select.activeIndex = el.select.activeIndex + 1;
          }
        }

        const list = el.select.options;
        // console.log(el.select.activeIndex);

        for (let i = 0; i < list.length; i++) {
          const li = document.createElement('li');
          const a = document.createElement('a');

          const option = list[i];
          a.className = className.anchor;

          if (datasetOpt.multiText) {
            method.changeMultiText(option, a);
          } else {
            a.innerText = option.textContent;
          }

          a.setAttribute('role', 'option');
          a.id = `${el.container.id}_anchor_${index++}`;

          li.classList.add(className.listItem);

          // console.log(option, 'selected xxx ', el.select.activeIndex);
          if (el.select.activeIndex === i) {
            if (datasetOpt.multiText) {
              method.changeMultiText(option, el.titleSpan);
            } else {
              el.titleSpan.textContent = option.textContent;
            }
            //
            a.classList.add(className.selected);
            activeIndex = i;
          }

          if (option.disabled) {
            li.setAttribute('aria-disabled', true);
            li.classList.add(className.listItemDisabled);
          }

          li.appendChild(a);

          el.list.appendChild(li);
        }
      },

      changeMultiText: (option, text) => {
        const tArr = option.textContent.split(datasetOpt.multiText);
        // console.log(option.classList);

        if (tArr.length > 1) {
          let str = '';
          tArr.forEach((s, idx) => {
            // console.log(idx);
            str += `<span class=${option.classList[idx]}>${s}</span>`;
          });

          text.innerHTML = str;
        } else {
          text.innerText = option.textContent;
        }
      },

      change: (idx) => {
        const option = el.options[idx];

        if (datasetOpt.multiText) {
          method.changeMultiText(option, el.titleSpan);
        } else {
          el.titleSpan.textContent = option.textContent;
        }

        const oldIndex = el.select.selectedIndex;
        el.select.selectedIndex = idx;

        if (oldIndex !== idx) {
          utils.trigger(el.select, 'change');
        }
      },

      toggle: () => {
        if (el.listWrap.classList.contains(className.open)) {
          method.close();
        } else {
          method.open();
        }
      },

      /**
       * @function createPortal
       * @memberof Selectmenu
       * @description 포탈 생성
       */
      createPortal: () => {
        const dialog = el.button.closest('*[role="dialog"]');

        if (datasetOpt.portal === undefined) {
          this.portal = !!dialog;
        }

        if (!this.portal) {
          return;
        }

        const portal = document.createElement('div');
        portal.className = 'select-portal select-wrap';

        const zIndex = dialog
          ? window.getComputedStyle(dialog).getPropertyValue('z-index')
          : null;

        Object.assign(portal.style, {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (isNaN(parseInt(zIndex)) ? 0 : parseInt(zIndex)) + 1,
          pointerEvents: 'none'
        });

        if (typeof this.portal === 'object') {
          Object.assign(portal.style, this.portal);
        }

        document.body.appendChild(portal);
        portal.appendChild(el.listWrap);
        el.listWrap.style.setProperty('pointer-events', 'auto');
      },

      /**
       * @function removePortal
       * @memberof Selectmenu
       * @description 포탈 제거
       */
      removePortal: () => {
        if (document.querySelector('.select-portal')) {
          const portal = document.querySelector('.select-portal');

          el.container.appendChild(el.listWrap);
          el.listWrap.removeAttribute('style');

          portal.remove();
        }
      },

      open: () => {
        isOpen = true;

        method.docClick();

        el.listWrap.classList.add(className.open);
        el.button.classList.add(className.buttonOpen);
        el.button.setAttribute('aria-expanded', true);
        el.list.setAttribute('aria-hidden', false);

        if (!initialize) {
          initialize = true;
          method.createScroll();

          window.addEventListener('scroll', handler.winScroll);
          window.addEventListener('resize', handler.winResize);
        }
        method.createPortal();
        method.updateListPos();
      },

      close: () => {
        isOpen = false;

        method.docClickClear();
        el.listWrap.classList.remove(className.open);
        el.button.classList.remove(className.buttonOpen);
        el.button.setAttribute('aria-expanded', false);
        el.list.setAttribute('aria-hidden', true);

        method.removePortal();
      },

      docClick: () => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          if (!docBind) {
            docBind = true;
            document.addEventListener('click', handler.click.document);
          }
        }, 100);
      },

      docClickClear: () => {
        clearTimeout(timer);

        document.removeEventListener('click', handler.click.document);
        docBind = false;
      },

      listOver: (idx) => {
        if (el.list.querySelector(`.${className.selected}`)) {
          el.list
            .querySelector(`.${className.selected}`)
            .classList.remove(className.selected);
        }

        activeIndex = idx;
        const newEl = el.listAnchor[activeIndex];
        if (newEl) {
          newEl.classList.add(className.selected);
          el.button.setAttribute('aria-activedescendant', newEl.id);
        }
      },

      prev: () => {
        let i = activeIndex - 1;
        if (activeIndex <= firstActive) {
          i = firstActive;
        }

        if (!isOpen) {
          method.listOver(i);
          method.change(i);
          return;
        }

        const listEl = el.listItem[i];
        if (listEl) {
          el.list.scrollTop = listEl.offsetTop;

          method.listOver(i);
          listEl.querySelector('a').focus();
        }
      },

      next: () => {
        let i = activeIndex + 1;
        if (i > optionsLength - 1) {
          i = optionsLength - 1;
        }

        if (!isOpen) {
          // method.change(i);
          method.listOver(i);
          method.change(i);
          return;
        }

        const listEl = el.listItem[i];
        if (listEl) {
          el.list.scrollTop = listEl.offsetTop;

          method.listOver(i);

          listEl.querySelector('a').focus();
        }
      },

      activeCheck: () => {
        // console.log('activeCheck ', el.list.querySelector('.select-selected'));
      },

      /**
       * @function limitScrollPosition
       * @memberof Selectmenu
       * @description 스크롤 위치를 최소/최대 범위 내로 제한
       * @param {number} scrollTop - 현재 스크롤 위치
       * @returns {number} 제한된 스크롤 위치
       */
      limitScrollPosition: (scrollTop) => {
        if (scrollTop < 0) {
          scrollTop = 0;
        } else if (scrollTop > scrollPos.scroll) {
          scrollTop = scrollPos.scroll;
        }
        return scrollTop;
      }
    };

    const handler = {
      click: {
        document: (event) => {
          const target = event.target.closest(selector.container);
          if (target === el.container) {
            return;
          }

          docBind = false;
          method.close();
        },

        button: () => {
          method.toggle();
        },

        listItem: (event) => {
          const idx = parseInt(utils.getIndex(event.target.closest('li')));
          if (el.select.selectedIndex !== idx) {
            method.listOver(idx);
            method.change(idx);
          }
          method.close();
        }
      },

      hover: {
        listItem: (event) => {
          // eslint-disable-next-line no-unused-vars
          const anchor = event.target;
        }
      },

      wheel: (event) => {
        const e = window.event || event;
        const delta =
          Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)) * 100;
        const targetEl = event.currentTarget;

        let scrollTop = targetEl.scrollTop + Math.round(delta * -1) / 10;

        scrollTop = method.limitScrollPosition(scrollTop);

        // min, max 조정 후 저장
        targetEl.scrollTop = scrollTop;

        event.preventDefault();
      },

      scroll: () => {
        const scrollTop =
          el.list.scrollTop / scrollPos.scroll * scrollPos.barScroll;
        el.scrollbar.style.top = `${scrollTop}px`;
      },

      mousedown: (event) => {
        scrollPos.barPos = event.pageY - parseInt(el.scrollbar.style.top);

        el.doc.addEventListener('mousemove', handler.mousemove);
        el.doc.addEventListener('mouseleave', handler.mouseleave);
        el.doc.addEventListener('mouseup', handler.mouseleave);
        // el.doc.addEventListener('mouseout', handler.mouseleave);
      },

      mousemove: (event) => {
        let posY = event.pageY - scrollPos.barPos;
        if (posY < 0) {
          posY = 0;
        } else if (posY >= scrollPos.barScroll) {
          posY = scrollPos.barScroll;
        }

        el.scrollbar.style.top = `${posY}px`;
        const scroll = posY / scrollPos.barScroll * scrollPos.scroll;

        el.list.scrollTop = scroll;
      },

      mouseleave: () => {
        el.doc.removeEventListener('mousemove', handler.mousemove);
        el.doc.removeEventListener('mouseleave', handler.mouseleave);
        el.doc.removeEventListener('mouseup', handler.mouseleave);
        // el.doc.removeEventListener('mouseout', handler.mouseleave);
      },

      touchStart: (event) => {
        if (event.touches.length === 1) {
          isTouching = true;
          touchStartY = event.touches[0].clientY;
          touchStartScrollTop = el.list.scrollTop;
        }
      },

      touchMove: (event) => {
        if (!isTouching || event.touches.length !== 1) {
          return;
        }

        const touchY = event.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const adjustedDeltaY = deltaY * touchSensitivity;

        let scrollTop = touchStartScrollTop + adjustedDeltaY;

        scrollTop = method.limitScrollPosition(scrollTop);

        el.list.scrollTop = scrollTop;

        event.preventDefault();
      },

      touchEnd: () => {
        isTouching = false;
        touchStartY = 0;
        touchStartScrollTop = 0;
      },

      keyDown: (event) => {
        if (event.keyCode === utils.keyCode.SPACE) {
          //
        }

        if (event.keyCode === utils.keyCode.ENTER) {
          method.listOver(activeIndex);
          method.change(activeIndex);

          method.close();

          event.preventDefault();
        }

        if (event.keyCode === utils.keyCode.UP) {
          event.preventDefault();

          method.prev();
        }

        if (event.keyCode === utils.keyCode.DOWN) {
          event.preventDefault();

          method.next();
        }

        if (event.keyCode === utils.keyCode.LEFT) {
          event.preventDefault();

          method.prev();
        }

        if (event.keyCode === utils.keyCode.RIGHT) {
          event.preventDefault();

          method.next();
        }
      },

      winResize: () => {
        method.updateListPos();
      },

      winScroll: () => {
        method.updateListPos();
      }
    };

    init();

    this.reInit = reInit;
  }
}
Selectmenu.index = 0;

export const selectmenuController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);
      // console.log(el);

      if (obj) {
        obj.reInit();
      } else {
        const select = new Selectmenu(el);
        root.weakMap.set(el, select);
      }
    });
  }
};

/**
 * @namespace selectmenu
 * @alias mvJS.selectmenu
 * @memberof mvJs
 * @description 디자인 셀렉트 메뉴 제어
 */
mvJs.selectmenu = {
  /**
   * @param {String} selector - element selector
   * @param {Number} index - index
   * @memberof selectmenu
   * @function update
   * @description 선택된 디자인 셀렉트 재생성
   **/
  update(selector, index) {
    const el = document.querySelector(selector);
    if (!el) {
      return;
    }

    const obj = root.weakMap.get(el);
    if (obj) {
      obj.reInit(index);
    } else {
      const select = new Selectmenu(el);
      root.weakMap.set(el, select);
    }
  },

  /**
   * @param {String} selector - element selector
   * @param {Number} index - index
   * @memberof selectmenu
   * @function select
   * @description 선택된 디자인 셀렉트 선택 변경
   */
  select(selector, index) {
    const el = document.querySelector(selector);
    if (!el || index === undefined) {
      return;
    }
    const obj = root.weakMap.get(el);

    if (obj) {
      obj.reInit(index);
    }
  }
};
