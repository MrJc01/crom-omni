<?php
// Legacy Code for Omni Ingestion Test
function get_users()
{
    $results = DB::select("SELECT * FROM users WHERE active = 1");
    // $pdo = new PDO("mysql:host=127.0.0.1;dbname=omni_db");
    return $results;
}
