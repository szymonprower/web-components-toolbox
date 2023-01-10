// @ts-check
import { Intersection } from '../../prototypes/Intersection.js'

/* global self */

/**
 * Lazy load Iframe
 * Example at: /src/es/components/atoms/iframe/Iframe.html
 *
 * @export
 * @class Iframe
 * @type {CustomElementConstructor}
 * @attribute {
 *  {number} [timeout=200]
 * }
 * @example {
    <a-iframe>
      <template>
        <iframe width='853' height='480' src='https://my.matterport.com/show/?m=YSNEkt4DstH&brand=0' frameborder='0' allowfullscreen allow='vr'></iframe>
      </template>
    </a-iframe>
 * }
 */
export default class Iframe extends Intersection() {
  constructor (options = {}, ...args) {
    super(Object.assign(options, { intersectionObserverInit: {} }), ...args)
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (!this.intersecting) this.intersecting = this.shouldComponentRenderHTML() ? this.renderHTML() : () => console.warn('No required template tag found within this component: ', this)
  }

  intersectionCallback (entries, observer) {
    if ((this.isIntersecting = entries && entries[0] && entries[0].isIntersecting)) {
      // @ts-ignore
      this.intersecting()
      this.intersectionObserveStop()
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }
  

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return this.template
  }


  /**
   * renders the a-Iframe css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        line-height: 0;
      }
      :host, :host > iframe {
        aspect-ratio: ${this.iframe.getAttribute('width')} / ${this.iframe.getAttribute('height')};
        width: 100%;
        height: auto;
        ${this.hasAttribute('background-color')
          ? `background-color: ${this.getAttribute('background-color')};`
          : ''
        }
      }
    `
  }


  /**
   * renders the html
   *
   * @return {()=>void} final render function with a default of 200ms timeout
   */
  renderHTML () {
    // prefetch or pre connect o the iframes src
    const link = document.createElement('link')
    link.setAttribute('rel', 'prefetch')
    link.setAttribute('href', this.iframe.getAttribute('src'))
    document.head.appendChild(link)
    const templateContent = this.template.content
    this.template.remove()
    return () => setTimeout(() => {
      this.html = templateContent
    }, this.getAttribute('timeout') && this.getAttribute('timeout') !== null
      ? Number(this.getAttribute('timeout'))
      : 200)
  }

  get template () {
    return this.root.querySelector('template')
  }

  get iframe () {
    return this.template && this.template.content.querySelector('iframe') || this.root.querySelector('iframe')
  }
}