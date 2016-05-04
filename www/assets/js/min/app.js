// Initialize app
function shareWhatsApp(){
  var id=localStorage.id;
  window.plugins.socialsharing.shareViaWhatsApp('Hola, te recomiendo registrarte y descargar la aplicación de conectividad a internet WISI.', 'http://wisi.com.co/public/assets/images/logo.png', 'http://wisi.com.co/public/#/?sponsor='+id, function() {console.log('share ok')}, function(errormsg){console.log(errormsg)});
}

function getReferrals(){
      var data={id:localStorage.id};
      $.ajax({
          url: "http://wisi.com.co/api/getReferrals",
          type: "get",
          data: data,
          success: function(d){
            $.each(d.data, function (index, value) {
              $(".referidos").prepend('<li class="list-re mt-0 mb-0 nice-list"><div class="item-inner"><div class="nice-list">E-mail: '+value.email+'<br/>Fecha/Hora: '+value.datereg+'<br/>Estado: '+value.status+'<br/></div></div></li>'); 
            });            
         }
     });
}

function setSaldo(){
  if(localStorage.id){
      var data={id:localStorage.id};
      $.ajax({
          url: "http://wisi.com.co/api/getBalanceUser",
          type: "get",
          data: data,
          success: function(d){
              var saldo=0;
              var cargado=0;
              var gastado=0;
              if(d.status){
                  if(d.data[0].cargado)cargado=parseInt(d.data[0].cargado);
                  if(d.data[0].gastado)gastado=parseInt(d.data[0].gastado);
                  var total=  cargado - gastado;
                  if(total>0)saldo=total;
                  var vistas= getConfiguration("66");
                  if(d.data[0].vistas>=vistas[0].value)$(".row_gratis").remove();
              }
              localStorage.setItem("saldo_actual",saldo);
              $("#saldo_actual").html(saldo);
              if(saldo==0)$(".navegate_pay").hide();
         },
          error: function (request, status, error) {
              localStorage.setItem("saldo_actual","0");
              myApp.alert("Problemas de conectividad en este momento!", "");
              console.log("Error conectividad");
          }
     });    
    }  
}
/* Obtener valor sistema */
function getConfiguration(code){
    var result="";
    var data="code="+code;
    $.ajax({
      url: "http://wisi.com.co/api/getConfiguration",
      type: "post",
      async: false,
      data: data,
      success: function(d){
        result= d.data;
      }
    });
    return result;
}
function referByEmail(){
    $("#email").val();
    $(".forms").slideToggle( "slow" );
}
function Login() {
    var email=$("#email").val();   
    var password=$("#password").val();
    if(email!=""&&password!=""){
        var data={email:email,password:password};
        $.ajax({
            url: "http://wisi.com.co/api/sigin",
            type: "post",
            data: data,
            success: function(res){
             if(res.status){
               localStorage.setItem("id", res.encript);
               localStorage.setItem("userid", res.userdata.id);
               localStorage.setItem("name",  res.userdata.name);
               localStorage.setItem("lastname",  res.userdata.lastname);
               localStorage.setItem("email",  res.userdata.email);
               localStorage.setItem("logged_in", "true");
               localStorage.setItem("token", res.token.token);
               window.location.href = "index.html";
             }else{
               myApp.alert("Email o Contraseña no validos!", "");
             }
            }
     });
    }else{
        myApp.alert("Email y Contraseña son requeridos!", "");
    }
}
function Remember() {
    var email=$("#email2").val();
    if(email!=""){
        var data={email:email};
        $.ajax({
            url: "http://wisi.com.co/api/remember",
            type: "post",
            data: data,
            success: function(res){
             myApp.alert("Contraseña enviada exitosamente!", ""); 
             window.location.href = "index.html";
         }
     });
    }else{
        myApp.alert("Email requerido!", "");
    }
}
function scanear(){
   localStorage.setItem("scanner","true");
   cordova.plugins.barcodeScanner.scan(
      function (result) {
          $("#code_b").val(result.text);
          setCode(result.text);
      }, 
      function (error) {
          myApp.alert("Problemas Scanneando: "+error, "");
      }
      ); 
}

