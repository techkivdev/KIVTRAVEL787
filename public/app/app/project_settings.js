// *******************************************************************************
// SCRIPT :
//        - This script for project settings
//        - Create new collection
//        - Create new Document
//        - Uodate Document ADMIN fields
//        - Update Project other settings
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
// *********************************************


// ************** GLOBAL VARIABLES *******************
var allDocData = {};  // Complete Collection Data
var lang_list = {};

var total_doc = 0;
var doc_count = 0;

var del_docCount = 0;
var total_doc_before_del = 0;

// For Collecting Data
var collectionData = {}


// ***************************************************
// ---------- Global Informations ---------------
// DEV or ADMIN
var user_role = 'DEV';

// ***************************************************

// **********************************************
// -------------- Read Data from Database ------
// **********************************************
function readProjectDataFromDatabase() {

  showPleaseWait();

  var totaldocCount = 0;

  db.collection(basePath).get().then((querySnapshot) => {
    console.log("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      hidePleaseWait();

      alert('No Record Found !!')

    } else {

      totaldocCount = querySnapshot.size

      var lang_nav_tabs = '';

      var docCount = 0;

      // Read Each Documents
      querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} =>`, doc.data());
        allDocData[doc.id] = doc.data();

        console.log(doc.id)
        lang_list[doc.id] = 'STATUS';

        // Create Language Tabs
        // Create Tabs Information Also
        // Read Lang Collection information also
        lang_nav_tabs += createLanguageHTMLtabsFormat(doc.id, doc.data());



        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {
          hidePleaseWait();
        }



      });

      // Update HTML Page
      $("#controlContent1").html(lang_nav_tabs);

      // Disable all Lang Tabs
      for (var keys in lang_list) {
        document.getElementById('card_' + keys).style.display = "none";
      }


    }

  });

}//EOF

// ******************************************
// ------- Create HTML Format ---------------
// ******************************************

// Create Language Tabs
function createLanguageHTMLtabsFormat(docID, docData) {

  var html = '';

  html += '<div id="card_' + docID + '" class="card">\n';
  html += '<div class="card-body">\n';

  html += '<p>' + docID + '</p>\n';

  html += '<ul class="nav nav-tabs" id="' + docID + '_collTab" role="tablist">\n';
  html += '<li class="nav-item">\n';
  html += '<a class="nav-link active" id="' + docID + '_home-tab" data-toggle="tab" href="#home_' + docID + '" role="tab" aria-controls="home" aria-selected="true">HOME</a>\n';
  html += '</li>\n';
  html += '<li class="nav-item">\n';
  html += '<a class="nav-link" id="' + docID + '_options-tab" data-toggle="tab" href="#options_' + docID + '" role="tab" aria-controls="options" aria-selected="false">OPTIONS</a>\n';
  html += '</li>\n';

  html += '</ul>\n';
  html += '<div class="tab-content" id="' + docID + '_collTabContent">\n';


  // ----------------------------------------------
  // ----------------- HOME -------------------
  // ----------------------------------------------

  html += '<div class="tab-pane fade show active" id="home_' + docID + '" role="tabpanel" aria-labelledby="home-tab"><br>\n';

  // Create all Collection Cards

  var collection_details = docData['COLLECTION_LIST'];
  //console.log(collection_details);

  html += '<div class="row">\n';

  for (var each_coll_key in collection_details) {

    var coll_details = collection_details[each_coll_key].split('#');

    if (coll_details[0] == "YES") {

      // -------------- Add Collection Card -----------------
      html += '<div class="col">\n';
      html += '<div class="card border-dark bg-light mb-3" style="width: 18rem;">\n';
      html += '<div class="card-body">\n';
      html += '<h5 class="card-title">' + coll_details[2] + '</h5>\n';
      html += '<p class="card-text">' + coll_details[3] + '</p>\n';
      html += '<p class="card-text"><b>Total Documents : </b>' + coll_details[4] + '</p>\n';

      html += '<div class="text-right">\n';
      html += '<input type="button" id="' + docID + '_MANAGE_BTN' + '" class="btn btn-info" value="MANAGE" onclick="manageCollectionContent(\'' + docID + "#" + coll_details[1] + '\')" />';
      html += '</div>\n';

      html += '</div>\n';
      html += '</div>\n';
      html += '</div>\n';
    }

    // ----------------------------------------------------

  }

  html += '</div>\n';

  html += '</div>\n'; // Tab end


  // ----------------------------------------------
  // ----------------- OPTIONS -------------------
  // ----------------------------------------------

  html += '<div class="tab-pane fade" id="options_' + docID + '" role="tabpanel" aria-labelledby="options-tab">\n';

  if (user_role == 'DEV') {

    html += '<br>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">NAME</label>\n';
    html += '<input type="text" onkeyup="this.value = this.value.toUpperCase();" class="form-control" id="' + docID + '_lang_name" required value="' + docData['NAME'] + '">\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">LANGUAGE</label>\n';
    html += '<input type="text" onkeyup="this.value = this.value.toUpperCase();" class="form-control" id="' + docID + '_lang_language" required value="' + docData['LANGUAGE'] + '">\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Description</label>\n';
    html += '<input type="text" onkeyup="this.value = this.value.toUpperCase();" class="form-control" id="' + docID + '_lang_desc" required value="' + docData['DESC'] + '">\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Enable Status</label>\n';
    html += '<input type="text" onkeyup="this.value = this.value.toUpperCase();" class="form-control" id="' + docID + '_lang_en_status" required value="' + docData['EN_STATUS'] + '">\n';
    html += '</div>\n';


    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Collection 1 Information</label>\n';
    html += '<textarea class="form-control" rows="3" id="' + docID + '_lang_coll_1">' + docData['COLLECTION_LIST']['COLL1'] + '</textarea>\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Collection 2 Information</label>\n';
    html += '<textarea class="form-control" rows="3" id="' + docID + '_lang_coll_2">' + docData['COLLECTION_LIST']['COLL2'] + '</textarea>\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Collection 3 Information</label>\n';
    html += '<textarea class="form-control" rows="3" id="' + docID + '_lang_coll_3">' + docData['COLLECTION_LIST']['COLL3'] + '</textarea>\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Collection 4 Information</label>\n';
    html += '<textarea class="form-control" rows="3" id="' + docID + '_lang_coll_4">' + docData['COLLECTION_LIST']['COLL4'] + '</textarea>\n';
    html += '</div>\n';

    html += '<div class="form-group">\n';
    html += '<label for="coll_name">Collection 5 Information</label>\n';
    html += '<textarea class="form-control" rows="3" id="' + docID + '_lang_coll_5">' + docData['COLLECTION_LIST']['COLL5'] + '</textarea>\n';
    html += '</div>\n';



    html += '<br>\n';
    html += '<div class="text-right">\n';
    html += '<br><input type="button" id="' + docID + '_UPDATE_LANG_BTN' + '" class="btn btn-primary" value="Update" onclick="updateLangDetails(\'' + docID + '\')" />';
    html += '</div>\n';


    html += '</div>\n';

  } else {
    html += '<br><p><h2>No Options</h2></p>\n';
  }



  html += '</div>\n';

  // ---------- Card End ----------
  html += '</div>\n';
  html += '</div>\n';

  return html;

}//EOF

// ************************************************
// Validate Admin role first
// ************************************************
function validateAdminRoles() {

  showPleaseWait()

  // Change Path According to the project
  var userDataPath = baseProductionPrivatePath + 'USER/ALLUSER'

  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      console.log('User login !!')
      let uuid = user.uid;

      // Check User Doc Exist or Not
      let ref = db.collection(userDataPath).doc(uuid);
      let getDoc = ref.get()
        .then(doc => {

          if (!doc.exists) {
            console.log('No such document!');
            validationFailed()

          } else {
            console.log('User Data already present.');
            let userData = doc.data()

            // Only for ADMIN and DEV
            user_role = userData['ROLE']
            if (userData['ROLE'] != 'USER') {
              // Validation Done
              console.log('Validation Passed !!')

              readProjectDataFromDatabase()


            } else {
              validationFailed()
            }




          }
        })
        .catch(err => {
          console.log('Error getting document', err);
          validationFailed()

        });


    } else {
      // User is signed out.
      console.log('User logout !!')
      validationFailed()

    }
  }, function (error) {
    console.log(error);
    validationFailed()

  });

}

// Validation Failed
function validationFailed() {
  console.log('Validation Failed !!')
  hidePleaseWait();  

  document.getElementById("project_content_container").style.display = 'none';
}

// ************************************
// Call Function when page loaded
// ************************************
// Bypass for first time use
if(bypass_validation_check) {
   console.log('By pass validation check.')
   readProjectDataFromDatabase()
} else {
   validateAdminRoles();
}


// ***************************************************
// --------- ADD New Language -----------------
// **************************************************
function addNewLanguage(value) {

  var lang_doc = {
    NAME: 'Name',
    LANGUAGE: 'EN',
    DESC: 'Description',
    EN_STATUS: 'YES',
    COLLECTION_LIST: {
      COLL1: 'YES#COLLECTION1#COLLECTION1#Complete Description#10',
      COLL2: 'YES#COLLECTION2#COLLECTION2#Complete Description#10',
      COLL3: 'YES#COLLECTION3#COLLECTION3#Complete Description#10',
      COLL4: 'YES#COLLECTION4#COLLECTION4#Complete Description#10',
      COLL5: 'YES#COLLECTION5#COLLECTION5#Complete Description#10'
    }
  };

  var db_doc = {
    NAME: value,
    DESC: 'Complete Description',
    ENABLE: true,
    LANG_LIST: 'CORE',
    OWNER: 'Owner Name'
  }

  var coll_base_path = basePath;
  if (value == 'PRODUCTION') {
    coll_base_path = baseProductionPath;

    lang_doc = {
      NAME: 'Name',
      LANGUAGE: 'EN',
    };
  }

  var newLang = prompt("What is New Language Name ?");
  if (newLang != null) {
    if (newLang != '') {

      newLang = newLang.toUpperCase();

      lang_doc['NAME'] = newLang;

      // Create New Language in Database
      doc_count = 0;
      total_doc = 2;

      showPleaseWait();

      writeDocument('DATABASE', value, db_doc, 'NA');

      writeDocument(coll_base_path, newLang, lang_doc, newLang + ' : Created !!');


    }
  }


}//EOF


// ------- Update Language Details ------------------
function updateLangDetails(value) {

  console.log(value)

  // Update Information
  var lang_name = $('#' + value + '_lang_name').val();
  var lang_language = $('#' + value + '_lang_language').val();
  var lang_desc = $('#' + value + '_lang_desc').val();
  var lang_en_status = $('#' + value + '_lang_en_status').val();
  var lang_coll_1 = $('#' + value + '_lang_coll_1').val();
  var lang_coll_2 = $('#' + value + '_lang_coll_2').val();
  var lang_coll_3 = $('#' + value + '_lang_coll_3').val();
  var lang_coll_4 = $('#' + value + '_lang_coll_4').val();
  var lang_coll_5 = $('#' + value + '_lang_coll_5').val();

  var lang_doc = {
    NAME: lang_name,
    LANGUAGE: lang_language,
    DESC: lang_desc,
    EN_STATUS: lang_en_status,
    COLLECTION_LIST: {
      COLL1: lang_coll_1,
      COLL2: lang_coll_2,
      COLL3: lang_coll_3,
      COLL4: lang_coll_4,
      COLL5: lang_coll_5
    }
  };

  doc_count = 0;
  total_doc = 1;

  showPleaseWait();

  writeDocument(basePath, value, lang_doc, value + ' : Updated !!');

}



// *********************************************************************
// Create New Collection
// Data Sets for each document
// *********************************************************************
function newCollectionDataSetForEachDocument(all_data_set_count) {

  // Complete Collection Data
  var collectionObject = { MAIN: getNewFieldDataSet('MAIN') }

  // Create Info Fields Object
  var i;
  var count = 0;
  if (all_data_set_count['INFO'] > 0) {
    for (i = 0; i < all_data_set_count['INFO']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('INFO');
    }
  }

  if (all_data_set_count['MULTI_TEXT'] > 0) {
    for (i = 0; i < all_data_set_count['MULTI_TEXT']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('MULTI_TEXT');
    }
  }

  if (all_data_set_count['BOOL'] > 0) {
    for (i = 0; i < all_data_set_count['BOOL']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('BOOL');
    }
  }

  if (all_data_set_count['NUM'] > 0) {
    for (i = 0; i < all_data_set_count['NUM']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('NUM');
    }
  }

  if (all_data_set_count['LISTREF'] > 0) {
    for (i = 0; i < all_data_set_count['LISTREF']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('LISTREF');
    }
  }

  if (all_data_set_count['IMAGE'] > 0) {
    for (i = 0; i < all_data_set_count['IMAGE']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('IMAGE');
      collectionObject["INFO" + count++] = getNewFieldDataSet('IMAGE_PRO');
    }
  }

  /*
  if (all_data_set_count['IMAGE_PRO'] > 0) {
		for (i = 0; i < all_data_set_count['IMAGE_PRO']; i++) {
		  collectionObject["INFO"+count++] = getNewFieldDataSet('IMAGE_PRO');
		}
	}
  */

  if (all_data_set_count['TREE'] > 0) {
    for (i = 0; i < all_data_set_count['TREE']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('TREE');
    }
  }

  if (all_data_set_count['FORM'] > 0) {
    for (i = 0; i < all_data_set_count['FORM']; i++) {
      collectionObject["INFO" + count++] = getNewFieldDataSet('FORM');
    }
  }

  return collectionObject;
}


// ********************************************************************
// ------------------- async Function ---------------------------------
// ********************************************************************

// ----------- Write Document Into Database ------------------
async function writeDocument(collPath, docValue, dbDataSet, message) {

  var writeOperation = await db.collection(collPath).doc(docValue).set(dbDataSet);
  //now this code is reached after that async write

  console.log(docValue + '  Doc Created !!');

  doc_count = doc_count + 1;

  console.log('Counter : ' + doc_count);
  console.log('Total Doc : ' + total_doc);

  if (total_doc == doc_count) {
    hidePleaseWait();
    alert(message);
  }


}

// ----------- Delete Document Into Database ------------------
async function deleteDocument(collPath, docValue, message) {

  let deleteDoc = await db.collection(collPath).doc(docValue).delete();
  //now this code is reached after that async write

  console.log(docValue + 'Document Deleted !!')
  del_docCount = del_docCount + 1;
  console.log('Counter : ' + del_docCount.toString())
  console.log('Total Doc : ' + total_doc_before_del.toString() + '\n')

  if (del_docCount == total_doc_before_del) {
    hidePleaseWait();
    alert(message);
  }

}

// *********************************************************************	
// EVENT : Create New Collection
// *********************************************************************
$('.createNewColl').on("click", function (event) {
  event.preventDefault();

  var result = confirm("Do you want Create New Collection ?");

  if (result) {


    console.log("Create New Collection !!");

    // Get Value from Page
    //var coll_name = $('#coll_name').val().replace(/<[^>]*>/ig, "");
    var coll_name = $('#coll_name').val();
    var coll_details = $('#coll_details').val();
    var coll_lang = $('#coll_lang').val();

    var coll_totalDocument = $('#coll_totalDocument').val();
    var coll_totalInfo = $('#coll_totalInfo').val();
    var coll_totalMultiInfo = $('#coll_totalMultiInfo').val();
    var coll_totalBoolInfo = $('#coll_totalBoolInfo').val();
    var coll_totalNumInfo = $('#coll_totalNumInfo').val();

    var coll_totalListref = $('#coll_totalListref').val();
    var coll_totalImages = $('#coll_totalImages').val();
    var coll_totalTree = $('#coll_totalTree').val();
    var coll_totalForm = $('#coll_totalForm').val();

    if (coll_totalDocument <= 0 || coll_totalDocument > 30) { coll_totalDocument = 1; }
    if (coll_totalInfo <= 0 || coll_totalInfo > 30) { coll_totalInfo = 1; }

    if (coll_totalMultiInfo < 0 || coll_totalMultiInfo > 30) { coll_totalMultiInfo = 0; }
    if (coll_totalBoolInfo < 0 || coll_totalBoolInfo > 30) { coll_totalBoolInfo = 0; }
    if (coll_totalNumInfo < 0 || coll_totalNumInfo > 30) { coll_totalNumInfo = 0; }
    if (coll_totalListref < 0 || coll_totalListref > 30) { coll_totalListref = 0; }
    if (coll_totalImages < 0 || coll_totalImages > 30) { coll_totalImages = 0; }
    if (coll_totalTree < 0 || coll_totalTree > 30) { coll_totalTree = 0; }
    if (coll_totalForm < 0 || coll_totalForm > 30) { coll_totalForm = 0; }

    console.log(' coll_name=' + coll_name);
    console.log(' coll_details=' + coll_details);
    console.log(' coll_lang=' + coll_lang);
    console.log(' coll_totalDocument=' + coll_totalDocument);
    console.log(' coll_totalInfo=' + coll_totalInfo);
    console.log(' coll_totalMultiInfo=' + coll_totalMultiInfo);
    console.log(' coll_totalBoolInfo=' + coll_totalBoolInfo);
    console.log(' coll_totalNumInfo=' + coll_totalNumInfo);
    console.log(' coll_totalListref=' + coll_totalListref);
    console.log(' coll_totalImages=' + coll_totalImages);
    console.log(' coll_totalTree=' + coll_totalTree);
    console.log(' coll_totalForm=' + coll_totalForm);



    // Validate all Data
    if (coll_name != '' && coll_details != '' && coll_lang != '' && coll_totalDocument != '' && coll_totalInfo != '' && coll_totalMultiInfo != '' && coll_totalBoolInfo != '' && coll_totalNumInfo != '' && coll_totalListref != '' &&
      coll_totalImages != '' && coll_totalTree != '' && coll_totalForm != '') {

      // ------------- Create all Data ----------------------

      var i;
      if (coll_totalDocument > 0) {

        showPleaseWait();

        doc_count = 0;
        total_doc = Number(coll_totalDocument) + 1;

        // ----- Create Collection MAIN Document --------------
        //let setDoc = db.collection(basePath + coll_lang+'/'+coll_name).doc('MAIN').set(getCollectionMainDocSet());
        writeDocument(basePath + coll_lang + '/' + coll_name, 'MAIN', getCollectionMainDocSet(), '');

        // ------ Create Each Document ------------
        for (i = 0; i < coll_totalDocument; i++) {

          var data_set_count = {
            INFO: coll_totalInfo,
            MULTI_TEXT: coll_totalMultiInfo,
            BOOL: coll_totalBoolInfo,
            NUM: coll_totalNumInfo,
            LISTREF: coll_totalListref,
            IMAGE: coll_totalImages,
            IMAGE_PRO: coll_totalImages,
            TREE: coll_totalTree,
            FORM: coll_totalForm
          };

          var eachDocumentDataSet = newCollectionDataSetForEachDocument(data_set_count);
          var newDocID = 'DOC' + i;

          // Add a new document in collection
          //let setDoc = db.collection(basePath + coll_lang+'/'+coll_name).doc(newDocID).set(eachDocumentDataSet);
          writeDocument(basePath + coll_lang + '/' + coll_name, newDocID, eachDocumentDataSet, 'New Collection Created !!');


        }

      }

			/*
			for (var key in allCollectionData) {
			   console.log(' name=' + key + ' value=' + allCollectionData[key]);
			   // do some more stuff with obj[key]
			}
			*/


      createNewCollectionForm.reset();

    } else {
      alert('Please fill all details !!');
    }

  }



});

// ------------------------ EVENTS -----------------------------
// *********************************************************************	
// Click event on Admin List group
// ********************************************************************* 
$('#adminList > a').on('click', function (e) {
  e.preventDefault()
  //console.log("You selected " + $(this).data('value'));
  //console.log(Object.keys($(this)).map(function(key){return $(this)[key]}));

  //$(this).tab('show')
})

$('a[data-toggle="list"]').on('shown.bs.tab', function (e) {
  e.target // newly activated tab
  e.relatedTarget // previous active tab
  var res = e.target.toString().split("#");

  console.log("You have selected " + res[1]);

  switch (res[1]) {

    case 'admin_tab_3':

      break;

    default:
      // code block
      break;
  }
})

$("#lang_dropdownMenuOptions a").click(function (e) {
  e.preventDefault(); // cancel the link behaviour
  var selText = $(this).text();
  $("#lang_dropdownMenuButton").text(selText);
  var curr_lang = $("#lang_dropdownMenuButton").text();

  //console.log("You have selected " + curr_lang);
  //console.log(lang_list);

  for (var keys in lang_list) {
    //console.log(keys);
    if (keys == curr_lang) {
      document.getElementById('card_' + keys).style.display = "block";
    } else {
      document.getElementById('card_' + keys).style.display = "none";
    }
  }


});


// **********************************************************
// ------- Update From Backup File  --------------
// *********************************************************

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  function createNewCollectionFromBackupFile() {

    var preview = document.getElementById('newCollectionBackupFileDetails');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader()

    var file_Data = '';

    var textFile = /json.*/;

    if (file.type.match(textFile)) {

      reader.onload = function (event) {
        //preview.innerHTML = event.target.result;
        file_Data = event.target.result;


        var txt = updateCollectionDatabase(file_Data);

        preview.innerHTML = '<br>' + file.name + ' Uploaded !!<br>' + txt;

      }

    } else {
      preview.innerHTML = "<br><span class='error'>It doesn't seem to be a backup file!</span>";
    }
    reader.readAsText(file);

  }
} else {
  alert("Your browser is too old to support HTML5 File API");
}

// Update Database according to the Backup DATA
function updateCollectionDatabase(bkp_data) {

  var BKP_OBJ;
  var ret_txt = '';

  try {

    BKP_OBJ = JSON.parse(bkp_data);

  } catch (e) {
    ret_txt = 'Wrong file format !!'
    return ret_txt;
  }

  // Validate Format
  // VALIDATE: 'FIREPROJECT_VIK_787',
  var vaidate = false;

  if ('VALIDATE' in BKP_OBJ) {
    if (BKP_OBJ['VALIDATE'] == 'FIREPROJECT_VIK_787') {
      vaidate = true;
    }
  }

  if (!vaidate) {
    ret_txt = 'Wrong file format !!'
    return ret_txt;
  }

  console.log(BKP_OBJ);

  var COLLECTION_NAME = BKP_OBJ['COLLECTION_NAME'];
  var LANG = BKP_OBJ['LANG'];
  var BASEPATH = BKP_OBJ['BASEPATH'];

  var BKP_COLL_DATA = BKP_OBJ['DOCDATA'];

  var currCollection = prompt("Are you sure you want to create a new collection from " + COLLECTION_NAME + " backup file.\nPlease enter new Collection Name.");
  if (currCollection != null) {
    if (currCollection != '') {

      COLLECTION_NAME = currCollection.toUpperCase();

      // Create New Collection and Delete Old Collection

      var result = confirm("Your new collection name is : " + COLLECTION_NAME + "\nDo you want to proceed ?");

      if (result) {
        // Check is Collection is Present or Not?

        showPleaseWait();

        db.collection(BASEPATH + LANG + '/' + COLLECTION_NAME).get().then(query => {
          console.log("SIZE : " + query.size);

          if (query.size == 0) {
            console.log(COLLECTION_NAME + " NOT PRESENT !!");

            // Create New DATA Collection
            updateCollectionFromBackup(BASEPATH + LANG + '/' + COLLECTION_NAME, BKP_COLL_DATA);

          } else {

            console.log(COLLECTION_NAME + " PRESENT !!");

            var del_result = confirm(COLLECTION_NAME + " Collection already present.\nFirst you have to delete it and then upload backup data.\nDo you want to DELETE it ?");

            if (del_result) {

              // ----- DELETE CURRENT COLLECTION CONTENT ---
              del_docCount = 0;
              total_doc_before_del = Object.keys(BKP_COLL_DATA).length;

              for (var doc_key in BKP_COLL_DATA) {
                deleteDocument(BASEPATH + LANG + '/' + COLLECTION_NAME, doc_key, COLLECTION_NAME + 'Collection DELETED !!\nNow Upload Backup Content again.');
              }

            } else {
              hidePleaseWait();
            }

          }

        });

        ret_txt = 'Collection Data Updated !!'
        return ret_txt;

      } //EIF



    }
  }



  else {
    ret_txt = 'Updation Cancel !!'
    return ret_txt;
  }

}//EOF

function updateCollectionFromBackup(collection_path, backup_data) {

  doc_count = 0;

  total_doc = Object.keys(backup_data).length;

  //total_doc = backup_data.length;

  // Read Backup Data
  for (var doc_key in backup_data) {
    // Update Into Database
    writeDocument(collection_path, doc_key, backup_data[doc_key], 'Collection Created !!')
  }



}//EOF



// ************** GENERATE DATASET FILE ********************
// 1. Read all <COL>_DATA details
// 2. Generate listdataset.js file
// *********************************************************

// Collect all Collection Data
function collectAllColData() {
  console.log('Collect all Collection Data ...')   
  
  readCollectionData('HOME','col1_msg')
  readCollectionData('DESTINATIONS','col2_msg')
  readCollectionData('PACKAGES','col3_msg')
  readCollectionData('PLACES','col4_msg')
  readCollectionData('LIST','col5_msg')
  

}

// Read Collection Data
function readCollectionData(collection_name,html_tag) {

  $('#'+html_tag).html(collection_name + ' - Progress ....')

  let eachColData = {}
  db.collection(offline_col_base_path + 'CORE' + '/' + collection_name+'_DATA').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        eachColData[doc.id] = doc.data()        
      });
      $('#'+html_tag).html(collection_name + ' - Completed.')
      collectionData[collection_name] = eachColData
    })
    .catch(err => {
      console.log('Error getting documents', err);
      $('#'+html_tag).html(collection_name + ' - Error Found !!')
    });

}


// Generate listdataset file from data
function generateListDataSetFile() {

  // Create Collection Content
  var allcollectionData = {
      VALIDATE: 'FIREPROJECT_VIK_787',      
      LANG: 'CORE',
      PATH: offline_col_base_path,      
      DATA: collectionData
  };

  var collectionBackupData_string = JSON.stringify(allcollectionData);

  let jsCode = 'function getAllCollectionData() { return ' + collectionBackupData_string + '}'

  var filename = "listDataSet.js";

  var blob = new Blob([jsCode], {
      type: "text/plain;charset=utf-8"
  });

  saveAs(blob, filename);

}


// *************************************************************
// --------- Manage Collection Content -------------------------
// *************************************************************

function manageCollectionContent(value) {
  var lang_db_name = value.split("#")[0];
  var collection_name = value.split("#")[1];
  var role = 'DEV';

  console.log("You have selected " + lang_db_name + " : " + collection_name);

  //window.open("http://127.0.0.1:8887/update_collection.html");


  var url = 'update_collection.html?lang_name=' + encodeURIComponent(lang_db_name) + '&coll_name=' + encodeURIComponent(collection_name) + '&role=' + encodeURIComponent(role) + '&fl_action=' + encodeURIComponent('NA') + '&fl_value=' + encodeURIComponent('NA');

  document.location.href = url;


}


// --------------------------- EXTRA ------------------------------
/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait() {

  document.getElementById('project_content_container').style.display = "none";

  var modalLoading = '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false" role="dialog">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4 class="modal-title">Please wait...</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="progress">\
                      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"\
                      aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                      </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
  $(document.body).append(modalLoading);
  $("#pleaseWaitDialog").modal("show");
}

/**
 * Hides "Please wait" overlay. See function showPleaseWait().
 */
function hidePleaseWait() {

  document.getElementById('project_content_container').style.display = "block";

  // Hide progress
  $("#pleaseWaitDialog").modal("hide");
}




// *********************************************************************
// ------------------------- END ---------------------------------
// *********************************************************************