<?php

	//Incluimos la conexión a la base de datos
	include_once("../db/conexion.php");

	class Configuracion {

		public function agregar_o_actualizar_configuracion ($mysqli, $tasa, $enganche, $plazo) {
			$stmt = $mysqli->prepare("SELECT * from configuraciones LIMIT 1");

			$stmt->execute();

			if($stmt->fetch()) { //Significa que ya hay registros, entonces actuliazamos
				$stmt->close();
				
				$stmt = $mysqli->prepare("UPDATE configuraciones set configuraciones.tasa_financiamiento = ?, configuraciones.porcentaje_enganche = ?, configuraciones.plazo_maximo = ?");

				$stmt->bind_param("ssi", $tasa, $enganche, $plazo);

				$stmt->execute();

				$stmt->close();
			}
			else { //Significa que no hay registros, entonces insertamos
				$stmt->close();
				
				$stmt = $mysqli->prepare("INSERT into configuraciones (configuraciones.tasa_financiamiento, configuraciones.porcentaje_enganche, configuraciones.plazo_maximo) values (?, ?, ?)");

				$stmt->bind_param("ssi", $tasa, $enganche, $plazo);

				$stmt->execute();

				$stmt->close();
			}
			$respuesta_servidor = "Bien Hecho. La configuración ha sido registrado correctamente";
			
			$estado_peticion = "success";

			$resultado = ["respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			return $resultado;
		}

		public function mostrar_configuracion ($mysqli) {
			$stmt = $mysqli->prepare("SELECT configuraciones.tasa_financiamiento, configuraciones.porcentaje_enganche, configuraciones.plazo_maximo FROM configuraciones");

			$stmt->execute();

			$stmt->bind_result($tasa, $enganche, $plazo);

			$datos = [];

			if($stmt->fetch()) {
				$datos['tasa'] = $tasa;
				$datos['enganche'] = $enganche;
				$datos['plazo'] = $plazo;
			}

			$stmt->close();

			return $datos;
		}


	}
	

?>