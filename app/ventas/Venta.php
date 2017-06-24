<?php
	
	include_once("../db/conexion.php");
	
	class Venta {

		public function obtenerUltimoFolio ($mysqli) {
			$stmt = $mysqli->prepare("SELECT folio_venta FROM ventas ORDER BY folio_venta DESC LIMIT 1");

			$stmt->execute();

			$stmt->bind_result($folio_venta);

			$datos = array();

			$lastId = 0;
			
			if($stmt->fetch()) {
				$lastId = $folio_venta;
			}

			$datos['folio_venta'] = $lastId;

			$respuesta_servidor = "Último folio_venta obtenido correctamente.";
			
			$estado_peticion = "success";

			$datos['respuesta_servidor'] = $respuesta_servidor;

			$datos['estado_peticion'] = $estado_peticion;

			return $datos;
		}

		public function actualizarExistencias ($mysqli, $claves, $existencias) {
			$cantidadClaves = count($claves);
			for($i = 0; $i < $cantidadClaves; $i++) {
				$stmt = $mysqli->prepare("SELECT existencia from articulos where articulos.clave = ?");
				$stmt->bind_param("i", $claves[$i]);
				$stmt->execute();
				$stmt->bind_result($existencia);
				if($stmt->fetch()) {
					$real = $existencia;
				}
				$existencia = intval($real);
				$stmt->close();
				if($existencias[$i] > $existencia OR $existencias[$i] <= 0) {
					return false;
				}
				else {
					$resultado = $existencia - $existencias[$i];
					$stmt = $mysqli->prepare("UPDATE articulos set articulos.existencia = ? where articulos.clave = ?");
					$stmt->bind_param("ii", $resultado, $claves[$i]);
					$stmt->execute();
					$stmt->close();
				}
			}
			return true;
		}

		public function registrarVenta($mysqli, $clave_cliente, $plazo, $total, $claves, $existencias) {
			//Primero que nada verificamos existencias y modificamos
			$actualizacion = $this->actualizarExistencias ($mysqli, $claves, $existencias);
			if(!$actualizacion) {
				$respuesta_servidor = "No se puede procesar la venta debido a un error con las cantidades de artículos.";
			
				$estado_peticion = "error";

				$resultado = ["respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
				return $resultado;
			}

			$stmt = $mysqli->prepare("INSERT INTO `ventas`(`clave_cliente`, `total`, `plazo`) VALUES (?, ?, ?)");

			$stmt->bind_param("iii", $clave_cliente, $total, $plazo);

			$stmt->execute();

			$stmt->close();

			$id_venta_insertada = $mysqli->insert_id;

			$respuesta_servidor = "Bien Hecho. La venta ha sido registrada correctamente";
			
			$estado_peticion = "success";

			$resultado = ["id" => $id_venta_insertada, "respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			return $resultado;
		}

		public function cargarVentas ($mysqli) {
			$datos = [];
			$stmt = $mysqli->prepare("SELECT ventas.folio_venta, ventas.clave_cliente, clientes.nombre, ventas.total, day(ventas.fecha_creacion), month(ventas.fecha_creacion), year(ventas.fecha_creacion) from ventas inner join clientes on ventas.clave_cliente = clientes.clave");

			$stmt->execute();

			$stmt->bind_result($folio_venta, $clave_cliente, $nombre_cliente, $total, $dia, $mes, $anio);

			while($stmt->fetch()) {
				$datos[] = array(
					"folio" => $folio_venta,
					"clave_cliente" => $clave_cliente,
					"nombre_cliente" => $nombre_cliente,
					"total" => $total,
					"fecha_creacion" => $dia."/".$mes."/".$anio
				);
			}

			$stmt->close();

			return $datos;
		}
	}
?>