// *******************************************************************************
// SCRIPT : login.js
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

// Global Variables
let userData = {}
var userDataPath = coll_base_path + 'USER/ALLUSER'
var uuid = ''
var allDocCmpData = {}

var bookingData = ''
var cancelDetails = ''
var signinpopup = 'popup'

// Startup Call
startupcalls()

// Mobile mode handling
mobileModeStartupHandling()

modifyPageStyle()

// ----------------------------------------
// --------- Mobile Mode Handling ---------
// ----------------------------------------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    document.getElementById("main_nav_bar").style.display = 'none';
    document.getElementById("main_nav_bar_mb").style.display = 'none';    

    document.getElementById("main_footer_sec").style.display = 'none';
    signinpopup = 'default'

  } else {   
    document.getElementById("main_nav_bar").style.display = 'block';
    document.getElementById("main_nav_bar_mb").style.display = 'block';

    document.getElementById("main_footer_sec").style.display = 'block';
  }


}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!') 
    document.getElementById("profile_content_section").style.margin = "0px 0px 0px 0px";

  } else {
    displayOutput('Mobile Browser Not found!') 

  }

}


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

// Firebase Auth Configuration
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.     

      authDetails()
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect. signInFlow: 'popup'
  signInFlow: signinpopup,
  signInSuccessUrl: 'login.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: 'terms_and_conditions.html',
  // Privacy policy url.
  privacyPolicyUrl: 'privacy_police.html'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



// ===========================================================
// Collect user details after sign in complete 
// ===========================================================
function authDetails() {
  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {

      displayOutput('User login !!')

      //document.getElementById("main_profile_section").style.display = 'block';
      document.getElementById("login_header_section").style.display = 'none';
      document.getElementById("spinner").style.display = 'block';

      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      uuid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      user.getIdToken().then(function (accessToken) {

        // User Data        
        userData['NAME'] = displayName
        userData['EMAIL'] = email
        userData['UUID'] = uuid
        userData['PHOTOURL'] = photoURL
        userData['ROLE'] = 'USER'
        userData['MOBILE'] = ''
        userData['BIO'] = ''
        userData['NICKNAME'] = ''  
        userData['EXTRA'] = {
          CONFIG: 'NA'
        }      

        // Update User Details into Database
        updateUserDetails(uuid, userData)
      });
    } else {
      // User is signed out.

      displayOutput('User logout !!')
      localStorageData('ISUSER',false)
      document.getElementById("main_profile_section").style.display = 'none';
      document.getElementById("footer_sec").style.display = 'none';
      document.getElementById("login_header_section").style.display = 'block';
      document.getElementById("spinner").style.display = 'none';

    }
  }, function (error) {
    displayOutput(error);
  });
};


// =============================================================
// Sign Out User 
// =============================================================
function signout() {
  auth.signOut().then(function () {
    // Sign-out successful.
    displayOutput('Signout Sucess..')
    toastMsg('Logout Done !!')
    
    localStorageData('ISUSER',false)

  }).catch(function (error) {
    // An error happened.
  });

}

