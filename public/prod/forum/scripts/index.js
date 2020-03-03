// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 13/2/2020
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPrivatePath
}

var main_path = 'NA'
var id = 'NA'
var fl = 'NA'

var userLoginData = ''
var currentTopicID = ''
var currentTopicCommentsStatus = true
var currentTopicLikeStatus = false
var currentTopicBookmarkStatus = false

var updateTopicHTMLPage = false

// Main Filter
var filter_enable_flag = false
var filter_key = 'NA'
var filter_value = 'NA'

var allForumTopics = {}

// Query Parameters
let querySize = 10
let queryRef = ''

let queryMode = 'NORMAL'


// ***********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams() {
  // Read Parameters
  displayOutput('Read Parameters ...')
  var idx = document.URL.indexOf('?');
  var params = new Array();
  if (idx != -1) {
    var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
    for (var i = 0; i < pairs.length; i++) {
      nameVal = pairs[i].split('=');
      params[nameVal[0]] = nameVal[1];
    }
  }
  displayOutput(params); 

  main_path = params['pt']
  displayOutput(main_path)
  id = params['id']
  fl = params['fl'].replace('#!','')

  if(fl == 'own') {
    updateTopicHTMLPage  = true
  }


}

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)
  
  if(status == 'true') {
    userLoginData = getLoginUserData()
    //displayOutput(userLoginData)

    // Check for ROLE
    if(userLoginData['ROLE'] != 'USER') {
      document.getElementById("manage_forum_menu").style.display = 'block';
    }

    // Display Other Options also
    document.getElementById("my_topics_menu").style.display = 'block';
    document.getElementById("my_list_menu").style.display = 'block';
    document.getElementById("my_bookmark_menu").style.display = 'block';

    document.getElementById("my_topics_menu_mb").style.display = 'block';
    document.getElementById("my_list_menu_mb").style.display = 'block';
    document.getElementById("my_bookmark_menu_mb").style.display = 'block';

    if(updateTopicHTMLPage) {
      // Read all topic and display content
      readAllForums()
    }

  } 

  

}

// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

// Mobile mode handling
mobileModeStartupHandling()

checkLoginData()

updateHTMLPage()


// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {   
  modifyPageStyle()

  document.getElementById("message_section").style.display = 'none';

  // Page Haandling according to Filter value : fl

  if((fl == 'NA') || (fl == 'tag') || (fl == 'catg')){
    // Read all topic and display content
    readAllForums()
  } else if((fl == 'edit') || (fl == 'only')) {
    document.getElementById("flb_open_filter").style.display = 'none';
    // Read only edit topic details and show details
    readOneForum()
  } if(fl == 'own') {
   // Nothing to do
   document.getElementById("message_section").style.display = 'block';
   $('#message_content').html('Your Topics only.')
  }
  else {
  
  }

  // Update Filter section details
  $('#main_filter_section').html('')
  if((fl == 'tag') || (fl == 'catg')) {
    $('#main_filter_section').html('<div class="chip">' + id + '</div>')
    document.getElementById("message_section").style.display = 'block';
    document.getElementById("filter_reset_btn_home").style.display = 'block';

    if(fl == 'tag') {
      $('#message_content').html('Filter Applied on Tag !!')
    } else {
      $('#message_content').html('Filter Applied on Category !!')
    }
    
  }
  

 
}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!') 
    
    document.getElementById('show_all_topic_container').className = "container-fluid";
    document.getElementById('topic_display_container').className = "container-fluid";

  } else {
    displayOutput('Mobile Browser Not found!')
    

  }
}

// ----------------------------------------
// --------- Mobile Mode Handling ---------
// ----------------------------------------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    //document.getElementById("main_nav_bar").style.display = 'block';
   

  } else {
   
  }


}

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************


