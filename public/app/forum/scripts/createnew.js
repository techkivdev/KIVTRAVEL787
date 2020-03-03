// *******************************************************************************
// SCRIPT : createnew.js
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

var userLoginData = ''

var main_path = 'NA'
var id = 'NA'
var fl = 'NA'
var type = 'NA'

var updateExistingContentDetails = false
var currentData = {}


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
  id = params['id']
  fl = params['fl'].replace('#!','')
  type = params['type'].replace('#!','')

  if(fl == 'ADD') {
    updateExistingContentDetails = false
  } else {
    if(fl != 'NA') {
      updateExistingContentDetails = true
    }
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

    // Update User Information Section 
    let htmlContent = ''
    htmlContent += '<div style="margin: 0px 12px 0px 12px;"><ul class="collection">\
    <li class="collection-item avatar yellow">\
      <img src="'+userLoginData['PHOTO']+'" alt="" class="circle">\
      <span class="title"><b>'+userLoginData['NAME']+'</b></span>\
      <p class="grey-text" style="font-size: 15px;">'+userLoginData['EMAIL']+'</p>\
    </li></ul></div>'

    $("#user_info_sec").html(htmlContent);

    if(updateExistingContentDetails) {
      document.getElementById("main_list_container").style.display = 'none';
      document.getElementById("hdr_section").style.display = 'none';
    } else {
      document.getElementById("main_list_container").style.display = 'block';
      document.getElementById("hdr_section").style.display = 'block';
    }
    
  }  else {
    document.getElementById("hdr_section_validation_failed").style.display = 'block';
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

// Show All Topic Only
function openAllTopics() {
  // index.html?pt=NA&id=NA&fl=NA
  var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url

}

// Update Complete HTML Page
function updateHTMLPage() {  
  modifyPageStyle()

  window.scrollTo(0, 0); 

  if(fl == 'ADD') {
    // Check for type
    if(type == 'TOPIC') {
      document.getElementById("create_new_topic").style.display = 'block';
      $("#main_hdr_msg").html('Add New Topic');

    } else if(type == 'EVENT') {
      document.getElementById("create_new_event").style.display = 'block';
      $("#main_hdr_msg").html('Add New Event');
    }


  } else if(fl == 'edit') {

    // Check for type
    if(type == 'TOPIC') {
      document.getElementById("create_new_topic").style.display = 'block';
      $("#main_hdr_msg").html('Add New Topic');

      showCurrentTopicContent()

    } else if(type == 'EVENT') {
      document.getElementById("create_new_event").style.display = 'block';
      $("#main_hdr_msg").html('Add New Event');
    }


    
  }

}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!') 
    
    document.getElementById('main_list_container').className = "container-fluid";

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

// Read Current topic content and update HTML page
function showCurrentTopicContent() {
  displayOutput('Read current topic content.') 

  //showPleaseWaitModel()

  document.getElementById("main_progress").style.display = 'block';

  db.collection(coll_base_path+'FORUM/' + main_path).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');
      //hidePleaseWaitModel()
      document.getElementById("hdr_section_validation_failed").style.display = 'block';

      document.getElementById("main_progress").style.display = 'none';
      $('#validation_msg').html('Topic not found !!')


    } else {
      let data = doc.data()
      updateExistingContentDetails = true

      currentData = data

      //displayOutput(data)

      // Update HTML Page
      document.getElementById("title").value = data['TITLE']

      // Update Description content      
      document.getElementById("description").value = br2nl(data['DESC'])
      M.textareaAutoResize($('#description'));

      // create tag map
      let tagMap = []
      for(eachidx in data['TAGS']) {
        let tagValue = data['TAGS'][eachidx]
        if(tagValue != 'NA') {
        tagMap.push({tag: tagValue})
        }
      }

      displayOutput(tagMap)

      $('.chips').chips({
        data: tagMap,
      });

      // Update CATEGORY
      document.getElementById(data['CATEGORY1']).selected = true

      $(document).ready(function(){
        $('select').formSelect();
      });

      document.getElementById("main_progress").style.display = 'none';

      document.getElementById("main_list_container").style.display = 'block';
      document.getElementById("hdr_section").style.display = 'block';


      //hidePleaseWaitModel()      
    }
  })
  .catch(err => {
    //hidePleaseWaitModel()
    displayOutput('Error getting document', err);
  });

}


// Cancel Details
function cancelDetails() {

  if(updateExistingContentDetails) {
    var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('edit');
    window.location.href = url
  }  else {
    var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
    window.location.href = url
  }


  
}

// Submit New Post
function submitDetails() { 

  if(updateExistingContentDetails) {
    // --------- Update Existing --------------
    if(type == 'TOPIC') {
      addNewTopic()
    }

  } else {

    // ------- Add New ---------------
    if(fl == 'ADD') {
      if(type == 'TOPIC') {
        addNewTopic()
      }
    }

  }

 


}

// -------------------------

