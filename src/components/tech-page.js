import React from 'react';
import Products from './data-for-pages';
import './styling/home.scss';

export default class Tech extends React.Component {
    render(){
        return (<>
          <div  className="tech-container">
                <Products category="tech" rerender={this.props.rerender} />
          </div>
</>)
}}

 