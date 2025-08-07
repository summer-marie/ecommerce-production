// Input validation middleware using express-validator
import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors and return structured response
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Pizza order validation
export const validateOrder = [
  body('orderDetails')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderDetails.*.pizzaName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Pizza name must be 1-100 characters'),
  body('orderDetails.*.quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50'),
  body('orderDetails.*.pizzaPrice')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Pizza price must be between 0 and 1000'),
  body('address.street')
    .isString()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be 5-200 characters'),
  body('address.city')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  body('address.state')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be 2-50 characters'),
  body('address.zip')
    .isString()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('ZIP code must be in format 12345 or 12345-6789'),
  body('phone')
    .isString()
    .trim()
    .matches(/^[\d\s\-\(\)\+]+$/)
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be 10-20 characters with valid format'),
  body('firstName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  body('lastName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters'),
  body('orderTotal')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Order total must be between 0 and 10000'),
  handleValidationErrors,
];

// Ingredient validation
export const validateIngredient = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Ingredient name must be 1-100 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('itemType')
    .isIn(['Base', 'Sauce', 'Meat Topping', 'Veggie Topping'])
    .withMessage('Item type must be Base, Sauce, Meat Topping, or Veggie Topping'),
  body('price')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Price must be between 0 and 100'),
  handleValidationErrors,
];

// Contact message validation
export const validateMessage = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('subject')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be 1-200 characters'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be 1-2000 characters'),
  handleValidationErrors,
];

// Admin login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors,
];

// User account validation
export const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be 6-128 characters'),
  body('firstName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  body('lastName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters'),
  handleValidationErrors,
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors,
];

// Pizza builder validation
export const validatePizzaBuilder = [
  body('pizzaName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Pizza name must be 1-100 characters'),
  body('base')
    .optional()
    .isArray()
    .withMessage('Base must be an array'),
  body('sauce')
    .optional()
    .isObject()
    .withMessage('Sauce must be an object'),
  body('meatTopping')
    .optional()
    .isArray()
    .withMessage('Meat toppings must be an array'),
  body('veggieTopping')
    .optional()
    .isArray()
    .withMessage('Veggie toppings must be an array'),
  handleValidationErrors,
];
