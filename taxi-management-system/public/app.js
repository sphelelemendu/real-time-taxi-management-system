// firebase.auth().onAuthStateChanged(function (user) {
//   debugger;
//   if (user) {

//     var user = firebase.auth().currentUser;
//     var email, uid;
//     console.log("This is the email loggedin = " + email);
//     if (user != null) {
//       firebase.database().ref("/Users/" + user.uid).once('value').then(function (snapshot) {
//         if (snapshot.val().userType == "Admin") {
//           console.log("Loggedin Successfully");
//           email = user.email;
//           uid = user.uid;
//           document.getElementById("login_div").style.display = "none";
//           document.getElementById("content_div").style.display = "block";
//           document.getElementById("user_para").innerHTML = "Welcome " + email;

//           populateBusesTable();
//           populateDriversTable();
//         } else {

//           logout();
//           document.getElementById("login_div").style.display = "block";
//           document.getElementById("content_div").style.display = "none";
//           document.getElementById("email_field").value = "";
//           document.getElementById("password_field").value = "";
//           window.alert("Error: access denied");
//           console.log("Not loggedin");
//         }
//       }).catch(() => {
//         console.log("An error was encountered!!!");
//       });
//     }

//   } else {
//     console.log("No one is found to be logged in");
//     document.getElementById("login_div").style.display = "block";
//     document.getElementById("content_div").style.display = "none";
//     document.getElementById("email_field").value = "";
//     document.getElementById("password_field").value = "";
//   }
//   populateBusesTable();
// });
firebase.auth().onAuthStateChanged(function (user) {
  debugger;
  if (user) {

    var user = firebase.auth().currentUser;
    var email, uid;
    console.log("This is the email loggedin = " + email);
    if (user != null) {

      const users = firebase.firestore().collection("Users");
      const found = users.doc(user.uid).get().then((doc) => {
        if (doc.get("userType") == "Admin") {
          console.log("Loggedin Successfully");
          email = user.email;
          uid = user.uid;
          document.getElementById("login_div").style.display = "none";
          document.getElementById("content_div").style.display = "block";
          document.getElementById("user_para").innerHTML = "Welcome " + email;

          populateBusesTable();
          populateDriversTable();
        } else {


          window.alert("Error: access denied");
          logout();
          document.getElementById("login_div").style.display = "block";
          document.getElementById("content_div").style.display = "none";
          document.getElementById("email_field").value = "";
          document.getElementById("password_field").value = "";


        }
      });
      users
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("All data in 'books' collection", data);
          // [ { id: 'glMeZvPpTN1Ah31sKcnj', title: 'The Great Gatsby' } ]
        });
    }

  } else {
    console.log("No one is found to be logged in");
    document.getElementById("login_div").style.display = "block";
    document.getElementById("content_div").style.display = "none";
    document.getElementById("email_field").value = "";
    document.getElementById("password_field").value = "";
  }
  populateBusesTable();
});


function login() {
  var userEmail = document.getElementById("email_field").value;
  var userPassword = document.getElementById("password_field").value;
  console.log("Login button has pressed");

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    .then((user) => {
      document.getElementById("login_div").style.display = "none";
      document.getElementById("content_div").style.display = "block";
      document.getElementById("user_para").innerHTML = "Welcome " + userEmail;
      console.log("successfully loggedin");
    }).catch(function (error) {
      window.alert("Error: " + error.message);
    });
}

function logout() {
  firebase.auth().signOut();
}

var map;
var markers = [];

function placeMarkers(map) {
  var bounds = new google.maps.LatLngBounds();

  var database = firebase.database();

  database.ref('/OnlineBus/').on('value', function (snapshot) {
    var OnlineBusesCount = 0;
    deleteMarkers();

    snapshot.forEach(function (childSnapshot) {
      var location = new google.maps.LatLng(parseFloat(childSnapshot.val().currLocation.split(", ")[0]),
        parseFloat(childSnapshot.val().currLocation.split(", ")[1]));

      addMarker(location, childSnapshot.val().busCode);
      OnlineBusesCount++;
      document.getElementById("floating_panel").innerHTML = OnlineBusesCount + " Online Buses";
    });
  });
}

