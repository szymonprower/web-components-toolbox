// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

export default class Tabs extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    const tabs = this.root.querySelectorAll('.tab-navigation li')
    const sections = this.root.querySelectorAll('section.tab-content')

    // get parameter from url and set tab active
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')

    if (tabParam) {
      tabs.forEach((tab, index) => {
        tab.classList.remove('active')
        const dataTab = tab.getAttribute('data-tab') ? tab.getAttribute('data-tab').toString() : ''

        if (tabParam === dataTab) {
          tab.classList.add('active')
          sections[index].classList.add('active')
        }
      })
    }

    // set first tab active by default
    if (!tabParam) {
      tabs[0].classList.add('active')
      sections[0].classList.add('active')
    }

    // add click event to tabs
    tabs.forEach((tab, index) => {
      const anchorTag = tab.querySelector('a')

      if (!anchorTag) {
        tab.addEventListener('click', () => {
          // add parameter to url for active tab
          const urlParams = new URLSearchParams(window.location.search)
          const tabParam = tab.getAttribute('data-tab') ? tab.getAttribute('data-tab').toString() : ''
          urlParams.set('tab', tabParam)
          window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)

          tabs.forEach((tab) => {
            tab.classList.remove('active')
          })

          sections.forEach((section) => {
            section.classList.remove('active')
          })

          tab.classList.add('active')
          sections[index].classList.add('active')
        })
      }
    })
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    const tabs = this.root.querySelectorAll('.tab-navigation li')
    const activeNavigationTab = this.root.querySelector('.tab-navigation li.active')

    tabs.forEach(tab => {
      if (tab.classList.contains('active')) {
        tab.click() // set initial tab
      }
    })

    if (this.hasAttribute("scroll-to-view")){
      activeNavigationTab.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    } 
    
  }

  shouldRenderCSS () {
    return !this.shadowRoot.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
            /*--background-color: var(--m-orange-300);*/ /* removed according laurin */
            --color-active: var(--m-orange-600);
            font-family: var(--font-family);
        }
        :host .tab-navigation {
            border-top: var(--border-bottom, 1px solid var(--m-gray-300));
            list-style: none;
            display: flex;
            justify-content: var(--tab-justify-content, none);
            padding: 0;
            gap: 1.5em;
            margin-bottom: var(--margin-bottom, 3em);
            overflow-x: auto;
            transform:rotateX(180deg);
        }
        :host .tab-navigation::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        :host .tab-navigation::-webkit-scrollbar-thumb{
          background: var(--m-gray-400);
          -webkit-appearance: none;
        }
        :host .tab-navigation li {
            border-top-left-radius: var(--border-radius, 0.5em);
            border-top-right-radius: var(--border-radius, 0.5em);
            color: var(--color);
            cursor: pointer;
            padding: 10px;
            position: relative;
            transform:rotateX(180deg);
        }
        :host .tab-navigation li::after {
            content: '';
            width: 100%;
            height: 3px;
            background-color: var(--background-color, var(--color-disabled));
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top-left-radius: var(--border-radius, 0.5em);
            border-top-right-radius: var(--border-radius, 0.5em);
        }
        :host .tab-navigation li:hover {
            background-color: var(--background-color-hover, var(--m-orange-100));
        }
        :host .tab-navigation li:hover::after {
            display: block;
        }
        :host .tab-navigation li.active {
            color: var(--color-active, var(--color-secondary));
            font-family: var(--font-family-bold);
        }
        :host .tab-navigation li.active::after {
            background-color: var(--background-color-active, var(--color-secondary));
            display: block;
        }
        :host .tab-navigation li a {
          color: inherit;
          text-decoration: none;
        }
        :host .tab-content {
            display: none;
        }
        :host .tab-content.active {
            display: block;
        }
    `
  }
}
