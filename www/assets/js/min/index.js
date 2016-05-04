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
      document.addEventListener("pause", onPause, false);
      document.addEventListener("resume", onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {        
      app.receivedEvent('deviceready');
      screen.lockOrientation('portrait');
      localStorage.setItem("saldo_actual",0);
      localStorage.setItem("wisi","false");
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
  localStorage.removeItem("conexion");
  localStorage.removeItem("position");     
  lat1= position.coords.latitude;
  lng1= position.coords.longitude;   
  var pos= {lat:lat1,lng:lng1};
  localStorage.setItem("position",JSON.stringify(pos)); 
  console.log('Coordenadas detectadas');
  WifiWizard.setWifiEnabled(true, function(){console.log("Activando WIFI");}, function(){console.log("No se pudo encender el WIFI");});  
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

   function onPause() {    
    localStorage.setItem("wisi","false"); 
    console.log("paused");  
    if(!localStorage.scanear)searchWISI();
  }

  function searchWISI(){    
    window.setTimeout(function(){
      WifiWizard.getScanResults(listHandler, fail);
      console.log("Check available WIFIs");
    },10000);
  }

  function onResume() {  
    localStorage.setItem("wisi","true");
    localStorage.setItem("scanner","false");
    localStorage.removeItem("conexion");
    console.log("resume");
    WifiWizard.setWifiEnabled(true, function(){console.log("Activando WIFI");}, function(){console.log("No se pudo encender el WIFI");});  
  }

  function checkConnection() {
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

    if(states[networkState]=='No network connection'){
        //navigator.vibrate(1000);
        //alert('Internet no disponible!');
        state=false;                            
      }
      return state;
    }

  function listHandler(a){
    if(localStorage.wisi=="false"&&!localStorage.conexion){
      for(var i=0; i<a.length; i++){        
        if(a[i]["SSID"]=="WISI TE CONECTA"||a[i]["SSID"]=="VALENCIA_V"){
            console.log("WIFI detectado");
            if(localStorage.wisi=="false"){
              cordova.plugins.notification.local.schedule({ message:"Red WISI detectada",sound: "file://sounds/wisi.mp3" });
              localStorage.setItem("wisi","true"); 
              navigator.vibrate(1000);
            }
          }else{
            localStorage.setItem("wisi","false"); 
          }
        }
        searchWISI();
      }    
  }

  function fail(e){
    console.log("Problemas leyendo lista de WIFIs disponibles. "+e);
    WifiWizard.setWifiEnabled(true, function(){console.log("Activando WIFI");}, function(){console.log("No se pudo encender el WIFI");});  
  }  