// Read Forum Details
function readAllForums() {

  allForumTopics = {}
  $("#forum_card_section").html('');
  document.getElementById("main_progress").style.display = "block";

  // Read details
  let path = coll_base_path + 'FORUM/' + main_path 
  let collectionRef = db.collection(path)
  
  // ---------------------------------------
  // ----- NORMAL ------

  
  // Query Handling
  // orderBy('DATEID', 'desc') 

  // Main Filter Query
  if(filter_enable_flag) { 
    // Sort by Date
    if(filter_key == 'DATE') {
      queryRef = collectionRef.where('DELETESTATUS', '==', false)
      .where('DATE', '==', filter_value)
      .orderBy('CREATEDON', 'desc');
    }
  
  } else {
    // Filter query for url

      // For each query you have to create Index in firebase console
    if(fl == 'own') { 
      queryRef = collectionRef.where('DELETESTATUS', '==', false)
      .where('UUID', '==', userLoginData['UUID'])
      .orderBy('CREATEDON', 'desc');
    } else if(fl == 'tag') {
      queryRef = collectionRef.where('DELETESTATUS', '==', false)
      .where('TAGS', 'array-contains',id)
      .orderBy('CREATEDON', 'desc');
    } else if(fl == 'catg') {
      queryRef = collectionRef.where('DELETESTATUS', '==', false)
      .where('CATEGORY1', '==', id)
      .orderBy('CREATEDON', 'desc');
    } else {
      queryRef = collectionRef.where('DELETESTATUS', '==', false)
      .orderBy('CREATEDON', 'desc');
    }

  }

 
  queryRef.limit(querySize).get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------  
       displayOutput('No Ratings Record Found !!') 

       let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Topic Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";
       document.getElementById("more_btn").style.display = "none";

     } else {
 
     snapshot.forEach(doc => { 
       allForumTopics[doc.id] = doc.data() 

       createEachDocumentCard(doc.data(),doc.id)

     });

     // Update Forum HTML Content

    // updateForumContent()

    document.getElementById("main_progress").style.display = "none";
    document.getElementById("more_btn").style.display = "block";
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   });
 
  

}

// Query Handling
function morePage() {
  querySize = querySize + 10
  readAllForums()
}  


// Read Only One Forum Details
function readOneForum() {

  allForumTopics = {}
  document.getElementById("main_progress").style.display = "block";

  // Read details
  
  db.collection(coll_base_path+'FORUM/' + main_path).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');  
      
      let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Topic Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";

       document.getElementById("close_fl_btn_to_back").style.display = "block";

    } else {
       let data = doc.data()

       if(data['DELETESTATUS'] == false) {
          allForumTopics[doc.id] = data
          // Update Forum HTML Content
          updateForumContent()
    
          viewEachTopic(doc.id)
       } else {

        // Document Deleted
        let htmlContent = ''
        htmlContent += '<h4 class="black-text">Item Deleted by owner!!</h4><br> \
        <p class="grey-text">You can also detele it from your bookmark list.</p>'        
        $("#forum_card_section").html(htmlContent);
        document.getElementById("main_progress").style.display = "none";

        document.getElementById("close_fl_btn_to_back").style.display = "block";

       }
       
      
      
    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });
  

}

// Update forum Section with ALL Data once
function updateForumContent() { 

  $("#forum_card_section").html('');

  let htmlContent = '<div class="row">'

 for(eachKey in allForumTopics) {

      let data = allForumTopics[eachKey]
      //displayOutput(data)     
           
    // <span class="new badge blue" data-badge-caption="reply">'+data['REPLYCNT']+'</span>

      htmlContent += ' <div class="col s12 m12">\
      <div class="card" style="border-radius: 5px;">\
        <div>\
          <!-- Header -->\
            <ul class="collection" style="border-radius: 5px 5px 0px 0px;">\
              <li class="collection-item avatar">\
                <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                <span class="title"><b>'+data['UNAME']+'</b></span>\
                <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                </li>\
            </ul>\
\
            <!-- Content -->\
            <div class="card-content" style="margin-top: -30px;">\
            <div class="right-align"> <a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY'] +'#catg' + '\')" ><div class="chip">'+data['CATEGORY']+'</div></a> </div>\
              <span class="card-title">'+data['TITLE']+'</span>\
              <div>\
                '+getChipWithBorderFromListLoc(data['TAGS'])+'\
              </div>\
\
              <div style="margin-top: 15px;">\
                <p class="long-text" >'+data['DESC']+'</p>\
              </div> \
              <div id="reach_content_btn" class="right-align" style="margin-top: 0px;">\
              <a onclick="viewEachTopic(\'' + eachKey + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
            </div>\
              </div> </div>  </div></div>'

}

    htmlContent += '</div>'


    $("#forum_card_section").html(htmlContent);

    document.getElementById("main_progress").style.display = "none";

}

