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
let user = {};
fetch('/api/user',{headers: {
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // 'mode': 'no-cors'
  }}).then(function(response){
    return response.json();
           
}).then((data)=>{
  user = data.data; 
  console.log(user);
  
}).catch((err)=>{
  console.log(err);
});
import hello from '../../node_modules/hellojs/dist/hello.all';
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
const Main = () => (
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><NavLink to="/blog">Blog</NavLink></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <hr/>
      <LoginComponent/>
      <hr/>
      {routes.childRoutes.map(function(route, i){
        return <Route exact={route.exact} key={i} path={route.path} component={route.component}/>;
      })}
    </div>
  </BrowserRouter>
)
export default () => <Main/>;
