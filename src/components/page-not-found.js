import React from 'react';
import { updateActivePage } from './localStorage';

export default class NotFoundPage extends React.Component {
  componentDidMount = ()=> {
    updateActivePage();
  }
    render(){
        return (<>
          <div  className="content-container">
              <div>
                <strong className="name-container center">Page Not Found</strong>
              </div>
          </div>
</>)
}}