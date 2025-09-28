/**
 * Manual Integration Test for Pizza Toggle Status
 * 
 * This test can be run against your live server to verify the toggle functionality
 * Run with: node manualToggleTest.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const API_BASE = process.env.VITE_API_BASE || 'http://localhost:8010';

class PizzaToggleTest {
  constructor() {
    this.testResults = [];
    this.testPizzaId = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logMessage);
    this.testResults.push({ timestamp, type, message });
  }

  async createTestPizza() {
    try {
      this.log('Creating test pizza for toggle testing...');
      
      const testPizza = {
        pizzaName: 'Test Pizza - Toggle Status',
        pizzaPrice: 9.99,
        base: {
          crust: { name: 'Test Crust', price: 0 },
          cheeses: [{ name: 'Test Cheese', amount: 1, price: 2 }]
        },
        sauce: { name: 'Test Sauce', price: 1 },
        meatTopping: [],
        veggieTopping: [],
        active: true // Should be active by default
      };

      const response = await axios.post(`${API_BASE}/builders`, testPizza);
      
      if (response.data.success) {
        this.testPizzaId = response.data.pizza.id || response.data.pizza._id;
        this.log(`Test pizza created successfully with ID: ${this.testPizzaId}`, 'success');
        return true;
      } else {
        this.log(`Failed to create test pizza: ${response.data.message}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Error creating test pizza: ${error.message}`, 'error');
      return false;
    }
  }

  async testToggleToInactive() {
    try {
      this.log('Testing toggle from active to inactive...');
      
      const response = await axios.patch(
        `${API_BASE}/builders/${this.testPizzaId}/toggle-status`,
        { active: false }
      );

      if (response.data.success && response.data.pizza.active === false) {
        this.log('✓ Successfully toggled pizza to inactive', 'success');
        return true;
      } else {
        this.log(`✗ Failed to toggle to inactive: ${response.data.message}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error toggling to inactive: ${error.message}`, 'error');
      return false;
    }
  }

  async testToggleToActive() {
    try {
      this.log('Testing toggle from inactive to active...');
      
      const response = await axios.patch(
        `${API_BASE}/builders/${this.testPizzaId}/toggle-status`,
        { active: true }
      );

      if (response.data.success && response.data.pizza.active === true) {
        this.log('✓ Successfully toggled pizza to active', 'success');
        return true;
      } else {
        this.log(`✗ Failed to toggle to active: ${response.data.message}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error toggling to active: ${error.message}`, 'error');
      return false;
    }
  }

  async testInvalidToggleData() {
    try {
      this.log('Testing with invalid toggle data...');
      
      const response = await axios.patch(
        `${API_BASE}/builders/${this.testPizzaId}/toggle-status`,
        { active: 'not-a-boolean' }
      );

      // This should fail
      this.log(`✗ Invalid data was unexpectedly accepted`, 'error');
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.log('✓ Correctly rejected invalid boolean value', 'success');
        return true;
      } else {
        this.log(`✗ Unexpected error with invalid data: ${error.message}`, 'error');
        return false;
      }
    }
  }

  async testNonExistentPizza() {
    try {
      this.log('Testing toggle on non-existent pizza...');
      
      const response = await axios.patch(
        `${API_BASE}/builders/507f1f77bcf86cd799439011/toggle-status`, // Valid ObjectId format
        { active: false }
      );

      // This should fail
      this.log(`✗ Non-existent pizza was unexpectedly found`, 'error');
      return false;
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        this.log('✓ Correctly returned error for non-existent pizza', 'success');
        return true;
      } else {
        this.log(`✗ Unexpected error for non-existent pizza: ${error.message}`, 'error');
        return false;
      }
    }
  }

  async verifyPizzaInList() {
    try {
      this.log('Verifying pizza appears in builders list...');
      
      const response = await axios.get(`${API_BASE}/builders`);
      let pizzas = response.data;
      
      // Handle different response formats
      if (pizzas.builders) {
        pizzas = pizzas.builders;
      } else if (!Array.isArray(pizzas)) {
        this.log('✗ Invalid response format from builders API', 'error');
        return null;
      }
      
      const testPizza = pizzas.find(p => (p.id || p._id) === this.testPizzaId);
      
      if (testPizza) {
        this.log(`✓ Test pizza found in list with active status: ${testPizza.active}`, 'success');
        return testPizza;
      } else {
        this.log('✗ Test pizza not found in builders list', 'error');
        return null;
      }
    } catch (error) {
      this.log(`✗ Error fetching builders list: ${error.message}`, 'error');
      return null;
    }
  }

  async cleanupTestPizza() {
    if (!this.testPizzaId) return;

    try {
      this.log('Cleaning up test pizza...');
      
      const response = await axios.delete(`${API_BASE}/builders/${this.testPizzaId}`);
      
      if (response.data.success) {
        this.log('✓ Test pizza cleaned up successfully', 'success');
      } else {
        this.log(`✗ Failed to cleanup test pizza: ${response.data.message}`, 'error');
      }
    } catch (error) {
      this.log(`✗ Error cleaning up test pizza: ${error.message}`, 'error');
    }
  }

  async runAllTests() {
    this.log('Starting Pizza Toggle Status Integration Tests');
    this.log(`Testing against API: ${API_BASE}`);
    
    let totalTests = 0;
    let passedTests = 0;

    // Test 1: Create test pizza
    totalTests++;
    if (await this.createTestPizza()) {
      passedTests++;
    } else {
      this.log('Cannot continue without test pizza', 'error');
      return this.generateReport(totalTests, passedTests);
    }

    // Test 2: Verify pizza in list (initially active)
    totalTests++;
    const initialPizza = await this.verifyPizzaInList();
    if (initialPizza && initialPizza.active !== false) {
      passedTests++;
      this.log('✓ Pizza is initially active (as expected)', 'success');
    }

    // Test 3: Toggle to inactive
    totalTests++;
    if (await this.testToggleToInactive()) {
      passedTests++;
    }

    // Test 4: Verify pizza is now inactive
    totalTests++;
    const inactivePizza = await this.verifyPizzaInList();
    if (inactivePizza && inactivePizza.active === false) {
      passedTests++;
      this.log('✓ Pizza is now inactive (as expected)', 'success');
    }

    // Test 5: Toggle back to active
    totalTests++;
    if (await this.testToggleToActive()) {
      passedTests++;
    }

    // Test 6: Verify pizza is active again
    totalTests++;
    const reactivatedPizza = await this.verifyPizzaInList();
    if (reactivatedPizza && reactivatedPizza.active === true) {
      passedTests++;
      this.log('✓ Pizza is active again (as expected)', 'success');
    }

    // Test 7: Test invalid data
    totalTests++;
    if (await this.testInvalidToggleData()) {
      passedTests++;
    }

    // Test 8: Test non-existent pizza
    totalTests++;
    if (await this.testNonExistentPizza()) {
      passedTests++;
    }

    // Cleanup
    await this.cleanupTestPizza();

    return this.generateReport(totalTests, passedTests);
  }

  generateReport(total, passed) {
    const failed = total - passed;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('PIZZA TOGGLE STATUS TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(60));

    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED! The toggle status functionality is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the logs above for details.');
    }

    return { total, passed, failed, successRate };
  }
}

// Run the tests
const tester = new PizzaToggleTest();
tester.runAllTests()
  .then((results) => {
    process.exit(results.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Test suite crashed:', error);
    process.exit(1);
  });