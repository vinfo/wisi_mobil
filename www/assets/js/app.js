// Initialize app
var myApp = new Framework7({
    swipeBackPage: false,
    pushState: true,
    swipePanel: 'left',
    modalTitle: 'Title'
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

$$('body').on('click', '.js-add-to-fav', function () {
    myApp.alert('You love this post!', '');
});

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('.popup-splash').on('opened', function () {
    var mySwiper = myApp.swiper('.swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationBulletRender: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    });
});

$$(document).on('pageAfterAnimation', function (e) {
    if($('.page-on-center .chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .chart-content").getContext("2d");
        showLineChart(ctx);
    }

    if($('.page-on-center .line-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .line-chart-content").getContext("2d");
        showLineChartPage(ctx);
    }

    if($('.page-on-center .bar-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .bar-chart-content").getContext("2d");
        showBarChartPage(ctx);
    }

    if($('.page-on-center .pie-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .pie-chart-content").getContext("2d");
        showPieChartPage(ctx);
    }

    if($('.page-on-center .doughnut-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .doughnut-chart-content").getContext("2d");
        showDoughnutChartPage(ctx);
    }

    if($('.page-on-center .radar-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .radar-chart-content").getContext("2d");
        showRadarChartPage(ctx);
    }

    if($('.page-on-center .polar-chart-content').length > 0) {
        var ctx = document.querySelector(".page-on-center .polar-chart-content").getContext("2d");
        showPolarChartPage(ctx);
    }

    naxvarBg();
    teamSlider();
});

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    myApp.calendar({
        input: '#ks-calendar-default'
    });

    myApp.calendar({
        input: '#calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });

    myApp.calendar({
        input: '#calendar-range',
        dateFormat: 'M dd yyyy',
        rangePicker: true
    });

    var today = new Date();
    var weekLater = new Date().setDate(today.getDate() + 7);

    myApp.calendar({
        input: '#calendar-disabled',
        dateFormat: 'M dd yyyy',
        disabled: {
            from: today,
            to: weekLater
        }
    });

    myApp.calendar({
        container: '#calendar-inline-container',
        value: [new Date()]
    });

    $$('.notification-default').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            message: 'This is a simple notification message with title and message'
        });
    });
    $$('.notification-full').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            subtitle: 'Notification subtitle',
            message: 'This is a simple notification message with custom icon and subtitle',
            media: '<i class="icon icon-f7"></i>'
        });
    });
    $$('.notification-custom').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
        });
    });
    $$('.notification-callback').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
            onClose: function () {
                myApp.alert('Notification closed');
            }
        });
    });

    $( '.zoom' ).swipebox();

    $('.navbar').removeClass('navbar-clear');

    if( page.name === 'index'
        || page.name === 'dashboard-1'
        || page.name === 'post'
        || page.name === 'menu'
        || page.name === 'login'
        || page.name === 'registration'
        || page.name === 'article'
        || page.name === 'splash' ) {
        $('.navbar').addClass('navbar-clear');
    }

    if($('.twitter-content').length > 0) {
        $('.twitter-content').twittie({
            count: 10
        });
    }

    if($('.tweet').length > 0) {
        $('.tweet').twittie({
            count: 1
        });
    }

    if($('.flickr-content').length > 0) {
        $('.flickr-content').jflickrfeed({
            limit: 15,
            qstrings: {
                id: '44244432@N03'
            },
            itemTemplate: '<li><a href="{{image_m}}" class="flickr"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
        }, function (data) {
            $('.flickr-content li a').swipebox();
        });
    }

    if($(".owl-carousel").length > 0) {
        $(".owl-carousel").owlCarousel();
    }

    if($('.featured-articles-slider').length > 0) {
        $('.featured-articles-slider').owlCarousel({
            singleItem : true,
            navigation : false,
            navigationText : [],
            pagination : false,
            uniqueHistory: true,
            loop: true,
            autoPlay: 3000,
            stopOnHover: true
        });
    }

    if ($('.js-validate').length > 0) {
        $('body').on('click', '.js-form-submit', function() {
            var form = $(this).parents('form');
            var valid = form.valid();

            if( page.name === 'contact' && valid){
                var data = form.serializeObject();
                myApp.showPreloader();

                $.post( "/email.php", data)
                  .done(function( data ) {
                        myApp.hidePreloader();
                        var response = JSON.parse(data);

                        if(!response.error) {
                            myApp.alert(response.msg, '');
                            form.find("input[type=text], input[type=email], textarea").val("");;
                        } else {
                            myApp.alert(response.msg, '');
                        }
                  });
            }
        });
    }


    // Conversation flag
    var conversationStarted = false;

