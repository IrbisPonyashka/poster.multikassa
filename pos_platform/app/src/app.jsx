// import './assets/css/basic-bootstrap.scss';
import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';

import { Layout, Card } from 'antd';

// Импортируем ваши компоненты страниц
import Navbar from './components/header/app';
import Receipt from "/src/components/receipt/Receipt";

import Main from './views/main/app';
import Receipts from './views/receipts/app';

const App = () => {

    const [popup_type, setPopupType] = useState("functions");

    const [fiscal_module, setFiscalModule] = useState({});
    
    const [cashbox, setCahbox] = useState([]);
    
    const [contragent, setContragent] = useState([]);
    
    const [app_options, setAppOptions] = useState([]);

    const [receipt, setReceipt] = useState({});
    
    const [shiftInfo, setShiftInfo] = useState({});

    const [isShiftOpen, setIsShiftOpen] = useState(false);

    const [fiscalDevice, setfiscalDevice] = useState(false);
    
    // const [shiftInfo, setShiftInfo] = useState({});
    // const [isShiftOpen, setIsShiftOpen] = useState(false);
    
    useEffect( () => {  
        
        getFiscalModuleInfo();
        
        getZReportInfo();

        getCahboxInfo();

        getContragentInfo();

        getPosterAppOptions();
        
        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa',
            receiptsArchive: 'Multikassa',
        });

        Poster.on('applicationIconClicked', async (data) => {
            console.log("applicationIconClicked", data);

            setPopupType(data.place);

            var title = 'Multikassa',
                width = window.outerWidth - (window.outerWidth * 0.1),
                height = window.outerHeight - (window.outerHeight * 0.2);

            switch (data.place) {
                case "receiptsArchive":
                    width = window.outerWidth - (window.outerWidth * 0.5);
                    height = window.outerHeight - (window.outerHeight * 0.26);
                    
                    console.log("receiptsArchive_order", data.order);

                    if( !data.order.extras) {
                        title =  `Чек не фискализирован` ;
                    }else{
                        let orderExtras = data.order?.extras ?? {} ;
                        let orderMultikassaReceipt = orderExtras.multikassaReceipt ? JSON.parse(orderExtras.multikassaReceipt) : {};
                        let orderMultikassaReceiptId = orderMultikassaReceipt.receipt?.receipt_gnk_receiptseq ?? null ;
                        
                        orderMultikassaReceiptId ? title =  `Чек  № ${orderMultikassaReceiptId}` : null ;

                        setReceipt(orderMultikassaReceipt.receipt);
                    }
                break;
                case "functions":
                    title = 'Multikassa';
                break;
            }

            Poster.interface.popup({ width: width, height: height, title: title  });
        });
        
    }, []);

    // Смысла нет, как вариант можно вывести попап с сообщением
    /* Poster.on('beforeOrderClose', (data, next) => {
        if(app_options.extras.withoutFiscalization && app_options.extras.withoutFiscalization == "true"){
            next();
        }else if(!fiscal_module.result){
            showNotification( "Multikassa", "Фискализация отключена");
        }else if(!isShiftOpen){
            showNotification( "Multikassa", "Для выполнения операции необходимо открыть смену || Operatsiyani bajarish uchun siz smenani ochishingiz kerak");
        }
    }); */

    // Закрытие просто чека, также не смысла 
    Poster.on('afterOrderClose', (order) => {
        console.log("afterOrderClose", order);

        /* if(app_options.extras.withoutFiscalization && app_options.extras.withoutFiscalization == "true" && (!isShiftOpen || !fiscal_module.result) ){
            // showNotification( "Multikassa", "Фискализация отключена || Fiskalizatsiya o‘chirilgan");
        }else if(app_options.extras.withoutFiscalization && app_options.extras.withoutFiscalization == "false" && (!isShiftOpen || !fiscal_module.result) ){
            // showNotification( "Multikassa", "Фискализация отключена || Fiskalizatsiya o‘chirilgan");
        }else{
            // onAfterOrderClose(order.order);
        } */
        
    }); 
    
    
    if(fiscalDevice && fiscalDevice.name){
        console.log("fiscalDevice", fiscalDevice);
        
        // Закрытие фискального чека, тут можно прервать операцию 
        fiscalDevice.onPrintFiscalReceipt( async (info, next) => {
            console.log("onPrintFiscalReceipt", info);

            if( info.type == "sell" ){
                
                var fiscalOperationResult = await onAfterOrderClose(info.order);
                if(fiscalOperationResult.success){
                    next({
                        errorCode: 0,
                        success: true
                    });
                }else{
                    next({
                        errorCode: 6,
                        success: false,
                        errorText: fiscalOperationResult.data.error.message
                    });
                }
                
            }else if( info.type == "return" ) {
                
                var fiscalOperationResult = await onAfterOrderReturn(info.order);
                if(fiscalOperationResult.success){
                    next({
                        errorCode: 0,
                        success: true
                    });
                }else{
                    next({
                        errorCode: 6,
                        success: false,
                        errorText: fiscalOperationResult.data.error.message
                    });
                }
            }
        })
        
        fiscalDevice.onPrintXReport( async (info, next) => {
            console.log("onPrintXReport", info);
            next({
                errorCode: 0,
                success: true
            });
        })
        
        fiscalDevice.onPrintZReport( async (info, next) => {
            console.log("onPrintZReport", info);
            next({
                errorCode: 0,
                success: true
            });
        })
    }

    const onAfterOrderClose = async (order) => {
        let payedCert = order.payedCert === 0 ? order.payedCert : order.payedCert * 100;
        let payedCard = order.payedCash === 0 ? order.payedCash : order.payedCash * 100;
        let payedCash = order.payedCard === 0 ? order.payedCard : order.payedCard * 100;

        console.log("cashbox", cashbox);

        let sale_fields_obj = {
            "module_operation_type": "3",
            "receipt_sum": order.total === 0 ? order.total : order.total * 100 ,
            "receipt_cashier_name": `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`,
            "receipt_gnk_receivedcash": payedCard + payedCert,
            "receipt_gnk_receivedcard": payedCash ,
            "receipt_gnk_time": new Date(order.dateClose ?? order.dateStart).toLocaleString().replace(",",""),
            "items": [],
            "location": {
                "latitude": 41.29671408606234,
                "longitude": 69.21787478269367
            }
        }; 
        
        sale_fields_obj.items = await prepareProductItems(order.products);

        if(sale_fields_obj.items){
            let saleOperationResponse = await cashboxOperationRequest( sale_fields_obj);
            console.log("saleOperationResponse", saleOperationResponse);
            if(saleOperationResponse.success){
                // если всё ок, то нужно записать id чека в заказ poster'а
                let saveReceiptIdOnOrderRes = await saveReceiptIdOnOrder(order, saleOperationResponse);
                
                console.log("saveReceiptIdOnOrderRes",saveReceiptIdOnOrderRes);
                
                // showNotification( "Multikassa", "Операция прошла успешно || Operatsiya muvaffaqiyatli o'tdi");
                getZReportInfo();

                return saleOperationResponse;
            }else{
                return saleOperationResponse;
            }
        }
    }; 

    const onAfterOrderReturn = async (order) => {
        console.log("order", order);
        
        var receipt = {};

        if(order.extras && order.extras.multikassaReceipt){
            receipt = JSON.parse(order.extras.multikassaReceipt);
            if(receipt.receipt){
                receipt = receipt.receipt;
            }else{
                return {
                    success: false,
                    data: {
                        "error": {
                            "message": "Чек не найден в системе Multikassa",
                        }
                    }
                };
            }
        }else{
            return {
                success: false,
                data: {
                    "error": {
                        "message": "Чек не найден в системе Multikassa",
                    }
                }
            };
        }

        var refundReceiptObj = {
            "module_operation_type": "4",
            "receipt_cashier_name": receipt.receipt_cashier_name,
            "receipt_gnk_time": new Date(order.dateClose ?? order.dateStart).toLocaleString().replace(",",""),
            "receipt_sum": receipt.receipt_sum,
            "receipt_gnk_receivedcash": receipt.receipt_gnk_receivedcash,
            "receipt_gnk_receivedcard": 0,
            "RefundInfo":{
                "TerminalID": receipt.receipt_gnk_terminalid,
                "ReceiptSeq": receipt.receipt_gnk_receiptseq, 
                "DateTime": receipt.receipt_gnk_datetime,
                "FiscalSign": receipt.receipt_gnk_fiscalsign
            },
            "location": {
                "latitude": 41.29671408606234,
                "longitude": 69.21787478269367
            }
        };
        
        refundReceiptObj.items = await prepareProductItems(order.products);

        if(refundReceiptObj.items){
            let saleOperationResponse = await cashboxOperationRequest( refundReceiptObj);

            console.log("saleOperationResponse", saleOperationResponse);

            if(saleOperationResponse.success){
                return saleOperationResponse;
            }else{
                return saleOperationResponse;
            }
        }
    }; 
    
    const cashboxOperationRequest = async (feilds) => {
        return new Promise((resolve, reject) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify(feilds);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:8080/api/v1/operations", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => reject(error));
        })
    }

    const saveReceiptIdOnOrder = async (order, sale_result) => {
        return new Promise( async (resolve, reject) => {
            
            var result = await Poster.orders.setExtras( order.id, "multikassa_receipt",
                JSON.stringify({ 
                    receipt: sale_result.data
                })
            );
            if(result.success){
                resolve(result.success)
            }else{
                reject(result.success)
            }
            
        })
    }

    const prepareProductItems = async (products) => {
        let preparedItemsArr = [];

        for (const key in products) {
            if (Object.hasOwnProperty.call(products, key)) {

                const item = products[key];

                const product = await getProductById(item.id);

                let price = item.promotionPrice ?? item.price;
                let item_price = item.taxValue === 0 ? price : price + (price * Number(`0.${item.taxValue}`)) ;
                
                preparedItemsArr.push({
                    "classifier_class_code": (product.extras && product.extras.classifier_class_code) ? product.extras.classifier_class_code : "01902001009030002",
                    "product_package": (product.extras && product.extras.package_code) ? product.extras.package_code : "",
                    "product_package_name": (product.extras && product.extras.package_name) ? product.extras.package_name : "",
                    "product_mark": false,
                    "product_name": product.product_name,
                    "product_price": item_price,
                    "total_product_price": item_price * item.count,
                    "product_discount": item.nodiscount,
                    "count": item.count,
                    "product_vat_percent": item.taxValue,
                    "other": 0
                    // "product_label": "4780019900572",
                    // "product_barcode": "4780019900572",
                    // "product_without_vat": false,
                });                
            }
        }

        return preparedItemsArr;
    }

    const getProductById = async (id) => {
        return new Promise((resolve, reject) => {
            Poster.makeApiRequest(`menu.getProduct?product_id=${id}`, {
                method: 'get',
            }, (product) => product ? resolve(product) : reject(product));
        })
    }
    
    const getZReportInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/zReport", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.success){
                    setShiftInfo(result.data);

                    if( result.data.result.OpenTime && result.data.result.OpenTime != null){
                        setIsShiftOpen(true);
                        resolve(true);
                    }else{
                        setIsShiftOpen(false)
                        resolve(false);
                    }
                }
            })
            .catch((error) => console.error(error));
        })
    }

    const getCahboxInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/cashbox", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.success){
                    setCahbox(result.data);
                }
            })
            .catch((error) => console.error(error));
        })
    }
    
    const getContragentInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/contragents", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.success){
                    setContragent(result.data);
                }
            })
            .catch((error) => console.error(error));
        })
    }

    const getPosterAppOptions = async () => {
        Poster.makeApiRequest('settings.getAllSettings', {
            method: 'get'
        
        }, async (options) => {
            if (options) {
                
                var devices = await Poster.devices.getAll({ type: 'fiscalPrinter' });
                devices = devices.filter((deivce) => deivce.name == "multikassa_fm" );
                
                console.log("devices", devices);

                if(devices[0] && devices[0].name == "multikassa_fm"){
                    const device = devices[0];

                    device.setDefault();
                    device.setOnline();

                    setfiscalDevice(device);
                }else{
                    const device = await Poster.devices.create({
                        deviceClass: 'platformOnlineFiscal',
                        name: 'multikassa_fm'
                    });
                    if(device)
                        device.setDefault(),
                        device.setOnline(),
                        setfiscalDevice(device);
                }


                setAppOptions(options);
            }
        });
    }

    const getFiscalModuleInfo = async () => {

        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/info", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.data && result.data.result){
                    setFiscalModule(result.data);
                }

            })
            .catch((error) => console.error(error));
        })
    }

    // const onPrintFiscalReceipt = async () => {};
    
    const showNotification = ( title, message ) => {
        Poster.interface.showNotification({
            title: title ,
            message: message,
            icon: 'https://dev.joinposter.com/public/apps/multikassa-poster/icon.png',
        })
    }

    console.log("app_options", app_options);

    console.log("contragent",contragent);

    console.log("cashbox",cashbox);

    console.log("fiscal_module", fiscal_module);

    if(fiscal_module && fiscal_module.result && popup_type == "receiptsArchive" ){    
        return (
            <Layout style={{
                maxWidth: "1140px",
                width: "100%",
                margin: "0 auto",
                padding: "1rem",
            }}>
                <Receipt 
                    receipt={receipt}
                    cashbox={cashbox} 
                    contragent={contragent}
                    cashboxOperationRequest={cashboxOperationRequest}
                >
                </Receipt>
            </Layout>
        )
    }else if(fiscal_module && fiscal_module.result ){    
        return (
            <div
            style={{
                background: "rgb(245 245 245)",
                minHeight: "100%",
                borderRadius: "8px"
            }}
            >
                <Router>
                    <Navbar/>
                    <Layout style={{
                        maxWidth: "1140px",
                        width: "100%",
                        margin: "0 auto",
                        padding: "1rem",
                    }}>
                        <Routes>
                            <Route path="/*" element={<Main cashbox={cashbox} contragent={contragent} app_options={app_options} shiftInfo={shiftInfo} isShiftOpen={isShiftOpen} />} />
                            <Route path="/receipts" element={<Receipts cashbox={cashbox} contragent={contragent}/>} />
                            <Route path="/*" element={<Navigate to="/*"/>} />
                        </Routes>
                    </Layout>
                </Router>
            </div>
        )
    }else{
        return (
            <div
            style={{
                background: "rgb(245 245 245)",
                minHeight: "100%",
                borderRadius: "8px"
            }}
            >
                <Layout style={{
                    maxWidth: "1140px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "1rem",
                    height: "100%"
                }}>
                    <Card
                        title="Фискальный модуль не найден или касса не настроена"
                        bordered={false}
                    >
                        {/* <PosterUiKit.FormGroup label="Фискальный модуль" vertical >
                            <input type="text" disabled readonly value={cashbox.module_gnk_id} />
                        </PosterUiKit.FormGroup> */}   
                    </Card>
                </Layout>
            </div>
        )
    }
};

ReactDOM.render(<App />, document.getElementById('app-container'));