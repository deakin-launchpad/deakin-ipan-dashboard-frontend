import React, { Component } from 'react';
import LoadingComponent from '../../components/loading/loading'
import { ContentListContainer } from '../../components/contentListContainer'
import M from "materialize-css"
import produce from "immer";
import API from 'helpers/api.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const htmlToText = require('html-to-text');

let TEXT_EDITOR_VALUE

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: false,
      activities: [],
      selectedActivity: {},
      selectedActivityId: null,
      editFlag: false,
      message: { text: '', type: '' },
      text: '',
    };
  }

  handleTextEditorChange = (value) => {
    console.log(TEXT_EDITOR_VALUE)
    return TEXT_EDITOR_VALUE = value
  }

  savePlainText = () => {
    // const convertHTMLToText = htmlToText.fromString(TEXT_EDITOR_VALUE, {
    //   wordwrap: 130
    // });
    // let sectionsArr = this.state.newModuleData.sections
    // let obj = { data: { misc: [], value: convertHTMLToText }, type: "TEXT" }
    // sectionsArr.splice(1, 0, obj)
    // this.setState({
    //   newModuleData: { id: this.state.newModuleData.id, title: this.state.newModuleData.title, shortDescription: this.state.newModuleData.shortDescription, sections: sectionsArr }
    // })
  }

  saveHTML = () => {
    // let isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i)

    // // Check if section array[0] got value as HTML
    // // If true then replace the 0 element
    // // Otherwise Add obj at position 0
    // let sectionsArr = this.state.newModuleData.sections.slice()
    // let checkArrayIsHTML = (sectionsArr.length > 0 ? isHTML(sectionsArr[0].data.value) : false)

    // if (!checkArrayIsHTML) {
    //   let obj = { data: { misc: [], value: TEXT_EDITOR_VALUE }, type: "TEXT" }
    //   sectionsArr.push(obj)
    //   this.setState({
    //     newModuleData: { id: this.state.newModuleData.id, title: this.state.newModuleData.title, shortDescription: this.state.newModuleData.shortDescription, sections: sectionsArr }
    //   })
    // } else {
    //   let obj = { data: { misc: [], value: TEXT_EDITOR_VALUE } }
    //   sectionsArr[0] = obj
    //   this.setState({
    //     newModuleData: { id: this.state.newModuleData.id, title: this.state.newModuleData.title, shortDescription: this.state.newModuleData.shortDescription, sections: sectionsArr }
    //   })
    // }
  }

  exportToHTML = () => {
    // const element = document.createElement("a");
    // const file = new Blob([TEXT_EDITOR_VALUE], { type: 'text/html' });
    // element.href = URL.createObjectURL(file);
    // element.download = "modules_section.html";
    // document.body.appendChild(element); // Required for this to work in FireFox
    // element.click();
  }

  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'color',
    'link', 'image', 'video'
  ]

  stateHandler = (state) => {
    this.setState(state);
    if (this.props.location.state)
      this.validateModules(this.props.location.state.selectedProgram);
  }

  componentDidMount() {
    M.AutoInit();
    this.getActivities();
  }

  componentDidUpdate() {
    M.Modal.init(document.querySelectorAll('.modal'))
  }

  stateHandler = (state) => {
    this.setState(state);
    if (this.props.location.state)
      this.validateActivities(this.props.location.state.selectedModuleData);
  }
  validateActivities = (module) => {
    let validatedActivities = this.state.activities.filter((activities) => {
      if (!module.activities) return false;
      else return (module.activities.includes(activities.id));
    });
    this.setState({ activities: validatedActivities });
  }

  resetForm = () => {
    this.setState({ editFlag: false, message: { text: '', type: '' } })
  }


  getActivities = () => {
    API.getActivities(this.stateHandler);
  }
  onClickAction = (selectedActivityId, selectedActivity) => {
    this.setState({ selectedActivityId: selectedActivityId, selectedActivity: selectedActivity }, () => M.textareaAutoResize(document.querySelector('.materialize-textarea')));
    this.resetForm();
  }

  onCreateAction = () => {
    this.setState({ selectedActivityId: null, selectedActivity: { id: '', title: '', shortdescription: '', coverPhoto: '' } });
    this.resetForm();
  }

  createEditActivity = () => {
    let changedActivity = {
      id: this.state.selectedActivity.id ? this.state.selectedActivity.id : undefined,
      title: this.state.selectedActivity.title,
      shortDescription: this.state.selectedActivity.shortDescription,
      coverPhoto: this.state.selectedActivity.coverPhoto
    };

    if (changedActivity.id) {
      API.updateActivity(changedActivity, this.stateHandler, () => {
        let existingActivityIndex = this.state.activities.findIndex((p) => p.id ===
          this.state.selectedActivityId);
        const activities = produce(this.state.activities, draft => {
          draft[existingActivityIndex].title = this.state.selectedActivity.title;
          draft[existingActivityIndex].shortDescription = this.state.selectedActivity.shortDescription;
          draft[existingActivityIndex].coverPhoto = this.state.selectedActivity.coverPhoto;

        });

        this.setState({ activities, editFlag: !this.state.editFlag, message: { text: "activityUpdated!", type: "success" } });
      }, (error) => this.setState({
        message: { text: error.response.data.message, type: "" }
      }));
    } else {
      API.createActivity(changedActivity, this.stateHandler, () => {
        this.getActivities();
        this.setState({ message: { text: "Activity created!", type: "success" } })
      }, (error) => this.setState({ message: { text: error.response.data.message, type: "" } }));
    }
  }


  handleTitleChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.title = event.target.value
    });
    this.setState({ selectedActivity });
  }
  handleShortDescriptionChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.shortDescription = event.target.value
    });
    this.setState({ selectedActivity });
  }
  handleCoverPhotoChange = (event) => {
    const selectedActivity = produce(this.state.selectedActivity, draft => {
      draft.coverPhoto = event.target.value
    });
    this.setState({ selectedActivity });
  }
  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />)

    return (

      <div className="ManageActivities" >
        <div className="title left-align">
          <div className="row valign-wrapper">
            <div className="col s11 m11 l1">
              <h4>
                Activities
              </h4>
            </div>
            <div className="col s1 m1 l1 align-right">
              <i className="material-icons" onClick={() => (this.state.selectedActivityId ? (this.setState({ editFlag: !this.state.editFlag })) : null)}>edit</i>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="row ">
            <div className="col s4 m4 l4">
              <ContentListContainer
                title={'Activities'}
                data={this.state.activities}
                onClickAction={this.onClickAction}
                onCreateAction={this.onCreateAction}
                selectedId={this.state.selectedActivityId}
              />
            </div>


            <div className="col s8 m8 l8" >
              <div className="card">
                <div className="card-content">

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Activity ID </p>
                    <div className="input-field col s10 l6">
                      <input
                        id="activity-id"
                        type="number"
                        value={this.state.selectedActivityId}
                        disabled="disabled"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Activity Title </p>
                    <div className="input-field col s10">
                      <input
                        id="activity-title"
                        type="text"
                        value={this.state.selectedActivity.title}
                        disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleTitleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Short Description </p>
                    <div className="col s10 m10 l10">
                      <textarea id="activity-description" type="text" className="materialize-textarea validate" value={this.state.selectedActivity.shortDescription} disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={this.handleShortDescriptionChange} />
                    </div>
                  </div>

                  <p className="col s2 m2 l2 left-align"> Cover Photo Url </p>

                  <div className="input-field col s10">
                    <input id="activity-cover-photo" type="text" value={this.state.selectedActivity.coverPhoto} disabled={this.state.selectedActivityId !== null && !this.state.editFlag ? "disabled" : false}
                      onChange={this.handleCoverPhotoChange} />
                  </div>
                </div>

                {/* Text editor */}
                <div className="row">
                  <button data-target="modal1" className="btn modal-trigger">Add Section</button>
                  <div id="modal1" className="modal">
                    <div className="modal-content">
                      <h5>Text Editor</h5>
                      <ReactQuill
                        value={this.state.text}
                        onChange={this.handleTextEditorChange}
                        modules={this.modules}
                        formats={this.formats}
                        theme="snow"
                        placeholder="Start here ..."
                      />
                    </div>
                    <div className="modal-footer">
                      <button className="btn-flat waves-effect waves-light" onClick={this.exportToHTML}>
                        Export to HTML
                      </button>
                      <button className="btn-flat waves-effect waves-light" onClick={this.saveHTML}>
                        Save as HTML
                      </button>
                      <button className="btn-flat waves-effect waves-light" onClick={this.savePlainText}>
                        Save as Plain Text
                      </button>
                      <button className="btn waves-effect waves-light">
                        Close
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <button className="btn waves-effect waves-light" type="submit" name="action" disabled={typeof this.state.selectedActivityId !== "number" || this.state.editFlag ? "" : "disabled"}
                    onClick={this.createEditActivity}>{typeof this.state.selectedActivityId !== "number" ? "Create" : "Submit"}
                    <i className="material-icons right">send</i>
                  </button>
                </div>
                <div className="row">
                  <span className={this.state.message.type === "success" ? "light-green-text text-accent-3" : "red-text text-accent-3"}>{this.state.message.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div >

    )
  }
}

export default Activities;
