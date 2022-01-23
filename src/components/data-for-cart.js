import React from "react";
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import {Link} from 'react-router-dom';
import { getItemsInCart,updateCapacity, updateColor,getActiveColorButton, updateSize, updateProductCountInCart, getActiveCapacityButton, getActiveSizeButton, getItemsIdsInCart, getCurrencyId } from './localStorage';
 
 
const PRODUCTS_QUERY = gql`
    query ProductDetail{
        categories{
            products{            
            name
            id
            brand
            gallery
            category
            prices{
                amount
                currency {
                    symbol
                    label
                }
            }
            attributes {
                name
                type
                items {
                    value
                    id
                    displayValue
                }
            }
            }
    }
    }`;

export default class Products extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currencyId: getCurrencyId(),
        }
    }
    changeProductItemsInCart = (productId, key, operation) =>{
        const itemsCountContainer = document.querySelectorAll( ".count-display-container-" + key + "-"+ productId );
        for(let i=0; i < itemsCountContainer.length; i++){
            let count = parseInt(itemsCountContainer[i].innerText);
            if(operation === -1){
                if(count > 0 ){
                    itemsCountContainer[i].innerText = `${count - 1} `;
                    updateProductCountInCart(productId, -1);
                }
            }else {
                itemsCountContainer[i].innerText = `${count + 1} `;
                updateProductCountInCart(productId, 1);   
            }
            this.setState({count: (this.state.count + 1)});
        }
      this.props.rerender();
    }
    ChangeSize (productId, buttonId){
        const container = document.querySelectorAll(".size-buttons-container-" + productId);
        for(let i=0; i < container.length; i++){
            const buttons = container[i].querySelectorAll(".size-buttons");
            for(let i=0; i < buttons.length; i++){
                buttons[i].classList.remove("active-button");   
                if(parseInt(buttons[i].id) === buttonId){
                    buttons[i].classList.add("active-button");
                    updateSize({productId:productId, buttonId:parseInt(buttonId)});
                  
                }
            }
        }
    }
    changeImageSlider = (productId, key, direction)=>{
        const container = document.querySelectorAll("#product-" + productId +"-"+ key);
        var index = 1;
        for(let i =0; i < container.length; i++){
            const images = container[i].querySelectorAll(".images");
            for(let i = 0; i < images.length; i++){
                images[i].style.display = 'none';
                if(images[i].className === 'images active-image'){
                    index = parseInt(images[i].id)
                }
                images[index].classList.remove("active-image");
            }
            index += direction;
            if(index >= images.length){index = 0;}
            else if(index < 0){index = images.length - 1;}
            images[index].style.display = 'block';
            images[index].classList.add("active-image");
        }
    }
    ChangeColor (productId, buttonId){
        const container = document.querySelectorAll(".color-buttons-container-" + productId);
        for(let i=0; i < container.length; i++){
            const buttons = container[i].querySelectorAll(".color-buttons");
            for(let i=0; i < buttons.length; i++){
                buttons[i].classList.remove("active-button");
                if(parseInt(buttons[i].id) === buttonId){
                    buttons[i].classList.add("active-button");
                    updateColor({productId:productId, buttonId:parseInt(buttonId)});
                }
            }
        }
    }
    handleDisplay = (attributes, buttonsType)=>{
        const attr = JSON.parse(attributes);
        var val = "none"; 
        attr.map(item => {
            if(item.name === buttonsType){val =  "flex";}
        });
        return val; 
    }
    ChangeCapacity (productId, buttonId){
        const container = document.querySelectorAll(".capacity-buttons-container-" + productId);
        for(let i=0; i < container.length; i++){
            const buttons = container[i].querySelectorAll(".capacity-buttons");
            for(let i=0; i < buttons.length; i++){
                buttons[i].classList.remove("active-button");   
                if(parseInt(buttons[i].id) === buttonId){
                    buttons[i].classList.add("active-button");
                    updateCapacity({productId:productId, buttonId:parseInt(buttonId)});
                }
            }
        }
    }
    callRerender = ()=>{
        this.setState({currencyId: getCurrencyId()});
        this.props.rerender();
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
                                if(getItemsIdsInCart().includes(product.id)) return( 
                                /// beggining ................////
                                    <div className="products" key={key} id={`product-${product.id}-${key}`}>
                                        <div className="first-column-container" id="first-column-container">
                                            <div className='name-container'>
                                                <Link onClick={()=> this.callRerender()} to={`/product/${product.id }`}><strong>{product.name} </strong></Link>
                                            </div>
                                            <div className='brand-container'> 
                                                <span>{product.brand }</span>
                                            </div>

                                            <div className='price-container'> 
                                                <strong>{product.prices[getCurrencyId()].currency.symbol }{product.prices[getCurrencyId()].amount * getItemsInCart(`${product.id}`)}</strong>
                                            </div>
                                            <div id='size-buttons-container' className={`size-buttons-container-${product.id}`} 
                                            style={{display: (product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Size'):"none" }} >
                                                 
                                                { product.attributes.map((attr, AttrKey)=> {
                                                    if(attr.name ==='Size')
                                                    return (attr.items.map((item, key)=> {return (
                                                        <a  id={key } href="#" 
                                                            onClick={ () => this.ChangeSize(product.id, key) } 
                                                            className={getActiveSizeButton(product.id, key)} 
                                                            title={item.displayValue} key={item.id }>{item.displayValue}</a>
                                                            )}))
                                                })}
                                            </div>
                                            <div id='capacity-buttons-container' className={`capacity-buttons-container-${product.id}`} style={{display: (product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Capacity'):"none" }}>
                                                { product.attributes.map((attr, AttrKey)=> {
                                                    if(attr.name ==='Capacity')
                                                    return (attr.items.map((item, key)=> {return (
                                                        <a  id={key } href="#" 
                                                        onClick={ () => this.ChangeCapacity(product.id, key) } 
                                                        className={getActiveCapacityButton(product.id, key)} 
                                                        title={item.displayValue} key={item.id }>{item.displayValue}</a>
                                                    )}))
                                                })}
                                            </div>
                                            <div id='color-buttons-container' className={`color-buttons-container-${product.id}`}  style={{display: (product.attributes.length > 0)?this.handleDisplay(JSON.stringify(product.attributes ), 'Color'):"none" }}>
                                                { product.attributes.map((attr, AttrKey)=> {
                                                    if(attr.name ==='Color')
                                                    return (attr.items.map((item, key)=> {return (
                                                        <a  id={key } href="#" style={{backgroundColor:item.value}}
                                                        onClick={ () => this.ChangeColor(product.id, key) } 
                                                        className={getActiveColorButton(product.id, key)} 
                                                        title={item.displayValue} key={item.id }></a>
                                                    )}))
                                                })}
                                            </div>
                                        </div>
                                        <div className="second-column-container">
                                            <div className='count-buttons-container'>
                                                <a href='#'onClick={()=>this.changeProductItemsInCart(product.id,key, 1)} >+</a>
                                                    <span className={`count-display-container-${key}-${product.id}`}>{getItemsInCart(product.id, key)} </span>
                                                <a href='#'onClick={()=>this.changeProductItemsInCart(product.id, key, -1)}  >-</a>
                                            </div>
                                        </div>
                                        <div className="third-column-container">
                                            <div className="buttons-slider-container" id="buttons-slider-container"  style={{ display:(!this.props.showSlider || (product.gallery.length === 1) )?"none":"block"}}>
                                                <a href="#" className="buttons" id={`left-button-id`} onClick={()=>this.changeImageSlider(product.id, key, 1)}><span></span> </a>
                                                <a href="#" className="buttons" id={`right-button-id`} onClick={()=>this.changeImageSlider(product.id, key, -1)}><span></span></a>
                                            </div>
                                            <div className='images-container' id="images-container">
                                                {product.gallery.map((item, key) => {
                                                    return <img className={(key===0)?"images active-image":"images"} 
                                                    key={key} id={key} src={item}  alt='image' style={{display:(key != 0)?"none":"block"}} />
                                                })}
                                            </div>
                                        </div>
                                    </div>
                            /// end ................////
                                            )})}
                        </>)
                    }}
                </Query>
            </div>
        </>);
}}
