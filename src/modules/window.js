export default class WindowUtil {
	constructor(options) {
		this.edgePadding = options.edgePadding || false;
		this.containerParent = options.containerParent;
	}

	// equal to https://github.com/ganlanyuan/tiny-slider/blob/master/src/tiny-slider.js#L533-L535
	static get windowWidth() {
		return (
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth
		);
	}

	// equal to https://github.com/ganlanyuan/tiny-slider/blob/master/src/tiny-slider.js#L541-L549
	getClientWidth(el) {
		if (el == null) return;
		const div = document.createElement('div');
		el.appendChild(div);
		const { right, left } = div.getBoundingClientRect();
		const width = right - left;

		div.remove();

		if (width) {
			return width;
		} else {
			this.getClientWidth(el.parentNode);
		}
		// this.clientWidth = width || this.setClientWidth(el.parentNode);
	}

	// equal to https://github.com/ganlanyuan/tiny-slider/blob/master/src/tiny-slider.js#L551-L554
	static get viewportWidth() {
		var gap = this.edgePadding ? this.edgePadding * 2 - this.gutter : 0;
		this.setClientWidth = this.containerParent;
		return this.clientWidth - gap;
	}
}
