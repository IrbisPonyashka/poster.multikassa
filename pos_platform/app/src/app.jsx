// import './assets/css/basic-bootstrap.scss';
import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';

import { Layout, Card } from 'antd';

// Импортируем ваши компоненты страниц
import Navbar from './components/header/app';
import Main from './views/main/app';
import Receipts from './views/receipts/app';

const App = () => {

    const [fiscal_module, setFiscalModule] = useState({});
    const [cashbox, setCahbox] = useState([]);
    const [contragent, setContragent] = useState([]);
    const [app_options, setAppOptions] = useState([]);
    // const [shiftInfo, setShiftInfo] = useState({});
    // const [isShiftOpen, setIsShiftOpen] = useState(false);
    
    useEffect( () => {  
        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa',
        });

        Poster.on('applicationIconClicked', async (data) => {
            Poster.interface.popup({ width: window.outerWidth - (window.outerWidth * 0.1), height: window.outerHeight - (window.outerHeight * 0.2), title: 'Multikassa' });
        });

        // getZReportInfo();

        getFiscalModuleInfo();
        getCahboxInfo();
        getContragentInfo();
        getPosterAppOptions();
    }, []);
    
    const getZReportInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            fetch("http://localhost:8080/api/v1/zReport", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                if(result.success){
                    setShiftInfo(result.data);

                    console.log("http://localhost:8080/api/v1/zReport",result);
                    if( result.data.result.OpenTime && result.data.result.OpenTime != null){
                        setIsShiftOpen(true);
                    }else{
                        setIsShiftOpen(false)
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

    const getPosterAppOptions = async () => {
        Poster.makeApiRequest('settings.getAllSettings', {
            method: 'get'
        
        }, (options) => {
            if (options) {
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
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
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

    console.log("app_options", app_options);

    console.log("contragent",contragent);
    console.log("cashbox",cashbox);
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
                            <Route path="/*" element={<Main cashbox={cashbox} contragent={contragent} app_options={app_options} />} />
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