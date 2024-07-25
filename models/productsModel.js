
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productInStock:{
    type:Number,
    required:true
},
  category:{
    type: String,
    required:false,
    enums:['Vegetables,Fruits']
  },
  image: {
    public_id: {
      type: String,
    },
    asset_id:{
      type: String,
    },
    url:{
      type: String,
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isExpired: Boolean,
  isFeatured: Boolean,
  featureEndDate: Date
}, {
  timestamps: true
}
);

const Product = new mongoose.model('Product', ProductSchema);
export default Product;
