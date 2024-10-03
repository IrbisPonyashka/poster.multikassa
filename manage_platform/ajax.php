<?php

/**
 * ajax.php
 * Обработчик выполняет некую роль proxy 
*/

header('Content-Type: application/json');

if($_REQUEST && !empty($_REQUEST["action"]) )
{
    require_once('../src/pm_rest.php');

    $input_data_json = file_get_contents("php://input");
    $input_data = json_decode($input_data_json,1);

    switch ($_REQUEST["action"]) {
        case "get":
        case "set":
            if( !$input_data && empty($input_data["body"])){
                echo json_encode(["error" => true, "message" => "POST-request error. Body is empty"]);
            }
            switch ($_REQUEST["type"]) {
                case "products":
                    break;
                case "app":    
                    echo PosterMultikassaApi::posterSetAppExtras($input_data["poster_token"], $input_data["body"]);
                    break;
                default:
            }
        break;
        case "request":

            // Проверим, чтобы тело запроса было массивом
            $body = isset($input_data['body']) ? json_encode($input_data['body']) : '';

            // Проверим заголовки, если они есть
            $headers = [];
            if (isset($input_data['headers']) && is_array($input_data['headers'])) {
                foreach ($input_data['headers'] as $key => $value) {
                    $headers[] = "$key: $value";
                }
            }
            // $incomingHeaders = getallheaders(); // Используем функцию для получения заголовков
            // if ($incomingHeaders && is_array($incomingHeaders)) {
            //     foreach ($incomingHeaders as $key => $value) {
            //         $headers[] = "$key: $value";
            //     }
            // }
            
            echo PosterMultikassaApi::callCurl( $_REQUEST["request_type"] , $_REQUEST["request_url"] , $body, $headers );
        break;
    }

}