import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default:0
  },
  totalPrice: {
    type: Number,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = new mongoose.model('carts', CartSchema);

export default Cart;



