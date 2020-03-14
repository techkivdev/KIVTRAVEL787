// *******************************************************************************
// SCRIPT : common.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var base_database_name = 'DATABASE'


var basePath = '/' + base_database_name + '/DEVELOPMENT/PUBLIC/';
var basePrivatePath = '/' + base_database_name + '/DEVELOPMENT/PRIVATE/';

var baseProductionPath = '/' + base_database_name + '/PRODUCTION/PUBLIC/';
var baseProductionPrivatePath = '/' + base_database_name + '/PRODUCTION/PRIVATE/';

var imagebasePath = '/' + base_database_name + '/DEVELOPMENT/PUBLIC/';
var imagebaseProductionPath = '/' + base_database_name + '/PRODUCTION/PUBLIC/';

// ********************************************
// ------------ Mode Configuration -----------
// Debug Mode
var debug_mode = true

// Change Mode for Production or Development
var is_production_mode = false

// First Time Database Operation
var first_time_operation = true

// Enable only for validate phase 1
// Means check Development publish content
// true : Production Publish Content
// false : Development Publish Content
var check_dev_publish_content = true

// Bypass Validation check
var bypass_validation_check = false

// Read Offline Data

// For Only Collection Data
var read_offline_col_data = false
// For LIST COl Data
var read_offline_list_data = false

// Offline Data - Project Setting 
// For Testing purpose use basePath
// But for Production use baseProductionPath
let offline_col_base_path = basePath

// -----------------------------------------------------
// ------------- Mobile Mode ---------------------------
// -----------------------------------------------------
var mobile_mode = false


