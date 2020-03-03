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
var coll_name = 'PACKAGES';
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

// Local Variables
var map_hdr = ''
var map_details = ''
var price_hdr = ''
var price_details = ''
var hotel_viewdetails = ''

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

    let colData = readOfflineColData('PACKAGES')
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


  document.getElementById("col_section_2").style.display = 'block';
  document.getElementById("header_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';

  //$("#page_title").html('Packages');

  document.getElementById('header_card_pkg').className = "blue-card-content white-text z-depth-2";

  // Update List Ref Details 
  getListRefDetails(getInfoDetails("Places List"), 'all_places_list_ref')
  getListRefDetails(getInfoDetails("Packages List"), 'all_packages_list_ref')

  getListRefDetails(getInfoDetails("City"), 'all_cities_list_ref')
  getListRefDetails(getInfoDetails("Things ToDo"), 'all_todo_places_list_ref')
 
  getListRefDetails(getInfoDetails("Review"), 'all_reviews_list_ref')
  getListRefDetails(getInfoDetails("Stories"), 'all_stories_list_ref')

  genHTMLContentType('col_section_2')



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
   
    document.getElementById("header_btn_options_pkg").style.marginTop = "-30%";

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
  //viewModel('Overview', getInfoDetails("Overview"))
  showFullMessageDialog('Overview', 'NA',getInfoDetails("Overview"))
}

// View Price List Details
function viewPriceListDetails() {
  viewModel(price_hdr, price_details)
}

// View Map Details
function viewMapDetails() {
  viewModel(map_hdr, map_details)
}

// View Hotel Details
function viewHotelDetails() {
  viewModel('Details', hotel_viewdetails)
}

