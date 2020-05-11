import { useEffect, useRef } from 'react'

export default class AppState {

  constructor(initState = {}){
    this.state = initState
    this.subscribers = []
    this.useAppState = useAppState.bind(this)
    this.useAppActions = useAppActions.bind(this)
    this.actions = {}
    this.changedKeys = new Set()
    this.isPublishing = false
  }

  defineActions(actions){
    Object.assign(this.actions, actions)
  }

  subscribeToAppStateChanges(handler){
    this.subscribers.push(handler)
  }

  unsubscribeFromAppStateChanges(handler){
    this.subscribers = this.subscribers.filter(h => h !== handler)
  }

  appAction(actor, actionName, ...boundArgs){
    return (...args) =>
      this.takeAction(actor, actionName, ...boundArgs, ...args)
  }

  throwIfPublishing(task){
    if (this.isPublishing) throw new Error(`[appState] refusing to ${task} while publishing`)
  }

  takeAction(actor, actionName, ...args){
    this.throwIfPublishing('takeAction')
    console.log('🍎 takeAction', {actor, actionName, args})
    const parts = actionName.split('.')
    let action
    if (parts.length === 1){
      action = this.actions[parts[0]]
    }else{
      const controller = this.actions[parts[0]] || {}
      action = controller[parts[1]]
    }
    if (typeof action !== 'function')
      throw new Error(`[appState][${actor}] called undefined action "${actionName}"`)
    const context = this.createActorContext(`${actor}->actions.${actionName}`)
    return action.call(context, ...args)
  }

  createActorContext(actor){
    return {
      getState: this.getState.bind(this, actor),
      setState: this.setState.bind(this, actor),
      // resetState: this.resetState.bind(this, actor),
      takeAction: this.takeAction.bind(this, actor),
      // mergeState,
      // extendObject,
      // addToSet,
      // removeFromSet,
    }
  }


  getState(actor){ // eslint-disable-line
    // logger.trace(`[appState][${actor}].getState`)
    return this.state
  }

  setState(actor, changes){
    this.throwIfPublishing('setState')
    for(const key in changes){
      if (this.state[key] === changes[key]) continue
      this.changedKeys.add(key)
      if (typeof changes[key] === 'undefined'){
        delete this.state[key]
      }else{
        this.state[key] = changes[key]
      }
    }
    this.publish(actor)
  }

  publish(actor){
    this.throwIfPublishing('publish')
    if (this.changedKeys.size === 0) return
    if (this.publishingTimeout) return
    this.publishingTimeout = setTimeout(() => { this._publish(actor) }, 0)
  }

  _publish(actor){
    this.throwIfPublishing('publish')
    this.isPublishing = true
    const changedKeys = Object.freeze([...this.changedKeys])
    this.changedKeys = new Set()
    try{
      this.subscribers.forEach(handler => {
        // if the previous handler causes subsequent handlers to unsub
        // don't call them
        if (this.subscribers.includes(handler)) handler(changedKeys)
      })
    }finally{
      this.isPublishing = false
      delete this.publishingTimeout
    }
  }
}

function useAppState(appStateKeys){
  console.log('🍎 useAppState', appStateKeys)

  const handlerRef = useRef()

  if (!handlerRef.current){
    handlerRef.current = function(changedKeys){
      console.log('🍎 useAppState', {changedKeys, appStateKeys})
      if (changeKeysIncludeAppStateKeys(changedKeys, appStateKeys)){
        forceUpdate()
      }
    }
    this.subscribeToAppStateChanges(handlerRef.current)
  }

  useEffect(
    () => {
      return () => {
        this.unsubscribeFromAppStateChanges(handlerRef.current)
      }
    },
    []
  )
  return {
    currentUser: 'FAKSE currentUser 99'
  }
}

function useAppActions(actor){
  // TODO use useRef() to cache these
  return {
    appAction: (...args) => this.appAction(actor, ...args),
    takeAction: (...args) => this.takeAction(actor, ...args),
  }
}
