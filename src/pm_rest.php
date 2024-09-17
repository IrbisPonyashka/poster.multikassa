<?php


class PosterMultikassaApi {

    const APP_ID        = 3579;
    const APP_SECRET    = "195463b45f85f6db91a1dd14fa6d186e";

    public static function posterOAuthByCode($code)
    {
        $auth = array(
            'application_id'        => static::APP_ID, 
            'application_secret'    => static::APP_SECRET, 
            'code'                  => $code,
        );

        $auth['verify'] = md5(implode(':', $auth));

        return static::callCurl("POST", "https://joinposter.com/api/v2/auth/manage", $auth);
    }

    public static function multibankOAuthByCode($code)
    {
        $methodType = "POST";
        
        if( $_REQUEST["staging"] == true ){
            $multibank_domain = "api-staging.multibank.uz";
            $url = "https://auth-staging.multibank.uz/oauth/token";
        }else{
            $multibank_domain = "api.multibank.uz";
            $url = "https://auth.multibank.uz/oauth/token";
        }

        $auth = array(
            'grant_type' => 'auth_code_grant',
            'client_id' => '2',
            'client_secret' => 'wZ3rNvrzz2MnJYfI9an0W1Z7AaTgF2DwX5oP9G6z',
            'auth_code' => $code
        );

        return static::callCurl("POST", $url, $auth);
    }

    public static function posterGetAppInfo($tokens)
    {
        if(!$tokens){
            return json_encode(["error"=>true,"message"=>"отсутствуют токены"]);
        }

        return static::callCurl("GET", "https://joinposter.com/api/settings.getAllSettings?token=$tokens");
    }
    
    public static function posterSetAppExtras($tokens, $data)
    {
        if(!$tokens){
            return json_encode(["error"=>true,"message"=>"отсутствуют токены"]);
        }

        $arParams = array(
            "entity_type" => "settings",
            "extras" => [
                "multibankAccessToken"  =>  $data["access_token"],
                "multibankRefreshToken" =>  $data["refresh_token"]
            ]
        );

        $arHeaders = array(
            'Content-Type: application/json',
        );

        return static::callCurl("POST", "https://joinposter.com/api/application.setEntityExtras?token=$tokens", json_encode($arParams), $arHeaders);
    }
    
    
    public static function multibankUpdateTokens($tokens, $is_staging = false )
    {
        $methodType = "POST";
        
        if( $_REQUEST["staging"] == true ){
            $multibank_domain = "api-staging.multibank.uz";
            $url = "https://auth-staging.multibank.uz/oauth/token";
        }else{
            $multibank_domain = "api.multibank.uz";
            $url = "https://auth.multibank.uz/oauth/token";
        }

        $auth = array(
            'grant_type' => 'auth_code_grant',
            'client_id' => '2',
            'client_secret' => 'wZ3rNvrzz2MnJYfI9an0W1Z7AaTgF2DwX5oP9G6z',
            'auth_code' => $code
        );

        return static::callCurl("POST", $url, $auth);
    }

    public static function callCurl( $methodType, $url, $params = [], $headers = [] )
    {
        $curl = curl_init();
        
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $methodType,
                CURLOPT_POSTFIELDS => $params,
                CURLOPT_HTTPHEADER => $headers
            )
        );

        $response = curl_exec($curl);

        curl_close($curl);

        return $response;
    }
}
