<?php  

require_once 'Connection.php';

Class Statistics {

	private $dbCon;

	private $ttnAuthKey = 'ttn-account-v2.RRc-LMM7zZPUgNZZ4MmTbtSME0SfWZZMJkG1bFwgA5M';

	public function __construct() {

		$connection = new Connection();
		$this->dbCon = $connection->getConnection();

	}

	private function getLichtCount($heeftLicht) {

		$query = "SELECT COUNT(*) as aantal FROM fietser WHERE heeft_licht='$heeftLicht'";

		$result = $this->dbCon->query($query);

		if ($result) {

			$row = $result->fetch_assoc();

			return $row;

			}
		
	}

	public function getBarChartData($start, $end) {

		$welLicht = $this->getBarDataWithLight($start, $end, 1);
		$geenLicht = $this->getBarDataWithLight($start, $end, 0);

		return [$welLicht, $geenLicht];

	}

	private function getBoxDetailsWithLight($heeftLicht, $boxId) {

		$query = "SELECT COUNT(*) as aantal FROM fietser JOIN box ON fietser.box_id=box.id WHERE box.id = '$boxId' AND fietser.heeft_licht = '$heeftLicht'";

		$result = $this->dbCon->query($query);

		if ($result) {

			$row = $result->fetch_assoc();
			
			return $row;

		}


	}

	public function getBoxDetails($boxId) {

		$heeftLicht = $this->getBoxDetailsWithLight(1,$boxId);
		$geenLicht = $this->getBoxDetailsWithLight(0,$boxId);

		return [$heeftLicht, $geenLicht];
	}

	private function getBarDataWithLight($start, $end, $heeftLicht) {


		// MM DD YY to YY MM DD


		$start = explode('-', $start);
		$end = explode('-', $end);

		$startDate = $start[2] . '-' . $start[0] . '-' . $start[1].' 00:00:00';
		$endDate = $end[2] . '-' . $end[0] . '-' . $end[1].' 00:00:00';


		$query = "SELECT COUNT(*) as aantal FROM fietser WHERE heeft_licht = '$heeftLicht' AND datum BETWEEN '$startDate' AND '$endDate'";

		$result = $this->dbCon->query($query);

		if ($result) {

			$row = $result->fetch_assoc();
			
			return $row;

		}

	}


	public function getLichten() {

		$lichtAan = $this->getLichtCount(1);
		$lichtUit = $this->getLichtCount(0);

		return [$lichtAan, $lichtUit];

	}

	public function getBoxes() {

		$boxes = [];

		$query = "SELECT * FROM box ORDER BY datum_toegevoegd DESC"; 

		$result = $this->dbCon->query($query);

		if ($result) {

			while($row = $result->fetch_array()) {
				array_push($boxes, $row);
			}
		
		} else {

			return false;

		}

		$this->dbCon->close();

		return $boxes;
	}

	public function getFietsers($count) {

		$fietsers = [];

		if($count == 0) {

			$query = "SELECT * FROM fietser JOIN box ON fietser.box_id=box.id ORDER BY `fietser`.`datum` DESC"; 
			
		} else {

			$query = "SELECT * FROM fietser JOIN box ON fietser.box_id=box.id ORDER BY `fietser`.`datum` DESC LIMIT $count"; 
		}


		$result = $this->dbCon->query($query);

		if ($result) {

			while($row = $result->fetch_array()) {
				array_push($fietsers, $row);
			}
		
		} else {

			return false;

		}

		$this->dbCon->close();

		return $fietsers;


	}

	public function actuallyAddToDatbase($time, $count, $hasLight) {

		if($count != 0) {

			for($x = 0; $x < $count; $x++) {

				$query = "INSERT INTO fietser (heeft_licht, box_id, datum) VALUES ('$hasLight', 1, '$time')";

				$result = $this->dbCon->query($query);


			}

		}		

	}


	public function addLoraDataToDatabase($time, $data) {

		$splitArray = base64_decode($data["raw"]);

		$splitArray = explode("-", $splitArray);

		if(count($splitArray) > 1) {

			$this->actuallyAddToDatbase($time, $splitArray[0], 0);
		$this->actuallyAddToDatbase($time, $splitArray[1], 1);


		}

		
	}


	public function checkLora($dataResponse) {

		$theData = $dataResponse[0];

		$time = explode(".",$theData["time"])[0];

		$time = str_replace("T", " ", $time);


		$content = base64_decode($theData["raw"]);

		$checkQuery = "SELECT datum FROM fietser WHERE datum = '$time'";

		$result = $this->dbCon->query($checkQuery);

		if($result->num_rows < 1) {

			$this->addLoraDataToDatabase($time, $theData);

		}
			
	}

	public function getLora() {

		$curl = curl_init();

		$headers = array(
    		'Content-type: application/json',
    		'Authorization: key '.$this->ttnAuthKey,
		);

		// Set some options - we are passing in a useragent too here

		curl_setopt_array($curl, array(
		    CURLOPT_RETURNTRANSFER => 1,
		    CURLOPT_URL => 'https://1337420.data.thethingsnetwork.org/api/v2/query?last=4h',
		    CURLOPT_HTTPHEADER => $headers,
		));
		// Send the request & save response to $resp
		$resp = curl_exec($curl);


		// Close request to clear up some resources
		curl_close($curl);

		$jsonResults = json_decode($resp, true);

		$this->checkLora($jsonResults);

		//$returnList = $this->addLoraDataToDatabase($resp);

	}

}

?>