// ------------------------------------------------------
// Auto Init
M.AutoInit();



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
    final_image_ref = "NOK"
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
// IDX 0 is Image url and 1 is DB id
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

  // Read Offline Data
  if(read_offline_list_data) {
    //Read Collection Document data from LIST_DATA collection
  if (list_ref_details['MDL_COLL'] != 'NA') {

    displayOutput('-> Read LIST DATA Offline ...')
    let colData = readOfflineColData('LIST')
    list_ref_details['MDL_DOC_DATA'] = colData[list_ref_details['MDL_COLL']]
    //displayOutput(list_ref_details)

     // ----- Update HTML Content ---------
     if (list_ref_details['VISIBLE']) {
      createListRefHTMLContent(list_ref_details, htmlID)
    }


  }

  } else { 

  //Read Collection Document data from LIST_DATA collection
  if (list_ref_details['MDL_COLL'] != 'NA') {
    displayOutput('-> Read LIST DATA Online ...')
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

}


// ******************************************************
// --------------- Common Functions --------------------
function displayOutput(details) {
  if (debug_mode) {
    console.log(details)
  }
}

// Display Toast Message
function toastMsg(msg) {
  M.toast({ html: msg })
}

// ----- Click Handling Operation --------
function clickHandling(mdl_map_details) {

  var mdl_action_details = mdl_map_details['ACTION']
  var id = mdl_map_details['ID']

  var action = mdl_action_details.split(',')[0]
  var page_name = mdl_action_details.split(',')[1]


  if (action == 'STATICPAGE') {
    var url = page_name + '.html?id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('NA');

    //document.location.href = url;
    return url
  } else if (action == 'FILTERPAGE') {

    var url = page_name + '.html?id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('NA');

    return url

  } else {
    return 'NA'
  }

}

// --------  Get Key Names Details --------
function getKeyDetails(key_name) {
  return key_name.replace(' ', '_').toLowerCase()
}

// Get Info details
function getInfoDetailsC(key) {
  return docMapDetails[getKeyDetails(key)]
}

// ------------------------
// Get Hashvalues Details
// ------------------------
function getHashDataList_old(details) {

  var dataList = {}
  var delim = ':'

  if (details == "NA") {
    dataList['STATUS'] = false
  } else {

    var all_details_list = details.split('#')

    let dataLine = '{'
    for (each_idx in all_details_list) {
      if (each_idx == 0) { continue }
      var idx_data = all_details_list[each_idx]
      dataLine += '"' + idx_data.split(delim)[0].trim() + '"' + ':' + '"' + idx_data.split(delim)[1].trim() + '",'

    }

    dataLine = dataLine.slice(0, -1) + '}'

    dataList = JSON.parse(dataLine)
    dataList['STATUS'] = true

  }

  return dataList

}

function getHashDataList(details) {

  var dataList = {}
  var delim = '$->'

  if (details == "NA") {
    dataList['STATUS'] = false
  } else {

    var all_details_list = details.split('#')
   
    for (each_idx in all_details_list) {
      if (each_idx == 0) { continue }
      var idx_data = all_details_list[each_idx]
     
      let key = idx_data.split(delim)[0].trim()
      let value = idx_data.split(delim)[1].trim()
      dataList[key] = value

    }
   
    dataList['STATUS'] = true

  }

  return dataList

}

// Get Hash Lines List details
function getHashLinesList(details, start, end) {

  var all_details_list = details.split('#')

  var details_html_line = ''
  for (each_details_idx in all_details_list) {
    if (each_details_idx == 0) { continue }
    var details_name = all_details_list[each_details_idx]
    details_html_line += start + details_name + end
  }

  return details_html_line

}

// Get HashList Lines and return in HTML Format
function getHashLinesListInHTMLFormat(details, icon_name, color_det) {

  var all_details_list = details.split('#')

  let start = '<i class="material-icons '+color_det+'-text" style="position: absolute; margin-top: 6px; ">'+ icon_name +'</i><p class="long-text-nor" style="margin-left: 40px; margin-top: 10px;">'
  let start_top = '<i class="material-icons '+color_det+'-text" style="position: absolute; margin-top: -2px; ">'+ icon_name +'</i><p class="long-text-nor" style="margin-left: 40px; margin-top: 10px;">'
  
  let end = '</p>'

  var details_html_line = ''
  for (each_details_idx in all_details_list) {
    if (each_details_idx == 0) { continue }
    var details_name = all_details_list[each_details_idx]
    if(each_details_idx == 1) {
      details_html_line += start_top + details_name + end
    } else {
      details_html_line += start + details_name + end
    }
    
  }

  return details_html_line

}

// Get Append HTML code lines
function getAppendHTMLLines(details, start, end) {

  var html_line = ''
  for (each_idx in details) {
    var name = details[each_idx]
    html_line += start + name + end
  }

  return html_line

}

// Get Ratings HTML Code
function getRatingHTMLCode(ratings, size = 'small') {

  if (!ratings.includes("#")) {
    ratings = '1#(1)'
  }


  var rating_num = ratings.split('#')[0]

  var ratings_line = ''
  for (i = 0; i < Number(rating_num.split('.')[0]); i++) {
    //ratings_line += '<i class="fas fa-star text-warning"></i>';
    ratings_line += '<i class=" ' + size + ' material-icons orange-text">star</i>';
  }

  if (rating_num.includes(".5")) {
    ratings_line += '<i class=" ' + size + ' material-icons orange-text">star_half</i>';
  }

  // ratings_line += rating_num + ' ' + ratings.split('#')[1]

  return ratings_line
}

// Get Chip icons accroding to the Name
function getChipIconsFromList(details){

  var html_line = ''

  let start = '<div class="chip">'
  let end = '</div>'

  let image_line = '<i class="material-icons" style="font-size: 35px;">flight</i><br><span>broken_image</span>'

  for (each_idx in details) {
    var name = details[each_idx]
    html_line += start + name + end
  }

  return html_line

}

// Get Chip with border accroding to the Name
function getChipWithBorderFromList(details){

  var html_line = ''

  let start = '<div class="chip-outline grey-text" style="margin-right: 5px; margin-top: 5px;">'
  let end = '</div>'

  let image_line = ''

  for (each_idx in details) {
    var name = details[each_idx]
    html_line += start + name + end
  }

  return html_line

}

// Detecting a mobile browser
function isMobileBrowser() {

  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  } else {
    return false;
  }

}

// Read Offline Collection Data from listDataSet file
function readOfflineColData(col_name){
  var allColData = getAllCollectionData()
  return allColData['DATA'][col_name]
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

    // Check VISIBLE Status
    if(details['MDL_DOC_DATA'][doc_id]['VISIBLE']) {
      // Get Doc Details
      var doc_details = details['MDL_DOC_DATA'][doc_id]

      // Create Layout according to the Model Layouts    
      each_list_ref_div_content += modelLayoutSelector(details['MDL_COLL'], details['MDL_LYT'], doc_details, all_doc_info_list, details['MDL_CLICK'])

    }
  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML(details['MDL_COLL'], details['BS_LYT'], details['BS_TITLE'], details['BS_DESC'], each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);

}

