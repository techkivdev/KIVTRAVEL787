// *******************************************************************************
// SCRIPT : eachdetails.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = basePath
var coll_base_path_P = basePrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPath
  coll_base_path_P = baseProductionPrivatePath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';

// ----------- Update Collection -----------------
var coll_name = 'PLACES';
// -----------------------------------------------

var document_ID = 'NA';
var filter = 'NA';

// Global Data variables
// All documents data
var allDocCmpData = {}

// Mapping Data
var mainDocMapDetails = {}
var docMapDetails = {}

// Page Content
var pageContent = {}

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

  // ------- Update Variables ------------
  if ('id' in params) {
    document_ID = params['id'];
    filter = params['fl'];
  }

  displayOutput(document_ID + ' , ' + filter)


}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();

  var totaldocCount = 0;

  db.collection(coll_base_path + coll_lang + '/' + coll_name).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Record Found !!')
      hidePleaseWait();

    } else {

      totaldocCount = querySnapshot.size
      var docCount = 0;

      // Read Each Documents
      querySnapshot.forEach((doc) => {
        displayOutput(`${doc.id} =>`, doc.data());

        allDocCmpData[doc.id] = doc.data()

        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {
          hidePleaseWait();
        }

      });

      // Update HTML Page
      updateHTMLPage();

    }

  });

} // EOF


// Read Document Data in async mode
async function readDocumentDataAsync(docID) {

  showPleaseWait()

  displayOutput('DB : ' + coll_base_path)

  await db.collection(coll_base_path + coll_lang + '/' + coll_name + '_DATA').doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()

      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
      displayOutput(err)

      hidePleaseWait()
    });


  // ------------- Read MAIN Document --------------
  await db.collection(coll_base_path + coll_lang + '/' + coll_name + '_DATA').doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()

      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        // Update Mapping Data set        
        updateMappingDetails(docID)



        hidePleaseWait()

        updateHTMLPage()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
      displayOutput(err)

      hidePleaseWait()
    });

}

