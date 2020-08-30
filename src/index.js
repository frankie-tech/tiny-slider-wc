import HTMLElementPlus from './deps/html-element-plus/html-element-plus';
import html from './deps/html-element-plus/noop';
import slides from './modules/slides';
import WindowUtils from './modules/window';
import { coreStyles } from './modules/styles';

customElements.define(
	'tiny-slider',
	class extends HTMLElementPlus {
		static defaultAttributeValue(name) {
			const defaults = {
				mode: 'carousel',
				axis: 'horizontal',
				'animate-in': 'tns-fadeIn',
				'animate-out': 'tns-fadeOut',
				'animate-normal': 'tns-normal',
				'auto-height': false,
				loop: true,
				center: false,
				lazyload: false,
				fixedWidth: true,
				'edge-padding': 0,
			};
			return defaults[name];
		}

		static get observedAttributes() {
			return [
				'mode',
				'axis',
				'animate-in',
				'animate-out',
				'animate-normal',
				'auto-height',
				'loop',
				'center',
				'lazyload',
				'fixed-width',
			];
		}

		constructor() {
			super();
			this.id = this.getAttribute('id') || '';
			this.className = this.getAttribute('class') || '';
			this.containerParent = this.parentNode;
			// const entries = Object.entries(this);
		}

		static get template() {
			if (this.__templateEl) return this.__templateEl;
			this.__templateEl = document.createElement('template');
			this.__templateEl.innerHTML = this.templateHTML;
			return this.__templateEl;
		}

		static get templateHTML() {
			return html` <div ref="tnsOuter">
				<div
					ref="tnsControls"
					aria-label="Carousel Navigation"
					tabindex="0"
				>
					<slot name="tns-controls"></slot>
				</div>
				<div ref="tnsNav" aria-label="Carousel Pagination">
					<slot name="tns-pages"></slot>
				</div>
				<div
					ref="tnsLiveregion"
					class="tns-visually-hidden"
					aria-live="polite"
					aria-atomic="true"
				>
					<slot name="tns-pagenumbers"></slot>
				</div>
				<div ref="tnsMain" class="tns-ovh">
					<slot
						ref="tnsInner"
						class="tns-inner"
						name="tns-inner"
					></slot>
				</div>
			</div>`;
		}

		static get styleHTML() {
			return html`
				<style>
					tiny-slider {
						--slide-index: 0;
						--slide-left: calc(var(--slide-index) * 100%);
					}
					tiny-slider [ref="tnsInner"] {
						display: block;
					}
					${coreStyles()}
				</style>
			`;
		}

		static get styles() {
			if (this.__styleEl) return this.__styleEl;
			this.__styleEl = document.createElement('template');
			this.__styleEl.innerHTML = this.styleHTML;
			return this.__styleEl;
		}

		get stylesContent() {
			if (window.ShadyCSS)
				window.ShadyCSS.prepareTemplate(
					this.constructor.styles,
					this.tagName.toLocaleLowerCase()
				);
			return document.importNode(this.constructor.styles.content, true);
		}

		/**
		 * @param {string} id
		 */
		static set idAttr(id) {
			this.refs.tnsOuter.setAttribute('id', id + '-ow');
			this.refs.tnsMain.setAttribute('id', id + '-mw');
			this.refs.tnsInner.setAttribute('id', id + '-iw');
			// this.refs.tnsSlides.setAttribute('id', id);
		}

		connectedCallback() {
			// const id = this.getAttribute('id');
			this.idAttr = this.id;
			// this.classNames = this.getAttribute('class');
			// this.slider = this.__getFromShadowRoot(this, 'tnsSlider');
		}

		/* 
			? Should apply all the attributes from the defaults to the element if the element doesn't have them already
			Object.entries(this.__attributesMap).forEach(([key, value]) => {
				if (!this.hasAttribute(key)) this.setAttribute(key, value);
			});
		*/

		appendSlides(id) {
			const base = document.getElementById(id),
				container = base.firstElementChild,
				containerWidth = this.windowUtils.getClientWidth(container),
				slides = Array.from(container.children);
			// slideCountNew = slides.length;
			// console.log(containerWidth / slides.length);
			// console.log();
			container.classList.add(
				'tns-slides',
				'tns-carousel',
				'tns-subpixel',
				'tns-calc',
				'tns-horizontal'
			);

			// TODO: Set auto-width method? Probs unnecessary...
			const slideWidth = `calc(${containerWidth} / ${slides.length} * 1px)`;

			slides.forEach((el, index) => {
				console.log(el);
				el.classList.add('tns-item');
				el.style.setProperty('--slide-index', index);
				el.style.setProperty('width', slideWidth);
			});

			// slider.append(...slides);
		}

		// TODO: Figure out how to slide one slide at a time
		doContainerTransform(val) {
			const container = this.refs.tnsInner.assignedElements()[0];
			if (val == null) {
				val = this.windowUtils.getClientWidth(container) + 'px';
			}
			this.firstElementChild.style.setProperty(
				'transform',
				`translate3d(${val}, 0, 0)`
			);
		}

		attributeChangedCallback(attr, oldValue, newValue) {
			/*
			this.__attributesMap[
				attr
			] = this.contructor.parseAttributeValue.call(this, attr, newValue);
			
			if (this.__waitingOnAttr.length) {
				const index = this.__waitingOnAttr.indexOf(attr);
				if (index !== -1) {
					this.__waitingOnAttr.splice(index, 1);
				}
			}
			*/
		}

		allAttributesChangedCallback() {
			if (!this.shadowRoot) {
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.appendChild(this.stylesContent);
				this.shadowRoot.appendChild(this.templateContent);

				const windowOptions = {
					edgePadding: this.edgePadding,
					containerParent: this.containerParent,
				};

				this.windowUtils = new WindowUtils(windowOptions);
				// this.slideCountNew = this.getSlideCountNew;
				window.requestAnimationFrame(() => {
					this.appendSlides(this.id);
					this.doContainerTransform();
				});

				if (this.getAttribute('loop') === true) {
					this.cloneSlides();
				}
			}
		}

		cloneSlides() {
			const fragmentBefore = document.createDocumentFragment(),
				fragmentAfter = document.createDocumentFragment(),
				// prettier-ignore
				slides = this.refs.tnsInner.querySelectorAll('[ref="tnsMain"] > *');

			for (var j = slideCount; j--; ) {
				var num = j % slideCount;
			}
		}

		static get itemsMax() {
			/* copied directly from original tiny slider script
			// fixedWidth or autoWidth while viewportMax is not available
			if (autoWidth || (fixedWidth && !viewportMax)) {
			return slideCount - 1;
			// most cases
			} else {
			var str = fixedWidth ? 'fixedWidth' : 'items',
				arr = [];
			
			if (fixedWidth || options[str] < slideCount) { arr.push(options[str]); }
			
			if (responsive) {
				for (var bp in responsive) {
				var tem = responsive[bp][str];
				if (tem && (fixedWidth || tem < slideCount)) { arr.push(tem); }
				}
			}
			
			if (!arr.length) { arr.push(0); }
			
			return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
			}
			*/
			return this.slideCount - 1;
		}

		/*
		static get currentSlide() {

		}
		*/
	}
);

// customElements.define('tns-slide', slides);