// Create Base Layout
function getBaseLayoutHTML(mdl_coll, base_layout, header, base_desc, model_content) {

  var base_layout_html = ''

  var show_model_base_header = true
  var show_model_base_button = true
  var header_text_layout_position = 'center'
  var header_button_layout_position = 'center'

  // **********************************************************************
  // ---------------------- CARD_ROW -------------------------------
  // *********************************************************************

  if (base_layout == 'CARD_ROW') {

    // ------------- Configuration -------------------------
    var mdl_lyt_config = getModelLayoutConfig(mdl_coll)
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
    // -----------------------------------------------------

    base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                      <h3><i class="mdi-content-send brown-text"></i></h3>\
                      <div class="row">'

    if (show_model_base_header) {
      base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';
    }


    if (show_model_base_button) {
      base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue rcorners">View All</a>\
                          </div>\
                        </div>'
    }

    base_layout_html += '</div>\
                      </div>\
                  </div><div class="row">' + model_content + '</div>';
  }

  // **********************************************************************
  // ---------------------- CARD_ROW_SCROLL -------------------------------
  // *********************************************************************

  if (base_layout == 'CARD_ROW_SCROLL') {

    // ------------- Configuration -------------------------
    var mdl_lyt_config = getModelLayoutConfig(mdl_coll)
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
    // -----------------------------------------------------


    base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                    \
                      <div>'
    if (show_model_base_header) {
      base_layout_html += '<div class="col s12">\
                        <p style="font-size: 25px;">' + header + '</p>'
            if(base_desc != 'NA') {
              base_layout_html += '<div><p class="grey-text long-text-nor" style="margin-top: -25px;">' + base_desc + '</p></div>';
            }

            base_layout_html += '</div> ';
    }


    if (show_model_base_button) {

      base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '" style="margin-top: -10px;">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue rcorners">View All</a>\
                          </div>\
                        </div>'

      base_layout_html += '</div>\
                          </div>\
                      </div><div class="row-scroll" style="margin-top: -20px">' + model_content + '</div>';

    } else {

      base_layout_html += '</div>\
                      </div>\
                  </div><div class="row-scroll" style="margin-top: -20px">' + model_content + '</div>';
    }
  }


  // **********************************************************************
  // ---------------------- CARD_ROW_HORIZ -------------------------------
  // **********************************************************************

  if (base_layout == 'CARD_ROW_HORIZ') {

    // ------------- Configuration -------------------------
    var mdl_lyt_config = getModelLayoutConfig(mdl_coll)
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
    // -----------------------------------------------------
    base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                    <h3><i class="mdi-content-send brown-text"></i></h3>\
                    <div class="row">'
    if (show_model_base_header) {
      base_layout_html += '<div class="col s12">\
                        <h5>' + header + '</h5>\
                        </div> ';
    }


    if (show_model_base_button) {
      base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue">View All</a>\
                          </div>\
                        </div>'
    }

    base_layout_html += '</div>\
                      </div>\
                  </div>' + model_content;

  }


  return base_layout_html;


}

// Click View All , Open new Page
function clickViewAll(details) {
  displayOutput('Click : ' + details)

  var url = '';

  switch (details) {

    case "PACKAGES":
      url = 'packages.html?fl=' + encodeURIComponent('NA');
      break;

    case "DESTINATIONS":
      url = 'destinations.html?fl=' + encodeURIComponent('NA');
      break;

    default:
      url = 'index.html';
      break;
  }
  displayOutput(url)
  document.location.href = url;


}


// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector
function modelLayoutSelector(mdl_coll, mdl_layout, doc_details, all_doc_info_list, mdl_action_details) {

  var mdl_html_line = ''

  var complete_content = getModelCompleteContent(mdl_coll, all_doc_info_list, doc_details)


  var mdl_map_details = {}
  mdl_map_details['ID'] = doc_details['ID']
  mdl_map_details['IMAGE'] = doc_details['IMAGE']
  mdl_map_details['CONTENT'] = complete_content
  mdl_map_details['ACTION'] = mdl_action_details

  // SQUARE_CARD_NOR Layout
  if (mdl_layout == 'SQUARE_CARD_NOR') {

    mdl_html_line = modelLytSquareCardNormal(mdl_map_details)
  }

  // SQUARE_CARD_NOR_SCROLL Layout
  if (mdl_layout == 'SQUARE_CARD_NOR_SCROLL') {

    mdl_html_line = modelLytSquareCardNormalScroll(mdl_map_details)
  }


  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard(mdl_map_details)
  }

  // SQUARE_CARD_SCROLL Layout
  if (mdl_layout == 'SQUARE_CARD_SCROLL') {

    mdl_html_line = modelLytSquareCardScroll(mdl_map_details)
  }

  // SQUARE_CARD_IMAGE Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE') {

    mdl_html_line = modelLytSquareCardImage(mdl_map_details)
  }

  // SQUARE_CARD_IMAGE_SCROLL Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE_SCROLL') {

    mdl_html_line = modelLytSquareCardImageScroll(mdl_map_details)
  }

  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard(mdl_map_details)
  }

  return mdl_html_line;

}

