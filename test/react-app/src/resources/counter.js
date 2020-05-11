import { createResource } from 'react-app-state'

import { logout } from './session'

export const { getState, setState, useState } = createResource()

setState({ total: 0 })

async function inc(componentName){
  console.log('inc was called by', componentName)
  const { total } = getState();
  let hello
  setState({ total: total + 1 })
  if (total + 1 > 10) await logout()
}

async function dec(componentName){
  console.log('dec was called by', componentName)
  const { total } = getState()
  setState({ total: total - 1 })
}

export function useCounter(componentName){
  const { total } = useState(['total'])
  return {
    total,
    inc: inc.bind(null, componentName),
    dec: dec.bind(null, componentName),
  }
}
