<template>
    <v-card
        max-width="1140"
        class="mx-auto bg-white"
        style="border-radius: 2rem; overflow: hidden;"
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

    import { ref, onMounted } from 'vue';
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
        },

        setup() {
            // Row Data: The data to be displayed.
            const rowData = ref([]);


            // Column Definitions: Defines the columns to be displayed.
            const colDefs = ref([
                {
                    headerName: "Наименование",
                    field: "product_name",
                    flex: 1, // Динамическая ширина
                },
                {
                    headerName: "Код ИКПУ",
                    field: "classifier_code",
                    flex: 1, // Динамическая ширина
                },
                {
                    headerName: "Тип упаковки",
                    field: "package",
                    flex: 1, // Динамическая ширина
                },
            ]);
            
            const getPosterProducts  = async () => {
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
                                rowData.value = result.response.map(product => ({
                                    product_name: product.product_name,
                                    classifier_code: product.extras.classifier_code || '',
                                    package: product.extras.package_name || ''
                                }));
                            }else{
                            }
                        })
                        .catch((error) => {console.error(error);});
                })
            }
            
            onMounted(() => {
                getPosterProducts();
            });

            return {
                rowData,
                colDefs,
            };
        },
    };

</script>
