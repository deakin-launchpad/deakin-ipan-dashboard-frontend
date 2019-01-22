import React, { Component } from 'react'
import API from 'helpers/api.js'
import moment from 'moment'

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trackingData: null
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

  render() {
    if (!this.state.trackingData) return ''
    return (
      <div className="Home">
        <table className="striped highlight responsive-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Session ID</th>
              <th>Number of events</th>
              <th>Session start</th>
              <th>Session end</th>
              <th>Session total time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.trackingData.map((item, i) => {
              const fTime = item.data[0].time
              const lTime = item.data[item.data.length - 1].time
              const totalTime = Date.parse(lTime) - Date.parse(fTime)
              return (
                <tr key={i}>
                  {console.log(item)}
                  <td>{i}</td>
                  <td>{item._id}</td>
                  <td>{item.data.length}</td>
                  <td>{moment(fTime, TIME_FORMAT).format(TIME_FORMAT)}</td>
                  <td>{moment(lTime, TIME_FORMAT).format(TIME_FORMAT)}</td>
                  <td>{totalTime/1000}s</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Home
