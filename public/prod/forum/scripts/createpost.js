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

// Page config
let main_page = 'showpost.html'
let create_page = 'createpost.html'


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
    htmlContent += '<div class="card" style="margin: 0px 0px 0px 0px; border-radius: 5px;"><ul class="collection">\
    <li class="collection-item avatar orange" style="border-radius: 5px;">\
      <img src="'+userLoginData['PHOTO']+'" alt="" class="circle">\
      <span class="title"><b>'+userLoginData['NAME']+'</b></span>\
      <p class="white-text" style="font-size: 15px;">'+userLoginData['EMAIL']+'</p>\
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

// Show All Post Only
function openAllTopics() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
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
      $("#main_hdr_msg").html('Add New Post');

    } else if(type == 'EVENT') {
      document.getElementById("create_new_event").style.display = 'block';
      $("#main_hdr_msg").html('Add New Event');
    }


  } else if(fl == 'edit') {

    // Check for type
    if(type == 'TOPIC') {
      document.getElementById("create_new_topic").style.display = 'block';
      $("#main_hdr_msg").html('Add New Post');

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
      $('#validation_msg').html('Post not found !!')


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
    displayOutput('Error getting document' + err);
  });

}


// Cancel Details
function cancelDetails() {

  if(updateExistingContentDetails) {
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('edit');
    window.location.href = url
  }  else {
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
    window.location.href = url
  }


  
}

// Submit New Post
function submitDetails() { 

  let testing_purpose = false

  if(testing_purpose) {

       generateNDocuments()

  } else {
   
  
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
  



}

// -------------------------

// Add New Post
function addNewTopic() {

  displayOutput('Submit New Post !!')

   // Validate input
   let validateInput = true

   var title = document.getElementById("title").value.trim();
   displayOutput('title : ' + title)
   if(title == '') {
     validateInput = false
     toastMsg('Post Title is empty!!')
   }
   
   var tagsList= M.Chips.getInstance($('.chips')).chipsData;
   let tagsData = []
   if(tagsList.length == 0) {
     tagsData.push('NA')
   } else {
   //displayOutput(tagsList)
   for(eachIdx in tagsList) {
     tagsData.push(tagsList[eachIdx]['tag'].replace(/\s/g, ""))
   }
 }
 displayOutput(tagsData)
  
 
   var description = document.getElementById("description").value.trim();
   //description = description.replace(/\r?\n/g, "<br>")
   description = nl2br(description)
   displayOutput('description : ' + description)   
   if(description == '') {
     validateInput = false
     toastMsg('Post Description is empty!!')
   }
 
   let catgOption = getCatg1DataMapping('LIST')  

   let catDropValue = document.getElementById("catg_options").value
   let cateData = ''
   let cateData_display = ''

   if(catDropValue == '') {
     cateData = 'NA'
     cateData_display = 'NA'
     toastMsg('Please select Category !!')
     validateInput = false
   } else {
     cateData = catgOption[catDropValue]
     cateData_display = getCatg1DataMapping(cateData)
   } 
   displayOutput('cateData : ' + cateData)
   displayOutput('cateData_display : ' + cateData_display)

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
     forumData['CATEGORY1DIS'] =  cateData_display
 
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
     forumData['PAGEID'] = 1
 
     /*
     forumData['EXTRA'] = {
       EXTRA1 : 'NA'
     }
     */
     
 
     if(updateExistingContentDetails) {
       updateExistPostIntoDatabase(forumData)
     } else {
       updateNewPostIntoDatabase(forumData)
     } 
 
   } else {
     displayOutput('Input Validation FALSE !!')
   }

}

