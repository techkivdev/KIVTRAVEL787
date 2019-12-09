// *******************************************************************************
// SCRIPT : eachdetails.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = basePath

if (is_production_mode) {
  coll_base_path = baseProductionPath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'LIST_DATA';
var document_ID = 'NA';
var filter = 'NA';
var extra = 'NA';

// Global Data variables
// All documents data
var allDocCmpData = {}

// Mapping Data
var mainDocMapDetails = {}
var docMapDetails = {}

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
  if ('detail1' in params) {
    coll_name = params['detail1'];
    document_ID = params['detail2'];
    extra = params['detail3'];
  }

  displayOutput(coll_name + ' , ' + document_ID + ' , ' + extra)


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

      hidePleaseWait()
    });


  // ------------- Read MAIN Document --------------
  await db.collection(coll_base_path + coll_lang + '/' + coll_name+ '_DATA').doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()

      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        // Update Mapping Data set
        if(coll_name == 'DESTINATIONS') {
          updateMappingDetails_D(docID)
        } else if(coll_name == 'PACKAGES') {
          updateMappingDetails_P(docID)
        }
        

        hidePleaseWait()

        updateHTMLPage()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

      hidePleaseWait()
    });

}


// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

// Read All Documents from Collection
//readCompleateCollection();

// Async Mode
readDocumentDataAsync(document_ID)

// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {

  displayOutput(allDocCmpData)
  displayOutput(mainDocMapDetails)
  displayOutput(docMapDetails)

  // HTML Modification functions  
   if(coll_name == 'DESTINATIONS') {
    genHTMLContentType1('col_section_1')
  } else if(coll_name == 'PACKAGES') {
    genHTMLContentType2('col_section_1')
  }
  


}

// *******************************************************
// --------------- Mapping Functions ---------------------
// Generate Map function from Collection Options
// Paste complete code here
// Format code using shift+alt+F

// <<<<<<<<<<<<<<<<<< CODE SECTION START >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails_D(docID) {
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
    docMapDetails["price"] = allDocCmpData[docID]["INFO10"]
    docMapDetails["cut_price"] = allDocCmpData[docID]["INFO11"]
    docMapDetails["reach_details"] = allDocCmpData[docID]["INFO12"]
    docMapDetails["packages_details"] = docID + "#INFO13"
    docMapDetails["places_details"] = docID + "#INFO14"
    docMapDetails["review_details"] = docID + "#INFO15"
    docMapDetails["name"] = allDocCmpData[docID]["INFO2"]
    docMapDetails["catageory"] = allDocCmpData[docID]["INFO3"]
    docMapDetails["tags"] = allDocCmpData[docID]["INFO4"]
    docMapDetails["country"] = allDocCmpData[docID]["INFO5"]
    docMapDetails["state"] = allDocCmpData[docID]["INFO6"]
    docMapDetails["places"] = allDocCmpData[docID]["INFO7"]
    docMapDetails["best_times"] = allDocCmpData[docID]["INFO8"]
    docMapDetails["description"] = allDocCmpData[docID]["INFO9"]

    // MAP Development and Production Image correctly .....
    if (is_production_mode) {

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


//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails_P(docID) {
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
    docMapDetails["name"] = allDocCmpData[docID]["INFO1"]
    docMapDetails["catageory"] = allDocCmpData[docID]["INFO10"]
    docMapDetails["tags"] = allDocCmpData[docID]["INFO11"]
    docMapDetails["destination_id"] = allDocCmpData[docID]["INFO12"]
    docMapDetails["country"] = allDocCmpData[docID]["INFO13"]
    docMapDetails["state"] = allDocCmpData[docID]["INFO14"]
    docMapDetails["places"] = allDocCmpData[docID]["INFO15"]
    docMapDetails["difficulty"] = allDocCmpData[docID]["INFO16"]
    docMapDetails["description"] = allDocCmpData[docID]["INFO17"]
    docMapDetails["overview"] = allDocCmpData[docID]["INFO18"]
    docMapDetails["inclusions"] = allDocCmpData[docID]["INFO19"]
    docMapDetails["days"] = allDocCmpData[docID]["INFO2"]
    docMapDetails["exclusions"] = allDocCmpData[docID]["INFO20"]
    docMapDetails["to_take"] = allDocCmpData[docID]["INFO21"]
    docMapDetails["organiser"] = allDocCmpData[docID]["INFO22"]
    docMapDetails["map"] = allDocCmpData[docID]["INFO23"]
    docMapDetails["places_list"] = docID + "#INFO24"
    docMapDetails["review_list"] = docID + "#INFO25"
    docMapDetails["hotels"] = allDocCmpData[docID]["INFO3"]
    docMapDetails["hotel_star"] = allDocCmpData[docID]["INFO4"]
    docMapDetails["hotel_image"] = allDocCmpData[docID]["INFO5"]
    docMapDetails["itinerary_1"] = docID + "#INFO56"
    docMapDetails["itinerary_2"] = docID + "#INFO57"
    docMapDetails["itinerary_3"] = docID + "#INFO58"
    docMapDetails["itinerary_4"] = docID + "#INFO59"
    docMapDetails["routes"] = allDocCmpData[docID]["INFO6"]
    docMapDetails["itinerary_5"] = docID + "#INFO60"
    docMapDetails["itinerary_6"] = docID + "#INFO61"
    docMapDetails["itinerary_7"] = docID + "#INFO62"
    docMapDetails["price"] = allDocCmpData[docID]["INFO7"]
    docMapDetails["cut_price"] = allDocCmpData[docID]["INFO8"]
    docMapDetails["includes"] = allDocCmpData[docID]["INFO9"]

    // MAP Development and Production Image correctly .....
    if (is_production_mode) {

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

// Create HTML Content Type 1
function genHTMLContentType1(maindivID){
  displayOutput('>>> Create HTML Content Type 1')

  var main_html_content = '<h3>DESTINATIONS</h3>'


  // Update HTML Page
  $("#" + maindivID).html(main_html_content);

}

// Create HTML Content Type 2
function genHTMLContentType2(maindivID){
  displayOutput('>>> Create HTML Content Type 2')

  var main_html_content = '<h3>PACKAGES</h3>'
  
  // Update HTML Page
  $("#" + maindivID).html(main_html_content);

}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

}

