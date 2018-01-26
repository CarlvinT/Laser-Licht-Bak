<?php

Class Connection {

	private $dbConnection;

	private $hostName = 'localhost';
	private $user = 'root';
	private $password = '';
	private $databaseName = 'lichtbakken';

	public function __construct() {

		$this->dbConnection = new mysqli(
			$this->hostName, 
			$this->user, 
			$this->password, 
			$this->databaseName);
		
		$this->dbConnection->set_charset("utf8");

		if ($this->dbConnection->connect_errno) {

  			echo "Failed to connect to MySQL: " . $this->dbConnection->connect_error;

  		}

	}

	public function getConnection() {

		return $this->dbConnection;
		
	}

	public function testConnection() {

		if($this->dbConnection) {

			return "Connection is working";

		} else {

			return "Not connected";
			
		}

	}

}

	
?>