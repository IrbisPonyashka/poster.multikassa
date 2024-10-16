<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vue App</title>
        <? 
            $random = rand();
        ?>

        <!-- Vuetify CSS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/vuetify/3.7.1/vuetify-labs.min.css" rel="stylesheet">
        
        <!-- Material Design Icons -->
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css" rel="stylesheet">

        <!-- ag-Grid CSS -->
        <link href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-theme-quartz.css" rel="stylesheet">


        <!-- bootstrap stylesheets -->
        <link rel="stylesheet" href="https://bootstrap-4.ru/docs/5.3/scss/helpers/_color-bg.scss">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <!-- bootstrap stylesheets / -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <? 
        $app_poster_settings = [
            "poster_account_domain"     =>      $app_info["response"]["COMPANY_ID"],
            "poster_access_token"       =>      $app_info["response"]["extras"]["posterToken"],
            "multibank_access_token"    =>      $app_info["response"]["extras"]["multibankAccessToken"],
            "multibank_refresh_token"   =>      $app_info["response"]["extras"]["multibankRefreshToken"],
            "without_fiscalization"     =>      !isset($app_info["response"]["extras"]["withoutFiscalization"]) ? "false" : $app_info["response"]["extras"]["withoutFiscalization"] ,
            "staging"                   =>      $app_info["response"]["extras"]["staging"],
        ];
    ?>
    
    <script>
        window.poster_settings = JSON.parse(`<?=json_encode($app_poster_settings) ?>`);
        window.multibank_profile = JSON.parse(`<?= addslashes($multibankProfile) ?>`);
    </script>
    <body style="height: 100%;">
        <div id="app"></div>
        <script src="app/bundle.js<?="?ver=".$random?>"></script>
    </body>
</html>
