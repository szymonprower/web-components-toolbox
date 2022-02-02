// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/* global location */
/* global self */

/**
 * Defines a body body for content and maps variables to global tags
 * Example at: /src/es/components/pages/General.html
 * As an organism, this component shall hold molecules and/or atoms
 *
 * @export
 * @class Body
 * @type {CustomElementConstructor}
 * @css {
 *  NOTE: grid-area: body;
 *  --content-spacing [40px]
 *  --content-width [80%]
 *  --h1-color [--color, black]
 *  --font-family-secondary
 * }
 */
export default class Body extends Shadow() {
  constructor (...args) {
    super(...args)

    this.clickAnchorEventListener = event => {
      let element = null
      if (event && event.detail && event.detail.selector && (element = this.root.querySelector(event.detail.selector))) element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    document.body.addEventListener(this.getAttribute('click-anchor') || 'click-anchor', this.clickAnchorEventListener)
    if (location.hash) {
      self.addEventListener('load', event => this.clickAnchorEventListener({ detail: { selector: location.hash } }), { once: true })
      document.body.addEventListener(this.getAttribute('wc-config-load') || 'wc-config-load', event => setTimeout(() => this.clickAnchorEventListener({ detail: { selector: location.hash } }), 1000), { once: true })
    }
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('click-anchor') || 'click-anchor', this.clickAnchorEventListener)
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
    return !this.root.querySelector('main')
  }

  /**
   * renders the o-highlight-list css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        background-color: var(--background-color, white);
        grid-area: body;
      }
      :host > main {
        padding: var(--main-padding, 0);
      }
      :host > main > * {
        margin: var(--content-spacing, unset) auto;  /* Warning! Keep horizontal margin at auto, otherwise the content width + margin may overflow into the scroll bar */
        width: var(--content-width, 80%);
      }
      :host > main > *:not(style) {
        display: var(--any-display, block);
      }
      :host > main > span, :host > main > div, :host > main > p, :host > main > a, :host > main > article, :host > main > ul, :host > main > ol, :host > main > section, :host > main > h1, :host > main > h2, :host > main > h3, :host > main > h4, :host > main > h5, :host > main > h6 {
        width: var(--content-width-not-web-component, 80%);
      }
      :host(.content-max-width) > main > *:not(.ignore-max-width), :host> main > *.content-max-width {
        max-width: var(--content-max-width, none);
      }
      :host(.content-max-width-two) > main > *:not(.ignore-max-width), :host > main > *.content-max-width-two {
        max-width: var(--content-max-width-two, none);
      }
      :host > main > wc-a-button {
        width: var(--content-width-not-web-component, 80%);
      }
      @media only screen and (max-width: _max-width_) {
        :host > main {
          padding: var(--main-padding-mobile, var(--main-padding, 0));
        }
        :host > main > * {
          margin: var(--content-spacing-mobile, var(--content-spacing, unset)) auto; /* Warning! Keep horizontal margin at auto, otherwise the content width + margin may overflow into the scroll bar */
          width: var(--content-width-mobile, var(--content-width, 90%));
        }
        :host > main > span, :host > main > div, :host > main > p, :host > main > a, :host > main > article, :host > main > ul, :host > main > ol, :host > main > section, :host > main > h1, :host > main > h2, :host > main > h3, :host > main > h4, :host > main > h5, :host > main > h6 {
          width: var(--content-width-not-web-component-mobile, var(--content-width-not-web-component, var(--content-width-mobile, var(--content-width, 90%))));
        }
        :host > main > wc-a-button {
          width: var(--content-width-not-web-component-mobile, var(--content-width-not-web-component, var(--content-width-mobile, var(--content-width, 90%))));
        }
      }
    `
    this.fetchCSS(['../../../css/reset.css', '../../../css/style.css'])
  }

  /**
   * renders the a-link html
   *
   * @return {void}
   */
  renderHTML () {
    const main = this.root.appendChild(document.createElement('main'))
    Array.from(this.root.children).forEach(node => {
      if (node === main || node.getAttribute('slot') || node.nodeName === 'STYLE') return false
      main.appendChild(node)
    })
  }
}
