// 감시 중인 obsv_BsPOP를 조회, 보여지는 Bs레이어의 id값을 배열로 반환
function isBsVisible() {
	if (typeof obsv_BsPOP === 'object' && obsv_BsPOP.els !== undefined) {
		var obj = obsv_BsPOP.els;
		var keys = Object.keys(obj);
		var arrVisiblePop = keys.filter(function (key) {
			return obj[key];
		});
		//console.log(arrVisiblePop, arrVisiblePop.length);
		return arrVisiblePop;
	} else {
		return null;
	}
}

const pbui = {
    /* bottom sheet */
    BsCtl: function (bsTarget, bsObj) {
        if (!new.target) {
            return new pbui.BsCtl(bsTarget, bsObj);
        }
        this.target = $(bsTarget);

        var triggerBtn;
        //	triggerBtn = bsObj?.callBtn?? window.event?.currentTarget ;
        if (bsObj && bsObj.callBtn !== undefined && bsObj.callBtn !== null) {
            triggerBtn = bsObj.callBtn;
        } else if (window.event && window.event.currentTarget !== undefined && window.event.currentTarget !== null) {
            triggerBtn = window.event.currentTarget;
        } else {
            triggerBtn = undefined;
        }

        triggerBtn = triggerBtn == undefined || triggerBtn.nodeName == '#document' ? undefined : triggerBtn;
        this.callBtn = triggerBtn !== undefined && $(triggerBtn);
        this.btnEditing = this.callBtn && this.callBtn.data().editing ? 'enabled' : undefined;
        //	this.closeCallback = bsObj?.closeCallback?? undefined;
        if (bsObj && bsObj.closeCallback !== undefined && bsObj.closeCallback !== null) {
            this.closeCallback = bsObj.closeCallback;
        } else {
            this.closeCallback = undefined;
        }

        //	this.customButtons = bsObj?.customButtons?? undefined;
        if (bsObj && bsObj.customButtons !== undefined && bsObj.customButtons !== null) {
            this.customButtons = bsObj.customButtons;
        } else {
            this.customButtons = undefined;
        }

        //	this.loadAfter = bsObj?.loadAfter?? undefined;
        if (bsObj && bsObj.loadAfter !== undefined && bsObj.loadAfter !== null) {
            this.loadAfter = bsObj.loadAfter;
        } else {
            this.loadAfter = undefined;
        }

        if (this.callBtn) {
            this.showEvent();
        }
    },
    /* dialog */
    DialogCtl: function(dlObj, btnCallback) {
        if (!new.target) {
            return new pbui.DialogCtl(dlObj, btnCallback);
        }
        this.target;
        this.dlObj = dlObj;

        if (typeof dlObj == 'object') {
            this.callBtn = dlObj.callBtn ? dlObj.callBtn : undefined;
            this.form = dlObj.form ? dlObj.form : undefined;
            this.customButtons = this.dlObj.customButtons ? this.dlObj.customButtons : undefined;
            if (this.callBtn) {
                this.callBtn = $(this.callBtn);
                this.showEvent();
            }
        } else if (typeof dlObj == 'string' && typeof btnCallback == 'function') {
            this.btnCallback = btnCallback;
        }
    }
}

pbui.BsCtl.prototype.showEvent = function () {
	this.callBtn.off('click').on(
		'click',
		function (e) {
			this.show();
		}.bind(this)
	);
};

pbui.BsCtl.prototype.show = function (e) {
	this.target.addClass('open');
	$('body').addClass('stop-scroll');

	!!this.target.find('.select-list .item-inner').length && this.itemClick();
	!!this.target.find('.btn-close').length && this.closePop();
	this.customButtons && this.customBtnClick();
	this.loadAfter && this.loadAfter();

	if (this.callBtn && this.callBtn.closest('.lpop--wrap2').length > 0) {
		this.parent = this.callBtn.closest('.lpop--wrap2');
		this.parent.hide();
	}
};

pbui.BsCtl.prototype.callbackCustom = function (obj, callback) {
	if (callback) {
		callback(obj);
	}
};

