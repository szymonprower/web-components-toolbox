// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/**
 * As a molecule, this component shall hold Atoms
 *
 * @export
 * @class Product
 * @type {CustomElementConstructor}
 */
export default class Product extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.answerEventNameListener = event => {
      console.log('update product', event.detail.products.length, this.quantity)
      this.quantity = (Number(this.quantity.innerText) + event.detail.products.length).toString()
    }
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
  }

  shouldRenderHTML () {
    return !this.productImage
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the m-Teaser css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
    :host {
        --img-max-height:10vw;
        --img-max-width:60%; 
        align-items:flex-start;
        background-color:var(--m-white);
        border-left:.5em solid transparent;
        border-radius:8px;
        border-right:.5em solid transparent;
        box-shadow:0px 0px 12px 0px rgba(51, 51, 51, 0.10);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        margin:0 0 var(--content-spacing) 0;
        padding:0 0 var(--content-spacing) 0;
        
        
      }
      :host .basket-utils {
        align-items: center;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        padding:calc(var(--content-spacing) / 2); 
        width:100%;
      }
      :host .quantity {
        align-items: center;
        border-radius: 4px;
        border: 2px solid  #333;
        display: flex;
        flex-shrink: 0;
        font-size: 14px;
        height: 24px;
        justify-content: center;
        padding: 1px;
        width: 24px;
      }
      :host .product-image {
        padding:0 var(--content-spacing);
        align-self:center;
      }
      :host .product-price{
        display:block;
        font-size:1.25em;
        font-weight: bold;
      }
      :host .product-name{
        display:block;
        font-size:0.85em;
        font-weight: bold;
      }
      :host .product-data {
        min-height:5em;
      }
      :host .footer-label-data {
        display:flex;
        flex-direction: column;
        align-items: flex-start;
      }
      :host .unit-price {
        overflow: hidden;
        color: var(--unit-price-color, black);
        text-overflow: ellipsis;
        font-size: 0.75em;
        line-height: 1.5em;
      }
      :host .footer-label-data > img{
        height:1.45em;

      }
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: false
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'product-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../atoms/button/Button.js`,
        name: 'a-button'
      }
    ])

    this.html = /* html */ `
      ${this.createBasketUtilsElement(this.productData.tracking_information)}
      ${this.createProductImageElement(this.productData.image.original, this.productData.accessible_information_text)}
      ${this.createProductDataElement(this.productData.price, this.productData.name)}
      ${this.createFooterLabels(this.productData.unit_price, this.productData.isWeighable)}
    `
    this.quantity = '0'
  }

  get quantity(){
    return this.root.querySelector('.quantity') 
  }

  set quantity(quantity){
    if(this.quantity) this.quantity.innerText = quantity
  }

  /**
   * The function creates a HTML element for a basket utility with buttons to add and remove items.
   * @param {string} productInfo - The `productInfo` parameter is a variable that contains information about a
   * product. It could include details such as the product name, price, image, and any other relevant
   * information.
   * @returns {string} an HTML element as a string. The returned element is a div with the class "basket-utils"
   * containing two buttons and a div with the class "quantity". The buttons have different request event
   * names and tags based on the provided productInfo.
   */
  createBasketUtilsElement (productInfo) {
    return /* html */ `
      <div class="basket-utils">
        <a-button namespace="button-tertiary-" request-event-name="add-basket" tag='${productInfo}'>+</a-button>
        <div class="quantity"></div>
        <a-button namespace="button-tertiary-" request-event-name="remove-basket" tag='${productInfo}'>-</a-button>
      </div>`
  }

  /**
   * The function creates a product image element with the specified image source and alt text.
   * @param {string} imageSrc - The image source URL or path. This is the location of the image file that will
   * be displayed.
   * @param {string} alt - The "alt" parameter is used to specify the alternative text for the image. This text
   * is displayed if the image cannot be loaded or if the user is using a screen reader. It should
   * provide a concise description of the image.
   * @returns an HTML string that represents a product image element.
   */
  createProductImageElement (imageSrc, alt) {
    return /* html */ `
      <div class="product-image">
        <a-picture namespace="product-default-" picture-load defaultSource='${imageSrc}' alt='${alt}'></a-picture>
      </div>`
  }

  /**
 * The function creates an HTML element with price and name data for a product.
 * @param {string} price - The price parameter is the price of the product. It could be a number or a string
 * representing the price value.
 * @param {string} name - The name parameter is a string that represents the name of the product.
 * @returns an HTML string that represents a product data element. It includes the price and name of
 * the product within span elements.
 */
  createProductDataElement (price, name) {
    return /* html */ `
      <div class="product-data">
        <span class="product-price">${price}</span>
        <span class="product-name">${name}</span>
      <div>
    `
  }

  createFooterLabels (unitPrice, waightable) {
    if (!waightable) return

    return /* html */ `
      <div class="footer-label-data">
        <span>${unitPrice}</span>
        ${this.createFooterIcons()}
      </div>`
  }

  /**
   * The function creates a footer icon by returning an HTML image tag.
   * @returns an HTML string that includes an image tag with the source attribute set to
   * "../../src/img/migrospro/label-balance.svg" and an empty alt attribute.
   */
  createFooterIcons () {
    return `<img src="../../src/img/migrospro/label-balance.svg" alt="" />`
  }

  /**
   * The function retrieves and parses the value of the 'data' attribute of an element.
   * @returns the parsed JSON data from the 'data' attribute.
   */
  get productData () {
    const pd = this.getAttribute('data') || ''
    return JSON.parse(pd)
  }
}
