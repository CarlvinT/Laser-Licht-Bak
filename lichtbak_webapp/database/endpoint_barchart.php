<?php 

include 'Statistics.php';

$stats = new Statistics();

$input = json_decode(file_get_contents('php://input') );

$startVal = $input->startVal;
$endVal = $input->endVal;

echo json_encode($stats->getBarChartData($startVal, $endVal ));

?>