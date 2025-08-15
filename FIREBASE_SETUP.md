# Firebase Storage Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "pizza-app")
4. Enable Google Analytics if desired
5. Click "Create project"

## 2. Enable Firebase Storage

1. In your Firebase project console, click on "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for now (we'll configure security rules later)
4. Select a location for your storage bucket (choose closest to your users)
5. Click "Done"

## 3. Get Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) in the left sidebar
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click on "Web" icon (</>) to add a web app
5. Register your app with a nickname (e.g., "pizza-web-app")
6. Copy the configuration object - you'll need these values for your .env files

## 4. Configure Environment Variables

Add the Firebase configuration to your environment files:

### Server (.env)
```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here
```

### Client (.env)
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## 5. Security Rules (Optional but Recommended)

Update your Firebase Storage rules to be more secure:

1. Go to Firebase Console > Storage > Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pizzas/{imageId} {
      // Allow read access to all users
      allow read: if true;
      // Allow write access only to authenticated users (you can customize this)
      allow write: if request.auth != null;
    }
  }
}
```

## 6. Test the Setup

After configuring the environment variables:

1. Restart both your client and server applications
2. Try uploading an image through the admin interface
3. Check if the image appears in Firebase Storage console
4. Verify the image displays correctly in your app

## Features Implemented

✅ **Image Upload**: Images are uploaded to Firebase Storage with unique filenames
✅ **Image Display**: Images are served directly from Firebase CDN URLs
✅ **Image Deletion**: Old images are automatically deleted when updating pizzas
✅ **Fallback Images**: Default pizza image shown if no custom image is uploaded
✅ **Error Handling**: Graceful error handling for upload failures

## Benefits

- **Scalable**: Firebase Storage can handle any amount of images
- **Fast**: Images are served via Google's global CDN
- **Reliable**: Built-in redundancy and backup
- **Cost-Effective**: Only pay for what you use
- **No Server Storage**: Your server doesn't need to store images
