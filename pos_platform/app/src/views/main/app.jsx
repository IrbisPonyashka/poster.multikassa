
import React, { useState, useEffect } from 'react';

import { Layout, Card, Typography, Row, Col } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Text } = Typography;

const { Content } = Layout;

const App = ({ cashbox, contragent, shiftInfo, isShiftOpen}) => {

    // const [shiftInfo, setShiftInfo] = useState({});
    // const [isShiftOpen, setIsShiftOpen] = useState(false);
    
    useEffect( () => {  
        
        // getZReportInfo();
        
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
    
    const onShiftOpening = async (e) => {
        e.preventDefault();

        const shiftOpeningRequest = await sendRequestOperation(1);
        if(shiftOpeningRequest.success){
            // showNotification( "Multikassa", "Кассовая смена открыта || Kassa smenasi ochildi");
            getZReportInfo();
        }else{
            showNotification( "Multikassa", "Ошибка открытия кассовой смены || Kassa smenasini ochishda xato");
        }
        console.log("shiftOpeningRequest",shiftOpeningRequest);
    };

    const onShiftClosing = async (e) => {
        e.preventDefault();

        const shiftClosingRequest = await sendRequestOperation(2);
        if(shiftClosingRequest.success){
            // showNotification( "Multikassa", "Кассовая смена закрыта || Kassa smenasi yopiq");
            getZReportInfo();
        }else{
            showNotification( "Multikassa", "Ошибка закрытия кассовой смены || Kassa smenasini yopishda xatolik yuz berdi");
        }
        console.log("shiftClosingRequest",shiftClosingRequest);
    };

    const onXReportGetting= async (e) => {
        e.preventDefault();

        const shiftXReportRequest = await sendRequestOperation(7);
        if(shiftXReportRequest.success){
            showNotification( "Multikassa", "X-отчет сформирован || X-hisobot yaratildi");
        }else{
            showNotification( "Multikassa", "Ошибка формирования X-отчета || X-hisobotni yaratish xatosi");
        }
        console.log("shiftOXReportRequest",shiftXReportRequest);
    };

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

            const raw = JSON.stringify({
                "module_operation_type": String(type),
                "receipt_gnk_time": getCurrentDateTime(),
                "receipt_cashier_name": `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`
            });

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
                    resolve(result)
                })
                .catch((error) => reject(error));
        })
    };

    const showNotification = ( title, message ) => {
        Poster.interface.showNotification({
            title: title ,
            message: message,
            icon: 'https://dev.joinposter.com/public/apps/multikassa-poster/icon.png',
        })
    }

    const showShiftTitle = () => {
        return(
            <div>
                Смена
                <div className="p-m-b-12"
                    style={{
                        display: "inline-block",
                        float: "right"}}>
                    <PosterUiKit.Bage 
                        key={isShiftOpen ? 'success' : 'danger'}
                        text={isShiftOpen ? 'Открыта' : 'Закрыта'}
                        type={isShiftOpen ? 'success' : 'danger'} />
                </div>
            </div>
        )
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


    console.log("isShiftOpen",isShiftOpen);

    console.log("shiftInfo",shiftInfo);

    if(cashbox) {
        return (
            <Content
                id="main"
            >
                <Card
                    className='left_card'
                    bordered={false}>
                    <Card
                        className='auth_info_card'
                        title="Авторизационные данные"
                        bordered={false}
                    >
                        <PosterUiKit.FormGroup label="Пользователь" vertical >
                            <input disabled readonly type="text" value=
                                { 
                                    cashbox.current_cashier ?  `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}` : "" 
                                } />
                        </PosterUiKit.FormGroup>

                        <PosterUiKit.FormGroup label="Профиль" vertical >
                            <input type="text" disabled readonly value={contragent.name} />
                        </PosterUiKit.FormGroup>
                        
                    </Card>

                    <Card
                        className='cashbox_info_card'
                        title="О кассе"
                        bordered={false}
                    >

                        <PosterUiKit.FormGroup label="Фискальный модуль" vertical >
                            <input type="text" disabled readonly value={cashbox.module_gnk_id} />
                        </PosterUiKit.FormGroup>

                        <PosterUiKit.FormGroup label="Серийный номер" vertical >
                            <input disabled readonly type="text" value={contragent.module_name} />
                        </PosterUiKit.FormGroup>
                    </Card>
        
                </Card>
    
                <Card
                    className='right_card'
                    title={(showShiftTitle())}
                    bordered={false}
                >
                    <div className="body"
                            style={{
                                display:"flex",
                                justifyContent:"center",
                                alignTtems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                    </div>
                    <div className="body shift-details">
                        {shiftInfo.result && isShiftOpen ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Text type="primary">Дата открытия:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong>{shiftInfo.result.OpenTime}</Text>
                                    </Col>

                                    <Col span={12}>
                                        <Text type="primary">Продаж:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong>{shiftInfo.result.TotalSaleCount}</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="primary">Наличные:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong> {shiftInfo.result.TotalSaleCash.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </Text>
                                    </Col>

                                    <Col span={12}>
                                        <Text type="primary">Безналичные:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong> {shiftInfo.result.TotalSaleCard.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </Text>
                                    </Col>
                                </Row>
                                <PosterUiKit.Button className="ib m-r-15 primary" onClick={onShiftClosing} style={{ marginTop: '16px'}}>
                                    Закрыть смену
                                </PosterUiKit.Button>
                            </>
                        ) : (
                            <>
                                <PosterUiKit.Button className="ib m-r-15 primary" onClick={onShiftOpening}>
                                    Открыть смену
                                </PosterUiKit.Button>
                            </>
                        )}
                    </div>

                </Card>
            </Content>
        );
    }else{
        return (
            <Content
                id="main"
            >
            </Content>
        );
    }
};

export default App;