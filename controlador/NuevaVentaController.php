<?php

	require_once "../app/ventas/Venta.php";
	include_once("../db/conexion.php");
	
	$venta = new Venta();

	if(function_exists($_GET['f'])) {
   		$_GET['f']($mysqli, $venta);
	}


	function ultimoFolioAgregado ($mysqli, $venta) {
		echo json_encode($venta->obtenerUltimoFolio($mysqli));
	}

	function agregarVenta ($mysqli, $venta) {
		$clave_cliente = $_POST['clave_cliente'];
		$plazo = $_POST['plazo'];
		$total = $_POST['total'];
		$claves = $_POST['clavesArticulos'];
		$existencias = $_POST['existenciasArticulos'];
		echo json_encode($venta->registrarVenta($mysqli, $clave_cliente, $plazo, $total, $claves, $existencias));
	}

	function verVentas($mysqli, $venta) {
		echo json_encode($venta->cargarVentas($mysqli));
	}


?>