export default function getColumnsData() {

    return [
        { 
            field: "receipt_id",
            headerName: "ID чека" ,
        },
        { 
            field: "receipt_gnk_receiptseq",
            headerName: "Номер чека" ,
        },
        { 
            field: "module_operation_type",
            headerName: "Операция" ,
        },
        {
            field: "receipt_cashier_name",
            headerName: "Кассир",
        },
        {
            field: "receipt_gnk_datetime",
            headerName: "Время",
        },
        {
            field: "payment_type",
            headerName: "Тип оплаты",
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