import { useState, useEffect } from 'react';

import {  HashRouter, Route, Routes, Navigate  } from 'react-router-dom';

import { Layout } from 'antd';

import Navbar from '../../components/header/app';

import Settings from '../../components/settings/Settings';

// pages
import Main from '../../views/main/app';

import Receipts from '../../views/receipts/app';

/**
 * В этом компоненте определяются необходимые данные для дальнейшей работы
 * Делается три необходим запроса (о смене, компании, касса)
 * @param {*} props 
 * @returns возвращается только необходимые данные для обёртки либо компонент для выбора типа кассы  
*/

const Home = (props) => {

    const cashbox_type = props.cashbox_type;

    // const [showMainPages, setShowMainPages] = useState(false);

    const [popup_type, setPopupType] = useState("functions");

    const [fiscal_module, setFiscalModule] = useState({});
    
    const [cashbox, setCahbox] = useState([]);
    
    const [contragent, setContragent] = useState([]);

    
    useEffect( () => {  
        
        getFiscalModuleInfo();
        
        getZReportInfo();

        getCahboxInfo();

        getContragentInfo();

        getPosterAppOptions();
        
    }, []);


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



    const returnRoutesPages = () => {
        let showMainPages = true;
        
        // если не установлены настройки
        if(cashbox_type == "none"){
            
            showMainPages = false;

        // если выбран VM и фискальный модуль вставлен
        }else if(cashbox_type == "vm" && fiscal_module && fiscal_module.result){
            
            showMainPages = true;
            
        // если выбран KKM и установлен IP-адресс устройства
        }else if(cashbox_type == "kkm" && Poster.settings.extras && Poster.settings.extras.posDeviceIpAdres){
            
            showMainPages = true;
        }
        
        return (
            <Routes>
                {showMainPages && <Route path="/*" element={
                    <Main key="main" cashbox_type={cashbox_type}
                />} /> }
                {showMainPages && <Route path="/receipts" element={
                    <Receipts key="receipts" cashbox_type={cashbox_type} />}
                /> }
                <Route 
                    path="/settings" element= {
                    <Settings key="settings" cashbox_type={cashbox_type} updateCashboxType={props.updateCashboxType}/>
                } /> 
            </Routes>
        );
    }

    const returnTemplate = () => {

    };

    return(
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
    );

};


export default Home;
