import 'polyfill-object.fromentries';

import "antd/dist/antd.css";

import "sweetalert2/dist/sweetalert2.min.css";

import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';

import ReactDOM from 'react-dom'; 

import Home from './views/home/app';

// Главный компонент, здесь определяется, какой тип кассы используется
const App = () => {

    const [cashbox_type, setCashboxType] = useState("none");

    const updateCashboxType = (newData) => {
        setCashboxType(newData);
    };

    useEffect( () => {  
        
        getModuleSettings();

        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa'
        });

        // Poster.on('applicationIconClicked', async (data) => {
        //     console.log("applicationIconClicked", data);

        //     var title = 'Multikassa',
        //         width = window.outerWidth - (window.outerWidth * 0.1),
        //         height = window.outerHeight - (window.outerHeight * 0.2);

        //     switch (data.place) {
        //         case "functions":
        //             title = 'Multikassa';
        //         break;
        //     }

        //     Poster.interface.popup({ width: width, height: height, title: title  });
        // });
        
    }, []);

    // Здесь мы достаем информацию по которой мы определяем, как используется приложение ( VM или KKM )
    const getModuleSettings = async () => {
        const appSettings = Poster.settings;
        
        if(appSettings.extras && appSettings.extras.cashboxType != ""){
            setCashboxType(appSettings.extras.cashboxType);
        }else{
            setCashboxType("none");
        }

    };

    console.log("cashbox_type", cashbox_type);

    return (
        <div
            style={{
                background: "rgb(245 245 245)",
                minHeight: "100%",
                borderRadius: "8px"
            }}
        >
            <Home cashbox_type={cashbox_type} updateCashboxType={updateCashboxType} />
        </div>
    )

};

ReactDOM.render(<App />, document.getElementById('app-container'));