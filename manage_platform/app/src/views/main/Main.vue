<template>
    <div>
        <v-card
            border
            flat
            max-width="740"
            class="mx-auto bg-white pa-6"
            style="
                border-radius: 1rem;
                box-shadow: none;
            ">
            <v-card-title class="pb-0">Данные о контрагенте</v-card-title>
            <v-divider></v-divider>
            <form class="about_form" v-if="multibank_profile &&  multibank_profile.data">
                
                <v-card-subtitle class="pt-0 pb-1 pl-0 pr-0">Профиль</v-card-subtitle>
                <v-text-field 
                    density="compact"
                    variant="outlined"
                    readonly
                    label=""
                    class="custom-text-field"
                    :model-value="multibank_profile.data.name"
                ></v-text-field>

                <v-card-subtitle class="pt-0 pb-1 pl-0 pr-0">ИНН</v-card-subtitle>
                <v-text-field 
                    density="compact"
                    variant="outlined"
                    readonly
                    label=""
                    class="custom-text-field"
                    :model-value="multibank_profile.data.tin_or_pinfl"
                >
                </v-text-field>

                <v-card-subtitle class="pt-0 pb-1 pl-0 pr-0">Адрес</v-card-subtitle>
                <v-text-field 
                    density="compact"
                    variant="outlined"
                    readonly
                    label=""
                    class="custom-text-field"
                    :model-value="multibank_profile.data.address ?? 'Не указан'"
                >
                </v-text-field>

                <v-checkbox
                    density="compact"
                    @change="onChangeWithoutFiscalizationCheckbox"
                    v-model="without_fiscalization" 
                    label="Позволять операции по закрытию чека без фискализации">
                </v-checkbox>
                <v-checkbox
                    density="compact"
                    @change="onChangeStagingCheckbox"
                    v-model="is_staging" 
                    label="Режим разработчика">
                </v-checkbox>

            </form>
            <form class="about_form" v-else>
                <v-card-subtitle class="pt-0 pb-1 pl-0 pr-0">
                    Сервис <a :href="is_staging ? 'https://app-staging.multibank.uz/' : 'https://app.multibank.uz/' ">Multibank</a> не отвечает. Попробуйте позже
                </v-card-subtitle>
            </form>
        </v-card>
        <div style=" 
            display: flex; 
            justify-content: center; 
            align-items: center;"
            class="m-4"
        >
            <v-btn
                class="me-4 col-2"
                elevation="0"
                color="primary"
                variant="flat"
                @click="dialog = true"
            >
                Выйти
            </v-btn>
        </div>

        
        <!-- Диалоговое окно -->
        <v-dialog v-model="dialog" max-width="620">
            <v-card>
                <v-card-title>Вы уверены, 
                    что хотите выйти из профиля?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <!-- Лоадер, который показывается при нажатии на "Да" -->
                    <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                    ></v-progress-circular>

                    <!-- Кнопки, скрываем их, когда лоадер активен -->
                    <v-btn
                        v-if="!loading"
                        elevation="0"
                        variant="flat"
                        color="red"
                        @click="onConfirm"
                    >
                        Да
                    </v-btn>
                    <v-btn
                        v-if="!loading"
                        elevation="0"
                        variant="flat"
                        color="primary"
                        @click="dialog = false"
                    >
                        Нет
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return {
                dialog: false, // Управляет показом/скрытием диалога
                loading: false, // Управляет показом лоадера
                multibank_profile: multibank_profile.success ? multibank_profile : {},
                is_staging: /^true$/i.test(poster_settings.staging),
                without_fiscalization: /^true$/i.test(poster_settings.without_fiscalization),
            }
        },
        methods: {
            onChangeWithoutFiscalizationCheckbox (e) {
                poster_settings.without_fiscalization = this.without_fiscalization === false ? "false" : "true";
                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();

                    let objFields = {
                        poster_token: poster_settings.poster_access_token,
                        body: {
                            withoutFiscalization: poster_settings.without_fiscalization
                        },
                    };

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        redirect: "follow",
                        body: JSON.stringify(objFields)
                    };

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=set&type=app`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            result = JSON.parse(result);
                            console.log(result);
                        })
                        .catch((error) => {console.error(error);});
                })
            },
            onChangeStagingCheckbox (e) {
                poster_settings.staging = this.is_staging === false ? "false" : "true";
                
                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();

                    let objFields = {
                        poster_token: poster_settings.poster_access_token,
                        body: {
                            staging: poster_settings.staging
                        },
                    };

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        redirect: "follow",
                        body: JSON.stringify(objFields)
                    };

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=set&type=app`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            result = JSON.parse(result);
                            console.log(result);
                        })
                        .catch((error) => {console.error(error);});
                })
            },
            onClickLogOut () {
                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();

                    let objFields = {
                        poster_token: poster_settings.poster_access_token,
                        body: {
                            access_token: "" ,
                            refresh_token: ""
                        },
                    };

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        redirect: "follow",
                        body: JSON.stringify(objFields)
                    };

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=set&type=app`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            result = JSON.parse(result);
                            if(result.response){
                                window.top.location.href=`https://${poster_settings.poster_account_domain}.joinposter.com/manage/applications/multikassa-poster`;
                                // window.open(window.location.href,"_parent")
                            }
                        })
                        .catch((error) => {console.error(error);});
                })
            },
            onConfirm() {
                // Действие при нажатии на кнопку "Да"
                // this.dialog = false;
                this.loading = true; 
                this.onClickLogOut(); // вызов функции выхода
            },
        }
    };
</script>

<style scoped>
</style>
