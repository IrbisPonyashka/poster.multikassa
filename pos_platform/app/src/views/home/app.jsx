import { useState, useEffect } from 'react';

import {  HashRouter, Route, Routes  } from 'react-router-dom';

import { Layout, Card } from 'antd';

// components
import Main from '../../views/main/app';
import Receipts from '../../views/receipts/app';

// pages
import Navbar from '../../components/header/app';
import ScanMarkComponent from '../../components/onScanMark/ScanMarkComponent';
import Settings from '../../components/settings/Settings';

/**
 * В этом компоненте определяются необходимые данные для дальнейшей работы
 * Делается три необходим запроса (о смене, компании, касса)
 * @param {*} props 
 * @returns возвращается только необходимые данные для обёртки либо компонент для выбора типа кассы  
*/

const Home = (props) => {

    const cashbox_type = props.cashbox_type;

    const [popup_type, setPopupType] = useState("functions");

    const [fiscal_module, setFiscalModule] = useState({});
    
    const [cashbox, setCahbox] = useState([]);
    
    const [contragent, setContragent] = useState([]);
    
    const [app_options, setAppOptions] = useState([]);
    
    const [shiftInfo, setShiftInfo] = useState({});
 
    const [isShiftOpen, setIsShiftOpen] = useState(false);

    const [fiscalDevice, setfiscalDevice] = useState(false);
    
    const [orderData, setOrderData] = useState(false);
    
    // const [shiftInfo, setShiftInfo] = useState({});
    // const [isShiftOpen, setIsShiftOpen] = useState(false);
    
    useEffect( () => {  

        if(cashbox_type != "none")
        {
            collectingDataFromKKM();

            // getFiscalModuleInfo();
            
            // getZReportInfo();
            
            // getCahboxInfo();
            
            // getContragentInfo();
            
            getPosterAppOptions();
        }
        
        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa'
        });

        Poster.on('applicationIconClicked', async (data) => {
            console.log("applicationIconClicked", data);

            setPopupType(data.place);

            var title = 'Multikassa',
                width = window.outerWidth - (window.outerWidth * 0.1),
                height = window.outerHeight - (window.outerHeight * 0.2);

            switch (data.place) {
                case "functions":
                    title = 'Multikassa';
                break;
            }

            Poster.interface.popup({ width: width, height: height, title: title  });
        });
        
    }, [cashbox_type]);


    // Poster.on('beforeOrderClose', async (data, next) => {
    //     next();
    // });

    // // Закрытие просто чека, также не смысла 
    // Poster.on('afterOrderClose', (order) => {
    // });
    
    // При добавлении/изменении товара в заказе
    Poster.on('orderProductChange', async (order) => {

        console.log("orderProductChange", order);

        // Если есть продукты
        if(order.product.count != 0) {
            var product = await getProductById(order.product.id);
            
            // Если в настройке задано что продукт маркируемый
            if(product.extras && product.extras.product_mark && product.extras.product_mark == "1") 
            {

                setPopupType("onScanProducts");
                setOrderData(order);

                if(orderData){
                    for (let index in orderData.order.products) {
                        let product = orderData.order.products[index];
                        
                        if(product.id === order.product.id && product.count > order.product.count){
                            return;
                        }
                    }
                }
        
                Poster.interface.popup({
                    width: window.outerWidth - (window.outerWidth * 0.5),
                    height: window.outerHeight - (window.outerHeight * 0.26),
                    title: "Сканирование маркировки"
                });

            }
        }

    });
    
    if(fiscalDevice && fiscalDevice.name){
        console.log("fiscalDevice", fiscalDevice);
        
        // Закрытие фискального чека, тут можно прервать операцию 
        fiscalDevice.onPrintFiscalReceipt( async (info, next) => {
            console.log("onPrintFiscalReceipt", info);

            if( info.type == "sell" ){
                
                var fiscalOperationResult = await onAfterOrderClose(info.order);
                console.log("fiscalOperationResult", fiscalOperationResult);
                if(fiscalOperationResult?.result.status == "success" || fiscalOperationResult?.result.success){
                    next({
                        errorCode: 0,
                        success: true,
                        successText: "Операция прошла успешно"
                    });
                }else{
                    let textError = "";
                    console.log("fiscalOperationResult.error", fiscalOperationResult.error);
                    if(fiscalOperationResult.error && typeof fiscalOperationResult.error == "string"){
                        textError = fiscalOperationResult.error;
                    }else if(fiscalOperationResult.error){
                        textError = JSON.parse(fiscalOperationResult.error).error;
                    }else{
                        textError = fiscalOperationResult.result?.data.error.message ?? fiscalOperationResult.data.error.message
                    }
                    next({
                        errorCode: 6,
                        success: false,
                        errorText: textError
                    });
                }
                
            }else if( info.type == "return" ) {
                
                var fiscalOperationResult = await onAfterOrderReturn(info.order);
                console.log("fiscalOperationResult", fiscalOperationResult);
                if(fiscalOperationResult.result.success){
                    next({
                        errorCode: 0,
                        success: true
                    });
                }else{
                    let textError = "";
                    if(fiscalOperationResult.error && typeof fiscalOperationResult.error == "string"){
                        textError = fiscalOperationResult.error;
                    }else if(fiscalOperationResult.error){
                        textError = JSON.parse(fiscalOperationResult.error).error;
                    }else{
                        textError = fiscalOperationResult.result?.data.error.message ?? fiscalOperationResult.data.error.message
                    }
                    next({
                        errorCode: 6,
                        success: false,
                        errorText: textError
                    });
                }
            }
        })
        
        fiscalDevice.onPrintXReport( async (info, next) => {
            console.log("onPrintXReport", info);

            try {
                // Логика формирования отчета
                const shiftXReportRequest = await sendRequestOperation(7);            
                console.log("shiftXReportRequest", shiftXReportRequest);
                if(shiftXReportRequest.success && shiftXReportRequest.data)
                {

                    // setPopupType("receiptsArchive");
                    // setReceipt(shiftXReportRequest.data);
    
                    // width = window.outerWidth - (window.outerWidth * 0.5);
                    // height = window.outerHeight - (window.outerHeight * 0.26);

                    // Poster.interface.popup({ width: width, height: height, title: "Multikassa"});
    
                    next({
                        success: true,
                        successText: "X-отчет сформирован"
                    });
                }else{
                    next({
                        success: false,
                        errorText: `Error: ${shiftXReportRequest.data.error.message}`
                    });
                }

            } catch (error) {
                console.log("error", error);
                next({
                    success: false,
                    errorText: `Error: ${error.message}`
                });
            }
        })
        
        fiscalDevice.onPrintZReport( async (info, next) => {
            console.log("onPrintZReport", info);
            
            try {
                // Логика формирования отчета
                const getZReportRequest = await getZReport();            
                console.log("getZReportRequest", getZReportRequest);
                if(getZReportRequest.success && getZReportRequest.data)
                {
                    // setPopupType("receiptsArchive");
                    // setReceipt(getZReportRequest.data);
    
                    // width = window.outerWidth - (window.outerWidth * 0.5);
                    // height = window.outerHeight - (window.outerHeight * 0.26);

                    // Poster.interface.popup({ width: width, height: height, title: "Multikassa"});
    
                    next({
                        success: true,
                        successText: "Z-Отчет сформирован"
                    });
                }else{
                    next({
                        success: false,
                        errorText: `Error: ${getZReportRequest.data.error.message}`
                    });
                }

            } catch (error) {
                console.log("error", error);
                next({
                    success: false,
                    errorText: `Error: ${error.message}`
                });
            }
        })
    }

    const onAfterOrderClose = async (order) => {

        let payedCert = order.payedCert === 0 ? order.payedCert : order.payedCert * 100;
        let payedCard = order.payedCash === 0 ? order.payedCash : order.payedCash * 100;
        let payedCash = order.payedCard === 0 ? order.payedCard : order.payedCard * 100;

        let cashier = "";
        /* Так как Толкин ничего правильно не понял, приходится делать так */
        if(cashbox && cashbox.current_cashier){
            cashier = typeof cashbox.current_cashier === "object" ?
                `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`
                : cashbox.current_cashier;
        }

        let sale_fields_obj = {
            "module_operation_type": "3",
            "force_to_print": true,
            "receipt_sum": order.total === 0 ? order.total : order.total * 100 ,
            "receipt_cashier_name": cashier,
            "receipt_gnk_receivedcash": payedCard + payedCert,
            "receipt_gnk_receivedcard": payedCash ,
            "receipt_gnk_time": new Date(order.dateClose ?? order.dateStart).toLocaleString().replace(",",""),
            "items": [],
            "location": {
                "latitude": 41.29671408606234,
                "longitude": 69.21787478269367
            }
        };

        sale_fields_obj.receipt_gnk_receivedcard > 0 ? sale_fields_obj.pay_from_card = true : null;
        
        sale_fields_obj.items = await prepareProductItems(order.products, order.extras ?? false);
        
        if(sale_fields_obj.items)
        {
            console.log("sale_fields_obj", sale_fields_obj);
            
            // Если оплата картой через терминал 
            if(
                sale_fields_obj.receipt_gnk_receivedcard > 0 &&
                Poster.settings.extras &&
                Poster.settings.extras.cashboxType &&
                Poster.settings.extras.cashboxType == "vm" &&
                Poster.settings.extras.terminalDeviceIpAdres &&
                Poster.settings.extras.terminalDevicePort
            ){
                let sendPayRequest = await terminalOperationPay(order, sale_fields_obj.receipt_gnk_receivedcard);
                if(!sendPayRequest){
                    return {
                        "result": {
                            "data": {
                                "error":{
                                    "message": "Транзакция отменена"
                                }
                            },
                            "success": false
                        }
                    }
                }
            }

            let saleOperationResponse = await cashboxOperationRequest( sale_fields_obj );
            console.log("saleOperationResponse", saleOperationResponse);

            if(saleOperationResponse.result.success){
                // если всё ок, то нужно записать id чека в заказ poster'а
                let saveReceiptIdOnOrderRes = await saveReceiptIdOnOrder(order, saleOperationResponse.result);
                
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
            "receipt_gnk_receivedcard": receipt.receipt_gnk_receivedcard,
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
        
        refundReceiptObj.items = await prepareProductItems(order.products, order.extras ?? false);
        console.log("refundReceiptObj", refundReceiptObj);

        if(refundReceiptObj.items){
            
            // Если оплата картой через терминал 
            if(
                refundReceiptObj.receipt_gnk_receivedcard > 0 &&
                Poster.settings.extras &&
                Poster.settings.extras.cashboxType &&
                Poster.settings.extras.cashboxType == "vm" &&
                Poster.settings.extras.terminalDeviceIpAdres &&
                Poster.settings.extras.terminalDevicePort
            ){
                let sendPayRequest = await terminalOperationReturn(order);
                if(!sendPayRequest){
                    return {
                        "result": {
                            "data": {
                                "error":{
                                    "message": "Транзакция отменена"
                                }
                            },
                            "success": false
                        }
                    }
                }
            }

            let saleOperationResponse = await cashboxOperationRequest( refundReceiptObj);

            console.log("saleOperationResponse", saleOperationResponse);

            if(saleOperationResponse.success){
                return saleOperationResponse;
            }else{
                return saleOperationResponse;
            }
        }
    }; 
    
    const terminalOperationPay = async (order, amount) => {
        return new Promise((resolve, reject) => {
            console.log(`http://${Poster.settings.extras.terminalDeviceIpAdres}:${Poster.settings.extras.terminalDevicePort}/pay?amount=${amount}&orderId=${order.id}`);
            Poster.makeRequest(`http://${Poster.settings.extras.terminalDeviceIpAdres}:${Poster.settings.extras.terminalDevicePort}/pay?amount=${amount}&orderId=${order.id}`, {
                method: 'post',
                localRequest: true
            }, (answer) => {
                console.log("Результат оплаты картой => ", answer);
                if(
                    answer.result &&
                    answer.result.param &&
                    answer.result.param.status &&
                    answer.result.param.status == "success"
                ){
                    resolve(true)
                }else{
                    resolve(false)
                }
            });
        })
    }

    const terminalOperationReturn = async (order) => {
        return new Promise((resolve, reject) => {
            console.log(`http://${Poster.settings.extras.terminalDeviceIpAdres}:${Poster.settings.extras.terminalDevicePort}/cancel_transaction?orderId=${order.id}`);
            Poster.makeRequest(`http://${Poster.settings.extras.terminalDeviceIpAdres}:${Poster.settings.extras.terminalDevicePort}/cancel_transaction?orderId=${order.id}`, {
                method: 'post',
                localRequest: true
            }, (answer) => {
                console.log("Результат возврата средств => ", answer);
                if(
                    answer.result &&
                    answer.result.param &&
                    answer.result.param.status &&
                    answer.result.param.status == "success"
                ){
                    resolve(true)
                }else{
                    resolve(false)
                }
            });
        })
    }

    const cashboxOperationRequest = async (feilds) => {
        return new Promise((resolve, reject) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/operations`, {
                method: 'post',
                data: feilds,
                localRequest: true
            }, (answer) => {
                console.log("sale", answer);
                resolve(answer)
            });
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

    const prepareProductItems = async (products, order_extras) => {
        let preparedItemsArr = [];

        for (const key in products) {
            if (Object.hasOwnProperty.call(products, key)) {
                const item = products[key];

                const product = await getProductById(item.id);

                let price = item.promotionPrice ?? item.price;
                let item_price = item.taxValue === 0 ? price : price + (price * Number(`0.${item.taxValue}`)) ;
                let item_promotion_price = item.taxValue === 0 ? item.promotionPrice : item.promotionPrice + (item.promotionPrice * Number(`0.${item.taxValue}`)) ;
                // let item_promotion_price = item.promotionPrice ;
                
                // если в extras'е имеется продукт с подходящим айди
                if(order_extras && order_extras.productsLabels && JSON.parse(order_extras.productsLabels)[item.id] ){
                    console.log("LABELS", JSON.parse(order_extras?.productsLabels),item.id);
                    var productsLabels = JSON.parse(order_extras.productsLabels)[item.id];
                    productsLabels.forEach((product_label) => {
                        preparedItemsArr.push(getProductObjectFields(product, item, item_price, item_promotion_price, product_label));
                    });
                }else{
                    preparedItemsArr.push(getProductObjectFields(product, item, item_price, item_promotion_price));
                }               
            }
        }

        return preparedItemsArr;
    }

    const getProductObjectFields = ( product, item, item_price, item_promotion_price, product_label = "" ) => {
        /* preparedItemsArr.push({
            "classifier_class_code": (product.extras && product.extras.classifier_class_code) ? product.extras.classifier_class_code : "01902001009030002",
            "product_package": (product.extras && product.extras.package_code) ? product.extras.package_code : "",
            "product_package_name": (product.extras && product.extras.package_name) ? product.extras.package_name : "",
            "product_barcode": product.barcode ?? "",
            "product_mark": (product.extras && product.extras.product_mark) ? product.extras.product_mark : false,
            "product_name": product.product_name,
            "product_price": item_price,
            "total_product_price": item_price * item.count,
            "product_discount": item.nodiscount,
            "count": item.count,
            "product_vat_percent": item.taxValue,
            "other": 0
        });  */
        let product_mark = (product.extras && product.extras.product_mark) ? product.extras.product_mark : "0";
        return {
            "receipt_item_id": `${item.id}`,
            "classifier_class_code": (product.extras && product.extras.classifier_class_code)? product.extras.classifier_class_code : "01902001009030002",
            "product_package": (product.extras && product.extras.package_code) ? product.extras.package_code : "",
            "product_package_name": (product.extras && product.extras.package_name) ? product.extras.package_name : "",
            "product_barcode": product.barcode ?? "",
            "product_mark": product_mark === "1" ? true : false,
            "product_label": product_label,
            "product_name": product.product_name,
            "product_price": item_price,
            "total_product_price": item_price * item.count,
            "product_discount": 0,
            "count": item.count,
            "product_without_vat": false,
            "product_vat_percent": item.taxValue,
            "receipt_item_per_vat": item.taxValue,
            "product_owner_type": 0,
            "other": 0
        }
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
            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/zReport`, {
                method: 'get',
                localRequest: true
            }, (answer) => {
                console.log("result.data.result", answer.result);
                if(answer.result && answer.result.success)
                {
                    let result = answer.result;
                    setShiftInfo(result.data.result);
                    if( 
                        (result.data.result.openTime && result.data.result.openTime != null)
                        ||
                        (result.data.result.OpenTime && result.data.result.OpenTime != null)
                    ){
                        setIsShiftOpen(true);
                    }else{
                        setIsShiftOpen(false)
                    }

                    resolve(result.data.result);
                }else{
                    reject(false);
                }
            });

        })
    }

    const getZReport = async () => {
        return new Promise((resolve, reject) => {

            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/zReport?number=1&force_to_print=1`, {
                method: 'get',
                localRequest: true
            }, (answer) => {
                resolve(answer.result)
            });
        })
    }

    const getCahboxInfo = async () => {
        return new Promise((resolve, reject) => {
              
            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/cashbox`, {
                method: 'get',
                localRequest: true
            }, (answer) => {
                console.log("getCahboxInfo => ", answer.result);
                if(answer.result.success){
                    setCahbox(answer.result.data);
                    resolve(answer.result.success);
                }else{
                    setCahbox([]);
                    resolve(answer.result);
                }

            });
        })
    }
    
    const getContragentInfo = async () => {
        return new Promise((resolve, reject) => {
            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/contragents`, {
                method: 'get',
                localRequest: true
            }, (answer) => {
                // let result = answer.result;
                // setContragent(result.data);
                if(answer.result.success){
                    setContragent(answer.result.data);
                    resolve(answer.result.data);
                }else{
                    setContragent([]);
                    resolve([]);
                }

            });
        })
    }

    const getPosterAppOptions = async () => {
        Poster.makeApiRequest('settings.getAllSettings', {
            method: 'get'
        
        }, async (options) => {
            if (options) {
                
                var devices = await Poster.devices.getAll({ type: 'fiscalPrinter' });
                devices = devices.filter((deivce) => deivce.name == "multikassa_fm" );
                
                if(devices[0] && devices[0].name == "multikassa_fm"){
                    const device = devices[0];

                    console.log("device", device);

                    device.setDefault();
                    device.setOnline();

                    setfiscalDevice(device);
                }else{
                    const device = await Poster.devices.create({
                        deviceClass: 'platformOnlineFiscal',
                        name: 'multikassa_fm'
                    });
                    console.log("device", device);
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
            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;

            Poster.makeRequest(`http://${uri_ip}/api/v1/info`, {
                method: 'get',
                localRequest: true
            }, (answer) => {
                if(answer.result == false && JSON.parse(answer.error).error && JSON.parse(answer.error).error == "Преведущая опреация не завершена. По необходимости перезагрузите терминал"){
                    console.log("getFiscalModuleInfo error",answer);
                    resolve(answer.result);
                }else{
                    setFiscalModule(answer.result.data)
                    console.log("getFiscalModuleInfo success",answer);
                    resolve(answer.result.data);
                    // if(cashbox_type == "vm"){
                    //     setFiscalModule(answer.result.data.result)
                    // }else{
                    // }
                }
            });
        })
    }

    const collectingDataFromKKM = async () => {
        console.group();
        let fiscalModule = await getFiscalModuleInfo();
        if(fiscalModule){
            console.log("fiscalModule",fiscal_module)

            let zreportInfo = await getZReportInfo();
            if(zreportInfo){
                console.log("zreportInfo",shiftInfo, isShiftOpen)

                let contragentInfo = await getContragentInfo();
                if(contragentInfo){
                    console.log("contragentInfo",contragent)
                    
                    if(cashbox_type == "kkm" && contragentInfo.cashier){
                        let cashboxInfo = {
                            "current_cashier": contragentInfo.cashier
                        };
                        
                        setCahbox(cashboxInfo);
                        console.log("cashboxInfo",cashbox);
                        
                    }else if(cashbox_type == "vm"){
                        let cashboxInfo = await getCahboxInfo();
                        console.log("cashboxInfo",cashboxInfo);
                    }
                }
                
            }
        }
        console.groupEnd();
    }
    
    /**
     * @type
     * 1 - Открытие смены
     * 2 - Закрытие смены
     * 3 - Продажа
     * 7 - Х отчет
    */
    const sendRequestOperation = async (type) => {
        return new Promise((resolve, reject) => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let cashier = "";
            /* Так как Толкин ничего правильно не понял, приходится делать так */
            if(cashbox && cashbox.current_cashier){
                cashier = typeof cashbox.current_cashier === "object" ?
                    `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`
                    : cashbox.current_cashier;
            }

            const raw = {
                "module_operation_type": String(type),
                "receipt_gnk_time": getCurrentDateTime(),
                "receipt_cashier_name": cashier
            }; 


            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;
            
            Poster.makeRequest(`http://${uri_ip}/api/v1/operations`, {
                method: 'post',
                data: raw,
                localRequest: true
            }, (answer) => {
                resolve(answer.result)
            });
        })
    };

    // const onPrintFiscalReceipt = async () => {};
    
    const showNotification = ( title, message ) => {
        Poster.interface.showNotification({
            title: title ,
            message: message,
            icon: 'https://dev.joinposter.com/public/apps/multikassa-poster/icon.png',
        })
    }
    
    function getCurrentDateTime() {
        let now = new Date();
        
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        let day = String(now.getDate()).padStart(2, '0');
        
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Собираем всё в нужном формате
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const returnRoutesPages = () => {
        let showMainPages = true;
        
        // если не установлены настройки
        if(cashbox_type == "none"){
            
            showMainPages = false;

        // если выбран VM и фискальный модуль вставлен
        }else if(cashbox_type == "vm" && fiscal_module && fiscal_module.data){
            
            showMainPages = true;
            
        // если выбран KKM и установлен IP-адресс устройства
        }else if(cashbox_type == "kkm" && Poster.settings.extras && Poster.settings.extras.posDeviceIpAdres){
            
            showMainPages = true;
        }
        
        return (
            <Routes>
                {showMainPages && <Route path="/*" element={
                    <Main key="main" fiscal_module={fiscal_module} cashbox_type={cashbox_type} cashbox={cashbox} contragent={contragent} app_options={app_options} shiftInfo={shiftInfo} isShiftOpen={isShiftOpen}
                />} /> }
                {showMainPages && <Route path="/receipts" element={
                    <Receipts key="receipts" cashbox={cashbox} contragent={contragent} />}
                /> }
                <Route 
                    path="/settings" element= {
                    <Settings key="settings" cashbox_type={cashbox_type} updateCashboxType={props.updateCashboxType}/>
                } /> 
            </Routes>
        );
    }

    const returnMainApp = () => {
        return (
            <div
                style={{
                    background: "rgb(245 245 245)",
                    minHeight: "100%",
                    borderRadius: "8px"
                }}
            >
                <HashRouter>
                    <Navbar
                        cashbox_type={cashbox_type}
                        />
                        <Layout style={{
                            maxWidth: "1140px",
                            width: "100%",
                            margin: "0 auto",
                            padding: "2rem 1rem",
                        }}>
                            {returnRoutesPages()}
                        </Layout>    
                </HashRouter>
            </div>
        )
    }

    const returnScanComponent = () => {
        return(
            <Layout style={{
                maxWidth: "1140px",
                width: "100%",
                margin: "0 auto",
                padding: "1rem",
                background: "#fff",
                height: "100%"
            }}>
                <ScanMarkComponent 
                    cashbox={cashbox} 
                    contragent={contragent}
                    cashboxOperationRequest={cashboxOperationRequest}
                    orderData={orderData}
                >
                </ScanMarkComponent>
            </Layout>
        );
    }

    const returnTemplate = () => {
        // Выводим главный интерфейс приложения, если тип "functions" 
        if(popup_type == "functions"){
            return (
                returnMainApp()
            )
        // Выводим компонент скана, только если заданы все настройки
        }else if(cashbox_type != "none" && cashbox_type != "" && fiscal_module && fiscal_module.result && popup_type == "onScanProducts"){
            return (
                returnScanComponent()
            ) 
        }
    };
    
    return (
        returnTemplate()
    );

};


export default Home;
