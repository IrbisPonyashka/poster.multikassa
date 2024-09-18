<template>
    <v-card
        max-width="1140"
        class="mx-auto bg-white"
    >
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="colDefs"
            style="height: 500px"
            class="ag-theme-quartz"
        >
        </ag-grid-vue>
    </v-card>
</template>

<script>

    import { ref } from 'vue';
    import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
    import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

    export default {
        name: 'App',
        data() {
            return {
                products: [] // Массив для хранения данных о продуктах
            }
        },
        components: {
            AgGridVue, // Add Vue Data Grid component
        },

        methods: {
            async getPosterProducts(){
                if(!poster_settings && !poster_settings.poster_access_token){
                    return false;
                }

                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();

                    const requestOptions = {
                        method: "GET",
                        headers: myHeaders,
                        redirect: "follow"
                    };
                    
                    let request_url = `https://joinposter.com/api/menu.getProducts?token=${poster_settings.poster_access_token}`;

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=request&request_type=GET&request_url=${request_url}`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            result = JSON.parse(result);
                            console.log(result);
                            if(result.response){
                                resolve(result.response);
                            }else{
                                reject(result);
                            }
                        })
                        .catch((error) => {console.error(error);reject(result)});
                })
            }
        },
        async mounted() {
            if(!poster_settings && !poster_settings.poster_access_token){
                return;
            }
            try {
                this.products = await this.getPosterProducts();
            } catch (error) {
                console.error('Ошибка при загрузке продуктов:', error);
            }
        },
        setup() {
            // Row Data: The data to be displayed.
            const rowData = ref([
                {
                    product_name: "Товар 1",
                    classifier_code: { name: "Название товара 1", code: "ИКПУ 12345" },
                    package: { name: "Упаковка 1", code: "УП123" },
                },
                {
                    product_name: "Товар 2",
                    classifier_code: { name: "Название товара 2", code: "ИКПУ 22345" },
                    package: { name: "Упаковка 2", code: "УП223" },
                },
                {
                    product_name: "Товар 3",
                    classifier_code: { name: "Название товара 3", code: "ИКПУ 32345" },
                    package: { name: "Упаковка 3", code: "УП323" },
                },
                {
                    product_name: "Товар 4",
                    classifier_code: { name: "Название товара 4", code: "ИКПУ 42345" },
                    package: { name: "Упаковка 4", code: "УП423" },
                },
            ]);


            // Column Definitions: Defines the columns to be displayed.
            const colDefs = ref([
            {
                headerName: "Наименование",
                field: "product_name",
            },
            {
                headerName: "Код ИКПУ",
                field: "classifier_code.code",
            },
            {
                headerName: "Тип упаковки",
                field: "package.code"
            },
            ]);

            return {
                rowData,
                colDefs,
            };
        },
    };

</script>
