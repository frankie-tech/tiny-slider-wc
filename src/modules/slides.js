import HTMLElementPlus from '../deps/html-element-plus/html-element-plus';
import html from '../deps/html-element-plus/noop';

export default class extends HTMLElementPlus {
	// possibility for a slotted slide container
	constructor() {
		super();
	}

	static get templateHTML() {
		return html`
		<div slot="tns-slides></div>
		`;
	}
}
