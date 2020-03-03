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
var coll_name = 'DESTINATIONS';
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

// Local Data
var config_details = ''
var links = ''
var reachDetails =  ''
var bestTimes =  ''
var essential =  ''
var toDo =  ''

var commonConfig = ''
let ownerDetails = ''

let showAdminCard = false
let userLoginData = 'NA'

// Update Offline read flag if required ....
//read_offline_col_data = false
//read_offline_list_data = false

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

  if(read_offline_col_data) {
    // Read Offline Data
    displayOutput('-> Reading Offline Data ....')

    let colData = readOfflineColData('DESTINATIONS')
    allDocCmpData[docID] = colData[docID]
    allDocCmpData['MAIN'] = colData['MAIN']   

    // Check VISIBLE Status
    if(allDocCmpData[docID]['MAIN_INFO5']) {
    updateMappingDetails(docID)

    hidePleaseWait()   

    updateHTMLPage()
    } else {
      viewModel('Message','Content Not Available !!')
     }

  } else {

    displayOutput('-> Reading Online Data ....')

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


        // Check VISIBLE Status
       if(allDocCmpData[docID]['MAIN_INFO5']) {
        // Update Mapping Data set       
        updateMappingDetails(docID)

        hidePleaseWait()

        updateHTMLPage()

       } else {
        viewModel('Message','Content Not Available !!')
       }

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
      displayOutput(err)

      hidePleaseWait()
    });

  }

}

