// *******************************************************************************
// SCRIPT : template.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var basePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var baseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';

var imagebasePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var imagebaseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';

// ********************************************
// ------------ Mode Configuration -----------
// Debug Mode
var debug_mode = true

// Change Mode for Production or Development
var is_production_mode = false

// ---------- Main Variables ---------
var coll_base_path = basePath

if(is_production_mode) {
  coll_base_path = baseProductionPath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'COLLECTION2_DATA';
var document_ID = 'DOC0';

// Global Data variables
// All documents data
var allDocCmpData = {}

// Mapping Data
var mainDocMapDetails = {}
var docMapDetails = {}

// ***********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams(){
	// Read Parameters
	displayOutput('Read Parameters ...')
	var idx = document.URL.indexOf('?');
	var params = new Array();
	if (idx != -1) {
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++){
			nameVal = pairs[i].split('=');
			params[nameVal[0]] = nameVal[1];
		}
	}
	displayOutput(params);
	
  // ------- Update Variables ------------
  if('detail1' in  params) {
    coll_lang = params['detail1'];
    coll_name = params['detail2'];
    document_ID = params['detail3'];    
  } 

  displayOutput(coll_lang +' , '+ coll_name + ' , ' +  document_ID)
	
	
}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();
  
  var totaldocCount = 0;

	db.collection(coll_base_path+coll_lang+'/'+coll_name).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

        if(querySnapshot.size == 0) {
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
              if(totaldocCount == docCount) {
                 hidePleaseWait();
              }

            });

            // Update HTML Page
            updateHTMLPage();           

	   	  }
		
	});
	
} // EOF

// Read Only one Document Data
function readDocumentData(docID) {

  showPleaseWait()

  let getDoc = db.collection(coll_base_path+coll_lang+'/'+coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()

      } else {
        displayOutput('Document data Done.');
        allDocCmpData[docID] = doc.data()

        updateHTMLPage()

        hidePleaseWait()
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

      hidePleaseWait()
    });

}

// Read Document Data in async mode
async function readDocumentDataAsync(docID) {

  showPleaseWait()

  await db.collection(coll_base_path+coll_lang+'/'+coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()
       
      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()

        mapDocumentDetails(docID)
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

      hidePleaseWait()
    });


    // ------------- Read MAIN Document --------------
    await db.collection(coll_base_path+coll_lang+'/'+coll_name).doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()
       
      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        mapMAINDocDetails()

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

// Read only one Document Data
//readDocumentData(document_ID);

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
  updateHeaderImages()
  

}

// *******************************************************
// --------------- Mapping Functions ---------------------

// MAP MAIN Document Details
function mapMAINDocDetails() {  

  if('MAIN' in allDocCmpData) {

    mainDocMapDetails['ID'] = allDocCmpData['MAIN']['INFO0']
    mainDocMapDetails['NAME'] = allDocCmpData['MAIN']['INFO1']
    mainDocMapDetails['DESC'] = allDocCmpData['MAIN']['INFO2']
    mainDocMapDetails['VISIBLE'] = allDocCmpData['MAIN']['INFO3']
    mainDocMapDetails['OWNER'] = allDocCmpData['MAIN']['INFO4']
    mainDocMapDetails['LINKS'] = allDocCmpData['MAIN']['INFO5']
    mainDocMapDetails['TDOC'] = allDocCmpData['MAIN']['INFO6']
    mainDocMapDetails['ADMIN'] = allDocCmpData['MAIN']['INFO7']
    mainDocMapDetails['IMAGE_TAB'] = allDocCmpData['MAIN']['INFO8']
    mainDocMapDetails['MULTI_TAB'] = allDocCmpData['MAIN']['INFO9']
    mainDocMapDetails['FORM_TAB'] = allDocCmpData['MAIN']['INFO10']
    mainDocMapDetails['COLL_DOC'] = allDocCmpData['MAIN']['INFO11']
    mainDocMapDetails['DOC_PBLS'] = allDocCmpData['MAIN']['INFO12']
    mainDocMapDetails['DOC_LIST'] = allDocCmpData['MAIN']['INFO13']
    mainDocMapDetails['DEF_IMG'] = allDocCmpData['MAIN']['INFO14']
    mainDocMapDetails['LIST_REF_INFO'] = allDocCmpData['MAIN']['INFO15']
    mainDocMapDetails['IMAGE_INFO'] = allDocCmpData['MAIN']['INFO16']
    mainDocMapDetails['IMAGE_PRO_INFO'] = allDocCmpData['MAIN']['INFO17']
    mainDocMapDetails['MULTI_INFO'] = allDocCmpData['MAIN']['INFO18']
    mainDocMapDetails['FORM_INFO'] = allDocCmpData['MAIN']['INFO19']
    mainDocMapDetails['COMMON_DATA'] = allDocCmpData['MAIN']['INFO20']

  } else {
    displayOutput('MAIN Doc details is not found !!')
  }
  

}