pbui.BsCtl.prototype.itemClick = function () {
	try {
		this.target
			.find('.item-inner')
			.off('click')
			.on(
				'click',
				function (e) {
					var $this = $(e.currentTarget);

					// .except 클래스가 있는 태그는 제거하기
					var cloneThis = $this.clone();
					cloneThis.find('.except').remove();
					if (cloneThis.find('.just-this').length > 0) {
						// .just-this 태그만 가져올 때
						cloneThis = cloneThis.find('.just-this');
					}
					var selectItem = cloneThis.html();
					$this.closest('li').siblings().find('a').removeClass('on');
					$this.addClass('on');
					if (this.callBtn.find('.bs-value, span:first-child').length > 0) {
						this.callBtn.find('.bs-value, span:first-child').first().get(0).innerHTML = selectItem;
					} else {
						this.callBtn.addClass('on');
						if (this.btnEditing == 'enabled') {
							this.callBtn.empty();
							this.callBtn.get(0).innerHTML = selectItem;
						}
					}
					this.hide();
					if(this.parent && !this.parent.hasClass('uixThrough')) {
						this.parent && this.parent.show();
					}
					return false;
				}.bind(this)
			);
	} catch {
		console.log('callBtn을 설정해주세요');
	}
};

pbui.BsCtl.prototype.customBtnClick = function () {
	var $this = this;
	this.customButtons.forEach(function (item) {
		$(item.el)
			.off('click')
			.on('click', function (e) {
				if (item.elCallback) {
					item.elCallback();
				}
				(item.popClose == undefined ? true : item.popClose) && $this.hide();
			});
	});
};

pbui.BsCtl.prototype.closePop = function (callback) {
	this.target
		.find('.btn-close')
		.off('click')
		.on(
			'click',
			function (e) {
				this.hide();
				if(this.parent && !this.parent.hasClass('uixThrough')) {
						this.parent && this.parent.show();
					}
				if (this.closeCallback) {
					this.closeCallback();
				}
				if (callback) {
					callback();
				}
			}.bind(this)
		);
};

pbui.BsCtl.prototype.hide = function () {
	this.target.removeClass('open');
	$('body').removeClass('stop-scroll');
};

pbui.BsCtl.prototype.remove = function () {
	this.target.remove();
	//this = null;
};

// 특정 dom 안에 동적으로 html 문서를 로드해서 삽입하는 함수 (container, url)
pbui.BsCtl.prototype.loadHtml = function (element, url, callback) {
	this.target.find(element).load(url, callback);
};

// 레이어 dimm 영역 클릭 시 닫기 버튼 호출
function fnCancelateLayer() {
	document.body.addEventListener('click', function (e) {
		if (isBsVisible() && isBsVisible().length === 1 && obsv_TargetDelay === true) {
			var layerEl = isBsVisible()[0];
			layerEl = layerEl.replace(/ /g, '.');
			if (e.target.matches(obsv_Targets) && $(layerEl + ' .btn-close').length > 0) {
				$(layerEl + ' .btn-close')[0].click();
			}
		} else {
			obsv_TargetDelay = false;
		}
	});
}

//------------------------------------------------------
/*
	1. 다이얼로그... : 
	트리거버튼 없이 show할 수 있다. 
	하단 버튼이 하나 이상고려 
	호출됐을때 z-index를 제일 높게 

	dlSeletor:선택한 알럿
	callBtn : 알럿을 트리거한 버튼 

*/

pbui.DialogCtl.prototype.show = function () {
	if (this.callBtn && window.event.currentTarget !== this.callBtn.get(0)) {
		console.log('onclick시 currentTarget과 callBtn의 element가 다르니 옵션에서 callBtn을 제거해 주세요');
		return;
	}
	//	console.log('diallogShow');
	this.makeUp();
	var maxZIndex = pbui.DialogCtl.getZIndex();
	this.target.css('z-index', ++maxZIndex).addClass('open');
	$('body').addClass('stop-scroll');

	if (isBsVisible() && isBsVisible().length > 0) {
		$('.lpop--wrap, .lpop--wrap2, .select-lpop-wrap, .lpop-mask').addClass('hide-dimm');
	}
	this.customButtons && this.customBtnClick(this.customButtons);
};

