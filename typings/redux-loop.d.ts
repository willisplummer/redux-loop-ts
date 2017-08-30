declare module 'redux-loop' {
  import { Action, StoreEnhancer, Store } from 'redux';

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

  interface BatchCmd<AppAction extends Action, F extends Function> {
    type: 'BATCH';
    cmds: CmdType<AppAction, F>;
  }

  interface RunCmd<F extends Function> {
    type: 'RUN';
    func: F;
    options: {
      args: any[];
      failActionCreator: Function;
      successActionCreator: Function;
    };
  }

  interface SequenceCmd<AppAction extends Action, F extends Function> {
    type: 'Sequence';
    cmds: CmdType<AppAction, F>;
  }

  type CmdType<AppAction extends Action, F extends Function> =
    | ActionCmd<AppAction>
    | BatchCmd<AppAction, F>
    | NoneCmd
    | RunCmd<F>
    | SequenceCmd<AppAction, F>;

  function install<AppState>(): StoreEnhancer<AppState>;

  function loop<State, AppAction extends Action, F extends Function>(
    state: State,
    effect: CmdType<AppAction, F>
  ): [State, CmdType<AppAction, F>];

  class Cmd {
    static readonly none: NoneCmd;
    static action: <AppAction extends Action>(
      action: AppAction
    ) => ActionCmd<AppAction>;
    static run: <F extends Function>(f: F) => RunCmd<F>;
    static batch: <AppAction extends Action, F extends Function>(
      cmds: CmdType<AppAction, F>[]
    ) => BatchCmd<AppAction, F>;
    static sequence: <AppAction extends Action, F extends Function>(
      cmds: CmdType<AppAction, F>[]
    ) => SequenceCmd<AppAction, F>;
  }

  interface StrictReducerMapObject<T> {
    [key: string]: EnhancedReducer<T, T | [T, CmdType<Action, Function>]>;
  }

  function combineReducers<S, T>(
    reducers: StrictReducerMapObject<T>
  ): EnhancedReducer<S, [S, CmdType<Action, Function>]>;
}
