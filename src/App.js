import React from 'react';
import Home from './components/home';
import {Route, Routes} from 'react-router-dom';
import ProductDescriptionPage from './components/product-descripton-page';
import CartPage from './components/cart';
import Clothes from './components/clothes-page';
import Tech from './components/tech-page';
import NotFoundPage from './components/page-not-found';
import CheckoutPage from './components/check-out-page';
import './components/styling/main.scss';
import Navbar from './components/navbar';
import { getCurrencyId } from "./components/localStorage";


export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
        }
    }
    rerender = ()=>{
        this.setState({ currencyId:getCurrencyId()});
    }
    render() {
        return (<>            
                <Navbar rerender={this.rerender } />
                <div className="main-content-container">
                    <Routes>
                        <Route path='/' element={<Home rerender={this.rerender } />} />
                        <Route path="/product/:id" element={   <ProductDescriptionPage rerender={this.rerender} />} />         
                        <Route path="/clothes" element={   <Clothes rerender={this.rerender} />} />
                        <Route path="/tech" element={   <Tech rerender={this.rerender} />} />
                        <Route path='/cart' element={<CartPage rerender={this.rerender}   />} />
                        <Route path='/check-out' element={<CheckoutPage rerender={this.rerender}  />} />
                        <Route path='*' element={   <NotFoundPage rerender={this.rerender}  />} />
                    </Routes>
                </div>
        </>);
    }
}