function setCode(code,key){
  if(code!=null&&key!=null){
    var data={code:code.trim()};
    $.ajax({
      url: "http://wisi.com.co/api/barcode",
      type: "get",
      data: data,
      success: function(res){
        if(res.status){
          if(res.data[0].status_b=="1"){
            if(key==res.data[0].key_b){
              $("#time").val(res.data[0].time_b);
              setBalance(code.trim(),res.data[0].time_b);
            }else{
              myApp.alert("Clave de seguridad no valida!", "");
              $("#key_b").val('');
            }
          }else{
            myApp.alert("Código ya ha sido registrado antes!", "");
            $("#code_b,#key_b").val('');
          }
        }else{
         myApp.alert("Código no valido!", "");
         $("#code_b").val('');
       }
     }
   });
  }
}

/* Establecer código en la base de datos */
function setBalance(code,time){
  if(code!=""){
    var data={data:{code_b:code.trim(),id:localStorage.id,time:time}};
    $.ajax({
      url: "http://wisi.com.co/api/setBalance",
      type: "post",
      data: data,
      success: function(res){
        if(res.status){
          myApp.alert("Código registrado exitosamente!", "");
          $("input").val('');
          setSaldo();
          getRechargedData(localStorage.id);
          $(".link-rechargeds").show();
        }else{
         myApp.alert("Problemas registrando código!", "");
       }
     }
   });
  }
}

function showDivsConnect(){
    console.log(localStorage.logged_in);
    if(localStorage.logged_in=="true"){
        $(".login").show();
        $(".logout").hide();
        $(".names_user").html(localStorage.name+" "+localStorage.lastname);
    }else{         
        $(".login").hide();
        $(".logout").show();
    }
}

function checkConnectionFB() {    
    facebookConnectPlugin.getLoginStatus(function(response) {
        if (response.status == 'connected'&&response.authResponse.userID==localStorage.network) { 
            localStorage.setItem("logged_in","true");
        }
        showDivsConnect();
    });
}
function getUserData() {
  alert(localStorage.userid);
    var data={id:localStorage.userid,table:"user"};
    $.ajax({
        url: "http://wisi.com.co/api/databyid",
        type: "get",
        data: data,
        success: function(d){
           $('input[name="id"]').val(d[0].id);
           $('input[name="name"]').val(d[0].name);
           $('input[name="lastname"]').val(d[0].lastname);
           $('input[name="email"]').val(d[0].email);
           $('input[name="birthday"]').val(d[0].birthday);
           $('input[name="phone"]').val(d[0].phone);
           $('input[name="celphone"]').val(d[0].celphone);
           $('select[name="genre"] option[value="'+d[0].genre+'"]').prop("selected", true);
           $('select[name="marital"] option[value="'+d[0].marital+'"]').attr("selected", "selected");
           $('input[name="hpass"]').val(d[0].password);
       }
   });
}
function getRechargedData(id) {    
    var data={id:id};
    $.ajax({
        url: "http://wisi.com.co/api/rechargeds",
        type: "get",
        data: data,
        success: function(obj){
            for(var k in obj) {
                var o = obj[k];
                $("#rechargeds").prepend('<li class="list-re mt-0 mb-0 nice-list"><div class="item-inner"><div class="nice-list">Código: '+o.code_b+'<br/>Fecha/Hora: '+o.datereg+'<br/>Vence: '+o.expired+'<br/>Tiempo: '+o.time_b+' mins.<br/>Estado: '+o.status+'.<br/></div></div></li>');
            }
        }
    });
}
function getRewardsData(id) {    
    var data={id:id};
    $.ajax({
        url: "http://wisi.com.co/api/rewards",
        type: "get",
        data: data,
        success: function(obj){            
            if(obj.status){
              for(var k in obj.data) {
                  var o = obj.data[k];      
                  $("#rewards").prepend('<li class="list-re mt-0 mb-0 nice-list"><div class="item-inner"><div class="nice-list">Tipo: '+o.type+'<br/>Fecha/Hora: '+o.datereg+'<br/>Vence: '+o.expired+'<br/>Tiempo: '+o.time+' mins.<br/>Estado: '+o.status+'.<br/></div></div></li>');
              }
            }
        }
    });
}

function findElement(selector) {
    var box = null;
    return $(".page-on-center").length > 0 ? (box = $(".view-main").find(".page-on-center " + selector), 
        0 === box.length && (box = $(".view-main").find(".page-on-center" + selector))) : box = $(".view-main").find(".page").find(selector), 
    box;
}

function naxvarBg() {
    var navbar = $(".navbar-anim-on-scroll"), box = null, cls = "active";
    return 0 === navbar.length ? !1 : (box = navbar.next().find($(".page-on-center").length > 0 ? ".page-on-center .page-content" : ".page .page-content"), 
        box.scrollTop() > 10 ? navbar.addClass(cls) : navbar.removeClass(cls), void box.scroll(function() {
            $(this).scrollTop() > 40 ? navbar.addClass(cls) : navbar.removeClass(cls);
        }));
}

