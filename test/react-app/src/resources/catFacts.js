import { useEffect } from 'react';
import { createResource } from 'react-app-state'

export const { getState, setState, useState } = createResource()

export async function loadCatFacts(){
  if (getState().loadingCatFacts) return
  setState({ loadingCatFacts: true })
  try{
    const response = await fetch('https://cat-fact.herokuapp.com/facts')
    const catFacts = (await response.json()).all
    setState({ catFacts })
  }catch(loadingCatFactsError){
    setState({ loadingCatFactsError })
  }finally{
    setState({ loadingCatFacts: false })
  }
}

export function useCatFacts(){
  const {
    loadingCatFacts,
    loadingCatFactsError,
    catFacts,
  } = useState([
    'loadingCatFacts',
    'loadingCatFactsError',
    'catFacts',
  ])
  useEffect(
    () => { if (!catFacts) loadCatFacts() },
    [catFacts],
  )
  return {
    loadingCatFacts,
    loadingCatFactsError,
    catFacts,
    loadCatFacts,
  }
}
