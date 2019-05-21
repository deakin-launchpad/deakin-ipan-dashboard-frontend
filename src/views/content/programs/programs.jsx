import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer'
import API from 'helpers/api.js'
import M from "materialize-css"
import produce from "immer";

class Programs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: false,
      programs: [],
      selectedProgram: {},
      selectedProgramId: null,
      editFlag: false,
      message: { text: '', type: '' }
    };
  }

  componentDidMount() {
    M.AutoInit();
    this.getPrograms();
  }

  stateHandler = (state) => {
    this.setState(state);
    this.props.parentStateHandler(state);
  }

  resetForm = () => {
    this.setState({ editFlag: false, message: { text: '', type: '' } })
  }

  getPrograms = () => {
    API.getPrograms(this.stateHandler);
  }

  onClickAction = (selectedProgramId, selectedProgram) => {
    this.setState({ selectedProgramId: selectedProgramId, selectedProgram: selectedProgram }, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')));
    this.resetForm();
  }

  onCreateAction = () => {
    this.setState({ selectedProgramId: null, selectedProgram: { id: '', title: '', description: '', coverPhoto: '' } });
    this.resetForm();
  }

  createEditProgram = () => {
    let changedProgram = {
      id: this.state.selectedProgram.id ? this.state.selectedProgram.id : undefined,
      title: this.state.selectedProgram.title,
      description: this.state.selectedProgram.description,
      coverPhoto: this.state.selectedProgram.coverPhoto
    };

    if (changedProgram.id) {
      API.updateProgram(changedProgram, this.stateHandler, () => {
        let existingProgramIndex = this.state.programs.findIndex((p) => p.id === this.state.selectedProgram.id);
        const programs = produce(this.state.programs, draft => {
          draft[existingProgramIndex].title = this.state.selectedProgram.title;
          draft[existingProgramIndex].description = this.state.selectedProgram.description;
          draft[existingProgramIndex].coverPhoto = this.state.selectedProgram.coverPhoto;
        });

        this.setState({ programs, editFlag: !this.state.editFlag, message: { text: "Program updated!", type: "success" } });
      }, (error) => this.setState({ message: { text: error.response.data.message, type: "" } }));
    } else {
      API.createProgram(changedProgram, this.stateHandler, () => {
        this.getPrograms();
        this.setState({ message: { text: "Program created!", type: "success" } })
      }, (error) => this.setState({ message: { text: error.response.data.message, type: "" } }));
    }
  }

  handleTitleChange = (event) => {
    const selectedProgram = produce(this.state.selectedProgram, draft => {
      draft.title = event.target.value
    });
    this.setState({ selectedProgram });
  }

  handleDescriptionChange = (event) => {
    const selectedProgram = produce(this.state.selectedProgram, draft => {
      draft.description = event.target.value
    });
    this.setState({ selectedProgram });
  }

  handleCoverPhotoChange = (event) => {
    const selectedProgram = produce(this.state.selectedProgram, draft => {
      draft.coverPhoto = event.target.value
    });
    this.setState({ selectedProgram });
  }

  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />)
    return(
      <div className="ManagePrograms">
        <div className="title left-align">
          <div className="row valign-wrapper">
            <div className="col s11 m11 l11">
              <h4>
                Programs
              </h4>
            </div>
            <div className="col s1 m1 l1 right-align">
              <i className="material-icons" onClick={() => (this.state.selectedProgramId ? (this.setState({ editFlag: !this.state.editFlag})) : null )}>edit</i>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s4 m4 l4">
            <ContentListContainer title={'Programs'} data={this.state.programs} onClickAction={this.onClickAction} onCreateAction={this.onCreateAction} selectedTaskId={this.state.selectedProgramId} />
          </div>
          
          <div className="col s8 m8 l8">
            <div className="card">
              <div className="card-content">
                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Program ID </p>

                  <div className="input-field col s10">
                    <input id="program-id" type="number" value={this.state.selectedProgram.id} disabled="disabled" />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Program Title </p>

                  <div className="input-field col s10">
                    <input id="program-title" type="text" value={this.state.selectedProgram.title} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false}
                    onChange={this.handleTitleChange} />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Description </p>

                  <div className="col s10 m10 l10">
                    <textarea id="program-description" type="text" className="materialize-textarea validate" value={this.state.selectedProgram.description} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false}
                    onChange={this.handleDescriptionChange} />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Cover Photo Url </p>

                  <div className="input-field col s10">
                    <input id="program-cover-photo" type="text" value={this.state.selectedProgram.coverPhoto} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false}
                    onChange={this.handleCoverPhotoChange} />
                  </div>
                </div>

                <button className="btn waves-effect waves-light" type="submit" name="action" disabled={typeof this.state.selectedProgramId !== "number" || this.state.editFlag ? "" : "disabled"}
                        onClick={this.createEditProgram}>{typeof this.state.selectedProgramId !== "number" ? "Create" : "Submit"}
                  <i className="material-icons right">send</i>
                </button>
                
                <div className="row">
                  <span className={this.state.message.type === "success" ? "light-green-text text-accent-3" : "red-text text-accent-3"}>{this.state.message.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link className="btn waves-effect waves-light right" id="modules-link" disabled={this.state.selectedProgramId !== null ? false : "disabled"}
          to={{
            pathname: "/content/programs/" + this.state.selectedProgramId + "/modules",
            state: {selectedProgram: this.state.selectedProgram}
          }}>
          Modules
        </Link>
      </div>
    )
  }
}

export default Programs;
