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
        
        switch (Number(type)) {
            case 1: // Открытие смены
                break;
            case 2: // Закрытие смены
                return(
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Продажа </p>
                            <p> {receipt.sale_count} </p>
                            <p> {(receipt.module_operation_sum_sales ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Наличные </p>
                            <p> {(receipt.module_operation_sum_cash ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Безналичные </p>
                            <p> {(receipt.module_operation_sum_card ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <hr />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Возврат </p>
                            <p> {receipt.refund_count} </p>
                            <p> {(receipt.refund_count).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Наличные </p>
                            <p> {(receipt.refund_count * (receipt.total_refund_cash ?? 0)).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Безналичные </p>
                            <p> {(receipt.refund_count * (receipt.total_refund_card ?? 0)).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <hr />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Выручка </p>
                            <p> {receipt.sale_count} </p>
                            <p> {receipt.proceeds.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Наличные </p>
                            <p> {receipt.proceeds_cash.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Безналичные </p>
                            <p> {receipt.proceeds_card.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <hr />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> НДС </p>
                            <p> { receipt.vat.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p> Возвращено НДС </p>
                            <p> { receipt.vat_ret.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>
                        <hr />
                    </div>
                )
            case 3: 
                const items = JSON.parse(receipt.items);
                return items.map((item, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <p style={{textAlign: 'start'}}>
                            <strong>#{item.product_name}</strong>
                        </p>

                        {/* Количество, цена за единицу и итоговая сумма */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>{item.count} {item.product_package_name ?? ""} x { (item.product_price).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                            <p>{(item.count * item.product_price).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</p>
                        </div>
                        

                        {/* НДС */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>НДС: {item.VATPercent}%</p>
                            <p>{((item.count * item.product_price) * (item.VATPercent / 100)).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
                        </div>

                        {/* Штрих-код и ИКПУ */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Штрих-код</p>
                            <p>{item.product_barcode}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>ИКПУ</p>
                            <p>{item.classifier_class_code}</p>
                        </div>

                        <hr />
                    </div>
                ));
            break;
        }
    }

    const returnReceiptFooter = (type) => {
        
        switch (Number(type)) {
            case 1: // Открытие смены
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Итого к оплате</p>
                            <p>{receipt.receipt_sum}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Оплачено</p>
                            <p>{receipt.total_all_sum}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Наличные</p>
                            <p>{receipt.receipt_gnk_receivedcash}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Терминал</p>
                            <p>{receipt.receipt_gnk_receivedcard}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Итого сумма НДС</p>
                            <p>{receipt.total_sale_vat}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Сумма скидки</p>
                            <p>{receipt.total_refund_cash}</p>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>ФМ №</p>
                            <p>{receipt.module_gnk_id}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>S/N</p>
                            <p> {receipt.module_name}</p>
                        </div>
                    </div>
                );
            case 2: // Закрытие смены
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>ФМ №</p>
                            <p>{receipt.module_gnk_id}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>S/N</p>
                            <p> {receipt.module_name}</p>
                        </div>
                    </div>
                );
                break;
            case 3: 
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Итого к оплате</p>
                            <p>{receipt.receipt_sum ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Оплачено</p>
                            <p>{receipt.total_all_sum ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Наличные</p>
                            <p>{receipt.receipt_gnk_receivedcash ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Терминал</p>
                            <p>{receipt.receipt_gnk_receivedcard ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Сдача</p>
                            <p>{receipt.total_refund_cash ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Итого сумма НДС</p>
                            <p>{receipt.total_sale_vat ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Сумма скидки</p>
                            <p>{receipt.total_refund_cash ?? 0}</p>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>ФМ №</p>
                            <p>{receipt.module_gnk_id}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>ФП</p>
                            <p> {receipt.receipt_gnk_fiscalsign}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>S/N</p>
                            <p> {contragent.module_name}</p>
                        </div>
                    </div>
                );
        }
    }

    const returnReceiptDetail = () => {
        console.log("receipt",receipt);
        console.log("cashbox",cashbox);
        console.log("contragent",contragent);

        return (
            <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                {/* header */}
                <h6>{operationTypeMapping[receipt.module_operation_type]}</h6>
                <h6>{receipt.receipt_cashier_name}</h6>
                <h6>{contragent.tradepoint_address}</h6>
                <p>Дата и время: {receipt.receipt_gnk_time}</p>
                <p>ИНН: {contragent.tin_or_pinfl}</p>
                <hr />
                {/* header end*/}

                {/* body */}
                {returnReceiptBody(receipt.module_operation_type)}
                {/* body end */}
                
                {/* body */}
                {returnReceiptFooter(receipt.module_operation_type)}
                {/* body end */}

            </div>
        );
    };

    return (
        <div> 
            {receipt && returnReceiptDetail()} 
        </div>
    );  
}
