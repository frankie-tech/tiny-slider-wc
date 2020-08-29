function t(str) {
	return str.trim();
}

const outer = () =>
	t(`
:host([ref='tnsOuter']) {
	padding: 0 !important;
}
:host([ref='tnsOuter']) [hidden] {
	display: none !important;
}
:host([ref='tnsOuter']) [aria-controls],
:host([ref='tnsOuter']) [data-action] {
	cursor: pointer;
}`);

const slider = () =>
	t(`
:host([ref="tnsSlider"]) {
	-webkit-transition: all 0s;
	-moz-transition: all 0s;
	transition: all 0s;
}
:host([ref="tnsSlider"]) > ::slotted([slot='tns-slides']) {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
:host([ref="tnsSlider"]) ::slotted([slot="tns-slides"]) {
	margin-left: var(--slide-left);
}
`);

const horizontal = () =>
	t(`
.tns-horizontal.tns-subpixel {
	white-space: nowrap;
}
.tns-horizontal.tns-subpixel > [slot='tns-slides'] {
	display: inline-block;
	vertical-align: top;
	white-space: normal;
}
.tns-horizontal.tns-no-subpixel:after {
	content: '';
	display: table;
	clear: both;
}
.tns-horizontal.tns-no-subpixel > [slot='tns-slides'] {
	float: left;
}
.tns-horizontal.tns-carousel.tns-no-subpixel > [slot='tns-slides'] {
	margin-right: -100%;
}`);

const noCalc = () =>
	t(`
.tns-no-calc {
	position: relative;
	left: 0;
}`);

const gallery = () =>
	t(`
.tns-gallery {
	position: relative;
	left: 0;
	min-height: 1px;
}
.tns-gallery > [slot='tns-slides'] {
	position: absolute;
	left: -100%;
	-webkit-transition: transform 0s, opacity 0s;
	-moz-transition: transform 0s, opacity 0s;
	transition: transform 0s, opacity 0s;
}
.tns-gallery > .tns-slide-active {
	position: relative;
	left: auto !important;
}
.tns-gallery > .tns-moving {
	-webkit-transition: all 0.25s;
	-moz-transition: all 0.25s;
	transition: all 0.25s;
}`);

const autoWidth = () =>
	t(`
.tns-autowidth {
	display: inline-block;
}`);

const lazyLoad = () =>
	t(`
.tns-lazy-img {
	-webkit-transition: opacity 0.6s;
	-moz-transition: opacity 0.6s;
	transition: opacity 0.6s;
	opacity: 0.6;
}
.tns-lazy-img.tns-complete {
	opacity: 1;
}`);

const utils = () =>
	t(`
.tns-ah {
	-webkit-transition: height 0s;
	-moz-transition: height 0s;
	transition: height 0s;
}
.tns-ovh {
	overflow: hidden;
}
.tns-visually-hidden {
	position: absolute;
	left: -10000em;
}
.tns-transparent {
	opacity: 0;
	visibility: hidden;
}`);

const fade = () =>
	t(`
.tns-fadeIn {
	opacity: 1;
	filter: alpha(opacity=100);
	z-index: 0;
}
.tns-normal,
.tns-fadeOut {
	opacity: 0;
	filter: alpha(opacity=0);
	z-index: -1;
}
`);

const viewport = () =>
	t(`
.tns-vpfix {
	white-space: nowrap;
}
.tns-vpfix > div,
.tns-vpfix > li {
	display: inline-block;
}
`);

const responsive = () =>
	t(`
.tns-t-subp2 {
	margin: 0 auto;
	width: 310px;
	position: relative;
	height: 10px;
	overflow: hidden;
}
.tns-t-ct {
	width: 2333.3333333%;
	width: -webkit-calc(100% * 70 / 3);
	width: -moz-calc(100% * 70 / 3);
	width: calc(100% * 70 / 3);
	position: absolute;
	right: 0;
}
.tns-t-ct:after {
	content: '';
	display: table;
	clear: both;
}
.tns-t-ct > div {
	width: 1.4285714%;
	width: -webkit-calc(100% / 70);
	width: -moz-calc(100% / 70);
	width: calc(100% / 70);
	height: 10px;
	float: left;
}`);

export {
	responsive,
	viewport,
	fade,
	utils,
	lazyLoad,
	autoWidth,
	gallery,
	noCalc,
	horizontal,
	slider,
	outer,
};
