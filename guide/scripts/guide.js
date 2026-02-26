$(function(){
    setMenu();
    initElementCopyBtn();
    initElementEvent();
});

function setMenu(){
    const menu = {
        'Foundation' : ['Color', 'Typography', 'Iconography', 'Shape & Shadow'],
        'Controls' : ['Button', 'Text Button', 'Checkbox', 'Radio', 'Text Fields', 'Chips', 'Indicator', 'Switch', 'Tabs', 'Segment'],
        'Views' : ['Divider', 'Progress Step', 'Badge', 'Table'],
        'Overlay' : ['Popup', 'Alert', 'Toast', 'Tooltip'],
        'Module' : ['Feedback']
    };

    const menuWrap = document.querySelector('.side ul');
    const home = `<li class="m-1"><a href="guide.html">Intro</a></li>`;
    $(home).appendTo($('.side ul'));

    Object.entries(menu).forEach(([main, subs]) => {
        var list = `<li class="m-1"><a href="${main.toLowerCase()}.html">${main}</a></li>`;

        subs.forEach(sub => {
            list += `<li class="m-2"><a href="${main.toLowerCase()}.html#${sub.replace(/ /g,"")}">${sub}</a></li>`;
        });
        $(list).appendTo($('.side ul'));
    });

    //ancher 만들기
    $.each($('h2'), function (i) {
        var tar = $(this).closest('.cont-item');
        tar.attr("id", $(this).text().replace(/ /g,""));
    });

    // 모바일 메뉴
    const openMenu = document.querySelector('.btn-menu');
    const side = document.querySelector('.side');
    $(openMenu).off('click').on('click', function (e) {
        side.classList.toggle('open');
    });
}

function fnThrottle(fn, delay) {
    let timer;
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, arguments);
            }, delay);
        }
    };
}

// =========================
// 설정 영역 (최상단 정의)
// =========================

const CONTAINER_SELECTOR = '.wrap .cont';
const EXCEPTION_SELECTOR = '.exception-copy, [class^="_modal"] .inner .btn-close, [class^="_modal"] .inner .button-box';
let container;

// 대상 요소 셀렉터들
const TARGET_SELECTORS = [
    '[class^="_btn"]',
    '[class^="_textbtn"]',
    '[class^="_ipt"]',
    '[class^="_chip"]',
    '[class^="_switch"]',
    '[class^="_indicator"]',
    '[class^="_segment"]',
    '[class^="_divider"]',
    '[class^="_badge"]',
    '[class^="_modal"] .inner',
    '.color-item .value',
	'[class^="_table"]',
    '.input-box', '.tab-box', '.step-hor', '.step-button', '.paging'
].join(',');

let isActive = false;
let currentTarget = null;


// =========================
// css 생성
// =========================
const style = document.createElement('style');
style.type = 'text/css';
const css = `
    .element-copy-on [class^="_"]:disabled, 
    .element-copy-on [class^="_"].disabled {pointer-events:auto;}
    .tobblecopyBtn {
        position: fixed; top: 20px; right: 20px; z-index: 10001; padding: 0; cursor: pointer;
        width: 24px; height: 24px; overflow: hidden; line-height: 14px; color:transparent;
        opacity:.3; filter:grayscale(1);
        background: url(./images/icons/inspector.svg) no-repeat center/100%;
    }
    .element-copy-on .tobblecopyBtn {
        opacity:1; filter:grayscale(0);
    }
    @media (max-width:1024px) {
        .tobblecopyBtn {display:none !important;}
    }
`;
style.textContent = css;


// =========================
// 오버레이 생성
// =========================
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.background = 'rgba(0, 128, 255, 0.25)';
overlay.style.border = '2px solid rgba(0, 128, 255, 0.9)';
overlay.style.zIndex = '9999';
overlay.style.display = 'none';
overlay.style.boxSizing = 'border-box';
overlay.style.pointerEvents = 'auto';


// =========================
// 토스트 UI 생성
// =========================
const toast = document.createElement('div');
toast.style.position = 'fixed';
toast.style.bottom = '30px';
toast.style.left = '50%';
toast.style.transform = 'translateX(-50%)';
toast.style.background = '#111';
toast.style.color = '#fff';
toast.style.padding = '10px 16px';
toast.style.borderRadius = '6px';
toast.style.fontSize = '14px';
toast.style.opacity = '0';
toast.style.transition = 'opacity 0.3s';
toast.style.zIndex = '10000';
toast.innerText = 'Copied!';
toast.classList.add('toastCopyElement');

function showToast(message = 'Copied!') {
    toast.innerText = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1200);
}

// =========================
// 토글 버튼 생성
// =========================
function initElementCopyBtn () {
    container = document.querySelector(CONTAINER_SELECTOR);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    document.body.appendChild(toast);


    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = 'Copy Mode: OFF';
    document.body.appendChild(toggleBtn);
    toggleBtn.classList.add('tobblecopyBtn');
    toggleBtn.addEventListener('click', () => {
        isActive = !isActive;
        toggleBtn.innerText = `Copy Mode: ${isActive ? 'ON' : 'OFF'}`;
        if (!isActive) {
            document.body.classList.remove('element-copy-on');
            overlay.style.display = 'none';
            currentTarget = null;
        } else {
            document.body.classList.add('element-copy-on');
        }
    });
}


// =========================
// 유틸 함수
// =========================

function isInException(el) {
    return el.closest(EXCEPTION_SELECTOR);
}

function getValidTarget(el) {
    if (!isActive) return null;
    if (!container.contains(el)) return null;

    const matched = el.closest(TARGET_SELECTORS);
    if (!matched) return null;
    if (isInException(matched)) return null;

    return matched;
}

function updateOverlay(el) {
    const rect = el.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.display = 'block';
}

async function copyHTML(el) {
    try {
        await navigator.clipboard.writeText(el.outerHTML);
        showToast('HTML copied!');
    } catch (err) {
        showToast('Copy failed');
    }
}

function deactivate() {
    isActive = false;
    overlay.style.display = 'none';
    currentTarget = null;
    toggleBtn.innerText = 'Copy Mode: OFF';
}

// =========================
// 이벤트 처리
// =========================
function initElementEvent(){
    if (container) {
        overlay.addEventListener('click', (e) => {
            if (!isActive || !currentTarget) return;

            e.preventDefault();
            e.stopPropagation();

            copyHTML(currentTarget);
        });

        container.addEventListener('mousemove', (e) => {
            if (!isActive) return;

            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el) {
            overlay.style.display = 'none';
            currentTarget = null;
            return;
            }

            // container 내부에서 대상 셀렉터 검색
            const targetNodes = Array.from(container.querySelectorAll(TARGET_SELECTORS));
            const matched = targetNodes.find(node => node === el || node.contains(el));

            if (!matched || isInException(matched)) {
            overlay.style.display = 'none';
            currentTarget = null;
            return;
            }

            if (currentTarget !== matched) {
            currentTarget = matched;
            updateOverlay(matched);
            }
        });


        document.addEventListener('mousedown', (e) => {
            if (!isActive || !currentTarget) return;
            e.preventDefault();
            e.stopPropagation();

            copyHTML(currentTarget);
        });
    }
}


// ESC 키로 종료
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        deactivate();
    }
});