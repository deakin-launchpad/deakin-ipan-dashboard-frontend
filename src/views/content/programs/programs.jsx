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
      selectedProgram: null,
      selectedProgramId: null,
      editFlag: false
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

  getPrograms = () => {
    API.getPrograms(this.stateHandler);
  }

  onClickAction = (selectedProgramId, selectedProgram) => {
    this.setState({ selectedProgramId: selectedProgramId, selectedProgram: selectedProgram }, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')))
  }

  editProgram = () => {
    let changedProgram = {
      id: this.state.selectedProgram.id,
      title: this.state.selectedProgram.title,
      description: this.state.selectedProgram.description
    };

    this.setState({ apiResponse: false });
    API.updateProgram(changedProgram, this.stateHandler, () => {
      let existingProgramIndex = this.state.programs.findIndex((p) => p.id === this.state.selectedProgram.id);
      const programs = produce(this.state.programs, draft => {
        draft[existingProgramIndex].title = this.state.selectedProgram.title;
        draft[existingProgramIndex].description = this.state.selectedProgram.description;
      });

      this.setState({ programs, editFlag: !this.state.editFlag });
    });
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
            <ContentListContainer title={'Programs'} data={this.state.programs} onClickAction={this.onClickAction} selectedTaskId={this.state.selectedProgramId} />
          </div>
          
          <div className="col s8 m8 l8">
            <div className="card">
              <div className="card-content">
                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Program ID </p>

                  <div className="input-field col s10">
                    <input id="program-id" type="number" value={this.state.selectedProgramId !== null ? (this.state.selectedProgram.id) : null} disabled="disabled" />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Program Title </p>

                  <div className="input-field col s10">
                    <input id="program-title" type="text" value={this.state.selectedProgramId !== null ? (this.state.selectedProgram.title) : null} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false}
                    onChange={this.handleTitleChange} />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Description </p>

                  <div className="col s10 m10 l10">
                    <textarea id="program-description" type="text" className="materialize-textarea validate" value={this.state.selectedProgramId !== null ? (this.state.selectedProgram.description) : undefined} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false}
                    onChange={this.handleDescriptionChange} />
                  </div>
                </div>

                <button className="btn waves-effect waves-light" type="submit" name="action" disabled={typeof this.state.selectedProgramId === "number" && this.state.editFlag ? "" : "disabled"}
                        onClick={this.editProgram}>Submit
                  <i className="material-icons right">send</i>
                </button>
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