// Check startup validation
function checkStartupValidation() {

  // Check Session Data
  let status = getLoginUserStatus()

  // Check Production Mode
  if (is_production_mode) {

    // Check User Mode to read Dev Publish Section
    if (status == 'true') {

      userLoginData = getLoginUserData()
      if (userLoginData['ROLE'] == 'ADMIN' || userLoginData['ROLE'] == 'DEV') {
        displayOutput('Change Publish Mode from Production to Development.')
        check_dev_publish_content = false
        coll_base_path = basePath
        read_offline_col_data = false
        read_offline_list_data = false
        $('#role_message').html('KivTech Development Publish')

        // Show ADMIN Section
        showAdminCard = true       

        readDocumentDataAsync(document_ID)
      } else {
        readDocumentDataAsync(document_ID)
      }


    } else {

      readDocumentDataAsync(document_ID)
    }

  } else {

    if (status == 'true') {
      userLoginData = getLoginUserData()
      if (userLoginData['ROLE'] == 'DEV') {
        displayOutput('Change Publish Mode from Production to Development.')
        check_dev_publish_content = false
        coll_base_path = basePath
        $('#role_message').html('KivTech Development Publish,DEV MODE')

        // Show ADMIN Section
        showAdminCard = true

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
  document.getElementById("header_section").style.display = 'block';  
  document.getElementById("footer_sec").style.display = 'block';
  document.getElementById("dest_faq_sec").style.display = 'block';

  //$("#page_title").html('Destination');

  document.getElementById('header_card_dest').className = "green-card-content white-text z-depth-2";

  genHTMLContentType('col_section_1')


  startUpCalls()



}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!')

    document.getElementById('main_list_container').className = "container-fluid row";

    document.getElementById("header_section").style.height = "250px";
    document.getElementById("banner_main_image").style.height = "250px";
    document.getElementById("header_btn_options_dest").style.marginTop = "-30%";    

    //document.getElementById("hdr_details_card").style.margin = "-80px 0px 0px 0px;";
    //document.getElementById("hdr_image_card").style.margin = "-80px 0px 0px 0px;";



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
  //viewModel('Overview', getInfoDetails("Description"))
  showFullMessageDialog(config_details['ABOUT_HDR'], 'NA',getInfoDetails("Description"))
}

// Show Reach Details
function viewReachDetails(details) {
  displayOutput(details)

  switch(details) {

    case 'air':
      viewModel('By Air', reachDetails['AIR'])
      break;

      case 'train':
      viewModel('By Train', reachDetails['TRAIN'])
      break;

      case 'road':
      viewModel('By Road', reachDetails['ROAD'])
      break;

      case 'content':
      //viewModel('Details', reachDetails['CONTENT'])
      showFullMessageDialog(reachDetails['HEADER'], reachDetails['DESC'],reachDetails['CONTENT'])
      break;


  }

}

// Show Best Times Details
function viewBestTimeDetails() {
  //viewModel(bestTimes['HEADER'], bestTimes['CONTENT'])
  showFullMessageDialog(bestTimes['HEADER'], bestTimes['DESC'],bestTimes['CONTENT'])
}

// Show Essential Details
function viewEssentialDetails() {
  //viewModel(essential['HEADER'], essential['CONTENT'])
  showFullMessageDialog(essential['HEADER'], essential['DESC'],essential['CONTENT'])
}

// Show To Do Details
function viewtoDoDetails() {
  //viewModel(toDo['HEADER'], toDo['CONTENT'])
  showFullMessageDialog(toDo['HEADER'], toDo['DESC'],toDo['CONTENT'])
}

// -----------------------------------------
// View Message Dialog
// -----------------------------------------
function showFullMessageDialog(header,sub_header,content){

  document.getElementById("col_section_1").style.display = 'none';
  document.getElementById("header_section").style.display = 'none';
  document.getElementById("footer_sec").style.display = 'none';
  document.getElementById("dest_faq_sec").style.display = 'none';
  document.getElementById("dest_listref_section").style.display = 'none';

  document.getElementById("message_display_container").style.display = 'block';
  document.getElementById("close_fl_btn").style.display = 'block';

  if(sub_header == 'NA') {
    document.getElementById("msg_sub_header").style.display = 'none';
  } else {
    document.getElementById("msg_sub_header").style.display = 'block';
  }

  // Update HTML Details
  $("#msg_header").html(header);
  $("#msg_sub_header").html(sub_header);
  $("#msg_content").html(content);

  window.scrollTo(0, 0);
}

function hideFullMessageDialog(){

  document.getElementById("col_section_1").style.display = 'block';
  document.getElementById("header_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';
  document.getElementById("dest_faq_sec").style.display = 'block';
  document.getElementById("dest_listref_section").style.display = 'block';

  document.getElementById("message_display_container").style.display = 'none';
  document.getElementById("close_fl_btn").style.display = 'none';

  window.scrollTo(0, 0);

}

// ------------------------------------------


// *******************************************************
// --------------- Mapping Functions ---------------------
// Generate Map function from Collection Options
// Paste complete code here
// Format code using shift+alt+F

// <<<<<<<<<<<<<<<<<< CODE SECTION START >>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //**************** Mapping Function ***************************
    // Update Mapping Data Sets details
    function updateMappingDetails(docID) { 
      if("MAIN" in allDocCmpData) {
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
        mainDocMapDetails["CONFIG"] = allDocCmpData["MAIN"]["INFO21"]
      } else {
        displayOutput("MAIN Doc details is not found !!")
      }
    




if(docID in allDocCmpData) {
docMapDetails["id"] = allDocCmpData[docID]["INFO0"]
docMapDetails["config"] = allDocCmpData[docID]["INFO1"]
docMapDetails["price"] = allDocCmpData[docID]["INFO10"]
docMapDetails["cut_price"] = allDocCmpData[docID]["INFO11"]
docMapDetails["reach_details"] = allDocCmpData[docID]["INFO12"]
docMapDetails["packages_details"] = docID + "#INFO13"
docMapDetails["places_details"] = docID + "#INFO14"
docMapDetails["cities"] = docID + "#INFO15"
docMapDetails["name"] = allDocCmpData[docID]["INFO2"]
docMapDetails["catageory"] = allDocCmpData[docID]["INFO3"]
docMapDetails["district"] = allDocCmpData[docID]["INFO30"]
docMapDetails["activities"] = allDocCmpData[docID]["INFO31"]
docMapDetails["ratings"] = allDocCmpData[docID]["INFO32"]
docMapDetails["filter"] = allDocCmpData[docID]["INFO35"]
docMapDetails["links"] = allDocCmpData[docID]["INFO36"]
docMapDetails["essential"] = allDocCmpData[docID]["INFO37"]
docMapDetails["to_do"] = allDocCmpData[docID]["INFO38"]
docMapDetails["international"] = allDocCmpData[docID]["INFO39"]
docMapDetails["tags"] = allDocCmpData[docID]["INFO4"]
docMapDetails["faq"] = allDocCmpData[docID]["INFO40"]
docMapDetails["things_todo"] = docID + "#INFO41"
docMapDetails["parent_id"] = allDocCmpData[docID]["INFO42"]
docMapDetails["references"] = allDocCmpData[docID]["INFO43"]
docMapDetails["services"] = allDocCmpData[docID]["INFO44"]
docMapDetails["stories"] = docID + "#INFO45"
docMapDetails["review"] = docID + "#INFO46"
docMapDetails["packages_2_details"] = docID + "#INFO47"
docMapDetails["packages_3_details"] = docID + "#INFO48"
docMapDetails["country"] = allDocCmpData[docID]["INFO5"]
docMapDetails["state"] = allDocCmpData[docID]["INFO6"]
docMapDetails["type"] = allDocCmpData[docID]["INFO7"]
docMapDetails["best_times"] = allDocCmpData[docID]["INFO8"]
docMapDetails["description"] = allDocCmpData[docID]["INFO9"]
    
// MAP Development and Production Image correctly .....
    if(check_dev_publish_content) {

    // IMAGES Production Information

docMapDetails["image_1"] = docID + "#INFO17"
docMapDetails["image_2"] = docID + "#INFO19"
docMapDetails["image_3"] = docID + "#INFO21"
docMapDetails["image_4"] = docID + "#INFO23"
docMapDetails["image_5"] = docID + "#INFO25"
docMapDetails["image_6"] = docID + "#INFO27"
docMapDetails["model"] = docID + "#INFO29"

} else {
    // IMAGES Information

docMapDetails["image_1"] = docID + "#INFO16"
docMapDetails["image_2"] = docID + "#INFO18"
docMapDetails["image_3"] = docID + "#INFO20"
docMapDetails["image_4"] = docID + "#INFO22"
docMapDetails["image_5"] = docID + "#INFO24"
docMapDetails["image_6"] = docID + "#INFO26"
docMapDetails["model"] = docID + "#INFO28"

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
  

  switch (mdl_coll) {    

    case "PACKAGES":
      return [true, true, 'left', 'right']

    default:
      return [true, false, 'left', 'right']
  }

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
  document.getElementById('banner_main_image').src = getImageUrl(getInfoDetails("Image 1"))

  // Update Image View
  updateImageView("dest_image_view", ["Image 2", "Image 3", "Image 4", "Image 5","Image 6"])

  // Read Config Details
  config_details = getHashDataList(getInfoDetails("Config"))

   // Common Config
   commonConfig = getHashDataList(mainDocMapDetails["CONFIG"])

  // Get All Header Details
  let headerData = getHashDataList(mainDocMapDetails["COMMON_DATA"])

  $("#dest_header_1").html(headerData["HEADER_1"]);
  $("#dest_header_2").html(headerData["HEADER_2"]);
  $("#dest_header_3").html(headerData["HEADER_3"]);
  $("#dest_header_4").html(headerData["HEADER_4"]);
  $("#dest_header_5").html(config_details['ABOUT_HDR']);
  $("#dest_header_6").html(headerData["HEADER_6"]);
  $("#dest_header_7").html(headerData["HEADER_7"]);
  
  links = getHashDataList(getInfoDetails("Links"))
  reachDetails = getHashDataList(getInfoDetails("Reach Details"))
  bestTimes = getHashDataList(getInfoDetails("Best Times"))
  essential = getHashDataList(getInfoDetails("Essential"))
  toDo = getHashDataList(getInfoDetails("To Do"))
  //displayOutput(faq)

  // Update Quick Action Section
  createQuickActionSection(toDo['DISPLAY'],essential['DISPLAY'],bestTimes['DISPLAY'])
  

  // Update How to Reach Section 
  // -----------------------------------------------
  if(reachDetails['DISPLAY'] == 'YES') {
    document.getElementById("destcard_reach").style.display = 'block';
    $("#reach_title").html(reachDetails['HEADER']);
    $("#reach_desc").html(reachDetails['DESC']);
    
    if(reachDetails['AIR'] == 'NA') {document.getElementById("destcard_air").style.display = 'none';}
    if(reachDetails['TRAIN'] == 'NA') {document.getElementById("destcard_train").style.display = 'none';}
    if(reachDetails['ROAD'] == 'NA') {document.getElementById("destcard_road").style.display = 'none';}
    if(reachDetails['CONTENT'] == 'NA') {document.getElementById("reach_content_btn").style.display = 'none';}

    $("#dest_by_air").html(reachDetails['AIR']);
    $("#dest_by_train").html(reachDetails['TRAIN']);
    $("#dest_by_road").html(reachDetails['ROAD']);

  }

  // -----------------------------------------------

  // Update Links Config Section
  // -----------------------------------------------
  if(links['DISPLAY'] == 'YES') {
    document.getElementById("destcard_links").style.display = 'block';

    if(links['HEADER'] == 'NA') { document.getElementById("card_link_header_sec").style.display = 'none';}
    $("#dest_header_6").html(links['HEADER']);

    if(links['WEBSITE'] == 'NA') { document.getElementById("dest_links_sec").style.display = 'none';}
    $("#dest_links").html(links['WEBSITE']);

    if(links['ADDRESS'] == 'NA') { document.getElementById("dest_address_sec").style.display = 'none';}
    $("#dest_address").html(links['ADDRESS']);

    if(links['PHONE'] == 'NA') { document.getElementById("dest_phone_sec").style.display = 'none';}
    $("#dest_phone").html(links['PHONE']);

  }

  // -----------------------------------------------

   // -----------------------------------------------
  // Update Page Content details
  pageContent['ID'] = getInfoDetails("ID")
  pageContent['NAME'] = getInfoDetails("Name")
  pageContent['IMAGE'] = getImageUrl(getInfoDetails("Image 1"))
  pageContent['EXTRA'] = config_details['DESC']
  pageContent['TYPE'] = 'DEST'
  pageContent['DEST_ID'] = getInfoDetails("ID")
  pageContent['DEST_NAME'] = getInfoDetails("State") + '#' + getInfoDetails("District")

  //$("#banner_main_header").html(getInfoDetails("Name"));
  //$("#banner_small_header").html(" ");

  // Update HTML Page Details getInfoDetails("Name")
  $("#dest_title").html(getInfoDetails("Name"));
  $("#page_title").html(getInfoDetails("Name"));

  $("#dest_price").html('&#x20b9;' + getInfoDetails("Price") + '/-');
  $("#dest_best_time").html(config_details['BEST_TIME']);
  $("#dest_duration").html(config_details['DURATION']);
  //$("#dest_ratings").html(getInfoDetails("Ratings"));
  $("#dest_description").html(getInfoDetails("Description"));


  // Update Activities
  // <img src="Images/default.jpg" alt="default"> 
  if(getInfoDetails("Activities")[0] == 'NA') {
    document.getElementById("dest_activity_sec").style.display = 'none';
  } else {
    $("#dest_activities").html(getChipIconsFromList(getInfoDetails("Activities")));
  }
 

  
  // Update Tags
  // <img src="Images/default.jpg" alt="default">   
  if(getInfoDetails("Tags")[0] == 'NA') {
    document.getElementById("dest_tags_sec").style.display = 'none';
  } else {
    $("#dest_tags").html(getChipIconsFromList(getInfoDetails("Tags")));
  }
  

  // Update List Ref Details
  getListRefDetails(getInfoDetails("Cities"), 'all_cities_list_ref')

  getListRefDetails(getInfoDetails("Packages Details"), 'all_packages_list_ref')
  getListRefDetails(getInfoDetails("Packages_2 Details"), 'all_packages_list_2_ref')
  getListRefDetails(getInfoDetails("Packages_3 Details"), 'all_packages_list_3_ref')

  // Update Filter List Ref Display Section  
  createListRefFilterBtn()

  getListRefDetails(getInfoDetails("Places Details"), 'all_places_list_ref')
  getListRefDetails(getInfoDetails("Things ToDo"), 'all_todo_places_list_ref')

  getListRefDetails(getInfoDetails("Stories"), 'all_stories_list_ref')
  getListRefDetails(getInfoDetails("Review"), 'all_reviews_list_ref')

  // Create FAQ Section
  createFaqSection('dest_faq_sec',getHashDataList(getInfoDetails("FAQ")))
  
   // Create Service Section
   if(commonConfig['HIDE_SERVICE_SECTION'] == 'NO') {
    createServiceCardSection(getInfoDetails('Services'))
  }  
 
  updateAdminSection()

  // Update Page History List
  savePageHistoryContent(getInfoDetails("Name"),getImageUrl(getInfoDetails("Image 1")),'NA') 

  // Update Rating section
  if(commonConfig['HIDE_RATINGS_SEC'] == 'NO') {
     updateRatingSection()
  }
 

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

// Book Mark Handling
function bookmarkHandling(details) {

  displayOutput('Wishlist ID : ' + details)

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
    var userBookmarkPath = coll_base_path_P + 'USER/ALLUSER/' + uuid + '/WISHLIST'
    displayOutput(userBookmarkPath)
    let doc_id = coll_name + '_' + document_ID
    displayOutput(doc_id)

    let data = {
      COLLNAME: coll_name,
      DOCID: document_ID,
      DETAILS: details
    };

    db.collection(userBookmarkPath).doc(doc_id).set(data).then(ref => {
      displayOutput('User Wishlist Added !!')

      toastMsg('Wishlist Added !!')
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

// Create Quick Information Section
function createQuickActionSection(toDo,essential,bestTimes){

  let html_line = ''

if(essential == 'YES') {
  html_line += ' <!-- Action 1 -->\
  <div class="col s4 m4">\
    <div id="dest_essential_sec" class="center-align" style="display: block;">\
      <span>\
        <small><a href="#!"><i onclick="viewEssentialDetails()" class="fas fa-lightbulb orange-text" style="font-size: 40px;"></i></a></small>\
        <br><small id="dest_essential_sec_hdr" class="orange-text" style="font-size: 10px;">Essential</small> \
      </span></div></div>'
}

if(bestTimes == 'YES') {
      html_line += '  <!-- Action 2 -->\
  <div class="col s4 m4">\
    <div id="dest_besttime_list" class="center-align" style="display: block;">\
\
      <span>\
        <small><a href="#!"><i onclick="viewBestTimeDetails()" class="fas fa-calendar-check purple-text" style="font-size: 40px;"></i></a></small>\
        <br><small id="dest_besttime_list_hdr" class="purple-text" style="font-size: 10px;">Best Time</small>\
      </span></div> </div>'
}

if(toDo == 'YES') {
      html_line += ' <!-- Action 3 -->\
  <div class="col s4 m4">\
    <div id="dest_todo_sec" class="center-align" style="display: block;">\
\
      <span>\
        <small> <a href="#!"><i onclick="viewtoDoDetails()" class="fas fa-bullhorn indigo-text" style="font-size: 40px;"></i></a></small>\
        <br><small id="dest_todo_sec_hdr" class="indigo-text" style="font-size: 10px;">Things To Do</small>\
         </span> </div> </div>'
}

    $('#dest_quick_action_sec').html(html_line)


}

// Handle FIlter List Ref Section Display
function handleListRefFilterDisplay(details) {
     //displayOutput(details)

     $('#listref_filter_drop_down').html('<i class="material-icons left">filter_list</i>' + details.split('#')[1])

     switch(details.split('#')[0]) {

      case 'filter_1' :
        document.getElementById("all_packages_list_ref").style.display = 'block';
        document.getElementById("all_packages_list_2_ref").style.display = 'none';
        document.getElementById("all_packages_list_3_ref").style.display = 'none';
        break;

        case 'filter_2' :
          document.getElementById("all_packages_list_ref").style.display = 'none';
          document.getElementById("all_packages_list_2_ref").style.display = 'block';
          document.getElementById("all_packages_list_3_ref").style.display = 'none';
          break;

          case 'filter_3' :
            document.getElementById("all_packages_list_ref").style.display = 'none';
            document.getElementById("all_packages_list_2_ref").style.display = 'none';
            document.getElementById("all_packages_list_3_ref").style.display = 'block';
            break;

            default:
              document.getElementById("all_packages_list_ref").style.display = 'none';
            document.getElementById("all_packages_list_2_ref").style.display = 'none';
            document.getElementById("all_packages_list_3_ref").style.display = 'none';
              break;
     }
}

// Create Filter Selection Droup down btn
function createListRefFilterBtn(){
  
  // Check Config Details
  if(config_details['LISTREF_FILTER_BTN'].trim() == 'ALL,ALL,ALL') {

    document.getElementById("all_packages_list_ref").style.display = 'block';
    document.getElementById("all_packages_list_2_ref").style.display = 'block';
    document.getElementById("all_packages_list_3_ref").style.display = 'block';

  } else {

  document.getElementById("all_packages_list_ref").style.display = 'block';
  document.getElementById("all_packages_list_2_ref").style.display = 'none';
  document.getElementById("all_packages_list_3_ref").style.display = 'none';  
  
  let filter_1 = 'filter_1'
  let filter_2 = 'filter_2'
  let filter_3 = 'filter_3'

  let filter_1_val = config_details['LISTREF_FILTER_BTN'].trim().split(',')[0]
  let filter_2_val = config_details['LISTREF_FILTER_BTN'].trim().split(',')[1]
  let filter_3_val = config_details['LISTREF_FILTER_BTN'].trim().split(',')[2]

  if((filter_1_val == 'NA') && (filter_2_val == 'NA') && (filter_3_val == 'NA')) {
     // Disable Filter drop down option
     document.getElementById("listref_filter_btn").style.display = 'none';

  } else {

    document.getElementById("listref_filter_btn").style.display = 'block';

  let html_line = '  <!-- Dropdown Trigger -->\
  <a id="listref_filter_drop_down" class="dropdown-trigger btn pink rcorners" href="#" data-target="listref_filter_drop_btn"><i class="material-icons left">filter_list</i>'+ filter_1_val +'</a>\
\
  <!-- Dropdown Structure -->\
  <ul id="listref_filter_drop_btn" class="dropdown-content">'

    if(filter_1_val != 'NA') { html_line +=  '<li><a onclick="handleListRefFilterDisplay(\'' + filter_1 + '#' + filter_1_val + '\')" href="#!">'+ filter_1_val +'</a></li>'}
    if(filter_2_val != 'NA') { html_line +=  '<li><a onclick="handleListRefFilterDisplay(\'' + filter_2 + '#' + filter_2_val + '\')" href="#!">'+ filter_2_val +'</a></li>'}
    if(filter_3_val != 'NA') { html_line +=  '<li><a onclick="handleListRefFilterDisplay(\'' + filter_3 + '#' + filter_3_val + '\')" href="#!">'+ filter_3_val +'</a></li>'}
  
    html_line +=  '</ul>'    

    $('#listref_filter_btn_sec').html(html_line)

    $('.dropdown-trigger').dropdown();
  }


}
}

// Update Admin Section
function updateAdminSection() {  

  if(commonConfig['HIDE_ADMIN_TAB'] == 'YES') {
    showAdminCard = false
  }

  if(showAdminCard){

    // Check for Document Owner ID
    ownerDetails = allDocCmpData[document_ID]["MAIN_INFO4"]
    let validateOwner = false

    // By pass all check for DEV Role
    if (userLoginData['ROLE'] == 'DEV') {
      validateOwner = true
    } else {
      if(userLoginData == 'NA') {
        validateOwner = false
      } else if(userLoginData['UUID'] == ownerDetails) {
        validateOwner = true
      }
    }

    
    
   
    if(validateOwner) {


  let admin_line = ''

  let html_line = ''
  html_line += '<b>Doc ID : </b>' + document_ID +'<br>'
  html_line += '<b>ID : </b>' + getInfoDetails("ID") +'<br>'
  html_line += '<b>Type : </b>' + getInfoDetails("Type") +'<br>'  

  admin_line += '<p>' + html_line +'</p>'

  html_line = ''

  html_line += '<b>Parent ID : </b><br>' + getInfoDetails("Parent ID") +'<br>'

  // -------------------- Update References Section ----------------------------
  let refDetails = getHashDataList(getInfoDetails("References"))

  if(refDetails['DISPLAY'] == 'YES') {

    html_line += '<br><b>'+  refDetails['HEADER'] + ' </b><br>'

    let dataList = ''
    let eachData = ''
    let eachlink = ''

    // Update DESTINATIONS List
    if((refDetails['DESTINATIONS'] != 'NA') && (refDetails['DESTINATIONS'] != 'START,NA,END')){      
      html_line += '<br><b>Destination :</b>'
      dataList = refDetails['DESTINATIONS'].split(',')
      for(each_idx in dataList) {
        eachData = dataList[each_idx].trim()
        if((eachData == 'START') || (eachData == 'NA') || (eachData == 'END')) {continue}
        eachlink = 'update_collection.html?lang_name=CORE&coll_name=DESTINATIONS&role=DEV&fl_action=DOC&fl_value='
        if(eachData.includes('-')) {
          eachlink += eachData.split('-')[0]
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData.split('-')[1] + '</div></a>'
        } else {
          eachlink += eachData
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData + '</div></a>'
        }        
      }
    }


    // Update PACKAGES List
    if((refDetails['PACKAGES'] != 'NA') && (refDetails['PACKAGES'] != 'START,NA,END')) {
      html_line += '<br><br><b>Packages :</b><br><br>'
      dataList = refDetails['PACKAGES'].split(',')
      for(each_idx in dataList) {
        eachData = dataList[each_idx].trim()
        if((eachData == 'START') || (eachData == 'NA') || (eachData == 'END')) {continue}
        eachlink = 'update_collection.html?lang_name=CORE&coll_name=PACKAGES&role=DEV&fl_action=DOC&fl_value='
        if(eachData.includes('-')) {
          eachlink += eachData.split('-')[0]
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData.split('-')[1] + '</div></a>'
        } else {
          eachlink += eachData
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData + '</div></a>'
        }        
      }
    }



    // Update PLACES List
    if((refDetails['PLACES'] != 'NA') && (refDetails['PLACES'] != 'START,NA,END')) {
      html_line += '<br><br><b>Places :</b><br><br>'
      dataList = refDetails['PLACES'].split(',')
      for(each_idx in dataList) {
        eachData = dataList[each_idx].trim()
        if((eachData == 'START') || (eachData == 'NA') || (eachData == 'END')) {continue}
        eachlink = 'update_collection.html?lang_name=CORE&coll_name=PLACES&role=DEV&fl_action=DOC&fl_value='
        if(eachData.includes('-')) {
          eachlink += eachData.split('-')[0]
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData.split('-')[1] + '</div></a>'
        } else {
          eachlink += eachData
          html_line += '<a href="'+eachlink+'" ><div class="chip black-text">' + eachData + '</div></a>'
        }        
      }
    }


    //html_line += getAppendHTMLLines(refDetails['DESTINATIONS'].split(','),'<div class="chip">','</div>');

  }

  



  // --------------------------------------------------------------------------

  admin_line += '<p>' + html_line +'</p>'

  let link = 'update_collection.html?lang_name=CORE&coll_name=DESTINATIONS&role=DEV&fl_action=DOC&fl_value='+ document_ID

  admin_line += '<div class="right-align" style="margin-top: 0px;">\
              <a href="'+link+'" class="waves-effect waves-teal btn-flat blue-text">Open Content Manager</a>\
            </div>'

  $("#admin_sec").html(admin_line); 

  document.getElementById("card_admin").style.display = 'block';

    }
}
}

// WatchList Handling
function watchListHandling() {

  // Collect Details
  let watchListDetails = getInfoDetails("ID") + '#' + getInfoDetails("Name")

  displayOutput('Wishlist ID : ' + watchListDetails)

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
    var userBookmarkPath = coll_base_path_P + 'USER/ALLUSER/' + uuid + '/WISHLIST'
    displayOutput(userBookmarkPath)
    let doc_id = coll_name + '_' + document_ID
    displayOutput(doc_id)

    let data = {
      COLLNAME: coll_name,
      DOCID: document_ID,
      IMAGE: pageContent['IMAGE'],
      DETAILS: watchListDetails
    };

    db.collection(userBookmarkPath).doc(doc_id).set(data).then(ref => {
      displayOutput('User Wishlist Added !!')

      toastMsg('Wishlist Added !!')
    });


  } else {
    toastMsg('Please login first !!')
  }

}

// Copy Link to Share with other
function copyLinkToShare(){  

  let page_name = 'edestination'
  let link = 'https://kivtravels.com/prod/'+page_name+'.html?id='+document_ID+'&fl=NA' 

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

// Open Discussion Form
function openDiscussionForm() {
  //coll_name+'_'+document_ID
  var url = 'forum/index.html?pt=' + encodeURIComponent('COMMONFORUM') + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// --------------- Local Session -------------------
function updateLoaclSessionDetails() {
  // Update Session Data
  localStorageData('ISPKG', true)
  localStorageData('PKG_NAME', pageContent['NAME'])
  localStorageData('PKG_ID', pageContent['ID'])
  localStorageData('PKG_IMG', pageContent['IMAGE'])
  localStorageData('PKG_EXTRA', pageContent['EXTRA'])
  localStorageData('PKG_TYPE', pageContent['TYPE'])
  localStorageData('PKG_DEST_ID', pageContent['DEST_ID'])
  localStorageData('PKG_DEST_NAME', pageContent['DEST_NAME'])
  localStorageData('COLLNAME', coll_name)
  localStorageData('DOCID', document_ID)
  localStorageData('OWNERID', ownerDetails)
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

