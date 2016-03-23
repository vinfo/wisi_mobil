var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", checkConnection, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {        
        app.receivedEvent('deviceready');
        screen.lockOrientation('portrait');
        localStorage.setItem("saldo_actual",0);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        getDeviceProperty();
        detectGEO();        
    }
};



function detectGEO(){
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 75000
  };  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options); 
  } else {
      console.log('Geolocalización no soportada');
  }  
}

// onSuccess Geolocation    //
function onSuccess(position) {
  localStorage.removeItem("position");      
  lat1= position.coords.latitude;
  lng1= position.coords.longitude;   
  var pos= {lat:lat1,lng:lng1};
  localStorage.setItem("position",JSON.stringify(pos)); 
  console.log('Coordenadas detectadas');
}
function onError(error) {
  console.log('Error detectando coordenadas');
}

function getDeviceProperty()
{
     var deviceOS  = device.platform  ;  //fetch the device operating system
     var deviceOSVersion = device.version ;  //fetch the device OS version
     localStorage.setItem("OS",deviceOS);
}

function checkConnection() {
    alert("Conexion");
    var state=true;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';    
    
    alert(states[networkState]);
    if(states[networkState]=='No network connection'){
        navigator.notification.beep(1);
        alert('Internet es requerido!');
        state=false;                            
    }else{
        alert('WIFI disponible!');
    }
    return state;
}