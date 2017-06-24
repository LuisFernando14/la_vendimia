$(document).ready(function () {


	$('#contenido').load('nav.html');

	$(function(){
		$.ajax({
			url: 'controlador/NuevaVentaController.php?f=verVentas',
			type: 'POST',
			dataType: 'json',
			success:function(data){
				$(data).each(function(i,v){
					$('#ventasActivas tbody').append(
						'<tr clave="' + v.folio + '"><td>'+ v.folio + '</td><td>'+v.clave_cliente+'</td><td>'+v.nombre_cliente+'</td><td>'+v.total+'</td><td>'+v.fecha_creacion+'</td></tr>'
					);
				});
			},
			error: function(xhr, desc, err){
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});		
	});

});