<?PHP
	
	$data = $_POST['data'];
	$totalDato = count($data);
	
	if($totalDato > 0){	
		
		include_once("../../db/conexion.php");
		
		//Aqui decodificaremos nuestra variable "dato" y la almacenaremos
		for($i = 0; $i < $totalDato; $i++){
			
			//Declaración de Variables
			$nombre = $data[$i][0];
			$apellidoPaterno = $data[$i][1];
			$apellidoMaterno = $data[$i][2];
			$telefono = $data[$i][3];
			$correo = $data[$i][4];
			$estatus = 1;
			
			if($nombre != '' && 
			$apellidoPaterno != '' && 
			$apellidoMaterno != '' && 
			$telefono != '' && 
			$correo != ''){
				
				//Inserción de datos
				$stmt =  $mysqli->prepare("INSERT INTO alumno(id,nombre,apellido_paterno,apellido_materno,correo,telefono,estatus,fecha) VALUES(NULL,?, ?, ?, ?, ?, ?,now())");
				if($stmt === false) {
					echo "error 1 ".htmlspecialchars($stmt->error);
					return;
				}
				
				$src = $stmt->bind_param("sssssi", $nombre, $apellidoPaterno, $apellidoMaterno, $correo, $telefono, $estatus);

				if($src === false) {
					echo "error 2 ".htmlspecialchars($stmt->error);
					return;
				}

				$src = $stmt->execute();
				
				if($src === false) {
					echo "error 3 ".htmlspecialchars($stmt->error);
					return;
				}

				$stmt->close();

			}
			
		}

		
		
		if($totalDato == 1){
			
			//En caso de solo recibir un alumno
			echo "El alumno fue almacenado exitosamente";
			
		}else if($totalDato > 1){
			//Mensaje para mas de un alumno
			echo "Los alumnos fueron almacenados exitosamente";
		}
		
	}else{
		//Error en caso de recibir "dato" vacio
		echo "Detectamos que no inscribió a ningún alumno";
		
	}
?>