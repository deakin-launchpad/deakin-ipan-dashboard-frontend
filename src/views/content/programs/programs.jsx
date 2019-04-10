import React, { Component } from 'react';
import API from 'helpers/api.js'
// import M from "materialize-css"

class Programs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: []
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

  render() {
    if (!this.state.programs) return ''
    return (
      <div className="container">
        <h1>
          Programs
        </h1>
        <div className="divider" />
        <div className="row">
          <div className="col s3 collection">
            {
              this.state.programs.map((program) => {
                return (
                  <a key={program.id} href="#!" className="collection-item">{program.title}</a>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Programs;