pbui.DialogCtl.prototype.makeUp = function () {
	if ($(document).find('._modal-alert').length) {
		$(document).find('._modal-alert').remove();
	}
	if (typeof dlObj !== 'object') {
		this.onlyText = this.dlObj;
	}

	var dialogOuter = this.createElement('_modal-alert');
	var dialog = this.createElement('inner');
	// var dialogHeader = this.createElement('header');
	var dialogBody = this.createElement('content');
	var dialogFooter = this.createElement('button-box');
	var btnGroup;
	//	dialogBody.innerHTML = this.dlObj.form?.content?? this.onlyText ;
	if (this.dlObj && this.dlObj.form && this.dlObj.form.content) {
		dialogBody.innerHTML = this.dlObj.form.content;
	} else {
		dialogBody.innerHTML = this.onlyText;
	}

	// dialogHeader.innerHTML.length && dialog.append(dialogHeader);
	dialog.append(dialogBody);
	dialog.append(dialogFooter);
	dialogOuter.append(dialog);

	if (this.form && this.form.button) {
		this.form.button.forEach(
			function (item) {
				var btnClass;
				//	btnClass = item.el?.replace('.', '');
				if (item.el) {
					btnClass = item.el.replace('.', '');
				} else {
					btnClass = undefined;
				}
				var btn = this.createElement(btnClass, 'button', item.btnText);
				if(item.attr && typeof item.attr === 'object') {
					Object.keys(item.attr).forEach(key => {
						btn.setAttribute(key, item.attr[key]);
					});
				}
				btn.text = item.btnText;
				dialogFooter.append(btn);
				btnGroup = this.form.button;
			}.bind(this)
		);
	} else {
		var onlyOnebtn = this.createElement('_btn-medium-primary', 'button', '확인');
		dialogFooter.append(onlyOnebtn);
		btnGroup = [{ el: onlyOnebtn }];
	}
	if (isBsVisible() && isBsVisible().length > 0) {
		$(dialogOuter).addClass('on-layer');
	}
	this.target = $(dialogOuter);
	$('body').append(this.target);
	this.customBtnClick(btnGroup);
};

pbui.DialogCtl.prototype.createElement = function (className, tagName = 'div', txt) {
	var elem = document.createElement(tagName);
	$(elem).addClass(className);
	txt && $(elem).text(txt);
	return elem;
};

pbui.DialogCtl.prototype.showEvent = function () {
	this.callBtn.off('click').on(
		'click',
		function (e) {
			e.preventDefault();
			this.show();
		}.bind(this)
	);
};

pbui.DialogCtl.prototype.hide = function () {
	this.target.attr('style', '').removeClass('open');
	$('body').removeClass('stop-scroll');
	$('.lpop--wrap, .lpop--wrap2, .select-lpop-wrap, .lpop-mask').removeClass('hide-dimm');
	this.target.remove();
};

pbui.DialogCtl.prototype.customBtnClick = function (btnGroup) {
	var $this = this;
	btnGroup.forEach(function (item) {
		if(typeof item.el === 'string') {
			item.el = item.el.replace(/\t/g, ' ');
			item.el = item.el.replace(/ +/g, ' ');
			item.el = item.el.replace(/ /g, '.');
			if (item.el.length > 0 && item.el.slice(-1) === '.') {
				item.el = item.el.slice(0, -1) + '';
			}
		}
		$(item.el)
			.off('click')
			.on('click', function (e) {
				e.preventDefault();
				if (item.elCallback) {
					item.elCallback();
				} else if ($this.btnCallback) {
					$this.btnCallback();
				}
				(item.dialogHide == undefined ? true : item.dialogHide) && $this.hide();
			});
	});
};
pbui.DialogCtl.prototype.callbackCustom = function (obj, callback) {
	if (callback) {
		callback(obj);
	}
};

pbui.DialogCtl.prototype.loadHtml = function (element, url, callback) {
	this.target.find(element).load(url, callback);
};

pbui.DialogCtl.getZIndex = function () {
	return [...document.querySelectorAll('body > *, .event-reform > *')]
		.map(function (ele) {
			return parseInt(getComputedStyle(ele).zIndex, 10) || 0;
		})
		.reduce(function (prev, curr) {
			return curr > prev ? curr : prev;
		}, 0);
};