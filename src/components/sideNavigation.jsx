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
        <li className="no-padding">
          <ul className="collapsible collapsible-accordion">
            <li>
              <a className="collapsible-header">Dropdown<i className="material-icons">arrow_drop_down</i></a>
              <div className="collapsible-body">
                <ul>
                  <li>
                    <Link to={{ pathname: CONSTANTS.PROGRAMS }}>
                    Programs
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
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
