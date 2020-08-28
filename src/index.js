import HTMLElementPlus from './deps/html-element-plus/html-element-plus';
import html from './deps/html-element-plus/noop';
import slides from './modules/slides';
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
			];
		}

		constructor() {
			super();
			this.id = this.getAttribute('id') || '';
			this.className = this.getAttribute('class') || '';
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
				<div ref="tnsMain">
					<div ref="tnsInner">
						<div ref="tnsSlider">
							<slot name="tns-slides"></slot>
						</div>
					</div>
				</div>
			</div>`;
		}

		static get styleHTML() {
			return `
				<style>
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
			`.trim();
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
			const slides = document
				.getElementById(id)
				.parentElement.querySelectorAll('#' + id + ' > *');
			slides.forEach(el => el.setAttribute('slot', 'tns-slides'));
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
				console.log(this.shadowRoot);
			}
		}
	}
);

// customElements.define('tns-slide', slides);
