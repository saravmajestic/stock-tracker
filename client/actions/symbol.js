import 'whatwg-fetch'
export const SEARCH_SYMBOL = 'SEARCH_SYMBOL';
export const SEARCH_SYMBOL_SUCCESS = 'SEARCH_SYMBOL_SUCCESS';
import {getGraph} from './utils';

export function searchSymbol(formValues) {
  var payload = {query: "{searchSymbol{link_src stock_name sc_id}}", search: formValues};
  return {
    type: SEARCH_SYMBOL,
    payload: getGraph(payload)
  };
}
export function searchSymbolSuccess(symbols) {
  return {
    type: SEARCH_SYMBOL_SUCCESS,
    payload: symbols
  };
}