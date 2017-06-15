import React from 'react';
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom';
import App from 'containers/App';
import asyncComponent from '../components/asyncComponents';

const routes = {
  component: App,
  childRoutes: [
    {
      path: '/',
      exact: true,
      component: asyncComponent(() => System.import('pages/home').then(module => module.default), { name: 'home' })
    },
    {
      path: '/blog',
      component: asyncComponent(() => System.import('pages/blog').then(module => module.default), { name: 'blog' })
    },
    {
      path: '/about',
      component: asyncComponent(() => System.import('pages/about').then(module => module.default), { name: 'about' })
    },
  ]
};
const Main = () => (
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><NavLink to="/blog">Blog</NavLink></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <hr/>
      
      {routes.childRoutes.map(function(route, i){
        return <Route exact={route.exact} key={i} path={route.path} component={route.component}/>;
      })}
    </div>
  </BrowserRouter>
)
export default () => <Main/>;
