import React from "react";
import './styling/cart.scss';
import Products from './data-for-cart';
import { getTotalItemsInCart } from "./localStorage";

 
export default class CartPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
    return (<>
        <div className="cart-page-container" id="products-in-cart">
            <div className="title-container" style={{display:(getTotalItemsInCart() ===0)?"block":"none"}}>
                <strong style={{padding:"20px 10px", float:"left" }}>Cart is empty</strong>
            </div>
            <Products  rerender={this.props.rerender} showSlider={true} />
        </div>
   </>);
}}
