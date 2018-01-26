<?php 

include 'Statistics.php';

$stats = new Statistics();

echo json_encode($stats->getLichten());

?>