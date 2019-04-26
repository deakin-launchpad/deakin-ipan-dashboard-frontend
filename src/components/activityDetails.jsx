import React from 'react';
import API from 'helpers/api.js';

class ActivityDetails extends React.Component{
  render(){
    return (
        <div className = "row">
          <form>
            <div className = "row">
              <div className = "input-field">
                <input disabled value={this.props.activity.title} id="title" type="text" className="validate" />
                <label htmlFor="title" className="active">Title</label>
              </div>
            </div>
            <div className = "row">
              <div className = "input-field">
                <input disabled value={this.props.activity.shortDescription} id="shortDesc" type="text" className="validate" />
                <label htmlFor="shortDesc" className="active">Short description</label>
              </div>
            </div>
          </form>
        </div>
    )
  }
}

export default ActivityDetails;