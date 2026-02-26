import { mvJs, root } from "@config";
import { utils } from "@utils";
import Datepicker from "@vendors/datepicker";

class CustomDatepicker {
  /**
   * Create a CustomDatepicker
   * @class CustomDatepicker
   * @param {Element} target - 생성 타겟
   * @description 외부 라이브러리 사용 및 커스텀  {@link http://wwilsman.github.io/Datepicker.js}
   */
  constructor(target, obj = {}) {
    const el = {
      target: target,
    };

    let picker;

    // eslint-disable-next-line no-unused-vars
    const selector = {};

    // eslint-disable-next-line no-unused-vars
    const handler = {
      change: () => {},
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
        // console.log(picker,' ',months);
        picker._set.yearRange(months);
        picker.render();
      },
    };

    const bind = () => {};

    const unbind = () => {};

    const setProperty = () => {};

    const init = () => {
      setProperty();

      picker = new Datepicker(el.target, option);

      bind();
    };

    let option = {
      classNames: {
        node: "datepicker",
      },
      onRender() {
        [
          ...el.target
            .closest(`.${option.classNames.node}`)
            .querySelectorAll(".is-otherMonth > div > button"),
        ].forEach((ele) => {
          ele.disabled = true;
        });

        [
          ...el.target
            .closest(`.${option.classNames.node}`)
            .querySelectorAll(".datepicker__title"),
        ].forEach((ele) => {
          const select = ele.querySelector("select");
          if (select.getAttribute("data-year")) {
            // const year = select.getAttribute('data-year');
            // select.setAttribute('title', year +'년');
            select.setAttribute("title", "년도 선택");
          } else {
            // const month = Number(select.getAttribute('data-month'))+1;
            // select.setAttribute('title', month +'월');
            select.setAttribute("title", "월 선택");
          }
        });

        // [... el.target.closest(`.${option.classNames.node}`).querySelectorAll('.datepicker__title select')].forEach((elem) => {
        //   // console.log('==--- ');
        //   //elem.style.display = 'none';
        //   // elem.style.height = '0';
        //   // elem.remove();
        //   // console.log(elem.style.display,' : ',elem);
        // });
      },
      onInit() {
        // console.log(el.target);
        // console.log(el.target.closest(option.classNames.node));
      },
      // within: [new Date('2022.05.26'), new Date('2022.05.29')],
      templates: {
        header: [
          `<header class="datepicker__header">
            <button class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>지난 달</button>
            <span class="datepicker__title"><%= renderYearSelect() %></span>
            <span class="datepicker__title"><%= renderMonthSelect() %></span>
            <button  class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>다음 달</button>
          </header>`,
        ].join(""),

        day: [
          `<% classNames.push("datepicker__day"); %>
           <td class="<%= classNames.join(" ") %>" data-day="<%= timestamp %>"><div>
            <button class="datepicker__daynum"><%= daynum %></button>
           </div></td>`,
        ].join(""),
        // 샘플 // libs/defaults
        // ,
      },
      i18n: {
        months: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      },
      serialize: (data) => {
        return utils.toStringByFormatting(data, ".");
      },
    };

    option = Object.assign(option, obj);

    root.weakMap.set(el.target, this);

    /**
     * @function reInit
     * @memberof Tab
     * @description 재생성
     */
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
    // this.yearRange = method.yearRange;
    this.reInit = reInit;
  }
}

export const datepickerController = {
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
  },
};

/**
 * @namespace datepicker
 * @alias mvJS.datepicker
 * @memberof mvJs
 * @description 데이터 피커 메소드 모음
 */
mvJs.datepicker = {};

mvJs.datepicker.init = datepickerController.init;

/**
 * @param {String} selector - element selector (id or class)
 * @param {String} date - 선택하려는 날자 ex) 2022.05.12
 * @memberof datepicker
 * @function setDate
 * @description 데이터 피커 선택일 지정
 **/
mvJs.datepicker.setDate = datepickerController.setDate;

/**
 * @memberof datepicker
 * @function getDate
 * @param {String} selector - element selector (id or class)
 * @returns {String} 선택 된 날자 리턴
 * @description 데이터 피커 선택 데이터 지정
 **/
mvJs.datepicker.getDate = datepickerController.getDate;

/**
 * @memberof datepicker
 * @function within
 * @param {String} selector - element selector (id or class)
 * @param {Array} array - 선택하려는 날자 [2022.05.12, 2022.05.17, 2022.05.18]
 * @description 지정된 날짜만 선택 사능
 **/
mvJs.datepicker.within = datepickerController.within;

/**
 * @memberof datepicker
 * @function without
 * @param {String} selector - element selector (id or class)
 * @param {Array} array - 선택하려는 날자 [2022.05.12, 2022.05.17, 2022.05.18]
 * @description 데이터 피커 선택 데이터 지정
 **/
mvJs.datepicker.without = datepickerController.without;

/**
 * @memberof datepicker
 * @function onChange
 * @param {String} selector - element selector (id or class)
 * @param {Function} func - 콜백 함수
 * @description 선택일 변경시 함수 콜백
 **/
mvJs.datepicker.onChange = datepickerController.onChange;
