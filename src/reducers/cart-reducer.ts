import type { CartItem, Guitar } from '../types'
import { db } from '../data/db'

export type CartActions =
  { type: 'add-to-cart', payload: { item: Guitar } } |
  { type: 'remove-from-cart', payload: { id: Guitar['id'] } } |
  { type: 'decrease-quantity', payload: { id: Guitar['id'] } } |
  { type: 'increase-quantity', payload: { id: Guitar['id'] } } |
  { type: 'clear-cart' }

export type CartState = {
  data: Guitar[]
  cart: CartItem[]
}

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem('cart')
  return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState: CartState = {
  data: db,
  cart: initialCart()
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  switch (action.type) {
    case "add-to-cart": {
      const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
      let updatedCart: CartItem[] = []

      if (itemExists) {
        updatedCart = state.cart.map(item => {
          if (item.id === action.payload.item.id && item.quantity < MAX_ITEMS) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
      } else {
        const newItem: CartItem = { ...action.payload.item, quantity: 1 }
        updatedCart = [...state.cart, newItem]
      }

      return {
        ...state,
        cart: updatedCart
      }
    }
    case "remove-from-cart": {
      const updatedCart = state.cart.filter(item => item.id !== action.payload.id)
      return {
        ...state,
        cart: updatedCart
      }
    }
    case "decrease-quantity": {
      const updatedCart = state.cart.map(item => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return {
            ...item,
            quantity: item.quantity - 1
          }
        }
        return item
      })

      return {
        ...state,
        cart: updatedCart
      }
    }
    case "increase-quantity": {
      const updatedCart = state.cart.map(item => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }
        return item
      })

      return {
        ...state,
        cart: updatedCart
      }
    }
    case "clear-cart":
      return {
        ...state,
        cart: []
      }
    default:
      return state
  }
}
