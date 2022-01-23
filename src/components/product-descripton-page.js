import React from 'react';
import './styling/product-description-page.scss';
import { gql } from '@apollo/client';
import {Query} from '@apollo/client/react/components';
import {updateCapacity, getCapacity, getActiveCapacityButton, getActiveColorButton, updateColor, getSize, updateSize ,getActiveImageIndex, getInCartStatus, getActiveImage, updateActiveImage, updateInCartStatus, getActiveSizeButton, getCurrencyId} from './localStorage';
 

const ProductQuery = gql`
    query ProductDetail($id:String!){
        product(id:$id){            
        name
        description
        brand
        inStock
        gallery
        id
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
`;


export default class ProductDescriptionPage extends React.Component {
    constructor(props){
        super(props);
        const id = document.location.pathname.slice(9);
        this.state = {
            id: id, // document.location.pathname.slice(9),
            activeImageIndex:getActiveImageIndex(id), // document.location.pathname.slice(9)),
            inCart:getInCartStatus(id), //document.location.pathname.slice(9)),
            size: getSize(id), //document.location.pathname.slice(9)),
            currencyId: getCurrencyId(),
            color: getActiveColorButton(id),
            capacity:getCapacity(id),
        }
    }
    ChangeImage (imageSrc, imageIndex){
        const container = document.getElementById('side-images-container');
        const images = container.querySelectorAll(".images");
        const selectedImage = document.getElementById("selected-image");
        const selectedWideImage = document.getElementById("selected-wide-image");
        selectedImage.src = imageSrc;
        selectedWideImage.src = imageSrc;
        for(let i=0; i< images.length; i++){
            images[i].classList.remove("active-image");   
          
            if(images[i].src === imageSrc){
                images[i].classList.add("active-image");
                updateActiveImage(this.state.id, imageIndex);
            }
        }
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
                    this.setState({size:parseInt(buttonId)});
                }
            }
        }
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
                    this.setState({capacity:parseInt(buttonId)});
                }
            }
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
                    this.setState({color:parseInt(buttonId)});
                }
            }
        }
    }
    wideViewToggle = ()=>{
     
        const imageContainer = document.getElementById("img-wide-view-container");
        const shadow = document.getElementById("background-shadow");
        if(imageContainer.style.display === 'none'){
            imageContainer.style.display = 'flex';
            shadow.style.display = 'flex';
        }else{
            imageContainer.style.display = 'none'
            shadow.style.display = 'none'
        }
    }
    handleCartStatus = (ProductId, prices)=>{
        if(getInCartStatus(ProductId)){
            updateInCartStatus({itemId:this.state.id, prices:prices, inCart:false, size:this.state.size, activeImageIndex:getActiveImageIndex(this.state.id)});
            this.setState({inCart:false });
        }else{
            this.setState({inCart:true});
            updateInCartStatus({itemId:this.state.id, prices:prices, inCart:true,size:this.state.size, activeImageIndex:getActiveImageIndex(this.state.id)});
        }
        this.props.rerender();
    }

    handleDisplay = (attributes, buttonsType)=>{
        const attr = JSON.parse(attributes);
        var val = "none"; 
        attr.map(item => {
            if(item.name === buttonsType){
                val =  "flex";
            }
        });
        return val; 
    }
    render(){
        return(<>
            <div className="product-description-page-container">
                <Query query={ProductQuery} variables={{id:this.state.id}}>
                    {({data, loading, error})=>{
                        if(loading){return <div className="loader-container"><span className="loader"></span></div>;}
                        if(error){return console.log(error)}
                        return (<>
                            <div className="first-column-container" id="first-column-container">
                                <div className='images-container' id='side-images-container'>
                                    {data && data.product.gallery.map((item, index) => {return (
                                        <img key={index} src={item} className={getActiveImage(this.state.id, index)} alt='image' onClick={()=>this.ChangeImage(item, index)} />
                                    )})}
                                </div>
                            </div>
                            <div className="second-column-container">
                                <div className='background-shadow' id="background-shadow" ></div>
                                <div className="img-wide-view-container" id="img-wide-view-container" style={{display:"none"}}>
                                   <img alt="image" onClick={()=>this.wideViewToggle()} src={data.product.gallery[this.state.activeImageIndex]} id="selected-wide-image" className="selected-image" />
                               </div>
                               <img alt="image" onClick={()=>this.wideViewToggle()} src={data.product.gallery[this.state.activeImageIndex]} id="selected-image" className="selected-image" />
                            </div>
                            <div className="third-column-container">
                                <div className="content-container" id="third-column-content-container">
                                    <div className='name-container'>
                                        <strong> {data.product.name} </strong>
                                        <div><span>{data.product.brand} </span></div>
                                    </div>
                                    <div className='capacity-container' style={{display: (data.product.attributes.length > 0)?this.handleDisplay(JSON.stringify(data.product.attributes ), 'Capacity'):"none" }}>
                                        <div>
                                            {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Capacity")return (<strong key={key}>{item.name}:</strong>)})} 
                                        </div>
                                        <div className={`capacity-buttons-container-${data.product.id}`} id="capacity-buttons-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Capacity') 
                                                return (attr.items.map((item, key)=> {return (
                                                    <a id={key } href="#" 
                                                    onClick={ () => this.ChangeCapacity(data.product.id, key) } 
                                                    className={getActiveCapacityButton(this.state.id, key)} 
                                                    title={item.displayValue} key={item.id }>{item.displayValue}</a>
                                                )}))
                                            })}
                                        </div>
                                    </div>
                                    <div className='size-container' style={{display: (data.product.attributes.length > 0)?this.handleDisplay(JSON.stringify(data.product.attributes ), 'Size'):"none" }} >
                                        <div>
                                          {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Size")return (<strong key={key}>{item.name}:</strong>)})} 
                                        </div>
                                        <div className={`size-buttons-container-${data.product.id}`} id="size-buttons-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Size')
                                                return (attr.items.map((item, key)=> {return (
                                                    <a  id={key } href="#" 
                                                    onClick={ () => this.ChangeSize(data.product.id, key) } 
                                                    className={getActiveSizeButton(this.state.id, key)} 
                                                    title={item.displayValue} key={item.id }>{item.displayValue}</a>
                                                )}))
                                            })}
                                        </div>
                                    </div>
                                    <div className='color-container' style={{display: (data.product.attributes.length > 0)?this.handleDisplay(JSON.stringify(data.product.attributes ), 'Color'):"none" }}>
                                        <div>
                                          {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Color")return (<strong key={key}>{item.name}:</strong>)})} 
                                        </div> 
                                        <div className={`color-buttons-container-${data.product.id}`} id="color-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Color')
                                                return (attr.items.map((item, key)=> {return (
                                                    <a  id={key } href="#" 
                                                    onClick={ () => this.ChangeColor(data.product.id, key) } 
                                                    className={getActiveColorButton(this.state.id, key)} 
                                                    style={{backgroundColor:item.value}}
                                                    title={item.displayValue} key={item.id }></a>
                                                    )}))
                                            })}
                                        </div>
                                    </div>
                                    <div className='price-container'>
                                        <div>
                                            <strong>PRICE:</strong>
                                        </div>
                                        <div>
                                        <strong>{data.product.prices[getCurrencyId()].currency.symbol }{data.product.prices[getCurrencyId()].amount}</strong>
                                    </div>
                                    </div>
                                    <div className='button-container'>
                                        <a href='#' className={ (getInCartStatus(data.product.id))?`remove-from-cart-button`:`add-to-cart-button`} onClick={()=>this.handleCartStatus(data.product.id, data.product.prices.map(item=> {return item.amount}))}>
                                                { (getInCartStatus(data.product.id))?`REMOVE FROM CART`:`ADD TO CART`}
                                    </a>
                                    </div>
                                    <div className='description-container' id="description-container">{data.product.description}</div>
                                </div>
                            </div>
                              </>);
                    }}
                </Query>
            </div>
        </>)
    }
}