// ==============================================================
// Update User Details into Database
// ==============================================================
function updateUserDetails(uuid, userdata) {

  // Check User Doc Exist or Not
  let ref = db.collection(userDataPath).doc(uuid);
  let getDoc = ref.get()
    .then(doc => {

      if (!doc.exists) {
        displayOutput('No such document!');
        displayOutput('Create New User Doc.');

        // ----- Remove later --------
        // Add a new document in collection
        if(first_time_operation) {
          db.collection(coll_base_path).doc('USER').set({
            NAME: 'USER'
          });
        }

        // Create new user data doc
        db.collection(userDataPath).doc(uuid).set(userdata).then(function () {
          displayOutput("User Data Updated !!");

          toastMsg('Your profile created !!')

          // Update HTML Page
          updateHTMLPage()

        });


      } else {
        displayOutput('User Data already present.');

        userData = doc.data()

        updateHTMLPage()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
    });




}

// Update Session Data
function updateSessionData() {
  // Update Session Data
  localStorageData('ISUSER',true)
  localStorageData('UUID',userData['UUID'])
  localStorageData('NAME',userData['NAME'])
  localStorageData('EMAIL',userData['EMAIL'])
  localStorageData('MOBILE',userData['MOBILE'])
  localStorageData('ROLE',userData['ROLE']) 
  
  displayOutput('Session Data Updated ...')
}


// ==============================================================
// Update Complete HTML Page
// ==============================================================
function updateHTMLPage() {
  displayOutput('Update HTML Page ..')

  displayOutput(userData)

  updateSessionData()

  collectBookingDetails()

  // Create User Content
  let user_content = '<h3>' + userData['NAME'] + '</h3>\
                       <h5 class="grey-text">' + userData['EMAIL'] + '</h5>\
                       <h5  class="grey-text">' + userData['MOBILE'] + '</h5>'

  $("#user_content").html(user_content)

  document.getElementById("user_profile_image").src = userData['PHOTOURL']

  // Profile Details
  document.getElementById("user_name").value = userData['NAME']
  document.getElementById("user_email").value = userData['EMAIL']
  document.getElementById("user_mobile").value = userData['MOBILE']


  document.getElementById("spinner").style.display = 'none';
  document.getElementById("main_profile_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';


  // Update Admin Options
  // List Details
  let dev_role = '<br>\
  <h5>Admin Options</h5>\
    <div class="collection">\
        <a href="#!" class="collection-item">User Managment</a>\
        <a href="managedetails.html" class="collection-item blue-text">Booking Managment</a>\
        <a href="project_settings.html" class="collection-item red-text">Content Managment</a>\
        <a href="../dev/index.html" class="collection-item red-text">Development Url</a> </div>\
   </div>'

  let admin_role = '<br>\
  <h5>Admin Options</h5>\
    <div class="collection">\
        <a href="#!" class="collection-item">User Managment</a>\
        <a href="managedetails.html" class="collection-item blue-text">Booking Managment</a>\
        <a href="project_settings.html" class="collection-item red-text">Content Managment</a> </div>\
  </div>'

  if (userData['ROLE'] != 'USER') {

    let adminOptions = ''

    if(userData['ROLE'] == 'DEV') {
      adminOptions = dev_role
    } else if(userData['ROLE'] == 'ADMIN') {
      adminOptions = admin_role
    }   

    $("#admin_options").html(adminOptions)
  }



}


// ==================================================================
// Start up Calls 
// ==================================================================
function startupcalls() {

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $(document).ready(function () {
    M.updateTextFields();
  });

}


// ==================================================================
// Update and Save Profile Data
// ==================================================================
function saveprofiledata() {
  displayOutput('Save Profile Data ...')

  showPleaseWaitModel()

  displayOutput(userData)

  var mobileno = document.getElementById("user_mobile").value;
  displayOutput('Mobile Number : ' + mobileno)

  if(isStrEmpty(mobileno)) {
    validation = true
  } else {
  // Check mobile number validation
  var mbcnt = mobileno.length;
  if (mbcnt != 10) {
    validation = false
    hidePleaseWaitModel()
    toastMsg('Your mobile number is not correct !!')
  } else {
    validation = true
  }
}



  if (validation) {
    userData['MOBILE'] = mobileno

    db.collection(userDataPath).doc(uuid).update({
      MOBILE: mobileno
    }).then(function () {
      displayOutput("Mobile details Updated ..");
      hidePleaseWaitModel()

      toastMsg('Profile Updated !!')

      // Update Session Data Also
      localStorageData('MOBILE',mobileno)


    });

  }

}


// =================================================================
// Collect Bookings Details
// =================================================================
function collectBookingDetails() {

  var userBookingPath = coll_base_path + 'USER/ALLUSER/' + uuid + '/BOOKINGS'

  var totaldocCount = 0;

  db.collection(userBookingPath).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Record Found !!')

      // Show No Booking Details
      let emptyMsg= '<div class="row" style="margin-top:1%;"><div class="col s12"><div class="card" style="border-radius: 25px;">\
      <div class="red-card-content white-text z-depth-2" style="border-radius: 25px 25px 0px 0px; height: 100px;">\
      <p class="card-content" style="font-size: 40px;">Booking</p>\
      </div><div class="card-content"><div class="row">\
      <h5 class="grey-text">No Booking.</h5>\
      </div></div></div></div></div>'

      $("#user_bookings").html(emptyMsg);
      
    } else {

      totaldocCount = querySnapshot.size
      var docCount = 0;

      // Read Each Documents
      querySnapshot.forEach((doc) => {
        displayOutput(doc.id);

        allDocCmpData[doc.id] = doc.data()

        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {         

          // Update HTML Page
          updateBookingHTMLPage()
        }

      });

    }

  });

}

function updateBookingHTMLPage() {
  displayOutput('Update Booking Page ..')

  var allCardDetails = ''

  for (eachid in allDocCmpData) {
    var eachData = allDocCmpData[eachid]
    allCardDetails += createCard(eachid, eachData)
    //displayOutput(eachData)
  }

  // Update HTML Page
  $("#user_bookings").html(allCardDetails);


}