// Model Square Card - Normal
// Important Point :
// : col s12 m6 - Desktop layout is same but in mobile layout one below to another one
// : col s6 m6  - Same in desktop and mobile also
function modelLytSquareCardNormal(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px; widht: 300px; max-width: 300px;">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 10px 0px 0px;">\
                    </div>\
                    <div class="card-content">\
                      <div>' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card - Normal - Scroll
function modelLytSquareCardNormalScroll(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="card-scroll"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px; widht: 300px; max-width: 300px;">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 10px 0px 0px;">\
                    </div>\
                    <div class="card-content">\
                      <div>' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card - Customize
function modelLytSquareCard(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px; widht: 400px; max-width: 400px;">\
                    <div class="card-image z-depth-2" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 25px 0px 0px;">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 10px 0px 0px;">\
                    </div>\
                    <div class="red-card-content white-text" style="border-radius: 0px 0px 10px 10px;">\
                      <div class="card-content white-text">' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card - Customize - Scroll
function modelLytSquareCardScroll_old(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="card-scroll"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px; widht: 300px; max-width: 300px;">\
                    <div class="card-image z-depth-2" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 25px 0px 0px;">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 10px 0px 0px;">\
                    </div>\
                    <div class="red-card-content white-text" style="border-radius: 0px 0px 10px 10px;">\
                      <div class="card-content white-text">' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

function modelLytSquareCardScroll(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="card-scroll"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px; widht: 300px; max-width: 300px;">\
                    <div class="card-image z-depth-2" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 25px 0px 0px;">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 10px 10px 0px 0px;">\
                    </div>\
                    <div class="black-text" style="border-radius: 0px 0px 10px 10px;">\
                      <div class="card-content black-text">' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card with Image Only
function modelLytSquareCardImage(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="col s12 m6"><a href="' + clickHandling(mdl_map_details) + '">\
  <div class="card hoverable" style="border-radius: 10px;">\
    <div class="card-image" style="border-radius: 10px;">\
      <img src="' + getModelImageRef(image_ref) + '" style="height: 250px; max-height: 250px; border-radius: 10px;">\
      <span class="card-title">' + complete_content + '</span>\
    </div></div>\
</a>\
</div>';

  return htmlLine;

}

// Model Square Card with Image Only - Scroll
function modelLytSquareCardImageScroll(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="card-scroll"><a href="' + clickHandling(mdl_map_details) + '">\
  <div class="card hoverable" style="border-radius: 10px; width: 300px; height: 200px;">\
    <div class="card-image" style="border-radius: 10px;">\
      <img src="' + getModelImageRef(image_ref) + '" style="width: 300px; height: 200px; max-height: 200px; border-radius: 10px;">\
      <span class="card-title">' + complete_content + '</span>\
    </div></div>\
</a>\
</div>';

  return htmlLine;

}

// Model Square Card Horizontal
function modelLytSquareHoriCard(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']

  var htmlLine = '<div class="col s12 m7"><a href="' + clickHandling(mdl_map_details) + '">\
            <div class="card horizontal hoverable">\
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

// Create Scroll card model layout with map data list
function createScrollCardLytFromMapListData(htmldocID, mapListData, size_status, border) {

  let scroll_item_line = '<div class="row-scroll">'

  let width = '300px'
  let height = '200px'

  if (size_status == 'M') {
    width = '300px'
    height = '200px'
  } else if (size_status == 'S') {
    width = '200px'
    height = '100px'
  } else if (size_status == 'L') {
    width = '150px'
    height = '200px'
  }

  let border_radius = '0'
  if (border) {
    border_radius = '10'
  }


  if (mapListData['STATUS']) {
    for (let key in mapListData) {

      if( key == 'NA') {continue}

      if (key != 'STATUS') {
        let details = mapListData[key]

        let name = details.split(',')[0]
        let image = getDirectImageUrl('Images/' + details.split(',')[1])
        let click = details.split(',')[2]
        let link = details.split(',')[3]

        if (name == 'NA') { name = '' }
        if (link == 'NA') { link = '#!' }

        scroll_item_line += '<div class="card-scroll">\
    <a href="' + link + '">\
    <div class="card hoverable" style="width:'+ width + '; height: ' + height + '; border-radius: ' + border_radius + 'px;">\
      <div class="card-image">\
        <img src="'+ image + '" style="width:' + width + '; height: ' + height + '; border-radius: ' + border_radius + 'px; background-size: 100%;">\
        <span class="card-title">'+ name + '</span>\
      </div></div></a></div>'

      }
    }

    scroll_item_line += ' </div>'

    //displayOutput(scroll_item_line)
    $("#" + htmldocID).html(scroll_item_line)

  }

}

// --------------------------------------------------------
// ------ Get Fixed Model Content -------------------------
// --------------------------------------------------------
function getFixedModelContent(mdl_coll, all_doc_info_list, doc_data) {

  var html_div_line = ''
  // Change According to the Model ID 
  switch (mdl_coll) {
    case "DESTINATIONS":

      var header = doc_data[all_doc_info_list[0]]
      var content = doc_data[all_doc_info_list[1]]
      var content_1 = doc_data[all_doc_info_list[2]]

      html_div_line = '<b>' + header

      break;

    case "PACKAGES":

      var header = doc_data[all_doc_info_list[0]]
      var sub_header = doc_data[all_doc_info_list[1]]
      var ratings = doc_data[all_doc_info_list[2]]
      var price = doc_data[all_doc_info_list[3]]
      var cut_price = doc_data[all_doc_info_list[4]]

      // Check tags lenght
      let filter_sub_header = sub_header
      if(sub_header.length > 5) {
        filter_sub_header = [sub_header[0],sub_header[1],sub_header[2],sub_header[3],sub_header[4]]
      }
      // <div class="small chip center-align" style="height: 20px; padding: 2px;">
      let tags_line = getChipWithBorderFromList(filter_sub_header)

      html_div_line = '<div><p class="long-hdr-text" style="font-size: 20px;">' + header + '</p>\
      <p><small class="text-muted" style="margin-top: 5px;">' + getRatingHTMLCode(ratings) + '</small>\
  <p class="card-text" style="margin-top: 0px;">'+ tags_line + '</p>\
  <br>\
  <span class="right">'

      if (cut_price != '0') { html_div_line += '<small style="text-decoration: line-through; class="text-muted">(&#x20b9;' + cut_price + '/-)</small>' }

      html_div_line += '<small class="green-text" style="font-size: 30px;">&#x20b9;' + price + '/-</small></span>\
        <br>\
  </p></div>';

      break;

    case "PLACES":

      var header = doc_data[all_doc_info_list[0]]
      var content = doc_data[all_doc_info_list[1]]
      var tags = doc_data[all_doc_info_list[2]]

      // Check tags lenght
      let plc_filter_tags = tags
      if(tags.length > 5) {
        plc_filter_tags = [tags[0],tags[1],tags[2],tags[3],tags[4]]
      }
      // <div class="small chip center-align" style="height: 20px; padding: 2px;">
      let plc_tags_line = getChipWithBorderFromList(plc_filter_tags)

      html_div_line = '<b class="black-text">' + header + '</b><br><p class="grey-text long-text" style="font-size: 13px; margin-top: 5px;">' + content + '</p><div style="margin-top: 5px;">' + plc_tags_line +'</div>'

      break;

    default:
      displayOutput("No Document found");
      html_div_line = ''
  }

  return html_div_line

}

// Create FAQ Section
function createFaqSection(divSec, details) {

  if (details['DISPLAY'] == 'YES') {
    document.getElementById(divSec).style.display = 'block';
  } else {
    document.getElementById(divSec).style.display = 'none';
  }

  if (details['DISPLAY'] == 'YES') {

    let html = ''

    html += '<p style="font-size: 30px;">' + details['HEADER'] + '</p>'
    html += '<p class="grey-text" style="margin-top: -20px;">' + details['DESC'] + '</p>'

    html += '<ul class="collapsible expandable">'

    for (keys in details) {
      if (keys.includes('CNT_Q')) {
        if(details[keys] != 'NA') {
        html += '<li>'
        html += '<div class="collapsible-header"><i class="material-icons">question_answer</i><b>' + details[keys] + '</b></div>'
        }
        //displayOutput(keys)
      } else if (keys.includes('CNT_A')) {
        if(details[keys] != 'NA') {
        html += '<div class="collapsible-body"><span>' + details[keys] + '</span></div>'
        //displayOutput(keys)
        html += '</li>'
        }
      }

    }

    html += '</ul>'

    $("#" + divSec).html(html);

    $(document).ready(function () {
      $('.collapsible').collapsible();
    });

    /*
    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
      accordion: false
    });
    */

  }


}

// Create Service Card Section
function createServiceCardSection(details) {

  let service_details = getHashDataList(details)

  // Check for Mobile Browser
  let card_height = '170px'
  if (isMobileBrowser()) {
    card_height = '100px'
  }

  if(service_details['DISPLAY'] == 'YES') {

  let html_header_1 = '<p style="font-size: 25px;">'+ service_details['HEADER'] +'</p>'
  //let html_header_2 = ' <p class="long-text-nor grey-text" style="font-size: 15px; margin-top: -25px;">Sub Header</p>'
  
  let html_card = ''

  let service_list = ['SERVICE_1','SERVICE_2','SERVICE_3','SERVICE_4']
  for(each_idx in service_list) {
    let key_hdr = service_list[each_idx]

    // Get All Details
    let display = service_details[key_hdr + '_DISPLAY']
    let name = service_details[key_hdr + '_NAME']
    name = ''
    let image_type = service_details[key_hdr + '_IMAGE'].split('*&*')[0]
    let image_details = service_details[key_hdr + '_IMAGE'].split('*&*')[1]

    let image =''    
    if(image_type == 'LOCAL') {
    image = getDirectImageUrl('Images/' + image_details)
    } else {
      image = image_details
    }

    let action = service_details[key_hdr + '_ACTION']

    if(display == 'YES') {
    html_card += '<div class="col s6 m6">\
  <div class="card z-depth-2" style="border-radius: 10px;">\
    <div class="card-image">\
      <img src="'+image+'" style="height: '+card_height+'; border-radius: 10px;">\
      <span class="card-title">'+ name +'</span>\
    </div></div></div>'
    }


  }


  


    let html_line = ''

    html_line += html_header_1
    //html_line += html_header_2
    html_line += '<div class="row">'

    html_line += html_card

    html_line += '</div>'
  
    $('#card_service').html(html_line)

  }


}

// Update Rating Section
function updateRatingSection() {
  // Read Ratings details

  let path = coll_base_path_P + 'RATINGS/' + coll_name+'_'+document_ID

  let htmlContent = '<ul class="collection">'

  let header = ''

 db.collection(path).get()
  .then(snapshot => {

    if (snapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Ratings Record Found !!')

      document.getElementById("ratings_sec").style.display = 'none';

    } else {

    snapshot.forEach(doc => { 
      let rat_data = doc.data()  
      //displayOutput(rat_data)

      htmlContent += ' <li class="collection-item avatar">\
      <img src="'+rat_data['USERPHOTO']+'" alt="" class="circle">\
      <span class="title"><b>'+rat_data['NAME']+'</b><p class="grey-text" style="font-size: 13px;">'+rat_data['DATE']+'</p></span>\
      '+'<div class="left-align" style="margin-left: -5px;">'+getRatingHTMLCode(rat_data['RATINGS']+'#0')+'</div>'+rat_data['COMMENT']+'\
      \
    </li>'

    header += '<h5>Ratings</h5>'

    });

    htmlContent += '</ul>'
    $("#ratings_sec").html(header + htmlContent);

  }
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });

 


}


// ----------- Document Handling -------------------
function addNewDocument(path,data,message) { 

  // Create our initial doc
  db.collection(path).add(data).then(function() {
    if(message != 'NA') {toastMsg(message);}
  }); 
}

function setNewDocument(path,docid,data,message) {

// Create our initial doc
db.collection(path).doc(docid).set(data).then(function() {
  if(message != 'NA') {toastMsg(message);}
});


}

function updateDocument(path,data,message) {

  // Create our initial doc
  db.doc(path).update(data).then(function() {
    if(message != 'NA') {toastMsg(message);}
  });
  
  
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

// Get Current Date
function getTodayDate() {

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var today = new Date();
  var date = month[today.getMonth()].substring(0, 3) + ' ' + today.getDate() + ', ' + today.getFullYear();

  return date
}

function getTodayDateList() {

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var today = new Date();
  var date = [month[today.getMonth()].substring(0, 3) , today.getDate() , today.getFullYear()];  

  return date
}

function getTodayDateID() { 

  var today = new Date();
  var date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
  var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds() + today.getMilliseconds();
  var dateTime = date+''+time;

  return dateTime
}

// HTML Convert Functions

function nl2br (str, replaceMode, isXhtml) {

  var breakTag = (isXhtml) ? '<br />' : '<br>';
  var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

function br2nl (str, replaceMode) {   
	
  var replaceStr = (replaceMode) ? "\n" : '';
  // Includes <br>, <BR>, <br />, </br>
  return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
}

// ------------------------------------------------------
// ----------------- Model ------------------------------
// ------------------------------------------------------
// View Model to show Information
function viewModel(header, content) {

  var model = '<!-- Modal Structure -->\
  <div id="messagemodel" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <h4> '+ header + '</h4>\
      <p class="long-text-nor">'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    </div>\
  </div>'

  var elem = document.getElementById('messagemodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#messagemodel').modal('open');


}

function viewModelCustom(header, content) {

  var model = '<!-- Modal Structure -->\
  <div id="messagemodel" class="modal">\
    <div style="margin-top: -5%;">\
      <p>'+ content + '</p>\
    </div>\
  </div>'

  var elem = document.getElementById('messagemodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#messagemodel').modal('open');


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
                        <img class="materialboxed" data-caption="Click on image to close it" src="' + imageDetails + '"> </div>'
                        if(imageDesc != 'NA') {
                          image_html_line += '<div style="margin-left: 20px;">\
                        <p style="font-size: 10px;">'+ imageDesc + '</p>\
                      </div>'
    }
                      
    image_html_line += '</div>\
                </div>';

    }

  } // for end

  if (image_html_line == '') {
    document.getElementById(divID + "_section").style.display = 'none';
  } else {
    $("#" + divID).html(image_html_line);   
  }

  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });





}

// Close Model
function closeModel() {
  $('#messagemodel').modal('close');
}

// Ask Model -  Validate some Information
function askModel(color, header, content, yesFunctionName) {

  let mdlContent = ''

  mdlContent += '<div class="left-align ' + color + '  white-text z-depth-2" style="border-radius: 25px 25px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="' + yesFunctionName + '()" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'



  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#askmodel').modal('open');


}

// Close Ask Model
function askNO() {
  $('#askmodel').modal('close');
}

// Progress Model Show
function showPleaseWaitModel() {

  let content = '<div class="col s4 m4"><div class="preloader-wrapper active">\
  <div class="spinner-layer spinner-red-only">\
    <div class="circle-clipper left">\
      <div class="circle"></div>\
    </div><div class="gap-patch">\
      <div class="circle"></div>\
    </div><div class="circle-clipper right">\
      <div class="circle"></div>\
    </div>\
  </div>\
</div></div>\
<div class="col s8 m8"><h5>Please wait...</h5></div>'

  var model = '<!-- Modal Structure -->\
  <div id="pleasewaitmodel" class="modal">\
  <div style="padding: 20px; margin-top: 20px;">\
    <div class="row">\
      '+ content + '\
    </div>\
  </div></div>'

  var elem = document.getElementById('pleasewaitmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
    $('.modal').modal({'dismissible': false});
  });




  $('#pleasewaitmodel').modal('open');


}

// Progress Model Hide
function hidePleaseWaitModel() {
  $('#pleasewaitmodel').modal('close');
}


// ==============================================================
// ---------- Login User Validation -----------------------------
// ==============================================================

function getUseruuid() {
  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      displayOutput('User login !!')
      return user.uid;
    } else {
      // User is signed out.
      displayOutput('User logout !!')
      return 'NA'
    }
  }, function (error) {
    displayOutput(error);
    return 'NA'
  });
}

