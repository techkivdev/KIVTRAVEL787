// *******************************************************************************
// SCRIPT : common.js
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



// *******************************************************
// --------------- Extract Functions ---------------------

// Extract Image URL Details
function getImageUrl(details) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  var final_image_ref = ''

  // Check Visible Status
  if (allDocCmpData[docID][info_details + '_INFO4']) {
    // Check Source Status
    var image_url = 'NA'
    if (allDocCmpData[docID][info_details + '_INFO5']) {
      // Return DB Url
      image_url = allDocCmpData[docID][info_details + '_INFO1']
    } else {
      // Return External Url
      image_url = allDocCmpData[docID][info_details + '_INFO3']
    }

    if (image_url == 'NA') {
      final_image_ref = mainDocMapDetails['DEF_IMG']
    } else {
      final_image_ref = image_url
    }

  } else {
    // Return Collection Default Image Url
    final_image_ref = mainDocMapDetails['DEF_IMG']
  }

  return getDirectImageUrl(final_image_ref)

}

// Get Image Description details
function getImageDesc(details) {
  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  return allDocCmpData[docID][info_details + '_INFO6']
}

// Get Model Image ref details
function getModelImageRef(details) {
  return getDirectImageUrl(details[0])
}

// Get Local Image Details
function getDirectImageUrl(details) {
  if (details == 'NA') {
    return 'Images/default.jpg'
  } else {
    return details
  }
}

// Extract LIST_REF Details
function getListRefDetails(details, htmlID) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  var list_ref_details = {}
  list_ref_details['BS_LYT'] = allDocCmpData[docID][info_details + '_INFO1']
  list_ref_details['BS_IMG_REF'] = allDocCmpData[docID][info_details + '_INFO2']
  list_ref_details['BS_TITLE'] = allDocCmpData[docID][info_details + '_INFO3']
  list_ref_details['BS_DESC'] = allDocCmpData[docID][info_details + '_INFO4']
  list_ref_details['MDL_COLL'] = allDocCmpData[docID][info_details + '_INFO5']
  list_ref_details['MDL_DOC'] = allDocCmpData[docID][info_details + '_INFO6']
  list_ref_details['MDL_LYT'] = allDocCmpData[docID][info_details + '_INFO7']
  list_ref_details['MDL_INFO'] = allDocCmpData[docID][info_details + '_INFO8']
  list_ref_details['MDL_CLICK'] = allDocCmpData[docID][info_details + '_INFO9']
  list_ref_details['VISIBLE'] = allDocCmpData[docID][info_details + '_INFO10']

  // -------------- Change Here details for testing purpose -------------
  if (false) {
    list_ref_details['BS_LYT'] = 'CARD_ROW_HORIZ'
    list_ref_details['MDL_LYT'] = 'SQUARE_CARD_HORIZ'
  }



  //Read Collection Document data from LIST_DATA collection
  if (list_ref_details['MDL_COLL'] != 'NA') {
    db.collection(coll_base_path + coll_lang + '/' + 'LIST_DATA').doc(list_ref_details['MDL_COLL']).get()
      .then(doc => {
        if (!doc.exists) {
          displayOutput('No such document!');
        } else {
          displayOutput(docID + ' - Document data Read Done.');
          list_ref_details['MDL_DOC_DATA'] = doc.data()

          // ----- Update HTML Content ---------
          if (list_ref_details['VISIBLE']) {
            createListRefHTMLContent(list_ref_details, htmlID)
          }
        }
      })
      .catch(err => {
        displayOutput('LIST_DATA Error getting document');
        displayOutput()
      });
  }

}


// ******************************************************
// --------------- Common Functions --------------------
function displayOutput(details) {
  if (debug_mode) {
    console.log(details)
  }
}

// ----- Click Handling Operation --------
function clickHandling(action, page_name, name, filter, extra) {

  if (action == 'NEWPAGE') {
    var url = page_name + '.html?detail1=' + encodeURIComponent(name) + '&detail2=' + encodeURIComponent(filter) + '&detail3=' + encodeURIComponent(extra);

    //document.location.href = url;
    return url
  } else {
    return 'NA'
  }

}



// ---------------------------------------------------------------
// ---------------------MODEL and BASE Layout -----------------------
// Create List ref layout HTML content
function createListRefHTMLContent(details, htmlID) {

  var all_doc_list = details['MDL_DOC'].split(',')
  var all_doc_info_list = details['MDL_INFO'].split(',')

  var each_list_ref_div_content = '';

  // Read Each Document details and create lsit view 
  for (each_doc in all_doc_list) {

    var doc_id = all_doc_list[each_doc]

    // Get Doc Details
    var doc_details = details['MDL_DOC_DATA'][doc_id]

    // Create Layout according to the Model Layouts    
    each_list_ref_div_content += modelLayoutSelector(details['MDL_COLL'], details['MDL_LYT'], doc_details, all_doc_info_list, details['MDL_CLICK'])

  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML(details['BS_LYT'], details['BS_TITLE'], each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);

}

// Create Base Layout
function getBaseLayoutHTML(base_layout, header, model_content) {

  var base_layout_html = ''

  if (base_layout == 'CARD_ROW') {
    base_layout_html = '<div class="row">\
                    <div class="col s12 left">\
                      <h3><i class="mdi-content-send brown-text"></i></h3>\
                      <h4>' + header + '</h4></div>\
                  </div><div class="row">' + model_content + '</div>';
  }

  if (base_layout == 'CARD_ROW_HORIZ') {

    base_layout_html = '<div class="row">\
          <div class="col s12 left">\
            <h3><i class="mdi-content-send brown-text"></i></h3>\
            <h4>' + header + '</h4></div>\
          </div>' + model_content;

  }


  return base_layout_html;


}


// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector
function modelLayoutSelector(mdl_coll, mdl_layout, doc_details, all_doc_info_list, mdl_action_details) {

  var mdl_html_line = ''

  var complete_content = getModelCompleteContent(mdl_coll, all_doc_info_list, doc_details)


  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard(
      doc_details['IMAGE'],
      complete_content,
      mdl_action_details
    )
  }

  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard(
      doc_details['IMAGE'],
      complete_content,
      mdl_action_details
    )
  }

  return mdl_html_line;

}

// Model Square Card
function modelLytSquareCard(image_ref, complete_content, mdl_action_details) {

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_action_details.split(',')[0], mdl_action_details.split(',')[1], mdl_action_details.split(',')[2], mdl_action_details.split(',')[3], mdl_action_details.split(',')[4]) + '">\
                  <div class="card">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '">\
                    </div>\
                    <div class="card-content">\
                      <span class="blue-grey-text text-lighten-2">' + complete_content + '</span>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card Horizontal
function modelLytSquareHoriCard(image_ref, complete_content, mdl_action_details) {

  var htmlLine = '<div class="col s12 m7"><a href="' + clickHandling(mdl_action_details.split(',')[0], mdl_action_details.split(',')[1], mdl_action_details.split(',')[2], mdl_action_details.split(',')[3], mdl_action_details.split(',')[4]) + '">\
            <div class="card horizontal">\
              <div class="card-image">\
                <img src="' + getModelImageRef(image_ref) + '">\
              </div>\
              <div class="card-stacked">\
                <div class="card-content">\
                  <span class="blue-grey-text text-lighten-2">' + complete_content + '</span>\
                </div>\
              </div>\
            </div>\
          </a>\
        </div>';

  return htmlLine;

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

// ------------- Show Alert ----------------------------
function showAlert(details) {
  alert(details)
}