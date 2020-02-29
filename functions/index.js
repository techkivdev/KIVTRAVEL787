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




  /**
 * Initiate a recursive delete of documents at a given path.
 * 
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 * 
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 * 
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
.runWith({
  timeoutSeconds: 540,
  memory: '2GB'
})
.https.onCall((data, context) => {
  // Only allow admin users to execute this function.
  /*
  if (!(context.auth && context.auth.token && context.auth.token.admin)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Must be an administrative user to initiate delete.'
    );
  }
  */

  const path = data.path;
  console.log(
    `Requested to delete path ${path}`
  );

  // Run a recursive delete on the given document or collection path.
  // The 'token' must be set in the functions config, and can be generated
  // at the command line by running 'firebase login:ci'.
  return firebase_tools.firestore
    .delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token
    })
    .then(() => {
      return {
        path: path 
      };
    });
});
