import { createResource } from 'react-app-state'

const { getState, setState, useState } = createResource()

getState({
  total: 0,
})

function inc(){
  const { total = 0 } = getState()
  setState({ total: total + 1 })
}

function dec(){
  const { total = 0 } = getState()
  setState({ total: total - 1 })
}

export function useCounter(componentName){
  const { total = 0 } = useState(['total'])
  return { total, inc, dec }
}
