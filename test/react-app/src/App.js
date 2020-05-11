import React, { useState } from 'react'
import './App.css'
import Counter from './components/Counter'
import CatFacts from './components/CatFacts'

function App() {
  console.log(`👍 <App/> render`)
  const [n, setN] = useState(0)
  const rerender = () => { setN(Math.random()) }
  return (
    <div className="App">
      <button onClick={rerender}>rerender {n}</button>
      <Counter />
      <Counter />
      <CatFacts />
    </div>
  );
}

export default App;
