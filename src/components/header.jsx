import React, { Component } from 'react'
import AppHelper from "helpers/AppHelper.js"
import { connect } from 'react-redux'
import { requestLogout } from 'actions'
import { Link } from 'react-router-dom'

class Header extends Component {
  logout = (e) => {
    e.preventDefault();
    this.props.dispatchLogout()
    AppHelper.logoutUser()
  }
  render() {
    return (
      <header>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <Link to='/' className="brand-logo center">{this.props.title}</Link>
              <ul className="left">
                <li> <Link to={'/analysis/global'}> <i className="large material-icons">insert_chart</i> </Link> </li>
              </ul>
              <ul className="right">
                <li> <a onClick={this.logout} className="waves-effect waves-light btn" href="#!">Logout</a></li>
              </ul>
            </div>
          </nav>
        </div>
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
