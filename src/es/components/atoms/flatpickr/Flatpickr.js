// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/* global self */

/**
 * Creates a Datepicker
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Flatpickr extends Shadow() {
  constructor (options = {}, ...args) {
    // @ts-ignore
    super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options, mode: 'false' }, ...args)

    this.label = this.getAttribute('label') || 'Datum auswählen → 📅'
    this.gotCleared = false
    this.dateStrSeparator = ' — '

    this.resetEventListener = async event => {
      let dateReset = event.detail.dateReset
      if (this.getAttribute('reset-detail-property-name')) {
        dateReset = await this.getAttribute('reset-detail-property-name').split(':').reduce(async (accumulator, propertyName) => {
          // @ts-ignore
          propertyName = propertyName.replace(/-([a-z]{1})/g, (match, p1) => p1.toUpperCase())
          if (accumulator instanceof Promise) accumulator = await accumulator
          if (!accumulator) return false // error handling, in case the await on fetch does not resolve
          if (accumulator[propertyName]) return accumulator[propertyName]
          if (Array.isArray(accumulator)) return accumulator.map(obj => obj[propertyName])
          return false // error handling, in case the await on fetch does not resolve
        }, event.detail)
      }
      if (dateReset) {
        this.gotCleared = true
        if (this.flatpickrInstance) this.flatpickrInstance.clear()
        this.labelNode.textContent = this.label
      }
    }

    this.setDateEventListener = event => {
      this.labelNode.textContent = event.detail.dateStr || this.label
      if (event.detail.defaultDate) this.flatpickrInstance.setDate(event.detail.defaultDate)
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    if (this.getAttribute('set-date-event-name')) document.body.addEventListener(this.getAttribute('set-date-event-name'), this.setDateEventListener)
    if (this.getAttribute('reset-event-name')) document.body.addEventListener(this.getAttribute('reset-event-name'), this.resetEventListener)
    Promise.all(showPromises).then(() => (this.hidden = false))
  }

  disconnectedCallback () {
    if (this.getAttribute('set-date-event-name')) document.body.removeEventListener(this.getAttribute('set-date-event-name'), this.setDateEventListener)
    if (this.getAttribute('reset-event-name')) document.body.removeEventListener(this.getAttribute('reset-event-name'), this.resetEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector('style[_css]')
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.querySelector('script')
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host, host * {
        cursor: var(--cursor, pointer);
      }
    `
    // TODO: https://npmcdn.com/flatpickr@4.6.13/dist/themes/material_orange.css
    this.setCss(/* css */`
      .flatpickr-day.selected,
      .flatpickr-day.startRange,
      .flatpickr-day.endRange,
      .flatpickr-day.selected.inRange,
      .flatpickr-day.startRange.inRange,
      .flatpickr-day.endRange.inRange,
      .flatpickr-day.selected:focus,
      .flatpickr-day.startRange:focus,
      .flatpickr-day.endRange:focus,
      .flatpickr-day.selected:hover,
      .flatpickr-day.startRange:hover,
      .flatpickr-day.endRange:hover,
      .flatpickr-day.selected.prevMonthDay,
      .flatpickr-day.startRange.prevMonthDay,
      .flatpickr-day.endRange.prevMonthDay,
      .flatpickr-day.selected.nextMonthDay,
      .flatpickr-day.startRange.nextMonthDay,
      .flatpickr-day.endRange.nextMonthDay {
        background: var(--background, gray);
        box-shadow: var(--box-shadow, none);
        color: var(--color, black);
        border-color: var(--border-color, darkgray);
      }
      .flatpickr-day.startRange, .flatpickr-day.startRange:hover, .flatpickr-day.endRange, .flatpickr-day.endRange:hover {
        color: var(--color-start-end-range, var(--color, white)) !important;
      }
      .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)), .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)), .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)) {
        box-shadow: -10px 0 0 var(--box-shadow-color, gray);
      }
    `, undefined, undefined, undefined, this.style, false)
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'flatpickr-default-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false,
          styleNode: this.style,
          appendStyleNode: false
        }], false)
      default:
        return Promise.resolve()
    }
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderHTML () {
    return Promise.all([this.loadDependency(), this.getAttribute('get-date-option-event-name')
      ? new Promise(resolve => this.dispatchEvent(new CustomEvent(this.getAttribute('get-date-option-event-name'), {
        detail: {
          resolve,
          dateStrSeparator: this.dateStrSeparator
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })))
      : Promise.resolve({})]).then(([dependencies, options]) => {
      this.labelNode.textContent = options.dateStr || this.label
      delete options.dateStr
      this.flatpickrInstance = dependencies[0](this.labelNode, {
        ...options, // see all possible options: https://flatpickr.js.org/options/
        mode: 'range',
        dateFormat: 'd.m.Y',
        onChange: (selectedDates, dateStr, instance) => {
          if (this.getAttribute('request-event-name') && !this.gotCleared) {
            this.labelNode.textContent = dateStr = dateStr.replace(' to ', this.dateStrSeparator)
            this.dispatchEvent(new CustomEvent(this.getAttribute('request-event-name'), {
              detail: {
                origEvent: { selectedDates, dateStr, instance },
                tags: [dateStr],
                dateStrSeparator: this.dateStrSeparator,
                this: this,
                pushHistory: undefined
              },
              bubbles: true,
              cancelable: true,
              composed: true
            }))
          }
          this.gotCleared = false
        },
        onOpen: (selectedDates, dateStr, instance) => {
          this.gotCleared = false
        }
      })
      this.html = this.labelNode
      document.head.appendChild(this.style)
      // https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.css
    })
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<any>}
   */
  loadDependency () {
    // make it global to self so that other components can know when it has been loaded
    return this.flatpickr || (this.flatpickr = Promise.all([
      new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('async', '')
        script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/flatpickr')
        script.setAttribute('integrity', 'sha384-5JqMv4L/Xa0hfvtF06qboNdhvuYXUku9ZrhZh3bSk8VXF0A/RuSLHpLsSV9Zqhl6')
        script.setAttribute('crossorigin', 'anonymous')
        // @ts-ignore
        script.onload = () => self.flatpickr
        // @ts-ignore
          ? resolve(self.flatpickr)
          : reject(new Error('Flatpickr does not load into the global scope!'))
        this.html = script
      }),
      new Promise(resolve => {
        const style = document.createElement('link')
        style.setAttribute('rel', 'stylesheet')
        style.setAttribute('href', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.css')
        style.setAttribute('crossorigin', 'anonymous')
        // @ts-ignore
        style.onload = () => resolve()
        document.head.appendChild(style)
      })
    ]))
  }

  get style () {
    return this._style || (this._style = (() => {
      const style = document.createElement('style')
      style.setAttribute('_css', 'components/atoms/flatpickr/Flatpickr.js')
      return style
    })())
  }

  get labelNode () {
    return this._labelNode || (this._labelNode = document.createElement('div'))
  }
}
