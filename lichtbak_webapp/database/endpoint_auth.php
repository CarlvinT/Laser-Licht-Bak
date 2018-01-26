<?php 

include 'Authenticator.php';

$auth = new Authenticator();

$postdata = file_get_contents("php://input");

$request = json_decode($postdata);

$user =  $request->email;

$pass = $request->password;

if($auth->validateAuth($user, $pass)) {

	echo json_encode('success');

} else {

	header("HTTP/1.1 401 Unauthorized");
	echo json_encode(['error']);
} 

?>