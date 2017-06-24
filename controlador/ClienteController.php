<?php

	require_once "../app/clientes/Cliente.php";
	include_once("../db/conexion.php");
	$cliente = new Cliente();

	

	if(function_exists($_GET['f'])) {
   		$_GET['f']($mysqli, $cliente);
	}

	function mostrarClientes ($mysqli, $cliente) {
		
		echo json_encode($cliente->mostrarCliente($mysqli));
	}

	function agregarCliente ($mysqli, $cliente) {
		$nombre = $_POST['nombreCliente'];
		$paterno = $_POST['paternoCliente'];
		$materno = $_POST['maternoCliente'];
		$rfc = $_POST['rfcCliente'];

		echo json_encode($cliente->guardarCliente($mysqli, $nombre, $paterno, $materno, $rfc));
	}

	function consultaCliente ($mysqli, $cliente) {
		$clave = $_POST['clave_cliente'];
		echo json_encode($cliente->consultaClientePorClave($mysqli, $clave));
	}

	function modificaCliente ($mysqli, $cliente) {
		$clave = $_POST['clave'];
		$nombre = $_POST['nombreCliente'];
		$paterno = $_POST['paternoCliente'];
		$materno = $_POST['maternoCliente'];
		$rfc = $_POST['rfcCliente'];
		echo json_encode($cliente->actualizarCliente($mysqli, $clave, $nombre, $paterno, $materno, $rfc));
	}

	function ultimaClaveInsertada ($mysqli, $cliente) {
		echo json_encode($cliente->obtenerUltimaClave($mysqli));
	}

	function consultarClientePorNombre ($mysqli, $cliente) {
		$nombre = $_GET['q'];
		echo json_encode($cliente->consultarCliente($mysqli, $nombre));
	}

?>