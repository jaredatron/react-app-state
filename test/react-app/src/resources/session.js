import { createResource } from 'react-app-state'
import wait from '../lib/wait'
import { setLocation } from './location'
const { getState, setState, useState } = createResource()

export async function login(){
  setState({ loggingIn: true })
  await wait(1000)
  const username = `user${Math.random()}`
  setState({
    loggingIn: undefined,
    username,
    sessionKey: `${Math.random()}`,
  })
  await setLocation(`/user/${username}`)
}

export async function logout(){
  setState({
    username: undefined,
    sessionKey: undefined,
  })
  await setLocation(`/`)
}

export function useCurrentUser(){
  const {username, loggingIn} = useState(
    ['username', 'loggingIn']
  )
  return {
    loggingIn,
    loggedIn: !!username,
    username,
  }
}
