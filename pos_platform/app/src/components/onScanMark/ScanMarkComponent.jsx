
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
            
        // console.log("prevProductsLabels", prevProductsLabels );

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
            alert("Что-то пошло не так");
        }
        // const updatedProducts = order.products.map((product) =>
        //     product.id === currentProduct.id
        //         ? { ...product, extras: { ...product.extras, code: scannedCode } }
        //         : product
        // );

        // setOrder({ ...order, products: updatedProducts });
        // setScannedCode(''); // Очистить поле ввода

        // // Переход к следующему продукту
        // const nextProductIndex =
        //     order.products.findIndex((p) => p.id === currentProduct.id) + 1;
        // if (nextProductIndex < order.products.length) {
        //     setCurrentProduct(order.products[nextProductIndex]);
        // } else {
        //     setCurrentProduct(null); // Все продукты обработаны
        // }

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

    const BarcodeIcon = (props) => (
        <svg
            {...props}
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2 4H4V20H2V4ZM6 4H8V20H6V4ZM10 4H12V20H10V4ZM14 4H16V20H14V4ZM18 4H20V20H18V4Z"
                fill="#B0B0B0"
            />
        </svg>
    );
    
    return (
        <div style={styles.container}>
            {isLoading ? (
                <Spin size="large" />
            ) : order.product ? (
                <>
                    <BarcodeIcon style={{ marginBottom: 20 }} />
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
        minHeight: '100vh',
        padding: 20,
        textAlign: 'center',
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
