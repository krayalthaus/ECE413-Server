function sendReqForAccountInfo() {
   $.ajax({
      url: '/users/account',
      type: 'GET',
      headers: { 'x-auth': window.localStorage.getItem("authToken") },
      responseType: 'json',
      success: accountInfoSuccess,
      error: accountInfoError
   });
}

function sendReqForActivityInfo() {
    $.ajax({
        url: '/users/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: showActivityData,
        error: activityError
    });
}

// function sendreqforactivity() {
//    $.ajax({
//       url: '/photon/hit',
//       type: 'GET',
//       //headers: { 'x-auth': window.localStorage.getItem("authToken") },
//       responseType: 'json',
//       success: function (data, textStatus, jqXHR) {
//            // Add new device to the device list

//            $("#activity").after("<li class='collection-item'>ID: " +
//            $("#deviceId").val() + ", Date: " + data["date"] + "</li>");
//           $("#activity").after("<li class='collection-item'>longitute: " +
//            data["longitute"] + ", latitude: " + data["latitude"] + "</li>");
//           $("#activity").after("<li class='collection-item'>exposure: " +
//            data["exposure"] + ", speed: " + data["speed"] + "</li>");

//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             var response = JSON.parse(jqXHR.responseText);
//             $("#error").html("Error: " + response.message);
//             $("#error").show();
//         }
//    });
// }

function activityError(jqXHR, status, errorThrown) {
       $("#error").html("Error: " + status.message);
       $("#error").show();
}


   function accountInfoSuccess(data, textSatus, jqXHR) {
   $("#email").html(data.email);
   $("#fullName").html(data.fullName);
   $("#device").html(data.device);
   $("#lastAccess").html(data.lastAccess);
   $("#main").show();
   
   // Add the devices to the list before the list item for the add device button (link)
   for (var device of data.devices) {
      $("#addDeviceForm").before("<li class='collection-item'>ID: " +
        device.deviceId + ", APIKEY: " + device.apikey + "</li>")
   }

}

function showActivityData( data, textStatus, jqXHR) {

    console.log("show function");

    if (!data.activities) {
        return;
    }

    for (var activity of data.activities) {
            console.log("inner loop");
        $("#activity").after("<li class='collection-item'>Device ID: " + 
        activity.deviceId + "speed: " + activity.speed + "/n" +
        "latitude: " + activity.latitude + "/n" + "longitude: " + activity.longitude + "/n" +
        "exposure: " + activity.exposure + "/n" + "</li>");

    }
    
}

function accountInfoError(jqXHR, textStatus, errorThrown) {
   // If authentication error, delete the authToken 
   // redirect user to sign-in page (which is index.html)
   if( jqXHR.status === 401 ) {
      console.log("Invalid auth token");
      window.localStorage.removeItem("authToken");
      window.location.replace("index.html");
   } 
   else {
     $("#error").html("Error: " + status.message);
     $("#error").show();
   } 
}

// Registers the specified device with the server.
function registerDevice() {
    $.ajax({
        url: '/device/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
           // Add new device to the device list
           $("#addDeviceForm").before("<li class='collection-item'>ID: " +
           $("#deviceId").val() + ", APIKEY: " + data["apikey"] + "</li>")
           hideAddDeviceForm();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
}

// Show add device form and hide the add device button (really a link)
function showAddDeviceForm() {
   $("#deviceId").val("");           // Clear the input for the device ID
   $("#addDeviceControl").hide();    // Hide the add device link
   $("#addDeviceForm").slideDown();  // Show the add device form
}

// Hides the add device form and shows the add device button (link)
function hideAddDeviceForm() {
   $("#addDeviceControl").show();  // Hide the add device link
   $("#addDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}

// Handle authentication on page load
$(function() {
   // If there's no authToekn stored, redirect user to 
   // the sign-in page (which is index.html)
   if (!window.localStorage.getItem("authToken")) {
      window.location.replace("index.html");
   }
   else {
      sendReqForAccountInfo();
   }
   
   // Register event listeners
   $("#addDevice").click(showAddDeviceForm);
   $("#registerDevice").click(registerDevice);   
   $("#cancel").click(hideAddDeviceForm);   
 $("#activity").click(sendReqForActivityInfo); 
   //new-------------click-call function --photon hit
});
