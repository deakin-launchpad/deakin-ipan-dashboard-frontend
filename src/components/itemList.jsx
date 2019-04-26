import React from 'react';

class ItemList extends React.Component{
    render(){
        return (
            !this.props.items? "":
              <div className = "collection">
              {
                this.props.items.map((item) => {
                  return (
                    <a key={item.id} href="#!" 
                      className={this.props.selectedItem && item.id === this.props.selectedItem.id ? "collection-item active" : "collection-item"} 
                      onClick={this.props.onClick.bind(this, item)}>{item.title}</a>
                  );
                })
              }
              </div>
        )
    }
}

export default ItemList;