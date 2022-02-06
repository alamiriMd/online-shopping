import React from 'react';
import {Link } from 'react-router-dom';
import './styling/navBar.scss';
import logo from './images/logo.png';
import MinCart  from './mincart';
import SVG from './svg-store';
import { getCurrencyId, getTotalItemsInCart, getDarkMode, updateActivePage } from './localStorage';

export default class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
            currentCurrencySymbolList: ['$', '£', 'A$', '¥', '₽'],
            activePage:this.props.activePage,
        }
    }
    changeCurrency = (currencyId) => {
        this.setState({currencyId: currencyId});
        localStorage.setItem("currencyId", currencyId);
        this.props.rerender();
      }
    handleScrollAction = ()=> {
        if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
          document.body.scrollTop = 0; //for safari
          document.documentElement.scrollTop = 0; //for IE, Firefox, chrome, Opera, 
        }
      }
    handleDarkMode = ()=>{
          const container = document.querySelector(".darkMode-container");
          const button = container.querySelector("span");
          const body = document.querySelector("body");
          if(body.className === 'light'){           
            body.classList.add("dark");
            body.classList.remove("light");
            localStorage.setItem("darkMode", "dark");
            button.classList.remove("dark");
            button.classList.add("light");

        }else {
            body.classList.add("light");
            body.classList.remove("dark");
            button.classList.remove("light");
            button.classList.add("dark");
            localStorage.setItem("darkMode", "light");
        }
      }
      componentDidMount = ()=>{
        const body = document.querySelector("body");
        body.classList.remove("dark");
        body.classList.remove("light");
        body.classList.add(getDarkMode());
        const scroller = document.querySelector(".scroller-container");
        function onScroll(){
        if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
          scroller.classList.add("flex");
          scroller.classList.remove("hidden");
        }else{
          scroller.classList.add("hidden");
          scroller.classList.remove("flex");
        }
      }
      document.onscroll = ()=> onScroll();
      updateActivePage();
    }
    render(){ 
        return (
        <div className="navbar-container">
            <div className="navigation-container" id="navbar-links-container">
                <Link id="/" className='links' to="/" onClick={()=>updateActivePage('/')} exact="true" >ALL</Link>
                <Link id="/clothes" className='links' onClick={()=>updateActivePage('/clothes')} to="/clothes" >CLOTHES</Link>
                <Link id="/tech" className='links' onClick={()=>updateActivePage('/tech')} to="/tech"  >TECH</Link>
            </div>
            <div className='scroller-container hidden' id="scroller-container" onClick={()=>this.handleScrollAction()} >
                <SVG bgColor="silver" name="angle-up" />
            </div>
            <div onClick={()=> this.handleDarkMode()} className='darkMode-container' title='Toggle between light/dark mode'><span className='light'></span></div>
            <div className="logo-container" >
                    <div style={{backgroundImage:`url(${logo})`}}></div>
            </div>
            <div className="actions-container">
                <div className="left">
                <div className='shadow-bg-container'></div>
                <div className='minicart-content-container'>
                        <span className='svg-container'>
                            <SVG bgColor={(getTotalItemsInCart() > 0)?"black":"silver"} />
                        </span>
                        <span id="product-counts-in-cart-container" className={(getTotalItemsInCart()> 0)?"inline":"hidden"}>{getTotalItemsInCart("")}</span>
                    </div>
                    <div className="mincart-container">
                       <MinCart activePage={this.activePage } rerender={this.props.rerender} currentCurrencySymbolList={this.state.currentCurrencySymbolList} showSlider={false} />
                    </div>
                </div>
                <div className="right">
                    <span>{this.state.currentCurrencySymbolList[this.state.currencyId]} </span> 
                    <div className='arrow-container'>
                        <SVG name='angleDown' bgColor='black' />
                        <SVG name='angleUp' bgColor='black' />
                    </div>
                    <div className="dropdown-content-container">
                        <button onClick={()=> this.changeCurrency(0)} id="0">USD $</button>
                        <button onClick={()=> this.changeCurrency(1)} id="1">GBP £</button>
                        <button onClick={()=> this.changeCurrency(2)} id="2">AUD A$</button>
                        <button onClick={()=> this.changeCurrency(3)} id="3">JPY ¥</button>
                        <button onClick={()=> this.changeCurrency(4)} id="4">RUB ₽</button>
                    </div>                  
                </div>
            </div>
        </div>)
    }
}