// Check startup validation
function checkStartupValidation() {

  // Check Session Data
  let status = getLoginUserStatus()

  // Check Production Mode
  if (is_production_mode) {

    // Check User Mode to read Dev Publish Section
    if (status == 'true') {

      let userLoginData = getLoginUserData()
      if (userLoginData['ROLE'] == 'ADMIN' || userLoginData['ROLE'] == 'DEV') {
        displayOutput('Change Publish Mode from Production to Development.')
        check_dev_publish_content = false
        coll_base_path = basePath
        $('#role_message').html('KivTech Development Publish')

        readDocumentDataAsync(document_ID)
      } else {
        readDocumentDataAsync(document_ID)
      }


    } else {

      readDocumentDataAsync(document_ID)
    }

  } else {

    if (status == 'true') {
      let userLoginData = getLoginUserData()
      if (userLoginData['ROLE'] == 'DEV') {
        displayOutput('Change Publish Mode from Production to Development.')
        check_dev_publish_content = false
        coll_base_path = basePath
        $('#role_message').html('KivTech Development Publish,DEV MODE')

        readDocumentDataAsync(document_ID)
      }
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

// Read All Documents from Collection
//readCompleateCollection();

// Async Mode
checkStartupValidation()
//readDocumentDataAsync(document_ID)

// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {

  displayOutput(allDocCmpData)
  displayOutput(mainDocMapDetails)
  displayOutput(docMapDetails)

  // Modify Page Style
  modifyPageStyle()

  // HTML Modification functions   
  document.getElementById("col_section_1").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';
  document.getElementById("header_section").style.display = 'block';


  genHTMLContentType()

}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!')

    document.getElementById('main_list_container').className = "container-fluid row";

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

// Show Details in Model
// Show Review Details
function viewReviewDetails() {
  viewModel('All Review', 'All Review Content')
}

// Show Overview details
function viewOverview() {
  viewModel('Overview', getInfoDetails("Description"))
}


// *******************************************************
// --------------- Mapping Functions ---------------------
// Generate Map function from Collection Options
// Paste complete code here
// Format code using shift+alt+F

// <<<<<<<<<<<<<<<<<< CODE SECTION START >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails(docID) {
  if ("MAIN" in allDocCmpData) {
    mainDocMapDetails["ID"] = allDocCmpData["MAIN"]["INFO0"]
    mainDocMapDetails["NAME"] = allDocCmpData["MAIN"]["INFO1"]
    mainDocMapDetails["DESC"] = allDocCmpData["MAIN"]["INFO2"]
    mainDocMapDetails["VISIBLE"] = allDocCmpData["MAIN"]["INFO3"]
    mainDocMapDetails["OWNER"] = allDocCmpData["MAIN"]["INFO4"]
    mainDocMapDetails["LINKS"] = allDocCmpData["MAIN"]["INFO5"]
    mainDocMapDetails["TDOC"] = allDocCmpData["MAIN"]["INFO6"]
    mainDocMapDetails["ADMIN"] = allDocCmpData["MAIN"]["INFO7"]
    mainDocMapDetails["IMAGE_TAB"] = allDocCmpData["MAIN"]["INFO8"]
    mainDocMapDetails["MULTI_TAB"] = allDocCmpData["MAIN"]["INFO9"]
    mainDocMapDetails["FORM_TAB"] = allDocCmpData["MAIN"]["INFO10"]
    mainDocMapDetails["COLL_DOC"] = allDocCmpData["MAIN"]["INFO11"]
    mainDocMapDetails["DOC_PBLS"] = allDocCmpData["MAIN"]["INFO12"]
    mainDocMapDetails["DOC_LIST"] = allDocCmpData["MAIN"]["INFO13"]
    mainDocMapDetails["DEF_IMG"] = allDocCmpData["MAIN"]["INFO14"]
    mainDocMapDetails["LIST_REF_INFO"] = allDocCmpData["MAIN"]["INFO15"]
    mainDocMapDetails["IMAGE_INFO"] = allDocCmpData["MAIN"]["INFO16"]
    mainDocMapDetails["IMAGE_PRO_INFO"] = allDocCmpData["MAIN"]["INFO17"]
    mainDocMapDetails["MULTI_INFO"] = allDocCmpData["MAIN"]["INFO18"]
    mainDocMapDetails["FORM_INFO"] = allDocCmpData["MAIN"]["INFO19"]
    mainDocMapDetails["COMMON_DATA"] = allDocCmpData["MAIN"]["INFO20"]
  } else {
    displayOutput("MAIN Doc details is not found !!")
  }





  if (docID in allDocCmpData) {
    docMapDetails["id"] = allDocCmpData[docID]["INFO0"]
    docMapDetails["timings"] = allDocCmpData[docID]["INFO10"]
    docMapDetails["tips"] = allDocCmpData[docID]["INFO11"]
    docMapDetails["places_details"] = docID + "#INFO22"
    docMapDetails["packages_list"] = docID + "#INFO23"
    docMapDetails["config"] = allDocCmpData[docID]["INFO24"]
    docMapDetails["country"] = allDocCmpData[docID]["INFO25"]
    docMapDetails["state"] = allDocCmpData[docID]["INFO26"]
    docMapDetails["district"] = allDocCmpData[docID]["INFO27"]
    docMapDetails["filter"] = allDocCmpData[docID]["INFO28"]
    docMapDetails["name"] = allDocCmpData[docID]["INFO3"]
    docMapDetails["desc"] = allDocCmpData[docID]["INFO4"]
    docMapDetails["description"] = allDocCmpData[docID]["INFO5"]
    docMapDetails["quick"] = allDocCmpData[docID]["INFO6"]
    docMapDetails["map"] = allDocCmpData[docID]["INFO7"]
    docMapDetails["reach"] = allDocCmpData[docID]["INFO8"]
    docMapDetails["fees"] = allDocCmpData[docID]["INFO9"]

    // MAP Development and Production Image correctly .....
    if (check_dev_publish_content) {

      // IMAGES Production Information

      docMapDetails["image1"] = docID + "#INFO13"
      docMapDetails["image2"] = docID + "#INFO15"
      docMapDetails["image3"] = docID + "#INFO17"
      docMapDetails["image4"] = docID + "#INFO19"
      docMapDetails["model"] = docID + "#INFO21"

    } else {
      // IMAGES Information

      docMapDetails["image1"] = docID + "#INFO12"
      docMapDetails["image2"] = docID + "#INFO14"
      docMapDetails["image3"] = docID + "#INFO16"
      docMapDetails["image4"] = docID + "#INFO18"
      docMapDetails["model"] = docID + "#INFO20"

    }
  } else {
    displayOutput(docID + " Data not found !!")
  }

}
//**************** END ***************************

// <<<<<<<<<<<<<<<<< CODE SECTION END >>>>>>>>>>>>>>>>>>>>>

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// --------- Update Model Content ------------------------------- 
// Model Layout Configuration
function getModelLayoutConfig(mdl_coll) {

  /*
  show_model_base_header = true
  show_model_base_button = true
  header_text_layout_position = 'center'
  header_button_layout_position = 'center'
  */

  return [true, true, 'center', 'center']

}

// Get Info details
function getInfoDetails(key) {
  return docMapDetails[getKeyDetails(key)]
}

// Create Model Content
function getModelCompleteContent(mdl_coll, all_doc_info_list, doc_data) {

  // Get Fixed Model content
  // Here you can bypass also and customize the content
  return getFixedModelContent(mdl_coll, all_doc_info_list, doc_data)

}

// ===================================================
// Create HTML Content Type - Complete
// ===================================================
function genHTMLContentType() {
  displayOutput('>>> Create HTML Content Type 1')

  // Update header Images
  document.getElementById('banner_main_image').src = getImageUrl(getInfoDetails("Image1"))

  // Update Image View
  updateImageView("plc_image_view", ["Image1", "Image2", "Image3", "Image4"])

  // Get All Header Details
  let headerData = getHashDataList(mainDocMapDetails["COMMON_DATA"])

  $("#plc_header_1").html(headerData["HEADER_1"]);
  $("#plc_header_2").html(headerData["HEADER_2"]);
  $("#plc_header_3").html(headerData["HEADER_3"]);
  $("#plc_header_4").html(headerData["HEADER_4"]);
  $("#plc_header_5").html(headerData["HEADER_5"]);
  $("#plc_header_6").html(headerData["HEADER_6"]);
  $("#plc_header_7").html(headerData["HEADER_7"]);
  $("#plc_header_8").html(headerData["HEADER_8"]);
  $("#plc_header_9").html(headerData["HEADER_9"]);

  // Read Config Details
  let config = getHashDataList(getInfoDetails("Config"))

  $("#plc_title").html(getInfoDetails("Name"));

  //displayOutput(getInfoDetails("Country"))

  let quickInfo = getHashDataList(getInfoDetails("Quick"))
  $("#plc_best_time").html(quickInfo['QUICK1']);
  $("#plc_visa").html(quickInfo['QUICK2']);
  $("#plc_duration").html(quickInfo['QUICK3']);
  $("#plc_starting").html(quickInfo['QUICK4']);


  // Update tags 
  $("#plc_tags").html(getAppendHTMLLines(config['TAGS'].split(','),
    '<div class="small chip">',
    '</div>'));

  $("#plc_description").html(getInfoDetails("Description"));

  let reachInfo = getHashDataList(getInfoDetails("Reach"))
  $("#plc_info_2_details").html(reachInfo['DESC']);

  let feesInfo = getHashDataList(getInfoDetails("Fees"))
  let entry_details = '<p class="grey-text">Price</p><b>' + feesInfo['PRICE'] + '</b><br><br>' + feesInfo['DESC']
  $("#plc_info_3_details").html(entry_details);

  let timingsInfo = getHashDataList(getInfoDetails("Timings"))
  let timing_details = '<p class="grey-text">Days</p><b>' + timingsInfo['DAYS'] + '</b>' +
    '<p class="grey-text">Time</p><b>' + timingsInfo['TIME'] + '</b>' +
    '<br><br>' + timingsInfo['DESC']

  $("#plc_info_4_details").html(timing_details);

  $("#plc_info_5_details").html(getInfoDetails("Tips"));

  // Update List Ref Details
  getListRefDetails(getInfoDetails("Packages List"), 'all_packages_list_ref')
  getListRefDetails(getInfoDetails("Places Details"), 'all_places_list_ref')



}

// Get Multi Info details
function getMultiInfoDetails(id_details) {

  var doc_id = id_details.split('#')[0]
  var info_details = id_details.split('#')[1]

  var multi_info_details = {}

  multi_info_details["DAY"] = allDocCmpData[doc_id][info_details + "_INFO1"]
  multi_info_details["HEADER"] = allDocCmpData[doc_id][info_details + "_INFO2"]
  multi_info_details["TAGS"] = allDocCmpData[doc_id][info_details + "_INFO3"]
  multi_info_details["COMPLETE"] = allDocCmpData[doc_id][info_details + "_INFO4"]
  multi_info_details["IMAGE"] = allDocCmpData[doc_id][info_details + "_INFO5"]
  multi_info_details["STATUS"] = allDocCmpData[doc_id][info_details + "_INFO6"]

  return multi_info_details

}

// Update Multi Info HTML Details
function updateMultiInfoDetails(id_details, html_tag) {

  var multi_details = getMultiInfoDetails(id_details)

  if (multi_details["STATUS"]) {

    $("#" + html_tag + "_day").html(multi_details["DAY"]);
    $("#" + html_tag + "_header").html(multi_details["HEADER"]);


    // Update Tags
    var all_tags_list = multi_details["TAGS"].split(',')

    var tags_html_line = ''
    for (each_tags_idx in all_tags_list) {
      var tag_name = all_tags_list[each_tags_idx]
      tags_html_line += '<div class="chip">' + tag_name + '</div>'
    }

    $("#" + html_tag + "_tags").html(tags_html_line);


    // Update Body
    var all_body_list = multi_details["COMPLETE"].split('#')

    var body_html_line = ''
    for (each_idx in all_body_list) {
      if (each_idx == 0) { continue }
      var body_line = all_body_list[each_idx]
      body_html_line += '<blockquote>' + body_line + '</blockquote>'
    }

    // Update Image
    var itnr_image_details = getImageUrl(getInfoDetails(multi_details["IMAGE"]))

    if (itnr_image_details != "NOK") {
      body_html_line += '<br><img class="materialboxed" data-caption="Click on image to close it" width="250" src="' + itnr_image_details + '"></img>'
    }

    $("#" + html_tag + "_body").html(body_html_line);

  } else {
    document.getElementById(html_tag).style.display = 'none';
  }



}

// Update Image View
function updateImageView(divID, imagesList) {
  var image_html_line = ''

  for (idx in imagesList) {

    var imageName = imagesList[idx]

    var imageDetails = getImageUrl(getInfoDetails(imageName))

    if (imageDetails != "NOK") {

      var imageDesc = getImageDesc(getInfoDetails(imageName))

      image_html_line += '<div class="col s12 m4">\
                  <div class="card">\
                    <div class="card-image">\
                        <img class="materialboxed" data-caption="Click on image to close it" src="' + imageDetails + '"> </div>\
                    <div style="margin-left: 20px;">\
                        <p style="font-size: 10px;">'+ imageDesc + '</p>\
                      </div></div>\
                </div>';

    }

  } // for end

  if (image_html_line == '') {
    document.getElementById(divID + "_section").style.display = 'none';
  } else {
    $("#" + divID).html(image_html_line);
  }



  startUpCalls()

}

// Book Mark Handling
function bookmarkHandling(details) {

  displayOutput('Bookmark ID : ' + details)

  // Get User Login Details
  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)

  if (status == 'true') {
    let userLoginData = getLoginUserData()
    displayOutput(userLoginData)

    uuid = userLoginData['UUID']

    // Update into Database
    var userBookmarkPath = coll_base_path_P + 'USER/ALLUSER/' + uuid + '/BOOKMARK'
    displayOutput(userBookmarkPath)
    let doc_id = coll_name + '_' + document_ID
    displayOutput(doc_id)

    let data = {
      COLLNAME: coll_name,
      DOCID: document_ID,
      DETAILS: details
    };

    db.collection(userBookmarkPath).doc(doc_id).set(data).then(ref => {
      displayOutput('User Bookmark Added !!')

      toastMsg('Bookmark Added !!')
    });


  } else {
    toastMsg('Please login first !!')
  }

}

// Open Request Form
function openRequestForm() {
  displayOutput('Open Request Form.')

  updateLoaclSessionDetails()
  location.href = 'requestform.html?detail1=NA&detail2=NA&detail3=NA'
}

// --------------- Local Session -------------------
function updateLoaclSessionDetails() {
  // Update Session Data
  localStorageData('ISPKG', true)
  localStorageData('PKG_NAME', pageContent['NAME'])
  localStorageData('PKG_ID', pageContent['ID'])
  localStorageData('PKG_IMG', pageContent['IMAGE'])
  localStorageData('PKG_EXTRA', pageContent['EXTRA'])
  localStorageData('PKG_DEST_ID', pageContent['DEST_ID'])
  localStorageData('PKG_DEST_NAME', pageContent['DEST_NAME'])
}


// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function () {
    $('.collapsible').collapsible();
  });

  /*
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });
  */

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $(document).ready(function () {
    $('.materialboxed').materialbox();
  });

  $(document).ready(function () {
    $('.fixed-action-btn').floatingActionButton();
  });

}

