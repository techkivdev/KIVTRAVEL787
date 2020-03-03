const functions = require('firebase-functions');


// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
//const firebase_tools = require('firebase-tools');
admin.initializeApp();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
//});

/*
// New Function// Adds a message that welcomes new users into the chat.
exports.addWelcomeMessages = functions.auth.user().onCreate(async (user) => {
    console.log('A new user signed in for the first time.');
    const fullName = user.displayName || 'Anonymous';
  
    // Saves the new welcome message into the database
    // which then displays it in the FriendlyChat clients.
    await admin.firestore().collection('messages').add({
      name: 'Firebase Bot',
      profilePicUrl: '/images/firebase-logo.png', // Firebase logo
      text: `${fullName} signed in for the first time! Welcome!`,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Welcome message written to database.');
  });

  */


  // Examples visit 
  // https://codelabs.developers.google.com/codelabs/firebase-cloud-functions/#9



