## 폴더 구조 및 설명

#### /guide

```
├── /dev/ # 개발단계 파일이므로 어떠한 경우도 참조하지 않는다.
└── /guide.html # 참조하여 작성한다. ( 디렉토리 구조, 호환성, 주요 제한사항 등 )
```

#### /src

```
/styles
├── /abstacts     # mixins, utils, variables 등 추상화 소스
├── /base         # BC에서 제공된 기본 스타일이 작성되어있고 절대 수정하지 않는다.
├── /components   # base 정의된 별도 컴포넌트 오버라이딩
├── /layout       # header, footer, 와이어프레임 등 공통 영역 정의
├── /pages        # .warpper 이하 컨텐츠 영역 스타일 정의
└── common.scss   # 엔트리 파일
```

#### /static

```
/static
└── /styles       # 번들링된 css 파일이 위치하는 디렉토리 (코파일럿 소스변경 요청에서 제외)
```

## 지원 브라우저

- Chrome 78+ 으로 :has, :is, :where 등 78 에서 지원하지 않는 최신 CSS 기능은 사용하지 않는다.

## 레이아웃 규칙

- 반응형으로 작성되어야 하며 breakpoint 는 3가지로 구분한다. (mobile, tablet, desktop)
- desktop 1200px 이상, tablet 768px 이상, mobile 767px 이하로 구분한다.
- 기준 해상도 보다 큰 화면에서는 desktop 스타일이 중앙 고정하고 좌우 여백으로 처리한다.
- 단 중요한 키비주얼은 좌우 꽉찬 크기로 작성될 수 있다.
- tablet 의 header, footer 는 mobile 과 동일하게 작성한다.

## 코드 컨벤션

#### 마크업

- 접근성을 준수한다.
- id는 꼭 필요한 곳에만 한정적으로 사용한다.
- 마크업 간소화를 위해 li 상위에 구별할 수 있는 클래스가 있다면 별도의 클래스는 지정하지 않는다.

#### 주석

**인라인 주석 (`//`)**

- 객체 내부의 개별 속성 설명
- 코드 블록 내부의 세부 설명
- 변수나 상수의 간단한 설명
- 로직의 단계별 설명

#### Stylesheet

- /static/styles/base.css 의 정의된 스타일을 기반으로 작성한다.
- 위 base.css 의 스타일을 오버라이딩한 이 프로젝트 전용 base 는 /src/styles/base 이므로 같이 참조하여 작성한다.
- 클래스명의 하이픈(-) 은 3개 까지 제한한다.
- 불필요한 class 속성 최소화 (ul, li 등 시멘틱 태그 활용)
- &::before, &::after, &:hover 등 nested 보다 상위에서 작성한다.
- .page 처럼 고유 클래스가 존재하면 더블 클래스로 페이지를 구분하고 그 안에서 스타일을 작성한다. 그 안 스타일 네이밍에 추가로 더블 클래스 네이밍이 들어가지 않도록 한다. 필요 이상으로 클래스명이 길어지는 것을 지양한다.
- \_ 로 시작하는 클래스를 class 속성 가장 앞에 작성하여 스타일의 우선순위를 높인다.
- 반복적인 간격은 margin 보단 부모 flex 후 gap 속성을 활용하여 작성한다.

```
// base.css 및 /src/styles/base
- 컬러 적용 시 1차적으로 :root 의 -- 로 정의된 변수를 활용
- 타이틀 성격의 마크업을 작성할 때 _.font-headline-*, _font-title-* 클래스를 활용하여 폰트 스타일을 적용한다.
- _.font-body-*, _.font-caption-* 는 인라인 정의를 지양하고 font-token() 믹스인을 활용하여 스타일을 적용한다.
- raidus 는 :root 의 --radius-* 변수를 활용하여 적용한다.
- 간격은 --space-* 변수를 활용하여 적용한다.
- box-shadow 는 .shadow-* 클래스를 활용하여 적용한다.
- 폼 요소는 guide/controls.html 정리되어있으니 참고하여 작성한다.
- 모바일 탭은 ._segment 클래스를 활용하여 스타일을 적용한다.
- 구분선은 ._divider-* 클래스를 활용하여 스타일을 적용한다.
- 스탭 ui는 ._step-* 클래스를 활용하여 스타일을 적용한다.
- 벳지 ui는 ._badge-* 클래스를 활용하여 스타일을 적용한다.
- 테이블은 ._table-* 클래스를 활용하여 스타일을 적용한다.
- 버튼은 ._btn-* 클래스를 활용하여 스타일을 적용하고 ._btn-wrap 클래스로 버튼 그룹핑하여 스타일을 적용한다.
```

#### JavaScript

- ?. 연산자 사용은 지양한다

**내부 핸들러 (컴포넌트 내부에서 정의)**

- `handle + 동작`: `handleClick`, `handleSubmit`
- `handle + 대상 + 동작`: `handleBtnClick`, `handleModalClose`

**외부 콜백 (props로 전달받는 함수)**

- `on + 동작`: `onClick`, `onSubmit`
- `on + 대상 + 동작`: `onOpenChange`, `onModalVisibilityChange`
