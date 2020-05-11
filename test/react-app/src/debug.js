// import { useLocation } from './resources/location'
// import { useCurrentUser, login, logout } from './resources/session'

import * as location from './resources/location'
import * as session from './resources/session'
import * as counter from './resources/counter'
import * as catFacts from './resources/catFacts'

global.DEBUG = global.DEBUG || {}

global.DEBUG.resources = {
  location,
  session,
  counter,
  catFacts,
}
global.DEBUG.getState = function(){
  const state = {}
  for (const key in global.DEBUG.resources) {
    state[key] = global.DEBUG.resources[key].getState()
  }
  return state
}