function hidePreloader() {
    jQuery(".page-preloader").animate({
        opacity: 0
    }, function() {
        jQuery(this).hide();
    });
}

/* Ir a navegar */
function goNavegate(url){
  localStorage.setItem("alerta",true);
  localStorage.setItem("conexion",true);
  var saldo_actual= $("#saldo_actual").html();
  openUrl(url); 
  localStorage.setItem("redirect",true);
  return false;
}
/* Descontar tiempo saldo */
function lessBalanceUser(idUser){
    var data="id_user="+idUser;
    $.ajax({
      url: "http://wisi.com.co/api/lessBalanceUser",
      type: "post",
      async: false,
      data: data,
      success: function(d){
        var saldo= $("#saldo_actual").html();
        var fSaldo= parseInt(saldo) - 1;
        $("#saldo_actual").html(fSaldo);
        localStorage.setItem("saldo_actual",fSaldo);
      }
    });
    return false;
}

function openUrl(url){  
  //var newWin = window.open(url, "_blank", "EnableViewPortScale=yes" );
  localStorage.removeItem("alerta");
  setSaldo();
  var newWin = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
  //newWin.addEventListener('loadstart', function(event) { alert(event.url); });
  newWin.addEventListener('exit', function(event) { localStorage.removeItem("redirect"); } );
  var intervalID =setInterval(function(){
    var saldo= $("#saldo_actual").html();
    if(parseInt(saldo)>0){
       if(localStorage.redirect)lessBalanceUser(localStorage.id);
    }else{
     $(".row_disponible").hide();
     if(!localStorage.alerta){
      myApp.alert("Saldo agotado.\nGracias por utilizar nuestros servicios.", "");
      localStorage.setItem("alerta",true);         
     }
     $(".row_disponible").hide();
     newWin.close();    
    }
  }, 60000);
}

var myApp = new Framework7({
    swipeBackPage: !1,
    pushState: !0,
    swipePanel: "left",
    modalTitle: "Title"
}), $$ = Dom7;

var fbLoginSuccess = function (response) {
 if (response.authResponse) {
     facebookConnectPlugin.api('/me?fields=id,email,first_name,last_name,gender,picture', null,
         function(response) {
            var gender="38";
            if(response.gender=="male")gender="39";
            localStorage.setItem("network",response.id);
            localStorage.setItem("name",  response.first_name);
            localStorage.setItem("lastname",  response.last_name);
            localStorage.setItem("email",  response.email);
            localStorage.setItem("gender",  gender);
            localStorage.setItem("picture",  response.picture.data.url);
            localStorage.setItem("logged_in", "true");
            showDivsConnect();
            var data=$.param({data:{id:response.id,first_name:response.first_name,last_name:response.last_name,email:response.email,gender:gender,picture:response.picture}});
            $.ajax({
                url: "http://wisi.com.co/api/social/sigin",
                type: "post",
                data: data,
                success: function(d){
                    alert(JSON.stringify(d));
                    var level="1";
                    if(localStorage.cont_started=="true")level="2";
                    showDivsConnect();
                    localStorage.setItem("cont_started",true);
                    localStorage.setItem("id",d.encript);
                    window.location.href = "index.html";
                    //window.open("http://wisi.com.co/public/#/ad/"+level+"/"+d.userdata.id, "_system");
                }
            });
        });
 }
}

$$("body").on("click", ".button-facebook", function() {
    var terms=$('#chkTerm').is(':checked');
    if(terms){
        facebookConnectPlugin.login(["public_profile"],
            fbLoginSuccess,
            function (error) { myApp.alert("Debes tener el APP de Facebook instalada!", ""); }
            );
    }else{
        myApp.alert("Debe aceptar los términos y condiciones!", "");
    }
});

$$("body").on("click", ".pautar", function() {
    localStorage.setItem("conexion","true");
    window.open("http://wisi.com.co/register/", "_system");
});
$$("body").on("click", ".free-navegate", function() {  
  goNavegate("http://wisi.com.co/public/#/ad2/3/"+encodeURIComponent(localStorage.id)+"?navegate=free&app=mobil");  
});
$$("body").on("click", ".pay-navegate", function() {
  return goNavegate("http://wisi.com.co/public/#/conexion");   
});

