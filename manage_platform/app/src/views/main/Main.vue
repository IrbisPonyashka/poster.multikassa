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
        <form class="about_form pt-4 pl-4 pr-4" >
            
            <v-card-title class="pt-0 pb-3 pl-0 pr-0">Наименование компании</v-card-title>
            <v-text-field 
                variant="outlined"
                readonly
                disabled
                label=""
                :model-value="multibank_profile.data.name"
                class="custom-text-field"
            ></v-text-field>

            <v-card-title class="pt-0 pb-3 pl-0 pr-0">ИНН</v-card-title>
            <v-text-field 
                variant="outlined"
                readonly
                disabled
                label=""
                :model-value="multibank_profile.tin_or_pinfl"
            >
            </v-text-field>

            <v-card-title class="pt-0 pb-3 pl-0 pr-0">Версия системы</v-card-title>
            <v-text-field 
                variant="outlined"
                readonly
                disabled
                label=""
                :model-value="multibank_profile.data.address"
            >
            </v-text-field>

            <v-checkbox
                @change="onChangeCheckbox"
                v-model="is_staging" 
                label="Режим разработчика">
            </v-checkbox>

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
            elevation="2"
            @click="dialog = true"
        >
            Выйти
        </v-btn>
    </div>

    
    <!-- Диалоговое окно -->
    <v-dialog v-model="dialog" max-width="620">
        <v-card>
            <v-card-title>Вы уверены, что хотите выйти из профиля?</v-card-title>
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
                    color="primary"
                    @click="onConfirm"
                >
                    Да
                </v-btn>
                <v-btn
                    v-if="!loading"
                    color="secondary"
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
    console.log(multibank_profile);
    export default {
        name: 'App',
        data(){
            return {
                dialog: false, // Управляет показом/скрытием диалога
                loading: false, // Управляет показом лоадера
                multibank_profile: multibank_profile.success ? multibank_profile.data : [],
                is_staging: /^true$/i.test(poster_settings.staging),
            }
        },
        methods: {
            onChangeCheckbox (e) {
                console.log(e);
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
    .about_form .v-text-field {
        color: #000000; 
        cursor: text; 
    }
    .custom-text-field .v-input__control {
    cursor: text !important; /* Принудительно устанавливаем курсор как текстовый */
    }

    .custom-text-field input {
    color: #1976D2 !important; /* Цвет текста */
    cursor: text !important; /* Принудительный курсор текста для input */
    }

    .custom-text-field .v-input__control.readonly .v-input__slot {
    cursor: text !important; /* Принудительный курсор текста для readonly полей */
    }
</style>
