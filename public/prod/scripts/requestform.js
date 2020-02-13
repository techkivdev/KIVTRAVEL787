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

var userLoginData = ''

var quotesPath = coll_base_path+'COMMON/QUOTES'

// Global Data variables
// All documents data
var allDocCmpData = {}

// Pkg details
var pkg_data = ''

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

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)
  
  if(status == 'true') {
    userLoginData = getLoginUserData()
   
    // Profile Details
  document.getElementById("name_txt").value = userLoginData['NAME']
  document.getElementById("mobile_txt").value = userLoginData['MOBILE']
  document.getElementById("email_txt").value = userLoginData['EMAIL']

  }

  // Check Package Details
  let pkg_status = getLocalSessionIDStatus('ISPKG')
  displayOutput(pkg_status)

  if(pkg_status  == 'true') {
     pkg_data = getLocalSessionPkgData()
     displayOutput(pkg_data)
     document.getElementById("package_details_sec").style.display = 'block';

     document.getElementById('pkg_img').src = pkg_data['PKG_IMG']
     $("#pkg_hdr").html(pkg_data['PKG_NAME']);
     $("#pkg_extra").html(pkg_data['PKG_EXTRA']);    

     document.getElementById('autocomplete-input-destination').value = pkg_data['PKG_DEST_NAME'].split('#')[0]
     document.getElementById('autocomplete-input-destination').disabled = true

  } else {
    document.getElementById("package_details_sec").style.display = 'none';
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

updateHTMLPage()

checkLoginData()

// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {   
  modifyPageStyle()
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

function submitDetails() {
  displayOutput('Submit All Details ..')

  // Read All Inputs Details
  var destination = document.getElementById("autocomplete-input-destination").value;
  displayOutput('Destination : ' + destination)
  var exploreDest = document.getElementById("exploreDest").checked;
  displayOutput('exploreDest : ' + exploreDest)
  var departurecity = document.getElementById("autocomplete-input-from").value;
  displayOutput('Departure City : ' + departurecity)
  var startdate = document.getElementById("start_date").value;
  displayOutput('Start Date : ' + startdate)
  var enddate = document.getElementById("end_date").value;
  displayOutput('End Date : ' + enddate)

  //let dateOptionsValues = ["","FIXED","FLEXIBLE","ANYTIME"]
  //var dateoptions = dateOptionsValues[document.getElementById("date_options").value];
  var dateoptions = 'FIXED'
  displayOutput('Date Options : ' + dateoptions)

  var user_comment = document.getElementById("user_comment").value;
  displayOutput('User Comment : ' + user_comment)

  var hotelOption = document.getElementById("hotelOption").checked;
  displayOutput('hotelOption : ' + hotelOption)

  var transOption = document.getElementById("transOption").checked;
  displayOutput('transOption : ' + transOption)
  


  var name = document.getElementById("name_txt").value;
  displayOutput('Name : ' + name)
  var mobileno = document.getElementById("mobile_txt").value;
  displayOutput('Mobile Number : ' + mobileno)
  var emailid = document.getElementById("email_txt").value;
  displayOutput('Email ID : ' + emailid)

  // Check all Inputs
  var validation = false

  if((destination != '') && 
  (departurecity != '') &&
  (startdate != '') &&
  (enddate != '') &&
  (dateoptions != '') &&
  (name != '') &&
  (mobileno != '') &&
  (emailid != '')) {

    
    // Check mobile number validation
    var mbcnt = mobileno.length;   
    if(mbcnt == 10){
      validation = true
    } else {
      validation = false
      toastMsg('Please enter 10 digit Mobile Number !!')     
    }

    if(validation) {
    // Check email id
    if(emailid.includes('@') && emailid.includes('.com')){
      validation = true
    } else {
      validation = false
      toastMsg('Your Email ID is not correct !!')
    }
  }

  } else {

    validation = false
    toastMsg('Please fill all fields details !!')

  }


  // Update All Details
  if(validation) {
    displayOutput('All Details are OK.')

    let customedata = {}
    customedata['ID'] =  ''
    customedata['DESTINATION'] =  destination
    customedata['FROM'] = departurecity
    customedata['EXPLORE'] = exploreDest
    customedata['STARTDATE'] = startdate
    customedata['ENDDATE'] = enddate
    customedata['DATEOPTION'] = dateoptions
    customedata['NAME'] = name
    customedata['MOBILENO'] = mobileno
    customedata['EMAILID'] = emailid

    customedata['ADMINSTATUS'] = 'OPEN'
    customedata['ADMINCOMMENT'] = 'NA'
    customedata['FINALMESSAGE'] = 'NA'
    customedata['RESPONSIBLE'] = 'NA'

    customedata['COLLNAME'] = pkg_data['COLLNAME']
    customedata['DOCID'] = pkg_data['DOCID']
    customedata['OWNERID'] = pkg_data['OWNERID']
    customedata['ISREVIEW'] = false

    customedata['USERUUID'] = userLoginData['UUID']
    customedata['USERCOMMENT'] = user_comment
    customedata['USERCANCEL'] = false
    customedata['USERMOOD'] = 'OPEN'
    customedata['USERPHOTO'] = userLoginData['PHOTO']

    // Get Today Date    
    customedata['BOOKINGDATE'] = getTodayDate()
    customedata['VENDORID'] = 'NA'
    customedata['DEALPRICE'] = 'NA'

    customedata['PKGID'] = pkg_data['PKG_ID']
    customedata['DESTID'] = pkg_data['PKG_DEST_ID']
    customedata['PRIORITY'] = 'HIGH'

    // Disscussion Details
    customedata['DISSSTATUS'] = 'OPEN'
    customedata['DISSDATE'] = ''

    // Check Option
    customedata['HOTELOPT'] = hotelOption
    customedata['TRANSOPT'] = transOption

    // Extra Options
    customedata['OPTION1'] = 'NA'
    customedata['OPTION2'] = 'NA'
    customedata['OPTION3'] = 'NA'

    // Extra Parameters
    let extraParm = {}
    extraParm['EXTRA'] = 'NA'
    
    customedata['EXTRAPARM'] = extraParm  

    writeDocument(customedata)

  }

  

}

// Write Document to Database
function writeDocument(data) {    
  
  // Add a new document in collection
  if(first_time_operation) {
    // Update common doc 
    let comdata = {NAME: 'COMMON'};
    let setDoc = db.collection(coll_base_path).doc('COMMON').set(comdata);
  }

  showPleaseWaitModel()
  
  // Add a new document with a generated id.
  let addDoc = db.collection(quotesPath).add(data).then(ref => {
    displayOutput('Added document with ID: ', ref.id);

    updateUserBookingSection(ref.id,data)

    hidePleaseWaitModel()

    document.getElementById("hdr_section").style.display = 'none';
    document.getElementById("col_section_1").style.display = 'none';
    document.getElementById("main_footer_sec").style.display = 'none';
    document.getElementById("col_section_2").style.display = 'block';
  });

}

// Update User Booking Section
function updateUserBookingSection(bookingid,submitdata) {  

  // Check Session Data
  let status = getLoginUserStatus()
  if(status == 'true') {
    let userLoginData = getLoginUserData()
    
    // Profile Details
    let uuid = userLoginData['UUID']

    var userBookingPath = coll_base_path + 'USER/ALLUSER/' + uuid + '/BOOKINGS'

    let data = {
      BOOKINGID: quotesPath+'/' + bookingid,
      DESTINATION: submitdata['DESTINATION'],
      FROM: submitdata['FROM'],
      STARTDATE: submitdata['STARTDATE'],
      ENDDATE: submitdata['ENDDATE'],
      // Common Details
      EXTRA: {
        ADMINSTATUS: submitdata['ADMINSTATUS'],
        FINALMESSAGE: submitdata['FINALMESSAGE']
      }
    };

    // Add a new document with a generated id.
    db.collection(userBookingPath).doc(bookingid).set(data).then(ref => {
   // displayOutput('Added document with ID: ', ref.id);
    displayOutput('User Booking Added !!')
    
  });
 

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

