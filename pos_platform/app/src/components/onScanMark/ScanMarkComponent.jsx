
import React, { useState, useEffect } from 'react';

import { Input, Button, Typography, Spin } from 'antd';

import PosterUiKit from 'poster-ui-kit';

const { Text } = Typography;

export default function ScanMarkComponent(props) {

    const [scannedCode, setScannedCode] = useState('');
    const [order, setOrder] = useState(false);
    const [markedProducts, setMarkedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        console.log("order.product", props.orderData);
        if(props.orderData.product) {
            Poster.products.getFullName({
                id: props.orderData.product.id
            }).then((prodName) => {
                props.orderData.product.name = prodName.name; 
                setOrder(props.orderData);
            })
        }
        
        // Poster.interface.scanBarcode()
        //     .then(function (barcode) {
        //         console.log('barcode', barcode);
        //     })

    }, [props.orderData]);

    const handleScanInput = (e) => {
        setScannedCode(e.target.value);
    };

    // Сохранение кода маркировки в поле extras
    const saveScannedCode = async () => {
        if (!scannedCode.trim()) return;

        setIsLoading(true);
        var order_product_id = order.product.id;
        var prevProductsLabels = order.order.extras && order.order.extras.productsLabels && JSON.parse(order.order.extras.productsLabels)[order_product_id] 
            ? [...JSON.parse(order.order.extras.productsLabels)[order_product_id], scannedCode]
            : [scannedCode]; 

        var setProductLabels = await Poster.orders.setExtras(
            String(order.order.id),
            "productsLabels",
            JSON.stringify( { [order_product_id] : prevProductsLabels } )
        );

        console.log("setProductLabels", setProductLabels);
        if(setProductLabels.success){
            setScannedCode("");
            Poster.interface.closePopup();
        }else{
            alert("Код не сохранился попробуйте заново");
        }

        setIsLoading(false);
    };

    const getProductById = async (id) => {
        return new Promise((resolve, reject) => {
            Poster.makeApiRequest(`menu.getProduct?product_id=${id}`, {
                method: 'get',
            }, (product) => product ? resolve(product) : reject(product));
        })
    }
    
    const getProductNameById = async (id) => {
        return new Promise((resolve, reject) => {
            Poster.products.getFullName({
                id: id
            }).then((product) => {
                resolve(product.name);
            })
        })
    }

    return (
        <div style={styles.container}>
            {isLoading ? (
                <Spin size="large" />
            ) : order.product ? (
                <>
                    <img src="https://micros.uz/it/solutions_our/poster.multikassa/pos_platform/app/src/assets/img/scan.svg" alt="Сканирование маркировки" />
                    <Text style={styles.text}>
                        Отсканируйте марку товара{' '}
                        <strong>{ order.product.name }</strong>, чтобы
                        добавить его в чек.
                    </Text>
                    <Input
                        placeholder="Сканировать код"
                        value={scannedCode}
                        onChange={handleScanInput}
                        onPressEnter={saveScannedCode}
                        style={styles.input}
                        autoFocus
                    />
                    <Button
                        type="primary"
                        onClick={saveScannedCode}
                        style={styles.button}
                    >
                        Сохранить код
                    </Button>
                </>
            ) : (
                <Text style={styles.text}>Все продукты отсканированы!</Text>
            )}
        </div>
    );
    
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        textAlign: 'center',
        height: '100%'
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
    },
    input: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        maxWidth: 200,
    },
};
