
import { Link } from 'react-router-dom';

import { Menu } from 'antd';

const Header = (props) => {

    const items = [
        { label: <Link to="/"> Главная </Link>, key: 'main' },
        { label: <Link to="/receipts"> Чеки </Link>, key: 'receipts' },
    ];

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Menu  theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items} />
        </Header>
    );
};

export default Header;