// MAP Documents Details
function mapDocumentDetails(docID) {  

  if(docID in allDocCmpData) {

    // Text Information
    docMapDetails['TEXT_1'] = allDocCmpData[docID]['INFO0']
    docMapDetails['TEXT_2'] = allDocCmpData[docID]['INFO1']
    docMapDetails['TEXT_3'] = allDocCmpData[docID]['INFO2']
    docMapDetails['TEXT_4'] = allDocCmpData[docID]['INFO3']
    docMapDetails['TEXT_5'] = allDocCmpData[docID]['INFO4']

    // Multi Text Information
    docMapDetails['MULTI_1'] = allDocCmpData[docID]['INFO5']
    docMapDetails['MULTI_2'] = allDocCmpData[docID]['INFO6']

    // Control Information
    docMapDetails['CNT_1'] = allDocCmpData[docID]['INFO22']

    // LIST REF Information
    docMapDetails['LIST_1'] = docID + '#INFO23'
    docMapDetails['LIST_2'] = docID + '#INFO26'

    // MAP Development and Production Image correctly .....
    if(is_production_mode) {

      // IMAGES Production Information
      docMapDetails['IMG_1'] = docID + '#INFO10'
      docMapDetails['IMG_2'] = docID + '#INFO12'
      docMapDetails['IMG_3'] = docID + '#INFO14'
      docMapDetails['IMG_4'] = docID + '#INFO16'
      docMapDetails['IMG_5'] = docID + '#INFO19'
      docMapDetails['IMG_6'] = docID + '#INFO21'
      docMapDetails['IMG_7'] = docID + '#INFO8'
    } else {

      // IMAGES Information
      docMapDetails['IMG_1'] = docID + '#INFO11'
      docMapDetails['IMG_2'] = docID + '#INFO13'
      docMapDetails['IMG_3'] = docID + '#INFO15'
      docMapDetails['IMG_4'] = docID + '#INFO18'
      docMapDetails['IMG_5'] = docID + '#INFO20'
      docMapDetails['IMG_6'] = docID + '#INFO7'
      docMapDetails['IMG_7'] = docID + '#INFO9'

    }

    // TREE Information
    docMapDetails['TREE_1'] = docID + '#INFO24'

    // FORM Information
    docMapDetails['FORM_1'] = docID + '#INFO25'

    

    

  } else {
    displayOutput(docID + ' Data not found !!')
  }

}

// *******************************************************
// --------------- Extract Functions ---------------------

// Extract Image URL Details
function getImageUrl(details) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  // Check Visible Status
  if(allDocCmpData[docID][info_details+'_INFO4']) {
     // Check Source Status
     var image_url = 'NA'
     if(allDocCmpData[docID][info_details+'_INFO5']) {
            // Return DB Url
            image_url = allDocCmpData[docID][info_details+'_INFO1']
     } else {
            // Return External Url
            image_url = allDocCmpData[docID][info_details+'_INFO3']
     }

     if(image_url == 'NA') {
       return mainDocMapDetails['DEF_IMG']
     } else {
       return image_url
     }

  } else {
       // Return Collection Default Image Url
       return mainDocMapDetails['DEF_IMG']
  }

}

// Get Image Description details
function getImageDesc(details) {
  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  return allDocCmpData[docID][info_details+'_INFO6']
}


// ******************************************************
// --------------- Common Functions --------------------
function displayOutput(details) {
  if(debug_mode) {
    console.log(details)
  }
}

// ----- Click Handling Operation --------
function clickHandling(action,page_name,name,filter,extra) {
 
  if(action == 'NEWPAGE') {
    var url = page_name+'.html?name=' + encodeURIComponent(name) + '&filter=' + encodeURIComponent(filter) + '&extra=' + encodeURIComponent(extra);

    //document.location.href = url;
    return url
  } else {
    return 'NA'
  }
 
}


// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Update Header Image
function updateHeaderImages() {

}


// *********************************************************
// --------------------------- EXTRA MODEL -----------------
/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait() { 
  document.getElementById('main_progress').style.display = "block";
}


function hidePleaseWait() {
// Hide progress
document.getElementById('main_progress').style.display = "none";
}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function(){
    $('.modal').modal();
  });

}

