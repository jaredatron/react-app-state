import { createResource } from 'react-app-state'

export const { getState, setState, useState } = createResource()

setState({ total: 0 })

function inc(){
  const { total } = getState()
  setState({ total: total + 1 })
}

function dec(){
  const { total } = getState()
  setState({ total: total - 1 })
}

export function useCounter(componentName){
  const { total } = useState(['total'])
  return { total, inc, dec }
}
