// *******************************************************************************
// SCRIPT : requestform.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPrivatePath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'LIST_DATA';
var document_ID = 'NA';
var filter = 'NA';
var extra = 'NA';

var userDataPath = coll_base_path + 'USER/ALLUSER'
var quotesPath = coll_base_path + 'COMMON/QUOTES'

// Global Data variables
// All documents data
var allDocCmpData = {}
var current_id = ''

var bookingStatus = ''
var filter_options = 'OPEN'
var filter_date_options = 'NA'
var filter_none = true
var filter_id = false
var filter_email = false
var filter_mobile = false

var filter_input = ''
var filter_date_input = ''

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

 


}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();

  var totaldocCount = 0;

  // Create a query against the collection
  let queryRef = getQueryResult();

  queryRef.get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Record Found !!')
      toastMsg('No Record Found')
      hidePleaseWait();

      // ------ Disable Page --------
      document.getElementById("booking_managment").style.display = 'none';


    } else {

      totaldocCount = querySnapshot.size
      toastMsg(totaldocCount + ' Record Found.')
      var docCount = 0;

      // Read Each Documents
      querySnapshot.forEach((doc) => {
        displayOutput(doc.id);

        allDocCmpData[doc.id] = doc.data()

        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {
          hidePleaseWait();

          // Update HTML Page
          document.getElementById("booking_managment").style.display = 'block';
          updateHTMLPage('NA')
        }

      });

    }

  });

} // EOF

// Perform Query Operation
function getQueryResult() {

  // Create a query against the collection
  let queryRef = ''

  displayOutput(filter_options)
  if (filter_options == 'ALL') {
    queryRef = db.collection(quotesPath);

  } else {
    queryRef = db.collection(quotesPath).where('ADMINSTATUS', '==', filter_options);
  }

  // Other Options
  if (filter_none) {
    // Nothing
  }

  displayOutput(filter_input)

  if (filter_id) {
    queryRef = queryRef.where('ID', '==', filter_input);
  }

  if (filter_email) {
    queryRef = queryRef.where('EMAILID', '==', filter_input);
  }

  if (filter_mobile) {
    queryRef = queryRef.where('MOBILENO', '==', filter_input);
  }

  displayOutput(filter_date_options)

  // Date Options
  if (filter_date_options == 'START_DATE') {
    queryRef = queryRef.where('STARTDATE', '==', filter_date_input);
  }

  if (filter_date_options == 'BOOKING_DATE') {
    queryRef = queryRef.where('BOOKINGDATE', '==', filter_date_input);
  }


  return queryRef

}

// ************************************************
// Validate Admin role first
// ************************************************
function validateAdminRoles() {

  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      displayOutput('User login !!')
      let uuid = user.uid;

      // Check User Doc Exist or Not
      let ref = db.collection(userDataPath).doc(uuid);
      let getDoc = ref.get()
        .then(doc => {

          if (!doc.exists) {
            displayOutput('No such document!');
            validationFailed()

          } else {
            displayOutput('User Data already present.');
            let userData = doc.data()

            // Only for ADMIN and DEV
            if (userData['ROLE'] != 'USER') {
              // Validation Done
              displayOutput('Validation Passed !!')

              readCompleateCollection()
            } else {
              validationFailed()
            }




          }
        })
        .catch(err => {
          displayOutput('Error getting document', err);
          validationFailed()

        });


    } else {
      // User is signed out.
      displayOutput('User logout !!')
      validationFailed()

    }
  }, function (error) {
    displayOutput(error);
    validationFailed()

  });

}

// Validation Failed
function validationFailed() {
  displayOutput('Validation Failed !!')
  hidePleaseWait();

  document.getElementById("col_section_1").style.display = 'none';
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

// ******************************************************
// ADMIN Validation and then 
// Read All Documents from Collection
validateAdminRoles()


// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage(active_id) {

  displayOutput('Update HTML Page ..')

  var allhtmlDetails = ''

  let active = false
  for (eachid in allDocCmpData) {
    var eachData = allDocCmpData[eachid]
    active = false
    if (active_id == eachid) { active = true }
    allhtmlDetails += createBookingCollection(eachid, active, eachData)

  }

  // Update HTML Page
  $("#booking_collection").html(allhtmlDetails);

}

// ----------------------------------------
// --------- Mobile Mode Handling ---------
// ----------------------------------------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    document.getElementById("main_nav_bar").style.display = 'block';
    document.getElementById("main_footer_sec").style.display = 'none';

    document.getElementById("nav_profile").style.display = 'none';  

  } else {
    document.getElementById("main_nav_bar").style.display = 'block';
    document.getElementById("main_footer_sec").style.display = 'block';
  }


}


// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Create card details
function createCard(id, data) {

  // Create Details
  let details = ''

  details += '<div class="left-align">\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  <p>'+ data['DATEOPTION'] + '</p>\
  </div>'


  var cardDetails = '<div class="col s12 m4">\
  <div class="card blue-grey lighten-5">\
    <div class="card-content">\
      <span class="card-title"><b>'+ data['DESTINATION'] + '</b></span>' + details
    + '<br><a onclick="openAdminDialog(\'' + id + '\')" class="waves-effect waves-light btn blue">Manage</a></div> </div></div>'

  return cardDetails

}

// Create Booking Collection
function createBookingCollection(id, active, data) {

  var collectionDetails = ''
  let status = data['ADMINSTATUS']
  let color = 'blue'
  if (status == 'PROGRESS') {
    color = 'orange'
  } else if (status == 'SUCCESS') {
    color = 'green'
  } else if (status == 'OPEN') {
    color = 'blue'
  } else {
    color = 'red'
  }

  if (active) {
    //  Active
    collectionDetails = '<li class="collection-item avatar active">\
  <a href="#!" onclick="openBookingDetails(\'' + id + '\')">\
  <i class="material-icons circle ' + color + '">insert_chart</i>\
  <span class="white-text" class="title"><b>' + data['DESTINATION'] + '</b></span>\
  <p class="white-text">' + data['STARTDATE'] + '</p></a></li>'
  } else {
    // Non- Active
    collectionDetails = '<li class="collection-item avatar">\
  <a href="#!" onclick="openBookingDetails(\'' + id + '\')">\
  <i class="material-icons circle ' + color + '">insert_chart</i>\
  <span class="black-text" class="title"><b>' + data['DESTINATION'] + '</b></span>\
  <p class="black-text">' + data['STARTDATE'] + '</p></a></li>'

  }


  return collectionDetails

}

// Admin Dialog Box
function openAdminDialog(id) {
  displayOutput('Admin Dialog  : ' + id)

  createModel(id, allDocCmpData[id])

}

// Open Booking Details
function openBookingDetails(id) {
  displayOutput('Open Booking Details')

  current_id = id

  document.getElementById("section_2").style.display = 'block';

  // First Update Page
  updateHTMLPage(id)

  var data = allDocCmpData[id]

  // Create Html Content
  // Create Details
  let booking_content = ''
  let quotesContent = ''

  quotesContent += '<div class="left-align">\
  <p class="grey-text">'+ 'Booking ID : ' + id + '</p>\
  <p class="grey-text">'+ 'On : ' + data['BOOKINGDATE'] + '</p>\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  <p>'+ data['DATEOPTION'] + '</p>\
  </div>'


  quotesContent += '<div class="right-align">\
  <b>User Details</b>\
  <p>'+ data['NAME'] + '</p>\
  <p>'+ data['MOBILENO'] + '</p>\
  <p>'+ data['EMAILID'] + '</p>\
  </div> '

  quotesContent += '<div><a onclick="viewUserMessage()" class="waves-effect waves-teal btn-flat blue-text" >View Comments</a><div>'

  quotesContent += '<li class="divider"></li>'

  // Admin Content
  bookingStatus = data['ADMINSTATUS']

  // Update Input Section
  document.getElementById("input_vendor").value = data['VENDORID']
  document.getElementById("input_deal_price").value = data['DEALPRICE']

  $('#admin_comment').val(data['ADMINCOMMENT']);
      M.textareaAutoResize($('#admin_comment'));

      $('#finalmessage_comment').val(data['FINALMESSAGE']);
      M.textareaAutoResize($('#finalmessage_comment'));

  
  document.getElementById("input_pkgid").value = data['PKGID']
  document.getElementById("input_destid").value = data['DESTID']
  document.getElementById("input_priority").value = data['PRIORITY']
  document.getElementById("input_dissstatus").value = data['DISSSTATUS']
  document.getElementById("input_dissdate").value = data['DISSDATE']
  document.getElementById("input_usermood").value = data['USERMOOD']

  let adminContent = ''

  adminContent += '<div class="row"><b>Booking Status : </b><br><!-- Dropdown Trigger -->\
  <a id="booking_status_btn" class="dropdown-trigger btn green" href="#" data-target="booking_status_drop" style="width:250px">'+ data['ADMINSTATUS'] + '</a>\
  <!-- Dropdown Structure -->\
  <ul id="booking_status_drop" class="dropdown-content">\
    <li><a onclick="changeBookingStatus(\'' + 'OPEN' + '\')" >OPEN</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'PROGRESS' + '\')" >PROGRESS</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'SUCCESS' + '\')" >SUCCESS</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'COMPLETE' + '\')" >COMPLETE</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'CANCEL' + '\')" >CANCEL</a></li>\
    <li class="divider" tabindex="-1"></li>\
    <li><a onclick="changeBookingStatus(\'' + 'DELETED' + '\')" class="red-text">DELETED</a></li>\
    </ul><br>'

  adminContent += '<br><div class="right-align"><a onclick="updateBookingStatus(\'' + id + '\')" class="waves-effect waves-light btn blue" style="width:150px">Update</a><div>'

  adminContent += '<br><div class="right-align"><a onclick="deleteBooking(\'' + id + '\')" class="waves-effect waves-light btn red" style="width:150px">delete booking</a><div>'

  adminContent += '</div>'

  booking_content = quotesContent + adminContent


  // Update HTML Page
  $("#booking_title").html('<b>' + data['DESTINATION'] + '</b>');
  $("#header_content").html(quotesContent);
  $("#footer_content").html(adminContent);

  $('.dropdown-trigger').dropdown();



}

