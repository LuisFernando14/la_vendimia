$(document).ready(function () {
	
	//Cargamos la barra de navegación
	$('#contenido').load('nav.html');


	//Obtenemos el id que se le asignaría al artículo
	$(function(){
		$.ajax({
			url: 'controlador/ArticuloController.php?f=ultimaClaveInsertada',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				if(data['estado_peticion'] == 'success') {
						$('#claveNuevoArticulo').html("Clave: "+(data['ultimaClave']+1));	
				}				
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

	$('#btnSiguiente').click(function () {
		var descripcion = $('#txtDescripcionArticulo').val();
		var modelo = $('#txtModeloArticulo').val();
		var precio = $('#txtPrecioArticulo').val();
		var existencia = $('#txtExistenciaArticulo').val();

		if(descripcion == '' || modelo == '' || precio == '' || existencia == '') {
			if(descripcion == '') {
				$('#mensajeSistema').html("No es posible continuar, debe ingresar Descripcion es obligatorio.");
				setTimeout(function(){
					$('#mensajeSistema').html("");
				}, 3000);
				return;
			}
			if(modelo == '') {
				$('#mensajeSistema').html("No es posible continuar, debe ingresar Modelo es obligatorio.");
				setTimeout(function(){
					$('#mensajeSistema').html("");
				}, 3000);
				return;
			}
			if(precio == '') {
				$('#mensajeSistema').html("No es posible continuar, debe ingresar Precio es obligatorio.");
				setTimeout(function(){
					$('#mensajeSistema').html("");
				}, 3000);
				return;
			}
			$('#mensajeSistema').html("No es posible continuar, debe ingresar Existencia es obligatorio.");
			setTimeout(function(){
				$('#mensajeSistema').html("");
			}, 3000);
			return;
		}
		var parametros = {
			"descripcion" : descripcion,
			"modelo" : modelo,
			"precio" : precio,
			"existencia" : existencia
		};

		$.ajax({
			url: 'controlador/ArticuloController.php?f=agregarArticulo',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				if(data["estado_peticion"] == "success") {
					alert(data['respuesta_servidor']);
					window.location.replace("articulos.html");
					return;
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	
	});


	function limpiarCajasTexto () {
		$('#txtDescripcionArticulo').val('');
		$('#txtModeloArticulo').val('');
		$('#txtPrecioArticulo').val('');
		$('#txtExistenciaArticulo').val('');
	}


	$('#btnCancelar').click(function () {
		var resultado = confirm("¿Desea cancelar la operación actual?");
		if(!resultado)
			return;
		window.location.replace("articulos.html");
	});

	//Si la caja de texto pierde el foco y está vacía, se dibuja un contorno rojo, caso contrario, no se pinta contorno
	$('#txtDescripcionArticulo').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	//Si la caja de texto pierde el foco y está vacía, se dibuja un contorno rojo, caso contrario, no se pinta contorno
	$('#txtModeloArticulo').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	//Si la caja de texto pierde el foco y está vacía, se dibuja un contorno rojo, caso contrario, no se pinta contorno
	$('#txtPrecioArticulo').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	//Si la caja de texto pierde el foco y está vacía, se dibuja un contorno rojo, caso contrario, no se pinta contorno
	$('#txtExistenciaArticulo').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	//Solo se aceptan existencias enteras
	$('#txtExistenciaArticulo').on('keypress', function(e) {
	    if(e.keyCode < 48 || e.keyCode > 57){
	    	e.preventDefault();
	        return;
	    }
	});









});