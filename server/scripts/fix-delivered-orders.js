import mongoose from 'mongoose';
import orderModel from '../orders/orderModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fixDeliveredOrders = async () => {
  try {
    console.log('Connecting to database...');
    
    // Use the same connection string as your app
    const uri = process.env.MONGODB_ATLAS_URL;
    if (!uri) {
      console.error('Missing MONGODB_ATLAS_URL environment variable');
      process.exit(1);
    }
    
    await mongoose.connect(uri);
    console.log('Connected to database');
    
    // Find all orders with "delivered" status
    const deliveredOrders = await orderModel.find({ status: 'delivered' });
    console.log(`Found ${deliveredOrders.length} orders with "delivered" status`);
    
    if (deliveredOrders.length > 0) {
      // Update all "delivered" orders to "completed"
      const result = await orderModel.updateMany(
        { status: 'delivered' },
        { $set: { status: 'completed' } }
      );
      
      console.log(`Successfully updated ${result.modifiedCount} orders from "delivered" to "completed"`);
    } else {
      console.log('No orders with "delivered" status found');
    }
    
    // Verify the update
    const remainingDelivered = await orderModel.find({ status: 'delivered' });
    console.log(`Remaining orders with "delivered" status: ${remainingDelivered.length}`);
    
    // Show current status counts
    const statusCounts = await orderModel.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('Current status counts:', statusCounts);
    
  } catch (error) {
    console.error('Error fixing delivered orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the fix
fixDeliveredOrders();
