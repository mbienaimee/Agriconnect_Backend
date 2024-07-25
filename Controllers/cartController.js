import express from 'express';
import Cart from "../models/CartModel.js";
import Product from '../models/productsModel.js';
import userModel from '../models/user.js';
// import { validateCart } from '../utils/validation.js';


export const addProductToCart = async (req, res) => {
  try {
    const { buyerId, productId, quantity, transactionStatus = 'pending' } = req.body;

    
    const product = await Product.findById(productId).lean(); 

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if ( product.productInStock < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }

    // await Product.findByIdAndUpdate(productId, { $inc: { productInStock: -quantity } });

    
    const totalPrice = quantity * product.price;

    
    let existingCart = await Cart.findOne({ buyerId }).populate('buyerId').exec();

    if (!existingCart) {
      
      existingCart = new Cart({
        buyerId,
        productId,
        quantity,
        totalPrice,
        transactionStatus,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      await existingCart.save();
      res.status(201).json({ 
        message: 'Cart created and product added successfully', 
        cart: existingCart 
    });
    } else {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: existingCart._id }, 
        {
          $set: {
            productId,
            quantity,
            totalPrice,
            transactionStatus,
            updatedAt: Date.now()
          }
        },
        { new: true }
      );
      res.status(200).json({ message: 'Product added to existing cart', cart: updatedCart });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error: error.message });
  }
};


export const getAllCarts = async (req, res) => {
  try {
    const cartList = await Cart.find()
    if(!cartList){
      res.status(500).json({ success: false , message: 'no carts available'
    })
    
  }
  res.status(200).json({message:'List of carts',carts:cartList});
} catch (error) {
    res.status(500).json({ message: error.message });
  }
}



    export const removeProductFromCart = async (req, res, next) => {
      try {
      
        const deletedProduct = await Cart.findByIdAndDelete(req.params.id);
    
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
};

    export const getCart = async (req,res,next) =>{
      const buyerId = req.params.buyerId;
      
        try {
          const userId = req.User._id;
          const user = await userModel.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          const cart= await cartModel.findById(userId, req.params.userId)
          res.status(200).json(cart);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        }
      }


      export const updateProductInCart = async (req, res, next) => {
        try {
          const updatedProduct = await Cart.findByIdAndUpdate(req.params.id, req.body, {new: true});
      
          
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
      
    