// ---------------------------------------
// TESTING : Generated n- Documents
function generateNDocuments() {

  var i;
  for (i = 0; i < 30; i++) {   

    let forumData = {}
 
     // --------- Form Data Set -------------
     let titleList = []
     titleList[0] = 'Trading Halted For 45 Minutes, Sensex Down 3,091 Points; Nifty Below 9,000'
     titleList[1] = 'Karnataka man, 76, is Indias first coronavirus fatality'
     titleList[2] = 'Govt: Dont panic, no community transmission of coronavirus yet'
     titleList[3] = 'Day after His BJP Entry, MP Economic Offences Wing Reopens Forgery Case Against Jyotiraditya Scindia'
     titleList[4] = 'Google India employee tests positive for coronavirus'
     titleList[5] = 'Canadian PM Justin Trudeau wife positive for coronavirus'
     titleList[6] = 'Sophie Gregoire Trudeau had returned from a speaking engagement in Britain and was showing mild flu-like symptoms.'
     titleList[7] = 'A flight attendant tells why should never keep anything on the seat-back pocket of a plane'
     titleList[8] = 'How does coronavirus spread? How do you get it?'
     titleList[9] = 'Growing concerns about the coronavirus pandemic in the last 24 hours — with California calling for a ban on many public events, the NBA suspending its'



     forumData['TITLE'] =  titleList[Math.floor(Math.random() * 9)] + ' ' + i

     let normalTag = ['Justin Trudeau','Amit Shah','BSE SENSEX','Yes Bank','India','Donald Trump','NIFTY 50','StateBankofIndia','Coronavirus','Leo Varadkar','travel','traveling','vacation','visiting','instatravel','instago','instagood','trip','holiday','photooftheday','fun','travelling','tourism','tourist','instapassport','instatraveling','mytravelgram','travelgram','travelingram','igtravel']
          
     let tagList = []
     let maxTags = Math.floor(Math.random() * 10)
     for (let j = 0; j < maxTags; j++) {
       let newTag = normalTag[Math.floor(Math.random() * 28)].replace(' ','').toLowerCase()
      tagList.push(newTag)
     }

     forumData['TAGS'] =  tagList
 
     // ---- Category --------------     
     
     let catgListD = ['INFO','TIPS','QRY','INFO','TIPS','QRY']
     let catgList = ['General Infromation','Important Travel Tips','Any Query','General Infromation','Important Travel Tips','Any Query']
     let catgnum = Math.floor(Math.random() * 5)
     forumData['CATEGORY1DIS'] =  catgList[catgnum]
     forumData['CATEGORY1'] =  catgListD[catgnum]
 
     forumData['DESC'] =  'We suggest that seawater δ18O may have decreased through time, in contrast to the large increases seen in marine chemical sediments. To explain this possibility, we construct an oxygen isotope exchange model of the geologic water cycle, which suggests that the initiation of continental weathering in the late Archaean, between 3 and 2.5 billion years ago, would have drawn down an 18O-enriched early Archaean ocean to δ18O values similar to those of modern seawater,” say the co-authors in the paper.<br><br>\
                           The co-authors believe that the Panorama has what was the hard, outer shell of the planet. “There are no samples of really ancient ocean water lying around, but we do have rocks that interacted with that seawater and remembered that interaction,” says Johnson. The process, he says, is like analyzing coffee grounds to gather information about the water that poured through it. To do that, the researchers analyzed data from more than 100 rock samples from across the dry terrain.'
     
     // Create Date - Mar 19, 2020
     var month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";

      let monthValue = month[Math.floor(Math.random() * 11)].substring(0, 3)
       
      let dateValue = Math.floor(Math.random() * 30)
      let yearList = ['2018','2019','2020','2018','2019','2020']
      let yearValue = yearList[Math.floor(Math.random() * 5)]

      var date = monthValue + ' ' + dateValue + ', ' + yearValue;


     forumData['DATE'] =  date
     forumData['DATELIST'] =  [monthValue, dateValue , yearValue]
     

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
     forumData['PAGEID'] = 1
 
     /*
     forumData['EXTRA'] = {
       EXTRA1 : 'NA'
     }
     */

    displayOutput(forumData)


    // Create our initial doc    
    db.collection(coll_base_path+'FORUM/' + main_path).add(forumData).then( ref => {   
      displayOutput('Added document with ID: ' +  ref.id);
      updateMyList(forumData,ref.id)     
    }); 

    }

}
// ---------------------------------------

