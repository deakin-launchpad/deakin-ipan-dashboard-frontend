import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer'
import API from '../../../helpers/api'
import M from "materialize-css"
import produce from "immer"

const ANSWER_TYPES = ["ANSWER_BOTH", "ANSWER_POPUP", "ANSWER_SUMMARY"]
const QUESTION_TYPES = ["ONE_CHOICE"]
const QUESTION = ["TEXT"]
const TYPE = ["QUIZ"]

class ManageTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: null,
      apiResponse: false,
      selectedTaskId: null,
      selectedTaskData: null,
      editedTaskData: null,
      editFlag: false,
    };
  }

  stateHandler = (state) => {
    this.setState(
      state
    )
  }

  componentDidMount() {
    M.AutoInit()
    this.getTasksData()
  }

  getTasksData = () => {
    API.getTasksData(this.stateHandler);
  }

  onClickAction = (selectedTaskId, selectedTaskData) => {
    this.setState({ selectedTaskId: selectedTaskId, selectedTaskData: selectedTaskData, editedTaskData: selectedTaskData })
  }

  handleChange = (type, value, parentId, childId) => {
    let data = this.state.editedTaskData
    switch (type) {
      case "QUESTION":
        data.data.questionSet[parentId].question.text = value
        return this.setState({ editedTaskData: data })
      case "QUESTION_ID":
        data.data.questionSet[parentId].id = value
        return this.setState({ editedTaskData: data })
      // case "Q_TYPE":
      //   data.data.questionSet[parentId].question.text = value
      //   return this.setState({ editedTaskData: data })
      case "SHORT_DESCRIPTION":
        data.shortDescription = value
        return this.setState({ editedTaskData: data })
      case "TASK_TITLE":
        data.title = value
        return this.setState({ editedTaskData: data })
      case "TASK_SUMMARY":
        data.taskSummary = value
        return this.setState({ editedTaskData: data })
      case "QUESTION_TYPE":
        data.data.questionType = value
        return this.setState({ editedTaskData: data })
      case "ANSWER_TYPE":
        data.data.answerType = value
        return this.setState({ editedTaskData: data })
      case "TYPE":
        data.type = value
        return this.setState({ editedTaskData: data })
      case "OPTION":
        data.data.questionSet[parentId].options[childId].text = value
        return this.setState({ editedTaskData: data })
      case "POPUP":
        data.data.questionSet[parentId].popup[childId] = value
        return this.setState({ editedTaskData: data })
      case "CORRECT":
        data.data.questionSet[parentId].correct = value
        return this.setState({ editedTaskData: data })
      default:
        alert('Not supported. Contact Administrator')
        break;
    }
  }

  renderQuestionSet = (data, i) => {
    return (
      <div key={data.id}>

        {/* Task ID */}
        <div className="input-field">
          <input
            id="question-id"
            type="number"
            className="validate"
            defaultValue={data.id}
            disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
            onChange={(e) => this.handleChange("QUESTION_ID", e.target.value, i)}
          />
          <label className="active" htmlFor="question-id">Question ID</label>
        </div>
        {/* End */}

        <div className="row">
          <div className="offset-l1 offset-m1 col s11 m11 l11">

            {/* Question */}
            <div className="question">
              <div className="row">
                <div className="col s4 m4 l4">
                  <select
                    className="browser-default"
                    defaultValue={data.question.text ? "TEXT" : "IMAGE"}
                    disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                    // onChange={(e) => this.handleChange("Q_TYPE", e.target.value, i)}
                  >
                    {
                      QUESTION.map((item, key) => {
                        return <option value={item} key={key}>{item}</option>
                      })
                    }
                  </select>
                </div>
                <div className="col s8 m8 l8">
                  <div className="input-field">
                    <textarea
                      id="question"
                      type="text"
                      className="materialize-textarea validate"
                      defaultValue={data.question.text ? data.question.text : data.question.image}
                      disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      onChange={(e) => this.handleChange("QUESTION", e.target.value, i)}
                    />
                    <label className="active" htmlFor="question">Question</label>
                  </div>
                </div>
              </div>
            </div>
            {/* End */}

            {/* Options Array */}
            <div className="options-array">
              {
                data.options.map((item, key) => {
                  return (
                    <div className="input-field" key={key}>
                      <textarea
                        id={"option_" + key}
                        type="text"
                        className="materialize-textarea validate"
                        defaultValue={item.text ? item.text : item.image}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("OPTION", e.target.value, i, key)}
                      />
                      <label className="active" htmlFor={"option_" + key}>Option {key + 1}</label>
                    </div>
                  )
                })
              }
            </div>
            {/* End */}

            {/* Popup array */}
            <div className="popup-array">
              {
                data.popup.map((item, key) => {
                  return (
                    <div className="input-field" key={key}>
                      <textarea
                        id={"popup_" + key}
                        type="text"
                        className="materialize-textarea validate"
                        defaultValue={item}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("POPUP", e.target.value, i, key)}
                      />
                      <label className="active" htmlFor={"popup_" + key}>Popup {key + 1}</label>
                    </div>
                  )
                })
              }
            </div>
            {/* End */}

            {/* Correct answer */}
            <div className="correct">
              <div className="input-field">
                <input
                  id="correct"
                  type="number"
                  className="validate"
                  defaultValue={data.correct}
                  disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                  onChange={(e) => this.handleChange("CORRECT", e.target.value, i)}
                />
                <label className="active" htmlFor="correct">Correct</label>
              </div>
            </div>
            {/* End */}

          </div>
        </div>

      </div>
    )
  }

  render() {
    if (!this.state.apiResponse) return (<LoadingComponent />)
    return (
      <div className="ManageTasks">
        <div className="title left-align">
          <div className="row valign-wrapper">
            <div className="col s11 m11 l11">
              <h4>
                Tasks
              </h4>
            </div>
            <div className="col s1 m1 l1 right-align">
              <i className="material-icons" onClick={() => (this.state.selectedTaskId ? (this.setState({ editFlag: !this.state.editFlag })) : null)}>edit</i>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="row">
            <div className="col s4 m4 l4">
              <ContentListContainer
                title={'Tasks'}
                data={this.state.tasksData}
                onClickAction={this.onClickAction}
                selectedTaskId={this.state.selectedTaskId}
              />
            </div>

            <div className="col s8 m8 l8">
              <div className="card">
                <div className="card-content">

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Task ID </p>
                    <div className="input-field col s10 m10 l10">
                      <input
                        id="task-id"
                        type="number"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.id) : null}
                        disabled={this.state.selectedTaskId !== null ? "disabled" : false}
                        onChange={(e) => this.handleChange("TASK_ID", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Task Title </p>
                    <div className="input-field col s10 m10 l10">
                      <input
                        id="task-title"
                        type="text"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.title) : null}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("TASK_TITLE", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Type </p>
                    <div className="input-field col s10 m10 l10 type">
                      <select
                        className="browser-default"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.type) : false}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("TYPE", e.target.value)}
                      >
                        {
                          TYPE.map((item, key) => {
                            return <option value={item} key={key}>{item}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>


                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Answer Type </p>
                    <div className="input-field col s10 m10 l10 answer-type">
                      <select
                        className="browser-default"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.answerType) : false}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("ANSWER_TYPE", e.target.value)}
                      >
                        {
                          ANSWER_TYPES.map((item, key) => {
                            return <option value={item} key={key}>{item}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Question Type </p>
                    <div className="input-field col s10 m10 l10 question-type">
                      <select
                        className="browser-default"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.questionType) : false}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("QUESTION_TYPE", e.target.value)}
                      >
                        {
                          QUESTION_TYPES.map((item, key) => {
                            return <option value={item} key={key}>{item}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Short Description </p>
                    <div className="col s10 m10 l10">
                      <textarea
                        id="short-description" type="text"
                        className="materialize-textarea validate"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.shortDescription) : undefined}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("SHORT_DESCRIPTION", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Task Summary </p>
                    <div className="col s10 m10 l10">
                      <textarea
                        id="task-summary"
                        type="text"
                        className="materialize-textarea validate"
                        defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.taskSummary) : undefined}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                        onChange={(e) => this.handleChange("TASK_SUMMARY", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="question-set">
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Question Set </p>
                      <div className="left-align col s10 m10 l10">
                        {
                          this.state.selectedTaskData ? (
                            this.state.selectedTaskData.data.questionSet.map((data, i) => {
                              return this.renderQuestionSet(data, i)
                            })
                          ) : (
                              // Case for null
                              <span>None</span>
                            )
                        }
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default ManageTask
