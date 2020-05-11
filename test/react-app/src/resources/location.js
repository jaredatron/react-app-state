import querystring from 'querystring'
import { createResource } from 'react-app-state'

export const { getState, setState, useState } = createResource()

class Location {
  constructor({pathname, query}){
    this.pathname = pathname
    this.query = query
  }

  toString(){
    let href = this.pathname
    let query = objectToSearch(this.query)
    if (query) href += '?' + query
    return href
  }

  replaceQuery(query){
    return new this.constructor({
      pathname: this.pathname,
      query,
    })
  }

  withQuery(newQuery){
    return this.replaceQuery({...this.query, ...newQuery})
  }
}

export const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}

const objectToSearch = (object) => {
  if (!object) return
  for(const key in object){
    const value = object[key]
    if (value === null || value === undefined)
      delete object[key]
  }
  if (Object.keys(object).length === 0) return
  return querystring.stringify(object)
}

export function getLocation(){
  const pathname = window.location.pathname
  const query = searchToObject(window.location.search)
  return new Location({pathname, query})
}

export function setLocation(href){
  if (hrefIsCurrentHref(href)) return
  window.history.pushState(null, global.document.title, href)
  update()
}

export function replaceLocation(href){
  if (hrefIsCurrentHref(href)) return
  window.history.replaceState(null, global.document.title, href)
  update()
}

export function goBack(...args){
  return window.history.back(...args)
}

const aNode = window.document.createElement('a')
export function expandHref(href){
  aNode.href = href
  return aNode.href
}

export function hrefIsSameOrigin(href){
  return expandHref(href).startsWith(window.location.origin)
}

export function hrefIsCurrentHref(href){
  return expandHref(href) === window.location.href
}

export function pushState(stateObject, title, href){
  if (hrefIsCurrentHref(href)) return
  window.history.pushState(stateObject, title, href)
  update()
}

export function useLocation(){
  return useState(['location'])
}

function update(){
  setState({ location: getLocation() })
}

window.addEventListener('popstate', update)
update()
