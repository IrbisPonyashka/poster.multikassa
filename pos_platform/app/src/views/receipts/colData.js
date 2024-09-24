export default function getColumnsData() {

    const operationTypeMapping = {
        1: "Открытие смены",
        2: "Закрытие смены",
        3: "Продажа",
        4: "Возврат",
        7: "X отчет",
        8: "Авансовый чек",
        9: "Кредитный чек",
    };

    return [
        { 
            field: "receipt_id",
            headerName: "ID чека" ,
            hide: true, 
        },
        { 
            field: "receipt_gnk_receiptseq",
            headerName: "Номер чека" ,
            valueFormatter: params => String(params.value),
        },
        { 
            field: "module_operation_type",
            headerName: "Операция" ,
            valueFormatter: params => operationTypeMapping[params.value] || params.value,
        },
        {
            field: "receipt_cashier_name",
            headerName: "Кассир",
        },
        {
            field: "receipt_gnk_time",
            headerName: "Время",
        },
        {
            field: "module_operation_sum_card",
            headerName: "Оплата картой",
        },
        {
            field: "module_operation_sum_cash",
            headerName: "Оплата наличными",
        },
        {
            field: "module_gnk_terminalid",
            headerName: "S/N",
        },
    ];
}