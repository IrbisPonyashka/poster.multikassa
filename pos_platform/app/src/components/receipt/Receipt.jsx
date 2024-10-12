import React, { useState, useEffect } from 'react';

import { Modal } from 'antd';

import PosterUiKit from 'poster-ui-kit';

export default function Receipt(props) {   
    
    const  receipt = props.receipt,
        cashbox = props.cashbox,
        contragent = props.contragent,
        cashboxOperationRequest = props.cashboxOperationRequest;

    const [items, setItems] = useState(receipt?.items ? JSON.parse(receipt.items) : []);
    console.log("items", items);

    const [selectedItems, setSelectedItems] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [refundItems, setRefundItems] = useState([]);

    const [payType, setPayType] = useState("card");
    
    // Обрабатываем изменения receipt.items при каждом обновлении пропсов
    useEffect(() => {
        console.log("receipt.items", receipt.items);
        if (receipt.items) {
            var items = JSON.parse(receipt.items);
            setItems(items);
            setRefundItems(items.map(item => ({
                ...item, 
                count: item.count,        // Текущий счетчик
                maxCount: item.count      // Максимальное количество (изначальное)
            })));
        }
    }, [receipt.items]);

    const handleReturnClick = () => {
        setIsModalOpen(true);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleItemChange = (itemId, count) => {
        setSelectedItems(prevState => ({
            ...prevState,
            [itemId]: count,
        }));
    };

    const handleSubmitReturn = () => {
        var refundReceiptObj = {
            "module_operation_type": "4",
            "receipt_cashier_name": receipt.receipt_cashier_name,
            "receipt_gnk_time": getCurrentDateTime(),
            "receipt_sum": 2800000,
            "receipt_gnk_receivedcash": 5000000,
            "receipt_gnk_receivedcard": 0,
            "RefundInfo":{
                "TerminalID": receipt.receipt_gnk_terminalid,
                "ReceiptSeq": receipt.receipt_gnk_receiptseq, 
                "DateTime": receipt.receipt_gnk_datetime,
                "FiscalSign": receipt.receipt_gnk_fiscalsign
            },
            "items": refundItems,
            "location": {
                "latitude": 41.29671408606234,
                "longitude": 69.21787478269367
            }
        };

        
        console.log(refundReceiptObj);
    };

    const operationTypeMapping = {
        1: "Открытие смены",
        2: "Закрытие смены",
        3: "Продажа",
        4: "Возврат",
        7: "X отчет",
        8: "Авансовый чек",
        9: "Кредитный чек",
    };
    
    const returnReceiptBtns = (type) => {
        return(
            <div style={{
                    display : "flex",
                    justifyContent: "center",
                    gap: "3rem",
                    background: "#f5f5f5",
                    position: "fixed",
                    bottom: "0px",
                    left: "0",
                    width: "100%",
                    zIndex: "999",
                    padding: "1rem",
                    boxShadow: "0px -1px 10px 5px #0000000f"
                }}>
            
                {type != "3" ? (
                    <PosterUiKit.Button className="ib m-r-15 warning" onClick={() => alert('Regular button clicked')}>
                        Напечатать дулбикат
                    </PosterUiKit.Button>
                ) : (
                    <>
                        <PosterUiKit.Button className="ib m-r-15 warning" onClick={handleReturnClick}>
                            Возврат
                        </PosterUiKit.Button>
                        <PosterUiKit.Button onClick={() => alert('Regular button clicked')}>
                            Напечатать дулбикат
                        </PosterUiKit.Button>
                    </>
                )}
            </div>
        );
    }

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
            case 4: 
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
                            <p>{(item.vat).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } </p>
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
            case 4: 
            case 3: 
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Итого к оплате</p>
                            <p>{receipt.receipt_sum ?? 0}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Оплачено</p>
                            <p>{receipt.total_sum ?? 0}</p>
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

        if(receipt && receipt.module_operation_type){
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
                    
                    {/* footer */}
                    {returnReceiptFooter(receipt.module_operation_type)}
                    {/* footer end */}

                    {/* bottom actions */}
                    {returnReceiptBtns(receipt.module_operation_type)}
                    {/* bottom actions end */}

                </div>
            );
        }else{
            
            return (
                <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                    <h6>Чек не найден</h6>
                </div>
            );
        }
    };

    const handleCountChange = (itemId, change) => {
        setRefundItems(prevItems =>
            prevItems.map(item =>{
                if (item.receipt_item_id === itemId) {
                    const newCount = item.count + change;
                    if (newCount >= 0 && newCount <= item.maxCount) {
                        return { 
                            "classifier_class_code":        item.classifier_class_code ?? "",
                            "product_mark":                 item.product_mark ?? "",
                            "product_name":                 item.product_name,
                            "product_label":                item.product_label ?? "",
                            "product_barcode":              item.product_barcode ?? "",
                            "product_price":                item.product_price,
                            "product_without_vat":          item.product_without_vat ?? "",
                            "product_discount":             item.product_discount,
                            "count":                        newCount,
                            "product_vat_percent":          item.product_vat_percent,
                            "other":                        item.other ?? ""
                        };
                    }
                }
                return item;
            })
        );
    };

    const getItemsTotalPriceSum = () => {
        let totalSum = 0;

        refundItems?.map(item => totalSum += (item.count * item.product_price))
    
        return Number(totalSum);
    };

    const getItemsTotalCount = () => {
        let totalCount = 0;

        refundItems?.map(item => totalCount += item.count)
    
        return Number(totalCount);
    };

    const getRefundBtnStatus = () => {
        let totalCount = 0;
        refundItems?.map(item => totalCount += item.count)
    
        return totalCount === 0 ? true : false;
    };

    const renderReturnSelectWindow = () => {
        console.log("refundItems",refundItems);
        if(refundItems) {            
            return (
                <Modal
                    visible={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={540}
                    centered={true}
                    style={{
                      bottom: 20,
                    }}
                >
                    <table>
                        {refundItems.map(item => (
                            <tr key={item.receipt_item_id} >
                                {/* <PosterUiKit.FormGroup label={item.product_name} vertical ></PosterUiKit.FormGroup> */}
                                <tr label={item.product_name} vertical 
                                    style={{
                                        display: "flex",
                                        alignTtems: "center",
                                        justifyContent: "start",
                                        marginBottom: '10px',
                                        gap: "1rem"
                                    }}>
                                    <td>
                                        <strong>
                                            {item.product_name}
                                        </strong>
                                    </td>
                                    <td>
                                        {(item.count * item.product_price).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} сум
                                    </td>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button onClick={() => {
                                            console.log("onRemoveItem", item);
                                            handleCountChange(item.receipt_item_id, -1)
                                        }} >
                                            -
                                        </button>
                                        <span>{item.count}</span>
                                        <button onClick={() => {
                                            console.log("onAddItem", item);
                                            handleCountChange(item.receipt_item_id, +1);
                                        }} >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            </tr>
                        ))}

                        <tr 
                            style={{
                                display:"flex",
                                justifyContent:"start",
                                marginBottom: '1rem',
                                gap: "1rem"
                            }}
                        >
                            <td>
                                <strong>Количество продуктов : </strong>
                            </td>
                            <td>
                            </td>
                            <td>
                                <span>
                                    { getItemsTotalCount().toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                                </span>
                            </td>
                        </tr>
                        <tr 
                            style={{
                                display:"flex",
                                justifyContent:"start",
                                marginBottom: '1rem',
                                gap: "1rem"
                            }}
                        >
                            <td>
                                <strong>Сумма возврата : </strong>
                            </td>
                            <td>
                            </td>
                            <td>
                                <span>
                                    { getItemsTotalPriceSum().toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                                </span>
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <PosterUiKit.SegmentRadio
                                value={payType}
                                onChange={(e) => {
                                    console.log(e);
                                }}
                                segments={[
                                    { title: 'Наличные', name: 'card', value: 'card' },
                                    { title: 'Карта', name: 'cash', value: 'cash' },
                                ]}
                            />
                        </tr>

                        <PosterUiKit.Button className="ib m-r-15 warning" style={{marginTop: "1rem"}} disabled={ getRefundBtnStatus() } onClick={handleSubmitReturn}>
                            Возврат
                        </PosterUiKit.Button>

                    </table>
                </Modal>
            );
        }else{
            return (
                <h1>undefined</h1>
            );
        }
    };
    
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


    return (
        <div
            style={{
                marginBottom: "4rem"
            }}> 
            { receipt && returnReceiptDetail() }
            { refundItems && renderReturnSelectWindow() } 
        </div>
    );  
}
