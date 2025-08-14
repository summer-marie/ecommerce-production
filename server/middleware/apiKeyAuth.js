// API key management and authentication system
import crypto from 'crypto';
import { logInfo, logWarn, logError } from './logger.js';

class ApiKeyManager {
  constructor() {
    this.keys = new Map(); // In production, store in database
    this.initializeDefaultKeys();
  }

  initializeDefaultKeys() {
    // Admin API key for management operations
    const adminKey = this.generateApiKey('admin');
    this.keys.set(adminKey, {
      keyId: 'admin-001',
      name: 'Admin Management Key',
      permissions: ['admin', 'orders', 'ingredients', 'builders', 'messages'],
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0,
      isActive: true
    });

    // Public API key for customer operations
    const publicKey = this.generateApiKey('public');
    this.keys.set(publicKey, {
      keyId: 'public-001', 
      name: 'Customer API Key',
      permissions: ['orders:create', 'ingredients:read', 'builders:read'],
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0,
      isActive: true
    });

    // Analytics API key for reporting
    const analyticsKey = this.generateApiKey('analytics');
    this.keys.set(analyticsKey, {
      keyId: 'analytics-001',
      name: 'Analytics & Reporting Key', 
      permissions: ['orders:read', 'analytics:read'],
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0,
      isActive: true
    });

    logInfo('API keys initialized', {
      adminKey: `${adminKey.substring(0, 8)}...`,
      publicKey: `${publicKey.substring(0, 8)}...`,
      analyticsKey: `${analyticsKey.substring(0, 8)}...`,
      totalKeys: this.keys.size
    });

    // Development logging only
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n🔑 API Keys Generated for Development:');
      console.log(`Admin Key: ${adminKey}`);
      console.log(`Public Key: ${publicKey}`);
      console.log(`Analytics Key: ${analyticsKey}\n`);
    }
  }

  // Generate secure API key with prefix
  generateApiKey(prefix = 'pizza') {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${timestamp}_${randomBytes}`;
  }

  // Validate API key and check permissions
  validateKey(apiKey, requiredPermission = null) {
    const keyData = this.keys.get(apiKey);
    
    if (!keyData) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!keyData.isActive) {
      return { valid: false, error: 'API key is deactivated' };
    }

    if (requiredPermission && !this.hasPermission(keyData, requiredPermission)) {
      return { valid: false, error: 'Insufficient permissions' };
    }

    // Update usage statistics
    keyData.lastUsed = new Date();
    keyData.usageCount++;

    return { 
      valid: true, 
      keyData: {
        keyId: keyData.keyId,
        name: keyData.name,
        permissions: keyData.permissions
      }
    };
  }

  // Check if key has required permission
  hasPermission(keyData, permission) {
    if (keyData.permissions.includes('admin')) {
      return true; // Admin has all permissions
    }

    return keyData.permissions.includes(permission) || 
           keyData.permissions.some(p => p.startsWith(permission.split(':')[0]));
  }

  // Get all active keys for management interface
  getAllKeys() {
    const keys = [];
    for (const [apiKey, keyData] of this.keys.entries()) {
      keys.push({
        keyPrefix: `${apiKey.substring(0, 8)}...`,
        keyId: keyData.keyId,
        name: keyData.name,
        permissions: keyData.permissions,
        createdAt: keyData.createdAt,
        lastUsed: keyData.lastUsed,
        usageCount: keyData.usageCount,
        isActive: keyData.isActive
      });
    }
    return keys;
  }

  // Deactivate API key by key value
  deactivateKey(apiKey) {
    const keyData = this.keys.get(apiKey);
    if (keyData) {
      keyData.isActive = false;
      logWarn('API key deactivated', { keyId: keyData.keyId });
      return true;
    }
    return false;
  }

  // Create new API key with custom permissions
  createKey(name, permissions = ['public']) {
    const apiKey = this.generateApiKey();
    const keyData = {
      keyId: `custom-${Date.now()}`,
      name,
      permissions,
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0,
      isActive: true
    };

    this.keys.set(apiKey, keyData);
    
    logInfo('New API key created', {
      keyId: keyData.keyId,
      name: keyData.name,
      permissions: keyData.permissions
    });

    return apiKey;
  }
}

// Create global instance
const apiKeyManager = new ApiKeyManager();

// Middleware factory for API key authentication with permissions
export const requireApiKey = (permission = null) => {
  return (req, res, next) => {
    const apiKey = req.header('X-API-Key') || req.query.apiKey;
    
    if (!apiKey) {
      logWarn('API request without key', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide a valid API key in X-API-Key header or apiKey query parameter',
        documentation: '/api/docs'
      });
    }

    const validation = apiKeyManager.validateKey(apiKey, permission);
    
    if (!validation.valid) {
      logWarn('Invalid API key attempt', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        error: validation.error,
        keyPrefix: `${apiKey.substring(0, 8)}...`,
        userAgent: req.get('user-agent')
      });
      return res.status(401).json({
        error: 'Invalid API key',
        message: validation.error
      });
    }

    logInfo('Valid API key used', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      keyId: validation.keyData.keyId,
      keyName: validation.keyData.name
    });

    // Attach key info to request for later use
    req.apiKeyData = validation.keyData;
    next();
  };
};

// API key management routes
export const createApiKeyRoutes = (app) => {
  // Get all API keys (admin only)
  app.get('/api/admin/keys', requireApiKey('admin'), (req, res) => {
    try {
      const keys = apiKeyManager.getAllKeys();
      res.json({
        success: true,
        keys,
        total: keys.length
      });
    } catch (error) {
      logError('Error fetching API keys', { error: error.message });
      res.status(500).json({
        error: 'Failed to fetch API keys',
        message: error.message
      });
    }
  });

  // Create new API key (admin only)
  app.post('/api/admin/keys', requireApiKey('admin'), (req, res) => {
    try {
      const { name, permissions = ['public'] } = req.body;
      
      if (!name) {
        return res.status(400).json({
          error: 'Name required',
          message: 'Please provide a name for the API key'
        });
      }

      const newKey = apiKeyManager.createKey(name, permissions);
      
      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        apiKey: newKey,
        name,
        permissions,
        warning: 'Store this key securely - it cannot be retrieved again'
      });
    } catch (error) {
      logError('Error creating API key', { error: error.message });
      res.status(500).json({
        error: 'Failed to create API key',
        message: error.message
      });
    }
  });

  // Deactivate API key (admin only)
  app.delete('/api/admin/keys/:keyPrefix', requireApiKey('admin'), (req, res) => {
    try {
      const { keyPrefix } = req.params;
      
      // Find key by prefix (security measure)
      let targetKey = null;
      for (const [apiKey] of apiKeyManager.keys.entries()) {
        if (apiKey.startsWith(keyPrefix)) {
          targetKey = apiKey;
          break;
        }
      }

      if (!targetKey) {
        return res.status(404).json({
          error: 'API key not found',
          message: 'No API key found with the provided prefix'
        });
      }

      const deactivated = apiKeyManager.deactivateKey(targetKey);
      
      if (deactivated) {
        res.json({
          success: true,
          message: 'API key deactivated successfully'
        });
      } else {
        res.status(404).json({
          error: 'API key not found',
          message: 'Unable to deactivate the specified API key'
        });
      }
    } catch (error) {
      logError('Error deactivating API key', { error: error.message });
      res.status(500).json({
        error: 'Failed to deactivate API key',
        message: error.message
      });
    }
  });
};

export { apiKeyManager };
export default { requireApiKey, createApiKeyRoutes, apiKeyManager };