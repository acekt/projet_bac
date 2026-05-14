<?php

$host = 'loclahost';
$dbname = 'mes_courses_faciles';
$user = 'root';
$pass = '';

$conn = new mysqli("localhost", "root", "", "mes_courses_faciles");
// verifier si il y'a une erreur à la connexion
if ($conn->connect_error) {
    echo "echec de connecxion !";
}  else {
    echo "Bonne connection" . $conn->error ;
}

if (isset($_POST['valider'])) {

$stmt = mysqli_prepare($conn,
"INSERT INTO formulaire(nom, prenom, email, mot_de_passe, paiement; tarea)
 VALUES(?, ?, ?, ?, ?, ?)"
);

mysqli_stmt_bind_param($stmt,
"sssss",

$_POST['nom'],
$_POST['prenom'],
$_POST['email'],
$_POST['mot_de_passe'],
$_POST['paiement'],
$_POST['tarea']

);

mysqli_stmt_execute($stmt);
}

?>  