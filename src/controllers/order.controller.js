import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { error } from "../utils/error.js";
import sendEmail from "../utils/sendEmail.js";

// placing a cash on delivery order
export const placeOrder = async (req, res, next) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    if (!items || !amount || !address)
      throw error("All fields are required", 400);
    if (!userId) throw error("Unauthorized", 401);

    const orderData = {
      userId,
      items,
      amount,
      address,
      status: "Pending",
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name price stock"
    );
    if (!products || products.length === 0) {
      throw error("No products found for the given items", 404);
    }

    // checking the availability
    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({success: false, message: `Insufficient stock for ${product ? product.name : "Unknown Product"}. Only ${product ? product.stock : 0} left`, stockLeft: product?.stock});
      }
    }

    const newOrder = new Order(orderData);
    const resp = await newOrder.save();

    if (!resp) throw error("Order placement failed", 500);

    await User.findByIdAndUpdate(userId, { cartData: {}, new: true });

    // Combine items with product details for email
    const itemsWithDetails = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      return {
        productId: item.productId,
        name: product ? product.name : "Unknown Product",
        quantity: item.quantity,
        price: product ? product.price : 0,
      };
    });

    const emailData = {
      username: req.user.username,
      items: itemsWithDetails,
      date: resp.date,
      paymentMethod: resp.paymentMethod,
      payment: resp.payment,
      amount: resp.amount,
    };

    sendEmail(req.user.email, emailData, "order");

    products.forEach(async i => {
      i.stock -=  items.find(item => item.productId.toString() === i._id.toString()).quantity;
       await i.save();
    })

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: resp._id,
        items: itemsWithDetails,
        amount: resp.amount,
        address: resp.address,
        status: resp.status,
        paymentMethod: resp.paymentMethod,
        payment: resp.payment,
        date: resp.date,
      },
    });
  } catch (error) {
    next(error);
  }
};

// getting user orders
export const userOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) throw error("Unauthorized", 401);

    const orders = await Order.find({ userId }).sort({ date: -1 });
    if (!orders || orders.length === 0) throw error("No orders found", 404);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// order data for admin
export const allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    if (!orders || orders.length === 0) throw error("No orders found", 404);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// change order status
export const updateStatus = async (req, res, next) => {
  try {
    const { orderId, status, payment } = req.body;
    if (!orderId || !status)
      throw error("Order ID and status are required", 400);

    const order = await Order.findById(orderId);
    if (!order) throw error("Order not found", 404);

    order.status = status;
    order.payment = payment || order.payment;
    const updatedOrder = await order.save();

    if (!updatedOrder) throw error("Failed to update order status", 500);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};


