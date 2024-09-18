
<!DOCTYPE html>
<html lang="en" style="height: 100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Страница приложения</title>
        <? 
            $random = rand();
        ?>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        <link rel="stylesheet" href="https://bootstrap-4.ru/docs/5.3/scss/helpers/_color-bg.scss">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
        <!-- bootstrap ajax datepicker -->
        <!-- <script type="text/javascript" src="../assets/scripts/libs/jquery.min.js<?="?v=".$random?>"></script>
        <script type="text/javascript" src="../assets/scripts/libs/moment.min.js<?="?v=".$random?>"></script>
        <script type="text/javascript" src="../assets/scripts/libs/daterangepicker.min.js<?="?v=".$random?>"></script>
        <link rel="stylesheet" type="text/css" href="../assets/styles/libs/daterangepicker.css" /> -->
        <!-- bootstrap ajax datepicker / -->

        <!-- bootstrap stylesheets -->
        <link rel="stylesheet" href="https://bootstrap-4.ru/docs/5.3/scss/helpers/_color-bg.scss">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <!-- bootstrap stylesheets / -->

        <!-- <link rel="stylesheet" type="text/css" href="<?="../assets/styles/multibank.css?v=".$random?>">
        <link rel="stylesheet" type="text/css" href="<?="../assets/styles/install.css?v=".$random?>"> -->

    </head>
    <body style="height: 100%;">
            <?	
            
                $app_id = PosterMultikassaApi::APP_ID;
                $back_url = 'https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/index.php';
                $multibank_dev_domain = "id-staging.multibank.uz";
                $multibank_prod_domain = "id.multibank.uz";

                $query = http_build_query([
                    'app_id' => $app_id,
                    'app_domain' => $app_info["response"]["COMPANY_ID"],
                    'poster_access_token' => $poster_tokens["access_token"]
                ]);

            ?>
            <div class="container-lg h-100 bitrix-app d-flex align-items-center justify-content-center">
                <div class="row justify-content-center align-items-center h-100">
                    <div class="card light text-bg-light mt-3 mb-3 border-0" style="max-width: 26rem;border-radius: 16px;">
                        <div class="card-header text-bg-light border-0 mb-4 pt-4 pb-0 animate__animated animate__fadeInUp">
                            <!-- <img class="w-50" src="../assets/img/multikassa.svg" alt="multikassa.uz"> -->
                            <img class="w-50" src="../assets/img/multibank.svg" alt="multibank.uz">
                        </div>
                        <form class="card-body needs-validation pb-4 animate__animated animate__fadeInUp" novalidate="">
                            <h5 class="card-title mb-5 me-1">
                                Необходимо подтвердить авторизацию в сервисе Multibank
                            </h5>
                            <div class="col-12 animate__animated animate__fadeInUp d-flex flex-column gap-3">
                                <div class="d-flex gap-3">
                                    <input class="form-check-input" type="checkbox" value="" name="is_staging" id="is_staging">
                                    <label class="form-check-label" for="is_staging">
                                        Включить режим разработчика
                                    </label>
                                </div>
                                <a href=<?="https://".$multibank_dev_domain."/?back_url=".$back_url."?".$query;?>
                                    type="button" class="btn btn-primary" id="auth">
                                    Авторизация
                                </a>
                                <!-- <button id="submit_btn" type="submit" class="btn btn-primary">Подключить</button> -->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <script>
                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                addEventListener("DOMContentLoaded", () => {
                    
                    if(document.querySelector("a[id=auth]") && document.querySelector("input[name=is_staging]"))
                    {
                        var auth_button = document.querySelector("a[id=auth]");
                        var is_staging_input = document.querySelector("input[name=is_staging]");
                        auth_button.addEventListener("click", (event) => {
                            event.preventDefault();
                            let url = "";
                            if(is_staging_input.checked){
                                url = "<?="https://".$multibank_dev_domain."/?back_url=".$back_url."?".$query."&staging=true"?>";
                            }else{
                                url = "<?="https://".$multibank_prod_domain."/?back_url=".$back_url."?".$query."&staging=false"?>";
                            }
                            window.open(url, "_parent");
                        });
                    }
                });
            </script>
    </body>
</html>