import React, { Component } from 'react'
import AppHelper from "helpers/AppHelper.js"
import { connect } from 'react-redux'
import { requestLogout } from 'actions'
import { Link } from 'react-router-dom'
import SideNavigation from './sideNavigation'

class Header extends Component {

  logout = (e) => {
    e.preventDefault();
    this.props.dispatchLogout()
    AppHelper.logoutUser()
  }

  render() {
    return (
      <header>
        <nav className="top-nav">
          <div className="nav-wrapper">
            <Link to='/' className="brand-logo center">{this.props.title}</Link>
            <ul className="left">
              <li>
                <a href="#!" data-target="nav-mobile" className="top-nav sidenav-trigger full hide-on-large-only">
                  <i className="material-icons">menu</i>
                </a>
              </li>
              <li>
                <Link to={'/analysis/global'}> <i className="large material-icons">insert_chart</i></Link>
              </li>
            </ul>
            <ul className="right">
              <li><a onClick={this.logout} className="waves-effect waves-light btn" href="#!">Logout</a></li>
            </ul>
          </div>
        </nav>

        <SideNavigation />

      </header>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLogout: () => dispatch(requestLogout())
  }
}

export default connect(null, mapDispatchToProps)(Header);
