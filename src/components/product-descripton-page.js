import React from 'react';
import './styling/product-description-page.scss';
import {PRODUCT_QUERY} from './queries';
import {Query} from '@apollo/client/react/components';
import {getIndexesOfProductInCart, updateCapacity, getCurrentIndex, getProductIndexCount, getCapacity, getActiveCapacityButton, getActiveColorButton, updateColor, getSize, updateSize ,getActiveImageIndex, getInCartStatus, getActiveImage, updateActiveImage, updateInCartStatus, getActiveSizeButton, getCurrencyId, updateActivePage} from './localStorage';
import SVG from './svg-store';

export default class ProductDescriptionPage extends React.Component {
    constructor(props){
        super(props);
        const id = document.location.pathname.slice(9);
        this.state = {
            id: id,
            activeImageIndex:getActiveImageIndex(id), 
            inCart:getInCartStatus(id), 
            size: getSize(id), 
            currencyId: getCurrencyId(),
            color: getActiveColorButton(id),
            capacity:getCapacity(id),
            index:getCurrentIndex(),
        }
    }
    ChangeImage (imageSrc, imageIndex){
        updateActiveImage(this.state.id, imageIndex);
        this.setState({activeImageIndex:imageIndex});
    }

    ChangeSize (productId, buttonId){
        updateSize({productId:productId, buttonId:parseInt(buttonId)});
        this.props.rerender();
    }
    ChangeCapacity (productId, buttonId){
        updateCapacity({productId:productId, buttonId:parseInt(buttonId)});
        this.props.rerender();
    }
    ChangeColor (productId, buttonId){
        updateColor({productId:productId, buttonId:parseInt(buttonId)});
        this.props.rerender();
    }
    wideViewToggle = ()=>{
        const imageContainer = document.getElementById("img-wide-view-container");
        const shadow = document.getElementById("background-shadow");
        if(imageContainer.className.includes("hidden")){
            imageContainer.classList.remove("hidden");
            imageContainer.classList.add("flex");
            shadow.classList.remove("hidden"); 
            shadow.classList.add("flex");
        }else{
            imageContainer.classList.remove("flex");
            imageContainer.classList.add("hidden");
            shadow.classList.remove("flex");
            shadow.classList.add("hidden");
        }
    }
    parseHTML = (html)=> {
        const container = document.createElement('div');
        container.innerHTML = html;
        return container.textContent;
    }
    handleDisplay = (attributes, buttonsType)=>{
        const attr = JSON.parse(attributes);
        let val = "hidden"; 
        attr.forEach(item => {
            if(item.name === buttonsType){val =  "flex";}
        });
        return val; 
    }
    dropDownToggle = ({hidden=false})=>{
        const container = document.getElementById("dropdown-container");
        const angleDown = document.getElementById('angleUp-container');
        const angleUp = document.getElementById('angleDown-container');

        if(container.className.includes("hidden")){
            container.classList.remove("hidden");           
            angleDown.classList.remove('hidden');
            angleUp.classList.add('hidden');
        }else{
            container.classList.add("hidden");
            angleDown.classList.add('hidden');
            angleUp.classList.remove("hidden");
        }
        if(hidden){container.classList.add("hidden");}
    }
    handleNotification = ()=> {
        const container = document.getElementById("notification-container");
        const dropDown = document.getElementById("dropdown-container");
        if(container.className.includes('hidden') && dropDown.className.includes("hidden")){
            container.classList.add("flex");
            container.classList.remove("hidden");
            setTimeout(() => {
                container.classList.remove("flex");
                container.classList.add("hidden");
            }, 1000);
        }else {
            container.classList.remove("flex");
            container.classList.add("hidden");
        }
    }
    handleCartStatus = ({ProductId, index=null, prices, addExtraProduct=false})=>{
        if(addExtraProduct){
            updateInCartStatus({itemId:this.state.id, addExtraProduct:addExtraProduct, prices:prices, inCart:true, size:this.state.size, activeImageIndex:getActiveImageIndex(this.state.id)});
            this.handleNotification();
        }else {
                updateInCartStatus({itemId:this.state.id, index:index, prices:prices, inCart:false, size:this.state.size, activeImageIndex:getActiveImageIndex(this.state.id)});
                if(getProductIndexCount(ProductId)<1){this.dropDownToggle({hidden:true});}
                this.updateIndex({index:index, objectDeleted:true});
        }
        this.props.rerender();
    }
    updateIndex = ({index=null, productId=this.state.id, objectDeleted=false})=>{
        if(objectDeleted){
            let indexCount = getProductIndexCount(productId);
            let currentIndex = localStorage.getItem("index");
            if(currentIndex > indexCount){
                localStorage.setItem("index", indexCount);
            }
        }else {
            localStorage.setItem("index", index);
           this.setState({index:index});
        }
        document.location.hash = "index="+localStorage.getItem("index");
    }

