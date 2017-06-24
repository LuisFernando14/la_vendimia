<?PHP
$mysqli = new mysqli('localhost', 'root', "", 'la_vendimia');

mysqli_set_charset($mysqli, "utf8");

//Revisa que la conexion sea correcta
if (mysqli_connect_errno()) {
    printf("La conexion fallo: %s\n", mysqli_connect_error());
    exit();
}




$hostname = 'localhost';
$username = 'root';
$dbname = 'la_vendimia';
$password = '';
$mysqli = mysqli_connect($hostname, $username, $password, $dbname) or die ("No existe una conexión a la base de datos");



mysqli_set_charset($mysqli, "utf8");
date_default_timezone_set("America/Mazatlan");





?>