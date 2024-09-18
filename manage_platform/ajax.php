<?php

/**
 * ajax.php
 * Обработчик выполняет некую роль proxy 
*/

if($_REQUEST && !empty($_REQUEST["action"]) )
{
    require_once('../src/pm_rest.php');

    $input_data_json = file_get_contents("php://input");
    $input_data = json_decode($input_data_json,1);

    switch ($_REQUEST["action"]) {
        case "get":
        break;
        case "request":

            echo PosterMultikassaApi::callCurl( $_REQUEST["request_type"] , $_REQUEST["request_url"] , $input_data["body"] ?? [] , $input_data["headers"] ?? [] );

        break;
    }

}