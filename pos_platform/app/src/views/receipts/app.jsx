import React, { useState, useEffect } from 'react';

import { Layout, Modal } from 'antd';

const { Content } = Layout;

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";

import Receipt from "/src/components/receipt/Receipt";
import getColumnsData from "/src/views/receipts/colData";

export default function Receipts( {cashbox, contragent} ) {   
    
    const [clickTimer, setClickTimer] = useState(null);

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
    const onCellClicked = (params) => {
        if (clickTimer) {
            clearTimeout(clickTimer);
            
            setClickTimer(null);

            onRowDoubleClicked(params);  // Обрабатываем как двойное нажатие
            
        } else {
            const timer = setTimeout(() => {
                setClickTimer(null);
            }, 300);

            setClickTimer(timer);
        }

    }

    const onRowDoubleClicked = (params) => {

        setSelectedRow(params.data); // Сохраняем данные выбранной строки
        setIsModalVisible(true); // Открываем модальное окно
    };

    // Закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onGridReady = (params) => {
        var updatePageSizeText = () => {
            var pageSizeLabel = document.querySelector('div#ag-15-label');
            if (pageSizeLabel) {
                // pageSizeLabel.textContent = 'Размер страницы';  // Меняем текст на русский
            }
        };

        // Вызываем функцию при изменении страницы
        params.api.addEventListener('paginationChanged', updatePageSizeText);

        // Также вызываем при инициализации
        updatePageSizeText();
    };

    const localeText = {
        // Пагинация
        page: 'Страница',
        more: 'Еще',
        to: 'к',
        of: 'из',
        next: 'Следующая',
        last: 'Последняя',
        first: 'Первая',
        previous: 'Предыдущая',
        pageSize: 'Кол-во страниц',
      
        // Сообщения
        loadingOoo: 'Загрузка...',
        noRowsToShow: 'Нет данных для отображения',
        
        // Фильтры
        filterOoo: 'Фильтр...',
        equals: 'Равно',
        notEqual: 'Не равно',
        lessThan: 'Меньше',
        greaterThan: 'Больше',
        contains: 'Содержит',
        notContains: 'Не содержит',
        startsWith: 'Начинается с',
        endsWith: 'Заканчивается на',
      
        // Группировка и агрегация
        group: 'Группа',
        columns: 'Столбцы',
        filters: 'Фильтры',
      
        // Параметры агрегации
        sum: 'Сумма',
        min: 'Мин',
        max: 'Макс',
        avg: 'Среднее',
        count: 'Кол-во',
      
        // Кнопки и меню
        resetColumns: 'Сбросить столбцы',
        expandAll: 'Развернуть все',
        collapseAll: 'Свернуть все',
    };

    console.log("receipts", rowData);
    return (
        <Content id="receipts" >
            <div className="ag-theme-quartz" style={{ flex: '1 1 auto', minHeight: 0 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    localeText={localeText}
                    domLayout='autoHeight'
                    pagination={true}  // Включаем пагинацию
                    // onRowDoubleClicked={onRowDoubleClicked} // Событие двойного клика
                    onCellClicked={onCellClicked} // Эмуляция двойного клика для мобильных устройств
                    paginationPageSize={10}  // Количество записей на одной странице
                    paginationPageSizeSelector={[ 10, 20, 50, 100 ]}
                    onGridReady={onGridReady}
                    // onPaginationChanged={onPaginationChanged}  // Обработка изменения страницы
                />
            </div>

            <Modal
                title={`Чек № ${selectedRow?.receipt_gnk_receiptseq || ''}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={540}
                style={{ paddingBottom: "4rem" }}
            >
                <Receipt 
                    receipt={selectedRow}
                    cashbox={cashbox} 
                    contragent={contragent}
                >
                </Receipt>
            </Modal>
        </Content>
    );  
}
