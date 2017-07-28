import React from 'react';
import { BrowserRouter, Route, Link, NavLink, Switch } from 'react-router-dom';
import App from 'containers/AppContainer';
import asyncComponent from 'components/asyncComponents';

const routes = {
  component: App,
  childRoutes: [
    {
      path: '/',
      exact: true,
      component: asyncComponent(() => System.import('pages/Home').then(module => module.default), { name: 'home' })
    },
    {
      path: '/signin',
      component: asyncComponent(() => System.import('pages/SignIn').then(module => module.default), { name: 'signin' })
    },
    {
      path: '/signup',
      component: asyncComponent(() => System.import('pages/SignUp').then(module => module.default), { name: 'signup' })
    },
    {
      path: '/about',
      component: asyncComponent(() => System.import('pages/About').then(module => module.default), { name: 'about' })
    },
  ]
};

import hello from '../node_modules/hellojs/dist/hello.all';
class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            user: []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let self = this;
        hello('facebook').login(
            {
                // scope: 'repo,user'
            }
        ).then(function() {
            return hello('facebook').api('me');
        })
        .then(function(p) {
            self.setState({user: p, open: false});
            console.log(self.state);
        });
    }
    
    componentDidMount(){
        hello.init({
            facebook : '287778054690335'
        },{
            scope : 'email'
        });
    }
    render(){
        return(
        <div>
          {this.state.user.name ? 
            <span>Welcome {this.state.user.name}!</span> :
            <button onClick={this.handleClick}>facebook</button>}
        </div>
        )
    }
}
const NotFound = () =>
  <div>
    <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
  </div>
const Main = () => (
  <BrowserRouter>
    <App>
        <Switch>
        {routes.childRoutes.map(function(route, i){
            return <Route exact={route.exact} key={i} path={route.path} component={route.component}/>;
        })}
        <Route path="*" component={NotFound} />
        </Switch>
    </App>
  </BrowserRouter>
)
export default () => <Main/>;
