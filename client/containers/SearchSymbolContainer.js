import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import SearchSymbol from '../components/SearchSymbol';
import {searchSymbol, searchSymbolSuccess} from '../actions/symbol'

function mapStateToProps(state, ownProps) {
  return { 
    symbols: state.symbol.symbols
  };
}

const mapDispatchToProps = (dispatch) => ({
  handleSearchSubmit: values => {
      dispatch(searchSymbol(values))
      .then((result) => {
        result.payload.json().then(response => {
          dispatch(searchSymbolSuccess({symbols: response.data.searchSymbol}));
        });
      });
    },
});

export default reduxForm({ form: 'SearchSymbolContainer' })(connect(mapStateToProps, mapDispatchToProps)(SearchSymbol));