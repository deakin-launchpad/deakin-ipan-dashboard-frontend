import React from 'react';

class ItemList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({

        });
    }
    render(){
        return (
            //!this.props.items ? "":
              <div className = "collection">
                <a href = "#!">dummy item</a>
              {/* {
                this.props.items.map((item) => {
                  return (
                    <a key={item.id} href="#!" className={this.props.selectedItem && item.id === this.props.selectedItem.id ? "collection-item active" : "collection-item"} onClick={this.props.onClick}>{item.title}</a>
                  );
                })
              } */}
              </div>
        )
    }
}

export default ItemList;