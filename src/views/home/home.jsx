import React, { Component } from 'react'
import API from 'helpers/api.js'
import moment from 'moment'
// import Modal from 'components/modal.jsx'
// import M from "materialize-css"

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trackingData: null,
      clickedRecord: null,
      clickedRecordIndex: -1
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

  displayRecord = () => {
    if (!this.state.clickedRecord) return ''
    return (
      <div className="recordView">
        <div className="recordView-header">
          <h5>History</h5>
          <div className="divider"></div>
          Session ID: {this.state.clickedRecord._id}
        </div>
        <div className="record-table">
          <table className="highlight responsive-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>URL</th>
                <th>Event</th>
                <th>Time</th>
                <th>Misc</th>
              </tr>
            </thead>
            <tbody>
              {this.state.clickedRecord.data.map((item, i) => {
                console.log(item)
                return (
                  <tr key={'event_' + i}>
                    <td>{i}</td>
                    <td>{item.url}</td>
                    <td>{item.event}</td>
                    <td>{moment(item.time, TIME_FORMAT).format(TIME_FORMAT)}</td>
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
        // onClick={() => {
        //   if (this.state.clickedRecord !== null) this.setState({clickedRecord: null, clickedRecordIndex: -1})
        // }}
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
                    <td>{moment(fTime, TIME_FORMAT).format(TIME_FORMAT)}</td>
                    <td>{moment(lTime, TIME_FORMAT).format(TIME_FORMAT)}</td>
                    <td>{totalTime / 1000}s</td>
                    <td>
                      <button
                        className={this.state.clickedRecordIndex === i ? 'btn btn-red' : 'btn'}
                        onClick={() => {
                          if (this.state.clickedRecordIndex === i)
                            return this.setState({ clickedRecord: null, clickedRecordIndex: -1 })
                          this.setState({ clickedRecord: item, clickedRecordIndex: i })
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
