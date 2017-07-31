import { combineReducers } from 'redux';
import UserReducer from './reducer_user';
import SymbolReducer from './reducer_symbol';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  user: UserReducer,
  symbol: SymbolReducer,
  form: formReducer, // <-- redux-form
});

export default rootReducer;
