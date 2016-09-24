// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ["ngRoute","ngSanitize"]);

// Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'templates/login.html',
		controller 	: 'loginController'
	})
	.when('/cuenta', {
		templateUrl : 'templates/cuenta.html',
		controller 	: 'cuentaController'
	})	
	.when('/login/:email', {
		templateUrl : 'templates/login.html',
		controller 	: 'loginController'
	})
	.when('/terminos', {
		templateUrl : 'templates/terminos.html',
		controller 	: 'terminosController'
	})	
	.when('/politicas', {
		templateUrl : 'templates/politicas.html',
		controller 	: 'politicasController'
	})	
	.when('/clave', {
		templateUrl : 'templates/clave.html',
		controller 	: 'claveController'
	})	
	.otherwise({
		redirectTo: '/'
	});
});

angularRoutingApp.controller('loginController', function($scope, $location,$routeParams) {	
	if(localStorage.dimension<380){
		$scope.logo="images/logo_pno.png";
	}else{
		$scope.logo="images/logo.png";
	}
	$scope.goInternal = function() {
		window.location = "internal.html";	
	},		
	$scope.doLogin = function() {
		ajaxrest.login(82);
	},	
	$scope.doView = function (hash) {
		$location.path(hash);
	},
	$scope.doBack = function () {
/*		  $('.container').animate({
			  scrollTop: $("#topmobil").offset().top
		  }, 5);*/		
		 window.history.back();
	},	
	$scope.hiddeMenu = function () {
		hiddeMenu();
	}	
});

angularRoutingApp.controller('cuentaController', function($scope) {
	if(localStorage.dimension<380){
		$scope.logo="images/logo_pno.png";
	}else{
		$scope.logo="images/logo.png";
	}	
	$scope.setAccount = function () {
		ajaxrest.setAccount('add',82);
	}
});

angularRoutingApp.controller('terminosController', function($scope) {
		var data= ajaxrest.getContent("id=1355&token="+localStorage.token);	
		var dat = angular.fromJson(data);
		console.log(dat[0].contenido_matrix);
		$scope.terminos = dat[0].contenido_matrix;
});


angularRoutingApp.controller('politicasController', function($scope) {
		var data= ajaxrest.getContent("id=1356&token="+localStorage.token);	
		var dat = angular.fromJson(data);
		$scope.terminos = dat[0].contenido_matrix;
});

angularRoutingApp.controller('claveController', function($scope) {
	$scope.getPass = function () {
		var email= $("#email").val();		
		if(email){
			if(validateEmail(email)){
				var data= ajaxrest.getUser("email="+email+"&token="+localStorage.token);	
				var dat= angular.fromJson(data);
				if(dat[0].name!="" && dat[0].name!=""){
					var data= ajaxrest.getPass("email="+email+"&identity="+dat[0].identity+"&token="+localStorage.token);
				}
			}else{
				alert("E-mail no valido!");
			}
		}else{
			alert("E-mail requerido!");
		}
	}
});