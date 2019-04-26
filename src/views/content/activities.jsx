import React from 'react';
import ItemList from 'components/itemList.jsx';
import ActivityDetails from 'components/activityDetails.jsx';
import API from 'helpers/api.js';

class Activities extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      selectedActivity: null,
      activitiesData: null
    })
  }

  componentDidMount(){
    this.getActivities();
  }

  stateHandler = (state) => {
    this.setState(state);
    this.props.parentStateHandler(state);
  }

  selectActivity = (activity) => {
    this.stateHandler({selectedActivity: activity});
  }

  getActivities = () => {
    API.getActivitiesData(this.stateHandler);
  }
  

  render(){
    return (
      <div>
        <h2 className = "left-align"> Activities</h2>
        <div className="divider" />
        {
          !this.state.activitiesData ? "":
          <div className = "row">
            <div className = "col s4 m4 l4">
              <ItemList items = {this.state.activitiesData} onClick = {this.selectActivity} selectedItem = {this.state.selectedActivity}/>
            </div>
            {
              !this.state.selectedActivity? "":
                <div className = "col s8 m8 l8">
                  <ActivityDetails activity = {this.state.selectedActivity}/>
                </div>
            }
        </div>
        }
      </div>
    )
  }
}

export default Activities;