import React from "react";
import './styling/cart.scss';
import Products from './data-for-cart';
import { getTotalItemsInCart, updateActivePage } from "./localStorage";

export default class CartPage extends React.Component {
    componentDidMount = ()=> {
        updateActivePage();
      }
    render(){  
    return (<>
        <div className="cart-page-container" id="products-in-cart">
            <div className={(getTotalItemsInCart() ===0)?"title-container block":"title-container hidden"}>
                <strong id='cart-is-empty' >The cart is empty</strong>
            </div>
            <Products  rerender={this.props.rerender} showSlider={true} attributes={true} />
        </div>
   </>);
}}