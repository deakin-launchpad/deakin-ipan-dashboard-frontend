import React from 'react'

export const ContentListContainer = (props) => {
  return (
    <div className="content-list">
      <div className="card">
        <div className="card-content">
          <span className="card-title left-align">{props.title}</span>

          <div className="card-action">
            {
              props.data.length > 0 ? (
                props.data.map(item => {
                  return (
                    <div key={item.id}>

                      <p className={"col s11 m11 l11 left-align " + (props.selectedId === item.id ? "active teal lighten-5" : '')} onClick={() => props.onClickAction(item.id, props.data.find(data => data.id === item.id))}>
                        {item.title}
                      </p>
                      <i className="material-icons col l1 m1 s1 valign-wrapper">delete</i>
                    </div>
                  )
                })
              ) : <p> Looks empty </p>
            }
          </div>

          <button
            className="btn waves-effect waves-light" type="submit" name="action"
            onClick={() => props.onCreateAction()}
          >
            Create
            <i className="material-icons right">add</i>
          </button>

        </div>
      </div>
    </div>
  )
}
