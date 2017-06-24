$(document).ready(function () {
	$('#contenido').load('nav.html');
	//variables para los artículos
	var articulosSeleccionados = [];
	var clave = "";
	var descripcion = "";
	var modelo = "";
	var precio = 0.0;
	var existencia = 0;
	var cliente_seleccionado = false;
	//Valores configuracion
	var tasa = 0.0;
	var enganche = 0.0;
	var plazo = 0;
	var suma_total = 0.0;
	//variables para muestra
	var enganche_importe = 0.0;
	var bonificacion_importe = 0.0;
	var total_importe = 0.0;
	//Abonos por meses
	var total_pagar_tres_meses = 0.0;
	var abono_tres_meses = 0.0;
	var ahorro_tres_meses = 0.0;
	var total_pagar_seis_meses = 0.0;
	var abono_seis_meses = 0.0;
	var ahorro_seis_meses = 0.0;
	var total_pagar_nueve_meses = 0.0;
	var abono_nueve_meses = 0.0;
	var ahorro_nueve_meses = 0.0;
	var total_pagar_doce_meses = 0.0;
	var abono_doce_meses = 0.0;
	var ahorro_doce_meses = 0.0;
	var precio_contado = 0.0;
	//cliente
	var clave_cliente = 0;
	var nombre_cliente = "";
	// existencia
	var claves = [];
	var existencias = [];

	//Cargamos los valores de configuración
	$(function(){
		$.ajax({
			url: 'controlador/ConfiguracionController.php?f=mostrarInformacion',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				tasa = data['tasa'];
				enganche = data['enganche'];
				plazo = data['plazo'];
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

	function precioTotal (precio) {
		return precio*(1+(tasa*plazo)/100);
	}

	// Evento del botón para agregar más artículo
	$('#btnAgregarArticulo').click(function () {
		if(clave == '' && descripcion == '' && modelo == '' && precio == 0.0 && existencia == 0)
			return; //No se ha selecciona un artículo
		if(existencia <= 0) {
			alert("El artículo seleccionado no cuenta con existencia, favor de verificar");
			regresarValores();
			return;
		}
		
		if(articuloEnLista()) {
			alert("No se puede agregar el artículo debido a que ya está selccionado. Puede modificar la cantidad");
			regresarValores();
			return;
		}
		
		$('#tablaArticulosSeleccionados tbody').append(
			'<tr id="' + clave + '" class="filaArticulo"><td>'+ descripcion + '</td><td>'+modelo+'</td><td><input type="number" value="1" min="1" max="'+existencia+'" class="cantidadClave" id="cantidadArticulo_'+clave+'" name=""></td><td><label id="lblPrecio_'+clave+'">'+precioTotal(precio)+'</label></td><td><label class="importeArticulo" id="lblImporte_'+clave+'">'+precioTotal(precio)+'</label></td><td><a id="'+clave+'" class="eliminarFila"  style="text-decoration: none;"><span style="color: red;" class="glyphicon glyphicon-remove"></span></a></td></tr>'
		);
		$('#cantidadArticulo_'+clave).focus();
		regresarValores();
	});

	function regresarValores () {
		clave = "";
		descripcion = "";
		modelo = "";
		precio = 0.0;
		existencia = 0;
		$('#search-box-articulo').val('');
	}
	
	$('#btnSiguiente').click(function () {
		if($(this).attr('value') == 'Guardar') {
			//determinos los radios
			//if($('#radio_button').is(':checked')) { alert("it's checked"); }
			if($('input:radio:checked').length <= 0){
				alert("Debe seleccionar un plazo para realizar el pago de su compra");
				return;
			}
			//si llega aquí, todo va bien
			var selectedValue = $("input[name=radAnswer]:checked").val();
			
			var parametros = {
				"clave_cliente" : clave_cliente,
				"plazo" : selectedValue,
				"total" : total_importe,
				"clavesArticulos" :claves,
				"existenciasArticulos" : existencias
			};

			$.ajax({
				url: 'controlador/NuevaVentaController.php?f=agregarVenta',
				type: 'POST',
				dataType: 'json',
				data : parametros,
				success:function(data){
					if(data['estado_peticion'] == 'error') {
						alert(data['respuesta_servidor']);
						return;	
					}

					if(data['estado_peticion'] == 'success') {
						alert('Bien Hecho, Tu venta ha sido registrada correctamente');	
						window.location.replace("ventas.html");
					}
				},
				error: function(xhr, desc, err){
					console.log(xhr);
					console.log("Details: " + desc + "\nError:" + err);
				}
			});	
			
		}
		if(!cliente_seleccionado) {
			alert("Seleccione un cliente");
			$('#search-box-cliente').focus();
			return;
		}
		if(determinarImporte() == 0.0) {
			alert("Seleccione al menos un artículo");
			$('#search-box-articulo').focus();
			return;
		}
		obtenerClavesCantidades();
		$('#abonos').prop('hidden', false);
		$('#btnSiguiente').attr('value', 'Guardar');
		suma_total = determinarImporte();
		determinarEngancheBonificacionImporte(suma_total);
		determinarAbonos();
	});

	$('#btnCancelar').click(function () {
		var resultado = confirm("¿Desea cancelar la operación actual?");
		if(!resultado)
			return;
		window.location.replace("ventas.html");
	});

	function determinarEngancheBonificacionImporte (suma_total) {
		enganche_importe = (enganche/100)*suma_total;
		bonificacion_importe = enganche_importe*((tasa*plazo)/100);
		total_importe = suma_total - enganche_importe - bonificacion_importe;
		$('#labelEnganche').html(enganche_importe);
		$('#labelBonificacion').html(bonificacion_importe);
		$('#labelTotal').html(total_importe);
		//asignamos los valores
	}

	function determinarAbonos () {
		var contado = precioContado();
		//Tres meses
		total_pagar_tres_meses = contado*(1+(tasa*3)/100);
		abono_tres_meses = total_pagar_tres_meses/3;
		ahorro_tres_meses = total_importe - total_pagar_tres_meses;
		//seis meses
		total_pagar_seis_meses = contado*(1+(tasa*6)/100);
		abono_seis_meses = total_pagar_seis_meses/6;
		ahorro_seis_meses = total_importe - total_pagar_seis_meses;
		//nueve meses
		total_pagar_nueve_meses = contado*(1+(tasa*9)/100);
		abono_nueve_meses = total_pagar_nueve_meses/9;
		ahorro_nueve_meses = total_importe - total_pagar_nueve_meses;
		//doce meses
		total_pagar_doce_meses = contado*(1+(tasa*12)/100);
		abono_doce_meses = total_pagar_doce_meses/12;
		ahorro_doce_meses = total_importe - total_pagar_doce_meses;

		//asignamos a los label
		$('#abono3').html("$ "+abono_tres_meses);
		$('#abono6').html("$ "+abono_seis_meses);
		$('#abono9').html("$ "+abono_nueve_meses);
		$('#abono12').html("$ "+abono_doce_meses);

		$('#totalpagar3').html("Total a Pagar: $"+total_pagar_tres_meses);
		$('#totalpagar6').html("Total a Pagar: $"+total_pagar_seis_meses);
		$('#totalpagar9').html("Total a Pagar: $"+total_pagar_nueve_meses);
		$('#totalpagar12').html("Total a Pagar: $"+total_pagar_doce_meses);

		$('#ahorro3').html("Se Ahorra: $"+ahorro_tres_meses);
		$('#ahorro6').html("Se Ahorra: $"+ahorro_seis_meses);
		$('#ahorro9').html("Se Ahorra: $"+ahorro_nueve_meses);
		$('#ahorro12').html("Se Ahorra: $"+ahorro_doce_meses);
	}

	function precioContado () {
		precio_contado = total_importe/(1+((tasa*12)/100));
		return precio_contado;
	}

	function determinarImporte () {
		var sum = 0;
		$(".importeArticulo").each(function() {
	    	var value = $(this).html();
	    // add only if the value is number
		    if(!isNaN(value) && value.length != 0) {
		        sum += parseFloat(value);
		    }
		});
		return sum;
	}	

	function articuloEnLista () {
		var enLista = false;
		$(".filaArticulo").each(function () {
			if(clave == $(this).attr('id')) {
				console.log("encontré una coincidencia");
				enLista = true;
			}
		});
		return enLista;
	}

	function obtenerClavesCantidades () {
		$(".cantidadClave").each(function () {
			var c = $(this).val();
			var i = $(this).attr('id');
			var id = i.split('_');
			claves.push(id[id.length-1]);
			existencias.push(c);
			console.log(i+" "+c);
		});
	}

	$(document).on("click", "tr a", function(){
		alert($(this).attr('id'));
		var id_eliminar = $(this).attr('id');
		$("#"+id_eliminar).remove();
	});
	/*
	function modificarExistencia () {
		$.ajax({
			url: 'controlador/NuevaVentaController.php?f=agregarVenta',
			type: 'POST',
			dataType: 'json',
			data : parametros,
			success:function(data){
				if(data['estado_peticion'] == 'success') {
					alert('Bien Hecho, Tu venta ha sido registrada correctamente');	
					window.location.replace("ventas.html");
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});	
	}
	*/
	$(document).on("change", "tr input", function(){
		var cantidad = $(this).val();

		var id_utilizar = $(this).attr('id').split('_');
		var id_num = id_utilizar[id_utilizar.length-1];
		var precio = $('#lblPrecio_'+id_num).html();
		var total = precio * cantidad;
		console.log("cantidad: "+cantidad);
		console.log("precio: "+precio)
		$('#lblImporte_'+id_num).html(total);
	});


	$(function(){
		$.ajax({
			url: 'controlador/NuevaVentaController.php?f=ultimoFolioAgregado',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				if(data['estado_peticion'] == 'success') {
						$('#lblFolioVenta').html("Folio de venta:  "+(data['folio_venta']+1));	
				}				
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

	// Typeahead clientes
	var clientes = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			'cache': false,
			url: "controlador/ClienteController.php?f=consultarClientePorNombre&q="+$('#search-box-cliente').val(),
			replace: function(url, uriEncodedQuery) {
				return url + '&q=' + uriEncodedQuery
			},
			wildcard: '%QUERY',
			filter: function (data) {
				return data;
			}
		}
	});

	// Initialize the Bloodhound suggestion engine
	clientes.initialize();

	$("#search-box-cliente").typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
    	name: "result",
    	displayKey: "clave_nombre",
    	source: clientes.ttAdapter()
	}).bind("typeahead:selected", function(obj, datum, name) {
		$(this).data("rfc", datum.rfc);
		$(this).data("clave", datum.clave);
		$(this).data("nombre", datum.nombre);
		$('#rfcClienteBuscado').html("RFC: "+$(this).data('rfc'));
		clave_cliente = $(this).data('clave');
		nombre_cliente = $(this).data('nombre');
		cliente_seleccionado = true;
	});

	// Typeahead artículos
	var articulos = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			'cache': false,
			url: "controlador/ArticuloController.php?f=consultarArticuloPorNombre&q="+$('#search-box-articulo').val(),
			replace: function(url, uriEncodedQuery) {
				return url + '&q=' + uriEncodedQuery
			},
			wildcard: '%QUERY',
			filter: function (data) {
				return data;
			}
		}
	});

	// Initialize the Bloodhound suggestion engine
	articulos.initialize();

	$("#search-box-articulo").typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
    	name: "result",
    	displayKey: "clave_descripcion",
    	source: articulos.ttAdapter()
	}).bind("typeahead:selected", function(obj, datum, name) {
		$(this).data("clave", datum.clave);
		$(this).data("descripcion", datum.descripcion);
		$(this).data("modelo", datum.modelo);
		$(this).data("precio", datum.precio);
		$(this).data("existencia", datum.existencia);
		clave = $(this).data('clave');
		descripcion = $(this).data('descripcion');
		modelo = $(this).data('modelo');
		precio = $(this).data('precio');
		existencia = $(this).data('existencia');
		/*
		$(this).data("rfc", datum.rfc);
		$('#rfcClienteBuscado').html("RFC: "+$(this).data('rfc'));
		$(this).data("id", datum.id_cliente);
	    $(this).data("id_usu", datum.id_usu);
	    var id_buscado = $(this).data('id');
	    var id_usu = $(this).data('id_usu');
	    modificar_usuario = 1;
	    id_usuario_modificar = id_usu;
	    id_cliente_modificar = id_buscado;
	    $('#modal_consultar_cliente').modal('hide');
	    $('#div_facturacion').prop('hidden', false);
	    llenar_campos(id_buscado);
	    */
	});
});