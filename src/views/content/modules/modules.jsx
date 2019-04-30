import React from 'react';
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer.jsx';
import API from 'helpers/api.js';
import M from "materialize-css";

class Modules extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      apiResponse: false,
      modulesData: [],
      selectedModuleId: null,
      selectedModuleData: null,
      editFlag: false,
    })
  }

  componentDidMount(){
    M.AutoInit();
    this.getModules();
  }

  stateHandler = (state) => {
    // console.log("stateHandler");
    // console.log(state);
    this.setState(state);
  }

  onClickAction = (selectedModuleId, selectedModuleData) => {
    this.setState({ selectedModuleId: selectedModuleId, selectedModuleData: selectedModuleData });
  }

  getModules = () => {
    API.getModules(this.stateHandler);
  }

  render(){
    if (!this.state.apiResponse) return (<LoadingComponent />)
    return (
      <div className = "ManageModules">
        <div className="title left-align">
          <div className="row valign-wrapper">
            <div className="col s11 m11 l11">
              <h4>
                Modules
              </h4>
            </div>
            <div className="col s1 m1 l1 right-align">
              <i className="material-icons" onClick={() => (this.state.selectedModuleId ? (this.setState({ editFlag: !this.state.editFlag})) : null )}>edit</i>
            </div>
          </div>
        </div>

        <div className ="content-area">
          <div className = "row">
            <div className="col s4 m4 l4">
                <ContentListContainer
                  title={'Modules'}
                  data={this.state.modulesData}
                  onClickAction={this.onClickAction}
                  selectedTaskId={this.state.selectedModuleId}
                />
            </div>

            {
              !this.state.selectedModuleId? "":
              <div className="col s8 m8 l8">
                <div className="card">
                  <div className="card-content">
                    {/* module ID */}
                    <div className="row">                    
                      <p className="col s2 m2 l2 left-align"> Module ID </p>
                      <div className="input-field col s10">
                        <input id="module-id" type="number" 
                          value= {this.state.selectedModuleId} disabled="disabled" />
                      </div>
                    </div>
                    {/* module title */}
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Module Title </p>
                      <div className="input-field col s10">
                        <input id="module-title" type="text" 
                          value={this.state.selectedModuleData.title} disabled={!this.state.editFlag ? "disabled" : false}/>
                      </div>
                    </div>
                    {/* module description */}
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Module short description </p>
                      <div className="input-field col s10">
                        <textarea id="module-desc" type="text" className = "materialize-textarea validate"
                          value={this.state.selectedModuleData.shortDescription} disabled="disabled"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Modules;