import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { EnhancedReducer, install, loop, Cmd, CmdType } from 'redux-loop';

// UPDATE

type Action = { type: 'INCREMENT' };

const reducer: EnhancedReducer<
  number,
  number | [number, CmdType<Action, Function>]
> = (state = 0, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return loop(state + 1, Cmd.none());
    default:
      return state;
  }
};

// VIEW

const Counter = ({
  value,
  onIncrement
}: {
  value: number;
  onIncrement: () => void;
}) => (
  <div>
    <p>Count: {value}</p>
    <button onClick={onIncrement}>+</button>
  </div>
);

// INIT

const store = createStore(reducer, 0, install());
const rootEl = document.getElementById('root');
const initialState = store.getState() as number;

const render = () => {
  ReactDOM.render(
    <Counter
      value={initialState}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    />,
    rootEl
  );
};

render();
store.subscribe(render);
