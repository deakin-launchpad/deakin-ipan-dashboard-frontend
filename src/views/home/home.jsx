import React, { Component } from 'react'
import API from 'helpers/api.js'
import moment from 'moment-timezone'

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss z"
const TIME_ZONE = "Australia/Melbourne"

const momentTz = function (time) {
  return moment.tz(time, TIME_ZONE).format(TIME_FORMAT)
}

// console.log('now:', momentTz(new Date().toISOString()))

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trackingData: null,
      clickedRecord: null,
      clickedRecordIndex: -1,
      firstLogin: null,
      lastLogin: null
    }
  }

  componentDidMount() {
    this.getTrackingData()
  }

  stateHandler = (state) => {
    this.setState(state);
  }

  getTrackingData = () => {
    API.getTrackingData(this.stateHandler)
  }

  renderUserLastLogin = () => {
    return (
      <table>
        <tbody>
          <tr>
            <td>Last user login time:</td>
            <td>{momentTz(this.state.clickedRecord.lastLogin.time)}</td>
          </tr>
          <tr>
            <td>User ID:</td>
            <td>{this.state.clickedRecord.lastLogin.id}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderUserFirstLogin = () => {
    return (
      <table>
        <tbody>
          <tr>
            <td>First user login time:</td>
            <td>{momentTz(this.state.clickedRecord.firstLogin.time)}</td>
          </tr>
          <tr>
            <td>User ID:</td>
            <td>{this.state.clickedRecord.firstLogin.id}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  setClickedRecordInfo = () => {
    var firstLogin, lastLogin, lastLoginIndex, sessionTotalLogins = 0
    this.state.clickedRecord.data.forEach((item, i) => {

      if ('T_LOGIN' === item.event) {
        let obj = {
          time: item.time,
          id: item.userId
        }

        if (!firstLogin) {
          firstLogin = obj
          lastLogin = obj
          lastLoginIndex = i
          sessionTotalLogins += 1
        }

        else if (lastLoginIndex < i) {
          lastLogin = obj
          lastLoginIndex = i
          sessionTotalLogins += 1
        }
      }
    })
    let clickedRecord = Object.assign({}, this.state.clickedRecord)
    clickedRecord.firstLogin = firstLogin
    clickedRecord.lastLogin = lastLogin
    clickedRecord.lastLoginIndex = lastLoginIndex
    clickedRecord.sessionTotalLogins += sessionTotalLogins

    this.setState({ clickedRecord: clickedRecord })
  }

  displayRecord = () => {
    if (!this.state.clickedRecord) return ''
    return (
      <div className="recordView">
        <div className="recordView-header">
          <div className="title">
            <h5>History</h5>
            <div className="divider" />
            Session ID: {this.state.clickedRecord._id}
            <br />Total users logged in this session: {this.state.clickedRecord.sessionTotalLogins ? this.state.clickedRecord.sessionTotalLogins : 0}
          </div>
          <div className="userDetails">
            {this.state.clickedRecord.sessionTotalLogins >= 1 ? this.renderUserFirstLogin() : ''}
            {this.state.clickedRecord.sessionTotalLogins > 1 ? this.renderUserLastLogin() : ''}
          </div>
        </div>
        <div className="record-table">
          <table className="highlight responsive-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>UserID</th>
                <th>URL</th>
                <th>Event</th>
                <th>Time</th>
                <th>Misc</th>
              </tr>
            </thead>
            <tbody>
              {this.state.clickedRecord.data.map((item, i) => {
                return (
                  <tr key={'event_' + i}>
                    <td>{i}</td>
                    {item.userId ? <td className="td-userId"> {item.userId} </td> : <td> </td>}
                    <td>{item.url}</td>
                    <td>{item.event}</td>
                    <td>{momentTz(item.time)}</td>
                    <td>{item.misc.length === 0 ? '' : item.misc.map((misc, i) => {
                      return `${misc.key} = ${misc.value}\n`
                    })}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render() {
    if (!this.state.trackingData) return ''
    return (
      <div className="home">
        {/* <Modal/> */}
        <div
          className={this.state.clickedRecord === null ? 'recordList' : 'recordList recordView-visible'}
        >
          <table className="striped highlight responsive-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Session ID</th>
                <th>Number of events</th>
                <th>Session start</th>
                <th>Session end</th>
                <th>Session total time</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {this.state.trackingData.map((item, i) => {
                const fTime = item.data[0].time
                const lTime = item.data[item.data.length - 1].time
                const totalTime = Date.parse(lTime) - Date.parse(fTime)
                return (
                  <tr key={'session_' + i}>
                    <td>{i}</td>
                    <td>{item._id}</td>
                    <td>{item.data.length}</td>
                    <td>{momentTz(fTime)}</td>
                    <td>{momentTz(lTime)}</td>
                    <td>{totalTime / 1000}s</td>
                    <td>
                      <button
                        className={this.state.clickedRecordIndex === i ? 'btn btn-red' : 'btn'}
                        onClick={() => {
                          if (this.state.clickedRecordIndex === i)
                            return this.setState({ clickedRecord: null, clickedRecordIndex: -1 })

                          item.sessionTotalLogins = 0
                          this.setState({ clickedRecord: item, clickedRecordIndex: i }, () => { this.setClickedRecordInfo() })
                        }}>
                        {this.state.clickedRecordIndex === i ? 'HIDE' : 'VIEW'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {this.displayRecord()}
      </div>
    );
  }
}

export default Home
