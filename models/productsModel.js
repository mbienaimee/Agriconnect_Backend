
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  // farmerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: false,
  // },
  productName: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
//   productInStock:{
//     type:Number,
//     required:false
// },
  category:{
    type: String,
    required:false,
    // enums:[',Fruits']Vegetables
  },
  // image: {
  //   public_id: {
  //     type: String,
  //   },
  //   asset_id:{
  //     type: String,
  //   },
  //   url:{
  //     type: String,
  //   },
  // },
 
 
}, {
  timestamps: true
}
);

const Product = new mongoose.model('Product', ProductSchema);
export default Product;
