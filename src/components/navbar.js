import React from 'react';
import {Link } from 'react-router-dom';
import './styling/navBar.scss';
import logo from './images/logo.png';
import MinCart  from './mincart';
import SVG from './svg-store';
import { getCurrencyId, getTotalItemsInCart, getActiveItemsInCart, getDarkMode } from './localStorage';

const style = {
    backgroundImage: `url(${logo})`,
    backgroundRepeat:"no-repeat",
    backgroundSize:"contain"
}

export default class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
            currentCurrencySymbolList: ['$', '£', 'A$', '¥', '₽'],
            activePage:document.location.pathname,
        }
    }
    changeCurrency = (currencyId) => {
        this.setState({currencyId: currencyId});
        localStorage.setItem("currencyId", currencyId);
        this.props.rerender();
      }
      updateActivePage = (currentPage)=>{
        const container = document.getElementById("navigation-container");
        const links = container.querySelectorAll("a");
        for(let i = 0; i< links.length; i++) {
            links[i].classList.remove("active");
            if(links[i].id === currentPage){
                links[i].classList.add("active");}
        }
    }
    componentDidMount = ()=>{
        this.updateActivePage(document.location.pathname);
        const body = document.querySelector("body");
        body.classList.remove("dark");
        body.classList.remove("light");
        body.classList.add(getDarkMode());
        const scroller = document.querySelector(".scroller-container");
        function onScroll(){
        if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
          scroller.style.display = "flex";
        }else{scroller.style.display = "none";}
      }
      document.onscroll = ()=> onScroll();
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
    render(){
        return (
        <div className="navbar-container">
            <div className="navigation-container" id="navigation-container">
                <Link id="/clothes" className="links" onClick={()=> this.updateActivePage("/clothes")}  to="/clothes" exact="true" >CLOTHES</Link>
                <Link id="/tech" className="links" onClick={()=> this.updateActivePage("/tech")} to="/tech"  >TECH</Link>
            </div>
            <div className='scroller-container' onClick={()=>this.handleScrollAction()} style={{display:"none"}}>
                <SVG bgColor="silver" name="angle-up" />
            </div>
            <div onClick={()=> this.handleDarkMode()} className='darkMode-container' title='Toggle between light/dark mode'><span className='light'></span></div>
            <div className="logo-container" >
                <Link id="/" className="links" to="/" onClick={()=> this.updateActivePage("/")} >
                    <div style={style}></div>
                </Link>
            </div>
            <div className="actions-container">
                <div className="left"> 
                    <Link to='/cart'>
                        <span className='svg-container'>
                            <SVG bgColor={(getTotalItemsInCart() > 0)?"black":"silver"} />
                        </span>
                        <span id="product-counts-in-cart-container" style={(getTotalItemsInCart()> 0)?{display:"inline"}:{display:"none"}}>{getTotalItemsInCart("")}</span>
                    </Link>
                    <div className="mincart-container">
                       <MinCart rerender={this.props.rerender} currentCurrencySymbolList={this.state.currentCurrencySymbolList} showSlider={false} />
                    </div>
                </div>
                <div className="right">
                    <span>{this.state.currentCurrencySymbolList[this.state.currencyId]} </span> 
                    <i className="fa fa-angle-down"></i>
                    <div className="dropdown-content-container">
                        <a href="#" onClick={()=> this.changeCurrency(0)} value="0">USD $</a>
                        <a href="#" onClick={()=> this.changeCurrency(1)} value="1">GBP £</a>
                        <a href="#" onClick={()=> this.changeCurrency(2)} value="2">AUD A$</a>
                        <a href="#" onClick={()=> this.changeCurrency(3)} value="3">JPY ¥</a>
                        <a href="#" onClick={()=> this.changeCurrency(4)} value="4">RUB ₽</a>
                    </div>                  
                </div>
            </div>
        </div>)
    }
}
