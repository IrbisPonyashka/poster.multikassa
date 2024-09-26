// import './assets/css/basic-bootstrap.scss';
import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';

import { Layout, Card } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Content } = Layout;

// Импортируем ваши компоненты страниц
import Navbar from './components/header/app';
import Main from './views/main/app';
import Receipts from './views/receipts/app';

const App = () => {

    const [fiscal_module, setFiscalModule] = useState({});
    const [cashbox, setCahbox] = useState([]);
    const [contragent, setContragent] = useState([]);
    
    useEffect( () => {  
        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa',
            // order: 'Кнопка платформы',
            // payment: 'My Button',
        });

        Poster.on('applicationIconClicked', async (data) => {
            Poster.interface.popup({ width: window.outerWidth - (window.outerWidth * 0.1), height: window.outerHeight - (window.outerHeight * 0.2), title: 'Multikassa' });
        });

        getFiscalModuleInfo();
        getCahboxInfo();
        getContragentInfo();
    }, []);
    
    Poster.on('afterOrderClose', (order) => {
        console.log("afterOrderClose", order);

        onAfterOrderClose(order.order);
    }); 

    const onAfterOrderClose = async (order) => {
        let sale_fields_obj = {
            "module_operation_type": "3",
            "receipt_sum": order.total === 0 ? order.total : order.total * 100 ,
            "receipt_cashier_name": `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`,
            "receipt_gnk_receivedcash": order.payedCash === 0 ? order.payedCash : order.payedCash * 100 ,
            "receipt_gnk_receivedcard": order.payedCard === 0 ? order.payedCard : order.payedCard * 100 ,
            "receipt_gnk_time": new Date(order.dateClose ?? order.dateStart).toLocaleString().replace(",",""),
            "items": [],
            "location": {
                "latitude": 41.29671408606234,
                "longitude": 69.21787478269367
            }
        }; 
        sale_fields_obj.items = await prepareProductItems(order.products);
        
        console.log("sale_fields_obj", sale_fields_obj);

        if(sale_fields_obj.items){
            let saleOperationResponse = await saleOperationRequest(sale_fields_obj);
            if(saleOperationResponse.success){
                showNotification( "Multikassa", "Операция прошла успешно || Operatsiya muvaffaqiyatli o'tdi");
            }else{
                showNotification( "Multikassa", `Что-то пошло не так || Biror narsa noto'g'ri ketdi <hr> ${saleOperationResponse.data?.error?.data}`);
            }
            console.log("saleOperationResponse", saleOperationResponse);
        }
    }; 
    
    const saleOperationRequest = async (feilds) => {
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
                .then((response) => response.text())
                .then((result) => {
                    result = JSON.parse(result);
                    resolve(result);
                })
                .catch((error) => reject(error));
        })
    }

    const prepareProductItems = async (products) => {
        let preparedItemsArr = [];

        for (const key in products) {
            if (Object.hasOwnProperty.call(products, key)) {
                const item = products[key];
                const product = await getProductById(item.id);
                let item_price = item.taxValue === 0 ? item.price : item.price + (item.price * Number(`0.${item.taxValue}`)) ;
                console.log("item_price",item_price);
                preparedItemsArr.push({
                    "classifier_class_code": (product.extras && product.extras.classifier_class_code) ? product.extras.classifier_class_code : "01902001009030002",
                    "package_code": (product.extras && product.extras.package_code) ? product.extras.package_code : "",
                    "package_name": (product.extras && product.extras.package_name) ? product.extras.package_name : "",
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

    const getCahboxInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/cashbox", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
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
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                if(result.success){
                    setContragent(result.data);
                }
            })
            .catch((error) => console.error(error));
        })
    }

    const getFiscalModuleInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/info", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                console.log("getFiscalModuleInfo",result.data && result.data.result)
                if(result.data && result.data.result){
                    setFiscalModule(result.data);
                }
            })
            .catch((error) => console.error(error));
        })
    }
    
    const showNotification = ( title, message ) => {
        Poster.interface.showNotification({
            title: title ,
            message: message,
            icon: 'https://dev.joinposter.com/public/apps/multikassa-poster/icon.png',
        })
    }

    console.log("fiscal_module", fiscal_module);
    if(fiscal_module && fiscal_module.result ){    
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
                            <Route path="/*" element={<Main cashbox={cashbox} contragent={contragent} />} />
                            <Route path="/receipts" element={<Receipts cashbox={cashbox} contragent={contragent} />} />
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