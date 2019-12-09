// *******************************************************************************
// SCRIPT :
//        - This script contains Base Datasets
// *******************************************************************************

// *********************************************************************
// BASE Document Data Set
// *********************************************************************
function getNewFieldDataSet(control){

	// ----------- INFO ----------------
	var eachInfoField = {
		KEY: "Key Name",
		VALUE: "Value",
		TYPE: "TEXT",
		MODE: "INFO",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- MULTI_TEXT ----------------
	var eachMultiInfoField = {
		KEY: "Key Name",
		VALUE: "Value",
		TYPE: "MULTI_TEXT",
		MODE: "INFO",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- BOOL ----------------
    var eachBoolInfoField = {
        KEY: "Key Name",
        VALUE: "NO",
        TYPE: "BOOL",
        MODE: "INFO",
        ROLE: "ADMIN",
		PUBLISH: "YES",
        DESC: "Description"
    };


    // ----------- NUM ----------------
    var eachNumInfoField = {
        KEY: "Key Name",
        VALUE: "0",
        TYPE: "NUM",
        MODE: "INFO",
        ROLE: "ADMIN",
		PUBLISH: "YES",
        DESC: "Description"
    };

	// ----------- LISTREF ----------------
	var eachListRefField = {
		KEY: "Key",
		VALUE: {
			INFO1 : {
				KEY: "Base Layout",
				DESC: "Specify Base Layout Format <br> CARD_ROW : Display Card in ROW format each row contain three card.<br>\
				CARD_ROW_HORIZ : Display card in horizontal format.",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Base Image Ref",
				DESC: "Base layout Image reference",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Base Title",
				DESC: "Title Name",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Base Description",
				DESC: "Complete Base Description",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO5 : {
				KEY: "Model Collection",
				DESC: "Specify model collection ID name",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO6 : {
				KEY: "Model Documents",
				DESC: "Specify collection documents list details",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO7 : {
				KEY: "Model Layout",
				DESC: "Specify model layout format <br> SQUARE_CARD : Show square card.<br>\
				SQUARE_CARD_HORIZ : Show horizontal card",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO8 : {
				KEY: "Model Info",
				DESC: "Specify each docuemts Info fields details",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO9 : {
				KEY: "Model Click",
				DESC: "Specify click operation on model. Ex NEWPAGE,page_name,details1,detail2,detail3 etc.",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO10 : {
				KEY: "Visible Status",
				DESC: "Do you want to show complete layout YES/NO",
				VALUE: "YES",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		MODE: "LISTREF",
		DESC: "Description"
	};


	// ----------- IMAGE ----------------
	var eachImageField = {
		KEY: "Key",
		VALUE: {
			INFO1 : {
				KEY: "Image Name",
				DESC: "Image Download URL from Database",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT_DIS"
			},
			INFO2 : {
				KEY: "Image DB Name",
				DESC: "Image name into Database",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT_DIS"
			},
			INFO3 : {
				KEY: "External Url",
				DESC: "Please specify external image URL any url from web",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Visible",
				DESC: "Do you want to show Image YES/NO",
				VALUE: "YES",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO5 : {
				KEY: "Source",
				DESC: "Do you want to show image from Database YES/NO , No means you are showing image from external URL.",
				VALUE: "YES",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO6 : {
				KEY: "Image Description",
				DESC: "Your Image Description",
				VALUE: "Details",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO7 : {
				KEY: "Extra Control",
				DESC: "Some more Controls.",
				VALUE: "Details",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			}
		},
		TYPE: "TREE",
		MODE: "IMAGE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "For Development Purpose."
	};

	// ----------- IMAGE PRODUCTION ----------------
	var eachImageProField = {
		KEY: "Key",
		VALUE: {
			INFO1 : {
				KEY: "Image Name",
				DESC: "Image Download URL from Database",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT_DIS"
			},
			INFO2 : {
				KEY: "Image DB Name",
				DESC: "Image name into Database",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT_DIS"
			},
			INFO3 : {
				KEY: "External Url",
				DESC: "Please specify external image URL any url from web",
				VALUE: "NA",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Visible",
				DESC: "Do you want to show Image YES/NO",
				VALUE: "YES",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO5 : {
				KEY: "Source",
				DESC: "Do you want to show image from Database YES/NO , No means you are showing image from external URL.",
				VALUE: "YES",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO6 : {
				KEY: "Image Description",
				DESC: "Your Image Description",
				VALUE: "Details",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO7 : {
				KEY: "Extra Control",
				DESC: "Some more Controls.",
				VALUE: "Details",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			}
		},
		TYPE: "TREE",
		MODE: "IMAGE_PRO",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "For Production Purpose."
	};


	// ----------- TREE ----------------
	// ---------- For Itinerary ---------
	var eachTreeField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Day",
				DESC: "Day details like Day-1 ect.",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Header",
				DESC: "Header details",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Tags",
				DESC: "Specify tags details. Use ,",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Complete",
				DESC: "Specify ",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "MULTI_TEXT"
			},
			INFO5 : {
				KEY: "Images Details",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO6 : {
				KEY: "Status",
				DESC: "Do you want to use it or not YES/NO",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		MODE: "TREE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- TREE ----------------
	/* ---------- For Places Details ---------
	var eachTreeField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Place",
				DESC: "Places Name",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Complete",
				DESC: "Place Complete Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "MULTI_TEXT"
			},
			INFO3 : {
				KEY: "Tags",
				DESC: "Tags Details",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Images",
				DESC: "Image Ref details",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO5 : {
				KEY: "Extra",
				DESC: "Something extra if required.",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "MULTI_TEXT"
			}
		},
		TYPE: "TREE",
		MODE: "TREE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};
	*/



	// ----------- FORM ----------------
	var eachFormField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Form Name",
				DESC: "Description",
				VALUE: "Name",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Form Desc",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Form Mode",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Extra",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			}
		},
		TYPE: "TREE",
		MODE: "FORM",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- MAIN ----------------
	var eachMainField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "ID",
				DESC: "Description",
				VALUE: "Name",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "NAME",
				DESC: "Description",
				VALUE: "Name",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Description",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "MULTI_TEXT"
			},
			INFO4 : {
				KEY: "Owner",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO5 : {
				KEY: "Visible",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		MODE: "MAIN",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};
	
	
	switch(control){
		case 'MAIN':
		return eachMainField;
		break;
		
		case 'INFO':
		return eachInfoField;
		break;

		case 'MULTI_TEXT':
		return eachMultiInfoField;
		break;

		case 'BOOL':
        return eachBoolInfoField;
        break;

        case 'NUM':
        return eachNumInfoField;
        break;
		
		case 'LISTREF':
		return eachListRefField;
		break;
		
		case 'IMAGE':
		return eachImageField;
		break;

		case 'IMAGE_PRO':
		return eachImageProField;
		break;
		
		case 'TREE':
		return eachTreeField;
		break;

		case 'FORM':
		return eachFormField;
		break;

	}
}

function getCollectionMainDocSet(){

	 // ----------- MAIN ----------------

	 var eachMainField = {

		INFO0 : {
							KEY: "Collection ID",
							VALUE: "Value",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Description"
				},

	    INFO1 : {
                            KEY: "Collection Name",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
	            },

	    INFO2 : {
        	                KEY: "Collection Description",
                            VALUE: "Value",
                            TYPE: "MULTI_TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
        	    },

        INFO3 : {
                            KEY: "Visible",
                            VALUE: "Value",
                            TYPE: "BOOL",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

        INFO4 : {
                            KEY: "Owner Details",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

        INFO5 : {
                            KEY: "Link Activity",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },


        INFO6 : {
                            KEY: "Total Document",
                            VALUE: "0",
                            TYPE: "NUM",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

         INFO7 : {
                            KEY: "Collection ADMIN Mode",
                            VALUE: "YES",
                            TYPE: "BOOL",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

          INFO8 : {
							KEY: "Display Image Tab",
							VALUE: "YES",
							TYPE: "BOOL",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Description"
				},

           INFO9 : {
							KEY: "Display Multi Tab",
							VALUE: "YES",
							TYPE: "BOOL",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Description"
					},

           INFO10 : {
							KEY: "Display Form Tab",
							VALUE: "YES",
							TYPE: "BOOL",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Description"
					},
		 // --------- Documents Related Fields --------------
		  INFO11 : {
							KEY: "Collection personal Documents",
							VALUE: "INFO0",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Document Display ID INFO details."
					},
		INFO12 : {
							KEY: "Document Published Options",
							VALUE: "INFO1",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Document Published options INFOR details."
					},
		INFO13 : {
							KEY: "Document List Data INFO Options",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Document List Data INFO Options Details. Ex : INFO1,INFO2,INFO3"
					},
		INFO14 : {
							KEY: "Default Image URL",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Collection Default Image URL."
					},
		
		INFO15 : {
							KEY: "LIST REF INFO Details",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Documents LIST REF infor fields details. Ex : INFO1,INFO2,INFO3"
					},
		INFO16 : {
							KEY: "IMAGE INFO Details",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Documents IMAGE infor fields details. Ex : INFO1,INFO2,INFO3"
					},
		INFO17 : {
							KEY: "IMAGE PRO INFO Details",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Documents IMAGE infor fields details. Ex : INFO1,INFO2,INFO3"
					},
		INFO18 : {
							KEY: "MULTI INFO Details",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Documents MULTI infor fields details. Ex : INFO1,INFO2,INFO3"
					},
		INFO19 : {
							KEY: "FORM INFO Details",
							VALUE: "NA",
							TYPE: "TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Documents FORM infor fields details. Ex : INFO1,INFO2,INFO3"
					},
		INFO20 : {
							KEY: "Documents COMMON DATA",
							VALUE: "NA",
							TYPE: "MULTI_TEXT",
							MODE: "INFO",
							ROLE: "ADMIN",
							PUBLISH: "YES",
							DESC: "Data which is common to all documents."
					},
		INFO21 : {
			KEY: "Config",
			VALUE: "#CONVERTTOARRAY: NA,NA #CONFIG2: config 2",
			TYPE: "MULTI_TEXT",
			MODE: "INFO",
			ROLE: "ADMIN",
			PUBLISH: "YES",
			DESC: "Global Config"
	     }

	};

	return eachMainField;

  

}

// *******************************************************
// ---------------- END -------------------
// *******************************************************