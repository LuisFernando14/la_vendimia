$(document).ready(function () {
	var clave_cliente_buscado = 0;
	$("#contenido").load("nav.html"); 

	//Cargamos los clientes registrados
	$(function(){
		$.ajax({
			url: 'controlador/ClienteController.php?f=mostrarClientes',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				$(data).each(function(i,v){
					$('#tablaClientes tbody').append(
						'<tr clave="' + v.clave + '"><td>'+ v.clave + '</td><td>'+v.nombre+'</td><td><a id="'+v.clave+'" href="#" style="text-decoration: none;"><span style="color: black;" class="glyphicon glyphicon-pencil"></span></a></td></tr>'
					);
				});
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

	//Desplegamos el modal para obervar los datos
	
	$(document).on("click", "tr a", function(){
		//alert($(this).attr('id')); Funciona
		var parametros = {
			"clave_cliente" : $(this).attr('id')
		};

		$.ajax({
			url: 'controlador/ClienteController.php?f=consultaCliente',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				clave_cliente_buscado = data['clave'];
				$('#claveClienteBuscado').html('Clave:  '+clave_cliente_buscado);
				$('#txtNombreClienteConsultado').val(data['nombre']);
				$('#txtPaternoClienteConsultado').val(data['paterno']);
				$('#txtMaternoClienteConsultado').val(data['materno']);
				$('#txtRfcClienteConsultado').val(data['rfc']);

				$('#modalClienteBuscado').modal();
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	

	});

	$('#btnGuardarCambios').click(function () {
		var nombreConsultado = $('#txtNombreClienteConsultado').val();
		var paternoConsultado =  $('#txtPaternoClienteConsultado').val();
		var maternoConsultado = $('#txtMaternoClienteConsultado').val();
		var rfcConsultado = $('#txtRfcClienteConsultado').val();

		if(nombreConsultado == '' || paternoConsultado == '' || maternoConsultado == '' || rfcConsultado == '') {
			$('#mensajeGuardado').html("Complete todos los campos correctamente.");
			
			setTimeout(function(){
				$('#mensajeGuardado').html("");	
			}, 3500);
			return;
		}

		var parametros = {
			"clave" : clave_cliente_buscado,
			"nombreCliente" : $('#txtNombreClienteConsultado').val(),
			"paternoCliente" :	$('#txtPaternoClienteConsultado').val(),
			"maternoCliente" :	$('#txtMaternoClienteConsultado').val(),
			"rfcCliente" :	$('#txtRfcClienteConsultado').val()
		};
		$.ajax({
			url: 'controlador/ClienteController.php?f=modificaCliente',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				if(data['estado_peticion'] == 'success') {
					$('#mensajeGuardado').html("Cliente modificado exitosamente");
					setTimeout(function(){
						$('#mensajeGuardado').html("");
						$('#modalClienteBuscado').modal('toggle');
						location.reload();	
					}, 3500);
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	
	});
});