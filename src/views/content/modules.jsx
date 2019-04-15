import React from 'react';
import ItemList from 'components/itemList.jsx';
import ModuleInfo from 'components/module/moduleInfo.jsx';

class Modules extends React.Component{
  render(){
    console.log("render Modules");
    return (
      <div className = "container">
        <h1> Modules</h1>
        <div className="divider" />
        <div className = "row">
          <div className = "col s3 m3">
            <ItemList />
          </div>
          <div className = "col s9 m9">
            <ModuleInfo />
          </div>
        </div>
      </div>
    )
  }
}

export default Modules;