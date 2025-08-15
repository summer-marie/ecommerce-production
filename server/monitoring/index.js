import express from 'express';
import { healthCheck, performanceMetrics, cacheStats } from './performanceRoutes.js';

const monitoringRouter = express.Router();

// Health check endpoint
monitoringRouter.get('/health', healthCheck);

// Performance metrics
monitoringRouter.get('/metrics', performanceMetrics);

// Cache statistics
monitoringRouter.get('/cache', cacheStats);

export default monitoringRouter;
