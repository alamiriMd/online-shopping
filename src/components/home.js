import React from 'react';
import './styling/home.scss';
import Products from './data-for-pages';

export default class Home extends React.Component {
    render(){ 
        return (<>
          <div className="home-container">
            <Products category="all" rerender={this.props.rerender} />
          </div>
          </>)
    }
}