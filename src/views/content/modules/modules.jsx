import React from 'react';
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer.jsx';
import API from 'helpers/api.js';
import M from "materialize-css";
import { Link } from 'react-router-dom';

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
    if (this.props.location.state)
      this.validateModules(this.props.location.state.selectedProgram);
  }

  validateModules = (program) => {
    let validatedModulesData = this.state.modulesData.filter((moduleData)=>{
      if (!program.modules) return false;
      else return (program.modules.includes(moduleData.id)); 
    })
    this.setState({modulesData : validatedModulesData});
  }

  onClickAction = (selectedModuleId, selectedModuleData) => {
    this.setState({ selectedModuleId: selectedModuleId, selectedModuleData: selectedModuleData },
      () =>{
        document.querySelectorAll('.materialize-textarea').forEach(textarea => {
          M.textareaAutoResize(textarea);
        })
      });
  }

  getModules = () => {
    API.getModules(this.stateHandler);
  }

  renderSection = (section) => {
    switch (section.type) {
      case "TEXT":
        return (
          <div className="row">
            <p className="col s2 m2 l2 left-align"> Section type: TEXT </p>
            <div className="input-field col s10">
              <textarea id="section-text" type="text" className = "materialize-textarea validate"
                value={section.data.value} disabled="disabled"/>
            </div>
          </div>
        );
       
      case "VIDEO":
        return (
          <div>
            <div className="row">
              <p className="col s2 m2 l2 left-align"> Section type: VIDEO </p>
              <div className="input-field col s10">
                <textarea id="section-videoURL" type="text" className = "materialize-textarea validate"
                  value={section.data.value} disabled="disabled"/>
              </div>            
            </div>
            <div className = "row">
              <div className = "offset-s2 offset-m2 offset-l2 col s10 m10 l10 ">
                <div className="video-container">
                  <iframe src={section.data.value}></iframe>
                </div>
              </div>
            </div>
          </div>
        );

      case "IMAGE":
        return (
          <div>
            <div className="row">
              <p className="col s2 m2 l2 left-align"> Section type: IMAGE </p>
              <div className="input-field col s10">
                <textarea id="section-imageURL" type="text" className = "materialize-textarea validate"
                  value={section.data.value} disabled="disabled"/>
              </div> 
            </div>
            <div className = "row">
              <div className = "offset-s2 offset-m2 offset-l2 col s10 m10 l10 ">
                <img className ="responsive-img" src = {section.data.value}></img>
               </div> 
            </div>
          </div>
        );
      
    }
  }

  render(){
    if (!this.state.apiResponse) return (<LoadingComponent />)
    return (
      <div className = "ManageModules">
        {/* back button */}
        <div className = "row">
          <Link className="btn waves-effect waves-light left"
              to={{
                pathname: "/content/programs/"
              }}>
            <i className="material-icons center">arrow_back</i>
          </Link>
        </div>

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
                    {/* module sections */}
                    {
                      this.state.selectedModuleData.sections.length > 0 ? (
                        this.state.selectedModuleData.sections.map(section =>{
                          return (
                            <div key = {section._id}>
                              {this.renderSection(section)}
                            </div>
                            )
                        })
                      ) : <div></div>
                    }
                    {/* submit button */}
                    <button className="btn waves-effect waves-light" type="submit" name="action" disabled={!this.state.editFlag ? "disabled" : false}
                        onClick={this.editModule}>Submit
                      <i className="material-icons right">send</i>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {/* Link to activities and tasks */}
        {!this.state.selectedModuleId? "":   
          <Link className="btn waves-effect waves-light right" id="activities-link" disabled={this.state.selectedProgramId !== null ? false : "disabled"}
            to={{
              pathname: "/content/programs/" + this.props.location.state.selectedProgram.id + "/modules/" + this.state.selectedModuleId + "/activity",
              state: {selectedModuleData: this.state.selectedModuleData}
            }}>
            Activities
          </Link>
        }
        {!this.state.selectedModuleId? "":
          <Link className="btn waves-effect waves-light right" id="activities-link" disabled={this.state.selectedProgramId !== null ? false : "disabled"}
            to={{
              pathname: "/content/programs/" + this.props.location.state.selectedProgram.id + "/modules/" + this.state.selectedModuleId + "/tasks",
              state: {selectedModuleData: this.state.selectedModuleData}
            }}>
            Tasks
          </Link>
        }
      </div>
    )
  }
}

export default Modules;