// Store Data for one session
function localStorageData(key, value) {

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    sessionStorage.setItem(key, value);
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
  }

}

// Get Login User Status
function getLoginUserStatus() {

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    return sessionStorage.getItem('ISUSER');
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}

// Get Login User Status
function getLoginUserData() {

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    let userData = {}
    userData['ISUSER'] = sessionStorage.getItem('ISUSER');
    userData['UUID'] = sessionStorage.getItem('UUID');
    userData['NAME'] = sessionStorage.getItem('NAME');
    userData['EMAIL'] = sessionStorage.getItem('EMAIL');
    userData['MOBILE'] = sessionStorage.getItem('MOBILE');
    userData['ROLE'] = sessionStorage.getItem('ROLE');
    userData['PHOTO'] = sessionStorage.getItem('PHOTO');


    return userData;
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}

// Get STATUS
function getLocalSessionIDStatus(id) {
  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    return sessionStorage.getItem(id);
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }
}

// Get Login User Status
function getLocalSessionPkgData() {

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    let data = {}
    data['ISPKG'] = sessionStorage.getItem('ISPKG');
    data['PKG_NAME'] = sessionStorage.getItem('PKG_NAME');
    data['PKG_ID'] = sessionStorage.getItem('PKG_ID');
    data['PKG_IMG'] = sessionStorage.getItem('PKG_IMG');
    data['PKG_EXTRA'] = sessionStorage.getItem('PKG_EXTRA');
    data['PKG_TYPE'] = sessionStorage.getItem('PKG_TYPE');
    data['PKG_DEST_ID'] = sessionStorage.getItem('PKG_DEST_ID');
    data['PKG_DEST_NAME'] = sessionStorage.getItem('PKG_DEST_NAME');
    
    data['COLLNAME'] = sessionStorage.getItem('COLLNAME');
    data['DOCID'] = sessionStorage.getItem('DOCID');
    data['OWNERID'] = sessionStorage.getItem('OWNERID');

    return data;
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}