    handleOutOfStock = ()=> {
        const container = document.querySelector(".in-stock-container #text-container");
        const outOfStock = document.getElementById("outofstock-notification-container");
        container.classList.add("outOfStock");
        outOfStock.classList.add("outofstock-notification");
        outOfStock.classList.remove("hidden");
        setTimeout(()=>{
        container.classList.add("outOfStock");
            container.classList.remove("outOfStock");
            outOfStock.classList.remove("outofstock-notification");
            outOfStock.classList.add("hidden");
        }, 1000);
    }
    static getDerivedStateFromProps (props, state) {
        return {id:document.location.pathname.slice(9)}
    }
    componentDidMount = ()=> {
      updateActivePage();
    }
    render(){ 
        return(<>
            <div className="product-description-page-container">
                <Query query={PRODUCT_QUERY} variables={{id:this.state.id}}>
                    {({data, loading, error})=>{
                        if(loading){return <div className="loader-container"><span className="loader"></span></div>;}
                        if(error){return console.log(error)}
                        return (<>
                            <div className="first-column-container" id="first-column-container">
                                <div className='images-container' id='side-images-container'>
                                    {data && data.product.gallery.map((item, key) => {return (
                                        <img key={key} src={item} alt='' className={getActiveImage(this.state.id, key)} onClick={()=>this.ChangeImage(item, key)} />
                                    )})}
                                </div>
                            </div>
                            <div className="second-column-container">
                                <div className='background-shadow hidden' id="background-shadow" ></div>
                                <div className="img-wide-view-container hidden" id="img-wide-view-container">
                                   <img alt="" onClick={()=>this.wideViewToggle()} src={data.product.gallery[getActiveImageIndex(data.product.id)]} id="selected-wide-image" className="selected-image" />
                               </div>
                               <img alt="" onClick={()=>this.wideViewToggle()} src={data.product.gallery[getActiveImageIndex(data.product.id)]} id="selected-image" className="selected-image" />
                            </div>
                            <div className="third-column-container">
                                <div className="content-container" id="third-column-content-container">
                                    <div className='name-container'>
                                        <strong title={data.product.name}> {data.product.name}</strong>
                                        <div title='Brand'><span>{data.product.brand} </span></div>
                                    </div>
                                    <div className='category-container'>
                                        <strong>CATEGORY: </strong> 
                                        <div>
                                        {data.product.category.charAt(0).toUpperCase() + data.product.category.slice(1)}
                                        </div>
                                    </div>
                                    <div className='in-stock-container' id='in-stock-container'>
                                        <div className='outofstock-notification hidden' id='outofstock-notification-container'>
                                            <SVG name='handpointdown' bgColor='red' />
                                        </div>
                                        <strong id='text-container'>{(data.product.inStock)?"Available in Stock":"Out of stock"}</strong>
                                    </div>
                                    <div className={(data.product.attributes.length > 0)? "capacity-container " + this.handleDisplay(JSON.stringify(data.product.attributes ), 'Capacity'):" capacity-container hidden" }>
                                        <div>
                                            {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Capacity"){return (<strong key={key}>{item.name.toUpperCase()}:</strong>)}return null;})} 
                                        </div>
                                        <div className={`capacity-buttons-container-${data.product.id}`} id="capacity-buttons-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Capacity') {
                                                return (attr.items.map((item, key)=> {return (
                                                    <button id={key } onClick={ () => this.ChangeCapacity(data.product.id, key) } 
                                                    className={getActiveCapacityButton(this.state.id, key)} 
                                                    title={item.displayValue} key={item.id }>{item.displayValue}</button>
                                                )}))}
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                    <div className={`size-container ${(data.product.attributes.length > 0)?this.handleDisplay(JSON.stringify(data.product.attributes ), 'Size'):"hidden" }`} >
                                        <div>
                                          {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Size"){return (<strong key={key}>{item.name.toUpperCase()}:</strong>)}return null;})} 
                                        </div>
                                        <div className={`size-buttons-container-${data.product.id}`} id="size-buttons-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Size'){
                                                return (attr.items.map((item, key)=> {return (
                                                    <button  id={key }
                                                    onClick={ () => this.ChangeSize(data.product.id, key) } 
                                                    className={getActiveSizeButton(this.state.id, key)} 
                                                    title={item.displayValue} key={item.id }>{item.value}</button>
                                                )}))}
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                    <div className={`color-container ${(data.product.attributes.length > 0)?this.handleDisplay(JSON.stringify(data.product.attributes ), 'Color'):"hidden" }`}>
                                        <div>
                                          {(data.product.attributes.length > 0 ) && data.product.attributes.map((item, key)=> {if (item.name === "Color"){return (<strong key={key}>{item.name.toUpperCase()}:</strong>)}return null;})} 
                                        </div> 
                                        <div className={`color-buttons-container-${data.product.id}`} id="color-container">
                                            {data.product.attributes.map((attr, AttrKey)=> {
                                                if(attr.name ==='Color'){
                                                return (attr.items.map((item, key)=> {return (
                                                    <button  id={key } 
                                                    onClick={ () => this.ChangeColor(data.product.id, key) } 
                                                    className={getActiveColorButton(this.state.id, key)} 
                                                    style={{backgroundColor:item.value}}
                                                    title={item.displayValue} key={item.id }></button>
                                                    )}))}
                                                    return null;
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
                                        <div className='notification-container hidden' id='notification-container' onClick={()=>this.handleNotification()}>
                                            <div className='text-container'>
                                                <span>The product added to the cart</span>
                                            </div>
                                            <div className='handpointdown-container'>
                                                <SVG name='handpointdown' bgColor='#0faa0f' />
                                            </div>
                                        </div>
                                        <div className='buttons-container'>
                                            <button className={ (getInCartStatus(data.product.id))?"add-more-to-cart-button":((data.product.inStock)?`add-to-cart-button`:`disabled`)} 
                                            title={(data.product.inStock)?"Add to the cart":"The product is temporarily out of stock"}
                                            onClick={()=>{
                                                if(data.product.inStock){
                                                    this.handleCartStatus({ProductId:data.product.id, addExtraProduct:true, prices:data.product.prices.map(item=> {return item.amount})})
                                                }else {
                                                    this.handleOutOfStock();
                                                }
                                            }}>
                                                    <span className='text-container'>
                                                    {(getProductIndexCount(data.product.id) >= 1)?`ADD MORE TO THE CART`:`ADD TO THE CART`}
                                                    </span>
                                            </button>   
                                            <button id='dropdown-button' className={(getProductIndexCount(data.product.id)> 0)?"dropdown-el show":"dropdown-el hidden"} onClick={()=>{this.dropDownToggle({})}}>
                                                    <div className='svg-container dropdown-el'>
                                                        <div className='dropdown-el-container' id='angleDown-container'>
                                                            <SVG name='angleDown' bgColor='white' />
                                                        </div>
                                                        <div className='dropdown-el-container hidden' id='angleUp-container'>
                                                            <SVG name='angleUp' bgColor='white' />
                                                        </div>
                                                    </div>
                                            </button>
                                        </div>
                                        <div className='dropdown-container hidden' id='dropdown-container'>
                                            <div className='products-dropdown-container dropdown-el' id='products-dropdown-container'>
                                               {getIndexesOfProductInCart(data.product.id).map((item, key) => {
                                                   return (<div key={key} className={(getCurrentIndex() === item)?'products-dropdown active':'products-dropdown'}>
                                                                    <span onClick={()=> {this.updateIndex({index:item, productId:data.product.id})}} className='text-container'>{item} - {data.product.name}</span> 
                                                                    <button id='remove-product-button' onClick={()=>{this.handleCartStatus({ProductId:data.product.id, index:item, prices:data.product.prices.map(item=> {return item.amount})})}}>x</button>
                                                            </div>);
                                                   })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='description-container' id="description-container">{this.parseHTML(data.product.description)}</div>
                                </div>
                            </div>
                              </>);
                    }}
                </Query>
            </div>
        </>)
    }
}