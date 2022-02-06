import React from 'react';
import {Query} from '@apollo/client/react/components';
import SVG from './svg-store';
import {Link} from 'react-router-dom';
import {PRODUCTS_QUERY} from './queries';
import { updateInCartStatus, getCurrencyId, getActiveItemsInCart } from './localStorage';

export default class Products extends React.Component {
  inCartStatusToggle = (itemId, prices, index=0, addExtraProduct=false) => {
    const cartContainer = document.getElementById("shopping-cart-" + itemId);
    if(cartContainer.className.includes("active-cart")){
      updateInCartStatus({itemId:itemId, inCart:false, index:index, prices:prices, addExtraProduct:addExtraProduct, deleteAll:true});
    }
    else{
      updateInCartStatus({itemId:itemId, inCart:true, index:index, prices:prices, addExtraProduct:addExtraProduct});
    }
   this.props.rerender();
  }
    render(){
        return(<>
            <Query query={ PRODUCTS_QUERY }>
                  {({data, loading, error })=>{
                    if(loading){return <div className="loader-container"><span className="loader"></span></div>}
                    if(error){return console.log(error);}
                      return (<div className="products-container"> 
                            { data.categories[0].products.map((item, key) =>{
                                //this if statement only because I have some data has no attributes and this 
                                // will throw an error wihout the following if statement. 
                                if(item.category ===   this.props.category || this.props.category === 'all'){
                                return (<div key={key} title={(item.inStock)?item.name:"The product is temporarily out of stock"} className={(item.inStock)?"product":"product out-of-stock"} id={item.id }>
                                  <div className='inStock-container'>
                                     <Link to={`/product/${item.id}`}><span>{(!item.inStock)?"OUT OF STOCK":""} </span></Link> 
                                  </div>
                                  <div className="home-img-container" id="home-img-container"><Link to={`/product/${item.id}`}>
                                      <img className="img" alt='' src={item.gallery[0]} title={(item.inStock)?item.name:"The product is temporarily out of stock"} />
                                    </Link>
                                  </div>
                                  <div className="shopping-cart-container">
                                    <div id={`shopping-cart-${item.id}`} onClick={()=>{if(item.inStock)this.inCartStatusToggle(item.id, item.prices.map(item=> {return item.amount}))}} className={getActiveItemsInCart(item.id, item.inStock)}>
                                        <SVG bgColor={(getActiveItemsInCart(item.id, item.inStock).includes("active-cart"))?"white":"silver"} />
                                    </div>
                                  </div>
                                  <Link to={`/product/${item.id}`}>
                                  <div className="name-container">
                                    <p className='name' title="Product name">{item.name}</p>
                                  </div>
                                  <div className="price-container">
                                    <span title={item.prices[getCurrencyId()].currency.label}> {item.prices[getCurrencyId()].amount} </span><span >{item.prices[getCurrencyId()].currency.symbol}</span>
                                  </div>
                                  </Link>
                                </div>)}
                              return null;
                              })
                            }
                      </div>);
                  }}
                </Query>
        </>)
    }
}