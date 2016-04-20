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

   function onPause() {    
    localStorage.setItem("wisi","false"); 
    console.log("paused");  
    if(!localStorage.scanear)searchWISI();
  }

  function searchWISI(){
    var statusWIFI=WifiWizard.isWifiEnabled(win, fail);
    
    window.setTimeout(function(){
      WifiWizard.getScanResults(listHandler, fail);
      console.log("Check available WIFIs");
    },60000);//1 minuto
  }
  function win(){
    console.log("Estado WIFI: ");
  }

  function onResume() {  
    localStorage.setItem("wisi","true");
    localStorage.setItem("scanner","false");
    console.log("resume"); 
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

    function fail(e){
      console.log("Detect active "+e);
    }

  function listHandler(a){
  console.log("Flag listar "+localStorage.wisi);
  console.log("Array Wifis "+JSON.stringify(a));
  if(localStorage.wisi=="false"){
    var exists=0;
    alert(a[0].length);
    for(var i=0; i<a[0].length; i++){
      alert("WIFI Detect "+a[0][i]);
/*      if((a[i].search("WISI TE CONECTA")>0||a[i].search("VALENCIA_V")>0)&&exists==0){
        console.log(a[i].search("WISI TE CONECTA")+" / "+a[i].search("VALENCIA_V"));
        if(localStorage.wisi=="false"){
            cordova.plugins.notification.local.schedule({ message:"Red WISI detectada",sound: "file://sounds/HTC Happy.mp3" });
            //myApp.alert("Red WISI detectada", "");
            localStorage.setItem("wisi","true"); 
            navigator.vibrate(1000);
            exists++;            
          }
        }*/
      }
      searchWISI();
    }    
  }