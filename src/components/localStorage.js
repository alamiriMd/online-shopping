//this file contains all the needed functions to store, update, fetch,.. data from local storage. 
// the names of the functions, tell what they do
const updateInCartStatus = ({itemId, inCart=false, index=null, addExtraProduct=false,  size=0, deleteAll=false, activeImageIndex=0,capacity=0, prices=[0, 0, 0, 0, 0], color=0 })=>{
    let isItemInLocalStorage = false;
    let countItemsInCart = 0;
    let Index = getCurrentIndex();
    if(inCart){countItemsInCart = 1;}
    if(index){Index = index;}
    const item = {
      id:itemId,
      index:Index,
      inCart:inCart,
      size:size,
      activeImageIndex:activeImageIndex,
      countItemsInCart:countItemsInCart,
      prices: prices,
      color:color,
      capacity:capacity,
    };
    const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:itemId, inCart:false, activeImageIndex:0, countItemsInCart, prices:prices});
    if(addExtraProduct){
      item.index = getFreeIndex(itemId);
      data.push(item);
    }else if(deleteAll){
          for(let i=0; i < data.length; i++){
            if(data[i].id === itemId){
              data[i].inCart = inCart;
              data[i].countItemsInCart = countItemsInCart;
            }
        }
    }
    else {

        for(let i=0; i < data.length; i++){
            if(data[i].id === itemId && data[i].index === Index){
              isItemInLocalStorage = true;
              data[i].inCart = inCart;
              data[i].countItemsInCart = countItemsInCart;
              break;
            }
        }
        if(!isItemInLocalStorage){data.push(item);}
      }
      localStorage.setItem("data", JSON.stringify(data));
      deleteProductsNotInCart(itemId);
      updateProductIndexes(itemId);
  }
const createNewData =({itemId, inCart=false, size=0, activeImageIndex=0,capacity=0, countItemsInCart=0, prices=[0, 0, 0, 0, 0], color=0})=>{
    const data = [];
    const item = {
      id:itemId,
      index:getCurrentIndex(),
      inCart:inCart,
      size:size,
      activeImageIndex:activeImageIndex,
      countItemsInCart:countItemsInCart,
      prices: prices,
      color:color,
      capacity:capacity
    };
    data.push(item);
    localStorage.setItem("data", JSON.stringify(data));
    return JSON.parse(localStorage.getItem("data"));
  }
export const getFreeIndex = (productId)=> {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let index = 1;
  for (let i = 0; i < data.length; i++){
    if(data[i].id === productId && data[i].index === index){
      index++;
    }
  }
  return index;
}
const getActiveImage = (productId, imageIndex, index=null)=>{
    const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:imageIndex});
    let Index = getCurrentIndex();
    if(index){Index = index;}
    for(let i = 0; i < data.length; i++){
        if(data[i].id === productId && data[i].activeImageIndex === imageIndex && data[i].index === Index){
            return "images active-image";
        }
    }
    return "images";
}
const updateActiveImage = (productId, imageIndex)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:imageIndex});
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId){
      data[i].activeImageIndex = imageIndex;
    }
  }
  localStorage.setItem("data", JSON.stringify(data));
}
const createNewItem = ({itemId, inCart=false, size=0, activeImageIndex=0,capacity=0, countItemsInCart=0, prices=[0, 0, 0, 0, 0, 0], color=0})=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:itemId, activeImageIndex:0});
  const item = {
    id:itemId,
    index:getCurrentIndex(),
    inCart:inCart,
    size:size,
    activeImageIndex:activeImageIndex,
    countItemsInCart:countItemsInCart,
    prices: prices,
    color:color,
    capacity:capacity,
  };
  data.push(item);
  localStorage.setItem("data", JSON.stringify(data));
}
const getActiveImageIndex =(productId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:0});
  for(let i=0; i < data.length; i++){
    if(data[i].id === productId){
      return data[i].activeImageIndex;
    }
  }
 createNewItem({itemId:productId});
  return 0;
}
const getInCartStatus = (productId) => {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:0});
  for(let i=0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === getCurrentIndex()){
      return data[i].inCart;
    }
  } 
  createNewItem({itemId:productId});
  return false;
}
const getActiveSizeButton = (productId, buttonId, index=null)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, size:buttonId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].size === buttonId && data[i].index === Index){
          return "size-buttons active-button";
      }
  }
  return "size-buttons";
}
const getActiveColorButton = (productId, buttonId, index)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].color === buttonId && data[i].index === Index){
          return "color-buttons active-button";
      }
  }
  return "color-buttons";
}
const getActiveCapacityButton = (productId, buttonId, index=null)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].capacity === buttonId && data[i].index === Index){
          return "capacity-buttons active-button";
      }
  }
  return "capacity-buttons";
}
const updateSize = ({productId, buttonId, index=null})=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, size:buttonId});
  let Index =  getCurrentIndex();
  if(index){Index = index;}
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === Index){
      data[i].size = buttonId;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}
const updateColor = ({productId, buttonId, index=null})=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  let Index =  getCurrentIndex();
  if(index){Index = index;}
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === Index){
      data[i].color = buttonId;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}
