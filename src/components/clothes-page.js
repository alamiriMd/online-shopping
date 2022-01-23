import React from 'react';
import Products from './data-for-pages';

export default class Clothes extends React.Component {
    render(){
        return (<>
          <div  className="clothes-container">
              <Products category="clothes" rerender={this.props.rerender} />
          </div>
</>)
}}

 