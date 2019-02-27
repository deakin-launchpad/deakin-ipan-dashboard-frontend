import React, { Component } from 'react';
import { BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, Label, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const data = [
  { x: '1', y: 456 },
  { x: '2', y: 230 },
  { x: '3', y: 345 },
  { x: '4', y: 450 },
  { x: '5', y: 321 },
  { x: '6', y: 235 },
  { x: '7', y: 267 },
  { x: '8', y: -378 },
  { x: '9', y: -210 },
  { x: '10', y: -23 },
  { x: '12', y: 45 },
  { x: '13', y: 90 },
  { x: '14', y: 130 },
  { x: '15', y: 11 },
  { x: '16', y: 107 },
  { x: '17', y: 926 },
  { x: '18', y: 653 },
  { x: '19', y: 366 },
  { x: '20', y: 486 },
  { x: '21', y: 512 },
  { x: '22', y: 302 },
  { x: '23', y: 425 },
  { x: '24', y: 467 },
  { x: '25', y: -190 },
  { x: '26', y: 194 },
  { x: '27', y: 371 },
  { x: '28', y: 376 },
  { x: '29', y: 295 },
  { x: '30', y: 322 },
  { x: '31', y: 246 },
  { x: '32', y: 33 },
  { x: '33', y: 354 },
  { x: '34', y: 258 },
  { x: '35', y: 359 },
  { x: '36', y: 192 },
  { x: '37', y: 464 },
  { x: '38', y: -2 },
  { x: '39', y: 154 },
  { x: '40', y: 1086.5 }
];

var intervals = [0]

class GlobalAnalysis extends Component {

  customData = () => {
    /**
     * x = Length of sessions
     * y = Number of sessions
     * 
     * Add length of session to each data item as a key
     * Create an array of intervals
     * For each interval, for each data item, if session length of data item is less than interval i but more than j, record that
     * 
     */
    if (!this.props.parentState.trackingData || this.props.parentState.trackingData.length === 0) return null

    let data = Object.assign([], this.props.parentState.trackingData)

    data = data.map((item) => {
      item.sessionLength = (Date.parse(item.data[item.data.length - 1].time) - Date.parse(item.data[0].time)) / 1000
      let roundedLength = Math.ceil(item.sessionLength / 5) * 5

      if (!intervals.includes(roundedLength)) intervals.push(roundedLength)

      return item
    })

    intervals.sort(function (a, b) {
      return a - b;
    })

    intervals.push(intervals[intervals.length - 1] + 5)

    let plot = []

    for (var i = 1; i < intervals.length; ++i) {
      let numberOfSessions = 0
      for (var j = 0; j < data.length; ++j) {
        if (intervals[i - 1] <= data[j].sessionLength && data[j].sessionLength < intervals[i]) numberOfSessions++
      }
      plot.push({ x: intervals[i - 1], y: numberOfSessions })
    }
    return plot
  }

  render() {
    if (!this.props.parentState.trackingData || this.props.parentState.trackingData.length === 0)
      return (
        <div>
          <h1>
            No data for analysis yet!
          </h1>
        </div>
      )

    return (
      // TODO: Add units to hover box
      <div>
        <h3>
          Global analytics
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={this.customData() || data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="x" unit='s' label={{ value: 'Session length', position: 'insideBottom', offset: 0 }} />
            <YAxis>
              <Label angle={-90} value='Number of sessions' position='insideLeft' style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <ReferenceLine y={0} stroke='#000' />
            {/* <Brush dataKey='x' height={30} stroke="#8884d8" /> */}
            <Bar dataKey="y" fill="#8884d8" name='Number of sessions more than the session length' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default GlobalAnalysis;
