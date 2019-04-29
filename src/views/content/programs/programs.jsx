import React, { Component } from 'react';
import API from 'helpers/api.js'
import M from "materialize-css"

class Programs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      selectedProgram: null
    };
  }

  componentDidMount() {
    // M.AutoInit();
    this.getPrograms();
  }

  stateHandler = (state) => {
    this.setState(state);
    this.props.parentStateHandler(state);
  }

  getPrograms = () => {
    API.getPrograms(this.stateHandler);
  }

  selectProgram = (program, e) => {
    this.setState({selectedProgram: program}, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')));
  }

  render() {
    return (
      <div className="container">
        <h1>
          Programs
        </h1>

        <div className="divider" />

        {
          !this.state.programs ? "" :
            <div className="row">
              <div className="col s12 m3 collection">
                {
                  this.state.programs.map((program) => {
                    return (
                      <a key={program.id} href="#!" className={this.state.selectedProgram && program.id === this.state.selectedProgram.id ? "collection-item active" : "collection-item"} onClick={this.selectProgram.bind(this, program)}>{program.title}</a>
                    );
                  })
                }
              </div>
              
              {
                !this.state.selectedProgram ? "" :
                  <div className="col s12 m9 row">
                    <form className="col s12">
                      <div className="row">
                        <div className="input-field col s12">
                          <input disabled value={this.state.selectedProgram.title} id="title" type="text" className="validate" />
                          <label htmlFor="title" className="active">Title</label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="input-field col s12">
                          <textarea disabled value={this.state.selectedProgram.description} id="description" type="text" className="validate materialize-textarea" />
                          <label htmlFor="description" className="active">Description</label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="input-field col s12">
                          <input disabled value={this.state.selectedProgram.coverPhoto} id="coverPhoto" type="text" className="validate" />
                          <label htmlFor="coverPhoto" className="active">Cover Photo</label>
                        </div>
                      </div>
                    </form>
                  </div>
              }
            </div>
      }
      </div>
    );
  }
}

export default Programs;
