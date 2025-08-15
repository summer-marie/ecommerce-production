import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase.js';

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'pizzas')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'pizzas') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const imagePath = `${folder}/${filename}`;
    
    // Create a reference to the file location
    const imageRef = ref(storage, imagePath);
    
    // Upload the file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: imagePath,
      filename: filename
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imagePath - The path of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) {
      return; // Nothing to delete
    }

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log('Image deleted successfully:', imagePath);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for deletion failures as the main operation might still succeed
  }
};