// Create card details
function createCard(id, data) {

  // Create Details
  let details = ''

  let status = data['EXTRA']['ADMINSTATUS']

  let carb_back_color = 'blue-card-content'

  if(status == 'CANCEL') {
    carb_back_color = 'red-card-content'
  } else if(status == 'SUCCESS') {
    carb_back_color = 'green-card-content'
  }
  

  details += '<div class="left-align ' + carb_back_color + '  white-text z-depth-2" style="border-radius: 25px 25px 0px 0px;">\
  <div class="card-content">\
  <div class="right-align"><b style="font-size: 20px;">' + data['EXTRA']['ADMINSTATUS']+ '</b></div>\
  <div class="row" style="margin-left:10%;">\
  <div class="col s12 m3"><b style="font-size: 30px;">'+ data['FROM'] + '</b><p>'+ data['STARTDATE'] + '</p></div>\
  <div class="col s12 m3" style="margin-top: 20px;"><i class="material-icons circle white black-text" style="font-size: 40px;">chevron_right</i></div>\
  <div class="col s12 m3"><b style="font-size: 30px;">'+ data['DESTINATION'] + '</b><p>'+ data['ENDDATE'] + '</p></div>\
  </div>\
  </div></div>'

  details += '<div class="card-content"><b class="grey-text">Message</b><p>' + data['EXTRA']['FINALMESSAGE']+ '</p>\</div>'


  var cardDetails = '<div class="col s12 m12">\
  <div class="card" style="border-radius: 25px;">\
    <div>\
      ' + details

      if(data['EXTRA']['ADMINSTATUS'] != 'CANCEL') {
        //cardDetails += '<div class="card-content"><a onclick="openViewDialog(\'' + id + '\')" class="waves-effect waves-light btn blue">View</a></div>'
        
        cardDetails += '<div class="card-content right-align"><a href="#!" onclick="openViewDialog(\'' + id + '\')"><i class="material-icons circle blue white-text z-depth-2" style="font-size: 40px;">arrow_drop_down</i></a></div>'
     
      }

      cardDetails += '</div> </div></div>'
    
  return cardDetails

}


// Open Booking Details in Model
function openViewDialog(id) {
  displayOutput(id)
   
  let quotPath = allDocCmpData[id]['BOOKINGID']

  
  // Read Data from DB
  let docRef = db.doc(quotPath);
  docRef.get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');

      viewModel('Message','No Details Found !!')
    } else {
      displayOutput('Document data');

      // Show Complete Details

      let data = doc.data()
      bookingData = data

      // Create Content
      let mdlContent = ''   
     

     // mdlContent += '<br><b class="grey-text">Message to You</b><p>' + data['FINALMESSAGE'] + '</p><br>'

     let status = data['ADMINSTATUS']

     let carb_back_color = 'blue-card-content'
   
     if(status == 'CANCEL') {
       carb_back_color = 'red-card-content'
     } else if(status == 'SUCCESS') {
       carb_back_color = 'green-card-content'
     }

     // User Explore Option
     let userExploreOption = 'I do not want to explore Destination'
     if(data['EXPLORE']) {userExploreOption = 'I want to explore Destination'}

     // User content
     let userContent = '<p class="grey-text">' + userExploreOption + '</p>\
     <p>' + data['NAME']+ '</p>\
     <p>' + data['MOBILENO']+ '</p>\
     <p>' + data['EMAILID']+ '</p>\
     '

     // Create Card
     let details = '<div class="left-align ' + carb_back_color + '  white-text z-depth-2">\
     <div class="card-content">\
     <div class="right-align"><b style="font-size: 20px;">' + data['ADMINSTATUS']+ '</b></div>\
     <div class="row">\
     <div class="col s12 m3"><b style="font-size: 30px;">'+ data['FROM'] + '</b><p>'+ data['STARTDATE'] + '</p></div>\
     <div class="col s12 m3" style="margin-top: 20px;"><i class="material-icons circle white black-text" style="font-size: 40px;">chevron_right</i></div>\
     <div class="col s12 m3"><b style="font-size: 30px;">'+ data['DESTINATION'] + '</b><p>'+ data['ENDDATE'] + '</p></div>\
     </div>\
     <div class="left-align">'+ userContent +'\
     </div></div></div>'

     details += '<div class="card-content"><div class="row">\
     <div class="input-field col s12">\
         <i class="material-icons prefix blue-text">message</i>\
         <textarea value="'+ data['USERCOMMENT'] + '" id="user_comment" class="materialize-textarea" data-length="300"></textarea>\
         <label class="active" for="user_comment">Your Comment</label>\
       </div>'

       details += '<div class="right-align"><a onclick="updateBooking(\'' + id + '#' + quotPath + '\')" class="waves-effect waves-teal btn blue rcorners">Update</a></div>'

       details += '</div>'

    

       details += '<br><br><div class="left-align"><a onclick="validateCancelBooking(\'' + id + '#' + quotPath + '\')" class="waves-effect waves-teal btn red rcorners">Cancel Booking</a></div>'
       details += '<div class="right-align"><a onclick="closeModel()" class="waves-effect waves-teal btn black white-text rcorners">Close</a></div>'


       details += '</div></div>'

     mdlContent += '<div class="col s12 m12">\
     <div class="card">\
       <div>\
         ' + details

         mdlContent += '</div> </div></div>'    

    
    
      // Display in model
      viewModelCustom('',mdlContent)

      $('#user_comment').val(data['USERCOMMENT']);
      M.textareaAutoResize($('#user_comment'));


    }
  })
  .catch(err => {
    displayOutput('Error getting document');
    viewModel('Message','No Details Found !!')
  }); 


}


