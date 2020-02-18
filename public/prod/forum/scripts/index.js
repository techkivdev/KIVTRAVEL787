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

var allForumTopics = {}


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
    displayOutput(userLoginData)

    if(updateTopicHTMLPage) {
      // Read all topic and display content
      readAllForumTopics()
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

  // Page Haandling according to Filter value : fl

  if((fl == 'NA') || (fl == 'tag') || (fl == 'catg')){
    // Read all topic and display content
    readAllForumTopics()
  } else if((fl == 'edit') || (fl == 'only')) {
    // Read only edit topic details and show details
    readOneForumTopics()
  } if(fl == 'own') {
   // Nothing to do
  }
  else {
    //let htmlContent = ''
    //htmlContent += '<h1 class="white-text">No Topic Found !!</h1>'    
    //$("#forum_card_section").html(htmlContent);
    //document.getElementById("main_progress").style.display = "none";
  }


  // Update message according to the main path
  if(main_path == 'COMMON') {
    document.getElementById("message_section").style.display = 'block';
    $('#message_content').html('You are under MAIN Group !!')
  }

  // Update Filter section details
  $('#main_filter_section').html('')
  if((fl == 'tag') || (fl == 'catg')) {
    $('#main_filter_section').html('<div class="chip">' + id + '</div>')
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


// Read Forum Topic Details
function readAllForumTopics() {

  // Read details
  let path = coll_base_path + 'FORUM/' + main_path 
  
  // ---------------------------------------
  // Query Handling
  // orderBy('DATEID', 'desc')
  let queryRef = ''
  if(fl == 'own') {
    queryRef = db.collection(path).where('UUID', '==', userLoginData['UUID']).limit(10);
  } else if(fl == 'tag') {
    queryRef = db.collection(path).where('TAGS', 'array-contains',id).limit(10);
  } else if(fl == 'catg') {
    queryRef = db.collection(path).where('CATEGORY', '==', id).limit(10);
  } else {
    queryRef = db.collection(path).orderBy('DATEID', 'desc').limit(10);
  }
  
 
  queryRef.get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------  
       displayOutput('No Ratings Record Found !!') 

       let htmlContent = ''
       htmlContent += '<h1 class="white-text">No Topic Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";

     } else {
 
     snapshot.forEach(doc => { 
       allForumTopics[doc.id] = doc.data() 
     });

     // Update Forum HTML Content

     updateForumContent()
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   });
 
  

}

// Read Only One Forum Topic Details
function readOneForumTopics() {

  // Read details
  
  db.collection(coll_base_path+'FORUM/' + main_path).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');  
      
      let htmlContent = ''
       htmlContent += '<h1 class="white-text">No Topic Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";

    } else {
      allForumTopics[doc.id] = doc.data()

      // Update Forum HTML Content

     updateForumContent()

     viewEachTopic(doc.id)
      
      
    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });
  

}


// Update forum Section
function updateForumContent() { 

  let htmlContent = '<div class="row">'

 for(eachKey in allForumTopics) {

      let data = allForumTopics[eachKey]
      //displayOutput(data)
      let tags = data['TAGS']
      if(tags[0] == 'NA') {
        tags = ''
      } 
           


      htmlContent += ' <div class="col s12 m12">\
      <div class="card" style="border-radius: 5px;">\
        <div>\
          <!-- Header -->\
            <ul class="collection" style="border-radius: 5px 5px 0px 0px;">\
              <li class="collection-item avatar"><span class="new badge blue" data-badge-caption="reply">'+data['REPLYCNT']+'</span>\
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
                '+getChipWithBorderFromListLoc(tags)+'\
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
  } else {
    document.getElementById("close_fl_btn").style.display = "block";
  }
  

  // Update Topic details 
  document.getElementById("u_img").src = data['UPHOTO']

  $("#u_name").html(data['UNAME']);
  $("#u_date").html(data['DATE']);
  $("#category").html('<div class="chip">' + data['CATEGORY'] + '</div>');
  $("#title").html(data['TITLE']);

  let tags = data['TAGS']
  if(tags[0] == 'NA') {
    tags = ''
  } 
  $("#tags").html(getChipWithBorderFromListLoc(tags));

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

// Add new topic
function addNewTopic() {
  // createnew.html?pt=COMMON&id=NA&fl=NA
  var url = 'createnew.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
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
   deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT')

   // Delete all like
   deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE')
   

   // Delete Main topic Document

   showPleaseWaitModel()

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

  // Just Update DELETESTATUS to true

  /*
  db.doc(path).update({
    DELETESTATUS: true
  }).then(ref => {
    hidePleaseWaitModel()
    toastMsg('Topic Deleted !!')
    location.reload();
  });
  */

  db.doc(path).delete().then(function () {

    db.doc(coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST/' + currentTopicID).delete().then(function () {
      hidePleaseWaitModel()
      toastMsg('Topic Deleted !!')
      location.reload();
    });
   
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

  if(validateInput) {
       // Update Comment into Comment Section

       let forumData = {}

       forumData['COMMENT'] = comment

        forumData['DATE'] =  getTodayDate()
        forumData['DATEID'] =  parseInt(getTodayDateID())

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

   let queryRef = db.collection(path).orderBy('DATEID', 'desc');
 
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
                  <p>'+data['COMMENT']+'</p>\
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
  // pt=COMMON&id=NA&fl=NA
  var url = 'createnew.html?pt='+encodeURIComponent(main_path)+'&id=' + encodeURIComponent(currentTopicID)+'&fl=' + encodeURIComponent('edit');
  window.location.href = url
}

// Share topic
function shareTopic() {

  // forum/index.html?pt=COMMON&id=iMBaFUKyBcH9Jb4eAUpn&fl=edit
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

}

// Like btn handling
function likeBtnHandling() {
  $("#like_btn").html('favorite_border');
  currentTopicLikeStatus = false

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'

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

// Bookmark topic
function bookmarkTopic() {
  $("#bookmark_btn").html('bookmark');

  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'
  
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


}

// Bookmark Handling
function bookmarkBtnHandling() {
  $("#bookmark_btn").html('bookmark_border');
  currentTopicBookmarkStatus = false
  
  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'

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


// Get Chip with border accroding to the Name
function getChipWithBorderFromListLoc(details){

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

