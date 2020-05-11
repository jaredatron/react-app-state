import React from 'react';
import { useCatFacts } from '../../resources/catFacts'

export default function CatFacts() {
  const {
    loadingCatFacts,
    loadingCatFactsError,
    catFacts,
  } = useCatFacts()
  return (
    <div className="CatFacts">
      {loadingCatFactsError
        ? <span>ERROR Loading cat facts! {`${loadingCatFactsError}`}</span>
        : (loadingCatFacts || !catFacts)
          ? <span>Loading cat facts…</span>
          : <span>found {catFacts.length} cat facts</span>
      }
      {/*<pre><code>{JSON.stringify(catFacts, null, 2)}</code></pre>*/}
    </div>
  );
}
