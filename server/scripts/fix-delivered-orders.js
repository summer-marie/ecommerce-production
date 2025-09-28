import mongoose from 'mongoose';
import orderModel from '../orders/orderModel.js';
import dotenv from 'dotenv';
import { getLog } from '../logger.js';

// Load environment variables
dotenv.config();

const fixDeliveredOrders = async () => {
  try {
  const log = getLog(null, { operationId: 'fixDeliveredOrders' });
  log.info({ event: 'script.fixDelivered.start' }, 'Connecting to database');
    
    // Use the same connection string as your app
    const uri = process.env.MONGODB_ATLAS_URL;
    if (!uri) {
      log.error({ event: 'script.fixDelivered.error', reason: 'missingMongoURL' }, 'Missing MONGODB_ATLAS_URL environment variable');
      process.exit(1);
    }
    
  await mongoose.connect(uri);
  log.info({ event: 'script.fixDelivered.connected', mongoHostPreview: uri.replace(/^mongodb\+srv:\/\//, '').slice(0, 60) }, 'Connected to database');
    
    // Find all orders with "delivered" status
  const deliveredOrders = await orderModel.find({ status: 'delivered' });
  log.info({ event: 'script.fixDelivered.found', deliveredCount: deliveredOrders.length }, 'Found delivered orders');
    
    if (deliveredOrders.length > 0) {
      // Update all "delivered" orders to "completed"
      const result = await orderModel.updateMany(
        { status: 'delivered' },
        { $set: { status: 'completed' } }
      );
      
  log.info({ event: 'script.fixDelivered.updated', updated: result.modifiedCount }, 'Updated delivered orders to completed');
    } else {
  log.info({ event: 'script.fixDelivered.none' }, 'No delivered orders found');
    }
    
    // Verify the update
  const remainingDelivered = await orderModel.find({ status: 'delivered' });
  log.info({ event: 'script.fixDelivered.remaining', remainingDelivered: remainingDelivered.length }, 'Remaining delivered orders count');
    
    // Show current status counts
    const statusCounts = await orderModel.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    log.info({ event: 'script.fixDelivered.statusCounts', statusCounts }, 'Current status counts');
    
  } catch (error) {
    const log = getLog(null, { operationId: 'fixDeliveredOrders' });
    log.error({ event: 'script.fixDelivered.error', err: error && error.message ? error.message : error }, 'Error fixing delivered orders');
  } finally {
    await mongoose.disconnect();
    const log = getLog(null, { operationId: 'fixDeliveredOrders' });
    log.info({ event: 'script.fixDelivered.done' }, 'Disconnected from database');
  }
};

// Run the fix
fixDeliveredOrders();