// Init Messages
    var myMessages = myApp.messages('.messages', {
        autoLayout:true
    });

// Init Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

// Handle message
    $$('.messagebar .link').on('click', function () {
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (messageText.length === 0) return;

        // Empty messagebar
        myMessagebar.clear()

        // Random message type
        var messageType = (['sent', 'received'])[Math.round(Math.random())];

        // Avatar and name for received message
        var avatar, name;
        if(messageType === 'received') {
            avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
            name = 'Kate';
        }
        // Add message
        myMessages.addMessage({
            // Message text
            text: messageText,
            // Random message type
            type: messageType,
            // Avatar and name:
            avatar: avatar,
            name: name,
            // Day
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });

        // Update conversation flag
        conversationStarted = true;
    });

    videoInit();
});

$(document).ready(function() {
    if( localStorage.getItem('newOptions') === null || localStorage.getItem('newOptions') === true ) {
        myApp.popup('.popup-splash');
        localStorage.setItem('newOptions', true);
    }

    if($('.chart-content').length > 0) {
        var obj = document.querySelector(".chart-content");
        var ctx = obj.getContext("2d");

        showLineChart(ctx);
    }

    if($('.line-chart-content').length > 0) {
        var obj = document.querySelector(".line-chart-content");
        var ctx = obj.getContext("2d");

        showLineChartPage(ctx);
    }

    if($('.bar-chart-content').length > 0) {
        var obj = document.querySelector(".bar-chart-content");
        var ctx = obj.getContext("2d");

        showBarChartPage(ctx);
    }

    if($('.pie-chart-content').length > 0) {
        var obj = document.querySelector(".pie-chart-content");
        var ctx = obj.getContext("2d");

        showPieChartPage(ctx);
    }

    if($('.doughnut-chart-content').length > 0) {
        var obj = document.querySelector(".doughnut-chart-content");
        var ctx = obj.getContext("2d");

        showDoughnutChartPage(ctx);
    }

    if($('.radar-chart-content').length > 0) {
        var obj = document.querySelector(".radar-chart-content");
        var ctx = obj.getContext("2d");

        showRadarChartPage(ctx);
    }

    if($('.polar-chart-content').length > 0) {
        var obj = document.querySelector(".polar-chart-content");
        var ctx = obj.getContext("2d");

        showPolarChartPage(ctx);
    }

    naxvarBg();

    $('.js-toggle-menu').on('click', function() {
        $(this).next().slideToggle(200);
        $(this).find('span').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
    });

    $('body').on('click', '.js-gallery-col', function() {
        var cols = $(this).data('cols');
        $('.gallery-list').attr({ 'data-cols' : cols });

        $('.js-gallery-col').removeClass('active');
        $(this).addClass('active');
    });

    setTimeout(function() {
        videoInit();
        teamSlider();
    }, 100);
});


$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function videoInit() {
    var videoBg = findElement('.play-bg-video');

    if(videoBg.length > 0) {
        videoBg.vide('assets/video/video');
    }
}

function teamSlider() {
    var owl = findElement('.team');

    owl.owlCarousel({
        singleItem : true,
        navigation : false,
        navigationText : [],
        pagination : false,
        uniqueHistory: true
    });
    findElement(".team-nav-right").click(function(){
        owl.trigger('owl.next');
    });
    findElement(".team-nav-left").click(function(){
        owl.trigger('owl.prev');
    });
}

function findElement(selector) {
    var box = null;

    if($('.page-on-center').length > 0) {
        box = $('.view-main').find('.page-on-center ' + selector);

        if(box.length === 0) {
            box = $('.view-main').find('.page-on-center' + selector);
        }

    } else {
        box = $('.view-main').find('.page').find(selector);
    }

    return box;
};