// Add New Topic
function addNewTopic() {

  displayOutput('Submit New Topic !!')

   // Validate input
   let validateInput = true

   var title = document.getElementById("title").value.trim();
   displayOutput('title : ' + title)
   if(title == '') {
     validateInput = false
     toastMsg('Topic Title is empty!!')
   }
   
   var tagsList= M.Chips.getInstance($('.chips')).chipsData;
   let tagsData = []
   if(tagsList.length == 0) {
     tagsData.push('NA')
   } else {
   //displayOutput(tagsList)
   for(eachIdx in tagsList) {
     tagsData.push(tagsList[eachIdx]['tag'])
   }
 }
 displayOutput(tagsData)
  
 
   var description = document.getElementById("description").value.trim();
   //description = description.replace(/\r?\n/g, "<br>")
   description = nl2br(description)
   displayOutput('description : ' + description)   
   if(description == '') {
     validateInput = false
     toastMsg('Topic Description is empty!!')
   }
 
   let catgOption = ["","Category1","Category2","Category3"]
   let catDropValue = document.getElementById("catg_options").value
   let cateData = ''
   if(catDropValue == '') {
     cateData = 'NA'
     toastMsg('Please select Category !!')
     validateInput = false
   } else {
     cateData = catgOption[catDropValue]
   } 
   displayOutput('cateData : ' + cateData)

   // Check for Term and conditions
   let terms_check_status = document.getElementById("accept_terms_checkbox").checked
   if(!terms_check_status){
    toastMsg('Please accept terms and conditions.')
    validateInput = false
   }
 
 
   //validateInput = false
   // If all Validation is true
   if(validateInput) {
     displayOutput('Input Validation TRUE !!')
 
     let forumData = {}
 
     // --------- Form Data Set -------------
     forumData['TITLE'] =  title
     forumData['TAGS'] =  tagsData
 
     // ---- Category --------------
     forumData['CATEGORY1'] =  cateData
     //forumData['CATEGORY2'] =  'NA'
     //forumData['CATEGORY3'] =  'NA'
 
 
     forumData['DESC'] =  description
     forumData['DATE'] =  getTodayDate()
     forumData['DATELIST'] =  getTodayDateList()
     

     if(updateExistingContentDetails) {
      forumData['CREATEDON'] =  currentData['CREATEDON']
     } else {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      forumData['CREATEDON'] =  timestamp
     }
           
 
     forumData['UNAME'] =  userLoginData['NAME']
     forumData['UPHOTO'] =  userLoginData['PHOTO']
     forumData['UUID'] =  userLoginData['UUID']
 
     forumData['DELETESTATUS'] = false
 
     //forumData['MULTICONFIG'] = ['NA']
 
     forumData['DOCTYPE'] = 'TOPIC'  // Chnage It according to the Item
     forumData['DOCVER'] = 'V1'
     
     forumData['ISMAIN'] = false
 
     /*
     forumData['EXTRA'] = {
       EXTRA1 : 'NA'
     }
     */
 
     forumData['SCOPE'] = 'NA'
     forumData['MAPCORD'] = 'NA'
     forumData['LOCATION'] = 'NA' 
     
 
     if(updateExistingContentDetails) {
       updateExistPostIntoDatabase(forumData)
     } else {
       updateNewPostIntoDatabase(forumData)
     } 
 
   } else {
     displayOutput('Input Validation FALSE !!')
   }

}

// Edit Option Handling

function editOptionBtn(details) {
  displayOutput(details)

  // Read Current Content and Update it
  var description = document.getElementById("description").value.trim();

  switch(details) {

    case 'BOLD' :
      description = description + '<b>Type Here</b>'
      break;

    case 'ITALIC' :
      description = description + '<i>Type Here</i>'
      break;

    case 'UNDERLINE' :
      description = description + '<u>Type Here</u>'
      break;

    case 'LIST' :
      description = description + '<li>Type Here</li>'
      break;

    case 'BLOCKLIST' :
      description = description + '<blockquote>Type Here</blockquote>'
      break;

    case 'LINK' :
      description = description + '<a href="address">Name</a>'
      break;

    default:
      break;
  }

  document.getElementById("description").value = description
  M.textareaAutoResize($('#description'));

}

// Preview Message
function previewMessage() {
  viewModel('Content',nl2br(document.getElementById("description").value.trim()))
}

// -------------------------

// Update MYLIST Section
function updateMyList(data,docid) { 

  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST' 

  let bookmarkData = {}
  
  bookmarkData['UPHOTO'] = data['UPHOTO']
  bookmarkData['UNAME'] = data['UNAME']
  bookmarkData['UUID'] = data['UUID']
  bookmarkData['DATE'] = data['DATE']
  bookmarkData['TITLE'] = data['TITLE']
  bookmarkData['TYPE'] = 'FORUM'
  bookmarkData['CREATEDON'] = data['CREATEDON']

  var url = 'forum/index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(docid) + '&fl=' + encodeURIComponent('only'); 
  bookmarkData['LINK'] = url


  db.collection(path).doc(docid).set(bookmarkData).then(function() { 
    //toastMsg('Bookmark Added !!')
    hidePleaseWaitModel()
    cancelDetails()
  });  


}

// Update new Post into Database
function updateNewPostIntoDatabase(forumData){

  showPleaseWaitModel()

  if(first_time_operation) {
    setNewDocument(coll_base_path,'FORUM',{NAME: 'FORUM'},'NA')
  } 

   // Create our initial doc
   db.collection(coll_base_path+'FORUM/' + main_path).add(forumData).then( ref => {   
    displayOutput('Added document with ID: ' +  ref.id);
    updateMyList(forumData,ref.id)     
  }); 

}

// Update Exist Post into Database
function updateExistPostIntoDatabase(forumData){

  showPleaseWaitModel()  

   // Create our initial doc
   db.collection(coll_base_path+'FORUM/' + main_path).doc(id).set(forumData).then(function() {    
    hidePleaseWaitModel()
    
    var url = 'index.html?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('edit');
    window.location.href = url
     
  }); 

}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('.datepicker').datepicker();
  });

  $(document).ready(function(){
    $('select').formSelect();
  });

  // Chip 
  $('.chips-placeholder').chips({
    placeholder: 'Enter a Tag',
    secondaryPlaceholder: '+Tag',
  }); 

  M.textareaAutoResize($('#description'));

  $(document).ready(function(){
    $('.tooltipped').tooltip();
  });

}


$( document ).ready(function() {

});


