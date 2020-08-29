import HTMLElementPlus from './deps/html-element-plus/html-element-plus';
import html from './deps/html-element-plus/noop';
import slides from './modules/slides';
import WindowUtils from './modules/window';
import * as styles from './modules/styles';

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
					<div ref="tnsInner" class="tns-inner">
						<div
							ref="tnsSlider"
							class="tns-slider tns-carousel tns-subpixel tns-calc tns-horizontal"
						>
							<slot name="tns-slides"></slot>
						</div>
					</div>
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
					${styles.autoWidth()}
					${styles.slider()}
					${styles.noCalc()}
					${styles.lazyLoad()}
					${styles.horizontal()}
					${styles.utils()}
					${styles.fade()}
					${styles.viewport()}
					${styles.responsive()}
				</style>
			`;
		}

		static get styles() {
			if (this.__styleEl) return this.__styleEl;
			this.__styleEl = document.createElement('template');
			this.__styleEl.innerHTML = this.styleHTML;
			return this.__styleEl;
		}

		static get getSlideCountNew() {
			const value =
				!this.getAttribute('mode') === 'carousel'
					? this.slideCount + this.cloneCount
					: this.slideCount + this.cloneCount * 2;
			console.log(value);
			return value;
		}

		get stylesContent() {
			if (window.ShadyCSS)
				window.ShadyCSS.prepareTemplate(
					this.constructor.styles,
					this.tagName.toLocaleLowerCase()
				);
			return document.importNode(this.constructor.styles.content, true);
		}

		static set idAttr(id) {
			this.refs.tnsOuter.setAttribute('id', id + '-ow');
			this.refs.tnsMain.setAttribute('id', id + '-mw');
			this.refs.tnsInner.setAttribute('id', id + '-iw');
			this.refs.tnsSlider.setAttribute('id', id);
		}

		static set className(classes) {}

		connectedCallback() {
			// const id = this.getAttribute('id');
			this.idAttr = this.id;
			// this.classNames = this.getAttribute('class');
			// this.slider = this.__getFromShadowRoot(this, 'tnsSlider');
			window.requestAnimationFrame(() => this.appendSlides(this.id));
		}

		/* 
		? Should apply all the attributes from the defaults to the element if the element doesn't have them already
			Object.entries(this.__attributesMap).forEach(([key, value]) => {
				if (!this.hasAttribute(key)) this.setAttribute(key, value);
			});
		*/

		appendSlides(id) {
			const base = document.getElementById(id),
				slideCountNew = this.getSlideCountNew,
				slider = this.refs.tnsSlider.querySelector('slot'),
				slides = base.parentElement.querySelectorAll('#' + id + ' > *');

			// TODO: Figure out why the --slide-left variable is not working
			slides.forEach((el, index) => {
				el.style.setProperty('--slide-index', index);
				// ? slideCountNew is returning undefined
				el.style.setProperty(
					'--slide-left',
					`calc(var(--slide-index) * 100% + ${slideCountNew})`
				);
			});

			slider.append(...slides);
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
				this.slideCountNew = this.getSlideCountNew;
			}
			if (this.getAttribute('loop') === true) {
				this.cloneSlides();
			}
		}

		cloneSlides() {
			const fragmentBefore = document.createDocumentFragment(),
				fragmentAfter = document.createDocumentFragment(),
				slides = this.refs.tnsInner.querySelectorAll(
					'[ref="tnsMain"] > *'
				);

			for (var j = slideCount; j--; ) {
				var num = j % slideCount;
			}
		}

		static get cloneCount() {}

		static get slideCount() {
			return this.constructor.refs.tnsInner.querySelectorAll(
				'[refs="tnsMain"] > *'
			).length;
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
