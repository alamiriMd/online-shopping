import {gql } from '@apollo/client';

export const PRODUCTS_QUERY = gql`
query myQuery {
categories {
  products{
      id
      gallery
      inStock
      brand
      category
      name
      description
      prices{
          amount
          currency{
              label
              symbol
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
}
`;

export const PRODUCT_QUERY = gql`
    query ProductDetail($id:String!){
        product(id:$id){            
        id
        name
        category
        brand
        inStock
        gallery
        description
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