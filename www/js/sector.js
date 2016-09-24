if (window.jQuery) {  
	localStorage.domain = "http://buffetexpress.com.co/REST/";
	localStorage.setItem("quadrant","");
	localStorage.setItem("banner","");
	var zonas= ajaxrest.getZones();
	if(zonas.length>0){
		localStorage.setItem("zonas",JSON.stringify(zonas));
		for (var i=0; i < zonas.length; i++){
			if(zonas[i].closez==1){
				$('#zonas').append($('<option>', { 
					value: zonas[i].code+"|"+zonas[i].id+"|"+zonas[i].coordinates+"|"+zonas[i].ciudad+"|"+zonas[i].domicilio+"|"+zonas[i].hora_hasta,
					text : zonas[i].name
				}));
			}
		}
		$('#zonas').append($('<option>', { 
			value: "cam002|0|0|",
			text : "Me encuentro en otro sector"
		}));		
	}
	$(document).on("change", "select", function() {
		var data= this.value.split("|");     
		cleanSession();
		var coord= data[2].split(",");
		var coords = {lat:coord[0], lng:coord[1]};
		if(data[1]==0){
			localStorage.setItem("plato",1);
			localStorage.setItem("tipo_pago","efectivo");  
			localStorage.setItem("quadrant","");    	
			localStorage.setItem("zona",JSON.stringify({id:2,code:data[0],coords:data[2],ciudad:data[3],domicilio:'0',hasta:''}));
			localStorage.setItem("position",JSON.stringify(coords));    	
		}else{		
			localStorage.setItem("plato",1);
			localStorage.setItem("tipo_pago","efectivo");      	
			localStorage.setItem("quadrant","d");
			localStorage.setItem("MsgZone",1);
			localStorage.setItem("zona",JSON.stringify({id:data[1],code:data[0],coords:data[2],ciudad:data[3],domicilio:data[4],hasta:data[5]}));
			localStorage.setItem("position",JSON.stringify(coords)); 
		}
		var timer= new Date().getTime();
		localStorage.setItem("timer",timer);
		localStorage.setItem("GPS","false");
		window.location.href = 'internal.html#/carta';
	});	
}