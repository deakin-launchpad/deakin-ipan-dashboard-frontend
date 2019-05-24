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
      newModuleData: {id:'', title:'', shortDescription:'', sections: []},// to solve React warning of changing between controlled and uncontrolled input
      editFlag: false,
      message: { text: '', type: '' }
    })
  }

  componentDidMount(){
    M.AutoInit();
    this.getModules();
  }

  stateHandler = (state) => {
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
    this.setState({ selectedModuleId: selectedModuleId, selectedModuleData: selectedModuleData, editFlag: false, message: { text: '', type: '' } },
      this.resizeTextArea);
  }

  onCreateAction = () => {
    this.setState({selectedModuleId: null, editFlag: false, message: { text: '', type: '' }});
  }

  getModules = () => {
    API.getModules(this.stateHandler);
  }

  resizeTextArea = () =>{
    document.querySelectorAll('.materialize-textarea').forEach(textarea => {
      M.textareaAutoResize(textarea);
    })
  }
  
  editModule = () => {
    //work around the "_id" issue in module sections by delete the "_id" field when send data to server
    let updatedModuleData = this.state.selectedModuleData;
    updatedModuleData.sections.map(section=>{
      return delete section._id;
    });
    API.updateModule(updatedModuleData, this.stateHandler, () => {
      let updatedModuleIndex = this.state.modulesData.findIndex((p) => p.id === this.state.selectedModuleId);
      let updatedModulesData = JSON.parse(JSON.stringify(this.state.modulesData));
      updatedModulesData[updatedModuleIndex] = this.state.selectedModuleData;
      this.setState({ modulesData: updatedModulesData, editFlag: false, 
        message: { text: "Module updated!", type: "success" }}, this.resizeTextArea);
    }, (error) => this.setState({ message: { text: error.response.data.message, type: "" }}));
  }

  createModule = () => {
    let newModuleData = {
      id: this.state.newModuleData.id,
      title: this.state.newModuleData.title,
      shortDescription: this.state.newModuleData.shortDescription,
      sections: this.state.newModuleData.sections,
      tasks: [],//TODO
      activities: [],//TODO
      goals: [],//TODO
      refreshers: [],//TODO
      pills: [],//TODO
      notifications: [],//TODO
      prerequisities: {}//TODO
    }
    API.createModule(newModuleData, this.stateHandler, () => {
      let updatedModulesData = JSON.parse(JSON.stringify(this.state.modulesData));
      updatedModulesData.push(newModuleData);
      this.setState({ modulesData: updatedModulesData, newModuleData: {id:'', title:'', shortDescription:'', sections: []},
        message: { text: "Module created!", type: "success" }}, this.resizeTextArea);
    }, (error) => this.setState({ message: { text: error.response.data.message, type: "" }}));
  }

  handleIdChange = (event) => {
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.id = event.target.value;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });// update selected module
      else this.setState({ newModuleData: updatedModuleData }); //or update a new module
  }

  handleTitleChange = (event) => {
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.title = event.target.value;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  handleDescriptionChange = (event) => {
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.shortDescription = event.target.value;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  handleSectionChange = (event, index) => {
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.sections[index].data.value = event.target.value;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  handleSectionTypeChange = (event, index) =>{
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.sections[index].type = event.target.value;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  handleAddSection = () => {
    let addedSection = {
      type: "TEXT",
      data: {
        value: "",
        misc: []
      }
    }
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    updatedModuleData.sections.push(addedSection);
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  handleRemoveSection = (removeIndex) => {
    let updatedModuleData;
    if (this.state.selectedModuleId !== null)
      updatedModuleData = JSON.parse(JSON.stringify(this.state.selectedModuleData));
      else updatedModuleData = JSON.parse(JSON.stringify(this.state.newModuleData));
    let updatedSections = updatedModuleData.sections.filter((section,index)=>{
      return index !== removeIndex;
    });
    updatedModuleData.sections = updatedSections;
    if (this.state.selectedModuleId !== null)
      this.setState({ selectedModuleData: updatedModuleData });
      else this.setState({ newModuleData: updatedModuleData });
  }

  renderSections = () => {
    let renderModule;
    if (this.state.selectedModuleId !== null)
      renderModule = this.state.selectedModuleData;
      else renderModule = this.state.newModuleData;
    return(
      renderModule.sections.map((section,index) =>{
        return (
          <div className="row" key = {index}>
            <div className="input-field col s2 m2 l2">
              <p>Section type</p>
              <select className = "browser-default" value = {section.type} disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                  onChange = {(e)=>this.handleSectionTypeChange(e, index)}>
                <option value="">Choose section type</option>
                <option value="TEXT">TEXT</option>
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
              </select>
              {/* section remove */}
              <button className="btn waves-effect waves-light center" disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                onClick = {()=>this.handleRemoveSection(index)}>
                <i className="material-icons">remove</i>
              </button>
            </div>
            {this.renderSection(section, index)}
          </div>
          )
      })
    )
  }
  renderSection = (section, index) => {
    switch (section.type) {
      case "TEXT":
        return (
          <div className = "col s10 m10 l10">
            <div className="row">
              <div className="input-field col s12 m12 l12">
              <textarea id="section-text" type="text" className = "materialize-textarea validate"
                value={section.data.value} disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                onChange={(e)=>this.handleSectionChange(e, index)} />
              </div>
            </div>
          </div>
        );
       
      case "VIDEO":
        return (
          <div className = "col s10 m10 l10">
            <div className="row">
              <div className="input-field col s12 m12 l12">
                <textarea id="section-videoURL" type="text" className = "materialize-textarea validate"
                  value={section.data.value} disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                  onChange={(e)=>this.handleSectionChange(e, index)}/>
              </div>            
            </div>
            <div className = "row">
              <div className = "col s12 m12 l12 ">
                <div className="video-container">
                  <iframe src={section.data.value} name = {"iframe_" + index}></iframe>
                </div>
              </div>
            </div>
          </div>
        );

      case "IMAGE":
        return (
          <div className = "col s10 m10 l10">
            <div className="row">
              <div className="input-field col s12 m12 l12">
                <textarea id="section-imageURL" type="text" className = "materialize-textarea validate"
                  value={section.data.value} disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                  onChange={(e)=>this.handleSectionChange(e, index)}/>
              </div> 
            </div>
            <div className = "row">
              <div className = "col s12 m12 l12 ">
                <img className ="responsive-img" src = {section.data.value} alt = {"image_" + index}></img>
               </div> 
            </div>
          </div>
        );
      default:
        return(
          <div>
          </div>
        );
      
    }
  }

  render(){
    if (!this.state.apiResponse) return (<LoadingComponent />);
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
              <i className="material-icons" onClick={() => (this.state.selectedModuleId !== null ? (this.setState({ editFlag: !this.state.editFlag})) : null )}>edit</i>
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
                  onCreateAction={this.onCreateAction}
                  selectedTaskId={this.state.selectedModuleId}
                />
            </div>

            {
              // !this.state.selectedModuleId? "":
              <div className="col s8 m8 l8">
                <div className="card">
                  <div className="card-content">
                    {/* module ID */}
                    <div className="row">                    
                      <p className="col s2 m2 l2 left-align"> Module ID </p>
                      <div className="input-field col s10">
                        <input id="module-id" type="text" 
                          value= {this.state.selectedModuleId !== null?this.state.selectedModuleData.id:this.state.newModuleData.id}
                          disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                          onChange={this.handleIdChange} />
                      </div>
                    </div>
                    {/* module title */}
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Module Title </p>
                      <div className="input-field col s10">
                        <input id="module-title" type="text" className = "materialize-textarea validate"
                          value={this.state.selectedModuleId !== null?this.state.selectedModuleData.title:this.state.newModuleData.title}
                          disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                          onChange={this.handleTitleChange}/>
                      </div>
                    </div>
                    {/* module description */}
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Module short description </p>
                      <div className="input-field col s10">
                        <textarea id="module-desc" type="text" className = "materialize-textarea validate"
                          value={this.state.selectedModuleId !== null?this.state.selectedModuleData.shortDescription:this.state.newModuleData.shortDescription} 
                          disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                          onChange={this.handleDescriptionChange}/>
                      </div>
                    </div>
                    {/* module sections */}
                    {this.renderSections()}
                    {/* sections add*/}
                    <div className = "row">
                      <button className="btn waves-effect waves-light left" disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                        onClick = {this.handleAddSection}>
                        <i className="material-icons">add</i>
                      </button>
                    </div>

                    {/* submit button */}
                    <button className="btn waves-effect waves-light" type="submit" name="action" 
                      disabled={this.state.selectedModuleId !== null && !this.state.editFlag ? "disabled" : false}
                      onClick={this.state.selectedModuleId !== null?this.editModule:this.createModule}>{this.state.selectedModuleId !== null?"Submit":"Create"}
                      <i className="material-icons right">send</i>
                    </button>
                    <div className="row">
                      <span className={this.state.message.type === "success" ? "light-green-text text-accent-3" : "red-text text-accent-3"}>{this.state.message.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {/* Link to activities and tasks */}
        {this.state.selectedModuleId === null? "":   
          <Link className="btn waves-effect waves-light right" id="activities-link" disabled={this.state.selectedProgramId !== null ? false : "disabled"}
            to={{
              pathname: "/content/programs/" + this.props.location.state.selectedProgram.id + "/modules/" + this.state.selectedModuleId + "/activities",
              state: {selectedModuleData: this.state.selectedModuleData}
            }}>
            Activities
          </Link>
        }
        {this.state.selectedModuleId === null? "":
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
