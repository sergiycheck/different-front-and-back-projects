import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';

const debug = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return (state, action) => {
    console.log('previous state', state);
    console.log('current action', action);

    return reducer(state, action);
  };
};

export const metaReducers: MetaReducer<any>[] = [debug];
