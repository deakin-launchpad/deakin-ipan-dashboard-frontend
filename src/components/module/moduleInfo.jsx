import React from 'react';
import API from 'helpers/api.js';
import M from "materialize-css";

class ModuleInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      module: null
    })
  }

  componentWillReceiveProps(){
    this.getModule();
  }

  stateHandler = (state) => {
    this.setState(state);
  }

  getModule = () => {
    API.getModule(this.stateHandler, this.props.programId, this.props.moduleId);
  }

  render(){
    return (
      !this.state.module? "" :
        <div className = "row">
          <form>
            <div className = "row">
              <div className = "input-field">
                <textarea disabled value={this.state.module.title} id="title" type="text" className="validate" />
                <label htmlFor="title" className="active">Title</label>
              </div>
            </div>
            <div className = "row">
              <div className = "input-field">
                <textarea disabled value={this.state.module.shortDescription} id="shortDesc" type="text" className="validate" />
                <label htmlFor="shortDesc" className="active">Short description</label>
              </div>
            </div>
          </form>
        </div>
    )
  }
}

export default ModuleInfo;