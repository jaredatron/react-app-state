import { useEffect } from 'react';
import { useAppState, useAppActions, defineActions } from 'react-app-state'

defineActions({
  catFacts: {
    async load(){
      this.setState({ loadingCatFacts: true })
      try{
        const response = await fetch('https://cat-fact.herokuapp.com/facts')
        const catFacts = (await response.json()).all
        this.setState({ catFacts })
      }catch(loadingCatFactsError){
        this.setState({ loadingCatFactsError })
      }finally{
        this.setState({ loadingCatFacts: false })
      }
    },
  },
})

export function useCatFacts(componentName){
  const {
    loadingCatFacts,
    loadingCatFactsError,
    catFacts,
  } = useAppState([
    'loadingCatFacts',
    'loadingCatFactsError',
    'catFacts',
  ])
  const { appAction } = useAppActions(componentName)
  const loadCatFacts = appAction('catFacts.load')
  console.log('❓loadCatFacts❓', loadCatFacts+'')
  useEffect(
    () => {
      console.log('🐈 loading cat facts')
      loadCatFacts()
    },
    [loadCatFacts],
  )
  return {
    loadingCatFacts,
    loadingCatFactsError,
    catFacts,
    loadCatFacts,
  }
}
