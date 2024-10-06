<template>
    <div class="ag-theme-quartz" >
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="colDefs"
            domLayout="autoHeight"
            @grid-ready="onGridReady"
            @cell-editing-stopped="onCellEditingStopped"
            rowHeight="65"
            :loading="true"
        >
        </ag-grid-vue>
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
                :loading="is_loading"
                @click="onSaveProductOptions"
            >
                Сохранить
            </v-btn>
        </div>
        <!-- <div v-if="rowData && rowData.length">
        </div> -->
        <!-- <div style=" 
                display: flex; 
                justify-content: center; 
                align-items: center;"
            class="m-4"
            v-else>
            <v-progress-circular color="primary" indeterminate model-value="20" :size="55"></v-progress-circular>
        </div> -->
    </div>
</template>

<script>

    import { ref, onMounted, shallowRef  } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

    import AgSelectorVue from '../../components/selector/AgSelector.vue';

    export default {
        name: 'App',
        data() {
            return {
                products: [],
                is_loading: false,
            }
        },
        components: {
            AgGridVue, // Add Vue Data Grid component
            AgSelectorVue,
        },

        methods: {
            async onSaveProductOptions(event) {
                event.preventDefault();
                
                let result = true;
                this.rowData.forEach(async (rowNode) => {
                    console.log("rowNode",rowNode);
                    
                    if(rowNode.classifier_class_code && rowNode.selectedPackage)
                    {
                        let extras = {
                            classifier_class_code:      rowNode.classifier_class_code,
                            package_code:               rowNode.selectedPackage.code,
                            package_name:               rowNode.selectedPackage.name,
                        };    
                        this.is_loading = true;
                        result = await this.setPosterProductExtras(rowNode.product_id, extras);
                    }
                });

                this.is_loading = false;
                console.log(result);
            },

            async onCellEditingStopped (event) {
                const value = event.value;
                console.log(event.colDef.field);
                // if(typeof value === 'number'){    
                if(event.colDef.field == "classifier_class_code")
                {    
                    let productMxik = await this.getProductInfoByMxikCode(value);
                    
                    if(productMxik && !productMxik.error){
                        // event.data.package = productMxik.packages[0];
                        // здесю нужно сохранить значение productMxik.mixkCode и productMxik.packages 
                        event.data.product_class_name = productMxik.mxikName;
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
            },
            
            async setPosterProductExtras (product_id, extras)  {
                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json;");

                    const raw = JSON.stringify({
                        "headers": {"Content-Type" : 'application/json; charset=UTF-8'},
                        "body": {
                            "entity_type": "product",
                            "entity_id": product_id,
                            "extras": extras
                        }
                    });

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    let request_url = `https://joinposter.com/api/application.setEntityExtras?token=${poster_settings.poster_access_token}`;

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=request&request_type=POST&request_url=${request_url}`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            result = JSON.parse(result);
                            resolve(result.response);
                        })
                        .catch((error) => reject(error) );
                })
            }
        },

        setup() {
            // Row Data: The data to be displayed.
            const gridApi = shallowRef();

            const rowData = ref([]);

            // Column Definitions: Defines the columns to be displayed.
            const colDefs = ref([
                { 
                    field: "product_id",
                    headerName: "ID продукта" ,
                    hide: true, 
                },
                {
                    headerName: "Наименование",
                    field: "product_name",
                    flex: 1, // Динамическая ширина
                },
                {
                    headerName: "Код ИКПУ",
                    field: "classifier_class_code",
                    flex: 1, // Динамическая ширина
                    editable: true,
                    cellRenderer: (params) => {
                        console.log("classifier_class_code",params,params.data.product_class_name);
                        const value = params.value || "";
                        params.refreshCell();
                        return `
                            <div class="custom__renderer-value">
                                <span class="custom__renderer-value-name">${params.data.product_class_name ?? params.data.product_name}</span>
                                <span class="custom__renderer-value-code">${value}</span>
                            </div>`;
                    },
                    cellEditor: "agTextCellEditor",
                },
                {
                    headerName: "Тип упаковки",
                    field: "package",
                    cellRenderer: "AgSelectorVue",
                    cellEditor: "AgSelectorVue",
                    flex: 1,
                    // cellEditorParams: (params) => {
                    //     console.log("cellEditorParams",params);
                    //     return {
                    //         cellRenderer: "AgSelectorVue",
                    //         package: params.data.package || [], 
                    //         value: params.value || [] , 
                    //     }
                    // },
                    // editable: true,
                },
            ]);

            
            const setLoading = (value) => {
                console.log("gridApi",gridApi)
                gridApi.value.setGridOption("loading", value);
            };

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
                                    product_id: product.product_id,
                                    product_name: product.product_name,
                                    classifier_class_code: product.extras && product.extras.classifier_class_code ? product.extras.classifier_class_code : "",
                                    package: product.extras && product.extras.package_code && product.extras.package_name ? [{code: product.extras.package_code, name:product.extras.package_name}] : []  
                                }));
                                setLoading(false);
                            }else{
                            }
                        })
                        .catch((error) => {console.error(error);});
                })
            }
            
            const onGridReady = (params) => {
                gridApi.value = params.api;
            };
            
            onMounted(() => {
                getPosterProducts();
            });

            return {
                rowData,
                colDefs,
                onGridReady,
                gridApi,
            };
        },
    };

</script>
