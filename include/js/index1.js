$(document).ready(function(){//when the document is ready it will realize an action. //$-->JQuery
	//alert('Nuestro index js esta funcionando'); //it's a message to show in the webPage. It's to find a error in the code.
	$('#btnRegistrar').click(function(){ //Every id has to be called by a #
		//Variables Statement Sintaxis: var variableName;
		//Getting the variable names.
		var nombre = $('#txtNombre').val();
		var apellidoPaterno = $('#txtApellidoPaterno').val();
		var apellidoMaterno = $('#txtApellidoMaterno').val();
		var telefono = $('#txtTelefono').val();
		var correoElectronico = $('#txtCorreoElectronico').val();
		//alert(nombre +', '+apellidoPaterno+', '+apellidoMaterno+', '+telefono+', '+correoElectronico);
		//Validations.
		if(nombre != '' && apellidoPaterno != '' && apellidoMaterno != '' && telefono != '' && correoElectronico != ''){
			//Almacenamos
			alert('the next week it will work');
		}
		else{
			
			if(nombre == ''){
				$('#txtNombre').css('border','1px solid #ff0000');
			}else{
				$('#txtNombre').css('border','1px solid #ccc');
			}
			
			if(apellidoPaterno==''){
				$('#txtApellidoPaterno').css('border','1px solid #ff0000');
			}else{
				$('#txtApellidoPaterno').css('border','1px solid #ccc');
			}
			
			if(apellidoMaterno==''){
				$('#txtApellidoMaterno').css('border','1px solid #ff0000');
			}else{
				$('#txtApellidoMaterno').css('border','1px solid #ccc');
			}
			
			if(telefono==''){
				$('#txtTelefono').css('border','1px solid #ff0000');
			}else{
				$('#txtTelefono').css('border','1px solid #ccc');
			}
			
			if(correoElectronico==''){
				$('#txtCorreoElectronico').css('border','1px solid #ff0000');
			}else{
				$('#txtCorreoElectronico').css('border','1px solid #ccc');
			}
		}
	});
});