// Adds a marker to the map and push to the array.
function addMarker(location, busCode) {
  var image = {
    url: 'https://firebasestorage.googleapis.com/v0/b/irenbus-app.appspot.com/o/icons%2Fbus_marker.png?alt=media&token=4f664646-8800-453b-b00b-0e3e324e8dc9'
  };
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: image,
    title: busCode
  });

  var infowindow = new google.maps.InfoWindow({
    content: busCode
  });

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function populateBusesTable() {
  var count = 1;
  var table = document.getElementById("tblBuses");
  var database = firebase.database();

  database.ref('/Taxis/').once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var row = table.insertRow(count);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      console.log("code = " + childSnapshot.val().taxiCode)
      cell1.innerHTML = childSnapshot.val().busCode;
      cell2.innerHTML = childSnapshot.val().plate;
      cell3.innerHTML = childSnapshot.val().number;
      cell4.innerHTML = childSnapshot.val().route;
      count++;
    });
  });
}
function loadTaxis() {
  const taxis = firebase.firestore().collection("Taxis");
  taxis
    .get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("All data in 'books' collection", data);
      if (data.length > 0) {
        taxisTable.clear().draw();
        $('#tblTaxis').dataTable().fnAddData(data);
        //$('[data-toggle="tooltip"]').tooltip();
      }
      // [ { id: 'glMeZvPpTN1Ah31sKcnj', title: 'The Great Gatsby' } ]
    });
  $('[data-tooltip="tooltip"]').tooltip();
  $('[data-tooltip="tooltip"]').tooltip();
}
function addTaxi() {
  var num_plate = document.getElementById("inputNumPlate").value;
  var bus_num = document.getElementById("inputBusNum").value;
  var bus_route = document.getElementById("inputBusRoute").value;
  var bus_code = getCode();
  debugger;
  const db = firebase.firestore();
  db.collection("Taxis").add({
    numberPlate: num_plate,
    taxiCode: bus_code,
    taxiNumber: bus_num,
    taxiRoute: bus_route,
    status: "Active"
  }).then(() => {
    loadTaxis();
    $.notify("Taxi successfully added !", "success");
  }, () => {
    $.notify("Something went wrong !", "danger");
  });




  firebase.database().ref("/Buses/" + bus_code).once('value').then(function (snapshot) {
    if (!snapshot.exists()) {
      firebase.database().ref('/Buses/' + bus_code).set({
        busCode: bus_code,
        number: bus_num,
        plate: num_plate,
        route: bus_route,
      }).then(() => {
        document.getElementById("alert_space").innerHTML = //success
          "<div class='alert alert-success alert-dismissible'><button type='button' class='close' data-dismiss='alert'>×</button><strong>Success!</strong> New bus added successfully.</div>";
      });
    } else {
      //code already exists
      document.getElementById("alert_space").innerHTML = //success
        "<div class='alert alert-danger alert-dismissible'><button type='button' class='close' data-dismiss='alert'>×</button><strong>Error</strong> Couldn't add bus, please try again later.</div>";
    }
  });
}

function searchBuses() {
  var text = document.getElementById("buses-search-field").value.toLowerCase();
  var count = 1;

  document.getElementById("tblBuses").innerHTML = "<thead><tr> <th>Bus Code</th> <th>Number Plate</th> <th>Number</th> <th>Route</th> <tr><thead>";
  var table = document.getElementById("tblBuses");
  var database = firebase.database();

  database.ref('/Buses/').orderByChild('route').once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {

      var busCode = childSnapshot.val().busCode.toLowerCase();
      var plate = childSnapshot.val().plate.toLowerCase();
      var number = childSnapshot.val().number.toLowerCase();
      var route = childSnapshot.val().route.toLowerCase();

      if (busCode.includes(text) || plate.includes(text) || number.includes(text) || route.includes(text)) {
        var row = table.insertRow(count);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = childSnapshot.val().busCode;
        cell2.innerHTML = childSnapshot.val().plate;
        cell3.innerHTML = childSnapshot.val().number;
        cell4.innerHTML = childSnapshot.val().route;
        count++;
      }

    });

  });
}

function getCode() {
  var code = "";
  for (var i = 1; i < 20; i++) {
    if (i % 5 == 0) {
      code += "-";
    } else {
      var r = Math.floor(Math.random() * 3) + 1;
      if (r == 1) {
        code += String.fromCharCode(Math.floor(Math.random() * (90 - 66)) + 66);
      } else if (r == 2) {
        code += String.fromCharCode(Math.floor(Math.random() * (122 - 98)) + 98);
      } else {
        code += String.fromCharCode(Math.floor(Math.random() * (57 - 49)) + 49);
      }
    }
  }
  return code;
}