// ------------- Save Page History Content ---------
function savePageHistoryContent(name,image,extra){

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage. 
    
    let pageData = {
      ID: coll_name + '_'+document_ID,
      NAME: name,
      IMAGE: image,
      EXTRA: extra,
      DOCID: document_ID,
      TYPE: coll_name,
      VIEWCNT: 1,
      DATE: getTodayDate(),
      DATEID: getTodayDateID()
    }

    //localStorage.setItem('PAGEDATA', null);
    displayOutput('>> Update Page History List .....')
    // First Read Data

    let page_history_data = JSON.parse(localStorage.getItem('PAGEDATA'));
    displayOutput(page_history_data)

    // Check for null
    if(page_history_data == null){
      let page_history_map_data = {}
      page_history_map_data['DATA'] = {}      
      localStorage.setItem('PAGEDATA', JSON.stringify(page_history_map_data)); 
      displayOutput('Data Reset.')
    } else {
      // Updated Data   
      // Check Key exist or not
      if(pageData['ID'] in page_history_data['DATA'])   {
         let old_cnt =  parseInt(page_history_data['DATA'][pageData['ID']]['VIEWCNT'])
         //Inc count
         old_cnt = old_cnt + 1;         
         pageData.VIEWCNT = old_cnt;         
      }


      page_history_data['DATA'][pageData['ID']] = pageData
      //displayOutput(page_history_data)
      localStorage.setItem('PAGEDATA', JSON.stringify(page_history_data)); 
      displayOutput('Page History Updated.')
    }

  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
  }

}

