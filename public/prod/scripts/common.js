// *******************************************************************************
// SCRIPT : common.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var base_database_name = 'DATABASEPRO'


var basePath = '/'+base_database_name+'/DEVELOPMENT/PUBLIC/';
var basePrivatePath = '/'+base_database_name+'/DEVELOPMENT/PRIVATE/';

var baseProductionPath = '/'+base_database_name+'/PRODUCTION/PUBLIC/';
var baseProductionPrivatePath = '/'+base_database_name+'/PRODUCTION/PRIVATE/';

var imagebasePath = '/'+base_database_name+'/DEVELOPMENT/PUBLIC/';
var imagebaseProductionPath = '/'+base_database_name+'/PRODUCTION/PUBLIC/';

// ********************************************
// ------------ Mode Configuration -----------
// Debug Mode
var debug_mode = false

// Change Mode for Production or Development
var is_production_mode = true

// First Time Database Operation
var first_time_operation = true

// Enable only for validate phase 1
// Means check Development publish content
// true : Production Publish Content
// false : Development Publish Content
var check_dev_publish_content = true

// Bypass Validation check
var bypass_validation_check = false

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

// Display Toast Message
function toastMsg(msg) {
  M.toast({html: msg})
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

  }  else {
    return 'NA'
  }

}

// --------  Get Key Names Details --------
function getKeyDetails(key_name) {
  return key_name.replace(' ','_').toLowerCase()
 }

 // Get Info details
function getInfoDetailsC(key) {
  return docMapDetails[getKeyDetails(key)]
}

// Get Hashvalues Details
function getHashDataList(details) {
  
  var dataList = {}

  if(details == "NA") {
       dataList['STATUS'] = false
  } else {      

  var all_details_list = details.split('#')

  let dataLine = '{'
  for(each_idx in all_details_list) {
    if(each_idx == 0){continue}
    var idx_data = all_details_list[each_idx]
    dataLine += '"' + idx_data.split(':')[0].trim() + '"'  + ':' + '"' + idx_data.split(':')[1].trim() +'",'
    
  }

  dataLine = dataLine.slice(0, -1) + '}'

  dataList = JSON.parse(dataLine)
  dataList['STATUS'] = true
  
}

return dataList

}

// Get Hash Lines List details
function getHashLinesList(details,start,end){

  var all_details_list = details.split('#')

  var details_html_line = ''
  for(each_details_idx in all_details_list) {
    if(each_details_idx == 0){continue}
    var details_name = all_details_list[each_details_idx]
    details_html_line += start + details_name + end
  }

  return details_html_line

}

// Get Append HTML code lines
function getAppendHTMLLines(details,start,end){

  var html_line = ''
  for(each_idx in details) {
    var name = details[each_idx]
    html_line += start + name + end
  }

  return html_line

}

// Get Ratings HTML Code
function getRatingHTMLCode(ratings,size='small') {

  if(!ratings.includes("#")) {
    ratings = '1#(1)'
  }


  var rating_num = ratings.split('#')[0]
      
      var ratings_line = ''
      for (i = 0; i < Number(rating_num.split('.')[0]); i++) {
        //ratings_line += '<i class="fas fa-star text-warning"></i>';
        ratings_line += '<i class=" '+size+' material-icons orange-text">star</i>';
      }

      if(rating_num.includes(".5")) {
        ratings_line += '<i class=" '+size+' material-icons orange-text">star_half</i>';
      }

     // ratings_line += rating_num + ' ' + ratings.split('#')[1]

     return ratings_line
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
  var base_layout_content = getBaseLayoutHTML(details['MDL_COLL'],details['BS_LYT'], details['BS_TITLE'], each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);

}

