import React from 'react';
import Products from './data-for-cart';
import {Link } from 'react-router-dom';
import {getTotalItemsInCart, getProductTotalPrice, getCurrencyId } from './localStorage';


export default class MinCart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
        }
    }

    render(){
    return (<>
    
            <div className="dropdown-content-container">
                <div className="products-count-container">
                    <strong>My bag, </strong><span>{getTotalItemsInCart()} {(getTotalItemsInCart()>1)?" items":" item"}</span>
                </div>
                <div className="checked-products-container">
                        <Products rerender={this.props.rerender} />
                </div>
                <div className="counts-container"> 
                    <span>Total</span>
                    <span>{this.props.currentCurrencySymbolList[getCurrencyId()]} {getProductTotalPrice()} </span>
                </div>
                <div className="buttons-container">
                    <Link to="/cart" className="VIEW-BAG-BUTTON">VIEW BAG</Link>
                    <Link to="/check-out" className="CHECK-OUT-BUTTON">CHECK OUT</Link>
                </div>
            </div>
    </>)  ;
}}