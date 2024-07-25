import Product from "../models/productsModel.js";
import { upload } from "../utils/uploadImage.js";
import cloudinary from "../utils/cloudinary.js";




export const AddProduct = 
async (req, res, next) =>{
  try {
    

    const uploadImage = await cloudinary.uploader.upload(req.file.path, (err, uploadedImage) => {
  if(err){
    console.log(err.message);
    return res.status(500).json({message: 'error'});
  }
})

    const { productName, description, price, productInStock, category } = req.body;

   
    const newProduct = new Product({
      productName,
      description,
      price,
      productInStock,
      category,
      image: {
        public_id: uploadImage.public_id,
        asset_id: uploadImage.asset_id,
        url: uploadImage.url
      } 
    });

    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product.' });
  }
}

export const getProduct = async (req,res,next) =>{
    const {farmerId} = req.params
    try{
        const getProduct = await Product.find({farmerId})
        res.status(200).json({
            getProduct
        })

    }
    catch(err){
        res.status(500).json({ message: err.message });

    }
}

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if(!product){
      res.status(500).json({ success: false , message: 'no product available'
    })
    
  }
  res.status(200).json({message:'getting product by its ID successfully',product:product});
} catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const updateProductById = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    
        
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({
          success: true,
          product: updatedProduct,
        });
      } catch (err) {
       
        console.error(err);
        res.status(500).json({ message: 'An error occurred while updating the product.' });
      }
    };

export const DeleteProductById = async (req,res,next) => {
    try {
      
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({
          success: true,
          message: 'Product deleted successfully',
        });
      } catch (err) {
       
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the product.' });
      }
}

export const findProductByCategory = async (req, res, next) => {
    try {
        const categoryName = req.params.category;
        const products = await Product.find({ category: categoryName });
    
        if (products.length === 0) {
          return res.status(404).json({ message: 'No products found with the given category.' });
        }

        res.status(200).json(products);
      } catch (err) {
      
        console.error(err);
        res.status(500).json({ message: 'An error occurred while finding products by category.' });
      }
    };


export const countProduct = async (req, res, next) => {
  try {
    // Count products that are in stock
    const productCount = await Product.countDocuments({ productInStock: { $gt: 0 } });

    if (!productCount) {
      res.status(404).json({ success: false, message: 'No products found in stock' });
    }

    res.json({ productCount: productCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};