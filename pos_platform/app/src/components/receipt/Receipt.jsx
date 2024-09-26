import React, { useState, useEffect } from 'react';

import { Layout, Modal } from 'antd';

const { Content } = Layout;

export default function Receipt(props) {   
    
    useEffect( () => {
    }, []);
    const  receipt = props.receipt,
        cashbox = props.cashbox,
        contragent = props.contragent;

    const operationTypeMapping = {
        1: "Открытие смены",
        2: "Закрытие смены",
        3: "Продажа",
        4: "Возврат",
        7: "X отчет",
        8: "Авансовый чек",
        9: "Кредитный чек",
    };
    
    // const [totalRows, setTotalRows] = useState(0);

    // const [selectedRow, setSelectedRow] = useState(null);

    const returnReceiptBody = (type) => {
        switch (type) {
            case 1: // Открытие смены
                break;
            case 2: // Закрытие смены
                break;
            case 3: // Продажа
                return(
                    <div >
                        <p><strong>#cola</strong></p>
                        <p>Количество: 2</p>
                        <p>Цена: 123123123</p>
                        <p>НДС: 12</p>
                        <hr />
                    </div>
                )
            default:
                break;
        }
    }

    const returnReceiptDetail = () => {
        console.log("receipt",receipt);
        console.log("cashbox",cashbox);
        console.log("contragent",contragent);

        return (
            <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                {/* header */}
                <h4>{operationTypeMapping[receipt.module_operation_type]}</h4>
                <h4>{receipt.receipt_cashier_name}</h4>
                <h4>{contragent.tradepoint_address}</h4>
                <p>Дата и время: {receipt.receipt_gnk_time}</p>
                <p>ИНН: {contragent.tin_or_pinfl}</p>
                <hr />
                {/* header end*/}

                {/* body */}
                {returnReceiptBody(receipt.module_operation_type)}
                {/* body end */}

                <p>Итого к оплате: {receipt.total_all_sum}</p>
                <p>Оплачено {receipt.receipt_sum}</p>
                <p>Наличные {receipt.receipt_gnk_receivedcash}</p>
                <p>Терминал {receipt.receipt_gnk_receivedcard}</p>
                <p>Сдача {receipt.total_refund_cash}</p>
                <p>Итого сумма НДС {receipt.total_sale_vat}</p>
                <p>Сумма скидки {receipt.total_refund_cash}</p>
                <hr />

                <p>ФМ № {receipt.module_gnk_id}</p>
                <p>Чек № {receipt.receipt_gnk_receiptseq}</p>
                <p>S/N {receipt.module_name}</p>

            </div>
        );
    };

    return (
        <div> 
            {receipt && returnReceiptDetail} 
        </div>
    );  
}