// Create single card with Data
function createEachDocumentCard(data,docid) {

 
    //displayOutput(data)     
           
    // <span class="new badge blue" data-badge-caption="reply">'+data['REPLYCNT']+'</span>

      htmlContent  = ' <div class="col s12 m12">\
      <div class="card" style="border-radius: 5px;">\
        <div>\
          <!-- Header -->\
            <ul class="collection" style="border-radius: 5px 5px 0px 0px;">\
              <li class="collection-item avatar">\
                <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                <span class="title"><b>'+data['UNAME']+'</b></span>\
                <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                </li>\
            </ul>\
\
            <!-- Content -->\
            <div class="card-content" style="margin-top: -30px;">\
            <div class="right-align"> <a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY1'] +'#catg' + '\')" ><div class="chip">'+data['CATEGORY1']+'</div></a> </div>\
              <span class="card-title long-text-nor">'+data['TITLE']+'</span>\
              <div>\
                '+getChipWithBorderFromListLoc(data['TAGS'])+'\
              </div>\
\
              <div style="margin-top: 15px;">\
                <p class="long-text" >'+data['DESC']+'</p>\
              </div> \
              <div id="reach_content_btn" class="right-align" style="margin-top: 10px;">\
              <a onclick="viewEachTopic(\'' + docid + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
            </div>\
              </div> </div>  </div></div>'


 
let block_to_insert = document.createElement( 'div' );
block_to_insert.innerHTML = htmlContent ;
 
let container_block = document.getElementById( 'forum_card_section' );
container_block.appendChild( block_to_insert );

}

// View Each Topic
function viewEachTopic(details) {

  //displayOutput(details)
  currentTopicID = details

  window.scrollTo(0, 0);

  let data = allForumTopics[details]

  document.getElementById("show_all_topic_container").style.display = "none";
  document.getElementById("topic_display_container").style.display = "block";

  if(fl == 'only') {
    // No need to show close btn, user has to back to source page
    document.getElementById("close_fl_btn").style.display = "none";
    document.getElementById("close_fl_btn_to_back").style.display = "block";
  } else {
    document.getElementById("close_fl_btn").style.display = "block";
  }
  

  // Update Topic details 
  document.getElementById("u_img").src = data['UPHOTO']

  $("#u_name").html(data['UNAME']);
  $("#u_date").html(data['DATE']);
  $("#category").html('<div class="chip">' + data['CATEGORY1'] + '</div>');
  $("#title").html(data['TITLE']);
  $("#publish_date").html('Published on ' + data['DATE']);
 
  $("#tags").html(getChipWithBorderFromListLoc(data['TAGS']));

  $("#desc").html(data['DESC']);

  // Total Liks Count
  let likePath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'  
  db.collection(likePath).get().then(function(querySnapshot) {
    $("#total_fav_cnt").html(querySnapshot.size);     
  });
  

  // Btn Handling
  likeBtnHandling()
  bookmarkBtnHandling()

  // Handle user_control_section Section
  document.getElementById("user_control_section").style.display = "none";
  if(userLoginData['UUID'] == data['UUID']) {
    document.getElementById("user_control_section").style.display = "block";    
  }

  // Display all comments
  viewAllComments()

}

