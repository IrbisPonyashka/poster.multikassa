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
            @cell-editing-stopped="onCellEditingStopped"
        >
        </ag-grid-vue>
    </v-card>
</template>

<script>

    import { ref, onMounted } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

    import AgSelectorVue from '../../components/selector/AgSelector.vue';

    export default {
        name: 'App',
        data() {
            return {
                products: [] // Массив для хранения данных о продуктах
            }
        },
        components: {
            AgGridVue, // Add Vue Data Grid component
            AgSelectorVue,
        },

        methods: {
            async onCellEditingStopped (event) {
                const value = event.value;
                console.log(event.colDef.field);
                // if(typeof value === 'number'){    
                if(event.colDef.field == "classifier_code")
                {    
                    let productMxik = await this.getProductInfoByMxikCode(value);
                    
                    if(productMxik && !productMxik.error){
                        // event.data.package = productMxik.packages[0];
                        // здесю нужно сохранить значение productMxik.mixkCode и productMxik.packages 
                        event.data.package = productMxik.packages || [];
                        event.api.refreshCells();
                    }

                 
                }


                // Если редактируем упаковку
                // if (event.colDef.field === "package") {
                //     const selectedPackage = event.data.package.find(pkg => pkg.code === value);
                //     if (selectedPackage) {
                //         event.data.package = selectedPackage;
                //     }
                //     event.api.refreshCells(); // Обновляем ячейку после редактирования
                // }
            },
            async getProductInfoByMxikCode (code) {
                return new Promise((resolve, reject) => {
                    
                    const requestOptions = {
                        method: "GET",
                        redirect: "follow"
                    };

                    fetch(`https://tasnif.soliq.uz/api/cls-api/mxik/get/by-mxik?mxikCode=${code}&lang=ru`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                            result = JSON.parse(result);
                            resolve(result)
                        })
                    .catch((error) => {
                        console.error(error)
                    });
                
                })
            },
            async getProductInfoByMxikText (text) {
                return new Promise((resolve, reject) => {
                    
                    const requestOptions = {
                        method: "GET",
                        redirect: "follow"
                    };

                    fetch(`https://tasnif.soliq.uz/api/cls-api/mxik/search-subposition?search_text=${text}&lang=ru`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                            result = JSON.parse(result);
                            resolve(result)
                        })
                    .catch((error) => {
                        console.error(error)
                    });
                
                })
            }
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
                    editable: true,
                },
                {
                    headerName: "Тип упаковки",
                    field: "package",
                    cellEditor: AgSelectorVue,
                    flex: 1,
                    editable: true,
                    cellEditorParams: params => ({
                        package: params.data.package || [], // Передаем массив упаковок
                        value: params.value || '', // Текущее значение упаковки
                    }),
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
                                    classifier_code: product.extras && product.extras.classifier_code ? product.extras.classifier_code : "",
                                    package: product.extras && product.extras.package ? product.extras.package : [] 
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
                colDefs
            };
        },
    };

</script>
