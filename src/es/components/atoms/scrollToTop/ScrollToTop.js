// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/**
 * @export
 * @class ScrollToTop
 * @type {CustomElementConstructor}
 */
export default class ScrollToTop extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.button = this.root.children[0];
    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.button.addEventListener('click', this.handleClick);
    self.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
  }

  disconnectedCallback() {
    self.removeEventListener("scroll", this.handleScroll);
    this.button.removeEventListener('click', this.handleClick);
  }
  /**
   * Handles scroll event
   */
  handleScroll() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop >= 10) {
      this.button.style.display = 'block';
      this.button.style.opacity = 1;
    } else {
      this.button.style.display = 'none';
    }
  }

  /**
   * Handles click event
   */
  handleClick() {
    self.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * Renders the css
   */
  renderCSS() {
    this.css = /* css */`
        :host {
            z-index: var(--scroll-to-top-host-z-index, 1000); 
        }
        `;
    return this.fetchTemplate();
  }

  /**
   * Fetches the template
   */
  fetchTemplate() {
    switch (this.getAttribute('namespace')) {
      case 'scroll-to-top-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        },]);
    }
  }

}