// ---------------------------------------
// Add new Item
function addNewItem(details) {
// createnew.html?pt=COMMONFORUM&id=NA&fl=NA
var url = 'createnew.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('ADD')+ '&type=' + encodeURIComponent(details);
window.location.href = url 
}

// Show My Topic Only
function openMyTopics() {
  // index.html?pt=NA&id=NA&fl=own
  var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('own');
  window.location.href = url

}

// Show All Topic Only
function openAllTopics() {
  // index.html?pt=NA&id=NA&fl=NA
  var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url

}

// ------------ DELETE Complete topic --------------

// Ask model to confirm delete
function askToDeleteCompleteTopic() {

  let mdlContent = ''

  let header = 'Delete Complete Topic'
  let content = 'Are you sure to delete complete topic ?'

  mdlContent += '<div class="left-align z-depth-2" style="border-radius: 5px 5px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="deleteCompleteTopic()" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'



  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#askmodel').modal('open');

}

// Delete complete topic
function deleteCompleteTopic() {

   displayOutput('Delete Topic : ' + currentTopicID)  

   // Delete all comments
   //deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT')

   // Delete all like
   //deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE')
   

   // Delete Main topic Document

   showPleaseWaitModel()

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

  // Just Update DELETESTATUS to true

  
  db.doc(path).update({
    DELETESTATUS: true
  }).then(ref => {

    db.doc(coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST/' + currentTopicID).delete().then(function () {
      hidePleaseWaitModel()
      toastMsg('Topic Deleted !!')
      resetFilter()
    });

  });
  

 //deleteDocumentUsingCloudFcn(path)

 /*
  db.doc(path).delete().then(function () {

    db.doc(coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST/' + currentTopicID).delete().then(function () {
      hidePleaseWaitModel()
      toastMsg('Topic Deleted !!')
      location.reload();
    });
   
  });
  */

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

// Delete Operation using Cloud Function
function deleteDocumentUsingCloudFcn(path) {
  /**
 * Call the 'recursiveDelete' callable function with a path to initiate
 * a server-side delete.
 */

 displayOutput('Delete Document using cloud function ....')

  var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
  deleteFn({ path: path })
      .then(function(result) {
          displayOutput('Delete success: ' + JSON.stringify(result));
      })
      .catch(function(err) {
        displayOutput('Delete failed, see console,');
          console.warn(err);
      });

}

// -------------------------------------------------

// ------------- Comment Handling ------------------

// Add new Comment
function addNewComment() { 

  // Read details
  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT'
 
  var validateInput =  true

  // Read Comment Details
  var comment = document.getElementById("comment").value.trim();
  displayOutput('comment : ' + comment)
  if(comment == '') {
    validateInput = false
    toastMsg('Comment is empty!!')
  }

  if(getLoginUserStatus() == 'false') {
    validateInput = false;
    toastMsg('Please login to write comment !!')
  }

  if(validateInput) {
       // Update Comment into Comment Section

       let forumData = {}

       forumData['COMMENT'] = nl2br(comment)

        forumData['DATE'] =  getTodayDate()
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        forumData['CREATEDON'] =  timestamp        

        forumData['UNAME'] =  userLoginData['NAME']
        forumData['UPHOTO'] =  userLoginData['PHOTO']
        forumData['UUID'] =  userLoginData['UUID']


       showPleaseWaitModel()

  // Update Into Database
   db.collection(path).add(forumData).then(function() {    
    hidePleaseWaitModel()
    
    document.getElementById("comment").value = ''

    toastMsg('Comment Added !!')


    /*
    // ---------------------------------------------------
    // Update Reply counter 
    let topicPath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

    // parseInt()
    allForumTopics[currentTopicID]['REPLYCNT'] = allForumTopics[currentTopicID]['REPLYCNT']++
    db.doc(topicPath).update({
      REPLYCNT: allForumTopics[currentTopicID]['REPLYCNT']
    }).then(ref => {
       displayOutput('Reply counter increment !!')
    });

    // -----------------------------------------------------
    */


    viewAllComments()
     
  }); 
  }

}

