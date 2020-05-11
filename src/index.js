import AppState from './AppState'

export const appState = new AppState({})
export const useAppState = appState.useAppState
export const useAppActions = appState.useAppActions
export const defineActions = (...args) =>
  appState.defineActions(...args)