function naxvarBg() {
    var navbar = $('.navbar-anim-on-scroll'),
        box = null,
        cls = 'active';

    if(navbar.length === 0) {
        return false;
    }

    if($('.page-on-center').length > 0) {
        box = navbar.next().find('.page-on-center .page-content');
    } else {
        box = navbar.next().find('.page .page-content');
    }

    if( box.scrollTop() > 10 ) {
        navbar.addClass( cls );
    }else{
        navbar.removeClass( cls );
    }

    box.scroll(function() {
        if( $(this).scrollTop() > 40 ) {
            navbar.addClass( cls );
        }else{
            navbar.removeClass( cls );
        }
    });
}

function showLineChart(obj) {
    var data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label               : "My dataset",
                fillColor           : "rgba(54, 133, 176, 0.2)",
                strokeColor         : "rgba(54, 133, 176, 1)",
                pointColor          : "rgba(54, 133, 176, 1)",
                pointStrokeColor    : "rgba(54, 133, 176, 1)",
                pointHighlightFill  : "rgba(255, 255, 255, 1)",
                pointHighlightStroke: "rgba(54, 133, 176, 1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    var chart = new Chart(obj).Line(data, {
        responsive                  : true,

        pointDotRadius              : 3,
        pointDotStrokeWidth         : 1,
        datasetStrokeWidth          : 2,

        scaleFontSize               : 10,
        tooltipFontSize             : 12,

        scaleLineColor              : "rgba(0, 0, 0, 0.7)",
        scaleFontColor              : "rgba(0, 0, 0, 0.7)",

        scaleBeginAtZero            : true,
        scaleShowGridLines          : true,
        scaleShowHorizontalLines    : true,
        scaleShowVerticalLines      : false
    });

    return chart;
}

function showLineChartPage(obj) {
    var data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label               : "My dataset",
                fillColor           : "rgba(54, 133, 176, 0.2)",
                strokeColor         : "rgba(54, 133, 176, 1)",
                pointColor          : "rgba(54, 133, 176, 1)",
                pointStrokeColor    : "rgba(54, 133, 176, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(54, 133, 176, 1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }, {
                label               : "My dataset 2",
                fillColor           : "rgba(224, 61, 14, 0.2)",
                strokeColor         : "rgba(224, 61, 14, 1)",
                pointColor          : "rgba(224, 61, 14, 1)",
                pointStrokeColor    : "rgba(224, 61, 14, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(224, 61, 14, 1)",
                data: [32, 34, 67, 12, 37, 55, 20]
            }
        ]
    };

    var chart = new Chart(obj).Line(data, {
        responsive                  : true,

        pointDotRadius              : 4,
        pointDotStrokeWidth         : 1,
        datasetStrokeWidth          : 2,

        scaleFontSize               : 10,
        tooltipFontSize             : 12,

        scaleLineColor              : "rgba(0, 0, 0, 0.7)",
        scaleFontColor              : "rgba(0, 0, 0, 0.7)",

        scaleBeginAtZero            : true,
        scaleShowGridLines          : true,
        scaleShowHorizontalLines    : true,
        scaleShowVerticalLines      : false
    });

    return chart;
}

function showBarChartPage(obj) {
    var data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label               : "My dataset",
                fillColor           : "rgba(54, 133, 176, 0.2)",
                strokeColor         : "rgba(54, 133, 176, 1)",
                pointColor          : "rgba(54, 133, 176, 1)",
                pointStrokeColor    : "rgba(0, 0, 0, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(54, 133, 176, 1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }, {
                label               : "My dataset 2",
                fillColor           : "rgba(224, 61, 14, 0.2)",
                strokeColor         : "rgba(224, 61, 14, 1)",
                pointColor          : "rgba(224, 61, 14, 1)",
                pointStrokeColor    : "rgba(0, 0, 0, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(224, 61, 14, 1)",
                data: [32, 34, 67, 12, 37, 55, 20]
            }
        ]
    };

    var chart = new Chart(obj).Bar(data, {
        responsive                  : true,

        pointDotRadius              : 2,
        pointDotStrokeWidth         : 1,
        datasetStrokeWidth          : 1,

        scaleFontSize               : 10,
        tooltipFontSize             : 12,

        scaleLineColor              : "rgba(0, 0, 0, 0.7)",
        scaleFontColor              : "rgba(0, 0, 0, 0.7)",

        scaleBeginAtZero            : true,
        scaleShowGridLines          : true,
        scaleShowHorizontalLines    : true,
        scaleShowVerticalLines      : false
    });

    return chart;
}

