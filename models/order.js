import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    buyerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderItems: [
      {
        orderItemsId: {
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'orderItem', 
             required: true
             }
      }
    ],
    shippingAddress:{
      type:String, 
      required: true
    },
    city:{
      type:String, 
      required: true
    },
    country:{
      type:String, 
      required: true
    },
    phone:{
      type:String, 
      required: true
    },
    transactionStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
    },
   
    totalPrice: { 
      type: Number, 
      required: true
     },
      dateOrdered:{
      type:Date,
      default:Date.now
    }
    // isPaid: { 
    //   type: Boolean, 
    //   default: false 
    // },
    
})
const Order = new mongoose.model('order', orderSchema);

export default Order;