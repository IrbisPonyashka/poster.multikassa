
import { Link, useLocation  } from 'react-router-dom';

import { Layout, Menu, theme } from 'antd';

const { Header } = Layout;

const Navbar = (props) => {
    const { pathname } = useLocation(); // Получаем текущий путь
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        { label: <Link to="/"> Главная </Link>, key: '/' },
        { label: <Link to="/receipts"> Чеки </Link>, key: '/receipts' },
    ];

    return (
        <Layout id="header">
            <Header 
                style={{
                display: 'flex',
                alignItems: 'center',
                }}
            >
                <ul>
                    <Link to="/"> Главная </Link>
                    <Link to="/receipts"> Чеки </Link>
                </ul>
                {/* <Menu 
                    mode="horizontal"
                    theme="dark"
                    selectedKeys={[pathname]} // Завязываем на текущий путь
                    items={items}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: "1140px",
                      width: "100%",
                      margin: "0 auto",
                    }}
                    
                /> */}
            </Header>
        </Layout>
    );
};

export default Navbar;