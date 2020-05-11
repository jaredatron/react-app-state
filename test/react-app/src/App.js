import React, { useState } from 'react'
import './App.css'
import { useLocation } from './resources/location'
import { useCurrentUser, login, logout } from './resources/session'
import Counter from './components/Counter'
import CatFacts from './components/CatFacts'
import Link from './components/Link'

export default function App(){
  const { location } = useLocation()
  const { loggingIn, loggedIn, username } = useCurrentUser()
  const [n, setN] = useState(0)
  const rerender = () => { setN(Math.random()) }
  return (
    <div className="App">
      <div>{location.pathname}</div>
      <button onClick={rerender}>rerender {n}</button>
      <Counter />
      <Counter />
      <p>
        <Link href="/one">one</Link>{' / '}
        <Link href="/two">two</Link>{' / '}
        <Link href={`/${Math.random()}`}>random</Link>
      </p>
      <p>welcome {username}</p>
      {loggedIn
        ? <button onClick={logout}>logout</button>
        : loggingIn
          ? <button disabled>logging in</button>
          : <button onClick={login}>login</button>
      }
      {loggedIn && <CatFacts />}
    </div>
  );
}
