// *********************************************************************	
// Initialize Firebase
// *********************************************************************	
let config = {
  apiKey: "AIzaSyCcO_Q7pgBXrgIZ23_-fJf2AAH5viE1fHU",
  authDomain: "webtemplate-1b4f0.firebaseapp.com",
  databaseURL: "https://webtemplate-1b4f0.firebaseio.com",
  projectId: "webtemplate-1b4f0",
  storageBucket: "webtemplate-1b4f0.appspot.com",
  messagingSenderId: "764361145796",
  appId: "1:764361145796:web:531e1d5288b315e2ee7891",
  measurementId: "G-YPGDK3WC88"
};

firebase.initializeApp(config);
let firestore = firebase.firestore();
let db = firebase.firestore();
let storage  = firebase.storage();
let auth = firebase.auth();
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
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
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
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

// [END delete_collection]



