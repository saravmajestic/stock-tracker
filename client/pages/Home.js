import React from 'react';
import HeaderContainer from '../containers/HeaderContainer.js';
import SearchSymbolContainer from '../containers/SearchSymbolContainer';

export default () => (
  <article className="home">
    <HeaderContainer type="full"/>
    <SearchSymbolContainer/>
  </article>
);
