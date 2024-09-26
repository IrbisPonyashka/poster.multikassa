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
                "posterToken"  =>  $tokens
            ]
        );
        
        if($data && is_array($data))
        {    
            if(!empty( $_REQUEST["staging"]) ){
                $staging = $_REQUEST["staging"];
            }else if( !empty($data["staging"]) ){
                $staging = $data["staging"];
            }

            isset($data["access_token"]) ? $arParams["extras"]["multibankAccessToken"] = $data["access_token"] : null;

            isset($data["refresh_token"]) ? $arParams["extras"]["multibankRefreshToken"] = $data["refresh_token"] : null;
            
            isset($data["withoutFiscalization"]) ? $arParams["extras"]["withoutFiscalization"] = $data["withoutFiscalization"] : null;

            !empty($staging) ? $arParams["extras"]["staging"] = $staging : null;
        }

        $arHeaders = array(
            'Content-Type: application/json',
        );

        return static::callCurl("POST", "https://joinposter.com/api/application.setEntityExtras?token=$tokens", json_encode($arParams), $arHeaders);
    }
    
    public static function multibankGetCurrentProfile( $multibank_tokens, $poster_access_token, $is_staging = false, $retryCount = 3)
    {
        if(!$multibank_tokens){
            return json_encode(["error"=>true,"message"=>"Отсутствуют токены"]);
        }

        $arHeaders = array(
            'Accept: application/json',
            'Accept-Language: ru',
            'Authorization: Bearer '.$multibank_tokens["access_token"]
        );
        
        $multibank_domain = $is_staging ? "api-staging.multibank.uz" : "api.multibank.uz";

        $getProfileResponseJson = static::callCurl("GET", "https://".$multibank_domain."/api/profiles/v1/profile", [], $arHeaders);
        $getProfileResponse = json_decode($getProfileResponseJson,1);

        /* Успешно */
        if($getProfileResponse && $getProfileResponse["success"]) {
            return $getProfileResponseJson;
        }else{
            /* Если токены устарели, обновляем */
            if( !empty($getProfileResponse["code"]) && $getProfileResponse["code"] == 401) {

                $tokens = static::multibankRefreshAuthTokens( $multibank_tokens, $poster_access_token, $is_staging );

                if ( $tokens["success"] === true && $retryCount > 0) {
                    return static::multibankGetCurrentProfile( $multibank_tokens, $poster_access_token, $is_staging, $retryCount - 1);
                } else {
                    return json_encode(['error' => $tokens["error"], 'token_error_json' => $tokens]);
                }
            
            }else{
                return json_encode(['success' => false, 'error' => "Что-то пошло не так", "message" => $getProfileResponseJson]);
            }
        }
    
    }
    
    protected static function multibankRefreshAuthTokens( $multibank_tokens, $poster_access_token, $is_staging = false)
    {
        $inputPostDataJson = file_get_contents("php://input");
        $inputPostData = json_decode($inputPostDataJson,1);

        $arParams = array(
            'client_id' => '2',
            'client_secret' => 'wZ3rNvrzz2MnJYfI9an0W1Z7AaTgF2DwX5oP9G6z',
            'refresh_token' => $multibank_tokens["refresh_token"]
        );
        
        $multibank_domain = $is_staging ? "api-staging.multibank.uz" : "api.multibank.uz";

        $authTokensJson = static::callCurl('POST',"https://".$multibank_domain."/api/profiles/v1/profile/refresh_token",$arParams,[]);
        $authTokens = json_decode($authTokensJson,1);

        if(empty($authTokens["error"])){

            $authTokens["staging"] = $is_staging;
            $setAppExtras = static::posterSetAppExtras( $poster_access_token, $authTokens);
            
            // if($setAppExtras)

            $authTokens["success"] = true;
            return $authTokens;

        }else{
            
            $authTokens["success"] = false;
            return $authTokens;
        }
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
    
    public static function callMessage($type, $title, $body, $subtitle=null)
    {
        
        return "<!-- bootstrap stylesheets -->
            <link rel=\"stylesheet\" href=\"https://bootstrap-4.ru/docs/5.3/scss/helpers/_color-bg.scss\">
            <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css\">
            <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH\" crossorigin=\"anonymous\">
            <!-- bootstrap stylesheets / -->
            <body style=\"background: rgba(76, 78, 100, 0.5) !important;\">
                <div class=\"bitrix-app tab_container container-lg h-100 pt-3 pb-3\">
                    <div class=\"row justify-content-center align-items-center h-100\">
                        <div class=\"alert alert-$type mt-3 mb-3\" role=\"alert\" style=\"max-width: 720px;\">
                            <h4 class=\"alert-heading\">$title</h4>
                            <p>$subtitle</p>
                            <hr>
                            <p class=\"mb-0\">$body</p>
                        </div>
                    </div>
                </div>
            </body>";

    }
}
