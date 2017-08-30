import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { EnhancedReducer, install, loop, Cmd, CmdType } from 'redux-loop';

// UPDATE

type Action =
  | { type: 'INCREMENT' }
  | { type: 'LOG' }
  | { type: 'LOG_2' }
  | { type: 'BATCH_LOG' };

const log = (): Action => ({ type: 'LOG' });

const reducer: EnhancedReducer<
  number,
  number | [number, CmdType<Action, Function>]
> = (state = 0, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return loop(state + 1, Cmd.action(log()));
    case 'LOG':
      // tslint:disable-next-line:no-console
      console.log('running this');
      return loop(state, Cmd.none);
    case 'LOG_2':
      // tslint:disable-next-line:no-console
      return loop(state, Cmd.run(() => console.log(212121)));
    case 'BATCH_LOG':
      return loop(
        state,
        Cmd.batch([
          // tslint:disable-next-line:no-console
          Cmd.run(() => console.log(212121)),
          Cmd.action(log()),
          Cmd.none,
          Cmd.sequence([
            // tslint:disable-next-line:no-console
            Cmd.run(() => console.log(212121)),
            Cmd.action(log()),
            Cmd.none
          ])
        ])
      );
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
const getState = () => store.getState() as number;

const render = () => {
  ReactDOM.render(
    <Counter
      value={getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    />,
    rootEl
  );
};

render();
store.subscribe(render);
