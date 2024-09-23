import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const Header = (props) => {
    console.log(Poster);
    
    const items = [
        { label: <Link to="/">Главная</Link>, key: 'main' },
        { label: <Link to="/receipts">Чеки</Link>, key: 'receipts' },
    ];

    return (
        <Menu mode="horizontal" items={items} />
    );

};

export default Header;
