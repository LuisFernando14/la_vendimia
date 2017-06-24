$(document).ready(function () {

	$('#contenido').load('nav.html');

	$('#btnSiguienteCliente').click(function () {
		var nombre = $('#txtNombreCliente').val();
		var paterno = $('#txtPaternoCliente').val();
		var materno = $('#txtMaternoCliente').val();
		var rfc = $('#txtRFCCliente').val();

		if(nombre == '' || paterno == '' || materno == '' || rfc == '') {
			var vacio = "";
			if(nombre == '') {
				vacio = "Nombre";
			}
			else if(paterno == '') {
				vacio = "Apellido Paterno";
			}
			else if (materno == '') {
				vacio = "Apellido Materno";
			}
			else {
				vacio = "RFC";
			}
			$('#mensajeSistema').css('color', 'red');
			$('#mensajeSistema').html('“No es posible continuar, debe ingresar '+vacio+' es obligatorio');
			setTimeout(function(){
				$('#mensajeSistema').css('color', 'black');
				$('#mensajeSistema').html("");
			}, 3500);
			setFocus (nombre, paterno, materno, rfc);
			return;
		}

		var parametros = {
			"nombreCliente" : nombre,
			"paternoCliente" : paterno,
			"maternoCliente" : materno,
			"rfcCliente" : rfc
		};

		$.ajax({
			url: 'controlador/ClienteController.php?f=agregarCliente',
			type: 'POST',
			dataType: 'json',
			data: parametros,
			success:function(data){
				if(data["estado_peticion"] == "success") {
					//alert(data['respuesta_servidor']);
					$('#mensajeSistema').css('color', 'green');
					$('#mensajeSistema').html(data['respuesta_servidor']);
					setTimeout(function(){
						$('#mensajeSistema').css('color', 'black');
						$('#mensajeSistema').html("");
						window.location.replace("clientes.html");
					}, 3000);
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	
	});

	$('#btnCancelar').click(function () {
		var resultado = confirm("¿Desea cancelar la operación actual?");
		if(!resultado)
			return;
		window.location.replace("clientes.html");
	});

	function setFocus (nomb, pat, mat, rfcC) {
		if(nomb == '') {
			$('#txtNombreCliente').focus();
			return;
		}
		if(pat == '') {
			$('#txtPaternoCliente').focus();
			return;
		}
		if(mat == '') {
			$('#txtMaternoCliente').focus();
			return;
		}
		$('#txtRFCCliente').focus();

	}

	$(function(){
		$.ajax({
			url: 'controlador/ClienteController.php?f=ultimaClaveInsertada',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				if(data['estado_peticion'] == 'success') {
 					$('#claveNuevoCliente').html("Clave: "+(data['ultimaClave']+1));	
				}				
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});



	$('#txtNombreCliente').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	$('#txtPaternoCliente').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	$('#txtMaternoCliente').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});

	$('#txtRFCCliente').focusout(function(){	
		if($(this).val()	 == '')				
			$(this).css('border','solid 1px #ff0000')
		else
			$(this).css('border','solid 1px #cecece')		
	});


});