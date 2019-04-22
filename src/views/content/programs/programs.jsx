import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer'
import API from 'helpers/api.js'
import M from "materialize-css"

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

  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />)
    return(
      <div className="ManagePrograms">
        <div className="title left-align">
          <h4>
            Programs
          </h4>
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
                    <input id="program-id" type="number" defaultValue={this.state.selectedProgramId !== null ? (this.state.selectedProgram.id) : null} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false} />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Program Title </p>

                  <div className="input-field col s10">
                    <input id="program-title" type="text" defaultValue={this.state.selectedProgramId !== null ? (this.state.selectedProgram.title) : null} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false} />
                  </div>
                </div>

                <div className="row">
                  <p className="col s2 m2 l2 left-align"> Description </p>

                  <div className="col s10 m10 l10">
                    <textarea id="program-description" type="text" className="materialize-textarea validate" value={this.state.selectedProgramId !== null ? (this.state.selectedProgram.description) : undefined} disabled={this.state.selectedProgramId !== null && !this.state.editFlag ? "disabled" : false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
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
