<?php 

include 'Statistics.php';

$stats = new Statistics();

$input = json_decode(file_get_contents('php://input') );

$boxId = $input->id;

echo json_encode($stats->getBoxDetails($boxId));

?>