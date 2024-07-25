import mongoose from "mongoose";

const orderItemSchema=new mongoose.Schema({
    quantity:{
        type:Number,
        required:true,
    },
    product: 
      {
        productId: {
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'Product', 
             required: true
             },
            },
    
    
})
const OrderItem = new mongoose.model('orderItem', orderItemSchema);

export default OrderItem;