// ================================================
// ------ String FUnctions ------------------------
// ================================================

function isStrEmpty(str) {
  return (!str || 0 === str.length);
}


// -------------------------------------------------
// --------- Mapping Data Set ----------------------
// -------------------------------------------------

// ----------- Category Data Set -----------------
function getCatg1DataMapping(query) {

  let map_data = {
              INFO : "General Infromation",
              TIPS : "Important Travel Tips",
              QRY : "Any Query"
            }

  if(query == 'LIST') {

    let allList = [""]
    for(each in map_data) {
      allList.push(each)
    }
    return allList

  } else {
     return map_data[query]
  }

}


// ************* Generated Data *********************
// Tags List Data
// ======================================================

function tagsListData() { 
  return {"tourist":"7","fun":"11","india":"5","leovaradkar":"6","bsesensex":"9","yesbank":"4","instapassport":"7","instagood":"3","statebankofindia":"8","coronavirus":"3","photooftheday":"5","vacation":"7","donaldtrump":"10","travel":"3","justintrudeau":"4","nifty50":"7","traveling":"5","tourism":"5","amitshah":"5","holiday":"3","instatravel":"6","instago":"2","travelgram":"3","visiting":"4","travelling":"4","mytravelgram":"3"}
 }

 // ====================================================

 // Convert Tags to Chips
function convTagsList() {
  let updatedTagsList = {}
  for(eachTag in tagsListData()) {
    updatedTagsList[eachTag] = null
  }
  return updatedTagsList
}