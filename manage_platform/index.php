<?php

ini_set('display_errors', 1);
error_reporting(-1);

// oauth авторизация в poster
if( isset($_REQUEST["poster_auth_code"]))
{

    require_once('../src/pm_rest.php');
    
    $poster_tokens = PosterMultikassaApi::posterOAuthByCode($_REQUEST["poster_auth_code"]);
    $poster_tokens = json_decode($poster_tokens,1);
    
    // Успешная oauth авторизация
    if($poster_tokens["access_token"])
    {
        $app_info = PosterMultikassaApi::posterGetAppInfo($poster_tokens["access_token"]);
        $app_info = json_decode($app_info,1);
        
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

                include('app.php');
            // Страница авторизации приложения 
            }else{
                include('install.php');
            }
        }
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
            // header("refresh: 5; https://".$_REQUEST["portal_domain"]."/marketplace/app/".$_REQUEST["app_id"]."/?install_finished=Y");
        }else{
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