// View all comments
function viewAllComments() {

  $("#all_user_comments").html('<p>Loading .... </p>');

  currentTopicCommentsStatus = true

   // Read details
   let path = coll_base_path + 'FORUM/' + main_path + '/' +  currentTopicID + '/COMMENT'

   let htmlContent = '<div class="row">'

   let queryRef = db.collection(path).orderBy('CREATEDON', 'desc');
 
   queryRef.get()
    .then(snapshot => {
  
      if (snapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Ratings Record Found !!') 
        //document.getElementById("ratings_sec").style.display = 'none'; 
        $("#all_user_comments").html('<p>No Comment !!</p>');

        currentTopicCommentsStatus = false

      } else {
  
      snapshot.forEach(doc => { 
        let data = doc.data() 

        // Update Comment Section

        htmlContent += ' <div id="'+ doc.id +'" class="col s12 m12" style="margin-top : 10px;" >\
        <div class="" style="border-radius: 5px; border: 1px solid grey; border-top-style: none;">\
          <div>\
            <!-- Header -->\
              <ul class="collection" style="border-radius: 5px 5px 0px 0px; margin-top : -0.5px;">\
                <li class="collection-item avatar">\
                  <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                  <span class="title"><b>'+data['UNAME']+'</b></span>\
                  <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                  </li>\
              </ul>\
  \
              <!-- Content -->\
              <div>\
  \
                <div style="margin-left: 10px; margin-right: 10px;">\
                  <p class="long-text-nor">'+data['COMMENT']+'</p>\
                </div>'

                if(userLoginData['UUID'] == data['UUID']) {
                htmlContent += ' <div class="right-align" style="margin-top: 0px;">\
                <a onclick="askToDeleteComment(\'' + doc.id + '\')" class="waves-effect waves-teal btn-flat blue-text">Delete</a>\
              </div>'
                }

               htmlContent += ' </div> </div>  </div></div>'

      });   
      
      
      htmlContent += '</div>'


      $("#all_user_comments").html(htmlContent);  
     
  
    }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  

}

// Ask model dialog to delete any document
function askToDeleteComment(details) {

  let mdlContent = ''

  let header = 'Delete Comment'
  let content = 'Are you sure to delete comment ?'

  mdlContent += '<div class="left-align z-depth-2" style="border-radius: 5px 5px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="deleteComment(\'' + details + '\')" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'



  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#askmodel').modal('open');

}

// Delete Comment
function deleteComment(details) {

  askNO()
  displayOutput(details) 
  document.getElementById(details).style.display = "none"; 

  //showPleaseWaitModel()

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT/' + details

  db.doc(path).delete().then(function () {
    //hidePleaseWaitModel()
    toastMsg('Comment Deleted !!') 

    /*
    // ---------------------------------------------------
  // Update Reply counter 
  let topicPath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

  let cntInc = allForumTopics[currentTopicID]['REPLYCNT']
  if(cntInc < 0) {
    cntInc = 1
  }

  allForumTopics[currentTopicID]['REPLYCNT'] = cntInc--
  displayOutput(allForumTopics[currentTopicID]['REPLYCNT'])
  db.doc(topicPath).update({
    REPLYCNT: allForumTopics[currentTopicID]['REPLYCNT']
  }).then(ref => {
     displayOutput('Reply counter increment !!')
  });

  // --------------------------------------------------
  */ 

  }); 

  

}


// --------------- Edit Topic --------------
function editTopic() {
  // pt=COMMONFORUM&id=NA&fl=NA
  var url = 'createnew.html?pt='+encodeURIComponent(main_path)+'&id=' + encodeURIComponent(currentTopicID)+'&fl=' + encodeURIComponent('edit') + '&type=' + encodeURIComponent(allForumTopics[currentTopicID]['DOCTYPE']);
  window.location.href = url
}

// Share topic
function shareTopic() {

  // forum/index.html?pt=COMMONFORUM&id=iMBaFUKyBcH9Jb4eAUpn&fl=edit
  let link = 'https://kivtravels.com/prod/forum/index.html?pt='+main_path+'&id='+currentTopicID+'&fl=only' 

  var textArea = document.createElement("textarea");
  textArea.value = link;
  textArea.display = "none";
  textArea.style.position="fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';    
    //displayOutput('Fallback: Copying text command was ' + msg);
    toastMsg('Link Copied !!')
  } catch (err) {
    //console.error('Fallback: Oops, unable to copy', err);
    displayOutput('Oops, unable to copy')
  }

  document.body.removeChild(textArea);

}

// Like topic
function likeTopic() {

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'

  if(getLoginUserStatus() == 'true') {

  if(currentTopicLikeStatus) {

    db.collection(path).doc(userLoginData['UUID']).delete().then(function() { 
      $("#like_btn").html('favorite_border');
      currentTopicLikeStatus = false
    }); 

  } else {

    db.collection(path).doc(userLoginData['UUID']).set({LIKE : 'YES'}).then(function() { 
      $("#like_btn").html('favorite');
      currentTopicLikeStatus = true
    }); 

  }

} else {
  toastMsg('Please login !!')
}

}

// Like btn handling
function likeBtnHandling() {
  $("#like_btn").html('favorite_border');
  currentTopicLikeStatus = false

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'

  if(getLoginUserStatus() == 'true') {

  db.collection(path).doc(userLoginData['UUID']).get()
  .then(doc => {
    if (!doc.exists) {
      $("#like_btn").html('favorite_border');
      currentTopicLikeStatus = false
    } else {
      $("#like_btn").html('favorite');
      currentTopicLikeStatus = true
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });

}

}

// Bookmark topic
function bookmarkTopic() {
  $("#bookmark_btn").html('bookmark');

  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'

  if(getLoginUserStatus() == 'true') {
  
  if(currentTopicBookmarkStatus) {

    db.collection(path).doc(currentTopicID).delete().then(function() { 
      $("#bookmark_btn").html('bookmark_border');
      currentTopicBookmarkStatus = false
      toastMsg('Bookmark Removed !!')
    }); 

  } else {

    let data = allForumTopics[currentTopicID]

    let bookmarkData = {}
    
    bookmarkData['UPHOTO'] = data['UPHOTO']
    bookmarkData['UNAME'] = data['UNAME']
    bookmarkData['DATE'] = data['DATE']
    bookmarkData['TITLE'] = data['TITLE']
    bookmarkData['TYPE'] = 'FORUM'

    var url = 'forum/index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(currentTopicID) + '&fl=' + encodeURIComponent('only'); 
    bookmarkData['LINK'] = url


    db.collection(path).doc(currentTopicID).set(bookmarkData).then(function() { 
      $("#bookmark_btn").html('bookmark');
      currentTopicBookmarkStatus = true
      toastMsg('Bookmark Added !!')
    }); 

  }

} else {
  toastMsg('Please login !!')
}


}

// Bookmark Handling
function bookmarkBtnHandling() {
  $("#bookmark_btn").html('bookmark_border');
  currentTopicBookmarkStatus = false
  
  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'

  if(getLoginUserStatus() == 'true') {
    db.collection(path).doc(currentTopicID).get()
    .then(doc => {
      if (!doc.exists) {
        $("#bookmark_btn").html('bookmark_border');
        currentTopicBookmarkStatus = false
      } else {
        $("#bookmark_btn").html('bookmark');
        currentTopicBookmarkStatus = true
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  }

}


// Get Chip with border accroding to the Name
function getChipWithBorderFromListLoc(details){

  if((details[0] == 'NA') && (details.length == 1)) {
    details = ''
  } else {
    //details.splice( details.indexOf('NA'), 1 );
  }

  var html_line = ''

  for (each_idx in details) {
    var name = details[each_idx]
    let start = '<a href="#!" onclick="chipClickHandling(\'' + name +'#tag' + '\')" ><div class="chip-outline grey-text" style="margin-right: 5px; margin-top: 5px;">'
    let end = '</div></a>'

    html_line += start + name + end
  }

  return html_line

}

// On Chip Click Handling
function chipClickHandling(details) {
  displayOutput(details)

  // Open URL with tag filter option
  // index.html?pt=NA&id=NA&fl=tag
  var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(details.split('#')[0]) + '&fl=' + encodeURIComponent(details.split('#')[1]);
  window.location.href = url

}

// ---------- UI Handling ------------------

// close topic view
function hideFullMessageDialog() {

  if((fl == 'NA') || (fl == 'own')) {

    document.getElementById("show_all_topic_container").style.display = "block";
    document.getElementById("topic_display_container").style.display = "none";

    document.getElementById("close_fl_btn").style.display = "none";

  } else {

    var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
    window.location.href = url

  }

  

}

// Back to previous page
function backTopreviousPage() {
  window.history.back();
}


// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: {
        "Apple": null,
        "Microsoft": null,
        "Google": 'https://placehold.it/250x250'
      },
    });
  });


  $(document).ready(function(){
    $('.datepicker').datepicker();
  });

  $(document).ready(function(){
    $('select').formSelect();
  });

}



