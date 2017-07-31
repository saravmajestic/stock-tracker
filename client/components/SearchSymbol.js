import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import renderField from './renderField';

class SearchSymbol extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {handleChange, handleSubmit, value, symbols, handleSearchSubmit} = this.props;
    return (
    <div className="container">
        <form onSubmit={handleSubmit(handleSearchSubmit)}>
            <Field component="input" name="stock" onChange={handleChange} type="text" value={value}/>
            <div>
                <button type="submit" className="btn btn-primary" >Search</button>
            </div>
        </form>
        <div className="results">
            <ul>
                {
                    symbols && symbols.map((symbol) =>
                        <li key={symbol.stock_name}>
                            {symbol.stock_name}
                        </li>
                    )
                }
                
            </ul>
        </div>
    </div>
    )
  }
};
//Client side validation
function validate(values) {
  console.log(values);
}

export default reduxForm({
  form: 'SearchSymbol', // a unique identifier for this form
  validate, // <--- validation function given to redux-form
  asyncBlurFields: [] 
})(SearchSymbol);