$$("body").on("click", ".close_sesion", function() {
    localStorage.clear();
    window.location.href = "index.html";
});

$$("body").on("click", "#send-button", function() {
    var form = $(this).parents("form"), valid = form.valid();  
    if ("registration" === localStorage.page && valid) {
        var data=$.param({data:form.serializeObject()});
        myApp.showPreloader(), $.post("http://wisi.com.co/api/register", data).done(function(data) {
        myApp.hidePreloader();
        if(data.status){
            var gender=38;
            if(data.userdata.gender=="male")gender=39;
            localStorage.setItem("logged_in", "true");
            localStorage.setItem("id",  data.encript);
            localStorage.setItem("name",  data.userdata.name);
            localStorage.setItem("lastname",  data.userdata.lastname);
            localStorage.setItem("email",  data.userdata.email);
            localStorage.setItem("gender",  genre);
            myApp.alert("Datos registrados exitosamente", "");           
            showDivsConnect();            
            window.location.href = 'index.html';             
        }else{
              myApp.alert("Usuario ya existe en el sistema.", "");
              window.location.href = 'index.html';           
        }
        localStorage.setItem("cont_started",true);
    });
    }
    if ("mydata" === localStorage.page && valid) {
        var data=$.param({data:form.serializeObject()});
        myApp.showPreloader(), $.post("http://wisi.com.co/api/UpdateUser", data).done(function(data) {
            myApp.hidePreloader();
            if(data.status){
             myApp.alert(data.message, ""); 
         }
     });
    }
    if ("referrals" === localStorage.page && valid) {
        $('input[name="id"]').val(localStorage.id);
        var data=$.param({data:form.serializeObject()});        
        myApp.showPreloader(), $.post("http://wisi.com.co/api/RefererUser", data).done(function(data) {
            myApp.hidePreloader();
        if(data.status){
             myApp.alert(data.message, "");             
             $(".referidos").prepend('<li class="list-re mt-0 mb-0 nice-list"><div class="item-inner"><div class="nice-list">E-mail: '+data.data.email+'<br/>Fecha/Hora: '+data.data.datereg+'<br/>Estado: '+data.data.status+'<br/></div></div></li>');
         }else{
            myApp.alert("Referido ya ha sido registrado antes!", "");
         }
         $('input[name="email"]').val('');
     });
    }
    if ("rechargeds" === localStorage.page && valid) {
        setCode($("#code_b").val(),$("#key_b").val());
    }
});

var mainView = myApp.addView(".view-main", {
    dynamicNavbar: !0
});
$$(document).on("pageInit", function(e) {
    checkConnectionFB();
    var saldo= setInterval(function(){
        setSaldo();
      }, 60000);    
    var page = e.detail.page;
    localStorage.removeItem("redirect");
    localStorage.setItem("page",page.name);
    var userid=localStorage.userid;
    if(page.name=="mydata"){
      getUserData();
    }

    if(page.name=="rechargeds")getRechargedData(userid);
    //if(page.name=="index")setSaldo();   
    if(page.name=="terms"){
      var cont= getConfiguration(79);
      $(".content_terms").html(cont[0].description);
    }
    if(page.name=="referrals"){
      var tipo='whatsapp://';
      if(localStorage.OS=="Android"){
        var tipo='com.whatsapp';
      }
      appAvailability.check(
            tipo, // Package Name or URI Scheme 
            function() {// Success callback 
              console.log('whatsapp is available');
            },
            function() {// Error callback 
              console.log('whatsapp is not available');
              $(".whatsapp").hide();
            }
            );
      getReferrals();
    }
    if(page.name=="rewards")getRewardsData(localStorage.id);       
    if(page.name=="chat"){
      var names='';
      if(localStorage.email){
        names=localStorage.email;
      }
      $("#usrname").val(names);
      if(names!="")loginChat();
    }    
}), $(document).ready(function() {    
    setSaldo(); 
    checkConnectionFB();
    showDivsConnect();
    
    var session_id= new Date().getTime();
    console.log("session "+session_id);

    naxvarBg(), $(".js-toggle-menu").on("click", function() {
        $(this).next().slideToggle(200), $(this).find("span").toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
    });
}), $.fn.serializeObject = function() {
    var o = {}, a = this.serializeArray();
    return $.each(a, function() {
        void 0 !== o[this.name] ? (o[this.name].push || (o[this.name] = [ o[this.name] ]), 
            o[this.name].push(this.value || "")) : o[this.name] = this.value || "";
    }), o;
};