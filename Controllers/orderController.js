 
import Product from "../models/productsModel.js";
// import Cart from "../models/CartModel.js";
// import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItem.js";
import Order from "../models/order.js";





//   // Create a new order

  export const createOrder = async (req, res) => {
    try {
      const { buyerId, orderItems, shippingAddress, city, country, phone, transactionStatus } = req.body;
  
      
      if (!buyerId ||!Array.isArray(orderItems)) {
        return res.status(400).json({ message: 'Invalid request body.' });
      }
      const productPrices = await Product.find({ _id: { $in: orderItems.map(item => item.productId) } }).lean();
  
      const orderTotalPrice = orderItems.reduce((total, item) => {
        const product = productPrices.find(p => p._id.equals(item.productId));
        return total + (product.price * parseInt(item.quantity));
      }, 0);

      const savedOrderItems = await Promise.all(orderItems.map(async (item) => {
        const newItem = new OrderItem({
          quantity: parseInt(item.quantity),
          product: {
            productId: item.productId,
            price: productPrices.find(p => p._id.equals(item.productId)).price 
          }
        });
        return newItem.save();
      }));
  
      // Create and save the Order instance, referencing the saved OrderItem documents
      const order = new Order({
        buyerId,
        orderItems: savedOrderItems.map(item => ({ orderItemsId: item._id })),
        shippingAddress,
        city,
        country,
        phone,
        totalPrice: orderTotalPrice, 
        transactionStatus
      });
  
      await order.save();
  
      
      res.status(201).json({success: true,order});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order.' });
    }
  }
  

     // Get all orders
  export const getAllOrders = async (req, res) => {
    try {
      const orderList = await Order.find().populate({
        path: 'buyerId',
        model: 'buyer',
        select: 'firstName lastName' 
      }).
      populate({
        path: 'orderItems.orderItemsId', 
        model: 'orderItem',
        select: 'quantity'
      }).sort({'dateOrdered' : -1});

      if(!orderList){
        res.status(500).json({ success: false , message: 'no item available'
      })
      
    }
    res.status(200).json({message:'List of Order',Order:orderList});
  } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const getOrdersById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate({
        path: 'buyerId',
        model: 'buyer',
        select: 'firstName lastName' 
      }).
      populate({
        path: 'orderItems.orderItemsId', 
        model: 'orderItem',
        select: 'quantity'
      })

      if(!order){
        res.status(500).json({ success: false , message: 'no item available'
      })
      
    }
    res.status(200).json({message:'List of Order',Order:order});
  } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update an order by ID
  export const updateOrder = async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id, 
      req.body, 
        { new: true }
      );
  
      if (!order) {
        return res
         .status(404)
         .json({ message: 'No order with this id was found.' });
      }
      res.json({ message: 'Product updated successfully', order: order });
    } catch (err) {
      res.status(400).json({ message: err.message }); 
    };
  };
  

  // Delete an order by ID
  export const deleteOrder = async (req, res) => {
    try {
      const result = await Order.findByIdAndDelete(req.params.id).populate('ordetItem');
  
      if (result) {
        await Order.orderItems,map(async orderItem =>{
          await orderItem.findByIdAndDelete(orderItem)
        })
        res.status(200).json({ success: true, message: 'Order successfully deleted',});
      }
        else{
          return res.status(404).json({ message: 'Order not found' })
        };
     
    } catch (err) {
      res.status(500).json({ message: "Server error"});
    }
  };
  

//  getting total product ordered on the farmer dashboard

export const getTotalProductOrders = async (req, res) => {
  try {
    // Aggregate to sum the totalPrice across all orders
    const totalProduct = await Order.aggregate([
      {
        $group: {
          _id: null, 
          totalProduct: { $sum: "$totalPrice" } 
        }
      }
    ]);
    if (!totalProduct.length) {
      return res.status(400).json({ message: 'The order sales cannot be generated' });
    }

    const result = totalProduct[0];

    // Return the total product orders
    res.json({ 
    message:'Product on dashboard',
    totalProduct: result.totalProduct 
  });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



export const countOrder = async (req, res, next) => {
  try {
    // Count all orders
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      res.status(404).json({ success: false, message: 'No orders found' });
    }

    res.json({ orderCount: orderCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};