// -----------------------------------------
// View Message Dialog
// -----------------------------------------
function showFullMessageDialog(header,sub_header,content){

  document.getElementById("col_section_2").style.display = 'none';
  document.getElementById("header_section").style.display = 'none';
  document.getElementById("footer_sec").style.display = 'none';
  document.getElementById("pkg_faq_sec").style.display = 'none';
  document.getElementById("pkg_listref_section").style.display = 'none';
  document.getElementById("pkg_bookmark_sec").style.display = 'none';

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

  document.getElementById("col_section_2").style.display = 'block';
  document.getElementById("header_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';
  document.getElementById("pkg_faq_sec").style.display = 'block';
  document.getElementById("pkg_listref_section").style.display = 'block';
  document.getElementById("pkg_bookmark_sec").style.display = 'block';

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
docMapDetails["name"] = allDocCmpData[docID]["INFO1"]
docMapDetails["catageory"] = allDocCmpData[docID]["INFO10"]
docMapDetails["tags"] = allDocCmpData[docID]["INFO11"]
docMapDetails["destination_id"] = allDocCmpData[docID]["INFO12"]
docMapDetails["country"] = allDocCmpData[docID]["INFO13"]
docMapDetails["state"] = allDocCmpData[docID]["INFO14"]
docMapDetails["district"] = allDocCmpData[docID]["INFO15"]
docMapDetails["difficulty"] = allDocCmpData[docID]["INFO16"]
docMapDetails["highlights"] = allDocCmpData[docID]["INFO17"]
docMapDetails["overview"] = allDocCmpData[docID]["INFO18"]
docMapDetails["inclusions"] = allDocCmpData[docID]["INFO19"]
docMapDetails["days"] = allDocCmpData[docID]["INFO2"]
docMapDetails["exclusions"] = allDocCmpData[docID]["INFO20"]
docMapDetails["to_take"] = allDocCmpData[docID]["INFO21"]
docMapDetails["organiser"] = allDocCmpData[docID]["INFO22"]
docMapDetails["map"] = allDocCmpData[docID]["INFO23"]
docMapDetails["places_list"] = docID + "#INFO24"
docMapDetails["packages_list"] = docID + "#INFO25"
docMapDetails["stay1"] = allDocCmpData[docID]["INFO3"]
docMapDetails["config"] = allDocCmpData[docID]["INFO4"]
docMapDetails["transport"] = allDocCmpData[docID]["INFO5"]
docMapDetails["itinerary_1d"] = docID + "#INFO56"
docMapDetails["itinerary_2d"] = docID + "#INFO57"
docMapDetails["itinerary_3d"] = docID + "#INFO58"
docMapDetails["itinerary_4d"] = docID + "#INFO59"
docMapDetails["routes"] = allDocCmpData[docID]["INFO6"]
docMapDetails["itinerary_5d"] = docID + "#INFO60"
docMapDetails["itinerary_6d"] = docID + "#INFO61"
docMapDetails["itinerary_7d"] = docID + "#INFO62"
docMapDetails["activities"] = allDocCmpData[docID]["INFO65"]
docMapDetails["ratings"] = allDocCmpData[docID]["INFO66"]
docMapDetails["best_time"] = allDocCmpData[docID]["INFO67"]
docMapDetails["cities"] = allDocCmpData[docID]["INFO68"]
docMapDetails["config2"] = allDocCmpData[docID]["INFO69"]
docMapDetails["price"] = allDocCmpData[docID]["INFO7"]
docMapDetails["filter"] = allDocCmpData[docID]["INFO70"]
docMapDetails["price_list"] = allDocCmpData[docID]["INFO71"]
docMapDetails["international"] = allDocCmpData[docID]["INFO72"]
docMapDetails["availability"] = allDocCmpData[docID]["INFO73"]
docMapDetails["availability_config"] = allDocCmpData[docID]["INFO74"]
docMapDetails["faq"] = allDocCmpData[docID]["INFO75"]
docMapDetails["departure_city"] = allDocCmpData[docID]["INFO76"]
docMapDetails["stay2"] = allDocCmpData[docID]["INFO77"]
docMapDetails["stay3"] = allDocCmpData[docID]["INFO78"]
docMapDetails["city"] = docID + "#INFO79"
docMapDetails["cut_price"] = allDocCmpData[docID]["INFO8"]
docMapDetails["things_todo"] = docID + "#INFO80"
docMapDetails["review"] = docID + "#INFO81"
docMapDetails["stories"] = docID + "#INFO82"
docMapDetails["vendor"] = allDocCmpData[docID]["INFO83"]
docMapDetails["includes"] = allDocCmpData[docID]["INFO9"]
    
// MAP Development and Production Image correctly .....
    if(check_dev_publish_content) {

    // IMAGES Production Information

docMapDetails["image_1"] = docID + "#INFO27"
docMapDetails["image_2"] = docID + "#INFO29"
docMapDetails["image_3"] = docID + "#INFO31"
docMapDetails["image_4"] = docID + "#INFO33"
docMapDetails["image_5"] = docID + "#INFO35"
docMapDetails["itinerary_1"] = docID + "#INFO37"
docMapDetails["itinerary_2"] = docID + "#INFO39"
docMapDetails["itinerary_3"] = docID + "#INFO41"
docMapDetails["itinerary_4"] = docID + "#INFO43"
docMapDetails["itinerary_5"] = docID + "#INFO45"
docMapDetails["itinerary_6"] = docID + "#INFO47"
docMapDetails["itinerary_7"] = docID + "#INFO49"
docMapDetails["model"] = docID + "#INFO51"
docMapDetails["image_7"] = docID + "#INFO53"
docMapDetails["image_8"] = docID + "#INFO55"

} else {
    // IMAGES Information

docMapDetails["image_1"] = docID + "#INFO26"
docMapDetails["image_2"] = docID + "#INFO28"
docMapDetails["image_3"] = docID + "#INFO30"
docMapDetails["image_4"] = docID + "#INFO32"
docMapDetails["image_5"] = docID + "#INFO34"
docMapDetails["itinerary_1"] = docID + "#INFO36"
docMapDetails["itinerary_2"] = docID + "#INFO38"
docMapDetails["itinerary_3"] = docID + "#INFO40"
docMapDetails["itinerary_4"] = docID + "#INFO42"
docMapDetails["itinerary_5"] = docID + "#INFO44"
docMapDetails["itinerary_6"] = docID + "#INFO46"
docMapDetails["itinerary_7"] = docID + "#INFO48"
docMapDetails["model"] = docID + "#INFO50"
docMapDetails["image_7"] = docID + "#INFO52"
docMapDetails["image_8"] = docID + "#INFO54"

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
 // Here you can bypass also and customize the content
 return getFixedModelContent(mdl_coll, all_doc_info_list, doc_data)
}

// ===================================================
// Create HTML Content Type - Complete
// ===================================================
function genHTMLContentType() {
  displayOutput('>>> Create HTML Content Type 2')

  // Update header Images
  document.getElementById('banner_main_image').src = getImageUrl(getInfoDetails("Image 1"))

  // Update Image View
  updateImageView("pkg_image_view", ["Image 1", "Image 2", "Image 3", "Image 4", "Image 5"])

   // Read Config Details
   let config = getHashDataList(getInfoDetails("Config"))
   let config2 = getHashDataList(getInfoDetails("Config2"))  

   // Common Config
   commonConfig = getHashDataList(mainDocMapDetails["CONFIG"])   


  // Get All Header Details
  let headerData = getHashDataList(mainDocMapDetails["COMMON_DATA"]) 

  //$("#pkg_header_1").html(headerData["HEADER_1"]);  - Price
  //$("#pkg_header_2").html(headerData["HEADER_2"]);
  $("#pkg_header_2").html(config["PRICE_HDR"]);
  $("#pkg_header_3").html(headerData["HEADER_3"]);
  $("#pkg_header_4").html(headerData["HEADER_4"]);
  $("#pkg_header_5").html(headerData["HEADER_5"]);
  $("#pkg_header_6").html(headerData["HEADER_6"]);
  $("#pkg_header_7").html(headerData["HEADER_7"]);
  $("#pkg_header_8").html(headerData["HEADER_8"]);
  $("#pkg_header_9").html(headerData["HEADER_9"]);
  //$("#pkg_header_10").html(headerData["HEADER_10"]);
  $("#pkg_header_11").html(headerData["HEADER_11"]);
  $("#pkg_header_12").html(headerData["HEADER_12"]);
  $("#pkg_header_13").html(headerData["HEADER_13"]);
  $("#pkg_header_14").html(headerData["HEADER_14"]);
  $("#pkg_header_15").html(headerData["HEADER_15"]);
  $("#pkg_header_16").html(headerData["HEADER_16"]);
  $("#pkg_header_17").html(headerData["HEADER_17"]);

  map_hdr = headerData["HEADER_18"];
  price_hdr = headerData["HEADER_19"];

  $("#pkg_header_20").html(headerData["HEADER_20"]);
  $("#pkg_header_21").html(headerData["HEADER_21"]);
  $("#pkg_header_22").html(headerData["HEADER_22"]);

  // -------------------------------------------
  
  let transport = getHashDataList(getInfoDetails("Transport"))
  let pricelist = getHashDataList(getInfoDetails("Price List"))
  let availablitylist = getHashDataList(getInfoDetails("Availability Config"))  
  let maplist = getHashDataList(getInfoDetails("MAP"))
  let vendorDetails = getHashDataList(getInfoDetails("Vendor"))
  //displayOutput(availablitylist)  

  // Update Multi Config Section
  // -----------------------------------------------
  if(maplist['DISPLAY'] == 'YES') {
    document.getElementById("pkg_map_list").style.display = 'block';
    map_details = maplist['CONTENT']
  }

  if(pricelist['DISPLAY'] == 'YES') {
    document.getElementById("pkg_price_list").style.display = 'block';
    price_details = pricelist['CONTENT']
  }

  if(transport['DISPLAY'] == 'YES') {
    document.getElementById("pkgcard_transport").style.display = 'block';
    $("#pkg_transport").html(transport['CONTENT']);
  }

  if(availablitylist['DISPLAY'] == 'YES') {
    document.getElementById("pkgcard_avalibality").style.display = 'block';
    $("#pkg_avalibality").html(availablitylist['CONTENT']);
  }

  



  // -----------------------------------------------
  // Update Page Content details
  pageContent['ID'] = getInfoDetails("ID")
  pageContent['NAME'] = getInfoDetails("Name")
  pageContent['IMAGE'] = getImageUrl(getInfoDetails("Image 1"))
  pageContent['EXTRA'] = getInfoDetails("Days")
  pageContent['TYPE'] = 'PKG'
  pageContent['DEST_ID'] = getInfoDetails("Destination ID")
  pageContent['DEST_NAME'] = getInfoDetails("State") + '#' + getInfoDetails("District")


  //$("#banner_main_header").html(getInfoDetails("Name"));
  //$("#banner_small_header").html(" ");

  // Update HTML Page Details
  //$("#pkg_id").html(getInfoDetails("ID"));
  $("#pkg_title").html(getInfoDetails("Name"));
  $("#page_title").html(getInfoDetails("Name"));

  $("#pkg_price").html('&#x20b9;' + getInfoDetails("Price") + '/-');
  if (getInfoDetails("Cut Price") != '0') { $("#pkg_cut_price").html('&#x20b9;' + getInfoDetails("Cut Price") + '/-'); }
  $("#pkg_best_time").html(getInfoDetails("Best Time"));
  $("#pkg_days").html(getInfoDetails("Days"));
  $("#pkg_cities").html('<b>' + getInfoDetails("Cities") + '</b>');
  $("#pkg_route").html(getInfoDetails("Routes"));
  $("#pkg_ratings").html(getRatingHTMLCode(getInfoDetails("Ratings"), 'small'));
  //$("#pkg_ratings_num").html(getInfoDetails("Ratings").replace('#', ','));

  // Update Activities 
  $("#pkg_activities").html(getChipIconsFromList(getInfoDetails("Activities")))

  // Update Includes
  $("#pkg_includes").html(getChipWithBorderFromList(getInfoDetails("Includes")))


  $("#pkg_description").html(getInfoDetails("Overview"));

  // Update Highlights
  var highligts_details = getInfoDetails("Highlights")
  if (highligts_details == "NA") {
    document.getElementById("card_highlights").style.display = 'none';
  } else {                       
    $("#pkg_highlights").html(getHashLinesListInHTMLFormat(highligts_details, 'check','green'));
  }

  // ----------------------------------------------------
  // ------------ Stay Details --------------------------
  // ----------------------------------------------------
  // Update Stay Details
  var hotel_details = getHashDataList(getInfoDetails("Stay1"))

  if(hotel_details['DISPLAY'] == 'NO') {
    document.getElementById("pkgcard_hotels").style.display = 'none';
    document.getElementById("pkg_hotel_incl").style.display = 'none';
  } else {
  
  $("#pkg_hotel_inc").html(getRatingHTMLCode(hotel_details['STAR'] + '#1'));

  $("#pkg_header_14").html(hotel_details['HEADER']);
  $("#pkg_header_5").html(hotel_details['HEADER']);
  $("#pkg_hotel_hdr_desc").html(hotel_details['DESC']);
 
  $("#hotel_days").html(hotel_details['DAYS']);
  $("#hotel_city").html(hotel_details['CITY']);

  $("#hotel_name").html(hotel_details['NAME']);
  $("#hotel_addr").html(hotel_details['ADDR']);
  $("#hotel_star").html(getRatingHTMLCode(hotel_details['STAR'] + '#1'));

  hotel_viewdetails = hotel_details['CONTENT']
  if(hotel_viewdetails == 'NA') {
    document.getElementById("pkg_view_hotel_details").style.display = 'none';
  }  

  if (hotel_details['IMAGE'] != 'NA') {
    var hotel_image_details = getImageUrl(getInfoDetails(hotel_details['IMAGE']))
    if (hotel_image_details != "NOK") {
      document.getElementById('hotel_image').src = hotel_image_details
    } else {
      document.getElementById('hotel_image').src = getDirectImageUrl("Images/hotel_default.jpg")
    }
  } else {
    document.getElementById('hotel_image').src = getDirectImageUrl("Images/hotel_default.jpg")
  }

}

  // --------------------------------------------------------------------------



  // Update Inclusions
  //$("#pkg_inclusions").html(getHashLinesList(getInfoDetails("Inclusions"), '<div class="collapsible-header grey lighten-4"><i class="material-icons">add</i>', '</div>'));
  $("#pkg_inclusions").html(getHashLinesListInHTMLFormat(getInfoDetails("Inclusions"), 'done_all','green'))

  // Update Inclusions
  //$("#pkg_exclusions").html(getHashLinesList(getInfoDetails("Exclusions"), '<div class="collapsible-header grey lighten-4"><i class="material-icons">remove</i>', '</div>'));
  $("#pkg_exclusions").html(getHashLinesListInHTMLFormat(getInfoDetails("Exclusions"), 'remove','red'))


  // Update Itinerary 
  updateMultiInfoDetails(getInfoDetails("Itinerary 1D"), "itinerary_1")
  updateMultiInfoDetails(getInfoDetails("Itinerary 2D"), "itinerary_2")
  updateMultiInfoDetails(getInfoDetails("Itinerary 3D"), "itinerary_3")
  updateMultiInfoDetails(getInfoDetails("Itinerary 4D"), "itinerary_4")
  updateMultiInfoDetails(getInfoDetails("Itinerary 5D"), "itinerary_5")
  updateMultiInfoDetails(getInfoDetails("Itinerary 6D"), "itinerary_6")
  updateMultiInfoDetails(getInfoDetails("Itinerary 7D"), "itinerary_7")

  

  /*
  // Floating Button Options
  let floating_btn_line = '<a class="btn-floating btn-large blue">\
<i class="large material-icons">more_horiz</i>\
</a>\
<ul>\
<li><a a href="#!" onclick="watchListHandling(\'' + pkg_details + '\')" class="btn-floating red"><i class="material-icons">favorite</i></a></li>\
</ul>'

  $("#pkg_bookmark_sec").html(floating_btn_line);
  startUpCalls()
  */


  // Create FAQ Section
  createFaqSection('pkg_faq_sec',getHashDataList(getInfoDetails("FAQ")))

  // Update ADMIN Section
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


    // Get Config Details
    let configList = getHashDataList(multi_details["TAGS"])

    // Update Tags   
    $("#" + html_tag + "_tags").html(getAppendHTMLLines(configList["TAGS"].split(','),
    '<div class="small chip">',
    '</div>'));


    // Update Body
    var all_body_list = multi_details["COMPLETE"].split('#')

    var body_html_line = ''

    body_html_line += '<p class="grey-text" style="margin-top: -10px;">'+configList["DESC"]+'</p>'

    // Add Sub Header Section     
    body_html_line += getAppendHTMLLines(configList["INCLUDES"].split(','),
      '<div class="small chip">',
      '</div>')  


    // Add Content Details
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

  let page_name = 'epackage'
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

// Open Request Form
function openRequestForm() {
  displayOutput('Open Request Form.')

  //Check Availablity
  if(getInfoDetails("Availability")) {
    updateLoaclSessionDetails()
    location.href = 'requestform.html'
  } else {
    viewModel('Message', 'Sorry, Not Available !!')
  }
}

// Open Discussion Form
function openDiscussionForm() {
  var url = 'forum/index.html?pt=' + encodeURIComponent('COMMONFORUM') + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
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

      
  let admin_line = '<p class="black-text">' + document_ID +'</p>'

  admin_line += '<p class="black-text">' + getInfoDetails("ID") +'</p>'  
 

  let link = 'update_collection.html?lang_name=CORE&coll_name=PACKAGES&role=DEV&fl_action=DOC&fl_value='+ document_ID

  admin_line += '<div class="right-align" style="margin-top: 0px;">\
              <a href="'+link+'" class="waves-effect waves-teal btn-flat blue-text">Open Content Manager</a>\
            </div>'

  $("#admin_sec").html(admin_line);

  document.getElementById("card_admin").style.display = 'block';

    }
  }

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