function populateDriversTable() {
  var count = 1;
  var table = document.getElementById("tblDrivers");
  var database = firebase.database();

  database.ref('/Users/').once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().userType == "Driver") {
        var row = table.insertRow(count);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        //cell1.innerHTML = childSnapshot.val().imageURL;
        //cell1.innerHTML = "<img src = 'https://randomuser.me/api/portraits/thumb/men/"
        //+ Math.floor((Math.random()*99)+1) +".jpg' class='img-circle' alt='pic'>";
        cell1.innerHTML = "<img src = 'https://firebasestorage.googleapis.com/v0/b/irenbus-app.appspot.com/o/icons%2Fprofile_pic.png?alt=media&token=6343dd20-c73b-477c-8c1d-32123cdbee2e' alt='pic'>";
        cell2.innerHTML = childSnapshot.val().fullName;
        cell3.innerHTML = childSnapshot.val().busCode;
        count++;
      }
    });
  });
}

function searchDrivers() {
  var text = document.getElementById("drivers-search-field").value.toLowerCase();
  var count = 1;

  document.getElementById("tblDrivers").innerHTML = "<thead><tr> <th>Picture</th> <th>Full Name</th> <th>busCode</th> <tr><thead>";
  var table = document.getElementById("tblDrivers");
  var database = firebase.database();

  database.ref('/Users/').once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {

      if (childSnapshot.val().userType == "Driver") {

        var fullName = childSnapshot.val().fullName.toLowerCase();
        var busCode = childSnapshot.val().busCode.toLowerCase();

        if (fullName.includes(text) || busCode.includes(text)) {
          var row = table.insertRow(count);

          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);

          //cell1.innerHTML = childSnapshot.val().imageURL;
          //cell1.innerHTML = "<img src = 'https://randomuser.me/api/portraits/thumb/men/"
          //+ Math.floor((Math.random()*99)+1) +".jpg' class='img-circle' alt='pic'>";
          cell1.innerHTML = "<img src = 'https://firebasestorage.googleapis.com/v0/b/irenbus-app.appspot.com/o/icons%2Fprofile_pic.png?alt=media&token=6343dd20-c73b-477c-8c1d-32123cdbee2e' alt='pic'>";
          cell2.innerHTML = childSnapshot.val().fullName;
          cell3.innerHTML = childSnapshot.val().busCode;
          count++;
        }

      }

    });

  });
}

function initMap() {
  var location = { lat: -29.8587, lng: 31.0218 };//Durban


  map = new google.maps.Map(document.getElementById('map'), {
    center: location, zoom: 17,
    styles: [{
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#d6e2e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#cfd4d5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7492a8"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "lightness": 25
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#cfd4d5"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7492a8"
        }
      ]
    },
    {
      "featureType": "landscape.natural.terrain",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -100
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#588ca4"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a9de83"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#bae6a1"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c6e8b3"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#bae6a1"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -45
        },
        {
          "lightness": 10
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#41626b"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c1d1d6"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#a6b5bb"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#9fb6bd"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -70
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b4cbd4"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#588ca4"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#008cb5"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": -5
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a6cbe3"
        }
      ]
    }
    ]

  });

  placeMarkers(map);

}
function initDriverMap() {
  var location = { lat: -29.8587, lng: 31.0218 };//Durban

  map = new google.maps.Map(document.getElementById('driverMap'), {
    center: location, zoom: 17,
    styles: [{
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#d6e2e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#cfd4d5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7492a8"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "lightness": 25
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#cfd4d5"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7492a8"
        }
      ]
    },
    {
      "featureType": "landscape.natural.terrain",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#dde2e3"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -100
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#588ca4"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a9de83"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#bae6a1"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c6e8b3"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#bae6a1"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -45
        },
        {
          "lightness": 10
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#41626b"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c1d1d6"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#a6b5bb"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#9fb6bd"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": -70
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b4cbd4"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#588ca4"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#008cb5"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": -5
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a6cbe3"
        }
      ]
    }
    ]

  });

  placeMarkers(map);

}
