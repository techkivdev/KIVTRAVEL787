// *******************************************************************************
// SCRIPT : history.js
//
//
// Author : Vivek Thakur
// Date : 4/2/2020
// *******************************************************************************


$('.dropdown-trigger').dropdown();

let filter_action = 'RESENT'

updateHistorySection()


// Update History Section
function updateHistorySection() {  

  let content = '<ul class="collection">'


  // Get Local Data
  let page_history_data = JSON.parse(localStorage.getItem('PAGEDATA'));
  //console.log(page_history_data)  

  // Check for null
  if(page_history_data == null){

    $('#user_history').html('<h1>Empty List</h1>')

  }
  else 
  {

     // Sort Data
     let updated_page_history_data = ''
     if(filter_action == 'MOST') {
      updated_page_history_data = sortHistoryDataByView(page_history_data)
     } else {
      updated_page_history_data = sortHistoryDataByResent(page_history_data)
     }
     

    // Read Each Details
    for(eachidx in updated_page_history_data){
      let eachData = updated_page_history_data[eachidx]
      
      //console.log(eachData)   

     // epackage.html?id=DOC0&fl=NA
     let link =''
     let sub_details = ''
     if(eachData['TYPE'] == 'PACKAGES') {
      link = 'epackage.html?id='+eachData['DOCID']+'&fl=NA'  
      sub_details = eachData['DATE']+' ,  Package'         
     } else if(eachData['TYPE'] == 'DESTINATIONS') {
      link = 'edestination.html?id='+eachData['DOCID']+'&fl=NA' 
      sub_details = eachData['DATE']+' ,  Destination' 
     } else {
      link = 'eplace.html?id='+eachData['DOCID']+'&fl=NA'
      sub_details = eachData['DATE']+' ,  Place' 
     }    
              
      content += '<a href="'+link+'"><li class="collection-item avatar black-text hoverable yellow">\
      <img src="'+eachData['IMAGE']+'" alt="" class="circle">\
      <span class="new badge blue" data-badge-caption="view">'+String(eachData['VIEWCNT'])+'</span>\
      <span class="title black-text"><b>'+eachData['NAME']+'</b></span>\
      <p class="grey-text">'+sub_details+'</p>\
    </li></a><br>'

    }
    content += '</ul>'            
    $('#user_history').html(content)

  }  


  window.scrollTo(0, 0);


}

// Clear Complete History
function clearHistory(){

  localStorage.setItem('PAGEDATA', null);

  updateHistorySection()

}

// Sort history Data by date
function sortHistoryDataByResent(page_history_data){
  
  // Sort link :
  // https://stackoverflow.com/questions/1069666/sorting-object-property-by-values

// Create Array
let page_history_data_array = []

for(eachKey in page_history_data['DATA']) {
    let eachData = page_history_data['DATA'][eachKey]
    page_history_data_array.push(eachData)
}

// use slice() to copy the array and not just make a reference
var byDateData = page_history_data_array.slice(0);
byDateData.sort(function(a,b) {
    return b.DATEID - a.DATEID;
});

return byDateData

}

// Sort history Data by View
function sortHistoryDataByView(page_history_data) {

  // Create Array
let page_history_data_array = []

for(eachKey in page_history_data['DATA']) {
    let eachData = page_history_data['DATA'][eachKey]
    page_history_data_array.push(eachData)
}

// use slice() to copy the array and not just make a reference
var byDateData = page_history_data_array.slice(0);
byDateData.sort(function(a,b) {
    return b.VIEWCNT - a.VIEWCNT;
});

return byDateData

}

// Filter Content
function filterHistory(details){
 
  filter_action = details.split('#')[0]

  $('#history_filter_drop_down').html('<i class="material-icons left">filter_list</i>' + details.split('#')[1])

  updateHistorySection()

}