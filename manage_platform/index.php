<?php

ini_set('display_errors', 1);
error_reporting(-1);

// oauth авторизация в poster
if( isset($_REQUEST["poster_auth_code"]))
{

    require_once('../src/pm_rest.php');

    $poster_tokens_json = PosterMultikassaApi::posterOAuthByCode($_REQUEST["poster_auth_code"]);
    $poster_tokens = json_decode($poster_tokens_json,1);

    // echo '<pre>'; print_r($_REQUEST); echo '</pre>';
    // echo '<pre style="display:none">'; print_r($poster_tokens_json); echo '</pre>';
    // Успешная oauth авторизация
    if(!empty($poster_tokens["access_token"]) )
    {
        $app_info = PosterMultikassaApi::posterGetAppInfo( $poster_tokens["access_token"] );
        $app_info = json_decode($app_info,1);

        PosterMultikassaApi::posterSetAppExtras( $poster_tokens["access_token"], [] );
        
        if($app_info["response"] && $app_info["response"]["extras"])
        {
            // Страница настроек приложения
            if( 
                !empty($app_info["response"]["extras"]["multibankAccessToken"]) && 
                !empty($app_info["response"]["extras"]["multibankRefreshToken"]) && 
                !empty($app_info["response"]["extras"]["staging"])
            ){
                $multibankAccessToken = $app_info["response"]["extras"]["multibankAccessToken"];
                $multibankRefreshToken = $app_info["response"]["extras"]["multibankRefreshToken"];
                $staging = $app_info["response"]["extras"]["staging"];
                
                $arData = array(
                    "access_token" => $multibankAccessToken,
                    "refresh_token" => $multibankRefreshToken
                );

                $multibankProfile = PosterMultikassaApi::multibankGetCurrentProfile( $arData, $poster_tokens["access_token"], $staging );
                $multibankProfile = json_decode($multibankProfile, true); // Декодирование JSON в массив
                $multibankProfile = json_encode($multibankProfile); 

                include('app.php');
            // Страница авторизации приложения 
            }else{
                include('install.php');
            }
        }
    }else{
        
        echo PosterMultikassaApi::callMessage("success", "Что-то пошло не так.", $poster_tokens_json, "попробуйте обновить страницу");
        // header("refresh: 3; https://".$_REQUEST["app_domain"].".joinposter.com/manage/applications/multikassa-poster");
    }
}

// oauth авторизация в multibank
if( !empty($_REQUEST["auth_code"]) && !empty($_REQUEST["poster_access_token"]) )
{
    require_once('../src/pm_rest.php');

    $multibank_tokens = PosterMultikassaApi::multibankOAuthByCode($_REQUEST["auth_code"]);
    $multibank_tokens = json_decode($multibank_tokens,1);
    
    if(isset($multibank_tokens["access_token"]) && isset($multibank_tokens["access_token"]) )
    {
        $setAppExtrasJson = PosterMultikassaApi::posterSetAppExtras($_REQUEST["poster_access_token"], $multibank_tokens);
        $setAppExtras = json_decode($setAppExtrasJson,1);
        if(!empty($setAppExtras["response"]) && $setAppExtras["response"])
        {
            echo PosterMultikassaApi::callMessage("success", "Спасибо. Авторизация прошла успешно.", $setAppExtrasJson, "Вас вернёт на страницу приложения через пару секунд");
            header("refresh: 3; https://".$_REQUEST["app_domain"].".joinposter.com/manage/applications/multikassa-poster");
            
        }else{
            echo PosterMultikassaApi::callMessage("danger", "Что-то пошло не так, попробуйте позже", $setAppExtrasJson, "Вас вернёт на страницу приложения через пару секунд");
            header("refresh: 3; https://".$_REQUEST["app_domain"].".joinposter.com/manage/applications/multikassa-poster");
        }
    }
}

?>
<script>
    window.addEventListener('load', function () {
        top.postMessage({ hideSpinner: true }, '*')
    }, false);
</script>
<?