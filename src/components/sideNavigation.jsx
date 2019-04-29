import React, { Component } from 'react'
import M from "materialize-css"
import { Link } from 'react-router-dom'
import { CONSTANTS } from 'helpers/urlConstants'

class NavMobile extends Component {
  componentDidMount() {
    M.AutoInit();
  }

  render() {
    return (
      <ul id="nav-mobile" className="sidenav sidenav-fixed">
        <li>
          <Link to={{ pathname: CONSTANTS.CONTENT }}>
          Manage Content
          </Link>
        </li>
        <li>
          <Link to={{ pathname: CONSTANTS.TRACKING }}>
          Tracking
          </Link>
        </li>
        <li>
          <Link to={{ pathname: CONSTANTS.STATISTICS }}>
          Statistics
          </Link>
        </li>
      </ul>
    );
  }
}

export default NavMobile;
