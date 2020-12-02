const React = require('react');
const ReactDOM = require('react-dom');
import { BrowserRouter, Route, Switch, Redirect, NavLink } from "react-router-dom";
import client from './client';
import PostsBuilder from './components/posts/postsBuilder';
import Layout from "./hoc/Layout/Layout";
import Home from "./components/Home/Home";
import Users from "./components/Users/Users";
import Logout from "./components/Logout";

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			loaded: false
		};
	}

	componentDidMount() {
		client({method: 'GET', path: '/getuser'}).then(response => {
			console.log(response);
			this.setState({user: response.entity, loaded: true});
		});
	}

	render() {
		let routes = "loading..."
		if(this.state.loaded) {
			routes = (
					<Switch>
						<Route path="/logout" component={Logout} />
						<Route path="/userslist" render={(props) => <Users {...props} user={this.state.user} />} />
						<Route path="/newsfeed" render={(props) => <PostsBuilder {...props} user={this.state.user} />} />
						<Route path="/" exact render={(props) => <Home {...props} user={this.state.user} />} />
						<Redirect to="/" />
					</Switch>
			)
		}

		return (
				<Layout>
					<div>
          	{routes}
					</div>
        </Layout>
		)
	}
}

const app = (
				<BrowserRouter>
						<App />
				</BrowserRouter>
);

ReactDOM.render(
	app,
	document.getElementById('app')
)
