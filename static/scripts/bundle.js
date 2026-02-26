(() => {
  // src/scripts/layout/Header.js
  var Header = /* @__PURE__ */ (function() {
    let activateIndex = null;
    const el = {
      header: null
    };
    const selectors = {
      header: ".header"
    };
    const setProperty = () => {
      el.header = document.querySelector(selectors.header);
      if (!el.header) return;
      const listWrapper = el.header.querySelector(".header-nav-list");
      if (listWrapper) {
        el.header.setAttribute(
          "style",
          `--header-nav-list-height: ${listWrapper.scrollHeight}px`
        );
      }
    };
    const handler = {
      mouseenter: (e) => {
        const depth1 = e.currentTarget;
        if (activateIndex === null) {
          const activeItem = el.header.querySelector(
            ".header-nav-item.is-active"
          );
          activateIndex = Array.from(
            el.header.querySelectorAll(".header-nav-item")
          ).indexOf(activeItem);
        }
        el.header.querySelectorAll(".header-nav-item").forEach((item, idx) => {
          if (item !== depth1) {
            item.classList.remove("is-active");
          }
        });
      },
      mouseleave: () => {
        const activeItem = el.header.querySelectorAll(".header-nav-item").item(activateIndex);
        if (activeItem) activeItem.classList.add("is-active");
        activateIndex = null;
      }
    };
    const bind = () => {
      el.header.querySelectorAll(".header-nav-item").forEach((item) => {
        item.addEventListener("mouseenter", handler.mouseenter);
      });
      el.header.addEventListener("mouseleave", handler.mouseleave);
    };
    function breakpointChecker(e) {
      if (!e.matches) {
        console.log("breakpoint header mobile !!!");
      } else {
        console.log("breakpoint header pc !!!");
      }
    }
    function init() {
      setProperty();
      bind();
    }
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

  // src/scripts/utils/index.js
  var dynamicListenerHandlers = [];
  var getConditionalCallback = (selector, callback) => {
    return function(e) {
      if (e.target && e.target.matches(selector)) {
        e.delegatedTarget = e.target;
        callback.apply(this, arguments);
        return;
      }
      let path = e.path || e.composedPath && e.composedPath();
      if (!path) {
        return;
      }
      for (let i = 0; i < path.length; ++i) {
        let el = path[i];
        if (el.matches(selector)) {
          e.delegatedTarget = el;
          callback.apply(this, arguments);
        }
        if (el === e.currentTarget) {
          return;
        }
      }
    };
  };
  var utils = {
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
      const evt = otions ? new CustomEvent(event, otions) : new CustomEvent(event);
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
      RIGHT: 39
    },
    addDynamicEventListener(rootSelector, eventType, selector, callback, options) {
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
      if (!target) {
        return null;
      }
      if (target instanceof Element) {
        return target;
      }
      if (typeof target === "string") {
        if (target && !target.startsWith("#") && !target.startsWith(".") && !target.includes(" ")) {
          return document.querySelector(`#${target}`);
        }
        return document.querySelector(target);
      }
      if (target instanceof NodeList) {
        return target.length > 0 ? target.item(0) : null;
      }
      if (Array.isArray(target)) {
        return target.length > 0 ? target[0] : null;
      }
      return null;
    }
  };

  // src/scripts/vendors/datepicker/helpers.js
  function $$(selector, ctx) {
    let els = (ctx || document).querySelectorAll(selector);
    return Array.prototype.slice.call(els);
  }
  function matches(el, selector) {
    let matchesSelector = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.msMatchesSelector;
    return matchesSelector && matchesSelector.call(el, selector);
  }
  function closest(el, selector, top) {
    let toofar = top && !top.contains(el);
    while (el && !toofar) {
      if (matches(el, selector)) {
        return el;
      }
      toofar = top && !top.contains(el.parentNode);
      el = el.parentNode;
    }
    return false;
  }
  function addClass(el, c) {
    el.classList.add.apply(el.classList, c.split(" ").filter(Boolean));
  }
  function removeClass(el, c) {
    el.classList.remove.apply(el.classList, c.split(" ").filter(Boolean));
  }
  function hasClass(el, c) {
    return c && el.classList.contains(c);
  }
  function toggleClass(el, c, force) {
    if (typeof force === "undefined") {
      force = !hasClass(el, c);
    }
    c && (force ? addClass(el, c) : removeClass(el, c));
  }
  function getDataAttributes(elem) {
    let trim = function(s) {
      return s.trim();
    };
    let obj = {};
    if (!elem || !elem.dataset) {
      return obj;
    }
    for (let key in elem.dataset) {
      let val = elem.dataset[key];
      if (/true|false/.test(val.toLowerCase())) {
        val = val.toLowerCase() == "true";
      } else if (val[0] == "[" && val.substr(-1) == "]") {
        val = transform(val.substr(1, val.length - 2).split(","), trim);
      } else if (/^\d*$/.test(val)) {
        val = parseInt(val, 10);
      }
      obj[key] = val;
    }
    return obj;
  }
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  function getDaysInMonth(year, month) {
    if (year instanceof Date) {
      month = year.getMonth();
      year = year.getFullYear();
    }
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }
  function dateInArray(date, array, dim) {
    for (let i = 0; i < array.length; i++) {
      let a = date;
      let b = array[i];
      if (dim == "year") {
        a = a.getFullYear();
        b = b.getFullYear();
      } else if (dim == "month") {
        a = a.getMonth();
        b = b.getMonth();
      } else {
        a = a.getTime();
        b = b.getTime();
      }
      if (a == b) {
        return true;
      }
    }
    return false;
  }
  function compareDates(a, b) {
    return a.getTime() - b.getTime();
  }
  function isValidDate(date) {
    return !!date && date instanceof Date && !isNaN(date.getTime());
  }
  function setToStart(date) {
    return transform(date, (d) => {
      if (d) {
        d.setHours(0, 0, 0, 0);
      }
      return d;
    });
  }
  function dateRange(start, end) {
    start = new Date(start);
    end = new Date(end);
    let date = start;
    if (start > end) {
      start = end;
      end = date;
      date = start;
    }
    let dates = [new Date(date)];
    while (date < end) {
      date.setDate(date.getDate() + 1);
      dates.push(new Date(date));
    }
    return dates;
  }
  function isPlainObject(obj) {
    if (typeof obj === "object" && obj !== null) {
      let proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }
    return false;
  }
  function deepExtend(obj) {
    let other = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < other.length; i++) {
      for (let p in other[i]) {
        if (obj[p] !== void 0 && typeof other[i][p] === "object" && other[i][p] !== null && other[i][p].nodeName === void 0) {
          if (other[i][p] instanceof Date) {
            obj[p] = new Date(other[i][p].getTime());
          }
          if (Array.isArray(other[i][p])) {
            obj[p] = other[i][p].slice(0);
          } else {
            obj[p] = deepExtend(obj[p], other[i][p]);
          }
        } else {
          obj[p] = other[i][p];
        }
      }
    }
    return obj;
  }
  function transform(obj, fn, ctx) {
    let ret = [].concat(obj).map(fn, ctx);
    return ret.length === 1 ? ret[0] : ret;
  }
  function tmpl(str, data) {
    let fn = new Function(
      "obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');"
    );
    return data ? fn(data) : fn;
  }

  // src/scripts/vendors/datepicker/defaults.js
  var defaults_default = {
    /**
     * Basic options
     */
    inline: false,
    multiple: false,
    ranged: false,
    time: false,
    /**
     * Additional options
     */
    openOn: "first",
    min: false,
    max: false,
    within: false,
    without: false,
    yearRange: 5,
    weekStart: 0,
    defaultTime: {
      start: [0, 0],
      end: [12, 0]
    },
    separator: ",",
    serialize(date) {
      let dateStr = date.toLocaleDateString();
      if (this.get("time")) {
        let timeStr = date.toLocaleTimeString();
        timeStr = timeStr.replace(/(\d{1,2}:\d{2}):00/, "$1");
        return `${dateStr}@${timeStr}`;
      }
      return dateStr;
    },
    deserialize(str) {
      return new Date(str);
    },
    /**
     * Callbacks
     */
    toValue: false,
    fromValue: false,
    onInit: false,
    onChange: false,
    onRender: false,
    /**
     * Localizations
     */
    i18n: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      time: ["Time", "Start", "End"]
    },
    /**
     * ClassNames to be used by the Datepicker
     */
    classNames: {
      node: "datepicker",
      wrapper: "datepicker__wrapper",
      inline: "is-inline",
      selected: "is-selected",
      disabled: "is-disabled",
      highlighted: "is-highlighted",
      otherMonth: "is-otherMonth",
      weekend: "is-weekend",
      today: "is-today"
    },
    /**
     * See below for available properties within each context
     */
    templates: {
      /**
       * renderHeader([index])
       * renderTimepicker()
       * renderCalendar([index])
       */
      container: [
        '<div class="datepicker__container">',
        "<%= renderHeader() %>",
        "<%= renderTimepicker() %>",
        "<%= renderCalendar() %>",
        "</div>"
      ].join(""),
      /**
       * @see `calendar`
       */
      header: [
        '<header class="datepicker__header">',
        '<a class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>&lsaquo;</a>',
        '<span class="datepicker__title"><%= renderMonthSelect() %></span>',
        '<span class="datepicker__title"><%= renderYearSelect() %></span>',
        '<a class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>&rsaquo;</a>',
        "</header>"
      ].join(""),
      /**
       * label - i18n option for `time`
       * renderHourSelect([24hour])
       * renderMinuteSelect()
       * renderPeriodSelect()
       */
      timepicker: [
        '<div class="datepicker__time">',
        '<span class="datepicker__label"><%= label %></span>',
        '<span class="datepicker__field"><%= renderHourSelect() %></span>:',
        '<span class="datepicker__field"><%= renderMinuteSelect() %></span>',
        '<span class="datepicker__field"><%= renderPeriodSelect() %></span>',
        "</div>"
      ].join(""),
      /**
        * index - calendar index
        * year - current year
        * month - current month
        * days - @see `day`
        * weekdays - i18n weekdays
        * hasNext - next month is available
        * hasPrev: prev month is available
       */
      calendar: [
        '<table class="datepicker__cal">',
        "<thead>",
        "<tr>",
        "<% weekdays.forEach(function(name) { %>",
        "<th><%= name %></th>",
        "<% }); %>",
        "</tr>",
        "</thead>",
        "<tbody>",
        "<% days.forEach(function(day, i) { %>",
        '<%= (i % 7 == 0) ? "<tr>" : "" %>',
        "<%= renderDay(day) %>",
        '<%= (i % 7 == 6) ? "</tr>" : "" %>',
        "<% }); %>",
        "</tbody>",
        "</table>"
      ].join(""),
      /**
        * date - the serialized date
        * daynum - the day of the month
        * timestamp - date timestamp
        * weekday - i18n weekday
        * isSelected - day is selected
        * isDisabled - day is unavailable
        * isPrevMonth - day is at the end of the previous month
        * isNextMonth - day is at the begining of the next month
        * isThisMonth - day is neither of the above
        * isWeekend - day is a weekend
        * isToday - day is today
        * classNames - relevant `classNames`
       */
      day: [
        '<% classNames.push("datepicker__day"); %>',
        '<td class="<%= classNames.join(" ") %>" data-day="<%= timestamp %>"><div>',
        '<span class="datepicker__daynum"><%= daynum %></span>',
        "</div></td>"
      ].join("")
    }
  };

  // src/scripts/vendors/datepicker/options.js
  function updateInline(isInline, opts) {
    let { classNames: { inline: inlineClass } } = opts;
    if (this.node) {
      toggleClass(this.node, inlineClass, isInline);
      this.wrapper.style.position = isInline ? "" : "absolute";
      this.wrapper.style.display = isInline ? "" : "none";
    }
    this._isOpen = isInline;
    return isInline;
  }
  function updateClassNames(classNames, opts) {
    let {
      node: nodeClass,
      inline: inlineClass,
      wrapper: wrapperClass
    } = classNames;
    let { inline: isInline } = opts;
    if (this.node) {
      for (let key in classNames) {
        switch (key) {
          case "node":
          case "inline":
            this.node.className = nodeClass + (isInline ? ` ${inlineClass}` : "");
            break;
          case "wrapper":
            this.wrapper.className = wrapperClass;
            break;
        }
      }
    }
    return classNames;
  }
  function deserializeMinMax(value, opts) {
    let { deserialize } = opts;
    value = !value ? false : transform(value, deserialize, this);
    return isValidDate(value) ? value : false;
  }
  function deserializeWithinWithout(arr, opts) {
    let { deserialize } = opts;
    if (arr.length) {
      arr = setToStart(transform(arr, deserialize, this));
      arr = [].concat(arr).filter(isValidDate);
    }
    return arr.length ? arr : false;
  }
  function deserializeOpenOn(openOn, opts) {
    let { deserialize } = opts;
    if (typeof openOn === "string" && !/^(first|last|today)$/.test(openOn)) {
      openOn = deserialize.call(this, openOn);
      if (!isValidDate(openOn)) {
        openOn = /* @__PURE__ */ new Date();
      }
    }
    if (!this._month) {
      let date = openOn;
      if (typeof date === "string" || !isValidDate(date)) {
        date = /* @__PURE__ */ new Date();
      }
      date = setToStart(new Date(date.getTime()));
      date.setDate(1);
      this._month = date;
    }
    return openOn;
  }
  function constrainWeekstart(weekstart) {
    return Math.min(Math.max(weekstart, 0), 6);
  }
  function defaultTimeObject(time, opts) {
    if (isPlainObject(time)) {
      return deepExtend({}, time, opts.defaultTime);
    }
    return {
      start: time.slice(0),
      end: time.slice(0)
    };
  }
  function bindOptionFunctions(fn) {
    return typeof fn === "function" ? fn.bind(this) : false;
  }
  function createTemplateRenderers(templates) {
    for (let name in templates) {
      if (name === "select") {
        continue;
      }
      this._renderers[name] = tmpl(templates[name]);
    }
    return templates;
  }

  // src/scripts/vendors/datepicker/index.js
  var Datepicker = class {
    /**
     * Default options
     */
    static defaults = defaults_default;
    /**
     * @constructor
     *
     * @param {(string|HTMLElement)} elem - DOM element to attach to
     * @param {Object} [opts] - Instance configuration
     */
    constructor(elem, opts) {
      if (typeof elem === "string") {
        if ("#" == elem.substr(0, 1)) {
          elem = document.getElementById(elem.substr(1));
        } else {
          return $$(elem).map((el) => new this.constructor(el, opts));
        }
      }
      if (!elem) {
        elem = document.createElement("input");
      }
      if ("input" === elem.tagName.toLowerCase() && !/input|hidden/i.test(elem.type)) {
        elem.type = "text";
      }
      this._initDOM(elem);
      this._initOptions(opts);
      this._initEvents();
      this.setValue(elem.value || elem.dataset.value || "");
      if (this._opts.onInit) {
        this._opts.onInit(elem);
      }
    }
    /**
     * Initialize options
     *
     * @param  {Object} opts Options to initialize this instance with
     */
    _initOptions(opts = {}) {
      this._opts = {};
      let inline = updateInline.bind(this);
      let minMax = deserializeMinMax.bind(this);
      let withInOut = deserializeWithinWithout.bind(this);
      let openOn = deserializeOpenOn.bind(this);
      let weekstart = constrainWeekstart.bind(this);
      let defTime = defaultTimeObject.bind(this);
      let classNames = updateClassNames.bind(this);
      let bindFunc = bindOptionFunctions.bind(this);
      let templates = createTemplateRenderers.bind(this);
      this._set = {
        openOn,
        inline,
        weekstart,
        min: minMax,
        max: minMax,
        within: withInOut,
        without: withInOut,
        defaultTime: defTime,
        classNames,
        templates
      };
      let fns = [
        "serialize",
        "deserialize",
        "onInit",
        "onChange",
        "onRender",
        "setValue",
        "getValue"
      ];
      fns.forEach((name) => this._set[name] = bindFunc);
      this._renderers = {
        select: tmpl(
          [
            '<span style="position:relative"><%= text %>',
            '<select data-<%= type %>="<%= value %>" data-index="<%= index %>"',
            'style="position:absolute;top:0;left:0;width:100%;height:100%;margin:0;opacity:0.005;cursor:pointer;">',
            "<% options.forEach(function(o) { %>",
            '<option value="<%= o.value %>"',
            '<%= o.selected ? " selected" : "" %>',
            '<%= o.disabled ? " disabled" : "" %>',
            "><%= o.text %></option>",
            "<% }); %>",
            "</select>",
            "</span>"
          ].join("")
        )
      };
      this.set(
        deepExtend(
          {},
          this.constructor.defaults,
          getDataAttributes(this._el),
          opts
        )
      );
    }
    /**
     * Initialize DOM
     *
     * @param {Element} elem The element to wrap
     */
    _initDOM(elem) {
      if (this.node) return;
      this._el = elem;
      this.node = document.createElement("div");
      this.node.style.position = "relative";
      this.wrapper = document.createElement("div");
      this.wrapper.style.zIndex = 9999;
      if (elem.parentNode) {
        elem.parentNode.insertBefore(this.node, elem);
      }
      this.node.appendChild(elem);
      this.node.appendChild(this.wrapper);
    }
    /**
     * Initialize event listeners
     */
    _initEvents() {
      if (this._isInitialized) return;
      this._highlighted = [];
      this._onmousedown = this._onmousedown.bind(this);
      this._onmousemove = this._onmousemove.bind(this);
      this._onmouseup = this._onmouseup.bind(this);
      this._onclick = this._onclick.bind(this);
      this._el.addEventListener("click", () => this.toggle());
      this._el.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          return false;
        }
        this.open();
      });
      document.addEventListener("mousedown", (e) => {
        if (!this.node.contains(e.target)) this.hide();
      });
      document.addEventListener("keydown", () => {
        setTimeout(() => {
          if (!this.node.contains(document.activeElement)) this.hide();
        }, 10);
      });
      this.node.onselectstart = () => false;
      this.node.addEventListener("mousedown", this._onmousedown);
      this.node.addEventListener("mousemove", this._onmousemove);
      this.node.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this._onmousedown(e);
          this._onmouseup(e);
        }
      });
      this.node.addEventListener("mouseup", this._onmouseup);
      this.node.addEventListener("click", this._onclick);
      this._isInitialized = true;
    }
    /**
     * When we mousedown on a "date node," highlight it and start the selection
     */
    _onmousedown(e) {
      let {
        ranged,
        multiple,
        classNames: { selected: selectedClass, highlighted: highlightedClass }
      } = this._opts;
      let dateNode = closest(e.target, "[data-day]", this.wrapper);
      let date = dateNode ? parseInt(dateNode.dataset.day, 10) : null;
      if (date) {
        if (!ranged || !this._dragStart) {
          this._deselect = !ranged && this.hasDate(new Date(date));
          this._highlighted = [date];
          this._dragStart = date;
          if (!multiple) {
            $$(`[data-day].${selectedClass}`, this.wrapper).forEach((el) => {
              removeClass(el, selectedClass);
            });
          }
          $$(`[data-day="${date}"]`, this.wrapper).forEach((el) => {
            toggleClass(el, selectedClass, !this._deselect);
            addClass(el, highlightedClass);
          });
        } else {
          this._onmousemove(e);
        }
      }
    }
    /**
     * We're making a selection, and we're allowed to highlight them
     */
    _onmousemove(e) {
      let {
        ranged,
        multiple,
        classNames: { selected: selectedClass, highlighted: highlightedClass }
      } = this._opts;
      if (!(ranged || multiple) || e.buttons !== 1) return;
      let dateNode = closest(e.target, "[data-day]", this.wrapper);
      let date = dateNode ? parseInt(dateNode.dataset.day, 10) : null;
      if (date && this._dragStart) {
        this._highlighted = dateRange(this._dragStart, date).map(
          (d) => d.getTime()
        );
        this._isDragging = date !== this._dragStart;
        $$(`[data-day].${highlightedClass}`, this.wrapper).forEach((el) => {
          let d = new Date(parseInt(el.dataset.day, 10));
          toggleClass(el, selectedClass, !ranged && this.hasDate(d));
          removeClass(el, highlightedClass);
        });
        this._highlighted.forEach((t) => {
          $$(`[data-day="${t}"]`, this.wrapper).forEach((el) => {
            toggleClass(el, selectedClass, !this._deselect);
            addClass(el, highlightedClass);
          });
        });
      }
    }
    /**
     * We've finished the potential selection
     */
    _onmouseup(e) {
      let {
        ranged,
        multiple,
        classNames: { highlighted: highlightedClass }
      } = this._opts;
      $$(`[data-day].${highlightedClass}`, this.wrapper).forEach((el) => {
        removeClass(el, highlightedClass);
      });
      if (this._dragStart && closest(e.target, "[data-day]", this.node)) {
        let dates = this._highlighted.map((t) => new Date(t));
        if (ranged || !multiple) {
          this.setDate(dates);
        } else {
          this.toggleDate(dates, !this._deselect);
        }
        this.render();
        if (!multiple && (!ranged || this._isDragging)) {
          this.hide();
        }
      }
      if (!ranged || this._isDragging) {
        this._highlighted = [];
        this._dragStart = null;
      }
      this._isDragging = false;
    }
    /**
     * What did you click?
     */
    _onclick(e) {
      let el = e.target;
      if (el.hasAttribute("data-prev")) {
        this.prev(el.dataset.prev);
      } else if (el.hasAttribute("data-next")) {
        this.next(el.dataset.next);
      } else if (el.hasAttribute("data-year") && !el.onchange) {
        el.onchange = () => {
          let c = el.dataset.year;
          let y = this._month.getFullYear();
          this._month.setFullYear(parseInt(el.value) - (c - y));
          this.render();
        };
      } else if (el.hasAttribute("data-month") && !el.onchange) {
        el.onchange = () => {
          this._month.setMonth(el.value - el.dataset.index);
          this.render();
        };
      } else if (el.hasAttribute("data-hour") && !el.onchange) {
        el.onchange = () => {
          this.setTime(el.dataset.hour, el.value);
          el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent;
        };
      } else if (el.hasAttribute("data-minute") && !el.onchange) {
        el.onchange = () => {
          this.setTime(el.dataset.minute, null, el.value);
          el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent;
        };
      } else if (el.hasAttribute("data-period") && !el.onchange) {
        el.onchange = () => {
          let part = el.dataset.period;
          let diff = el.value === "am" ? -12 : 12;
          $$(`[data-hour="${part}"] option`, this.wrapper).forEach((el2) => {
            el2.value = parseInt(el2.value) + diff;
          });
          this.setTime(part, (this._time ? this._time[part][0] : 0) + diff);
          el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent;
        };
      }
    }
    /**
     * Set options
     *
     * @param {String|Object} key Option key, or object of properties
     * @param {Mixed} [val] Value of option (not used if object present)
     */
    set(key, val) {
      if (!key) return;
      if (isPlainObject(key)) {
        this._noRender = true;
        if (key.serialize) {
          this.set("serialize", key.serialize);
          delete key.serialize;
        }
        if (key.deserialize) {
          this.set("deserialize", key.deserialize);
          delete key.deserialize;
        }
        for (let k in key) {
          this.set(k, key[k]);
        }
        this._noRender = false;
        val = this._opts;
      } else {
        let opts = deepExtend({}, this.constructor.defaults, this._opts);
        if (key in this._set) {
          val = this._set[key](val, opts);
        }
        if (isPlainObject(val)) {
          val = deepExtend({}, opts[key], val);
        }
        this._opts[key] = val;
      }
      if (this._isOpen && this.wrapper) {
        this.render();
      }
      return val;
    }
    /**
     * Get an option
     *
     * @param {String} key Option key
     * @return {Mixed} Option value
     */
    get(key) {
      if (arguments.length > 1) {
        return [...arguments].reduce((o, a) => {
          o[a] = this.get(a);
          return o;
        }, {});
      }
      let val = this._opts[key];
      if (isPlainObject(val)) {
        val = deepExtend({}, val);
      }
      return val;
    }
    /**
     * Open the calendar to a specific date (or `openOn` date);
     *
     * @param {String|Date} [date=openOn] The date to open to
     */
    open(date) {
      let selected = [].concat(this.getDate());
      date = date || this._opts.openOn || this._month;
      if (typeof date === "string") {
        date = date.toLowerCase();
        if (date === "first" && selected.length) {
          date = selected[0];
        } else if (date === "last" && selected.length) {
          date = selected[selected.length - 1];
        } else if (date !== "today") {
          date = this._opts.deserialize(date);
        }
      }
      if (!isValidDate(date)) {
        date = /* @__PURE__ */ new Date();
      }
      this.setTime(!!this._selected.length);
      this.goToDate(date);
      this.render();
      this.show();
    }
    /**
     * Show the datepicker and position it
     */
    show() {
      if (!this._opts.inline) {
        this.wrapper.style.display = "block";
        let nRect = this.node.getBoundingClientRect();
        let elRect = this._el.getBoundingClientRect();
        let elBottom = elRect.bottom - nRect.top + "px";
        let elTop = nRect.bottom - elRect.top + "px";
        this.wrapper.style.top = elBottom;
        this.wrapper.style.right = "";
        this.wrapper.style.bottom = "";
        this.wrapper.style.left = 0;
        let rect = this.wrapper.getBoundingClientRect();
        let posRight = rect.right > window.innerWidth;
        let posTop = rect.bottom > window.innerHeight;
        this.wrapper.style.top = posTop ? "" : elBottom;
        this.wrapper.style.right = posRight ? 0 : "";
        this.wrapper.style.bottom = posTop ? elTop : "";
        this.wrapper.style.left = posRight ? "" : 0;
        rect = this.wrapper.getBoundingClientRect();
        let fitLeft = rect.right >= rect.width;
        let fitTop = rect.bottom > rect.height;
        this.wrapper.style.top = posTop && fitTop ? "" : elBottom;
        this.wrapper.style.right = posRight && fitLeft ? 0 : "";
        this.wrapper.style.bottom = posTop && fitTop ? elTop : "";
        this.wrapper.style.left = posRight && fitLeft ? "" : 0;
        this._isOpen = true;
      }
    }
    /**
     * Hide the datepicker
     */
    hide() {
      if (!this._opts.inline) {
        this.wrapper.style.display = "none";
        this._isOpen = false;
      }
    }
    /**
     * Toggle the datepicker
     */
    toggle() {
      if (this._isOpen) {
        this.hide();
      } else {
        this.open();
      }
    }
    /**
     * Go to the next month
     *
     * @param {Integer} [skip] How many months to skip
     */
    next(skip) {
      let date = new Date(this._month.getTime());
      skip = Math.max(skip || 1, 1);
      date.setMonth(date.getMonth() + skip);
      this.goToDate(date);
    }
    /**
     * Go to the previous month
     *
     * @param {Integer} [skip] How many months to skip
     */
    prev(skip) {
      let date = new Date(this._month.getTime());
      skip = Math.max(skip || 1, 1);
      date.setMonth(date.getMonth() - skip);
      this.goToDate(date);
    }
    /**
     * Go to a specific date
     *
     * @param {Date} date Date to set the calendar to
     */
    goToDate(date) {
      date = setToStart(this._opts.deserialize(date));
      date.setDate(1);
      this._month = date;
      if (this._isOpen) {
        this.render();
      }
      if (this._opts.onNavigate) {
        this._opts.onNavigate(date);
      }
    }
    /**
     * Check the value for a specific date
     *
     * @param {Date} date The date to check for
     * @return {Boolean} Whether the date is selected
     */
    hasDate(date) {
      date = setToStart(isValidDate(date) ? date : this._opts.deserialize(date));
      return !!this._selected && this._selected.indexOf(date.getTime()) > -1;
    }
    /**
     * Add a date to the value
     *
     * @param {Date|Array} date The date(s) to add
     */
    addDate(date) {
      this.toggleDate(date, true);
    }
    /**
     * Remove a date from the value
     *
     * @param {Date|Array} date The date(s) to remove
     */
    removeDate(date) {
      this.toggleDate(date, false);
    }
    /**
     * Toggle a date selection
     *
     * @param {Date|Array} date Date(s) to toggle
     * @param {Boolean} [force] Force to selected/deselected
     */
    toggleDate(date, force) {
      let { ranged, multiple, deserialize } = this._opts;
      let dates = [].concat(date);
      dates = dates.map((d) => isValidDate(d) ? d : deserialize(d));
      dates = dates.filter((d) => isValidDate(d) && this.dateAllowed(d));
      if (ranged) {
        dates = dates.concat(this.getDate()).sort(compareDates);
        dates = dates.length ? dateRange(dates[0], dates.pop()) : [];
      } else if (!multiple) {
        dates = dates.slice(0, 1);
      }
      dates.map((d) => setToStart(d).getTime()).forEach((t) => {
        let index = this._selected.indexOf(t);
        let hasDate = index > -1;
        if (!hasDate && force !== false) {
          if (ranged || multiple) {
            this._selected.push(t);
          } else {
            this._selected = [t];
          }
        } else if (hasDate && force !== true) {
          this._selected.splice(index, 1);
        }
      });
      this._update();
    }
    /**
     * Update the attached element and call onChange
     */
    _update() {
      let { onChange } = this._opts;
      if (this._el.nodeName.toLowerCase() === "input") {
        this._el.value = this.getValue();
      } else {
        this._el.dataset.value = this.getValue();
      }
      if (onChange) {
        onChange(this.getDate());
      }
    }
    /**
     * Get the selected date(s)
     *
     * @return {Date|Array}
     */
    getDate() {
      let { ranged, multiple, time } = this._opts;
      let start = this._time ? this._time.start : [0, 0];
      this._selected = (this._selected || []).sort();
      if (multiple || ranged) {
        let sel = this._selected.map((t) => new Date(t));
        if (time && sel.length) {
          sel[0].setHours(start[0], start[1]);
          if (sel.length > 1) {
            let end = this._time ? this._time.end : [0, 0];
            sel[sel.length - 1].setHours(end[0], end[1]);
          }
        }
        return sel;
      }
      if (this._selected.length) {
        let d = new Date(this._selected[0]);
        d.setHours(start[0], start[1]);
        return d;
      }
    }
    /**
     * Set the date
     *
     * @param {Date|Array} date Date(s) to set the time to
     */
    setDate(date) {
      this._selected = [];
      this.addDate(date);
    }
    /**
     * Set the start/end time or part of it
     *
     * @param {String} [part] "start" or "end"
     * @param {Integer} hour Value between 0 and 23 representing the hour
     * @param {Integer} minute Value between 0 and 59 representing the minute
     */
    setTime(part, hour, minute) {
      let { time, defaultTime } = this._opts;
      if (!time) return;
      if (part === true || !this._time) {
        this._time = deepExtend({}, defaultTime);
      }
      if (part && part !== true) {
        if (typeof part === "number") {
          minute = hour;
          hour = part;
          part = "start";
        }
        part = part === "end" ? part : "start";
        hour = hour ? parseInt(hour, 10) : false;
        minute = minute ? parseInt(minute, 10) : false;
        if (hour && !isNaN(hour)) {
          this._time[part][0] = hour;
        }
        if (minute && !isNaN(minute)) {
          this._time[part][1] = minute;
        }
      }
      this._update();
    }
    /**
     * Get the value
     *
     * @return {String} The string value
     */
    getValue() {
      let { ranged, separator, serialize, toValue } = this._opts;
      let selected = [].concat(this.getDate() || []);
      if (ranged && selected.length > 1) {
        selected = [selected[0], selected.pop()];
      }
      let value = selected.map(serialize).join(separator);
      if (toValue) {
        value = toValue(value, selected);
      }
      return value;
    }
    /**
     * Set the value to a specific date
     *
     * @param {String} value The string value
     */
    setValue(val) {
      let { ranged, time, separator, serialize, fromValue } = this._opts;
      this._selected = [];
      let dates = fromValue ? fromValue(val) : val.split(separator).filter(Boolean).map(serialize);
      console.log("set value ", val);
      this.addDate(dates);
      if (time && dates.length) {
        let start = dates.sort(compareDates)[0];
        this.setTime("start", start.getHours(), start.getMinutes());
        if (time === "ranged" || ranged) {
          let end = dates[dates.length - 1];
          this.setTime("end", end.getHours(), end.getMinutes());
        }
      }
    }
    /**
     * Check if a date is allowed in the datepicker
     *
     * @param {Date} date The date to check
     * @param {String} [dim] The dimension to check ('year' or 'month')
     * @return {Boolean} Whether the date is allowed or not
     */
    dateAllowed(date, dim) {
      let { min, max, within, without, deserialize } = this._opts;
      let belowMax, aboveMin = belowMax = true;
      date = setToStart(isValidDate(date) ? date : deserialize(date));
      if (dim == "month") {
        aboveMin = !min || date.getMonth() >= min.getMonth();
        belowMax = !max || date.getMonth() <= max.getMonth();
      } else if (dim == "year") {
        aboveMin = !min || date.getFullYear() >= min.getFullYear();
        belowMax = !max || date.getFullYear() <= max.getFullYear();
      } else {
        aboveMin = !min || date >= min;
        belowMax = !max || date <= max;
      }
      return aboveMin && belowMax && (!without || !dateInArray(date, without, dim)) && (!within || dateInArray(date, within, dim));
    }
    /**
     * Render the calendar HTML
     */
    render() {
      let { ranged, time, onRender } = this._opts;
      if (this._noRender || !this._renderers) return;
      let renderCache = {};
      let getData = (i) => renderCache[i] || (renderCache[i] = this.getData(i));
      this.wrapper.innerHTML = this._renderers.container({
        // render header
        renderHeader: (i = 0) => this._renderHeader(getData(i)),
        // render calendar
        renderCalendar: (i = 0) => {
          let data = getData(i);
          return this._renderers.calendar({
            ...data,
            // render header within calendar
            renderHeader: () => this._renderHeader(data),
            // render day
            renderDay: (day) => this._renderers.day(day)
          });
        },
        // render timepicker
        renderTimepicker: () => {
          let html = "";
          if (time) {
            html = this._renderTimepicker("start");
            if (time === "ranged" || ranged) {
              html += this._renderTimepicker("end");
            }
          }
          return html;
        }
      });
      if (onRender) {
        onRender(this.wrapper.firstChild);
      }
    }
    /**
     * Get an object containing data for a calendar month
     *
     * @param {Integer} [index=0] Offset month to render
     * @return {Object} Object containing data for the calendar month
     */
    getData(index = 0) {
      let {
        i18n,
        weekStart,
        serialize,
        min: dateMin,
        max: dateMax,
        classNames: {
          selected: selectedClass,
          disabled: disabledClass,
          otherMonth: otherMonthClass,
          weekend: weekendClass,
          today: todayClass
        }
      } = this._opts;
      let date = new Date(this._month.getTime());
      date.setMonth(date.getMonth() + index);
      let month = date.getMonth();
      let year = date.getFullYear();
      let nextMonth = new Date(date.getTime());
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      let prevMonth = new Date(date.getTime());
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      prevMonth.setDate(getDaysInMonth(prevMonth));
      let days = [];
      let start = date.getDay() - weekStart;
      while (start < 0) start += 7;
      let dayCount = getDaysInMonth(year, month) + start;
      while (dayCount % 7) dayCount += 1;
      let today = setToStart(/* @__PURE__ */ new Date());
      for (let i = 0; i < dayCount; i++) {
        let day = new Date(year, month, 1 + (i - start));
        let dayMonth = day.getMonth();
        let weekday = day.getDay();
        let isSelected = this.hasDate(day);
        let isDisabled = !this.dateAllowed(day);
        let isPrevMonth = dayMonth < month;
        let isNextMonth = dayMonth > month;
        let isThisMonth = !isPrevMonth && !isNextMonth;
        let isWeekend = weekday === 0 || weekday === 6;
        let isToday = day.getTime() === today.getTime();
        let classNames = [];
        if (isSelected) classNames.push(selectedClass);
        if (isDisabled) classNames.push(disabledClass);
        if (!isThisMonth) classNames.push(otherMonthClass);
        if (isWeekend) classNames.push(weekendClass);
        if (isToday) classNames.push(todayClass);
        days.push({
          _date: day,
          date: serialize(day),
          daynum: day.getDate(),
          timestamp: day.getTime(),
          weekday: i18n.weekdays[weekday],
          isSelected,
          isDisabled,
          isPrevMonth,
          isNextMonth,
          isThisMonth,
          isWeekend,
          isToday,
          classNames
        });
      }
      return {
        _date: date,
        index,
        year,
        month: i18n.months[month],
        days,
        weekdays: i18n.weekdays,
        hasNext: !dateMax || nextMonth <= dateMax,
        hasPrev: !dateMin || prevMonth >= dateMin
      };
    }
    /**
     * Generic render header
     *
     * @param {Object} data Data from `this.getData()`
     * @return {String} HTML for the calendar header
     */
    _renderHeader(data) {
      let { yearRange, i18n } = this._opts;
      let { _date, index, year } = data;
      let month = _date.getMonth();
      return this._renderers.header({
        ...data,
        // render month select
        renderMonthSelect: (i = index) => {
          let d = new Date(_date.getTime());
          let options = [];
          for (let m = 0; m < 12; m++) {
            d.setMonth(m);
            options.push({
              text: i18n.months[m],
              disabled: !this.dateAllowed(d, "month"),
              selected: m === month,
              value: m
            });
          }
          return this._renderers.select({
            index: i,
            type: "month",
            text: i18n.months[month],
            value: month,
            options
          });
        },
        // render year select
        renderYearSelect: (i = index) => {
          let d = new Date(_date.getTime());
          let y = year - yearRange;
          let max = year + yearRange;
          let options = [];
          for (; y <= max; y++) {
            d.setFullYear(y);
            options.push({
              disabled: !this.dateAllowed(d, "year"),
              selected: y === year,
              value: y,
              text: y + "\uB144"
            });
          }
          return this._renderers.select({
            index: i,
            type: "year",
            text: year + "\uB144",
            value: year,
            options
          });
        }
      });
    }
    /**
     * Individual timepicker render
     *
     * @param {String} name "start" or "end"
     */
    _renderTimepicker(name) {
      let { ranged, time: timepicker, i18n } = this._opts;
      if (!timepicker) return;
      if (!this._time) {
        this.setTime(true);
      }
      let time = this._time[name];
      let label = i18n.time[0];
      if (timepicker === "ranged" || ranged) {
        label = i18n.time[name === "start" ? 1 : 2];
      }
      return this._renderers.timepicker({
        label,
        renderHourSelect: (long = false) => {
          let options = [];
          let hour = time[0];
          let end = long ? 24 : 12;
          for (let h = 0; h < end; h++) {
            options.push({
              text: long || h ? h : "12",
              selected: hour === h,
              disabled: false,
              value: h
            });
          }
          if (!long && hour >= 12) {
            options.forEach((o) => o.selected = (o.value += 12) === hour);
          } else if (!long) {
            options.push(options.shift());
          }
          let text = options.filter((o) => o.selected)[0].text;
          return this._renderers.select({
            index: 0,
            type: "hour",
            value: name,
            options,
            text
          });
        },
        renderMinuteSelect: (incr = 15) => {
          let options = [];
          for (let i = 0; i < 60; i += incr) {
            options.push({
              text: i < 10 ? "0" + i : i,
              selected: time[1] === i,
              disabled: false,
              value: i
            });
          }
          let text = options.filter((o) => o.selected)[0].text;
          return this._renderers.select({
            index: null,
            type: "minute",
            value: name,
            options,
            text
          });
        },
        renderPeriodSelect: () => {
          return this._renderers.select({
            index: null,
            type: "period",
            text: time[0] >= 12 ? "PM" : "AM",
            value: name,
            options: [
              {
                text: "AM",
                value: "am",
                selected: time[0] < 12
              },
              {
                text: "PM",
                value: "pm",
                selected: time[0] >= 12
              }
            ]
          });
        }
      });
    }
  };

  // src/scripts/library/Datepicker.js
  var CustomDatepicker = class {
    /**
     * Create a CustomDatepicker
     * @class CustomDatepicker
     * @param {Element} target - 생성 타겟
     * @description 외부 라이브러리 사용 및 커스텀  {@link http://wwilsman.github.io/Datepicker.js}
     */
    constructor(target, obj = {}) {
      const el = {
        target
      };
      let picker;
      const selector = {};
      const handler = {
        change: () => {
        }
      };
      const method = {
        setDate(date) {
          picker.setDate(date);
          picker.render();
        },
        getDate() {
          return picker.getValue();
        },
        within(arr) {
          let tarr = [];
          arr.forEach((value) => {
            tarr.push(new Date(value));
          });
          picker._opts.within = tarr;
          picker.render();
        },
        without(arr) {
          let tarr = [];
          arr.forEach((value) => {
            tarr.push(new Date(value));
          });
          picker._opts.without = tarr;
          picker.render();
        },
        onChange(func) {
          if (picker._opts.onChange) {
            const f = picker._opts.onChange;
            picker._opts.onChange = (data) => {
              f.call(null, data);
              func.call(null, data);
            };
          } else {
            picker._opts.onChange = func;
          }
        },
        yearRange(months) {
          picker._set.yearRange(months);
          picker.render();
        }
      };
      const bind = () => {
      };
      const unbind = () => {
      };
      const setProperty = () => {
      };
      const init = () => {
        setProperty();
        picker = new Datepicker(el.target, option);
        bind();
      };
      let option = {
        classNames: {
          node: "datepicker"
        },
        onRender() {
          [
            ...el.target.closest(`.${option.classNames.node}`).querySelectorAll(".is-otherMonth > div > button")
          ].forEach((ele) => {
            ele.disabled = true;
          });
          [
            ...el.target.closest(`.${option.classNames.node}`).querySelectorAll(".datepicker__title")
          ].forEach((ele) => {
            const select = ele.querySelector("select");
            if (select.getAttribute("data-year")) {
              select.setAttribute("title", "\uB144\uB3C4 \uC120\uD0DD");
            } else {
              select.setAttribute("title", "\uC6D4 \uC120\uD0DD");
            }
          });
        },
        onInit() {
        },
        // within: [new Date('2022.05.26'), new Date('2022.05.29')],
        templates: {
          header: [
            `<header class="datepicker__header">
            <button class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>\uC9C0\uB09C \uB2EC</button>
            <span class="datepicker__title"><%= renderYearSelect() %></span>
            <span class="datepicker__title"><%= renderMonthSelect() %></span>
            <button  class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>\uB2E4\uC74C \uB2EC</button>
          </header>`
          ].join(""),
          day: [
            `<% classNames.push("datepicker__day"); %>
           <td class="<%= classNames.join(" ") %>" data-day="<%= timestamp %>"><div>
            <button class="datepicker__daynum"><%= daynum %></button>
           </div></td>`
          ].join("")
          // 샘플 // libs/defaults
          // ,
        },
        i18n: {
          months: [
            "1\uC6D4",
            "2\uC6D4",
            "3\uC6D4",
            "4\uC6D4",
            "5\uC6D4",
            "6\uC6D4",
            "7\uC6D4",
            "8\uC6D4",
            "9\uC6D4",
            "10\uC6D4",
            "11\uC6D4",
            "12\uC6D4"
          ],
          weekdays: ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"]
        },
        serialize: (data) => {
          return utils.toStringByFormatting(data, ".");
        }
      };
      option = Object.assign(option, obj);
      root.weakMap.set(el.target, this);
      const reInit = () => {
        unbind();
        setProperty();
        bind();
      };
      init();
      this.setDate = method.setDate;
      this.getDate = method.getDate;
      this.within = method.within;
      this.without = method.without;
      this.onChange = method.onChange;
      this.reInit = reInit;
    }
  };
  var datepickerController = {
    init: (selector, option) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
        if (obj) {
          obj.reInit();
        } else {
          root.weakMap.set(el, new CustomDatepicker(el, option));
        }
      });
    },
    // setOptions: () => {
    // },
    onChange: (selector, func) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.onChange(func);
      }
    },
    getDate: (selector) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      let date;
      if (obj) {
        date = obj.getDate();
      }
      return date;
    },
    setDate: (selector, date) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.setDate(date);
      }
    },
    within: (selector, arr) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.within(arr);
      }
    },
    without: (selector, arr) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.without(arr);
      }
    },
    yearRange(selector, num) {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.yearRange(num);
      }
    }
  };
  mvJs.datepicker = {};
  mvJs.datepicker.init = datepickerController.init;
  mvJs.datepicker.setDate = datepickerController.setDate;
  mvJs.datepicker.getDate = datepickerController.getDate;
  mvJs.datepicker.within = datepickerController.within;
  mvJs.datepicker.without = datepickerController.without;
  mvJs.datepicker.onChange = datepickerController.onChange;

  // src/scripts/library/Selectmenu.js
  var Selectmenu = class _Selectmenu {
    constructor(target) {
      const datasetOpt = target.dataset.options ? JSON.parse(target.dataset.options) : {};
      let index = 0;
      let optionsLength = 0;
      let activeIndex = 0;
      let timer = 0;
      let docBind = false;
      let initialize = false;
      let isOpen = false;
      let firstActive = 0;
      let touchStartY = 0;
      let touchStartScrollTop = 0;
      let isTouching = false;
      let touchSensitivity = 0.5;
      const scrollPos = {
        scroll: 0,
        // 리스트 컨텐츠 최대 이동가능 거리
        content: 0,
        // 리스트 컨텐츠 높이
        screen: 0,
        // 리스트 overflow 높이 ( listWrap padding 제외 )
        barScroll: 0,
        // 스크롤바 최대 이동가능 거리
        barPos: 0
        // 브라우저 doc 기준 스크롤바 위치
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
        open: "select-open",
        buttonOpen: "select-button-open",
        button: "select-button",
        title: "select-title",
        listWrap: "select-list-wrap",
        list: "select-list",
        listItem: "select-list-item",
        anchor: "select-list-achor",
        selected: "select-selected",
        disabled: "select-disabled",
        listItemDisabled: "select-list-item-disabled",
        scrollbarWrap: "scrollbar-wrap",
        scrollbar: "scrollbar"
      };
      const POS_DOWN = "down";
      const POS_UP = "up";
      this.direction = datasetOpt.direction ? datasetOpt.direction : POS_DOWN;
      if (datasetOpt.portal !== void 0 && typeof datasetOpt.portal === "object") {
        this.portal = datasetOpt.portal;
      } else {
        this.portal = utils.parseBoolean(datasetOpt.portal);
      }
      const selector = {
        container: ".select-wrap"
      };
      const setProperty = () => {
        el.select.style.display = "none";
        method.createOptions(el.options);
        el.options = el.select.options;
        optionsLength = el.select.options.length;
        el.listItem = el.list.querySelectorAll(`.${className.listItem}`);
        el.listAnchor = el.list.querySelectorAll(`.${className.anchor}`);
        if (datasetOpt.msg) {
          el.listItem[0].style.display = "none";
          el.listItem[0].classList.add(className.listItemDisabled);
        }
        if (el.select.disabled) {
          el.button.classList.add(className.disabled);
          el.button.setAttribute("aria-disabled", true);
        }
      };
      const bind = () => {
        if (el.select.disabled) {
          return;
        }
        el.button.addEventListener("click", handler.click.button);
        [...el.listItem].forEach((element) => {
          if (!element.getAttribute("aria-disabled")) {
            element.addEventListener("click", handler.click.listItem);
            element.addEventListener("mouseover", handler.hover.listItem);
          }
        });
        el.container.addEventListener("keydown", handler.keyDown);
      };
      const unbind = () => {
        el.button.removeEventListener("click", handler.click.button);
        [...el.listItem].forEach((element) => {
          element.removeEventListener("click", handler.click.listItem);
          element.removeEventListener("mouseover", handler.hover.listItem);
        });
        el.container.removeEventListener("keydown", handler.keyDown);
        el.list.removeEventListener("mousewheel", handler.wheel);
        el.list.removeEventListener("DOMMouseScroll", handler.wheel);
        el.list.removeEventListener("scroll", handler.scroll);
        if (el.scrollbar) {
          el.scrollbar.removeEventListener("mousedown", handler.mousedown);
        }
        el.list.removeEventListener("touchstart", handler.touchStart);
        el.list.removeEventListener("touchmove", handler.touchMove);
        el.list.removeEventListener("touchend", handler.touchEnd);
        window.removeEventListener("scroll", handler.winScroll);
        window.removeEventListener("resize", handler.winResize);
      };
      const init = () => {
        _Selectmenu.index++;
        method.createElement();
        setProperty();
        bind();
      };
      const reInit = (index2) => {
        if (index2 !== void 0) {
          method.listOver(index2);
          method.change(index2);
          return;
        }
        index2 = 0;
        activeIndex = 0;
        docBind = false;
        initialize = false;
        firstActive = 0;
        unbind();
        const hidden = el.select.querySelector("[hidden]");
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
      const method = {
        createElement: () => {
          el.container = el.select.closest(selector.container);
          if (el.select.id) {
            el.container.id = `mv_select_${el.select.id}`;
          } else {
            el.container.id = `mv_select_${_Selectmenu.index}`;
          }
          el.titleSpan = document.createElement("span");
          el.titleSpan.className = className.title;
          el.button = document.createElement("button");
          el.button.className = className.button;
          utils.setAttributes(el.button, {
            tabindex: 0,
            role: "combobox",
            "aria-expanded": false,
            "aria-autocomplete": "list",
            "aria-owns": el.container.id,
            "aria-haspopup": true,
            type: "button",
            "aria-disabled": false
          });
          el.button.id = `${el.container.id}_button`;
          el.button.appendChild(el.titleSpan);
          el.list = document.createElement("ul");
          el.list.className = className.list;
          utils.setAttributes(el.list, {
            "aria-hidden": true,
            "aria-labelledby": el.button.id,
            role: "listbox",
            tabindex: 0
          });
          el.list.id = `${el.container.id}_list`;
          el.list.style.maxHeight = `${datasetOpt.maxHeight}px`;
          el.list.style.overflow = "hidden";
          el.listWrap = document.createElement("div");
          el.listWrap.className = className.listWrap;
          el.listWrap.appendChild(el.list);
          el.container.appendChild(el.button);
          el.container.appendChild(el.listWrap);
        },
        createScroll: () => {
          if (datasetOpt.maxHeight < el.list.scrollHeight) {
            const scrollbarWrap = document.createElement("div");
            scrollbarWrap.className = className.scrollbarWrap;
            el.scrollbarWrap = scrollbarWrap;
            const scrollbar = document.createElement("div");
            scrollbar.className = className.scrollbar;
            scrollbarWrap.appendChild(scrollbar);
            el.scrollbar = scrollbar;
            el.listWrap.appendChild(scrollbarWrap);
            scrollPos.content = el.list.scrollHeight;
            scrollPos.screen = el.listWrap.offsetHeight - parseInt(
              window.getComputedStyle(el.listWrap, null).getPropertyValue("padding-bottom")
            ) - parseInt(
              window.getComputedStyle(el.listWrap, null).getPropertyValue("padding-top")
            );
            scrollPos.scroll = scrollPos.content - scrollPos.screen;
            el.scrollbarWrap.style.height = `${scrollPos.screen}px`;
            const barH = scrollPos.screen / 3;
            el.scrollbar.style.height = `${barH}px`;
            el.scrollbar.style.top = 0;
            scrollPos.barScroll = scrollPos.screen - el.scrollbar.offsetHeight;
            el.list.addEventListener("mousewheel", handler.wheel, false);
            el.list.addEventListener("DOMMouseScroll", handler.wheel, false);
            el.list.addEventListener("scroll", handler.scroll);
            el.scrollbar.addEventListener("mousedown", handler.mousedown);
            el.list.addEventListener("touchstart", handler.touchStart, {
              passive: false
            });
            el.list.addEventListener("touchmove", handler.touchMove, {
              passive: false
            });
            el.list.addEventListener("touchend", handler.touchEnd, {
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
          let direction = this.direction;
          if (spaceBelow >= listHeight && spaceAbove >= listHeight) {
          } else if (spaceBelow < listHeight) {
            direction = POS_UP;
          } else if (spaceAbove < listHeight) {
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
            xpos = 0;
          } else if (right > window.innerWidth) {
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
          if (document.querySelector(".select-portal")) {
            const rect = el.button.getBoundingClientRect();
            if (el.button.offsetWidth > el.listWrap.offsetWidth) {
              el.listWrap.style.width = `${el.button.offsetWidth}px`;
            }
            el.listWrap.style.left = `${rect.left}px`;
            method.adjustListXpos();
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
          const sel = el.select.querySelector("option[selected]");
          if (sel) {
            el.select.activeIndex = utils.getIndex(sel);
          } else {
            el.select.activeIndex = 0;
          }
          if (datasetOpt.msg) {
            const op = document.createElement("option");
            op.textContent = datasetOpt.msg;
            utils.setAttributes(op, {
              hidden: "",
              selected: ""
            });
            el.select.insertAdjacentElement("afterbegin", op);
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
          for (let i = 0; i < list.length; i++) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const option = list[i];
            a.className = className.anchor;
            if (datasetOpt.multiText) {
              method.changeMultiText(option, a);
            } else {
              a.innerText = option.textContent;
            }
            a.setAttribute("role", "option");
            a.id = `${el.container.id}_anchor_${index++}`;
            li.classList.add(className.listItem);
            if (el.select.activeIndex === i) {
              if (datasetOpt.multiText) {
                method.changeMultiText(option, el.titleSpan);
              } else {
                el.titleSpan.textContent = option.textContent;
              }
              a.classList.add(className.selected);
              activeIndex = i;
            }
            if (option.disabled) {
              li.setAttribute("aria-disabled", true);
              li.classList.add(className.listItemDisabled);
            }
            li.appendChild(a);
            el.list.appendChild(li);
          }
        },
        changeMultiText: (option, text) => {
          const tArr = option.textContent.split(datasetOpt.multiText);
          if (tArr.length > 1) {
            let str = "";
            tArr.forEach((s, idx) => {
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
            utils.trigger(el.select, "change");
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
          if (datasetOpt.portal === void 0) {
            this.portal = !!dialog;
          }
          if (!this.portal) {
            return;
          }
          const portal = document.createElement("div");
          portal.className = "select-portal select-wrap";
          const zIndex = dialog ? window.getComputedStyle(dialog).getPropertyValue("z-index") : null;
          Object.assign(portal.style, {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (isNaN(parseInt(zIndex)) ? 0 : parseInt(zIndex)) + 1,
            pointerEvents: "none"
          });
          if (typeof this.portal === "object") {
            Object.assign(portal.style, this.portal);
          }
          document.body.appendChild(portal);
          portal.appendChild(el.listWrap);
          el.listWrap.style.setProperty("pointer-events", "auto");
        },
        /**
         * @function removePortal
         * @memberof Selectmenu
         * @description 포탈 제거
         */
        removePortal: () => {
          if (document.querySelector(".select-portal")) {
            const portal = document.querySelector(".select-portal");
            el.container.appendChild(el.listWrap);
            el.listWrap.removeAttribute("style");
            portal.remove();
          }
        },
        open: () => {
          isOpen = true;
          method.docClick();
          el.listWrap.classList.add(className.open);
          el.button.classList.add(className.buttonOpen);
          el.button.setAttribute("aria-expanded", true);
          el.list.setAttribute("aria-hidden", false);
          if (!initialize) {
            initialize = true;
            method.createScroll();
            window.addEventListener("scroll", handler.winScroll);
            window.addEventListener("resize", handler.winResize);
          }
          method.createPortal();
          method.updateListPos();
        },
        close: () => {
          isOpen = false;
          method.docClickClear();
          el.listWrap.classList.remove(className.open);
          el.button.classList.remove(className.buttonOpen);
          el.button.setAttribute("aria-expanded", false);
          el.list.setAttribute("aria-hidden", true);
          method.removePortal();
        },
        docClick: () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!docBind) {
              docBind = true;
              document.addEventListener("click", handler.click.document);
            }
          }, 100);
        },
        docClickClear: () => {
          clearTimeout(timer);
          document.removeEventListener("click", handler.click.document);
          docBind = false;
        },
        listOver: (idx) => {
          if (el.list.querySelector(`.${className.selected}`)) {
            el.list.querySelector(`.${className.selected}`).classList.remove(className.selected);
          }
          activeIndex = idx;
          const newEl = el.listAnchor[activeIndex];
          if (newEl) {
            newEl.classList.add(className.selected);
            el.button.setAttribute("aria-activedescendant", newEl.id);
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
            listEl.querySelector("a").focus();
          }
        },
        next: () => {
          let i = activeIndex + 1;
          if (i > optionsLength - 1) {
            i = optionsLength - 1;
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
            listEl.querySelector("a").focus();
          }
        },
        activeCheck: () => {
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
            const target2 = event.target.closest(selector.container);
            if (target2 === el.container) {
              return;
            }
            docBind = false;
            method.close();
          },
          button: () => {
            method.toggle();
          },
          listItem: (event) => {
            const idx = parseInt(utils.getIndex(event.target.closest("li")));
            if (el.select.selectedIndex !== idx) {
              method.listOver(idx);
              method.change(idx);
            }
            method.close();
          }
        },
        hover: {
          listItem: (event) => {
            const anchor = event.target;
          }
        },
        wheel: (event) => {
          const e = window.event || event;
          const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)) * 100;
          const targetEl = event.currentTarget;
          let scrollTop = targetEl.scrollTop + Math.round(delta * -1) / 10;
          scrollTop = method.limitScrollPosition(scrollTop);
          targetEl.scrollTop = scrollTop;
          event.preventDefault();
        },
        scroll: () => {
          const scrollTop = el.list.scrollTop / scrollPos.scroll * scrollPos.barScroll;
          el.scrollbar.style.top = `${scrollTop}px`;
        },
        mousedown: (event) => {
          scrollPos.barPos = event.pageY - parseInt(el.scrollbar.style.top);
          el.doc.addEventListener("mousemove", handler.mousemove);
          el.doc.addEventListener("mouseleave", handler.mouseleave);
          el.doc.addEventListener("mouseup", handler.mouseleave);
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
          el.doc.removeEventListener("mousemove", handler.mousemove);
          el.doc.removeEventListener("mouseleave", handler.mouseleave);
          el.doc.removeEventListener("mouseup", handler.mouseleave);
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
  };
  Selectmenu.index = 0;
  var selectmenuController = {
    init: (selector) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
        if (obj) {
          obj.reInit();
        } else {
          const select = new Selectmenu(el);
          root.weakMap.set(el, select);
        }
      });
    }
  };
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
      if (!el || index === void 0) {
        return;
      }
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.reInit(index);
      }
    }
  };

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
  (function() {
    let breakpoint = null;
    function bind() {
      window.addEventListener("scroll", scrollHandler);
      window.addEventListener("resize", resizeHandler);
      breakpoint = window.matchMedia("(min-width:768px)");
      breakpoint.addEventListener("change", breakpointChecker);
    }
    function contentReady() {
      console.log("ready");
      selectmenuController.init(".select-wrap > select");
      datepickerController.init(".datepickerInner");
      bind();
      if (Header_default) Header_default.init();
      if (co_default) co_default.init();
      resizeHandler();
      scrollHandler();
      breakpointChecker(breakpoint);
    }
    function scrollHandler() {
    }
    function resizeHandler() {
      if (co_default) co_default.resize();
    }
    function breakpointChecker(e) {
      if (!e.matches) {
      } else {
      }
      if (co_default) co_default.breakpointChecker(e);
      if (Header_default) Header_default.breakpointChecker(e);
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", contentReady);
    } else {
      contentReady();
    }
    document.addEventListener("DOMContentLoaded", contentReady);
  })();
})();
