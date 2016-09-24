startApp();

function startApp() {      
  localStorage.domain = "http://buffetexpress.com.co/REST/";  
  localStorage.dimension = $(window).width();
  localStorage.setItem("quadrant","");
  localStorage.setItem("banner","");
  var timer= new Date().getTime();
  localStorage.setItem("timer",timer);
  localStorage.setItem("channel","1");
  cleanSession();
  localStorage.setItem("plato",1);
  localStorage.setItem("tipo_pago","efectivo");   

  if(localStorage.token==null){
    var credentials= "oauthId=326615832446388&oauthSecret=5af5f7e15ccbddfd350a921bc6f13444&contentType=application/json; charset=UTF-8";  
    ajaxrest.autenticar(localStorage.domain +"api/v1/authenticate/",credentials);
  }  

  var lat1="";
  var lng1="";    
  var zones= JSON.parse(getZones());
  var ciudad_zona= ajaxrest.getZone('cam002');
  localStorage.setItem("zona",JSON.stringify({id:2,code:'cam002',ciudad:ciudad_zona[0].ciudad,domicilio:ciudad_zona[0].domicilio,desde:ciudad_zona[0].hora_desde,hasta:ciudad_zona[0].hora_hasta}));  
  localStorage.valor_domicilio= ciudad_zona[0].domicilio;
  localStorage.setItem("zonas",JSON.stringify(zones));
  if(zones){
    var codes=[];                  
    for(var i=0;i<zones.length;i++){
      var zona= zones[i].id+"|"+zones[i].code;
      codes.push(zona);
    }      
    var process= ajaxrest.getCoordinatesJSON(codes,'');
    var quadrant= 0;
    $(".loading_msg").html("Detectando zona de pedidos");
    for(var i=0;i<process.length;i++){        
      var Coords = process[i][2];
      var limits=[];
            //alert(process[i][1]);
            for(var j=0;j<Coords.length;j++){          
              limits.push(new google.maps.LatLng(Coords[j][0],Coords[j][1]));          
            }
            if(process[i][0]!="" && process[i][1]!="" && limits!=""){
              quadrant += checkZona(process[i][0],process[i][1],limits);
            }
          }
          redirect();  
        }else{
          alert("Problemas de conectividad a Internet");
        } 
      }

      function sortByDist(a, b) {
        var x = a.dist;
        var y = b.dist;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }

      function redirect(){
        // if(!localStorage.show_guia){
        //   window.location = "internal.html#/guia";
        // }else{
          localStorage.setItem("GPS","true");
          console.log("redirect")
          window.location.href = 'internal.html#/carta';
       // }  
      }

 function getZones(){
  var res="";
  $.ajax({
   type: 'GET',
   url: localStorage.domain+'api/v1/getZones/',
   crossDomain: true,
   dataType: 'json',
   async: false, 
   success: function(msg) {
     res= JSON.stringify(msg);   
   }
 });
  return res;
}
function checkZona(id_zone,code,limits){
	var exists=0;
  if(localStorage.getItem("position")!=null){
    var zone = new google.maps.Polygon({
      paths: limits
    });
    var pos= JSON.parse(localStorage.getItem("position"));
    var point = new google.maps.LatLng(pos.lat,pos.lng);//6.239124, -75.545917 
    //console.log("Coordenadas en punto: "+google.maps.geometry.poly.containsLocation(point, zone)+" "+pos.lat+","+pos.lng);
    if(google.maps.geometry.poly.containsLocation(point, zone)){
      //alert("Zona: "+id_zone+", Code: " + code);
      var zona= JSON.parse(localStorage.zona);
      //alert(id_zone +" - "+ zona.id);
      if(id_zone != zona.id){
        ClearSomeLocalStorage("item_");
        ClearSomeLocalStorage("cant_");
        localStorage.setItem("num","0"); 
        localStorage.setItem("plato","1");
        localStorage.setItem("platoE","0");  
      }
      var ciudad_zona= ajaxrest.getZone(code);
      localStorage.setItem("zona",JSON.stringify({id:id_zone,code:code,ciudad:ciudad_zona[0].ciudad,domicilio:ciudad_zona[0].domicilio,desde:ciudad_zona[0].hora_desde,hasta:ciudad_zona[0].hora_hasta}));
      localStorage.valor_domicilio= ciudad_zona[0].domicilio;
      localStorage.setItem("quadrant","n/a");  
      exists=1;
    }
  }    
  return exists;
}