// VIew User Message In Model
function viewUserMessage() {

  displayOutput(current_id)

  let comment = ''
  comment += '<h5><b>User Comment</b></h5>'+allDocCmpData[current_id]['USERCOMMENT']

  comment += '<br><br><li class="divider" tabindex="-1"></li><h5 class="red-text"><b>Admin Comment</b></h5>'+allDocCmpData[current_id]['ADMINCOMMENT']

  comment += '<br><br><li class="divider" tabindex="-1"></li><h5 class ="green-text"><b>Final Message</b></h5>'+allDocCmpData[current_id]['FINALMESSAGE']


  viewModel('Comment',comment)

}


// Create Model
function createModel(id, data) {

  let mdlhdr = 'Manage Quote'

  // Create Details
  let quotesContent = ''

  quotesContent += '<div class="left-align">\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  <p>'+ data['DATEOPTION'] + '</p>\
  </div>'


  quotesContent += '<div class="right-align">\
  <b>User Details</b>\
  <p>'+ data['NAME'] + '</p>\
  <p>'+ data['MOBILENO'] + '</p>\
  <p>'+ data['EMAILID'] + '</p>\
  </div>'

  // Admin Content
  bookingStatus = data['ADMINSTATUS']

  let adminContent = '<br><br><h5>Select Booking Status : </h5><!-- Dropdown Trigger -->\
  <a id="booking_status_btn" class="dropdown-trigger btn" href="#" data-target="booking_status_drop">'+ data['ADMINSTATUS'] + '</a>\
  <!-- Dropdown Structure -->\
  <ul id="booking_status_drop" class="dropdown-content">\
    <li><a onclick="changeBookingStatus(\'' + 'OPEN' + '\')" >OPEN</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'PROGRESS' + '\')" >PROGRESS</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'SUCCESS' + '\')" >SUCCESS</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'COMPLETE' + '\')" >COMPLETE</a></li>\
    <li><a onclick="changeBookingStatus(\'' + 'CANCEL' + '\')" >CANCEL</a></li>\
    <li class="divider" tabindex="-1"></li>\
    <li><a onclick="changeBookingStatus(\'' + 'DELETED' + '\')" >DELETED</a></li>\
    </ul>'

  adminContent += '<a onclick="updateBookingStatus(\'' + id + '\')" class="waves-effect waves-light btn blue">Update</a>'



  let mdlContnt = ''

  mdlContnt = '<div class="row">\
  <div class="col s6">\
    <ul class="tabs tabs-fixed-width tab-demo z-depth-1">\
      <li class="tab col s3"><a class="active" href="#quote">Quote</a></li>\
      <li class="tab col s3"><a href="#admin">Admin</a></li></ul>\
  </div>\
  <div id="quote" class="col s12">'+ quotesContent + '</div>\
  <div id="admin" class="col s12">'+ adminContent + '</div>\
  </div>'




  var model = '<!-- Modal Structure -->\
<div id="adminmodel" class="modal modal-fixed-footer">\
  <div class="modal-content">\
    <h4>'+ mdlhdr + '</h4>\
    <p>'+ mdlContnt + '</p>\
  </div>\
  <div class="modal-footer">\
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
  </div>\
</div>'


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $('.dropdown-trigger').dropdown();

  $('#adminmodel').modal('open');


}

// Change Booking Status
function changeBookingStatus(status) {
  //displayOutput(status)
  $("#booking_status_btn").html(status);

  bookingStatus = status

}

