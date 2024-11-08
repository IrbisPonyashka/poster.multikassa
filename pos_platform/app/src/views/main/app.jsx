
import React, { useState, useEffect } from 'react';

import { Layout, Card, Typography, Row, Col } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Text } = Typography;

const { Content } = Layout;

const App = ( { fiscal_module, cashbox_type, cashbox, contragent, shiftInfo, isShiftOpen}) => {
    
    useEffect( () => {  
        
        // getZReportInfo();
        
    }, []);

    Poster.on('shiftOpen', async (data) => {
        console.log("shiftOpen", data);
        await sendRequestOperation(1);
    });

    Poster.on('shiftClose', async (data) => {
        console.log("shiftClose", data);
        await sendRequestOperation(2);
    });
    
    const getZReportInfo = async () => {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
              
            let uri_ip = cashbox_type == "vm" ? "localhost:8080" : `${Poster.settings.extras.posDeviceIpAdres}:9090`;
            fetch(`http://${uri_ip}/api/v1/zReport`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                resolve(result);
                if(result.success){
                    // setShiftInfo(result.data);

                    console.log("getZReportInfo",result);
                    // if( result.data.result.OpenTime && result.data.result.OpenTime != null){
                    //     // setIsShiftOpen(true);
                    // }else{
                    //     // setIsShiftOpen(false)
                    // }
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
            // getZReportInfo();
            location.reload();
        }else{
            showNotification( "Multikassa", "Ошибка открытия кассовой смены || Kassa smenasini ochishda xato");
        }
        console.log("shiftOpeningRequest",shiftOpeningRequest);
    };

    const onShiftClosing = async (e) => {
        e.preventDefault();
        
        // Если терминал подключен 
        if(
            Poster.settings.extras &&
            Poster.settings.extras.cashboxType &&
            Poster.settings.extras.cashboxType == "vm" &&
            Poster.settings.extras.terminalDeviceIpAdres &&
            Poster.settings.extras.terminalDevicePort
        ){
            let terminalReconciliationResponse = await terminalReconciliationRequest();
            if(!terminalReconciliationResponse){
                showNotification( "Multikassa", "Ошибка при сверке итогов || Jami qiymatlarni solishtirishda xatolik yuz berdi");
                return false;
            }
        }

        const shiftClosingRequest = await sendRequestOperation(2);
        if(shiftClosingRequest.success){
            // getZReportInfo();
            location.reload();
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
            console.log("sendRequestOperation -> cashbox", cashbox);

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
                console.log("sendRequestOperation", answer);
                if(answer.result && answer.result.success){
                    resolve(answer.result);
                }else{
                    resolve(false);
                }
            });
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
                <div className=""
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

    const returnUndefinedComponent = () => {
        return (
            <Card
                style={{
                    width: "100%"
                }}
                title={cashbox_type == "vm" ? "Фискальный модуль не найден или касса не настроена" : "Не удалось подключиться к устройству"}
                bordered={false}
            >
            </Card>
        )
    }
    
    const terminalReconciliationRequest = () => {
        return new Promise((resolve, reject) => {
            Poster.makeRequest(`http://${Poster.settings.extras.terminalDeviceIpAdres}:${Poster.settings.extras.terminalDevicePort}/reconciliation`, {
                method: 'post',
                localRequest: true
            }, (answer) => {
                console.log("Сверка итогов => ", answer);
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
    };

    console.log("cashbox", cashbox);
    console.log("contragent", contragent);
    console.log("fiscal_module", fiscal_module);
    if(fiscal_module && fiscal_module.result && cashbox && cashbox.current_cashier) {
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
                                    typeof cashbox.current_cashier === "object" ?
                                        `${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}`
                                        : cashbox.current_cashier
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
                            <input type="text" disabled readonly value={contragent.module_terminalid} />
                        </PosterUiKit.FormGroup>

                        <PosterUiKit.FormGroup label="Серийный номер" vertical >
                            <input disabled readonly type="text" value={contragent.module_gnk_id} />
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
                        {(shiftInfo.OpenTime || shiftInfo.openTime) && isShiftOpen ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Text type="primary">Дата открытия:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong>{shiftInfo.OpenTime ?? shiftInfo.openTime}</Text>
                                    </Col>

                                    <Col span={12}>
                                        <Text type="primary">Продаж:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong>{shiftInfo.TotalSaleCount ?? shiftInfo.totalSaleCount}</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="primary">Наличные:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong> {(shiftInfo.TotalSaleCash ?? shiftInfo.totalSaleCash).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </Text>
                                    </Col>

                                    <Col span={12}>
                                        <Text type="primary">Безналичные:</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong> {(shiftInfo.TotalSaleCard ?? shiftInfo.totalSaleCard).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </Text>
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
                {returnUndefinedComponent()}
            </Content>
        );
    }
};

export default App;