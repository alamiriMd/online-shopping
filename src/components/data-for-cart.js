import React from "react";
import {Query} from '@apollo/client/react/components';
import { PRODUCTS_QUERY } from "./queries";
import {Link} from 'react-router-dom';
import { getItemsInCart,updateCapacity, updateColor,getActiveColorButton, updateSize, updateProductCountInCart, getActiveCapacityButton, getActiveSizeButton, getItemsIdsInCart, getCurrencyId, getIndexesOfProductInCart, getCurrentIndex } from './localStorage';
 
export default class Products extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
        }
    } 
    changeProductItemsInCart = (productId, operation, index) =>{
        let Index = getCurrentIndex();
        if(index){Index = index;}
        updateProductCountInCart(productId, operation, Index);   
        this.props.rerender();
    }
    ChangeSize (productId, buttonId, index=null){
        let Index = getCurrentIndex();
        if(index){Index = index;}
        updateSize({productId:productId, buttonId:parseInt(buttonId), index:Index});
        this.props.rerender();
    }
    changeImageSlider = (productId, key, direction, productIndex)=>{
        let PRODUCT_INDEX = getCurrentIndex();
        if(productIndex){PRODUCT_INDEX = productIndex;}
        const container = document.querySelectorAll("#product-" + productId +"-"+ key+"-"+ PRODUCT_INDEX);
        var index = 1;
        for(let i =0; i < container.length; i++){
            const images = container[i].querySelectorAll(".images");
            for(let i = 0; i < images.length; i++){
                images[i].classList.add("hidden");
                images[i].classList.remove("show");
                if(images[i].className.includes('active-image')){
                    index = parseInt(images[i].id);
                }
                images[index].classList.remove("active-image");
            }
            index += direction;
            if(index >= images.length){index = 0;}
            else if(index < 0){index = images.length - 1;}
            images[index].classList.add('show');
            images[index].classList.add("active-image");
        }
    }
    ChangeColor (productId, buttonId, index){
        let Index = getCurrentIndex();
        if(index){Index = index;}
        updateColor({productId:productId, buttonId:parseInt(buttonId), index:Index});
        this.props.rerender();
    }
    handleDisplay = (attributes, buttonsType)=>{
        const attr = JSON.parse(attributes);
        let val = "hidden"; 
        attr.forEach(item => {
            if(item.name === buttonsType){val =  "flex";}
        });
        return val; 
    }
    ChangeCapacity (productId, buttonId, index){
        let Index = getCurrentIndex();
        if(index){Index = index;}
        updateCapacity({productId:productId, buttonId:parseInt(buttonId), index:Index});
        this.props.rerender();
    }
    updateIndex = (index)=> {
        localStorage.setItem("index", index);
        if(document.location.pathname.includes('/product/')){this.props.rerender();}
    }
    render(){
    return (<>
             <div className="products-container">
                <Query query={PRODUCTS_QUERY} >
                 {({data, loading, error})=>{
                        if(loading){return <div className="loader-container"><span className="loader"></span></div>;}
                        if(error){return console.log(error)}
                        return (<>
                            {data.categories[0].products.map((product, key) =>{
                                // in if statement (product.attributes.length > 0)can be removed if the all data contains attributes.
                                // I put this condition just because I have some data contains no attributes and gives me an error. 
                                if(getItemsIdsInCart().includes(product.id)){
                                    let indexes = getIndexesOfProductInCart(product.id);
                                    return  indexes.map((index, key)=>{
                                            /// beggining ................////
                                                return ( 
                                                <div className="products" key={key} id={`product-${product.id}-${key}-${index}`}>
                                                    <div className="first-column-container" id="first-column-container">
                                                        <div className='name-container'>
                                                            <Link onClick={()=> this.updateIndex(index)} to={`/product/${product.id}#index=${index}`}><strong>{product.name} </strong></Link>
                                                        </div>
                                                        <div className='brand-container'>
                                                            <span>{product.brand }</span>
                                                        </div>
                                                        <div className='price-container'> 
                                                            <strong>{product.prices[getCurrencyId()].currency.symbol }{product.prices[getCurrencyId()].amount.toFixed(2)}</strong>
                                                        </div>
                                                        <div className={`size-buttons-container-${product.id}-${index} buttons ${(product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Size'):"hidden" }`} >
                                                            { product.attributes.map((attr, AttrKey)=> {
                                                                if(attr.name ==='Size'){
                                                                return (attr.items.map((item, key)=> {return (
                                                                    <button  id={key } 
                                                                        onClick={ () => {if(this.props.attributes)this.ChangeSize(product.id, key, index) }} 
                                                                        className={getActiveSizeButton(product.id, key, index)} 
                                                                        title={item.displayValue} key={item.id }>{item.value}</button>
                                                                        )}))}
                                                                return null;
                                                            })}
                                                        </div>
                                                        <div className={`capacity-buttons-container-${product.id}-${index} buttons ${(product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Capacity'):"hidden" }`}>
                                                            { product.attributes.map((attr, AttrKey)=> {
                                                                if(attr.name ==='Capacity'){
                                                                return (attr.items.map((item, key)=> {return (
                                                                    <button  id={key } 
                                                                    onClick={ () => {if(this.props.attributes)this.ChangeCapacity(product.id, key, index)} } 
                                                                    className={getActiveCapacityButton(product.id, key, index)} 
                                                                    title={item.displayValue} key={item.id }>{item.displayValue}</button>
                                                                )}))}
                                                                return null;
                                                            })}
                                                        </div>
                                                        <div className={`color-buttons-container-${product.id}-${index} buttons ${(product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Color'):"hidden" }`}>
                                                            { product.attributes.map((attr, AttrKey)=> {
                                                                if(attr.name ==='Color'){
                                                                return (attr.items.map((item, key)=> {return (
                                                                    <button  id={key }  style={{backgroundColor:item.value}}
                                                                    onClick={ () => {if(this.props.attributes)this.ChangeColor(product.id, key, index) }} 
                                                                    className={getActiveColorButton(product.id, key, index)} 
                                                                    title={item.displayValue} key={item.id }></button>
                                                                )}))}
                                                                return null;
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="second-column-container">
                                                        <div className='count-buttons-container'>
                                                            <button onClick={()=>this.changeProductItemsInCart(product.id, 1, index)} >+</button>
                                                                <span className={`count-display-container-${key}-${product.id}-${index}`}>{getItemsInCart(product.id, index)} </span>
                                                            <button onClick={()=>this.changeProductItemsInCart(product.id, -1, index)}  >-</button>
                                                        </div>
                                                    </div>
                                                    <div className="third-column-container">
                                                        <div id="buttons-slider-container" className={`buttons-slider-container ${(!this.props.showSlider || (product.gallery.length === 1) )?"hidden":"show"}`}>
                                                            <button className="buttons" id={`left-button-id`} onClick={()=> this.changeImageSlider(product.id, key, 1, index)}><span></span> </button>
                                                            <button className="buttons" id={`right-button-id`} onClick={()=> this.changeImageSlider(product.id, key, -1, index)}><span></span></button>
                                                        </div>
                                                        <div className='images-container' id="images-container">
                                                            {product.gallery.map((item, key) => {
                                                                return <img 
                                                                key={key} id={key} src={item}  alt='' className={`images ${(key === 0)?"active-image show":"hidden"}`} />
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            /// end ................////
                                        }
                                    )
                                }
                                return null;
                                })}
                        </>)
                    }}
                </Query>
            </div>
        </>);
}}
