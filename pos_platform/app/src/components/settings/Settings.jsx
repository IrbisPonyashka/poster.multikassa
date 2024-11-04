import { useState, useEffect } from 'react';

import { Layout, Card, Typography } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Content } = Layout;

import Swal from 'sweetalert2';

/**
 * В этом компоненте определяются необходимые данные для дальнейшей работы
 * Делается три необходим запроса (о смене, компании, )
 * @param {*} props 
 * @returns возвращается только необходимые данные для обёртки либо компонент для выбора типа кассы  
*/

const Settings = (props) => {
    
    const [cashbox_type, setCashboxType] = useState(props.cashbox_type);

    // Если выбран онлайн-ккм, то записываем значение
    const [pos_device_ip_adres, setDeviceIpAdres] = useState( (cashbox_type == "kkm" && Poster.settings.extras && Poster.settings.extras.posDeviceIpAdres) ? Poster.settings.extras.posDeviceIpAdres : "");

    const [pos_device_port, setDevicePort] = useState("9090");
    
    const [terminal_device_ip_adres, setTerminalIpAdres] = useState("");

    const [terminal_device_port, setTerminalPort] = useState("");
    
    useEffect(() => {  
    }, []);

    
    const onSaveTerminalInfo = (e) => {

        console.log("terminal_deviceInfo", localStorage);

    };

    const onSaveCashboxInfo = async (e) => {

        Swal.fire({
            title: 'Сохранение...',
            text: 'Пожалуйста, подождите.',
            onBeforeOpen: () => {
                Swal.showLoading(); // Показать индикатор загрузки
            }
        });

        let extas = { cashboxType:cashbox_type };

        pos_device_ip_adres ? extas["posDeviceIpAdres"] = pos_device_ip_adres : null ;
        pos_device_port ? extas["PosDevicePort"] = pos_device_port : null ;

        let setAppExtrasResponse = await setAppExtras(extas);

        console.log("setAppExtrasResponse", setAppExtrasResponse);

        // Закрыть модальное окно с индикатором загрузки
        Swal.close();
        let params = {};
            
        if(setAppExtrasResponse){
            props.updateCashboxType(cashbox_type);
            params.title = 'Успешно сохранено';
            params.icon = 'success';
        }else{
            params.title = 'Что-то пошло не так';
            params.icon = 'error';
            params.text = 'Попробуйте еще раз';
        }

        Swal.fire(params);
        
        console.log("onSaveCashboxInfo", cashbox_type);
    };

    const checkConnect = (e) => {
        var ip_adres = e.target.id == "kkm" ? pos_device_ip_adres : terminal_device_ip_adres;
        var port = e.target.id == "kkm" ? pos_device_port : terminal_device_port;
        
        console.log("checkConnect", ip_adres, port);

        if(!ip_adres){
            Swal.fire({
                title: 'Введите данные',
                icon: 'error'
            });
            return;
        }
        Swal.fire({
            title: 'Подключение...',
            text: 'Пожалуйста, подождите.',
            onBeforeOpen: () => {
                Swal.showLoading(); // Показать индикатор загрузки
            }
        });
        
        Poster.makeRequest(`http://${ip_adres}:${port}/api/v1/info`, {
            method: 'get',
            timeout: 10000,
            localRequest: true
        }, (answer) => {
            console.log("sendPayRequestResponse", answer);
            let params = {};
            
            // Закрыть модальное окно с индикатором загрузки
            Swal.close();

            if(answer.result != false && answer.result.status == "success"){
                params.title = 'Успешно подключено';
                params.icon = 'success';
            }else{
                params.title = 'Устройствно не найдено';
                params.icon = 'error';
                params.text = 'Введите корректные данные';
            }
            
            Swal.fire(params);
        });
    }

    const checkFiscalModule = async (e) => {
        
        Swal.fire({
            title: 'Поиск модуля...',
            text: 'Пожалуйста, подождите.',
            onBeforeOpen: () => {
                Swal.showLoading(); // Показать индикатор загрузки
            }
        });
        
        let getFiscalModuleInfoReq = await getFiscalModuleInfo();
        console.log("getFiscalModuleInfo", getFiscalModuleInfoReq);
        // Закрыть модальное окно с индикатором загрузки
        Swal.close();
        let params = {};

        if(getFiscalModuleInfoReq.success && getFiscalModuleInfoReq.data.result){
            params.title = 'Успешно подключено';
            params.icon = 'success';
        }else{
            params.title = 'Фискальный модуль не найден';
            params.icon = 'error';
            params.text = 'Подключите фискальный модуль для работы с виртуальной кассой';
        }

        
        Swal.fire(params);
    }

    const setAppExtras = async (extras) => {
        return new Promise((resolve, reject) => {
            Poster.makeApiRequest(`application.setEntityExtras`, {
                method: 'post',
                data: {
                    entity_type: "settings",
                    extras: extras
                }
            }, (data) => resolve(data) );
        })
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
                resolve(result);
            })
            .catch((error) => console.error(error));
        })
    }


    return(
        <Content id="settings" >
            {/* <Card
                className='left_card'
                bordered={false}> */}
            <div>
                
                <Card
                    className='auth_info_card'
                    title="Настройки кассы"
                    bordered={false}
                    style={{
                        "marginBottom": "2rem"
                    }}
                >
                    <PosterUiKit.FormGroup label="Выберите тип кассы" vertical >
                        <select 
                            name="" id="cashbox_type" 
                            onChange={ (e) => e.target.value != "none" ? setCashboxType(e.target.value) : null }
                            >
                            <option value="none" >Не выбрано</option>
                            <option value="vm" selected={cashbox_type=="vm" ? true : false} >Виртуальная касса</option>
                            <option value="kkm" selected={cashbox_type=="kkm" ? true : false}>Онлайн-ККМ</option>
                        </select>
                    </PosterUiKit.FormGroup>

                    {
                        cashbox_type && cashbox_type=="kkm" && 
                        <div>
                            <PosterUiKit.FormGroup label="IP-адрес" vertical>
                                <input type="text" id="ipAdress"
                                    placeholder="Введите IP-адрес устройства"
                                    onChange={(e) => setDeviceIpAdres(e.target.value)}
                                    value={ pos_device_ip_adres }
                                    />
                            </PosterUiKit.FormGroup>
                            <PosterUiKit.FormGroup label="Порт" vertical>
                                <input type="text" id="port"
                                    placeholder="Введите порт устройства"
                                    onChange={(e) => setDevicePort(e.target.value)}
                                    value={ pos_device_port }
                                    />
                            </PosterUiKit.FormGroup>
                        </div>
                    }
                    
                    {
                        cashbox_type && cashbox_type!="none" &&
                        <div>
                            <PosterUiKit.Button 
                                disabled= { 
                                    (cashbox_type == "kkm" && (pos_device_ip_adres.length >= 7 && pos_device_ip_adres.length <= 15))
                                    || cashbox_type == "vm"
                                    ? false : true }
                                style={{
                                    marginRight: "1rem"
                                }}
                                className="ib m-r-15 primary" type="submit" onClick={onSaveCashboxInfo}>
                                Сохранить
                            </PosterUiKit.Button>
                            <PosterUiKit.Button className="ib m-r-15 succsess" type="submit" id="kkm" onClick={ cashbox_type == "kkm" ? checkConnect : checkFiscalModule}>
                                Проверить подключение
                            </PosterUiKit.Button>
                        </div>
                    }
                </Card>

                { cashbox_type && cashbox_type == "vm" && <Card
                        className='terminal_device_info_card'
                        title="Подключение терминала"
                        bordered={false}
                    >
                    <PosterUiKit.FormGroup label="IP-адрес" vertical>
                        <input type="text" id="port"
                            placeholder="Введите IP-адрес платежного терминала"
                            onChange={(e) => setTerminalIpAdres(e.target.value)}
                            value={ terminal_device_ip_adres }
                            />
                    </PosterUiKit.FormGroup>
                    <PosterUiKit.FormGroup label="Порт" vertical>
                        <input type="text" id="port"
                            placeholder="Введите порт платежного терминала"
                            onChange={(e) => setTerminalPort(e.target.value)}
                            value={ terminal_device_port }
                            />
                    </PosterUiKit.FormGroup>
                    {
                        cashbox_type && cashbox_type!="none" &&
                        <div>
                            <PosterUiKit.Button 
                                disabled= { 
                                    terminal_device_ip_adres.length >= 7 && terminal_device_ip_adres.length <= 15
                                    ? false : true }
                                style={{
                                    marginRight: "1rem"
                                }}
                                className="ib m-r-15 primary" type="submit" onClick={onSaveTerminalInfo}>
                                Сохранить
                            </PosterUiKit.Button>
                            <PosterUiKit.Button className="ib m-r-15 succsess" type="submit" id="terminal" onClick={checkConnect}>
                                Проверить подключение
                            </PosterUiKit.Button>
                        </div>
                    }
                </Card> }

            </div>
            {/* </Card> */}

        </Content>
    );

};

export default Settings;
