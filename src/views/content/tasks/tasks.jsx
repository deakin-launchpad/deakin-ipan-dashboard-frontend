import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import LoadingComponent from '../../../components/loading/loading'
import { ContentListContainer } from '../../../components/contentListContainer'
import API from '../../../helpers/api'
import M from "materialize-css"

const ANSWER_TYPES = ["ANSWER_BOTH", "ANSWER_POPUP", "ANSWER_SUMMARY"]
const QUESTION_TYPES = ["ONE_CHOICE"]
const QUESTION = ["TEXT", "IMAGE"]

class ManageTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: null,
      apiResponse: false,
      selectedTaskId: null,
      selectedTaskData: null,
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
    this.setState({ selectedTaskId: selectedTaskId, selectedTaskData: selectedTaskData })
  }

  renderQuestionSet = (data) => {
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
          />
          <label className="active" htmlFor="question-id">Question ID</label>
        </div>
        {/* End */}

        <div className="row">
          <div className="offset-l1 offset-m1 col s11 m11 l11">

            {/* Question */}
            <div className="question">
              <div className="row">
                <div className="col s8 m8 l8">
                  <div className="input-field">
                    <textarea
                      id="question"
                      type="text"
                      className="materialize-textarea validate"
                      defaultValue={data.question.text ? data.question.text : data.question.image}
                      disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                    />
                    <label className="active" htmlFor="question">Question</label>
                  </div>
                </div>
                <div className="col s4 m4 l4">
                  <select
                    className="browser-default"
                    value={data.question.text ? "TEXT" : "IMAGE"}
                    onChange={(e) => console.log(e.target.value)}
                    disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                  >
                    <option value="">Choose your option</option>
                    {
                      QUESTION.map((item, key) => {
                        return <option value={item} key={key}>{item}</option>
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            {/* End */}

            {/* Options Array */}
            <div className="options-array">
              {
                data.options.map((item, i) => {
                  return (
                    <div className="input-field" key={i}>
                      <textarea
                        id={"option_" + i}
                        type="text"
                        className="materialize-textarea validate"
                        defaultValue={item.text ? item.text : item.image}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      />
                      <label className="active" htmlFor={"option_" + i}>Option {i + 1}</label>
                    </div>
                  )
                })
              }
            </div>
            {/* End */}

            {/* Popup array */}
            <div className="options-array">
              {
                data.popup.map((item, i) => {
                  return (
                    <div className="input-field" key={i}>
                      <textarea
                        id={"popup_" + i}
                        type="text"
                        className="materialize-textarea validate"
                        defaultValue={item}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      />
                      <label className="active" htmlFor={"popup_" + i}>Popup {i + 1}</label>
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
              <i className="material-icons" onClick={() => (this.state.selectedTaskId ? (this.setState({ editFlag: !this.state.editFlag})) : null )}>edit</i>
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
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Task Title </p>
                    <div className="input-field col s10 m10 l10">
                      <input
                        id="task-title"
                        type="text" defaultValue={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.title) : null}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Answer Type </p>
                    <div className="input-field col s10 m10 l10 answer-type">
                      <select
                        className="browser-default"
                        value={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.answerType) : false}
                        onChange={(e) => console.log(e.target.value)}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      >
                        <option value="">Choose your option</option>
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
                        value={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.questionType) : false}
                        onChange={(e) => console.log(e.target.value)}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false}
                      >
                        <option value="">Choose your option</option>
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
                        value={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.data.taskSummary) : undefined}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false} />
                    </div>
                  </div>

                  <div className="row">
                    <p className="col s2 m2 l2 left-align"> Task Summary </p>
                    <div className="col s10 m10 l10">
                      <textarea
                        id="task-summary"
                        type="text"
                        className="materialize-textarea validate"
                        value={this.state.selectedTaskId !== null ? (this.state.selectedTaskData.shortDescription) : undefined}
                        disabled={this.state.selectedTaskId !== null && !this.state.editFlag ? "disabled" : false} />
                    </div>
                  </div>

                  <div className="question-set">
                    <div className="row">
                      <p className="col s2 m2 l2 left-align"> Question Set </p>
                      <div className="left-align col s10 m10 l10">
                        {
                          this.state.selectedTaskData ? (
                            this.state.selectedTaskData.data.questionSet.map(data => {
                              return this.renderQuestionSet(data)
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
