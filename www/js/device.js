/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var networkStat;
 var gaPlugin;
 
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
        //alert("Iniciando app..");
        //app.receivedEvent('deviceready');        
        //navigator.splashscreen.show();
        navigator.splashscreen.hide(); 
        screen.lockOrientation('portrait-primary');        
        window.analytics.startTrackerWithId('UA-62739338-1');
        window.analytics.trackView('/index');
        window.analytics.trackView('/internal');
        window.analytics.trackView('/login');
        window.analytics.trackView('/templates/guia');
        window.analytics.trackView('/templates/contactenos');
        console.log("Inicializa Dispositivo");        
        getDeviceProperty();
        checkConnection();
        if(!localStorage.pushtoken)alert("Bienvenido a Buffet Express.\nEl primer restaurante Online tipo buffet, que hara mas sencilla tu vida");
    }
};

function checkConnection() {
    console.log("checkConnection");
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
    
    var page=getNameURLWeb();
    if(states[networkState]=='No network connection'){
        //navigator.notification.beep(1);        
        if(page!="offline.html"){
            alert('Internet es requerido!');        
            window.location.href = 'offline.html';
        }
        //throw new Error('No Internet Connection.');  
        state=false;                            
    }else{
        if(page=="offline.html")window.location.href = 'index.html';
    }
    return state;    
}

function getDeviceProperty()
{
     console.log("getDeviceProperty");
     var deviceOS  = device.platform  ;  //fetch the device operating system
     var deviceOSVersion = device.version ;  //fetch the device OS version
     var uuid=  device.uuid;
     localStorage.setItem("OS",deviceOS);
     localStorage.setItem("UUID",uuid);
     console.log("Plataforma registrada "+device.platform);
     initPushwoosh();
}
function getNameURLWeb(){
 var sPath = window.location.pathname;
 var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
 return sPage;
}
function initPushwoosh() {    
    console.log("initPushwoosh "+localStorage.OS);    
    if(localStorage.OS == "Android"){
        registerPushwooshAndroid();
        console.log("Register "+localStorage.OS);
    }else if(localStorage.OS == "iPhone" || device.platform == "iOS"){
        registerPushwooshIOS();
        console.log("Register "+localStorage.OS);        
    }    
}