// Create Base Layout
function getBaseLayoutHTML(mdl_coll,base_layout, header, model_content) {

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

                      if(show_model_base_header) {
                        base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';                     
                    }
                        

                      if(show_model_base_button){
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
                      <h3><i class="mdi-content-send brown-text"></i></h3>\
                      <div class="row">'
                      if(show_model_base_header) {
                        base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';                     
                    }
                        

                      if(show_model_base_button){
                        base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue rcorners">View All</a>\
                          </div>\
                        </div>'
                      }

                      base_layout_html += '</div>\
                      </div>\
                  </div><div class="row-scroll">' + model_content + '</div>';
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
                      if(show_model_base_header) {
                        base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';                     
                    }
                        

                      if(show_model_base_button){
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
function clickViewAll(details){
  displayOutput('Click : ' + details)

  var url = 'alldetails.html?detail1=' + encodeURIComponent(details) + '&detail2=' + encodeURIComponent('NA') + '&detail3=' + encodeURIComponent('NA');

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
function modelLytSquareCardScroll(mdl_map_details) {

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
function createScrollCardLytFromMapListData(htmldocID,mapListData,size_status,border) {

  let scroll_item_line = '<div class="row-scroll">' 
  
  let width = '300px'
  let height = '200px'

  if(size_status == 'M') {
    width = '300px'
    height = '200px'
  } else if(size_status == 'S') {
    width = '200px'
    height = '100px'
  } else if(size_status == 'L') {
    width = '150px'
    height = '200px'
  }

  let border_radius = '0'
  if(border) {
    border_radius = '10'
  }


  if(mapListData['STATUS']) {
  for (let key in mapListData) {
    
    if(key != 'STATUS') {
    let details = mapListData[key]

    let name = details.split(',')[0]
    let image = getDirectImageUrl('Images/'+details.split(',')[1])
    let click = details.split(',')[2]
    let link = details.split(',')[3]
    
    if(name == 'NA') {name = ''}
    if(link == 'NA') {link = '#!'}

    scroll_item_line += '<div class="card-scroll">\
    <a href="' + link + '">\
    <div class="card hoverable" style="width:'+width+'; height: '+height+'; border-radius: '+border_radius+'px;">\
      <div class="card-image">\
        <img src="'+image+'" style="width:'+width+'; height: '+height+'; border-radius: '+border_radius+'px; background-size: 100%;">\
        <span class="card-title">'+name+'</span>\
      </div></div></a></div>'

    }
  }

  scroll_item_line += ' </div>'

  //displayOutput(scroll_item_line)
  $("#"+htmldocID).html(scroll_item_line)

}

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
  var date = month[today.getMonth()].substring(0, 3)+' '+today.getDate() +', ' + today.getFullYear();

  return date
}

// ------------------------------------------------------
// ----------------- Model ------------------------------
// ------------------------------------------------------
// View Model to show Information
function viewModel(header, content) {

  var model = '<!-- Modal Structure -->\
  <div id="messagemodel" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <h4> '+ header +'</h4>\
      <p>'+ content + '</p>\
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

// Close Model
function closeModel() {
  $('#messagemodel').modal('close');
}

// Ask Model -  Validate some Information
function askModel(color,header, content, yesFunctionName) {

  let mdlContent = ''

  mdlContent += '<div class="left-align ' + color + '  white-text z-depth-2" style="border-radius: 25px 25px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="'+yesFunctionName+'()" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
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
function localStorageData(key,value) {

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    
    sessionStorage.setItem(key, value);
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
  }

}

// Get Login User Status
function getLoginUserStatus() {

  if (typeof(Storage) !== "undefined") {
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

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    let userData = {}
    userData['ISUSER'] = sessionStorage.getItem('ISUSER');
    userData['UUID'] = sessionStorage.getItem('UUID');
    userData['NAME'] = sessionStorage.getItem('NAME');
    userData['EMAIL'] = sessionStorage.getItem('EMAIL');
    userData['MOBILE'] = sessionStorage.getItem('MOBILE');
    userData['ROLE'] = sessionStorage.getItem('ROLE');


    return userData;
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}

// Get STATUS
function getLocalSessionIDStatus(id) {
  if (typeof(Storage) !== "undefined") {
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

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    let data = {}
    data['ISPKG'] = sessionStorage.getItem('ISPKG');
    data['PKG_NAME'] = sessionStorage.getItem('PKG_NAME');
    data['PKG_ID'] = sessionStorage.getItem('PKG_ID');
    data['PKG_IMG'] = sessionStorage.getItem('PKG_IMG');
    data['PKG_EXTRA'] = sessionStorage.getItem('PKG_EXTRA');
    data['PKG_DEST_ID'] = sessionStorage.getItem('PKG_DEST_ID');
    data['PKG_DEST_NAME'] = sessionStorage.getItem('PKG_DEST_NAME');

    return data;
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}

// ================================================
// ------ String FUnctions ------------------------
// ================================================

function isStrEmpty(str)
{
    return (!str || 0 === str.length);
}