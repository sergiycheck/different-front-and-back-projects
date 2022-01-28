import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';

const debug = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return (state, action) => {
    if (environment.logging) {
      console.log('previous state', state);
      console.log('current action', action);
    }

    return reducer(state, action);
  };
};

export const metaReducers: MetaReducer<any>[] = [debug];