function showPieChartPage(obj) {
    var data = [
        {
            value: 300,
            color: "rgba(54, 133, 176, 1)",
            highlight: "rgba(54, 133, 176, 0.5)",
            label: "Text 1"
        },
        {
            value: 50,
            color: "rgba(224, 61, 14, 1)",
            highlight: "rgba(224, 61, 14, 0.5)",
            label: "Text 2"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Text 3"
        }
    ]


    var chart = new Chart(obj).Pie(data, {
        responsive                  : true,
        tooltipFontSize             : 12
    });

    return chart;
}

function showDoughnutChartPage(obj) {
    var data = [
        {
            value: 300,
            color: "rgba(54, 133, 176, 1)",
            highlight: "rgba(54, 133, 176, 0.5)",
            label: "Text 1"
        },
        {
            value: 50,
            color: "rgba(224, 61, 14, 1)",
            highlight: "rgba(224, 61, 14, 0.5)",
            label: "Text 2"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Text 3"
        }
    ]


    var chart = new Chart(obj).Doughnut(data, {
        responsive                  : true,
        tooltipFontSize             : 12
    });

    return chart;
}

function showRadarChartPage(obj) {
    var data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label               : "My dataset",
                fillColor           : "rgba(54, 133, 176, 0.2)",
                strokeColor         : "rgba(54, 133, 176, 1)",
                pointColor          : "rgba(54, 133, 176, 1)",
                pointStrokeColor    : "rgba(54, 133, 176, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(54, 133, 176, 1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }, {
                label               : "My dataset 2",
                fillColor           : "rgba(224, 61, 14, 0.2)",
                strokeColor         : "rgba(224, 61, 14, 1)",
                pointColor          : "rgba(224, 61, 14, 1)",
                pointStrokeColor    : "rgba(224, 61, 14, 1)",
                pointHighlightFill  : "rgba(0, 0, 0, 1)",
                pointHighlightStroke: "rgba(224, 61, 14, 1)",
                data: [32, 34, 67, 12, 37, 55, 20]
            }
        ]
    };

    var chart = new Chart(obj).Radar(data, {
        responsive                  : true,

        pointDotRadius              : 3,
        pointDotStrokeWidth         : 1,
        datasetStrokeWidth          : 2,

        scaleFontSize               : 10,
        tooltipFontSize             : 12,

        scaleLineColor              : "rgba(0, 0, 0, 0.7)",
        scaleFontColor              : "rgba(0, 0, 0, 0.7)",
        pointLabelFontColor         : "rgba(0, 0, 0, 0.7)",

        scaleBeginAtZero            : true,
        scaleShowGridLines          : true,
        scaleShowHorizontalLines    : true,
        scaleShowVerticalLines      : false
    });

    return chart;
}

function showPolarChartPage(obj) {
    var data = [
        {
            value: 300,
            color: "rgba(54, 133, 176, 1)",
            highlight: "rgba(54, 133, 176, 0.5)",
            label: "Text 1"
        },
        {
            value: 50,
            color: "rgba(224, 61, 14, 1)",
            highlight: "rgba(224, 61, 14, 0.5)",
            label: "Text 2"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Text 3"
        }
    ]


    var chart = new Chart(obj).PolarArea(data, {
        responsive                  : true,
        scaleFontSize               : 10,
        tooltipFontSize             : 12
    });

    return chart;
}

function hidePreloader() {
    jQuery('.page-preloader').animate({
        opacity: 0
    }, function() {
        jQuery(this).hide();
    });
}