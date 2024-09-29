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
            headerName: "№" ,
            valueFormatter: params => Number(params.value),
            minWidth: 60,
            maxWidth: 70,
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
            field: "receipt_sum",
            headerName: "Сумма",
            valueFormatter: params => (params.value ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            // valueFormatter: params => String(params.value ?? 0),
        },
        {
            field: "receipt_gnk_receivedcard",
            headerName: "Оплата картой",
            valueFormatter: params => (params.value ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        {
            field: "receipt_gnk_receivedcash",
            headerName: "Оплата наличными",
            valueFormatter: params => (params.value ?? 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        // {
        //     headerName: "Из которых", // общий заголовок
        //     children: [
        //         {
        //             field: "receipt_gnk_receivedcash",
        //             headerName: "Наличными",
        //             minWidth: 100,
        //         },
        //         {
        //             field: "receipt_gnk_receivedcard",
        //             headerName: "Безналичными",
        //             minWidth: 100,
        //         },
        //     ]
        // },
        {
            field: "module_gnk_id",
            headerName: "S/N",
        },
    ];
}