// Open Edit Options Modal
function openEditOptionsModal(control) {

  displayOutput(control) 

  // Click Behaviour Change according to control
  let content = ''
  if(control == 'LINK') {

    content = '  <!-- edit content -->\
    <form class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <textarea id="edit_link_name" class="materialize-textarea"></textarea>\
              <label for="edit_link_name">Link Name</label>\
            </div>\
            <div class="input-field col s12">\
            <!-- <i class="material-icons prefix">message</i> -->\
            <textarea id="edit_link_address" class="materialize-textarea"></textarea>\
            <label for="edit_link_address">Link Address</label>\
          </div>\
      </div>\
    </form>'

  } else {

    content = '  <!-- edit content -->\
    <form class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <textarea id="edit_content" class="materialize-textarea"></textarea>\
              <label for="edit_content">Type Text</label>\
            </div></div>\
    </form>'  

  }
  
  

  var model = '<!-- Modal Structure -->\
  <div id="commentModal" class="modal">\
    <div class="modal-content">\
      <h4> '+ '' + '</h4>\
      <p class="long-text-nor">'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>\
      <a href="#!" onclick="editOptionBtn(\'' + control + '\')" class="waves-effect waves-green btn-flat">Add</a>\
    </div>\
  </div>'

  var elem = document.getElementById('commentModal');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });
 
  $('#commentModal').modal('open');  

}

// Edit Option Handling
function editOptionBtn(details) {
  displayOutput(details)

  $('#commentModal').modal('close');

  var validateInput =  true

  if(details == 'LINK') {

    // Read Comment Details
   var edit_link_name = document.getElementById("edit_link_name").value.trim();
   var edit_link_address = document.getElementById("edit_link_address").value.trim();
   if((edit_link_name == '') || (edit_link_address == '')) {
     validateInput = false     
   } 

  } else {

   // Read Comment Details
   var edit_content = document.getElementById("edit_content").value.trim();
   displayOutput('edit_content : ' + edit_content)
   if(edit_content == '') {
     validateInput = false     
   } 

  }

   if(validateInput) {

  // Read Current Content and Update it
  var description = document.getElementById("description").value.trim();

  switch(details) {

    case 'BOLD' :
      description = description + ' <b>'+edit_content+'</b> '
      break;

    case 'ITALIC' :
      description = description + ' <i>'+edit_content+'</i> '
      break;

    case 'UNDERLINE' :
      description = description + ' <u>'+edit_content+'</u> '
      break;

    case 'LIST' :
      description = description + ' <li>'+edit_content+'</li> '
      break;

    case 'BLOCKLIST' :
      description = description + ' <blockquote>'+edit_content+'</blockquote> '
      break;

    case 'LINK' :
      description = description + ' <a href="'+edit_link_address+'"><b>'+edit_link_name+'</b></a> '
      break;

    default:
      break;
  }

  document.getElementById("description").value = description
  M.textareaAutoResize($('#description'));

}

}

// Preview Message
function previewMessage() {
  viewModel('Content',nl2br(document.getElementById("description").value.trim()))
}

// -------------------------

// Update MYLIST Section
function updateMyList(data,docid) { 

  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST' 

  let myListData = {}
  
  myListData['UPHOTO'] = data['UPHOTO']
  myListData['UNAME'] = data['UNAME']
  myListData['UUID'] = data['UUID']
  myListData['DATE'] = data['DATE']
  myListData['TITLE'] = data['TITLE']
  myListData['TYPE'] = 'FORUM'
  myListData['CREATEDON'] = data['CREATEDON']
  myListData['SPACE'] = main_path
  myListData['SPACENAME'] = 'POST'

  var url = 'forum/'+main_page+'?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(docid) + '&fl=' + encodeURIComponent('only'); 
  myListData['LINK'] = url


  db.collection(path).doc(docid).set(myListData).then(function() { 
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
    
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('edit');
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

  $('.chips-autocomplete').chips({
    placeholder: 'Enter a Tag',
    secondaryPlaceholder: '+Tag',

    autocompleteOptions: {
      data: convTagsList(),
      limit: Infinity,
      minLength: 1
    }
  });


  M.textareaAutoResize($('#description'));

  $(document).ready(function(){
    $('.tooltipped').tooltip();
  });


}



