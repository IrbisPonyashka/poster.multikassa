import React, { useState, useEffect } from 'react';

import { Layout, Card } from 'antd';

const { Content } = Layout;

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";

import getColumnsData from "/src/views/receipts/colData";

export default function Receipts() {   
    
    useEffect( () => {
        getReceiptsRequest();
    }, []);
    
    const [totalRows, setTotalRows] = useState(0);
    
    const [rowData, setRowData] = useState([]);
    
    const [colDefs, setColDefs] = useState(getColumnsData);

    const onPaginationChanged = (params) => {
        console.log("onPaginationChanged", params);
        if (params.api) {
            const currentPage = params.api.paginationGetCurrentPage() + 1;  // Текущая страница (нумерация с 0)
            const pageSize = params.api.paginationGetPageSize();  // Количество записей на странице
            
            // Запросить данные для текущей страницы
            getReceiptsRequest(currentPage, pageSize);
        }
    };

    const getReceiptsRequest = async ( page = 1, limit = 15 ) => {
        return new Promise((resolve, reject) => {
            const start = (page - 1) * limit;

            const requestOptions = {
                method: "GET",
                redirect: "follow"
              };
              
              fetch(`http://localhost:8080/api/v1/receipts?page=${page}&start=${start}&limit=${limit}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    result = JSON.parse(result);
                    if(result.success){
                        setRowData(result.data);
                    }
                })
                .catch((error) => console.error(error));
        })
    }
    

    console.log("receipts", rowData);
    return (
        <Content id="receipts" >
            <div className="ag-theme-quartz" style={{ flex: '1 1 auto', minHeight: 0 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    domLayout='autoHeight'
                    pagination={false}  // Включаем пагинацию
                    // paginationPageSize={10}  // Количество записей на одной странице
                    // paginationPageSizeSelector={[ 10, 20, 50, 100 ]}
                    // onPaginationChanged={onPaginationChanged}  // Обработка изменения страницы
                />
            </div>
        </Content>
    );  
}
