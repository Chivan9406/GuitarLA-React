import type { CartItem, Guitar } from '../types'
import { db } from '../data/db.ts'

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

const MIN_ITEMS = 1
const MAX_ITEMS = 5

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  let updatedCart: CartItem[] = []

  switch (action.type) {
    case 'add-to-cart':
      updatedCart = state.cart.find(item => item.id === action.payload.item.id)
        ? state.cart.map(item => item.id === action.payload.item.id && item.quantity < MAX_ITEMS
          ? {...item, quantity: item.quantity + 1}
          : item)
        : [...state.cart, {...action.payload.item, quantity: 1}]
      break

    case 'remove-from-cart':
      updatedCart = state.cart.filter(item => item.id !== action.payload.id)
      break

    case 'decrease-quantity':
      updatedCart = state.cart.map(item => item.id === action.payload.id && item.quantity > MIN_ITEMS
        ? {...item, quantity: item.quantity - 1}
        : item)
      break

    case 'increase-quantity':
      updatedCart = state.cart.map(item => item.id === action.payload.id && item.quantity < MAX_ITEMS
        ? {...item, quantity: item.quantity + 1}
        : item)
      break

    case 'clear-cart':
      updatedCart = []
      break

    default:
      return state
  }

  return {
    ...state,
    cart: updatedCart
  }
}