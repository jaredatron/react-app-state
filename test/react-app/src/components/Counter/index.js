import React from 'react';
import { useCounter } from '../../resources/counter'

export default function Counter({ index }) {
  const { total, inc, dec } = useCounter(`counter${index}`)
  return (
    <div className="Counter">
      <div>count: {total}</div>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
    </div>
  );
}
