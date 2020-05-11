import React from 'react';
import {
  goBack,
  hrefIsSameOrigin,
  setLocation,
  replaceLocation,
} from '../../resources/location'

export default function Link({ children, ...props }) {

  const onClick = event => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    if (props.goBack) {
      event.preventDefault()
      goBack()
    }

    if (props.onClick) props.onClick(event)

    if (event.defaultPrevented) return

    if (
      !props.forcePageReload &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      hrefIsSameOrigin(props.href)
    ){
      event.preventDefault()
      if (props.replace)
        replaceLocation(props.href)
      else
        setLocation(props.href)
    }
  }
  return <a {...{...props, onClick}}>{children}</a>
}
