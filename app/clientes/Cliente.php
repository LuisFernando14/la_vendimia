<?php
	
	include_once("../db/conexion.php");
	class Cliente {

		public function mostrarCliente ($mysqli) {
			$estatus = 1;
			
			$stmt = $mysqli->prepare("SELECT clientes.clave, clientes.nombre, clientes.apellido_paterno, clientes.apellido_materno, clientes.rfc FROM clientes WHERE clientes.estatus = ?");
			
			$stmt->bind_param("i", $estatus);
			
			$stmt->execute();
			
			$clientes = array();
			
			$stmt->bind_result($clave, $nombre, $apellidoPaterno, $apellidoMaterno, $rfc);
			
			while($stmt->fetch()) {
				$clientes[] = array(
					"clave" => $clave,
					"nombre" => $nombre." ".$apellidoPaterno." ".$apellidoMaterno,
					"apellidoPaterno" => $apellidoPaterno,
					"apellidoMaterno" => $apellidoMaterno
				);
			}
			
			$stmt->close();
			
			return $clientes;
		}

		public function guardarCliente ($mysqli, $nombre, $paterno, $materno, $rfc) {
			$stmt = $mysqli->prepare("INSERT INTO Clientes (clientes.nombre, clientes.apellido_paterno, clientes.apellido_materno, clientes.rfc) VALUES (?, ?, ?, ?)");
			
			$stmt->bind_param("ssss", $nombre, $paterno, $materno, $rfc);

			$stmt->execute();

			$id_cliente_insertado = $mysqli->insert_id;

			$stmt->close();

			$respuesta_servidor = "Bien Hecho. El cliente ha sido registrado correctamente";
			
			$estado_peticion = "success";

			$resultado = ["id" => $id_cliente_insertado, "respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			return $resultado;
		}

		public function consultaClientePorClave ($mysqli, $clave) {
			$estatus = 1;
			
			$stmt = $mysqli->prepare("SELECT clientes.clave, clientes.nombre, clientes.apellido_paterno, clientes.apellido_materno, clientes.rfc FROM clientes WHERE clientes.estatus = ? AND clientes.clave= ?");

			$stmt->bind_param("ii", $estatus, $clave);

			$stmt->execute();

			$stmt->bind_result($clave, $nombre, $paterno, $materno, $rfc);
			
			$datos = array();
			while($stmt->fetch()) {
				$datos['clave'] = $clave;
				$datos['nombre'] = $nombre;
				$datos['paterno'] = $paterno;
				$datos['materno'] = $materno;
				$datos['rfc'] = $rfc;
			}

			$stmt->close();

			return $datos;
		}

		public function actualizarCliente ($mysqli, $clave, $nombre, $paterno, $materno, $rfc) {
			$stmt = $mysqli->prepare("UPDATE clientes SET clientes.nombre = ?, clientes.apellido_paterno = ?, clientes.apellido_materno = ?, clientes.rfc = ? WHERE clientes.clave = ?");
			
			$stmt->bind_param("ssssi", $nombre, $paterno, $materno, $rfc, $clave);
			
			$stmt->execute();

			$stmt->close();

			$respuesta_servidor = "Bien Hecho. El cliente ha sido modificado correctamente";
			
			$estado_peticion = "success";

			$resultado = ["respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			
			return $resultado;			
		}

		public function obtenerUltimaClave ($mysqli) {
			$stmt = $mysqli->prepare("SELECT clave FROM clientes ORDER BY clave DESC LIMIT 1");

			$stmt->execute();

			$stmt->bind_result($clave);

			$datos = array();
			
			while($stmt->fetch()) {
				$datos['ultimaClave'] = $clave;
			}

			$respuesta_servidor = "Última clave obtenida correctamente.";
			
			$estado_peticion = "success";

			$datos['respuesta_servidor'] = $respuesta_servidor;

			$datos['estado_peticion'] = $estado_peticion;

			return $datos;
		}

		public function consultarCliente($mysqli, $nombre) {
			$nombre_cliente = '%'.$nombre.'%';
			$estatus = 1;
			$stmt = $mysqli->prepare("SELECT `clave`, `nombre`, `apellido_paterno`, `apellido_materno`, `rfc` from clientes where `nombre` like ? and estatus = ?");

			$stmt->bind_param("si", $nombre_cliente, $estatus);

			$stmt->execute();

			$stmt->bind_result($clave, $nombre, $paterno, $materno, $rfc);
			
			$datos = array();
			
			while($stmt->fetch()) {
				$datos[] = Array(
					"clave" => $clave,
					"nombre" => $nombre,
					"paterno" => $paterno,
					"materno" => $materno,
					"rfc" => $rfc,
					"clave_nombre" => $clave." - ".$nombre." ".$paterno." ".$materno
				);
			}

			$stmt->close();

			return $datos;
		}
	}
?>