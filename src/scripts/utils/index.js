const dynamicListenerHandlers = [];
const getConditionalCallback = (selector, callback) => {
  return function (e) {
    if (e.target && e.target.matches(selector)) {
      e.delegatedTarget = e.target;
      callback.apply(this, arguments);
      return;
    }
    // Not clicked directly, check bubble path
    let path = e.path || (e.composedPath && e.composedPath());
    if (!path) {
      return;
    }
    for (let i = 0; i < path.length; ++i) {
      let el = path[i];
      if (el.matches(selector)) {
        // Call callback for all elements on the path that match the selector
        e.delegatedTarget = el;
        callback.apply(this, arguments);
      }
      // We reached parent node, stop
      if (el === e.currentTarget) {
        return;
      }
    }
  };
};

export const utils = {
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
    const evt = otions
      ? new CustomEvent(event, otions)
      : new CustomEvent(event);
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
    RIGHT: 39,
  },

  addDynamicEventListener(
    rootSelector,
    eventType,
    selector,
    callback,
    options,
  ) {
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
    // null, undefined 체크
    if (!target) {
      return null;
    }

    // 이미 Element인 경우
    if (target instanceof Element) {
      return target;
    }

    // 문자열인 경우 (셀렉터)
    if (typeof target === "string") {
      // # 없이 id만 입력된 경우 # 추가
      if (
        target &&
        !target.startsWith("#") &&
        !target.startsWith(".") &&
        !target.includes(" ")
      ) {
        return document.querySelector(`#${target}`);
      }
      return document.querySelector(target);
    }

    // NodeList 경우
    if (target instanceof NodeList) {
      return target.length > 0 ? target.item(0) : null;
    }

    // 배열인 경우
    if (Array.isArray(target)) {
      return target.length > 0 ? target[0] : null;
    }

    // 그 외의 경우 null 반환
    return null;
  },

  /**
   * @description throttle (스크롤 성능 개선)
   * @param {Function} fn
   * @param {Number} wait
   */
  throttle(fn, wait) {
    let time = Date.now();
    return function () {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  },
};
