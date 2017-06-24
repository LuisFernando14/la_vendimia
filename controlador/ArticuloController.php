<?php

	require_once "../app/articulos/Articulo.php";
	include_once("../db/conexion.php");
	$articulo = new Articulo();

	if(function_exists($_GET['f'])) {
   		$_GET['f']($mysqli, $articulo);
	}
	
	function ultimaClaveInsertada ($mysqli, $articulo) {
		echo json_encode($articulo->obtenerUltimaClave($mysqli));
	}

	function agregarArticulo ($mysqli, $articulo) {
		$descripcion = $_POST['descripcion'];
		$modelo = $_POST['modelo'];
		$precio = $_POST['precio'];
		$existencia = $_POST['existencia'];

		echo json_encode($articulo->guardarArticulo($mysqli, $descripcion, $modelo, $precio, $existencia));
	}

	function verArticulos ($mysqli, $articulo) {
		echo json_encode($articulo->mostrarArticulos($mysqli));
	}

	function consultaArticulo ($mysqli, $articulo) {
		$clave = $_POST['clave_articulo'];
		echo json_encode($articulo->consultaArticuloPorClave($mysqli, $clave));
	}

	function modificaArticulo ($mysqli, $articulo) {
		$clave = $_POST['clave'];
		$descripcion = $_POST['descripcion'];
		$modelo = $_POST['modelo'];
		$precio = $_POST['precio'];
		$existencia = $_POST['existencia'];
		echo json_encode($articulo->actualizarArticulo($mysqli, $clave, $descripcion, $modelo, $precio, $existencia));
	}

	function consultarArticuloPorNombre ($mysqli, $articulo) {
		$nombre = $_GET['q'];
		echo json_encode($articulo->consultarArticulo($mysqli, $nombre));
	}

?>