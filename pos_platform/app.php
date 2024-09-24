<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vue App</title>
        <? 
            $random = rand();
        ?>

    </head>
    <? 
        // $app_poster_settings = [
        //     "poster_account_domain"     =>      $app_info["response"]["COMPANY_ID"],
        //     "poster_account_number"     =>      $app_info["response"]["extras"]["poster_account_number"],
        //     "poster_access_token"       =>      $app_info["response"]["extras"]["posterToken"],
        //     "multibank_access_token"    =>      $app_info["response"]["extras"]["multibankAccessToken"],
        //     "multibank_refresh_token"   =>      $app_info["response"]["extras"]["multibankRefreshToken"],
        //     "staging"                   =>      $app_info["response"]["extras"]["staging"],
        // ];
    ?>
    <body style="height: 100%;">
        <div id="app-container"></div>
        <script src="app/bundle.js<?="?ver=".$random?>"></script>
    </body>
</html>
