<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vue App</title>
        <? 
            $random = rand();
        ?>
        
        <!-- bootstrap stylesheets -->
        <link rel="stylesheet" href="https://bootstrap-4.ru/docs/5.3/scss/helpers/_color-bg.scss">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <!-- bootstrap stylesheets / -->
    </head>
    <body style="height: 100%;">
        <? echo '<pre>'; print_r([$multibankAccessToken,$multibankRefreshToken, $staging]); echo '</pre>'; ?>
        <div id="app"></div>
        <script src="app/bundle.js<?="?ver=".$random?>"></script>
    </body>
</html>
