import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../components/loading/loading'
import { ContentListContainer } from '../../components/contentListContainer'
import M from "materialize-css"
import produce from "immer";
import API from 'helpers/api.js';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: false,
      activities: [],
      selectedActivity: null,
      selectedActivityId: null,
      editFlag: false
    };
  }

  componentDidMount() {
    M.AutoInit();
    this.getActivities();
  }

  stateHandler = (state) => {
    this.setState(state);
    this.props.parentStateHandler(state);
  }

  getActivities = () => {
    API.getActivities(this.stateHandler);
  }
  onClickAction = (selectedActivityId, selectedActivity) => {
    // console.log(selectedActivityId, selectedActivity)
    this.setState({ selectedActivityId: selectedActivityId, selectedActivity: selectedActivity }, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')))
  }

  editActivity = () => {
    let changedActivity = {
      id: this.state.selectedActivity.id,
      title: this.state.selectedActivity.title,
      shortDescription: this.state.selectedActivity.shortDescription
    };



    this.setState({ apiResponse: false });
    API.updateActivity(changedActivity, this.stateHandler, () => {
      let existingActivityIndex = this.state.activities.findIndex((p) => p.id === this.state.selectedActivity.id);
      const activities = produce(this.state.activities, draft => {
        draft[existingActivityIndex].title = this.state.selectedActivity.title;
        draft[existingActivityIndex].shortDescription = this.state.selectedActivity.shortDescription;
      });

      this.setState({ activities, editFlag: !this.state.editFlag });
    });



  }


  handleTitleChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.title = event.target.value
    });
    this.setState({ selectedActivity });
  }
  handleShortDescriptionChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.shortDescription = event.target.value
    });
    this.setState({ selectedActivity });
  }



  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />)

    return (

      <div className="ManageActivities" >
        <div className="title left-align">
          <div className="row valign-wrapper">
            <div className="col s11 m11 l1">
              <h4>
                Activities
              </h4>
            </div>
            <div className="col s1 m1 l1 align-right">
              <i className="material-icons" onClick={() => (this.state.selectedActivityId ? (this.setState({ editFlag: !this.state.editFlag })) : null)}>edit</i>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="row ">
            <div className="col s12 m4 l3 ">
              <ContentListContainer
                title={'Activities'}
                data={this.state.activities}
                onClickAction={this.onClickAction}
                selectedTaskId={this.state.selectedActivityId} />
            </div>


            <div className="col s8 m8 l8" >
              <div className="card">
                <div className="card-content">

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Activity ID </p>
                    <div className="input-field col s10 l6">
                      <input
                        id="activity-id"
                        type="number"
                        value={this.state.selectedActivityId !== null ? (this.state.selectedActivity.id) : null}
                        disabled="disabled"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Activity Title </p>
                    <div className="input-field col s10   ">
                      <input
                        id="activity-title"
                        type="text"
                        value={this.state.selectedActivityId !== null ? (this.state.selectedActivity.title) : null}
                        disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleTitleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Short Description </p>
                    <div className="col s10 m10 l10">
                      <textarea id="activity-description" type="text" className="materialize-textarea validate" value={this.state.selectedActivityId !== null ? (this.state.selectedActivity.shortDescription) : undefined} disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleShortDescriptionChange} />
                    </div>
                  </div>

                  <button className="btn waves-effect waves-light" type="submit" name="action" disabled={typeof this.state.selectedActivityId === "number" && this.state.editFlag ? "" : "disabled"}
                    onClick={this.editActivity}>Submit
                  <i className="material-icons right">send</i>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <Link className="btn waves-effect waves-light right" id="tasks-link" disabled={this.state.selectedActivityId !== null ? false : "disabled"}
          to={{
            pathname: "/content/programs/modules/" + this.state.selectedActivityId + "/tasks",
            state: { selectedActivity: this.state.selectedActivity }
          }}>
          Tasks
        </Link>

      </div>

    )
  }
}

export default Activities;
