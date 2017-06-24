<?php

	require_once "../app/configuracion/Configuracion.php";
	include_once("../db/conexion.php");
	$configuracion = new Configuracion();

	if(function_exists($_GET['f'])) {
   		$_GET['f']($mysqli, $configuracion);
	}

	function agregarOModificarConfiguracion ($mysqli, $configuracion) {
		$tasa = $_POST['tasa'];
		$enganche = $_POST['enganche'];
		$plazo = $_POST['plazo'];
		echo json_encode($configuracion->agregar_o_actualizar_configuracion($mysqli, $tasa, $enganche, $plazo));
	}

	function mostrarInformacion ($mysqli, $configuracion) {
		echo json_encode($configuracion->mostrar_configuracion($mysqli));
	}


?>