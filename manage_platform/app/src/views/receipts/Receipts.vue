<template>
    <div class="ag-theme-quartz" style="height: 70vh; overflow: hidden; position: relative;">
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="colDefs"
            domLayout="autoHeight"
            @grid-ready="onGridReady"
            @cell-editing-stopped="onCellEditingStopped"
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
    </div>
</template>

<script>
 
    import getColumnsData from "../receipts/colData";
    import { ref, onMounted, shallowRef  } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

    import AgSelectorVue from '../../components/selector/AgSelector.vue';

    export default {
        name: 'App',
        data() {
            return {
                products: [],
                is_loading: false
            }
        },

        components: {
            AgGridVue, // Add Vue Data Grid component
            AgSelectorVue,
        },

        methods: {
            async onCellEditingStopped (event) {
            },
        },

        setup() {
            // Row Data: The data to be displayed.
            const gridApi = shallowRef();

            const rowData = ref([]);

            // Column Definitions: Defines the columns to be displayed.
            const colDefs = ref(getColumnsData());
            
            const getGridRowData = async (event) => {
            }

            const getReceiptsData = async (event) => {
                if(!poster_settings && !poster_settings.multibank_access_token){
                    return false;
                }
                return new Promise((resolve, reject) => {
                    const myHeaders = new Headers();
                    // myHeaders.append("Authorization", `${poster_settings.multibank_access_token}`);

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        redirect: "follow",
                        body:JSON.stringify({
                            headers: {
                                Authorization: `Bearer ${poster_settings.multibank_access_token}`
                            }
                        })
                    };

                    
                    let request_url = `https://api-staging.multibank.uz/api/fiscal/v1/fiscal_operations?page=1&limit=25&search=&filter=[%7B%22property%22:%22module_operation_datetime%22,%22operator%22:%22between%22,%22value%22:[%222024-10-01+00:00:00%22,%222024-10-03+00:00:00%22]%7D]`;

                    fetch(`https://micros.uz/it/solutions_our/poster.multikassa/manage_platform/ajax.php?action=request&request_type=GET&request_url=${encodeURIComponent(request_url)}`, requestOptions)
                        .then((response) => response.json())
                        .then((result) => {
                            console.log("receipts", result);
                            if(result.success && result.data.data && result.data.data.data){
                                rowData.value = result.data.data.data;
                            }
                            setLoading(false);
                        })
                        .catch((error) => reject(error));
                })
            }

            const setLoading = (value) => {
                console.log("gridApi",gridApi)
                gridApi.value.setGridOption("loading", value);
            };
            
            const onGridReady = (params) => {
                gridApi.value = params.api;
            };
            
            onMounted(() => {
                getReceiptsData();
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
