import React from 'react'

export const ContentListContainer = (props) => {
  console.log(props.selectedTaskId)
  return (
    <div className="content-list">
      <div class="row">
        <div class="col s6 m4 l4">
          <div class="card">
            <div class="card-content">
              <span class="card-title left-align">{props.title}</span>

              <div class="card-action">
                {
                  props.data.length > 0 ? (
                    props.data.map(item => {
                      return (
                        <div>
                          <p key={item.id} className={"col s11 m11 l11 left-align " + (props.selectedTaskId === item.id ? "active teal lighten-5" : '')} onClick={() => props.onClickAction(item.id)}>
                            {item.title}
                          </p>
                          <i className="material-icons col l1 m1 s1 valign-wrapper">delete</i>
                        </div>
                      )
                    })
                  ) : <p> Looks empty </p>
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
