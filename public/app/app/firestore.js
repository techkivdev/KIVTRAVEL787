// *********************************************************************	
// Initialize Firebase
// *********************************************************************	
let config = { 
  apiKey: "AIzaSyADCYfe_XMIKyIb7M7hC7-e5HtFm9wdrgg",
  authDomain: "kivtravels-2483b.firebaseapp.com",
  databaseURL: "https://kivtravels-2483b.firebaseio.com",
  projectId: "kivtravels",
  storageBucket: "kivtravels.appspot.com",
  messagingSenderId: "972368251233",
  appId: "1:972368251233:web:a01a5c78dfc5d6400c9d20",
  measurementId: "G-FBBCZG6P3N"
};

firebase.initializeApp(config);
let firestore = firebase.firestore();
let db = firebase.firestore();
let storage  = firebase.storage();
let auth = firebase.auth();
//var functions = firebase.functions();
console.log("Cloud Firestores Loaded");


// *********************************************************************	
// Enable offline capabilities
// *********************************************************************	
firebase.firestore().enablePersistence()
    .then(function() {
        // Initialize Cloud Firestore through firebase
        var db = firebase.firestore();
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a a time.
            console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");

        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
            console.log("The current browser does not support all of the eatures required to enable persistence");
        }
    });



// *********************************************************************
// DELETE COLLECTION
// *********************************************************************
// [START delete_collection]
function deleteCollection(collectionPath, batchSize) {
   
   let db_admin = db

  let collectionRef = db_admin.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db_admin, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db_admin, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db_admin.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db_admin, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

// [END delete_collection]



