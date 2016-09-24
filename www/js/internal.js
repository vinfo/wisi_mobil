if (window.jQuery) {  
 $(function(){    
    // Tamaño container
    $(".container").css({"min-height":$(document).height()});
    $('body').on('click', '#accordion h3', function(event) {
      event.preventDefault();
      $(this).next('div').slideToggle();
      return false;
    });    
    
    $(window).load(function(){
      $(".menupie ul li").css({"height":$("li.carrito a img").height()});
      $(".pedidotar").css({"bottom":$("li.carrito a img").height()});
      $(".contpag").css({"bottom":$("li.carrito a img").height()});
      $(".latermenu").css({"margin-top":$(".menusup").height()});
      $(".botones").css({"bottom":$("li.carrito a img").height()+"px"});
    });
    //fin tamaño container      
    
    //Mostrar menu lateral  
    $(".verlatermenu").click(function(event){
      event.preventDefault();
      var img= $(".menusup button.ico-menu span").css('background-image').split("flecha_atras");        
      if(img[1] && img[1].length>0){
        $(".menusup button.ico-menu span").css("background","url(images/linmenu.png)");
            //window.history.back();
            var pago= window.location.href.search("pago");
            var ins= window.location.href.search("ins");
            var edit= window.location.href.search("edit");
            
            if(localStorage.cuenta){
              $(".mi_cuenta").attr("href","internal.html#/mi_cuenta");
            }     

            var redir="internal.html#/carta";
            if(ins>0)redir= "internal.html#/menu";
            if(edit>0)redir= "internal.html#/compras";
            if(pago>0)redir= "internal.html#/compras";
            window.location = redir;
          }else{
            var position = $(".latermenu").position();
            if(position.left==0){
              $(".latermenu").animate({"left":-412},200);
            }else{
              $(".latermenu").animate({"left":0},400);           
            }
            $(".container").animate({
             scrollTop:0
           },"slow");             
          }
        });	
  $(".td a").click(function(){
    $(".latermenu").animate({"left":-412},200);
  });    
  $(".menupie").hover(function(){
    $(".latermenu").animate({"left":-412},200);
  });
  $(document).on("click", ".dirs", function() {
    var dat= this.title.split('~');
    $(".address").val('');
    if(dat.length>0){     
      if(dat[0]!=""){
        var dirFull= dat[0].split("|");
        if(dirFull[0]!=null && dirFull[0]!=""){$("#dir1 option[value='"+dirFull[0]+"']").prop('selected', true);}else{$("#dir1 option[value='Calle']").prop('selected', true);}
        if(dirFull[1]!=null && dirFull[1]!=""){$("#dir2").val(dirFull[1]);}else{$("#dir2").val('');}
        if(dirFull[2]!=null && dirFull[2]!=""){$("#dir3").val(dirFull[2]);}else{$("#dir3").val('');}
        if(dirFull[3]!=null && dirFull[3]!=""){$("#dir4").val(dirFull[3]);}else{$("#dir4").val('');}
        codeAddress();      
      }     
      if(dat[1]!="")$("#numero").val(dat[1]);
      if(dat[2]!="")$("#referencia").val(dat[2]);
    }
  });
  $(document).on("change", ".vrdirc input,select", function() {
    codeAddress();
  }); 
  $(document).on("click", ".glyphicon-minus-sign", function() {
    var dat= this.title.split('|');
    if(dat.length>0){
      var orden= $(this).prev().attr("title").split("|");
      ajaxrest.removeAddress(encodeURIComponent(orden[0]),encodeURIComponent(orden[1]),encodeURIComponent(orden[2]));
      $(this).parents('li').remove();		        
    }
  });	
  $(document).on("click", ".close_guia", function() {
    localStorage.setItem("show_guia","1");
    window.location.href = 'internal.html#/carta';
  });
  $(document).on("click", ".audio_play", function(event) {
    event.preventDefault();
    var audio= this.title;
    $("#audio_"+audio).attr("src",localStorage.domain+"resources/audio/"+audio+".mp3");     
    $( this ).toggleClass( "audio_stop", 1000, "audio_play" );
    if($( this ).attr("class")!='audio_play ng-scope')
    {
      $("#audio_"+audio).trigger('play');
    }
    else
    {
      $("#audio_"+audio).trigger('pause');
    }       
    return false;
  }); 

    //Activar menus  
    $(".menupie li a").click(function(){
      $("li").removeClass("active");
      $(this).parent().addClass("active");
    });
  })
} else {
  alert("Internet es requerido!");
}      
/* Funciones */    
function hiddeMenu(){
  $(".latermenu").animate({"left":-412},200);
}
function shareBono(){
  var precio= $("#precio_bono").html();
  var descuento= $("#descuento_bono").html();
  var imagen= $("#img_qr").attr("src");
  var codigo= $("#codigo").html();
  window.plugins.socialsharing.share('Hola, como estas?\r\nOhi! descárgate esta aplicación Buffet Express y almorza hoy por $ '+precio+', podes armar tu plato como queras…\r\nEs muy fácil entra a la app y en el menú dale click a comparte y gana, escanea el código QR que te llego con este mensaje o ingresa el siguiente código:\r\n\r\n'+codigo+'\r\n\r\nEste te dara un bono de $ '+descuento+'.',null,imagen, 'http://buffetexpress.co/'); 
}
function scanear(){
   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var datos= localStorage.getItem("cuenta");
        var sponsor= result.text;
        var invited=0;
          if(datos!=null){
            var data= JSON.parse(datos);
            if(data.id!="")invited= data.id;
          }          
          if(sponsor!=""&&invited!="")ajaxrest.setQR(sponsor,invited,0);
      }, 
      function (error) {
          console.log("problemas procesando scanner");
      }
      ); 
}
function registerBono(){
   var bono= $("#bono").val();
   if(bono!=""){
      var invited=0;
      var datos= localStorage.getItem("cuenta");
      if(datos!=null){
            var data= JSON.parse(datos);
            if(data.id!="")invited= data.id;        
      }
      var sponsor=bono;
      ajaxrest.setQR(sponsor,invited,1);
   }   
}
function registrarUser(){
   var cellPhone= $("#cellPhone").val();
   $("#password").val(cellPhone);
   $("#password2").val(cellPhone);
   localStorage.setItem("regQR","true");
   var check= ajaxrest.checkSMS();
   localStorage.setItem("sms","0");    
   CreateTimer("time", "120");
   $(".time").show();
   setTimeout(function(){
    if(localStorage.getItem("sms")=="0"){
      alert("No se recibio el mensaje SMS de verificación.\nComprueba el número de celular ingresado y vuelve intentarlo");
      $("#code").val('');
      $(".register").show();
      $(".sms").hide();      
      $(".time").hide(); 
      $("#time").html("0"); 
    }
   }, 120000);
   smsplugin.startReception(function success(result){
     var res=result.split(",");
     if(res[1]!=""){
      $("#code").val(res[1]);
      localStorage.setItem("sms","1");
      ajaxrest.setAccount('add',82);
    }
  },function failure(error){
    $("#code").val('');
  });
}
function registrarSMS(){
  var code= $("#code").val();
  if(code!=""){
    ajaxrest.getConfirmSMS();
  }else{
    alert("Código requerido");
    return true;
  }
}
function validarCuenta(){
  var datos= localStorage.getItem("cuenta");
  var data= JSON.parse(datos);
  $("#email").val(data.email);
  $("#name").val(data.names);
  $("#cellPhone").val($("#celular").val());
   localStorage.setItem("regQR","true");
   var check= ajaxrest.checkSMS();
   localStorage.setItem("sms","0");    
   CreateTimer("time", "120");
   $(".time").show();
   setTimeout(function(){
    if(localStorage.getItem("sms")=="0"){
      alert("No se recibio el mensaje SMS de verificación.\nComprueba el número de celular ingresado y vuelve intentarlo");
      $("#code").val('');
      $(".validar").show();
      $(".sms").hide();      
      $(".time").hide(); 
      $("#time").html("0"); 
    }
   }, 120000);
   smsplugin.startReception(function success(result){
     var res=result.split(",");
     if(res[1]!=""){
      $("#code").val(res[1]);
      localStorage.setItem("sms","1");
      var dat= localStorage.cuenta;
      var data= JSON.parse(dat);
      var res = dat.replace('validate":"0', 'validate":"1');
      localStorage.setItem("cuenta",res);
      ajaxrest.updateInfo(data.email);
      location.reload();
    }
  },function failure(error){
    $("#code").val('');
  });
}

function getListBono(id){
  if(id!=null){
    ajaxrest.getListBonos(id);
  }   
}

function addShop(action){
  var num=$(".numero").html();
  if(action=="mas"){
    num++;
  }
  if(action=="menos"){
   if(num>0)num--;
 } 
 localStorage.setItem("num",num);
 $(".numero").html(num);
 return false;
}
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
   return null;
 }
 else{
   return results[1] || 0;
 }
}