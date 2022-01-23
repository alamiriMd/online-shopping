//this file contains all the needed functions to store, update, fetch,.. data from local storage. 
// the names of the functions, tell what they do
const updateInCartStatus = ({itemId, inCart, size=0, activeImageIndex=0,capacity=0, countItemsInCart=1,prices=[0, 0, 0, 0, 0], color=0 })=>{
    let isItemInLocalStorage = false;
    let item = {
      id:itemId,
      inCart:inCart,
      size:size,
      activeImageIndex:activeImageIndex,
      countItemsInCart:countItemsInCart,
      prices: prices,
      color:color,
      capacity:capacity,
    };
    let Data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:itemId, inCart:false, activeImageIndex:0, countItemsInCart, prices:prices});
    for(let i=0; i < Data.length; i++){
        if(Data[i].id == itemId){
          isItemInLocalStorage = true;
          Data[i] = item;
          break;
        }
    }
    if(!isItemInLocalStorage){Data.push(item);}
    localStorage.setItem("data", JSON.stringify(Data));
  }
const createNewData =({itemId, inCart=false, size=0, activeImageIndex=0,capacity=0, countItemsInCart=0, prices=[0, 0, 0, 0, 0], color=0})=>{
    let data = [];
    let item = {
      id:itemId,
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
const getActiveImage = (productId, imageIndex)=>{
    const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:imageIndex});
    for(let i = 0; i < data.length; i++){
        if(data[i].id === productId && data[i].activeImageIndex === imageIndex){
            return "images active-image";
        }
    }
    return "images";
}
const updateActiveImage = (productId, imageIndex)=>{
  let data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, activeImageIndex:imageIndex});
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId){
      data[i].activeImageIndex = imageIndex;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}
const createNewItem = ({itemId, inCart=false, size=0, activeImageIndex=0,capacity=0, countItemsInCart=0, prices=[0, 0, 0, 0, 0, 0], color=0})=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:itemId, activeImageIndex:0});
  let item = {
    id:itemId,
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
  for(let i=0; i<data.length; i++){
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
    if(data[i].id === productId){
      return data[i].inCart;
    }
  } 
  createNewItem({itemId:productId});
  return false;
}
const getActiveSizeButton = (productId, buttonId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, size:buttonId});
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].size === buttonId){
          return "size-buttons active-button";
      }
  }
  return "size-buttons";
}
const getActiveColorButton = (productId, buttonId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].color === buttonId){
          return "color-buttons active-button";
      }
  }
  return "color-buttons";
}
const getActiveCapacityButton = (productId, buttonId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  for(let i = 0; i < data.length; i++){
      if(data[i].id === productId && data[i].capacity === buttonId){
          return "capacity-buttons active-button";
      }
  }
  return "capacity-buttons";
}
const updateSize = ({productId, buttonId})=>{
  let data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, size:buttonId});
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId){
      data[i].size = buttonId;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}

const updateColor = ({productId, buttonId})=>{
  let data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, color:buttonId});
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId){
      data[i].color = buttonId;
      localStorage.setItem("data", JSON.stringify(data));
      break;
    }
  }
}
const getSize = (productId) => {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  for(let i=0; i< data.length; i++){
    if(data[i].id === productId){
      return data[i].size;
    }
  }
  createNewData({itemId:productId});
  return 0; 
}
const getCapacity = (productId) => {
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  for(let i=0; i< data.length; i++){
    if(data[i].id === productId){
      return data[i].capacity;
    }
  }
  createNewData({itemId:productId});
  return 0; 
}
const updateCapacity = ({productId, buttonId})=>{
  let data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId, capacity:buttonId});
  for(let i =0; i< data.length; i++){
    if(data[i].id === productId){
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
const getItemsInCart = (productId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  for(let i=0; i < data.length; i++){
    if(data[i].inCart && data[i].id === productId){
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
const updateProductCountInCart = (productId, operation)=>{
  const data = JSON.parse(localStorage.getItem("data")) || createNewData({itemId:productId});
  for(let i=0; i < data.length; i++){
    if(data[i].inCart === true && data[i].id === productId){
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
  let total = [];
  for(let i=0; i < data.length; i++){
    if(data[i].inCart){
      total.push(data[i].id);
    }
  }
  return total;
}
const getCurrencyId = () =>{
  let currency = localStorage.getItem("currencyId") || localStorage.setItem("currencyId", 0) || localStorage.getItem("currencyId");
  if(['0', '1', '2', '3', '4'].includes(currency)) return currency;
  localStorage.setItem("currencyId", 0);
  return 0;
}
const getActiveItemsInCart = (itemId)=>{
  const data = JSON.parse(localStorage.getItem("data")) || [];
 for(let i=0; i< data.length; i++){
   if(data[i].id === itemId && data[i].inCart){
     return "shopping-cart active-cart";
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

export {getDarkMode, getCapacity, updateCapacity, getActiveCapacityButton, getActiveColorButton, updateColor, getActiveItemsInCart, getCurrencyId,getItemsIdsInCart, updateProductCountInCart, getProductTotalPrice, getItemsInCart, getTotalItemsInCart, updateInCartStatus, getActiveImage, updateActiveImage, getActiveImageIndex, getInCartStatus, getActiveSizeButton, updateSize, getSize};  