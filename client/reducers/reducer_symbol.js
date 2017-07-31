
import {
  SEARCH_SYMBOL, SEARCH_SYMBOL_SUCCESS
} from '../actions/symbol';

const INITIAL_STATE = {symbols: null, status:null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {
    
    case SEARCH_SYMBOL_SUCCESS:
    return { ...state, symbols: action.payload.symbols, status:null, error:null, loading: false};
    
    default:
    return state;
  }
}
