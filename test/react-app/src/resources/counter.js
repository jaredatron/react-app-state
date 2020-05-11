import {
  useAppState,
  useAppActions,
  defineActions,
  // initState,
} from 'react-app-state'

// initState({
//   counter: 0,
// })

defineActions({
  counter: {
    inc(){
      const { total = 0 } = this.getState()
      this.setState({ total: total + 1 })
    },
    dec(){
      const { total = 0 } = this.getState()
      this.setState({ total: total - 1 })
    },
  },
})

export function useCounter(componentName){
  const { total = 0 } = useAppState(['total'])
  const { appAction } = useAppActions(componentName)
  const inc = appAction('counter.inc')
  const dec = appAction('counter.dec')
  return { total, inc, dec }
}
