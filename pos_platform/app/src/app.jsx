// import './assets/css/basic-bootstrap.scss';
import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';

// Импортируем ваши компоненты страниц
import Header from './components/header/app';
import Main from './views/main/app';
import Receipts from './views/receipts/app';

const App = () => {
    // const navigate = useNavigate(); // Хук для навигации

    // const [emoji, setEmoji] = useState('😃');
    // const [message, setMessage] = useState('Welcome!');

    // Эффект, который выполняется при монтировании компонента
    useEffect(() => {
        Poster.interface.showApplicationIconAt({
            functions: 'Multikassa',
            // order: 'Кнопка платформы',
            // payment: 'My Button',
        });

        Poster.on('applicationIconClicked', (data) => {
            Poster.interface.popup({ width: window.outerWidth - (window.outerWidth * 0.1), height: window.outerHeight - (window.outerHeight * 0.2), title: 'Multikassa' });
        });
    }, []);


    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/receipts" element={<Receipts />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('app-container'));