// ------------ Filter Handling --------------

// Open Filter Section
function openFilterSection() {

  window.scrollTo(0, 0);  

  document.getElementById("col_section_1").style.display = 'none';
  document.getElementById("flb_open_filter").style.display = 'none';
  document.getElementById("main_footer_sec").style.display = 'none';  

  document.getElementById("flb_close_filter").style.display = 'block';
  document.getElementById("filter_section").style.display = 'block';

}

// Close Filter Section
function closeFilterSection() {

  window.scrollTo(0, 0);

  document.getElementById("col_section_1").style.display = 'block';
  document.getElementById("flb_open_filter").style.display = 'block';
  //document.getElementById("main_footer_sec").style.display = 'block';  

  document.getElementById("flb_close_filter").style.display = 'none';
  document.getElementById("filter_section").style.display = 'none';
  

}

// RESET Filter 
function resetFilter() {
  // index.html?pt=NA&id=NA&fl=NA
  var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// Apply Filter
function applyFilter() {

  let filter_validation = true

  // Read Filter details
  var topic_date = document.getElementById("topic_date").value;
  displayOutput('Topic Date : ' + topic_date)

  if(topic_date == '') {
    filter_validation = false
  }

  if(filter_validation) {

  filter_enable_flag = true
  filter_key = 'DATE'
  filter_value = topic_date

   // Update Filter section details
   $('#main_filter_section').html('<div class="chip">' + 'Date : ' +  topic_date + '</div>')
   
   document.getElementById("filter_reset_btn_home").style.display = 'block';
   
   if(filter_key == 'DATE') {
    document.getElementById("message_section").style.display = 'block';
    $('#message_content').html('Filter Applied on Selected Date !!')
   }
   

  closeFilterSection()

  readAllForums()

  } else {     
    toastMsg('Invalid Filter !!')

    closeFilterSection()
  }


}


// ------------- Menu Handling -------------------

// Show Menu Options
function showMenuOptions() {

  if(getLoginUserStatus() == 'true') {

  document.getElementById("show_all_topic_container").style.display = "none";
  document.getElementById("menu_section").style.display = "block";

  document.getElementById("close_fl_btn_menu").style.display = "block";
  } else {
    toastMsg('Please login to post anything !!')
  }

}

// Hide Menu Options
function hideMenuDialogSection() {
  document.getElementById("show_all_topic_container").style.display = "block";
  document.getElementById("menu_section").style.display = "none";

  document.getElementById("close_fl_btn_menu").style.display = "none";

}

