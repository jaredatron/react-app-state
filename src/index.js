import { useEffect, useRef, useReducer } from 'react'

export function createResource(){

  const state = {}
  const subscriptions = new Set
  let changedKeys = new Set
  let publishing = false
  let publishTimeout

  function schedulePublish(){
    if (
      changedKeys.size === 0 ||
      subscriptions.size === 0 ||
      publishTimeout
    ) return
    publishTimeout = setTimeout(publish, 0)
  }

  function publish(){
    publishing = true
    const publishedKeys = changedKeys
    changedKeys = new Set
    try {
      subscriptions.forEach(subscription => {
        if (
          // if the previous subscriber caused this
          // subscriber to unsubscribe then don't call them
          subscriptions.has(subscription) &&
          (
            subscription.current.keys === Infinity ||
            subscription.current.keys.some(key =>
              publishedKeys.has(key)
            )
          )
        ) subscription.current.update()
      })
    } finally {
      publishing = false
      publishTimeout = undefined
    }
  }

  function keysMapToKeys(keysMap){
    if (keysMap === Infinity) return Infinity
    if (Array.isArray(keysMap)) return keysMap
    if (typeof keysMap === 'object') return Object.keys(keysMap)
    return []
  }

  function getStateSubset(keyMap){
    if (keyMap === Infinity) return Object.assign({}, state)
    const stateSubset = {}
    const entries = (
      Array.isArray(keyMap)
        ? keyMap.map(key => [key, key])
        : Object.entries(keyMap)
    )
    entries.forEach(([stateKey, subsetKey]) => {
      stateSubset[subsetKey] = state[stateKey]
    })
    return stateSubset
  }

  // public

  function getState(){
    return Object.assign({}, state)
  }

  function setState(changes){
    if (publishing)
      throw new Error(`refusing to setState while publishing`)
    for (const key in changes) {
      if (state[key] === changes[key]) continue
      changedKeys.add(key)
      if (typeof changes[key] === 'undefined') {
        delete state[key]
      } else {
        state[key] = changes[key]
      }
    }
    schedulePublish()
  }

  function useState(keysMap){
    const subscription = useRef()
    const update = useReducer(n => n + 1, 0)[1]
    if (!subscription.current)
      subscriptions.add(subscription)
    subscription.current = {
      update,
      keys: keysMapToKeys(keysMap),
    }
    useEffect(
      () => () => {
        subscriptions.delete(subscription)
      },
      []
    )
    return getStateSubset(keysMap)
  }

  return { getState, setState, useState }
}
