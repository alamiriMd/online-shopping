import React from 'react';
import {Query} from '@apollo/client/react/components';
import SVG from './svg-store';
import {Link} from 'react-router-dom';
import {gql } from '@apollo/client';
import {  getTotalItemsInCart, updateInCartStatus, getCurrencyId, getActiveItemsInCart } from './localStorage';


const PRODUCTS_QUERY = gql`
  query myQuery {
  categories {
    products{
        id
        gallery
        inStock
        brand
        category
        prices{
            currency{
                label
                symbol
            }
            amount
        }
        name
        description
        attributes  {
          name
        }
      }
    }
  }
`;


export default class Products extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     totalItemsInCart: getTotalItemsInCart(""),
    }
  }
  addToCart(itemId, prices){
    const cartContainer = document.getElementById("shopping-cart-" + itemId);
    if(cartContainer.className.includes("active-cart")){
      cartContainer.classList.remove("active-cart");
      updateInCartStatus({itemId:itemId, inCart:false, prices:prices});
      this.setState({totalItemsInCart: getTotalItemsInCart(itemId)});
    }
    else{
      cartContainer.classList.add("active-cart");
      updateInCartStatus({itemId:itemId, inCart:true, prices:prices});
      this.setState({totalItemsInCart: getTotalItemsInCart(itemId)});
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
                            { 
                              data.categories[0].products.map((item, key) =>{
                                //this if statement only because I have some data has no attributes and this 
                                // will throw an error wihout the following if statement. 
                                if(item.category ===   this.props.category || this.props.category === 'all')
                              
                                return (<div key={key} className="product" id={item.id }>
                                  <div className="home-img-container" id="home-img-container"><Link to={`/product/${item.id}`}>
                                    <img className="img" src={item.gallery[0]} title={`${item.name}`} />
                                    </Link>  
                                  </div>
                                  <div className="shopping-cart-container" >
                                    <div id={`shopping-cart-${item.id}`} onClick={()=>this.addToCart(item.id, item.prices.map(item=> {return item.amount}))} className={getActiveItemsInCart(item.id)}>
                                          <SVG bgColor={(getActiveItemsInCart(item.id).includes("active-cart"))?"white":"silver"}  />
                                      </div>
                                  </div>
                                  <Link to={`/product/${item.id}`}>
                                  <div className="name-container">
                                    <p title="Product name">{item.name}</p>
                                  </div>
                                  <div className="price-container">
                                    <span title={item.prices[getCurrencyId()].currency.label}> {item.prices[getCurrencyId()].amount} </span><span >{item.prices[getCurrencyId()].currency.symbol}</span>
                                  </div>
                                  </Link>
                                </div>)
                              })
                            }
                      </div>);
                  }}
                </Query>
        </>)
    }
}