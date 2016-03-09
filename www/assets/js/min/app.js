// Initialize app
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
    showDivsConnect();
    facebookConnectPlugin.getLoginStatus(function(response) {
        if (response.status == 'connected'&&response.authResponse.userID==localStorage.id) { 
            localStorage.setItem("logged_in",true);
            showDivsConnect();    
        } else {
            localStorage.setItem("logged_in",false);
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
            localStorage.setItem("id",response.id);
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
                    window.open("http://wisi.com.co/public/#/ad/"+level+"/"+d.userdata.id, "_system");
                    localStorage.setItem("cont_started",true);
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

$$("body").on("click", ".close_sesion", function() {
    localStorage.clear();
    location.reload();
});


var mainView = myApp.addView(".view-main", {
    dynamicNavbar: !0
});
$$(document).on("pageInit", function(e) {
    checkConnectionFB();
    var page = e.detail.page;

    myApp.calendar({
        input: "#ks-calendar-default"
    }), myApp.calendar({
        input: "#calendar-multiple",
        dateFormat: "M dd yyyy",
        multiple: !0
    }), myApp.calendar({
        input: "#calendar-range",
        dateFormat: "M dd yyyy",
        rangePicker: !0
    });
    var today = new Date(), weekLater = new Date().setDate(today.getDate() + 7);
    myApp.calendar({
        input: "#calendar-disabled",
        dateFormat: "M dd yyyy",
        disabled: {
            from: today,
            to: weekLater
        }
    }), myApp.calendar({
        container: "#calendar-inline-container",
        value: [ new Date() ]
    }), $$(".notification-default").on("click", function() {
        myApp.addNotification({
            title: "Framework7",
            message: "This is a simple notification message with title and message"
        });
    }), $$(".notification-full").on("click", function() {
        myApp.addNotification({
            title: "Framework7",
            subtitle: "Notification subtitle",
            message: "This is a simple notification message with custom icon and subtitle",
            media: '<i class="icon icon-f7"></i>'
        });
    }), $$(".notification-custom").on("click", function() {
        myApp.addNotification({
            title: "My Awesome App",
            subtitle: "New message from John Doe",
            message: "Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.",
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
        });
    }), $$(".notification-callback").on("click", function() {
        myApp.addNotification({
            title: "My Awesome App",
            subtitle: "New message from John Doe",
            message: "Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.",
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
            onClose: function() {
                myApp.alert("Notification closed");
            }
        });
    }), $(".navbar").removeClass("navbar-clear"), ("index" === page.name || "dashboard-1" === page.name || "post" === page.name || "menu" === page.name || "login" === page.name || "registration" === page.name || "article" === page.name || "splash" === page.name) && $(".navbar").addClass("navbar-clear"), 
    $(".twitter-content").length > 0 && $(".twitter-content").twittie({
        count: 10
    }), $(".tweet").length > 0 && $(".tweet").twittie({
        count: 1
    }), $(".flickr-content").length > 0 && $(".flickr-content").jflickrfeed({
        limit: 15,
        qstrings: {
            id: "44244432@N03"
        },
        itemTemplate: '<li><a href="{{image_m}}" class="flickr"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
    }, function(data) {
        $(".flickr-content li a").swipebox();
    }), $(".owl-carousel").length > 0 && $(".owl-carousel").owlCarousel(), $(".featured-articles-slider").length > 0 && $(".featured-articles-slider").owlCarousel({
        singleItem: !0,
        navigation: !1,
        navigationText: [],
        pagination: !1,
        uniqueHistory: !0,
        loop: !0,
        autoPlay: 3e3,
        stopOnHover: !0
    }), $(".js-validate").length > 0 && $("body").on("click", ".js-form-submit", function() {
        var form = $(this).parents("form"), valid = form.valid();
        if ("contact" === page.name && valid) {
            var data = form.serializeObject();
            myApp.showPreloader(), $.post("/email.php", data).done(function(data) {
                myApp.hidePreloader();
                var response = JSON.parse(data);
                response.error ? myApp.alert(response.msg, "") : (myApp.alert(response.msg, ""), 
                    form.find("input[type=text], input[type=email], textarea").val(""));
            });
        }
    });
    // Conversation flag
    var conversationStarted = !1, myMessages = myApp.messages(".messages", {
        autoLayout: !0
    }), myMessagebar = myApp.messagebar(".messagebar");
    // Handle message
    $$(".messagebar .link").on("click", function() {
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (0 !== messageText.length) {
            // Empty messagebar
            myMessagebar.clear();
            // Random message type
            var avatar, name, messageType = [ "sent", "received" ][Math.round(Math.random())];
            "received" === messageType && (avatar = "http://lorempixel.com/output/people-q-c-100-100-9.jpg", 
            name = "Kate"), // Add message
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

    if ((null === localStorage.getItem("newOptions") || localStorage.getItem("newOptions") === !0) && (myApp.popup(".popup-splash"), 
        localStorage.setItem("newOptions", !0)), $(".chart-content").length > 0) {
        var obj = document.querySelector(".chart-content"), ctx = obj.getContext("2d");
    showLineChart(ctx);
}
naxvarBg(), $(".js-toggle-menu").on("click", function() {
    $(this).next().slideToggle(200), $(this).find("span").toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
}), $("body").on("click", ".js-gallery-col", function() {
    var cols = $(this).data("cols");
    $(".gallery-list").attr({
        "data-cols": cols
    }), $(".js-gallery-col").removeClass("active"), $(this).addClass("active");
});
}), $.fn.serializeObject = function() {
    var o = {}, a = this.serializeArray();
    return $.each(a, function() {
        void 0 !== o[this.name] ? (o[this.name].push || (o[this.name] = [ o[this.name] ]), 
            o[this.name].push(this.value || "")) : o[this.name] = this.value || "";
    }), o;
};