// @ts-check
/* global CustomEvent */
/* global fetch */
/* global sessionStorage */

import { Shadow } from '../../prototypes/Shadow.js'
import query from './Query.js'

/**
 * TODO
 * @export
 * @class Contentful
 * @type {CustomElementConstructor}
 */
export default class Contentful extends Shadow() {
  constructor (...args) {
    super({ mode: 'false' }, ...args)

    // TODO:
    // AbortController()
    // Move Base URL to Environment

    const token = this.getAttribute('token')
    const spaceId = this.getAttribute('space-id')
    const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`
    const limit = this.getAttribute('limit')

    this.requestListArticlesListener = event => {
      console.log('skip:', event.detail.skip)
      const variables = { limit: Number(limit), skip: Number(event.detail.skip) || 0 }
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token + ' ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      }
      this.dispatchEvent(new CustomEvent('listArticles', {
        detail: {
          fetch: fetch(endpoint, fetchOptions).then(response => {
            if (response.status >= 200 && response.status <= 299) {
              const json = response.json()
              json.then(data => {
                sessionStorage.setItem('articles', JSON.stringify(data))
              })
              return json
            }
            throw new Error(response.statusText)
            // @ts-ignore
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('requestListArticles', this.requestListArticlesListener)
  }

  disconnectedCallback () {
    this.removeEventListener('requestListArticles', this.requestListArticlesListener)
  }
}
