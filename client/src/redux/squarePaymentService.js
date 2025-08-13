const squarePaymentService = {
  // Wait for Square SDK to load
  waitForSquareSDK: () => {
    return new Promise((resolve, reject) => {
      // Check if there was a loading error
      if (window.squareSDKError) {
        reject(new Error('Square SDK failed to load from CDN'));
        return;
      }
      
      // If Square is already available, resolve immediately
      if (window.Square) {
        resolve(window.Square);
        return;
      }
      
      // If SDK loaded indicator is set, resolve
      if (window.squareSDKLoaded) {
        resolve(window.Square);
        return;
      }

      // Set up a polling mechanism to check for Square
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max wait time
      
      const checkForSquare = () => {
        attempts++;
        
        if (window.squareSDKError) {
          reject(new Error('Square SDK failed to load from CDN'));
        } else if (window.Square || window.squareSDKLoaded) {
          resolve(window.Square);
        } else if (attempts >= maxAttempts) {
          reject(new Error('Square SDK failed to load within timeout'));
        } else {
          setTimeout(checkForSquare, 100); // Check every 100ms
        }
      };
      
      checkForSquare();
    });
  },

  // Initialize Square Web Payments
  initializeSquarePayments: async () => {
    try {
      console.log("Starting Square payments initialization...");
      console.log("App ID:", import.meta.env.VITE_SQUARE_APPLICATION_ID);
      console.log("Location ID:", import.meta.env.VITE_SQUARE_LOCATION_ID);
      
      const Square = await squarePaymentService.waitForSquareSDK();
      console.log("Square SDK loaded:", Square);
      
      if (!import.meta.env.VITE_SQUARE_APPLICATION_ID) {
        throw new Error("Square Application ID not found in environment variables");
      }
      
      if (!import.meta.env.VITE_SQUARE_LOCATION_ID) {
        throw new Error("Square Location ID not found in environment variables");
      }
      
      const paymentsInstance = Square.payments(
        import.meta.env.VITE_SQUARE_APPLICATION_ID,
        import.meta.env.VITE_SQUARE_LOCATION_ID
      );
      
      console.log("Square payments instance created:", paymentsInstance);
      return paymentsInstance;
    } catch (error) {
      console.error("Square initialization error:", error);
      throw new Error(`Square SDK initialization failed: ${error.message}`);
    }
  }
};

export default squarePaymentService;