// Update Booking Status
function updateBookingStatus(id) {

  displayOutput('Update : ' + id)

  var userBookingPath = coll_base_path + 'USER/ALLUSER/' + allDocCmpData[id]['USERUUID'] + '/BOOKINGS'

  var admin_comment = document.getElementById("admin_comment").value;
  var input_vendor = document.getElementById("input_vendor").value;
  var input_deal_price = document.getElementById("input_deal_price").value;
  var finalmessage_comment = document.getElementById("finalmessage_comment").value;

  var input_pkgid = document.getElementById("input_pkgid").value
  var input_destid = document.getElementById("input_destid").value
  var input_priority = document.getElementById("input_priority").value
  var input_dissstatus = document.getElementById("input_dissstatus").value
  var input_dissdate = document.getElementById("input_dissdate").value
  var input_usermood = document.getElementById("input_usermood").value


  db.collection(quotesPath).doc(id).update({
    ID: id,
    ADMINSTATUS: bookingStatus,
    ADMINCOMMENT: admin_comment,
    VENDORID: input_vendor,
    DEALPRICE: input_deal_price,
    FINALMESSAGE: finalmessage_comment,
    USERCANCEL: true,
    PKGID: input_pkgid,
    DESTID: input_destid,
    PRIORITY: input_priority,
    DISSSTATUS: input_dissstatus,
    DISSDATE: input_dissdate,
    USERMOOD: input_usermood,




  }).then(function () {
    displayOutput("STATUS details Updated ..");
    

    allDocCmpData[id]['ADMINSTATUS'] = bookingStatus
    allDocCmpData[id]['ADMINCOMMENT'] = admin_comment
    allDocCmpData[id]['VENDORID'] = input_vendor
    allDocCmpData[id]['DEALPRICE'] = input_deal_price
    allDocCmpData[id]['FINALMESSAGE'] = finalmessage_comment

    allDocCmpData[id]['PKGID'] = input_pkgid
    allDocCmpData[id]['DESTID'] = input_destid
    allDocCmpData[id]['PRIORITY'] = input_priority
    allDocCmpData[id]['DISSSTATUS'] = input_dissstatus
    allDocCmpData[id]['DISSDATE'] = input_dissdate
    allDocCmpData[id]['USERMOOD'] = input_usermood

    // Update User Section also

    db.collection(userBookingPath).doc(id).update({
      EXTRA: {
        ADMINSTATUS: bookingStatus,
        FINALMESSAGE: finalmessage_comment
      }  
    }).then(function () {
      displayOutput("User STATUS details Updated ..");
      toastMsg('Status updated !!')
    });




  });

}

// Filter Operation
function filterOperation() {
  displayOutput('Filter Operation ..')

  let dateOptionsValues = ["OPEN", "ALL", "OPEN", "PROGRESS", "SUCCESS", "COMPLETE", "CANCEL", "DELETED"]
  filter_options = dateOptionsValues[document.getElementById("filter_state_options").value];
  displayOutput('Filter Options : ' + filter_options)

  // Get Other Options Details
  filter_none = document.getElementById("filter_none").checked
  filter_id = document.getElementById("filter_id").checked
  filter_email = document.getElementById("filter_email").checked
  filter_mobile = document.getElementById("filter_mobile").checked

  filter_input = document.getElementById("filter_input").value

  // Date Options
  let filterDateOptionsValues = ["NA", "START_DATE", "BOOKING_DATE", "NA"]
  filter_date_options = filterDateOptionsValues[document.getElementById("filter_date_options").value];

  filter_date_input = document.getElementById("input_date").value

  document.getElementById("section_2").style.display = 'none';

  // Update complete page
  allDocCmpData = {}

  readCompleateCollection()


}

// RESET Filter operation
function resetfilterOperation() {

  location.reload();

}

// Referesh Section
function refereshSection() {

  document.getElementById("section_2").style.display = 'none';

  // Update complete page
  allDocCmpData = {}

  readCompleateCollection()

}

// DELETE Booking
function deleteBooking(id) {
  displayOutput('Delete Booking  : ' + id)

  let stage = allDocCmpData[id]['ADMINSTATUS']

  var userBookingPath = coll_base_path + 'USER/ALLUSER/' + allDocCmpData[id]['USERUUID'] + '/BOOKINGS'

  if (stage == 'DELETED') {
    db.collection(quotesPath).doc(id).delete().then(function () {
      displayOutput("Document Main Deleted !!");

      // Delete From User Side also
      db.collection(userBookingPath).doc(id).delete().then(function () {
        displayOutput("Document User Deleted !!");


        toastMsg('Booking Deleted !!')


        // Update complete page
        allDocCmpData = {}

        readCompleateCollection()

      });




    });

  } else {
    toastMsg('First you have change booking stage to : DELETED.')
  }




}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function () {
    $('.collapsible').collapsible();
  });

  $(document).ready(function () {
    $('select').formSelect();
  });

  $(document).ready(function () {
    $('.datepicker').datepicker();
  });

  $(document).ready(function () {
    $('.tabs').tabs();
  });

}

