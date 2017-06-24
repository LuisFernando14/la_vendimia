$(document).ready(function () {
	$('#contenido').load('nav.html');

	$(function(){
		$.ajax({
			url: 'controlador/ConfiguracionController.php?f=mostrarInformacion',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				$('#txtTasaFinanciamiento').val(data['tasa']);
				$('#txtEnganche').val(data['enganche']);
				$('#txtPlazoMaximo').val(data['plazo']);
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});


	$('#btnSiguiente').click(function () {
		var financiamiento = $('#txtTasaFinanciamiento').val();
		var enganche = $('#txtEnganche').val();
		var plazo = $('#txtPlazoMaximo').val();

		//Al menos uno debe estar con datos
		if(financiamiento == '' && enganche == '' && plazo == '') {
			alert("Complete por lo menos un campo");
			return;
		}

		var parametros = {
			"tasa" : financiamiento,
			"enganche" : enganche,
			"plazo" : plazo
		};

		$.ajax({
			url: 'controlador/ConfiguracionController.php?f=agregarOModificarConfiguracion',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				if(data['estado_peticion'] == 'success') {
					alert("AL cien");
					
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	

	});
});