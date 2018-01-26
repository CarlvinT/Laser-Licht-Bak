<?php 

include 'Statistics.php';

$stats = new Statistics();

$input = json_decode( file_get_contents('php://input') );

$resultCount = $input->count;

echo json_encode($stats->getFietsers($resultCount));

?>