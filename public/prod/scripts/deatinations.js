// *******************************************************************************
// SCRIPT : alldetails.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = basePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'LIST_DATA';

// ----------- Update Name ---------------
var document_ID = 'DESTINATIONS';
// ---------------------------------------

var filter_fl = 'NA';


// Global Data variables
// All documents data
var allDocCmpData = {}

// Col Doc Data
var coll_list_data = {}

// Update Offline read flag if required ....
//read_offline_col_data = false
//read_offline_list_data = false

// Filter Handling
var is_filter_enable = false
var filter_check_value = []
var main_filter_check_value = ''
var filter_doc_data = {}
var filter_group = {}

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
  //displayOutput(params);

  // ------- Update Variables ------------
  if ('fl' in params) {    
    filter_fl = params['fl'].replace('#!','');    
  }

  //displayOutput(filter_fl)


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

    let colData = readOfflineColData('LIST')
    allDocCmpData[docID] = colData[docID]   

    updateHTMLPage()

  } else {

    displayOutput('-> Reading Online Data ....')

  await db.collection(coll_base_path + coll_lang + '/' + coll_name).doc(docID).get()
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

}

// Check startup validation
function checkStartupValidation() {

  // Check Session Data
  let status = getLoginUserStatus()

  // Check Production Mode
  if(is_production_mode) {

    // Check User Mode to read Dev Publish Section
    if(status == 'true') {

      let userLoginData = getLoginUserData()
      if(userLoginData['ROLE'] == 'ADMIN' || userLoginData['ROLE'] == 'DEV') {
        displayOutput('Change Publish Mode from Production to Development.')
        check_dev_publish_content = false              
        coll_base_path = basePath  
        read_offline_col_data = false
        read_offline_list_data = false                 
        $('#role_message').html('KivTech Development Publish')

        readDocumentDataAsync(document_ID)
      } else {
        readDocumentDataAsync(document_ID)
      }

      
    } else {

      readDocumentDataAsync(document_ID)
    }

  } else {

    if(status == 'true') {
    let userLoginData = getLoginUserData()
    if(userLoginData['ROLE'] == 'DEV') {
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

  // Modify Page Style
  modifyPageStyle()

  hidePleaseWait()

  // Main Filter handling
  mainFilterHandling()

  // Init Filter Variables
  filterInit()

  // HTML Modification functions
 // document.getElementById("header_section").style.display = 'block';
  document.getElementById("main_section").style.display = 'block';
  updateCardLayout('col_section_1')


}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if(isMobileBrowser()) {
    displayOutput('Mobile Browser found!')

    document.getElementById('main_list_container').className = "container-fluid row";
    document.getElementById('filter_section').className = "container-fluid row";

    document.getElementById('filter_hdr').className = "container white-text";
    document.getElementById('filter_reset_btn').className = "container right-align";

    document.getElementById("hdr_title").style.display = 'none';

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

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Model Layout Configuration
function getModelLayoutConfig(){

  /*
  show_model_base_header = true
  show_model_base_button = true
  header_text_layout_position = 'center'
  header_button_layout_position = 'center'
  */
 return [false,false,'left','center']
 
}


// Update Header Image
function updateCardLayout(htmlID) {

  // -------------- Update Layout -----------------------
  var base_layout = ''
  var base_title = ''
  var model_layout = ''

  base_layout = 'CARD_ROW'
  model_layout = 'SQUARE_CARD_IMAGE'
  base_title = ''

  // Here also you can update other html pages also
  //$("#banner_main_header").html("Best Destinations");
  //$("#banner_small_header").html("Enjoy your choice");
  $("#heading_title").html("Destinations");

  document.getElementById('banner_main_image').src = getDirectImageUrl("Images/destinations_bkg.jpg")
  

  // ----------------------------------------------------
  coll_list_data = allDocCmpData[document_ID]
  // Filter Update
  if(is_filter_enable) {
    displayOutput('Update Filter HTML Content.')   
    coll_list_data = filter_doc_data[document_ID]   
  }

  $("#filter_tags").html(getChipIconsFromList(filter_check_value));
  


  var each_list_ref_div_content = '';

  // Read Each Document details and create lsit view 
  for (each_doc_id in coll_list_data) {

    var doc_data = coll_list_data[each_doc_id]

    // Only for visible Content
    if(doc_data['VISIBLE']) {
    // Create Layout according to the Model Layouts  
    var currentmdlContent = modelLayoutSelector_local(model_layout, doc_data, 'FILTERPAGE,edestination,' +  each_doc_id + ',NA')
    each_list_ref_div_content += currentmdlContent
    }

  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML_local(model_layout,base_layout, base_title, each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);

}


// ****************************************************************
// Create complete content according to your inputs
// Here you can do modification
function getCompleteModelContentDetails(doc_details) {

  var html_div_line = ''
  // Change According to the document_ID 

  var header = doc_details['INFO2']
  var content = doc_details['INFO2']

  //$("#page_title").html('Destination');

  
  html_div_line = '<b>' + header  

  return html_div_line
}

// ****************************************************************
// ---------------- FIlter Handling -------------------------------
// ****************************************************************

//Main FIlter Handling
function mainFilterHandling(){
  
  if(filter_fl != 'NA') {
    displayOutput('Main Filter Handling ...')
  // Collect other details
  let filter_op_key= filter_fl.split('_')[0]
  let filter_op_value= [filter_fl.split('_')[1]]
  main_filter_check_value = filter_fl.split('_')[1]
  filter_check_value.push(main_filter_check_value)

  let eachDocMap = {}

  // Filter DOC according to the FIlter OP Key
  for(eachKey in allDocCmpData[document_ID]){
    let eachDoc = allDocCmpData[document_ID][eachKey]

    let op_doc_value = eachDoc[filter_op_key]
    // check for array
    if(!(Array.isArray(op_doc_value))) {
      op_doc_value = [op_doc_value]
    }
    //displayOutput(op_doc_value)

    let status = filter_op_value.some((val) => op_doc_value.indexOf(val) !== -1); 
    if(status) {
      // Details found
      eachDocMap[eachKey] = eachDoc
    }

  } 

  allDocCmpData[document_ID] = eachDocMap

  // Check if empty
 if(Object.keys(eachDocMap).length == 0) {
  document.getElementById("nothing_found_sec").style.display = 'block';
  document.getElementById("main_footer_sec").style.display = 'none';
  document.getElementById("flb_open_filter").style.display = 'none';
} else {
  document.getElementById("nothing_found_sec").style.display = 'none';
  document.getElementById("main_footer_sec").style.display = 'block';
}


}

}

// Open Filter Section
function openFilterSection() {

  window.scrollTo(0, 0);

  filter_check_value = []
  if(main_filter_check_value){filter_check_value.push(main_filter_check_value)}

  document.getElementById("main_list_container").style.display = 'none';
  document.getElementById("flb_open_filter").style.display = 'none';
  document.getElementById("main_footer_sec").style.display = 'none';
  document.getElementById("nothing_found_sec").style.display = 'none';

  document.getElementById("flb_close_filter").style.display = 'block';
  document.getElementById("filter_section").style.display = 'block';

}

// Close Filter Section
function closeFilterSection() {

  window.scrollTo(0, 0);

  document.getElementById("main_list_container").style.display = 'block';
  document.getElementById("flb_open_filter").style.display = 'block';
  document.getElementById("main_footer_sec").style.display = 'block';
  document.getElementById("nothing_found_sec").style.display = 'none';

  document.getElementById("flb_close_filter").style.display = 'none';
  document.getElementById("filter_section").style.display = 'none';

  filterCheckNoContentFound()

}

// Filer Operation
function filterInit(){
  filter_group['LOCATION'] = ['chkbx_filter_1','chkbx_filter_2']
  filter_group['PRICE'] = ['chkbx_filter_3','chkbx_filter_4','chkbx_filter_5','chkbx_filter_6']
  filter_group['DURATION'] = ['chkbx_filter_7','chkbx_filter_8','chkbx_filter_9','chkbx_filter_10','chkbx_filter_11']
  filter_group['ACTIVITIES'] = ['chkbx_filter_12','chkbx_filter_13','chkbx_filter_14','chkbx_filter_15','chkbx_filter_16']
  filter_group['TIME'] = ['chkbx_filter_17','chkbx_filter_18','chkbx_filter_19','chkbx_filter_20']

}

// No Content Found After Apply Filter
function filterCheckNoContentFound(){

  if(is_filter_enable) {
 // Check if empty
 if(Object.keys(coll_list_data).length == 0) {
  document.getElementById("nothing_found_sec").style.display = 'block';
  document.getElementById("main_footer_sec").style.display = 'none';
} else {
  document.getElementById("nothing_found_sec").style.display = 'none';
  document.getElementById("main_footer_sec").style.display = 'block';
}
  }
}

// RESET Filter
function resetFilter(){
   displayOutput('Reset Filter')
   is_filter_enable = false
   filter_check_value = []
   if(main_filter_check_value){filter_check_value.push(main_filter_check_value)}

   updateCardLayout('col_section_1')
   closeFilterSection()

   // Un-Checked all CHeck box
   for(eachGroupKey in filter_group) {
    let filter_details = filter_group[eachGroupKey]

    for(eachIdx in filter_details) {
      let filter_chkbx_id = filter_details[eachIdx]
      // Check Status
      document.getElementById(filter_chkbx_id).checked = false; 
    }

   }

  


}

// APPLY Filter
function applyFilter() {
  displayOutput('Apply Filter')

  let filter_enable_data = {}  
 
  // Read all CHeck box details
  for(eachGroupKey in filter_group) {
    
    let filter_details = filter_group[eachGroupKey]

    //Read Filter chkbox id list
    var checked_value = [];
    for(eachIdx in filter_details) {
      let filter_chkbx_id = filter_details[eachIdx]

      // Check Status
      var status = document.getElementById(filter_chkbx_id).checked;
      var value =  $("#"+filter_chkbx_id+'_val').html();
      if(status) {
        checked_value.push(value)
        filter_check_value.push(value) 
      }

    }

    // Update Checked Value
    filter_enable_data[eachGroupKey] = checked_value   
    
  }

  // Process filter Handling
  processFilterAndRefresh(filter_enable_data)

}

// Process Filter And update Page
function processFilterAndRefresh(filter_data){
   displayOutput('Process Filter Data..')
   //displayOutput(filter_data)

   is_filter_enable = false

     let eachDocMap = {}

     // Read All DOC Details
     for(eachKey in allDocCmpData[document_ID]){
      let eachDoc = allDocCmpData[document_ID][eachKey]
      
      let doc_filter_data = getHashDataList(eachDoc['INFO35'])
      //displayOutput('DOC -> ' + eachKey)    
      

      if(doc_filter_data['ENABLE'] == 'YES') {

        let filter_applied_case_1 = true
        let filter_applied_case_2 = true
        let filter_applied_case_3 = true
        let filter_applied_case_4 = true
        let filter_applied_case_5 = true
      
        // Read Filter Data
        for(eachFilterKey in filter_data) {         
  
          let filterData = filter_data[eachFilterKey]

          // Check Empty List
          if (Array.isArray(filterData) && filterData.length) {           
            
            // -----------------------------------------------------
            // Filter DOC list according to Filter group
            switch(eachFilterKey) {


              case 'LOCATION' : { 
                let case_1_filter_date =  doc_filter_data['LOCATION']
                if(case_1_filter_date.includes(',')){
                  case_1_filter_date = case_1_filter_date.split(',')
                }  else {
                  case_1_filter_date = [case_1_filter_date]
                }
                
                //displayOutput('LOCATION ->')
                //displayOutput(case_1_filter_date)
                //displayOutput(filterData)             

                // Compare Both Array
                filter_applied_case_1 = case_1_filter_date.some((val) => filterData.indexOf(val) !== -1);                 
                  
                break;
              }


              case 'PRICE' : {
                let case_2_filter_date =  doc_filter_data['PRICE'] 
                if(case_2_filter_date.includes(',')){
                  case_2_filter_date = case_2_filter_date.split(',')
                }  else {
                  case_2_filter_date = [case_2_filter_date]
                } 
                
                //displayOutput('PRICE ->')
                //displayOutput(case_2_filter_date)
                //displayOutput(filterData)

                filter_applied_case_2 = case_2_filter_date.some((val) => filterData.indexOf(val) !== -1); 
                  
                break;
              }


              case 'DURATION' : {

                let case_3_filter_date =  doc_filter_data['DURATION']  
                if(case_3_filter_date.includes(',')){
                  case_3_filter_date = case_3_filter_date.split(',')
                }  else {
                  case_3_filter_date = [case_3_filter_date]
                } 
                
                //displayOutput('DURATION ->')
                //displayOutput(case_3_filter_date)
                //displayOutput(filterData)

                filter_applied_case_3 = case_3_filter_date.some((val) => filterData.indexOf(val) !== -1); 
                  
                break;
              }



              case 'ACTIVITIES' : {

                let case_4_filter_date =  doc_filter_data['ACTIVITIES'] 
                if(case_4_filter_date.includes(',')){
                  case_4_filter_date = case_4_filter_date.split(',')
                }  else {
                  case_4_filter_date = [case_4_filter_date]
                }  
                
                //displayOutput('ACTIVITIES ->')
                //displayOutput(case_4_filter_date)
                //displayOutput(filterData)

                filter_applied_case_4 = case_4_filter_date.some((val) => filterData.indexOf(val) !== -1); 
                  
                break;
              }


              case 'TIME' : {

                let case_5_filter_date =  doc_filter_data['TIME']  
                if(case_5_filter_date.includes(',')){
                  case_5_filter_date = case_5_filter_date.split(',')
                }  else {
                  case_5_filter_date = [case_5_filter_date]
                } 
                
                //displayOutput('TIME ->')
                //displayOutput(case_5_filter_date)
                //displayOutput(filterData)

                filter_applied_case_5 = case_5_filter_date.some((val) => filterData.indexOf(val) !== -1); 
                  
                break;
              }

              default : {
                break;
              }
            }           

            // ----------------------------------------------
          }     
        }
      

        // Check IS Filter applied on DOC or Not
        if(filter_applied_case_1 && filter_applied_case_2 && filter_applied_case_3 && filter_applied_case_4 && filter_applied_case_5) {
          displayOutput(eachKey+' > Filter Applied') 
          is_filter_enable = true
          eachDocMap[eachKey] = eachDoc
        } else {          
          displayOutput(eachKey+' > Filter Not Applied')         
        }

      } else {
        displayOutput('Filter Disabled !!')
        eachDocMap[eachKey] = eachDoc
      }
   
  }

  // Update HTML Page
  filter_doc_data[document_ID] = eachDocMap

  if (Array.isArray(filter_check_value) && filter_check_value.length) { 
    is_filter_enable = true
  } else {
    is_filter_enable = false
  }
  
  
  updateCardLayout('col_section_1')
  closeFilterSection()

}


// *****************************************************************

// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector - Local
function modelLayoutSelector_local(mdl_layout, doc_details, mdl_action_details) {

  var mdl_html_line = ''

  //Information Details
  var complete_content = getCompleteModelContentDetails(doc_details)

  var mdl_map_details = {}
  mdl_map_details['ID'] = doc_details['ID']
  mdl_map_details['IMAGE'] = doc_details['IMAGE']
  mdl_map_details['CONTENT'] = complete_content
  mdl_map_details['ACTION'] = mdl_action_details


  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard_local(mdl_map_details)
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard_local(mdl_map_details)
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE') {

    mdl_html_line = modelLytSquareCardImage_local(mdl_map_details)
  }

  return mdl_html_line;

}

// Model Square Card Horizontal - Local
function modelLytSquareHoriCard_local(mdl_map_details) {

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

// Model Square Card - Local
function modelLytSquareCard_local(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT'] 

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 10px;">\
                    <div class="card-image z-depth-2" style="height: 200px; max-height: 200px; widht: 500px; max-width: 500px; border-radius: 10px 10px 0px 0px;">\
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

// Model Square Card with Image Only - Local
function modelLytSquareCardImage_local(mdl_map_details) {

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

// Create Base Layout - Local
function getBaseLayoutHTML_local(mdl_coll,base_layout, header, model_content) {

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
    var mdl_lyt_config = getModelLayoutConfig()
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
    // -----------------------------------------------------

    base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                      </div>\
                  </div><div class="row">' + model_content + '</div>';
  }


  // **********************************************************************
  // ---------------------- CARD_ROW_HORIZ -------------------------------
  // **********************************************************************

  if (base_layout == 'CARD_ROW_HORIZ') {

     // ------------- Configuration -------------------------
     var mdl_lyt_config = getModelLayoutConfig()
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
     // -----------------------------------------------------
     base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                    </div>\
                  </div>' + model_content;    

  }


  return base_layout_html;


}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

}

