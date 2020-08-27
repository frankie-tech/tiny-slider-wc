const tnsTemplate = (id, className) => `
<div class="tns-outer" id="${id}-ow">
	<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0">
		<slot name="tns-controls"></slot>
	</div>
	<div class="tns-nav" aria-label="Carousel Pagination">
		<slot name="tns-pages"></slot>
	</div>
	<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">
		<slot name="tns-pagenumbers"></slot>
	</div>
	<div class="tns-ovh" id="${id}-mw">
		<div className="tns-inner" id="${id}-iw">
			<div class="${className} tns-slider" id="${id}">
				<slot name="tns-slides"></slot>
			</div>
		</div>
	</div>
</div>`;

customElements.define(
	'tiny-slider',
	class extends HTMLElement {
		constructor() {
			super();
			this.refs = new Proxy(
				{},
				{
					get: this.__getFromShadowRoot.bind(this),
				}
			);

			this.__attributesMap = {};

			this.__waitingOnAttr = (this.constructor.observerAttributes
				? this.constructor.observedAttributes
				: []
			).filter(name => {
				if (!this.attributes.getNamedItem(name)) {
					this.__attributesMap[
						name
					] = this.constructor.defaultAttributeValue(name);
				}
				return !!this.attributes.getNamedItem(name);
			});

			if (this.__waitingOnAttr.length === 0) {
				this.allAttributesChangedCallback(this.__attributesMap);
			}

			this.attatchShadow({ mode: 'open' });
			this.shadowRoot.appendChild(tnsTemplate.content.cloneNode(true));
		}

		attributeChangedCallback(attr, oldValue, newValue) {
			this.__attributesMap[
				attr
			] = this.contructor.parseAttributeValue.call(this, attr, newValue);

			if (this.__waitingOnAttr.length) {
				const index = this.__waitingOnAttr.indexOf(attr);
				if (index !== -1) {
					this.__waitingOnAttr.splice(index, 1);
				}
			}
		}
	}
);
