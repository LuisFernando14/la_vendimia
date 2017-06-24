<?php
	
	//Incluimos la conexión a la base de datos
	include_once("../db/conexion.php");
	
	class Articulo {

		public function obtenerUltimaClave ($mysqli) {
			$stmt = $mysqli->prepare("SELECT clave FROM articulos ORDER BY clave DESC LIMIT 1");

			$stmt->execute();

			$stmt->bind_result($clave);

			$datos = array();

			$lastId = 0;
			
			if($stmt->fetch()) {
				$lastId = $clave;
			}

			$datos['ultimaClave'] = $lastId;

			$respuesta_servidor = "Última clave obtenida correctamente.";
			
			$estado_peticion = "success";

			$datos['respuesta_servidor'] = $respuesta_servidor;

			$datos['estado_peticion'] = $estado_peticion;

			return $datos;
		}

		public function guardarArticulo ($mysqli, $descripcion, $modelo, $precio, $existencia) {
			$stmt = $mysqli->prepare("INSERT INTO `articulos`(`descripcion`, `modelo`, `precio`, `existencia`) VALUES (?, ?, ?, ?)");
			
			$stmt->bind_param("sssi", $descripcion, $modelo, $precio, $existencia);

			$stmt->execute();

			$id_articulo_insertado = $mysqli->insert_id;

			$stmt->close();

			$respuesta_servidor = "Bien Hecho. El artículo ha sido registrado correctamente";
			
			$estado_peticion = "success";

			$resultado = ["id" => $id_articulo_insertado, "respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			return $resultado;
		}

		public function mostrarArticulos ($mysqli) {
			$estatus = 1;
			
			$stmt = $mysqli->prepare("SELECT articulos.clave, articulos.descripcion, articulos.modelo, articulos.precio, articulos.existencia FROM articulos WHERE articulos.estatus = ?");
			
			$stmt->bind_param("i", $estatus);
			
			$stmt->execute();
			
			$articulos = array();
			
			$stmt->bind_result($clave, $descripcion, $modelo, $precio, $existencia);
			
			while($stmt->fetch()) {
				$articulos[] = array(
					"clave" => $clave,
					"descripcion" => $descripcion,
					"modelo" => $modelo,
					"precio" => $precio,
					"existencia" => $existencia
				);
			}
			
			$stmt->close();
			
			return $articulos;
		}

		public function consultaArticuloPorClave ($mysqli, $clave) {
			$estatus = 1;
			
			$stmt = $mysqli->prepare("SELECT articulos.clave, articulos.descripcion, articulos.modelo, articulos.precio, articulos.existencia FROM articulos WHERE articulos.estatus = ? AND articulos.clave= ?");

			$stmt->bind_param("ii", $estatus, $clave);

			$stmt->execute();

			$stmt->bind_result($clave, $descripcion, $modelo, $precio, $existencia);
			
			$datos = array();
			while($stmt->fetch()) {
				$datos['clave'] = $clave;
				$datos['descripcion'] = $descripcion;
				$datos['modelo'] = $modelo;
				$datos['precio'] = $precio;
				$datos['existencia'] = $existencia;
			}

			$stmt->close();

			return $datos;
		}

		public function actualizarArticulo ($mysqli, $clave, $descripcion, $modelo, $precio, $existencia) {
			$stmt = $mysqli->prepare("UPDATE articulos SET articulos.descripcion = ?, articulos.modelo = ?, articulos.precio = ?, articulos.existencia = ? WHERE articulos.clave = ?");
			
			$stmt->bind_param("ssssi", $descripcion, $modelo, $precio, $existencia, $clave);
			
			$stmt->execute();

			$stmt->close();

			$respuesta_servidor = "Bien Hecho. El artículo ha sido modificado correctamente";
			
			$estado_peticion = "success";

			$resultado = ["respuesta_servidor" => $respuesta_servidor, "estado_peticion" => $estado_peticion];
			
			return $resultado;			
		}

		public function consultarArticulo($mysqli, $nombre) {
			$nombre_articulo = '%'.$nombre.'%';
			$estatus = 1;
			$stmt = $mysqli->prepare("SELECT `clave`, `descripcion`, `modelo`, `precio`, `existencia` FROM `articulos` WHERE `descripcion` like ? and estatus = ?");

			$stmt->bind_param("si", $nombre_articulo, $estatus);

			$stmt->execute();

			$stmt->bind_result($clave, $descripcion, $modelo, $precio, $existencia);
			
			$datos = array();
			
			while($stmt->fetch()) {
				$datos[] = Array(
					"clave" => $clave,
					"descripcion" => $descripcion,
					"modelo" => $modelo,
					"precio" => $precio,
					"existencia" => $existencia,
					"clave_descripcion" => $descripcion
				);
			}

			$stmt->close();

			return $datos;
		}
	}
?>