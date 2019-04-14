import React, { Component } from 'react'
import './App.scss'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons/iconfont/material-icons.css'
import Header from 'components/header.jsx'
import AppHelper from "helpers/AppHelper.js"
import LoadingComponent from 'components/loading/loading.jsx'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { requestAccessTokenLogin } from 'actions'
import Login from 'views/login/login.jsx'
import Home from 'views/home/home.jsx'
import Programs from 'views/content/programs/programs.jsx'
import Team from 'views/team/team.jsx'
import ManageTask from 'views/content/tasks'
import GlobalAnalysis from 'views/global-analysis.jsx'
import { CONSTANTS } from './helpers/urlConstants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Dashboard',
    };
  }

  // Used to handle state from children
  stateHandler = (state) => {
    this.setState(
      state
    )
  }

  componentDidMount() {
    let token = ''
    if ((token = AppHelper.isUserLocalStorageLoggedIn())) {
      if (token === 'true') return;
      this.props.dispatchAccessTokenLogin(token)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    }
  }

  render() {
    if (this.props.loading) return (<LoadingComponent />);
    else return (
      <div className="App">
        {/* Header */}
        {this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ? <Header title={this.state.title} logout={this.stateHandler} /> : ''}

        {/* Main body */}
        <main>
          <Switch>

            <Route exact path='/' render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <Redirect to={CONSTANTS.HOME} /> : <Login parentState={this.state} parentProps={this.props} />)}
            />

            <Route exact path='/team' render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <Team {...props} /> : <Redirect to='/' />)}
            />

            <Route exact path={CONSTANTS.HOME} render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <Home {...props} parentStateHandler={this.stateHandler} /> : <Redirect to='/' />)}
            />

            <Route exact path='/content' render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <Redirect to='/content/programs' /> : <Redirect to='/' />)}
            />

            <Route exact path='/content/programs' render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <Programs {...props} parentStateHandler={this.stateHandler} /> : <Redirect to='/' />)}
            />

            <Route exact path='/analysis/global' render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <GlobalAnalysis {...props} parentState={this.state} /> : <Redirect to='/' />)}
            />

            <Route exact path={CONSTANTS.TASKS} render={(props) => (this.props.loggedIn || AppHelper.isUserLocalStorageLoggedIn() ?
              <ManageTask {...props} parentStateHandler={this.stateHandler} /> : <Redirect to='/' />)}
            />

            <Route exact path='/test' render={() => <div>Test</div>} />

            <Route render={() => <div>404 Error</div>} />

          </Switch>
        </main>

        {/* Footer */}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loginStatus.loggedIn,
    loading: state.loginStatus.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAccessTokenLogin: (token) => dispatch(requestAccessTokenLogin(token))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