const getSize = (productId, index=null) => {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i=0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === Index){
      return data[i].size;
    }
  }
  return 0; 
}
const getCapacity = (productId, index=null) => {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i=0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === Index){
      return data[i].capacity;
    }
  }
  createNewItem({itemId:productId});
  return 0; 
}
const updateCapacity = ({productId, buttonId, index=null})=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, capacity:buttonId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId && data[i].index === Index){
      data[i].capacity = buttonId;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}
const getTotalItemsInCart = (productId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let count = 0;
  for(let i=0; i < data.length; i++){
    if(data[i].inCart === true){
      count++;
    }
  }
  return count;
}
const getItemsInCart = (productId, index=null)=>{
  let Index = getCurrentIndex();
  if(index){Index = index;}
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  for(let i=0; i < data.length; i++){
    if(data[i].inCart && data[i].id === productId && data[i].index === Index){
      return data[i].countItemsInCart;
    }
  }
  return 0;
}
const getProductTotalPrice = (productId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  const currencyId = getCurrencyId();
  let total = 0;
  for(let i=0; i < data.length; i++){
    if(data[i].inCart === true){
      total += data[i].countItemsInCart * data[i].prices[currencyId];
    }
  }
  return total;
}
const updateProductCountInCart = (productId, operation, index=null)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let Index = getCurrentIndex();
  if(index){Index = index;}
  for(let i=0; i < data.length; i++){
    if(data[i].inCart === true && data[i].id === productId && data[i].index === Index){
      if(data[i].countItemsInCart === 1 && operation === -1){
          data[i].countItemsInCart = 0;
          data[i].inCart = false;
          localStorage.setItem("data", JSON.stringify(data));
        }
        else {
          data[i].countItemsInCart += operation;
          localStorage.setItem("data", JSON.stringify(data));
        }
        break;
    }
  }
}
const getItemsIdsInCart =()=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:""});
  const total = [];
  for(let i=0; i < data.length; i++){
    if(data[i].inCart){
      total.push(data[i].id);
    }
  }
  return total;
}
const getCurrencyId = () =>{
  const currency = localStorage.getItem("currencyId") || localStorage.setItem("currencyId", 0) || localStorage.getItem("currencyId");
  if(['0', '1', '2', '3', '4'].includes(currency)) return currency;
  localStorage.setItem("currencyId", 0);
  return 0;
}
const getActiveItemsInCart = (itemId, inStock)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:itemId, inStock:inStock});
 for(let i=0; i< data.length; i++){
   if(data[i].id === itemId && data[i].inCart && inStock){
     return "shopping-cart active-cart";
   }else if(data[i].id === itemId && !inStock){
     return "shopping-cart out-of-stock";
   }
 }
  return "shopping-cart";
}
const getDarkMode = ()=>{
  const category = localStorage.getItem("darkMode") || localStorage.setItem("darkMode", 'light') || "light";
  if(['light', 'dark'].includes(category)) return category;
  localStorage.setItem("darkMode", 'light');
  return "light";
}
export const getCurrentIndex = ()=>{
  const index = parseInt(localStorage.getItem("index")) || localStorage.setItem("index", 1) || 1;
  if(index > 0){return index;}
  localStorage.setItem("index", 1);
  return 1;
}
export const getProductIndexCount = (productId)=> {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let count = 0;
  for(let i=0; i < data.length; i++){
    if(data[i].inCart === true && data[i].id === productId ){
      count++;
    }
  }
  return count;
}
export const getIndexesOfProductInCart = (productId)=> {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let indexes = [];
 for(let i = 0; i < data.length; i++){
   if(data[i].inCart && data[i].id === productId){
      indexes.push(data[i].index);
   }
 } 
 return indexes;
}
export const deleteProductsNotInCart = (productId)=> {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let newData = [];
  for(let i = 0; i < data.length; i++){
    if(data[i].id === productId && !data[i].inCart){
    }else {
      newData.push(data[i]);
    }
  }
  localStorage.setItem("data", JSON.stringify(newData));
}
export const updateProductIndexes = (productId)=> {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  let index = 1;
  for(let i = 0; i < data.length; i++){
    if(data[i].id === productId){
      data[i].index = index;
      index++;
    }
  }
  localStorage.setItem("data", JSON.stringify(data));
}
export const updateActivePage = (currentPage=null)=> {
  const container = document.getElementById("navbar-links-container");
  const links = container.querySelectorAll("a");
  if(!currentPage){currentPage = document.location.pathname;}
  for(let i = 0; i< links.length; i++) {
      links[i].classList.remove("active");
      if(links[i].id === currentPage ){links[i].classList.add("active");}
  }
}
export {getDarkMode, getCapacity, updateCapacity, getActiveCapacityButton, getActiveColorButton, updateColor, getActiveItemsInCart, getCurrencyId,getItemsIdsInCart, updateProductCountInCart, getProductTotalPrice, getItemsInCart, getTotalItemsInCart, updateInCartStatus, getActiveImage, updateActiveImage, getActiveImageIndex, getInCartStatus, getActiveSizeButton, updateSize, getSize};  