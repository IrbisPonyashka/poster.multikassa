
import React, { useState, useEffect } from 'react';

import { Layout, Card } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Content } = Layout;

const App = () => {
    const [cashbox, setCahbox] = useState([]);
    const [contragent, setContragent] = useState([]);

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

    useEffect( () => {
        getCahboxInfo();
        getContragentInfo();
    }, []);

    console.log("contragent",contragent);
    console.log("cashbox",cashbox);
    if(cashbox) {
        return (
            <Content
                id="main"
            >
                <Card
                    title="Касса"
                    bordered={false}
                >

                    <PosterUiKit.FormGroup label="Фискальный модуль" vertical >
                        <input type="text" disabled readonly value={cashbox.module_gnk_id} />
                    </PosterUiKit.FormGroup>

                    <PosterUiKit.FormGroup label="Серийный номер" vertical >
                        <input disabled readonly type="text" value={contragent.module_name} />
                    </PosterUiKit.FormGroup>

                    <PosterUiKit.FormGroup label="Кассир" vertical >
                        <input disabled readonly type="text" value=
                            { 
                                cashbox.current_cashier ?  ` ${cashbox.current_cashier.user_last_name} ${cashbox.current_cashier.user_first_name} ${cashbox.current_cashier.user_middle_name}` : "" 
                            } />
                    </PosterUiKit.FormGroup>

                    <PosterUiKit.FormGroup disabled readonly label="Контрагент" vertical >
                        <input type="text" value={contragent.name} />
                    </PosterUiKit.FormGroup>
                    
                </Card>
    
                <Card
                    title="Операции"
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
                        <PosterUiKit.Button className="ib m-r-15 primary" >
                            Открытие смены
                        </PosterUiKit.Button>
                        <PosterUiKit.Button className="ib m-r-15 primary" >
                            Закрытие смены
                        </PosterUiKit.Button>
                        <PosterUiKit.Button className="ib m-r-15 primary" >
                            X Отчет
                        </PosterUiKit.Button>
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