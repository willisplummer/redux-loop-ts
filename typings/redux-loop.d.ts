declare module 'redux-loop' {
  import { Action, ReducersMapObject, StoreEnhancer, Store } from 'redux';

  interface StoreCreator {
    <S, T>(
      reducer: EnhancedReducer<S, T>,
      preloadedState: S,
      enhancer: StoreEnhancer<S>
    ): Store<S>;
  }

  interface EnhancedReducer<S, T> {
    <A extends Action>(state: S, action: A): T;
  }

  interface NoneCmd {
    type: 'NONE';
  }

  interface ActionCmd<A> {
    type: 'ACTION';
    actionToDispatch: A;
  }

  interface RunCmd<F extends Function> {
    type: 'RUN';
    func: F;
    options: {};
  }

  type CmdType<AppAction extends Action, F extends Function> =
    | NoneCmd
    | RunCmd<F>
    // | BatchCmd<AppAction>
    // | SequenceCmd<AppAction>
    | ActionCmd<AppAction>;

  function install<AppState>(): StoreEnhancer<AppState>;

  function loop<State, AppAction extends Action, F extends Function>(
    state: State,
    effect: CmdType<AppAction, F>
  ): [State, CmdType<AppAction, F>];

  class Cmd {
    static none: () => NoneCmd;
    static action: <AppAction extends Action>(
      action: AppAction
    ) => ActionCmd<AppAction>;
    static run: <F extends Function>(f: F) => any;
    static batch: <AppAction extends Action, F extends Function>(
      cmds: CmdType<AppAction, F>
    ) => any;
  }

  interface StrictReducerMapObject<T> {
    [key: string]: EnhancedReducer<T, T | [T, CmdType<Action, Function>]>;
  }

  function combineReducers<S, T>(
    reducers: StrictReducerMapObject<T>
  ): EnhancedReducer<S, [S, CmdType<Action, Function>]>;
}
