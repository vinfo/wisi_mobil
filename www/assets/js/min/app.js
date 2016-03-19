// Initialize app
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
             localStorage.setItem("id", res.userdata.id);
             localStorage.setItem("name",  res.userdata.name);
             localStorage.setItem("lastname",  res.userdata.lastname);
             localStorage.setItem("email",  res.userdata.email);
             localStorage.setItem("logged_in", true);
             localStorage.setItem("token", res.token.token);
             window.location.href = "index.html";
         }
     });
    }else{
        myApp.alert("Email y Contraseña son requeridos!", "");
    }
}
function scanear(){
   cordova.plugins.barcodeScanner.scan(
      function (result) {
          $("#code_b").val(result.text);
          setCode(result.text);
      }, 
      function (error) {
          alert("¨Problemas Scanneando: " + error);
      }
      ); 
}
function setCode(code){
    if(code!=""){
        var data={code:code.trim()};
        $.ajax({
            url: "http://wisi.com.co/api/barcode",
            type: "get",
            data: data,
            success: function(res){
                if(res.status){
                    $("#time").val(res.data[0].time_b);
                }else{
                   myApp.alert("Código no valido!", ""); 
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
            localStorage.setItem("logged_in",true);
        } else {
            localStorage.setItem("logged_in",false);
        }
        showDivsConnect();
    });
}
function getUserData(id) {    
    var data={id:id,table:"user"};
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
                $("#rechargeds").prepend('<li class="list-re mt-0 mb-0 nice-list"><div class="item-inner"><div class="title-re">Código: '+o.code_b+'</div><div class="nice-list">Fecha/Hora: '+o.datereg+'<br/>Vence: '+o.expired+'<br/>Tiempo: '+o.time_b+' mins.<br/>Estado: '+o.status+'.<br/></div></div></li>');
            }
        }
    });
}

function randSlider() {
    var num= Math.floor((Math.random() * 5) + 1);
    $(".full-page-video").css('background-image','url("http://wisi.com.co/assets/img/sliders/slider'+num+'.jpg")');
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
            var gender=38;
            if(response.gender=="male")gender=39;
            localStorage.setItem("network",response.id);
            localStorage.setItem("name",  response.first_name);
            localStorage.setItem("lastname",  response.last_name);
            localStorage.setItem("email",  response.email);
            localStorage.setItem("gender",  gender);
            localStorage.setItem("picture",  response.picture.data.url);
            localStorage.setItem("logged_in", true);
            showDivsConnect();
            var data=$.param({data:{id:response.id,first_name:response.first_name,last_name:response.last_name,email:response.email,gender:gender,picture:response.picture}});
            $.ajax({
                url: "http://wisi.com.co/api/social/sigin",
                type: "post",
                data: data,
                success: function(d){
                    var level="1";
                    if(localStorage.cont_started=="true")level="2";
                    showDivsConnect();
                    localStorage.setItem("cont_started",true);
                    localStorage.setItem("userid",d.userdata.id);
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
            function (error) { myApp.alert("Problemas conectando con Facebook!", ""); }
            );
    }else{
        myApp.alert("Debe aceptar los términos y condiciones!", "");
    }
});

$$("body").on("click", ".pautar", function() {
    window.open("http://wisi.com.co/public/#/", "_system");
});
$$("body").on("click", ".free-navegate", function() {
    window.open("http://wisi.com.co/public/#/ad/3/"+localStorage.userid, "_system");
});
$$("body").on("click", ".button-recharged", function() {
    var code_b=$("#code_b").val();
    var key_b=$("#key_b").val();
    var time_b=$("#time_b").val();
    if(code_b!=""&&key_b!=""){
        var data={userid:localStorage.userid,code:code_b,key_b:key_b,time:time_b,action:"0",type:"59",status:"50"};
        $.ajax({
            url: "http://wisi.com.co/api/setBalance",
            type: "post",
            data: data,
            success: function(d){
               myApp.alert("Datos cargados exitosamente!", "");
               window.location.href = "rechargeds.html";
           }
       });
    }else{
       myApp.alert("Código y Clave son requeridos!", ""); 
    }
});

$$("body").on("click", ".close_sesion", function() {
    localStorage.clear();
    window.location.href = "index.html";
});

$$("body").on("change", "#code_b", function() {
    setCode(this.value);
});

$$("body").on("click", "#send-button", function() {
    alert(localStorage.page);
});

var mainView = myApp.addView(".view-main", {
    dynamicNavbar: !0
});
$$(document).on("pageInit", function(e) {
    checkConnectionFB();
    var page = e.detail.page;
    localStorage.setItem("page",page);
    var userid=localStorage.userid;
    if(page.name=="mydata")getUserData(userid);
    if(page.name=="rechargeds")getRechargedData(userid);

    // Conversation flag
    var conversationStarted = !1, myMessages = myApp.messages(".messages", {
        autoLayout: !0
    }), myMessagebar = myApp.messagebar(".messagebar");
    // Handle message
    $$(".messagebar .link").on("click", function() {
        var name_user="Invitado";
        if(localStorage.name!="")name_user=localStorage.name+" "+localStorage.lastname;
        $(".message-name").html(name_user);        
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (0 !== messageText.length) {
            // Empty messagebar
            myMessagebar.clear();
            // Random message type
            var avatar, name, messageType = [ "sent", "received" ][Math.round(Math.random())];
            "received" === messageType && (avatar = "http://lorempixel.com/output/people-q-c-100-100-9.jpg", 
            name = name_user), // Add message
            myMessages.addMessage({
                // Message text
                text: messageText,
                // Random message type
                type: messageType,
                // Avatar and name:
                avatar: avatar,
                name: name,
                // Day
                day: conversationStarted ? !1 : "Today",
                time: conversationStarted ? !1 : new Date().getHours() + ":" + new Date().getMinutes()
            }), // Update conversation flag
            conversationStarted = !0;
        }
    });
}), $(document).ready(function() {
    //randSlider();    
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