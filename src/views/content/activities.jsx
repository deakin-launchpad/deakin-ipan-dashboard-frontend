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
      selectedActivity: {},
      selectedActivityId: null,
      editFlag: false,
      message: { text: '', type: '' }
    };
  }

  componentDidMount() {
    M.AutoInit();
    this.getActivities();
  }

  stateHandler = (state) => {
    this.setState(state);
    if (this.props.location.state)
      this.validateActivities(this.props.location.state.selectedModuleData);
  }
  validateActivities = (module) => {
    let validatedActivities = this.state.activities.filter((activities) => {
      if (!module.activities) return false;
      else return (module.activities.includes(activities.id));
    });
    this.setState({ activities: validatedActivities });
  }

  resetForm = () => {
    this.setState({ editFlag: false, message: { text: '', type: '' } })
  }


  getActivities = () => {
    API.getActivities(this.stateHandler);
  }
  onClickAction = (selectedActivityId, selectedActivity) => {
    this.setState({ selectedActivityId: selectedActivityId, selectedActivity: selectedActivity }, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')));
    this.resetForm();
  }

  onCreateAction = () => {
    this.setState({ selectedActivityId: null, selectedActivity: { id: '', title: '', shortdescription: '', coverPhoto: '' } });
    this.resetForm();
  }

  createEditActivity = () => {
    let changedActivity = {
      id: this.state.selectedActivity.id ? this.state.selectedActivity.id : undefined,
      title: this.state.selectedActivity.title,
      shortDescription: this.state.selectedActivity.shortDescription,
      coverPhoto: this.state.selectedActivity.coverPhoto
    };

    if (changedActivity.id) {
      API.updateActivity(changedActivity, this.stateHandler, () => {
        let existingActivityIndex = this.state.activities.findIndex((p) => p.id ===
          this.state.selectedActivityId);
        const activities = produce(this.state.activities, draft => {
          draft[existingActivityIndex].title = this.state.selectedActivity.title;
          draft[existingActivityIndex].shortDescription = this.state.selectedActivity.shortDescription;
          draft[existingActivityIndex].coverPhoto = this.state.selectedActivity.coverPhoto;

        });

        this.setState({ activities, editFlag: !this.state.editFlag, message: { text: "activityUpdated!", type: "success" } });
      }, (error) => this.setState({
        message: { text: error.response.data.message, type: "" }
      }));
    } else {
      API.createActivity(changedActivity, this.stateHandler, () => {
        this.getActivities();
        this.setState({ message: { text: "Activity created!", type: "success" } })
      }, (error) => this.setState({ message: { text: error.response.data.message, type: "" } }));
    }
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
  handleCoverPhotoChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.coverPhoto = event.target.value
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
                onCreateAction={this.onCreateAction}
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
                        value={this.state.selectedActivityId}
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
                        value={this.state.selectedActivity.title}
                        disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleTitleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Short Description </p>
                    <div className="col s10 m10 l10">
                      <textarea id="activity-description" type="text" className="materialize-textarea validate" value={this.state.selectedActivity.shortDescription} disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleShortDescriptionChange} />
                    </div>
                  </div>

                  <p className="col s2 m2 l2 left-align"> Cover Photo Url </p>

                  <div className="input-field col s10">
                    <input id="activity-cover-photo" type="text" value={this.state.selectedActivity.coverPhoto} disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                      onChange={this.handleCoverPhotoChange} />
                  </div>
                </div>

                <button className="btn waves-effect waves-light" type="submit" name="action" disabled={typeof this.state.selectedActivityId !== "number" || this.state.editFlag ? "" : "disabled"}
                  onClick={this.createEditActivity}>{typeof this.state.selectedActivityId !== "number" ? "Create" : "Submit"}
                  <i className="material-icons right">send</i>
                </button>
                <div className="row">
                  <span className={this.state.message.type === "success" ? "light-green-text text-accent-3" : "red-text text-accent-3"}>{this.state.message.text}</span>
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

      </div >

    )
  }
}

export default Activities;
