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

    const getReceiptsRequest = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
              };
              
              fetch("http://localhost:8080/api/v1/receipts?page=1&start=0&limit=15", requestOptions)
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
    
    const [rowData, setRowData] = useState([]);
    
    const [colDefs, setColDefs] = useState(getColumnsData);

    // console.log("receipts", receipts);
    return (
        <Content id="receipts" >
            <div className="ag-theme-quartz" style={{ flex: '1 1 auto', minHeight: 0 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    domLayout='autoHeight'
                />
            </div>
        </Content>
    );  
}
