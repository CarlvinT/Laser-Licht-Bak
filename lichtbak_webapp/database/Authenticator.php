<?php  

require_once 'Connection.php';

Class Authenticator {

	private $dbCon;

	public function __construct() {

		$connection = new Connection();
		$this->dbCon = $connection->getConnection();

	}

	public function validateAuth($theEmail, $thePassword) {

		$query = "SELECT * FROM user WHERE email='$theEmail'"; 

		$result = $this->dbCon->query($query);

		if ($result) {

			$row = $result->fetch_assoc();

			$hashedPassword = $row['password'];

			if (password_verify($thePassword, $hashedPassword)) {

				return true;

			}

		}

		return false;

	}

	public function getAuthUser() {

		$email = $_SERVER['PHP_AUTH_USER'];

		$query = "SELECT * FROM user WHERE email = '$email'";
		$result = $this->dbCon->query($query);

		if ($result) {

			$row = $result->fetch_assoc();
			$this->dbCon->close();

			return $row;

		}
	}

}

?>