// @ts-check
import BaseCarousel from '../../thirdParty/macroCarousel/MacroCarousel.js'

/* global self */

/**
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */

// @ts-ignore
export default class Carousel extends BaseCarousel {
  constructor (...args) {
    super(...args)
  }

  connectedCallback () {
    super.connectedCallback()
    this.renderCustomCSS()
  }

  disconnectedCallback () {
    super.disconnectedCallback()  
  }

  
  /**
   * renders the m-Details css
   *
   * @return {void}
   */
  renderCustomCSS () {
    
    this.css = /* css */` 
      :host> macro-carousel >  macro-carousel-nav-button {
        top: 40% !important;
      }
      :host > macro-carousel > .container {
        display: flex;
        align-items: stretch;
        color: var(--color, red);
        font-size: var(--font-size, 1em);
        width:100%;
        justify-content: flex-end;
      } 
      :host > macro-carousel > .container .text {
        background-color: var(--text-background-color, red);
      }
      :host > macro-carousel > div > .text > p {
        padding:var(--text-padding, 0); 
      }
      :host .macro-carousel-previous, .macro-carousel-next{
        padding:2em;
      }
      @media only screen and (max-width: _max-width_) {
        :host> macro-carousel >  macro-carousel-nav-button {
          top:35% !important;
        }
        :host .macro-carousel-previous, .macro-carousel-next{
          padding:5vw;
        } 
      }
    `

    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'carousel-default-':
        return this.fetchCSS([{
          path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles, false)
    }
  }



  

  
}
