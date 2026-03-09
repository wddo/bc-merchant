$(document).ready(function () {
  pbui.iptSetFocus(); //input 내에 delete 버튼 생성
  pbui.passwordMask(); //password에 view 버튼 생성
});

const _weakMap = (() => {
  const weakMap = new WeakMap();

  return {
    get(key) {
      return weakMap.get(key);
    },
    set(key, value) {
      weakMap.set(key, value);
    },
  };
})();

const pbut = {
  getDeviceType: function () {
    if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
    if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches)
      return "tablet";
    return "pc";
  },
  scrollLock: function () {
    const $body = $("body");
    $body.addClass("stop-scroll");
  },
  scrollUnLock: function () {
    const $body = $("body");
    $body.removeClass("stop-scroll");
  },
  getFocusableElements: function (container) {
    const $container = $(container);
    if ($container.length === 0)
      return { elements: $(), first: null, last: null };

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const $elements = $container.find(focusableSelector).filter(function () {
      return $(this).is(":visible") && !$(this).is(":disabled");
    });
    const first = $elements.first()[0] || null;
    const last = $elements.last()[0] || null;

    return { elements: $elements, first, last };
  },
};

const pbui = (function () {
  const layerStack = [];
  class Popup {
    constructor(target, obj = {}) {
      const el = {
        doc: document,
        $popup: $(target),
        $btnClose: null,
        $btnConfirm: null,
        focus: null,
        $layerPopWrap: null,
        $opener: null,
      };

      const isTooltipType = el.$popup.hasClass("_type-tooltip");
      let closeTimer;

      let option = {
        position: "top-left",
        opener: null,
      };

      option = Object.assign(option, obj);
      this.state = Popup.STATE_CLOSE;

      let focusElArr = [];

      const selector = {
        popup: "._modal-popup",
        btnClose: ".btn-close",
        btnConfirm: ".button-box  > button",
        layerPopWrap: ".inner",
        focus: "a, input, button",
      };

      const setProperty = () => {
        el.$btnClose = el.$popup.find(selector.btnClose);
        el.$btnConfirm = el.$popup.find(selector.btnConfirm);

        el.$layerPopWrap = el.$popup.find(selector.layerPopWrap);
        el.$popup.attr("tabindex", 0);

        method.focusSetElArr();
      };

      const bind = () => {
        el.$popup.on("click.popup", handler.click);
        if (el.$btnClose[0]) el.$btnClose.on("click.popup", handler.click);
        $(window).on("resize.popup", handler.resize);

        if (option.opener && isTooltipType) {
          $(option.opener).on("click.poup", handler.click);
          // 	$(option.opener)
          // 	.off('mouseenter.popup mouseleave.popup')
          // 	.on('mouseenter.popup', () => {
          // 		if (pbut.getDeviceType() === 'mobile') return;
          // 		clearTimeout(this.closeTimer);
          // 		method.open();
          // 	})
          // 	.on('mouseleave.popup', () => {
          // 		if (pbut.getDeviceType() === 'mobile') return;
          // 		this.closeTimer = setTimeout(() => {
          // 			method.close();
          // 		}, 80);
          // 	});
        }
      };

      const unbind = () => {
        el.$popup.off("click.popup", handler.click);
        if (el.$btnClose[0]) el.$btnClose.off("click.popup", handler.click);
        $(window).off("resize.popup", handler.resize);

        if (option.opener && isTooltipType) {
          $(option.opener).off("click.poup", handler.click);
          // 	$(option.opener).off('mouseenter.popup mouseleave.popup')
        }
      };

      const handler = {
        click: (e) => {
          const $target = $(e.target);
          const $curTarget = $(e.currentTarget);

          if (option.opener && $curTarget[0] === $(option.opener)[0]) {
            method.open();
          }

          if ($curTarget[0] === el.$btnClose[0]) {
            method.close();
          }

          if (el.$popup[0] === $target[0]) {
            method.close();
          }
        },

        keydown: (evt) => {
          if (evt.keyCode !== 9) {
            return;
          }

          method.focusSetElArr();

          let idx = parseInt(document.activeElement.getAttribute("data-idx"));
          if (evt.shiftKey) {
            idx -= 1;
            if (idx < 0) {
              idx = focusElArr.length - 1;
            }
          } else {
            idx += 1;

            if (idx >= focusElArr.length) {
              idx = 0;
            }
          }

          if (focusElArr[idx]) {
            focusElArr[idx].focus();
          }

          evt.preventDefault();
        },

        resize: (e) => {
          if (isTooltipType) {
            if (el.$popup.is(":visible")) {
              el.$popup.css(method.getPosition());
               
              if (pbut.getDeviceType() === "mobile") {
                pbut.scrollLock();
              } else {
                pbut.scrollUnLock();
              }
            }
          }
        },
      };

      const method = {
        open: () => {
          if (this.state === Popup.STATE_OPEN) {
            const idx = layerStack.indexOf(this);
            if (idx > -1) layerStack.splice(idx, 1);
            layerStack.push(this);
            return;
          }

          const currentPopup = layerStack[layerStack.length - 1];
          if (currentPopup && currentPopup !== this) {
            currentPopup.hide();
          }

          el.$opener = option.opener
            ? $(option.opener)
            : $(document.activeElement);
          el.$popup.trigger("openbefore", el);

          this.state = Popup.STATE_OPEN;

          if (isTooltipType)
            el.$popup.css({ left: 0, top: $(window).scrollTop() + "px" });

          method.show();
          el.$popup.focus();

          if (isTooltipType) {
            el.$popup.css(method.getPosition());
            if (pbut.getDeviceType() === "mobile") {
              layerStack.push(this);
              pbut.scrollLock();
            }

            // el.$popup
            // .off('mouseenter.popup mouseleave.popup')
            // .on('mouseenter.popup', () => {
            // 	if (pbut.getDeviceType() === 'mobile') return;
            // 	clearTimeout(this.closeTimer);
            // })
            // .on('mouseleave.popup', () => {
            // 	if (pbut.getDeviceType() === 'mobile') return;
            // 	this.closeTimer = setTimeout(() => {
            // 		method.close();
            // 	}, 80);
            // });
          } else {
            layerStack.push(this);
            pbut.scrollLock();
          }

          $(el.doc).on("keydown.popup", handler.keydown);

          el.$popup.trigger("openafter", el);
        },

        close: () => {
          if (this.state === Popup.STATE_CLOSE) return;

          el.$popup.trigger("closebefore", el);

          this.state = Popup.STATE_CLOSE;
          el.$opener?.focus();
          el.$opener = null;
          method.hide();
          pbut.scrollUnLock();
          $(el.doc).off("keydown.popup", handler.keydown);

          el.$popup.trigger("closeafter", el);

          const idx = layerStack.indexOf(this);
          if (idx > -1) layerStack.splice(idx, 1);

          if (el.$popup.hasClass("all-close")) {
            layerStack.length = 0;
          }

          if (isTooltipType) return;

          const prevPopup = layerStack[layerStack.length - 1];

          if (prevPopup) {
            prevPopup.show();
            prevPopup.state = Popup.STATE_OPEN;
            $(document).find("._modal-popup.open").focus();
          }
        },

        focusSetElArr: () => {
          el.focus = el.$popup[0].querySelectorAll(selector.focus);
          focusElArr = [];

          let n = 1;
          [...el.focus].forEach((el) => {
            el.setAttribute("data-idx", "");

            if (!el.disabled) {
              el.setAttribute("data-idx", n);
              focusElArr.push(el);
              n++;
            }
          });

          el.$popup.attr("data-idx", 0);
          focusElArr.unshift(el.$popup[0]);
        },

        show: () => {
          el.$popup.addClass("open").attr("aria-hidden", false);
        },

        hide: () => {
          el.$popup.removeClass("open").attr("aria-hidden", true);
        },

        getPosition: () => {
          if (!isTooltipType) return;
          const itemCoord = method.getCoord(el.$opener);
          const containerCoord = method.getCoord($("body"));
          const realCoord = {
            x: itemCoord.x - containerCoord.x,
            y: itemCoord.y - containerCoord.y,
          };

          let top;
          let left;
          const margin = 8;

          switch (option.position) {
            case "top-center":
              top = realCoord.y - el.$popup.outerHeight() - margin;
              left =
                realCoord.x -
                el.$popup.outerWidth() / 2 +
                el.$opener.outerWidth() / 2;
              break;
            case "top-right":
              top = realCoord.y - el.$popup.outerHeight() - margin;
              left =
                realCoord.x - el.$popup.outerWidth() + el.$opener.outerWidth();
              break;
            case "middle-left":
              top =
                realCoord.y -
                el.$popup.outerHeight() / 2 +
                el.$opener.outerWidth() / 2;
              left = realCoord.x - el.$popup.outerWidth() - margin;
              break;
            case "middle-right":
              top =
                realCoord.y -
                el.$popup.outerHeight() / 2 +
                el.$opener.outerWidth() / 2;
              left = realCoord.x + el.$opener.outerWidth() + margin;
              break;
            case "bottom-left":
              top = realCoord.y + el.$opener.outerHeight() + margin;
              left = realCoord.x;
              break;
            case "bottom-center":
              top = realCoord.y + el.$opener.outerHeight() + margin;
              left =
                realCoord.x -
                el.$popup.outerWidth() / 2 +
                el.$opener.outerWidth() / 2;
              break;
            case "bottom-right":
              top = realCoord.y + el.$opener.outerHeight() + margin;
              left =
                realCoord.x - el.$popup.outerWidth() + el.$opener.outerWidth();
              break;
            default:
              top = realCoord.y - el.$popup.outerHeight() - margin;
              left = realCoord.x;
              break;
          }

          if (pbut.getDeviceType() === "mobile" && isTooltipType) {
            return {
              left: 0,
              top: 0,
            };
          }

          return {
            left: left,
            top: top,
          };
        },

        getCoord: (item) => {
          const rect = item.get(0).getBoundingClientRect();
          const vv = window.visualViewport;
          const offsetX = vv ? vv.offsetLeft : 0;
          const offsetY = vv ? vv.offsetTop : 0;
          return {
            x: rect.left + offsetX,
            y: rect.top + offsetY,
          };
        },
      };

      const init = () => {
        setProperty();

        bind();
      };

      const reInit = () => {
        unbind();

        setProperty();

        bind();
      };

      init();

      this.open = method.open;
      this.close = method.close;
      ((this.show = method.show), (this.hide = method.hide));
      this.reInit = reInit;
    }
  }
  Popup.STATE_CLOSE = "close";
  Popup.STATE_OPEN = "open";

  class Alert {
    constructor(obj = {}) {
      const el = {
        doc: document,
        $alert: null,
      };

      const selector = {
        alert: "._modal-alert",
        focus: "a, input, button",
      };

      let focusElArr = [];

      let option = {
        header: "",
        content: "",
        buttonRender: {},
        buttonStyleType: "",
        closeButton: false,
      };

      option = Object.assign(option, obj);
      this.state = Alert.STATE_CLOSE;

      const handler = {
        click: (e) => {
          const $target = $(e.target);
          const $curTarget = $(e.currentTarget);

          if (el.$alert && el.$alert[0] === $target[0]) {
            method.close();
          }
        },

        keydown: (evt) => {
          if (evt.keyCode !== 9) {
            return;
          }

          method.focusSetElArr();

          let idx = parseInt(document.activeElement.getAttribute("data-idx"));
          if (evt.shiftKey) {
            idx -= 1;
            if (idx < 0) {
              idx = focusElArr.length - 1;
            }
          } else {
            idx += 1;

            if (idx >= focusElArr.length) {
              idx = 0;
            }
          }

          if (focusElArr[idx]) {
            focusElArr[idx].focus();
          }

          evt.preventDefault();
        },
      };

      const method = {
        render: () => {
          $(selector.alert).remove();

          const $outer = $(
            '<div class="_modal-alert" aria-hidden="true"></div>',
          );
          const $inner = $('<div class="inner"></div>');
          const $header = $('<div class="header"></div>');
          const $content = $('<div class="content"></div>');
          const $footer = $('<div class="button-box"></div>');

          if (option.header) {
            $header.html(option.header);
            $inner.append($header);
          }

          if (option.content) {
            $content.html(option.content);
          }

          $inner.append($content);
          $inner.append($footer);

          if (option.buttonStyleType) {
            $footer.addClass(option.buttonStyleType);
          }

          if (option.buttonRender && option.buttonRender.length) {
            option.buttonRender.forEach((item) => {
              const btnClass = item.el
                ? item.el.replace(/\./g, "")
                : "_btn-medium-primary";
              const $btn = $('<button type="button"></button>')
                .addClass(btnClass)
                .text(item.btnText || "확인");

              if (item.attr) {
                Object.keys(item.attr).forEach((key) => {
                  $btn.attr(key, item.attr[key]);
                });
              }

              $btn.on("click.alert", (e) => {
                e.preventDefault();

                if (item.callback) item.callback();
                if (item.close !== false) {
                  method.close();
                }
              });

              $footer.append($btn);
            });
          } else {
            const $defaultBtn = $(
              '<button type="button" class="_btn-medium-primary">확인</button>',
            );
            $defaultBtn.on("click.alert", method.close);
            $footer.append($defaultBtn);
          }

          if (option.closeButton) {
            const closeBtn = $(
              '<button class="btn-close" type="button">닫기</button>',
            );
            $inner.append(closeBtn);
          }

          $outer.append($inner);
          $outer.attr("tabindex", 0);

          el.$alert = $outer;

          $("body").append(el.$alert);

          el.$alert.on("click.alert", ".btn-close", method.close);
          el.$alert.on("click.alert", handler.click);
        },

        open: () => {
          if (this.state === Alert.STATE_OPEN) return;

          const current = layerStack[layerStack.length - 1];
          if (current && current !== this) {
            current.hide();
          }

          if (!el.$alert) {
            method.render();
          }

          layerStack.push(this);

          el.opener = document.activeElement;

          this.state = Alert.STATE_OPEN;
          method.show();
          el.$alert.focus();

          pbut.scrollLock();
          $(el.doc).on("keydown.alert", handler.keydown);

          return el.$alert;
        },
        close: () => {
          if (this.state === Alert.STATE_CLOSE) return;

          this.state = Alert.STATE_CLOSE;

          method.hide();
          el.$alert.remove();
          el.$alert = null;

          layerStack.pop();

          const prev = layerStack[layerStack.length - 1];
          if (prev) {
            prev.show();
            prev.state = Alert.STATE_OPEN;
          } else {
            pbut.scrollUnLock();
          }
          $(el.doc).off("keydown.alert", handler.keydown);

          el.opener?.focus();
          el.opener = null;
        },

        focusSetElArr: () => {
          el.focus = el.$alert[0].querySelectorAll(selector.focus);
          focusElArr = [];
          let n = 1;
          [...el.focus].forEach((el) => {
            el.setAttribute("data-idx", "");

            if (!el.disabled) {
              el.setAttribute("data-idx", n);
              focusElArr.push(el);
              n++;
            }
          });

          el.$alert.attr("data-idx", 0);
          focusElArr.unshift(el.$alert[0]);
        },

        show: () => {
          el.$alert?.addClass("open").attr("aria-hidden", false);
        },

        hide: () => {
          el.$alert?.removeClass("open").attr("aria-hidden", true);
        },
      };

      this.open = method.open;
      this.close = method.close;
      this.show = method.show;
      this.hide = method.hide;
    }
  }
  Alert.STATE_OPEN = "open";
  Alert.STATE_CLOSE = "close";

  class Toast {
    constructor(message = "", obj = {}) {
      const el = {
        $toast: null,
      };

      let option = {
        type: "",
        duration: 2000,
      };

      option = Object.assign(option, obj);
      this.state = Toast.STATE_CLOSE;

      const method = {
        render: () => {
          const $toast = $('<div class="_toast-message" tabindex="0"></div>');

          if (option.type) {
            $toast.addClass(option.type);
          }

          const $p = $("<p></p>").text(message);
          $toast.append($p);

          if (pbut.getDeviceType() === "mobile") {
            let bottom = 16;
            const $popup = $("._modal-popup:visible");
            if ($popup.length) {
              bottom += $popup.find(".inner").outerHeight();
            }
            $toast.css("bottom", bottom);
          }

          $("body").append($toast);
          el.$toast = $toast;
        },

        open: () => {
          if (this.state === Toast.STATE_OPEN) return;

          if (!el.$toast) method.render();

          this.state = Toast.STATE_OPEN;

          el.opener = document.activeElement;

          setTimeout(() => {
            el.$toast.addClass("on");
            el.$toast.focus();
          }, 50);

          setTimeout(() => {
            method.close();
          }, option.duration);
        },

        close: () => {
          if (this.state === Toast.STATE_CLOSE) return;

          this.state = Toast.STATE_CLOSE;

          if (el.$toast) {
            el.opener.focus();
            el.$toast.removeClass("on");
            setTimeout(() => {
              el.$toast.remove();
              el.$toast = null;
            }, 1000);
          }
        },
      };

      this.open = method.open;
      this.close = method.close;
    }
  }
  Toast.STATE_OPEN = "open";
  Toast.STATE_CLOSE = "close";

  class Tooltip {
    constructor(target, obj = {}) {
      const el = {
        $opener: null,
        $tooltip: null,
        $closeBtn: null,
      };

      const selector = {
        opener: target,
      };

      let option = {
        content: null,
        position: "bottom",
        container: "body",
        id: null,
        contentClass: '.tooltip-content'
      };

      option = Object.assign(option, obj);
      this.closeTimer;

      const setProperty = function () {
        el.$opener = $(selector.opener);
      };

      const handler = {
        click: (e) => {
          const $target = $(e.target);
          const $currentTarget = $(e.currentTarget);

          if ($target.closest(el.$opener[0]).length) {
            e.preventDefault();
            method.open();
          }

          if ($target.closest(el.$closeBtn[0]).length) {
            e.preventDefault();
            method.close();
          }
        },
        outerClick: (e) => {
          const $target = $(e.target);
          const $currentTarget = $(e.currentTarget);

          if (el.$tooltip) {
            if (
              !$target.closest(el.$opener[0]).length &&
              !$target.closest(el.$tooltip[0]).length
            ) {
              method.close();
            }
          }
        },
        keydown: (e) => {
          if (!el.$tooltip) return;

          if (e.key === "Escape" || e.keyCode === 27) {
            e.preventDefault();
            method.close();
          }
        },
        resize: () => {
          if (!el.$tooltip) return;
          method.setPosition();
        },
      };

      const bind = () => {
        el.$opener.on("click.tooltip", handler.click);
        el.$opener
          .off("mouseenter.tooltip mouseleave.tooltip")
          .on("mouseenter.tooltip", () => {
            clearTimeout(this.closeTimer);
            method.open();
          })
          .on("mouseleave.tooltip", () => {
            this.closeTimer = setTimeout(() => {
              method.close();
            }, 80);
          });
        $(document).on("keydown.tooltip", handler.keydown);
        $(document).on("click.tooltip", handler.outerClick);
      };

      const unbind = function () {
        el.$opener.off("click.tooltip", handler.click);
        $(document).off("keydown.tooltip", handler.keydown);
        $(document).off("click.tooltip", handler.outerClick);
      };

      const method = {
        render: () => {
          const id = option.id || "tooltip_" + Date.now();
          const tooltipHTML = `
						<div class="_tooltip" id="${id}" tabindex="0" role="tooltip">
							<div class="tooltip-container">
								<div class="tooltip-content"></div>
								<button type="button" class="tooltip-close">닫기</button>
							</div>
						</div>
					`;

          $(option.container).append(tooltipHTML);

          el.$tooltip = $("#" + id);
          el.$closeBtn = el.$tooltip.find(".tooltip-close");
          
          let tooltipContent = option.content;
          if (!tooltipContent) {
            tooltipContent = el.$opener.siblings(option.contentClass).html() || '';
          }

          el.$tooltip.find(".tooltip-content").html(tooltipContent);
          el.$opener.attr("aria-describedby", id);

          if (option.addClass) el.$tooltip.addClass(option.addClass);
          if (option.position) el.$tooltip.addClass(option.position);
        },

        open: () => {
          if (el.$tooltip) return;

          method.render();
          method.setPosition();

          el.$tooltip.show();
          el.$tooltip.focus();
          el.$closeBtn.off("click.tooltip").on("click.tooltip", handler.click);
          $(window).on("resize.tooltip", handler.resize);
          el.$tooltip
            .off("mouseenter.tooltip mouseleave.tooltip")
            .on("mouseenter.tooltip", () => {
              clearTimeout(this.closeTimer);
            })
            .on("mouseleave.tooltip", () => {
              this.closeTimer = setTimeout(() => {
                method.close();
              }, 80);
            });
        },

        close: () => {
          if (el.$opener.is(":focus")) return;
          el.$opener.focus();
          el.$tooltip.remove();
          el.$tooltip = null;
          $(window).off("resize.tooltip", handler.resize);
          clearTimeout(this.closeTimer);
        },

        setPosition: () => {
          const pos = method.getPosition();
          const zIndex = method.getZIndex() + 1;

          el.$tooltip.css({
            position: "absolute",
            left: pos.left,
            top: pos.top,
            zIndex: zIndex,
          });
        },

        getPosition: () => {
          const itemCoord = method.getCoord(el.$opener);
          const containerCoord = method.getCoord($(option.container));

          const realX = itemCoord.x - containerCoord.x;
          const realY = itemCoord.y - containerCoord.y;

          const margin = 11;
          const arrowW = 6;

          const $tooltip = el.$tooltip;
          const openerW = el.$opener.outerWidth();
          const openerH = el.$opener.outerHeight();
          const tooltipW = $tooltip.outerWidth();
          const tooltipH = $tooltip.outerHeight();

          let top, left;

          switch (option.position) {
            case "top-center":
              top = realY - tooltipH - margin;
              left = realX - tooltipW / 2 + openerW / 2;
              break;

            case "top-right":
              top = realY - tooltipH - margin;
              left = realX - tooltipW + openerW + arrowW;
              break;

            case "middle-left":
              top = realY - tooltipH / 2 + openerH / 2;
              left = realX - tooltipW - margin;
              break;

            case "middle-right":
              top = realY - tooltipH / 2 + openerH / 2;
              left = realX + openerW + margin;
              break;

            case "bottom-left":
              top = realY + openerH + margin;
              left = realX - arrowW;
              break;

            case "bottom-center":
              top = realY + openerH + margin;
              left = realX - tooltipW / 2 + openerW / 2;
              break;

            case "bottom-right":
              top = realY + openerH + margin;
              left = realX - tooltipW + openerW + arrowW;
              break;

            default:
              top = realY - tooltipH - margin;
              left = realX - arrowW;
          }

          return { left, top };
        },

        getCoord: ($el) => {
          const rect = $el.get(0).getBoundingClientRect();
          const vv = window.visualViewport;
          const offsetX = vv ? vv.offsetLeft : 0;
          const offsetY = vv ? vv.offsetTop : 0;

          return {
            x: rect.left + offsetX,
            y: rect.top + offsetY,
          };
        },

        getZIndex: ($el) => {
          return [...$("body").children()]
            .map((el) => parseInt(getComputedStyle(el).zIndex, 10) || 0)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      };

      const init = function () {
        setProperty();

        bind();
      };

      const reInit = () => {
        unbind();
        setProperty();
        bind();
      };

      this.init = init;
      this.reInit = reInit;

      init();
    }
  }

  class Selectmenu {
    constructor(target, obj = {}) {
      const el = {
        $doc: $(document),
        $target: $(target),
      };

      let option = {
        position: {
          of: el.$target.parent(),
          at: "left bottom",
          my: "left top+8",
          collision: "flip",
        },
        create: function (event, ui) {
          const $selectedCont = $(this).find("option:selected");
          if (
            !$selectedCont.attr("selected") ||
            $selectedCont.attr("disabled")
          ) {
            $(this)
              .selectmenu("widget")
              .find(".ui-selectmenu-text")
              .addClass("placeholder");
          }
          el.$target.addClass("selectmenu-init");
          handler.resize();
        },
        open: function () {
          method.setSelectOpen();
          if (
            !$(this)
              .selectmenu("widget")
              .find(".ui-selectmenu-text")
              .hasClass("placeholder")
          ) {
            method.setSelectCont();
          }
        },
        close: function () {
          if (pbut.getDeviceType() === "mobile") {
            pbut.scrollUnLock();
            // pull-to-refresh 비활성화 해제
            $("html,body").css({
              overscrollBehaviorY: "",
            });
          }
        },
        select: function (event, ui) {
          method.setSelectCont();
          if (ui.item.disabled) {
            $(this)
              .selectmenu("widget")
              .find(".ui-selectmenu-text")
              .addClass("placeholder");
          }
        },
      };

      option = Object.assign(option, obj);

      let menu;
      let menuWidget;

      const handler = {
        scroll: () => {
          if (pbut.getDeviceType() === "mobile") {
          } else {
            $(".ui-selectmenu-menu")
              .filter(":visible")
              .each(function () {
                const $this = $(this);
                const $select = $(
                  `#${$this.children("ul").attr("aria-labelledby")}`,
                ).prev("select");
              });
          }
        },
        resize: () => {
          const $select = $(".page-select select, .input-box select");
          let isVisible = false;
          $select.each(function () {
            const $this = $(this);
            if (!$this.hasClass("selectmenu-init")) return;
            const $selectWrap = $this.closest(".input-box");
            const selectWidth = $selectWrap.width();
            const $menu = $this.selectmenu("menuWidget");
            const $menuWrap = $menu.closest(".ui-selectmenu-menu");

            if (
              pbut.getDeviceType() === "mobile" ||
              $selectWrap.is(":hidden")
            ) {
              $menuWrap.width("");
            } else {
              $menuWrap.width(selectWidth);
              if ($menuWrap.hasClass("ui-selectmenu-open")) {
                $this.selectmenu("close");
                $this.selectmenu("open");
              }
            }
            if ($menu.is(":visible")) {
              isVisible = true;
            }
          });
          if (isVisible) {
            if (pbut.getDeviceType() === "mobile") {
              method.setSelectOpen();
            } else {
              pbut.scrollUnLock();
              $("html,body").css({
                overscrollBehaviorY: "",
              });
            }
          }
        },
      };

      const bind = () => {
        $(window).on("scroll.selectmenu", handler.scroll);
        $(window).on("resize.selectmenu", handler.resize);
      };

      const unbind = () => {
        $(window).off("scroll.selectmenu", handler.scroll);
        $(window).on("resize.selectmenu", handler.resize);
      };

      const method = {
        setSelectCont: () => {
          const $selectCont = $(`#${menuWidget.attr("aria-activedescendant")}`);
          const $selectContWrap = $selectCont.closest("li");

          $selectContWrap.siblings("li").removeClass("selected");
          $selectContWrap.addClass("selected");
        },

        setSelectOpen: () => {
          const $menuWrap = menuWidget.closest(".ui-selectmenu-menu");
          menuWidget.css("top", "");

          if (pbut.getDeviceType() === "mobile") {
            pbut.scrollLock();

            // pull-to-refresh 비활성화
            $("html,body").css({
              overscrollBehaviorY: "contain",
            });

            // dim click close
            $menuWrap.off("click.selectIpt").on("click.selectIpt", (e) => {
              const _this = $(e.target);
              if (!_this.closest(".ui-menu").length) {
                menu.selectmenu("close");
              }
            });

            menuWidget.off("touchstart").on("touchstart", (e) => {
              const startTime = e.timeStamp;
              const touchstartPos = e.originalEvent.changedTouches[0];
              const startX = touchstartPos.clientX || touchstartPos.pageX;
              const startY = touchstartPos.clientY || touchstartPos.pageY;
              const menuT = parseInt(menuWidget.css("top")) || 0;
              const menuH = menuWidget.outerHeight();

              menuWidget.off("touchmove touchend");
              if (!$(e.target).hasClass("ui-menu")) return;
              menuWidget.css("overflow", "hidden");

              menuWidget.on("touchmove", (e) => {
                const touchmovePos = e.originalEvent.changedTouches[0];
                const moveX = touchmovePos.clientX || touchmovePos.pageX;
                const moveY = touchmovePos.clientY || touchmovePos.pageY;
                const posVal = menuT + (moveY - startY);

                menuWidget.css("top", posVal > 0 ? posVal : 0);
              });

              menuWidget.on("touchend", (e) => {
                const endTime = e.timeStamp;
                const touchendPos = e.originalEvent.changedTouches[0];
                const endX = touchendPos.clientX || touchendPos.pageX;
                const endY = touchendPos.clientY || touchendPos.pageY;

                menuWidget.css("overflow", "");

                if (
                  (startY < endY && endTime - startTime < 150) ||
                  menuH / 2 > menuH - parseInt(menuWidget.css("top"))
                ) {
                  if (startY !== endY) {
                    menuWidget.stop().animate({ top: menuH }, 150, () => {
                      menu.selectmenu("close");
                    });
                  }
                } else {
                  menuWidget.stop().animate({ top: 0 }, 150);
                }
                menuWidget.off("touchmove touchend");
              });
            });
          }
        },
      };

      const init = function () {
        menu = $(target).selectmenu(option);
        menuWidget = menu.selectmenu("menuWidget");
        bind();
      };

      const reInit = () => {
        unbind();
        bind();
      };

      init();

      this.reInit = reInit;
    }
  }

  class Datepicker {
    constructor(target, obj = {}) {
      const el = {
        $doc: $(document),
        $target: $(target),
        $icon: null,
      };

      const startDate = new Date();

      let option = {
        firstDay: 0,
        range: false,
        navTitles: { days: "<i>yyyy</i>.MMMM" },
        selectedDates: [startDate],
        multipleDatesSeparator: "-",
      };

      option = Object.assign(option, obj);

      let picker;

      const setProperty = () => {
        el.$icon = el.$target.siblings(".util-box").find(".ipt-calendar");
      };

      const handler = {
        click: (e) => {
          e.preventDefault();
          el.$target.focus();
        },
      };

      const bind = () => {
        el.$icon.on("click.datepicker", handler.click);
      };

      const unbind = () => {
        el.$icon.off("click.datepicker");
      };

      const method = {};

      const init = function () {
        setProperty();
        picker = new AirDatepicker(el.$target[0], option);
        bind();
      };

      const reInit = () => {
        unbind();
        setProperty();
        bind();
      };

      init();

      this.reInit = reInit;
    }
  }

  const popupCtl = {
    init: function (selector, options = {}) {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = _weakMap.get(el);

        if (obj) {
          obj.reInit();
        } else {
          const popup = new Popup(el, options);
          _weakMap.set(el, popup);
        }
      });
    },
    open: function (selector, obj = {}) {
      const el = document.querySelector(selector);

      if (!el) return;

      let popup = _weakMap.get(el);

      if (!popup) {
        popup = new Popup(el, obj);
        _weakMap.set(el, popup);
      }

      popup.open();
    },
    close: function (selector) {
      const el = document.querySelector(selector);

      if (!el) return;

      let popup = _weakMap.get(el);

      if (!popup) {
        popup = new Popup(el);
        _weakMap.set(el, popup);
      }

      popup.close();
    },
  };

  const alertCtl = {
    open(obj = {}) {
      const alert = new Alert(obj);
      return alert.open();
    },
    close() {
      const current = layerStack[layerStack.length - 1];

      if (current instanceof Alert) {
        current.close();
      }
    },
  };

  const toastCtl = {
    open(message = "", obj = {}) {
      const toast = new Toast(message, obj);
      return toast.open();
    },
  };

  const tooltipCtl = {
    init: function (selector, options = {}) {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = _weakMap.get(el);

        if (obj) {
          obj.reInit();
        } else {
          const tooltip = new Tooltip(el, options);
          _weakMap.set(el, tooltip);
        }
      });
    },
  };

  const selectmenuCtl = {
    init: (selector, options = {}) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = _weakMap.get(el);

        if (obj) {
          obj.reInit();
        } else {
          const select = new Selectmenu(el, options);
          _weakMap.set(el, select);
        }
      });
    },
  };

  const datepickerCtl = {
    init: (selector, options = {}) => {
      [...document.querySelectorAll(selector)].forEach((el) => {
        const obj = _weakMap.get(el);

        if (obj) {
          obj.reInit();
        } else {
          const select = new Datepicker(el, options);
          _weakMap.set(el, select);
        }
      });
    },
  };

  //input delete
  const fn_iptSetFocus = function () {
    $(document).on(
      "focusin",
      "input[type=text]:not([readonly]), input[type=password]:not([readonly])",
      function () {
        const $input = $(this);
        const $parent = $input.parent();

        // 이미 버튼이 있으면 제거
        $parent.find(".ipt-clear").remove();

        // clear 버튼 생성
        const $clearBtn = $("<button>", {
          type: "button",
          class: "ipt-clear",
          text: "삭제",
        }).css({
          display: $input.val() !== "" ? "inline-block" : "none",
          position: "absolute",
        });

        // 부모 position 보정
        if ($parent.css("position") === "static") {
          $parent.css("position", "relative");
        }

        // input 바로 뒤에 삽입
        $input.after($clearBtn);

        // 버튼 위치 계산
        function positionButton() {
          const right =
            $parent.innerWidth() -
            ($input.position().left + $input.outerWidth()) +
            12;
          $clearBtn.css("right", right + "px");
        }
        positionButton();

        $(window)
          .off("resize.iptSetFocus")
          .on("resize.iptSetFocus", positionButton);

        // 버튼 클릭 시 focusout 방지
        $clearBtn
          .off("mousedown.iptSetFocus")
          .on("mousedown.iptSetFocus", function (e) {
            e.preventDefault();
          });

        // 버튼 클릭
        $clearBtn
          .off("click.iptSetFocus")
          .on("click.iptSetFocus", function (e) {
            e.preventDefault();
            $input.val("");
            $clearBtn.hide();
            $input.focus();
          });

        // input 입력 이벤트
        $input.off("input.iptSetFocus").on("input.iptSetFocus", function () {
          $clearBtn.toggle($input.val() !== "");
        });

        // input blur 시 버튼 제거 (버튼에 포커스 있으면 유지)
        $input.off("blur.iptSetFocus").on("blur.iptSetFocus", function () {
          setTimeout(function () {
            if (!$(document.activeElement).is($clearBtn)) {
              $clearBtn.remove();
              $(window).off("resize.clearBtn");
            }
          }, 0);
        });

        // 버튼 blur 시 제거
        $clearBtn.off("blur.iptSetFocus").on("blur.iptSetFocus", function () {
          setTimeout(function () {
            if (!$(document.activeElement).is($input)) {
              $clearBtn.remove();
              $(window).off("resize.clearBtn");
            }
          }, 0);
        });
      },
    );
  };

  //password view
  const fn_passwordMask = function () {
    const $maskBtns = $(".ipt-mask");
    if (!$maskBtns.length) return false;

    $maskBtns.each(function () {
      const $maskBtn = $(this);
      const $utilBox = $maskBtn.closest(".util-box");
      const $input = $utilBox.prev("input");

      // 초기 상태 체크
      if ($input.val() !== "") {
        $maskBtn.addClass("on");
      }

      $input.attr("autocomplete", "off");

      // 클릭 이벤트
      $maskBtn.off("click.passwordMask").on("click.passwordMask", function (e) {
        e.preventDefault();
        toggle($maskBtn);
      });

      // input 이벤트 (위임)
      $maskBtn
        .closest(".input-box")
        .off("input.password")
        .on("input.password", "input", function () {
          if ($(this).val() === "") {
            $maskBtn.removeClass("on");
          } else {
            $maskBtn.addClass("on");
          }
        });
    });

    function toggle($button) {
      const $utilBox = $button.closest(".util-box");
      let $input = $utilBox.prev("input");

      if ($input.attr("type") === "password") {
        $button.addClass("off");
        $button.find("i").text("비밀번호 보기");
        $input.attr("type", "text");
      } else {
        $button.removeClass("off");
        $button.find("i").text("비밀번호 숨기기");
        $input.attr("type", "password");
      }

      // type 변경 시 이벤트 유지를 위한 clone 처리
      const $clone = $input.clone(true);
      $input.remove();
      $utilBox.before($clone);
    }
  };

  return {
    popup: popupCtl,
    alert: alertCtl,
    toast: toastCtl,
    tooltip: tooltipCtl,
    selectmenu: selectmenuCtl,
    datepicker: datepickerCtl,
    iptSetFocus: fn_iptSetFocus,
    passwordMask: fn_passwordMask,
  };
})();