// Cancel Booking
function cancelBooking() {
  
  let id = cancelDetails.split('#')[0]
  let quotePath = cancelDetails.split('#')[1]

  displayOutput(id)
  var userBookingPath = coll_base_path + 'USER/ALLUSER/' + uuid + '/BOOKINGS'
  
  let status = true

  if(status) {

     // Update User Section also
     db.collection(userBookingPath).doc(id).update({
      EXTRA: {
        ADMINSTATUS: 'CANCEL',
        FINALMESSAGE: bookingData['FINALMESSAGE']
      }  
    }).then(function () {
      displayOutput("Updated user booking..");
  
      // Update Status in main Booking also

      db.doc(quotePath).update({
          ADMINSTATUS: 'CANCEL',
          USERCANCEL: true
      }).then(function () {
        displayOutput("Main booking ..");
        toastMsg('You booking has been canceled !!')

        askNO()

        allDocCmpData[id]['BOOKINGID'] = 'CANCEL'

        location.reload();

      });      

    });


  } else {
    displayOutput("Admin has disabled Booking Cancel Process !!")
    askNO()
  }

}

// Validate Cancel Booking
function validateCancelBooking(details) {

  closeModel()

  cancelDetails = details

  let id = cancelDetails.split('#')[0]
  let quotePath = cancelDetails.split('#')[1]

   // Open Ask Dialog
  askModel('red-card-content','Cancel Booking','Are you sure you want to cancel your Booking.<br>Booking Ref. Number : '+id,'cancelBooking')

}


// Update Booking
function updateBooking(details) {

  let id = details.split('#')[0]
  let quotePath = details.split('#')[1]

  var user_comment = document.getElementById("user_comment").value;
  displayOutput('User Comment : ' + user_comment)

  // Update Status in main Booking also

  db.doc(quotePath).update({
      USERCOMMENT: user_comment
  }).then(function () {
    displayOutput("Main booking ..");
    toastMsg('You booking has been Updated !!')
  });

  


}

// Open Bookmark details
function openBookmark() {

  let content = '<ul class="collection">'

  // Get Bookmark Details    
  showPleaseWaitModel()

    db.collection(userDataPath+'/'+uuid+'/BOOKMARK').get().then((querySnapshot) => {
      displayOutput("SIZE : " + querySnapshot.size);
  
      if (querySnapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Record Found !!')
        hidePleaseWaitModel()    
        viewModel('My Wishlist','<h1>Empty List</h1>'); 
  
      } else {
  
        totaldocCount = querySnapshot.size
        var docCount = 0;
  
        // Read Each Documents
        querySnapshot.forEach((doc) => {
          let mark_data = doc.data()
          displayOutput(mark_data);

         // content += '<a href="eachdetails.html?detail1='+mark_data['COLLNAME']+'&detail2='+mark_data['DOCID']+'&detail3=NA" class="collection-item">'+ mark_data['DETAILS'].split('#')[1] +'</a>'
         let link = 'eachdetails.html?detail1='+mark_data['COLLNAME']+'&detail2='+mark_data['DOCID']+'&detail3=NA'
         let markname = mark_data['DETAILS'].split('#')[1]
         let markid = mark_data['DETAILS'].split('#')[0]       

         
          content += '<li class="collection-item avatar">\
          <a href="'+link+'"><i class="material-icons circle green">open_in_new</i></a>\
          <span class="title"><b>'+markname+'</b></span>\
          <p>'+markid+'</p>\
          <a href="#!" onclick="removeBookmark(\'' + doc.id  + '\')" class="secondary-content"><i class="material-icons">delete</i></a>\
        </li>'  

          // Check Document count
          docCount++;
          if (totaldocCount == docCount) {
           
           hidePleaseWaitModel()
           content += '</ul>'
           viewModel('My Wishlist',content); 

          }
  
        }); 
        
  
      }
  
    });

}

// Remove Bookmark
function removeBookmark(details) {
    displayOutput(details)

    db.collection(userDataPath+'/'+uuid+'/BOOKMARK').doc(details).delete().then(function () {
      displayOutput("Bookmark Deleted !!");  

      closeModel()
      openBookmark()
    });


}