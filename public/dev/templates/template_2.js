// *******************************************************************************
// SCRIPT : alldetails.js
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
    document_ID = params['detail1'];
    filter = params['detail2'];
    extra = params['detail3'];    
  } 

  displayOutput(coll_name +' , '+ filter + ' , ' +  extra)
	
	
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


// Read Document Data in async mode
async function readDocumentDataAsync(docID) {

  showPleaseWait()

  await db.collection(coll_base_path+coll_lang+'/'+coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        showAlert('No Record Found!!');
        hidePleaseWait()
       
      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()   
        
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

  // HTML Modification functions
  updateHeaderImages()
  

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

// ------------- Show Alert ----------------------------
function showAlert(details) {  
    alert(details)  
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

