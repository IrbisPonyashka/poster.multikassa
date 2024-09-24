import React, { useState, useEffect } from 'react';

import { Layout, Modal } from 'antd';

const { Content } = Layout;

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";

import getColumnsData from "/src/views/receipts/colData";

export default function Receipts() {   
    
    useEffect( () => {
        getReceiptsRequest();
    }, []);
    
    const operationTypeMapping = {
        1: "Открытие смены",
        2: "Закрытие смены",
        3: "Продажа",
        4: "Возврат",
        7: "X отчет",
        8: "Авансовый чек",
        9: "Кредитный чек",
    };
    
    const [totalRows, setTotalRows] = useState(0);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState(getColumnsData);

    // State для управления модальным окном
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

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

    // Обработчик двойного клика на строке
    const onRowDoubleClicked = (params) => {
        setSelectedRow(params.data); // Сохраняем данные выбранной строки
        setIsModalVisible(true); // Открываем модальное окно
    };

    // Закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const returnReceiptDetail = (receipt) => {
        console.log("receipt",receipt);

        return (
            <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                <h3>{operationTypeMapping[receipt.module_operation_type]}</h3>
                {/* <p>{receipt.receipt_cashier_name}</p> */}
                <p>Дата и время: {receipt.receipt_gnk_time}</p>
                {/* <p>ИНН: {receipt.inn}</p> */}
                <p>Кассир: {receipt.receipt_cashier_name}</p>
                <hr />

                <p><strong>#cola</strong></p>
                <p>Количество: 2</p>
                <p>Цена: 123123123</p>
                <p>НДС: 12</p>
                <hr />

                <p>Итого к оплате: {receipt.total_all_sum}</p>
                <p>Оплачено {receipt.receipt_sum}</p>
                <p>Наличные {receipt.receipt_gnk_receivedcash}</p>
                <p>Терминал {receipt.receipt_gnk_receivedcard}</p>
                <p>Сдача {receipt.total_refund_cash}</p>
                <p>Итого сумма НДС {receipt.total_sale_vat}</p>
                <p>Сумма скидки {receipt.total_refund_cash}</p>
                <hr />

                <p>ФМ № {receipt.module_gnk_id}</p>
                <p>Чек № {receipt.receipt_gnk_receiptseq}</p>
                <p>S/N {receipt.module_name}</p>

            </div>
        );
    };

    console.log("receipts", rowData);
    return (
        <Content id="receipts" >
            <div className="ag-theme-quartz" style={{ flex: '1 1 auto', minHeight: 0 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    domLayout='autoHeight'
                    pagination={true}  // Включаем пагинацию
                    onRowDoubleClicked={onRowDoubleClicked} // Событие двойного клика
                    // paginationPageSize={10}  // Количество записей на одной странице
                    // paginationPageSizeSelector={[ 10, 20, 50, 100 ]}
                    // onPaginationChanged={onPaginationChanged}  // Обработка изменения страницы
                />
            </div>

            <Modal
                title={`Чек № ${selectedRow?.receipt_gnk_receiptseq || ''}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={400}
            >
                {selectedRow && returnReceiptDetail(selectedRow)}
            </Modal>
        </Content>
    );  
}
