import React from 'react';
import ItemList from 'components/itemList.jsx';
import ModuleInfo from 'components/module/moduleInfo.jsx';
import API from 'helpers/api.js';

class Modules extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      numberOfModule: 0,
      program: null,
      selectedModule: null
    })
  }

  componentDidMount(){
    this.getProgram();
  }

  stateHandler = (state) => {
    this.setState(state);
    this.props.parentStateHandler(state);
  }

  selectModule = (module) => {
    this.stateHandler({selectedModule: module});
  }

  getProgram = () => {
    API.getProgram(this.stateHandler, this.props.match.params.p_id);
  }
  

  render(){
    return (
      <div className = "container">
        <h2 className = "left-align"> Modules</h2>
        <div className="divider" />
        {
          !this.state.program ? "":
          <div className = "row">
            <div className = "col s3 m3">
              <ItemList items = {this.state.program.modules} onClick = {this.selectModule} selectedItem = {this.state.selectedModule}/>
            </div>
            {
              !this.state.selectedModule? "":
                <div className = "col s9 m9">
                  <ModuleInfo programId = {this.props.match.params.p_id} moduleId = {this.state.selectedModule.id}/>
                </div>
            }
        </div>
        }
      </div>
    )
  }
}

export default Modules;