// Put your zillow.com API key here
var zwsid = "X1-ZWz18ze2o9d5aj_64j9s";
var request = new XMLHttpRequest();
var geocoder;
var map;
var markers = [];
var value;
var result;
var historylist = [];

function displayResult ()

 {
				
    if (request.readyState == 4) {
		var address = document.getElementById("address").value;
		var infowindow = new google.maps.InfoWindow;
        var xml = request.responseXML.documentElement;
					try
						{
						value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML; 	
						}
						catch(TypeError)
						{
							value = "";
						}
						
						if(value == "")
						{	
							value = "undefined value";
							alert("Zestimate value not available in Zillow, please select another location");
						}
						
			  geocoder.geocode( { 'address': address}, function(results, status) {
			  if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
					marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
				});			
							markers.push(marker);
							historylist.push(address + " " + value + "<br>");
							document.getElementById("output").innerHTML = historylist;
							infowindow.setContent(address + " " + value);
							infowindow.open(map, marker);
							
			  } else {
				alert('Geocode was not successful for the following reason: ' + status);
			  }
			});
	}	
    }

function sendRequest () {
	
	setMapOnAll(null);	
    request.onreadystatechange = displayResult;
    var address = document.getElementById("address").value;
    
	var city = "";
	var state = "";
	var zipcode = "";
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.send(null);
	
}

function initialize(){
	   
	   geocoder = new google.maps.Geocoder();
	   var center1 = {lat: 32.75, lng: -97.13};
	   map = new google.maps.Map(document.getElementById("map"), {
          center: center1,
          zoom: 17
        });
		
		 google.maps.event.addListener(map, 'click', function(event) {
			placeMarker(map, event.latLng);
			});	
}


function placeMarker(map, location) {
  
	setMapOnAll(null);
	geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
    marker = new google.maps.Marker({
    position: location,
    map: map
  });
	markers.push(marker);
	
	var latlng = {lat: location.lat(), lng: location.lng()};
    geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
		  
			
			/* var xhr = new XMLHttpRequest();	 */
			var address = results[0].formatted_address;
						
			var city = "";
			var state = "";
			var zipcode = "";
			
			request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
			request.withCredentials = "true";
			request.send(null);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
						
						var xml = request.responseXML.documentElement;
						try
						{
						value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML; 	
						}
						catch(TypeError)
						{
							value = "";
						}
						
						if(value == "")
						{	
							value = "undefined value";
							alert("Zestimate value not available in Zillow, please select another location");
						}
						historylist.push(address + " :" + value + "<br>" );
						document.getElementById("output").innerHTML = historylist;	
						infowindow.setContent(address + " " + value);
						infowindow.open(map, marker);
						
						
				}
			};
		
				
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
  
  
}

function zillow(passedaddress)

{	
	var xhr = new XMLHttpRequest();	
	/* var address = '904 Austin St, Arlington, TX 76012'; */
	var address = passedaddress;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var zipcode = document.getElementById("zipcode").value;	
	
    xhr.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
	xhr.withCredentials = "true";
	xhr.send(null);
	xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
				
				var xml = xhr.responseXML.documentElement;
				value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML; 			
				document.getElementById("output").innerHTML = value;		
				return value;
				alert(value);
        }
    };
    
		
}


 function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

	  

function clearvalue()
{
	
	document.getElementById("address").value = "";
}