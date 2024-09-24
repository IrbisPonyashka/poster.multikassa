
import { Link } from 'react-router-dom';

import { Layout, Menu, theme } from 'antd';

const { Header } = Layout;

const Navbar = (props) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        { label: <Link to="/"> Главная </Link>, key: 'main' },
        { label: <Link to="/receipts"> Чеки </Link>, key: 'receipts' },
    ];

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
                    defaultSelectedKeys={['2']}
                    items={items}
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