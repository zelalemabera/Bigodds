<?php
require('./Connection.php');
$conn = new Connection();

if ($conn->getConnection()->connect_error) {
    echo json_encode(['data' => 'Connection failed: ' . $conn->getConnection()->connect_error]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $League = $data['league'];
    $home_team = $data['homeTeam'];
    $away_team = $data['awayTeam'];
    $Tips = $data['Tips'];
    $Home_Team_Score = $data['homeScore'];
    $Away_Team_Score = $data['awayScore'];
    $Match_Status = $data['status'];
    $Odds = $data['odds'];
    $HomePossesion = $data['homePossession'];
    $AwayPossesion = $data['awayPossession'];
    $Time = $data['matchTime'];

    $sql = "INSERT INTO `predictions` (`League`, `home_team`, `away_team`, `Tips`, `Home_Team_Score`, `Away_Team_Score`, `Match_Status`, `Odds`, `Home_Possesion`, `Away_Possesion`, `created_at`) VALUES ('" . $League . "', '" . $home_team . "', '" . $away_team . "', '" . $Tips . "', '" . $Home_Team_Score . "', '" . $Away_Team_Score . "', '" . $Match_Status . "', '" . $Odds . "', '" . $HomePossesion . "', '" . $AwayPossesion . "', '" . $Time . "')";

    if ($conn->getConnection()->query($sql) === TRUE) {
    } else {
        echo json_encode(['data' => 'Error: ' . $sql . '<br>' . $conn->getConnection()->error]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $sql = "SELECT * FROM predictions";
        $result = $conn->getConnection()->query($sql);

        $predictions = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $predictions[] = $row;
            }
            echo json_encode(['data' => $predictions]);
        } else {
            echo json_encode(['data' => 'No records found']);
        }
    }





?>