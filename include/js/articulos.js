$(document).ready(function () {
	$('#contenido').load('nav.html');
	var clave_articulo_buscado = 0;

	//Mostramos los artículos disponibles
	$(function(){
		$.ajax({
			url: 'controlador/ArticuloController.php?f=verArticulos',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				$(data).each(function(i,v){
					$('#tablaArticulos tbody').append(
						'<tr clave="' + v.clave + '"><td>'+ v.clave + '</td><td>'+v.descripcion+'</td><td><a id="'+v.clave+'" href="#" style="text-decoration: none;"><span style="color: black;" class="glyphicon glyphicon-pencil"></span></a></td></tr>'
					);
				});
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

	//Desplegamos el modal para observar los datos
	$(document).on("click", "tr a", function(){
		var parametros = {
			"clave_articulo" : $(this).attr('id')
		};

		$.ajax({
			url: 'controlador/ArticuloController.php?f=consultaArticulo',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				clave_articulo_buscado = data['clave'];
				$('#claveArticuloBuscado').html('Clave:  '+clave_articulo_buscado);
				$('#txtDescripcionArticuloConsultado').val(data['descripcion']);
				$('#txtModeloArticuloConsultado').val(data['modelo']);
				$('#txtPrecioArticuloConsultado').val(data['precio']);
				$('#txtExistenciaArticuloConsultado').val(data['existencia']);

				$('#modalArticuloBuscado').modal();
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	

	});

	$('#txtExistenciaArticuloConsultado').on('keypress', function(e) {
	    if(e.keyCode < 48 || e.keyCode > 57){
	    	e.preventDefault();
	        return;
	    }
	});

	//Guardamos los cambios en el artículo consultado
	$('#btnGuardarCambios').click(function () {
		var desc = $('#txtDescripcionArticuloConsultado').val();
		var mod = $('#txtModeloArticuloConsultado').val();
		var prec = $('#txtPrecioArticuloConsultado').val();
		var exis = $('#txtExistenciaArticuloConsultado').val();

		if(desc == '' || mod == '' || prec == '' || exis == '') {
			$('#mensajeGuardado').css('color', 'red');
			$('#mensajeGuardado').html('Faltan campos por completar');
			setTimeout(function(){
				$('#mensajeGuardado').css('color', 'black');
				$('#mensajeGuardado').html('');
			}, 3500);
			return;
		}

		var parametros = {
			"clave" : clave_articulo_buscado,
			"descripcion" : $('#txtDescripcionArticuloConsultado').val(),
			"modelo" :	$('#txtModeloArticuloConsultado').val(),
			"precio" :	$('#txtPrecioArticuloConsultado').val(),
			"existencia" :	$('#txtExistenciaArticuloConsultado').val()
		};
		$.ajax({
			url: 'controlador/ArticuloController.php?f=modificaArticulo',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				if(data['estado_peticion'] == 'success') {
					$('#mensajeGuardado').css('color', 'green');
					$('#mensajeGuardado').html("Artículo modificado exitosamente");
					setTimeout(function(){
						$('#mensajeGuardado').css('color', 'black');
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