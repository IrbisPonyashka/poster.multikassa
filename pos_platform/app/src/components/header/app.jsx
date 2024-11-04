import { useState, useEffect } from 'react';

import { Link, useLocation, useNavigate  } from 'react-router-dom';

import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Navbar = (props) => {

    const cashbox_type = props.cashbox_type;
    const { pathname } = useLocation(); // Получаем текущий путь
    const navigate = useNavigate(); // Для программного редиректа
    
    useEffect( () => { 

        console.log("cashbox_type Navbar", cashbox_type);
        console.log("cashbox_type pathname", pathname);
        // if (cashbox_type == 'none' && pathname !== '/settings') {
        //     navigate('/settings');
        // }else if(cashbox_type != 'none' && pathname !== '/'){
        //     navigate('/');
        // }

    }, [cashbox_type, pathname, navigate]);

    const isDisabled = cashbox_type === 'none';

    const items = [
        { label: <Link to="/"> Главная </Link>, key: '/', disabled: isDisabled },
        { label: <Link to="/settings"> Настройки </Link>, key: '/settings' },
    ];
    cashbox_type === 'vm' ? 
        items.splice( items.length - 1, 0, { label: <Link to="/receipts"> Чеки </Link>, key: '/receipts', disabled: isDisabled } )
        : null;

    return (
        <Layout id="header">
            <Header 
                style={{
                display: 'flex',
                alignItems: 'center',
                }}
            >
                <Menu 
                    mode="horizontal"
                    theme="dark"
                    items={items}
                    selectedKeys={[pathname]} // Завязываем на текущий путь
                    style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: "1140px",
                        width: "100%",
                        margin: "0 auto",
                    }}
                    
                />
            </Header>
        </Layout>
    );
};

export default Navbar;