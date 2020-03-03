// *******************************************************************************
// SCRIPT : manageforum.js
//
//
// Author : Vivek Thakur
// Date : 29/2/2020
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPrivatePath
}


// Show All Topic Only
function backToHome() {
  // index.html?pt=NA&id=NA&fl=NA
  var url = 'index.html?pt=' + encodeURIComponent('COMMONFORUM') + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url

}

// CHeck total Deleted Documents
function checkTotalDocuments() {

  $("#total_document_status").html('IN Progress ....')

  // Read details
  let path = coll_base_path + 'FORUM/COMMONFORUM' 
  let collectionRef = db.collection(path)
  let queryRef = collectionRef.where('DELETESTATUS', '==', true)

  queryRef.get()
   .then(snapshot => {

    $("#total_document_status").html('Total Document : ' + snapshot.size)
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------

     } else {
 
      /*
     snapshot.forEach(doc => { 
       let data = doc.data() 
     });
     */
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   });

}

// -------------------------------

// START Documents Delete Process
function deleteAllDocuments() {

  $("#total_document_status").html('')

  document.getElementById("delete_documents_status").style.display = 'block';
  document.getElementById("delete_documents_btn").style.display = 'none';

  // Read details
  let path = coll_base_path + 'FORUM/COMMONFORUM' 
  let collectionRef = db.collection(path)
  let queryRef = collectionRef.where('DELETESTATUS', '==', true)

  queryRef.get()
   .then(snapshot => {   
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------
       document.getElementById("delete_documents_status").style.display = 'none';
       toastMsg('Completed !!')

     } else {
 
      
     snapshot.forEach(doc => { 
       let data = doc.data() 
       let currentTopicID = doc.id
       let main_path = 'COMMONFORUM'

       displayOutput('Delete Topic : ' + currentTopicID)  

        // Delete all comments
        deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT')

        // Delete all like
        deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE')
        
      db.doc(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID).delete().then(function () {      
      });

     });  
     
      // Update METADATA
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      setNewDocument(coll_base_path + 'FORUM/METADATA','DELETELASTRUN',{'LASTRUN' : timestamp},'NA');      

     document.getElementById("delete_documents_status").style.display = 'none';
     toastMsg('Completed !!')
     
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   });

}


// Delete Collection Documents
function deleteCollectionDocuments(path) {

  db.collection(path).get()
    .then(snapshot => {
  
      if (snapshot.size == 0) {
        // ------ No Details Present ------------- 
      } else {
  
        snapshot.forEach(doc => { 

          // Delete Document
          db.doc(path + '/' + doc.id).delete()
        
        });  

    }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

}

// ------------ Tags Handling ------------------

// Collect
function collectAllTagsDetails() {

  displayOutput('Collect all tags details .... ')

  document.getElementById("collect_tags_status").style.display = 'block';
  document.getElementById("collect_tags_btn").style.display = 'none';

  let allTagsData = []

  // Read details
  let path = coll_base_path + 'FORUM/COMMONFORUM' 
  let collectionRef = db.collection(path)
  let  queryRef = collectionRef.where('DELETESTATUS', '==', false)
  .orderBy('CREATEDON', 'desc');

  queryRef.get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------
       document.getElementById("collect_tags_status").style.display = 'none';
       toastMsg('Completed !!')

     } else { 
      
     displayOutput('Documet Processed .. ')
     snapshot.forEach(doc => { 
       let data = doc.data() 
       displayOutput('->  '+data['CREATEDON'])

       allTagsData.push(...data['TAGS'])      

     });

     // Proces Tags List
     displayOutput('Process Tags Data ... ')
     displayOutput(allTagsData)

     // Check occurrence
     let occurrence_data =  occurrence(allTagsData)

     displayOutput(occurrence_data)


     var allTagsData_filtered = [ ...new Set(allTagsData) ];
     displayOutput(allTagsData_filtered)

     // Create Document for each Tags
     for(each_idx in allTagsData_filtered) {
       let tag_name = allTagsData_filtered[each_idx]

       // Create New Document
       let tag_doc_path = coll_base_path + 'FORUM/TAGS'
       setNewDocument(tag_doc_path,tag_name,{'NAME' : tag_name,'COUNT' : occurrence_data[tag_name].length},'NA');

       displayOutput(tag_name + '  Created !!')

     }


     // Update METADATA
     const timestamp = firebase.firestore.FieldValue.serverTimestamp();
     setNewDocument(coll_base_path + 'FORUM/METADATA','TAGSLASTRUN',{'LASTRUN' : timestamp},'NA');

     document.getElementById("collect_tags_status").style.display = 'none';
     toastMsg('Completed !!')

     
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   });

}

// Check array element occurrence

var occurrence = function (array) {
  "use strict";
  var result = {};
  if (array instanceof Array) { // Check if input is array.
      array.forEach(function (v, i) {
          if (!result[v]) { // Initial object property creation.
              result[v] = [i]; // Create an array for that property.
          } else { // Same occurrences found.
              result[v].push(i); // Fill the array.
          }
      });
  }
  return result;
};

