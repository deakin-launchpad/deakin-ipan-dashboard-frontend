import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LoadingComponent from '../../components/loading/loading'
import { ContentListContainer } from '../../components/contentListContainer'
import API from '../../helpers/api'

class ManageTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: null,
      apiResponse: false,
      selectedTaskId: 0,
    };
  }

  stateHandler = (state) => {
    this.setState(
      state
    )
  }

  componentDidMount() {
    this.getTasksData()
  }

  getTasksData = () => {
    API.getTasksData(this.stateHandler);
  }

  onClickAction = (selectedTaskId) => {
    this.setState({ selectedTaskId: selectedTaskId })
  }

  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />);
    return(
      <div className="ManageTasks">

        <div className="title left-align">
          <h4>
            Tasks
          </h4>
        </div>

        <ContentListContainer title={'Tasks'} data={this.state.tasksData} onClickAction={this.onClickAction} selectedTaskId={this.state.selectedTaskId} />
        
      </div>
    )
  }
}

export default ManageTask
