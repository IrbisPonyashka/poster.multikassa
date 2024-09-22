<template>
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
                v-model="is_staging" 
                label="Режим разработчика">
            </v-checkbox>

        </form>
    </v-card>
    <v-btn
        class="me-4"
        type="log_out"
    >
        Выйти
    </v-btn>
</template>

<script>
    console.log(multibank_profile);
    export default {
        name: 'App',
        data(){
            return {
                multibank_profile: multibank_profile.success ? multibank_profile.data : [],
                is_staging: poster_settings.staging,
            }
        },
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
