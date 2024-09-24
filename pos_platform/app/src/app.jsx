// import './assets/css/basic-bootstrap.scss';
import './assets/css/main.scss';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';

import { Layout, theme } from 'antd';

const { Content } = Layout;

// Импортируем ваши компоненты страниц
import Navbar from './components/header/app';
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
        <div
          style={{
            background: "rgb(245 245 245)",
            minHeight: "100%",
            borderRadius: "8px"
          }}
        >
            <Router>
                <Navbar/>
                <Layout style={{
                    maxWidth: "1140px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "1rem",
                }}>
                    <Routes>
                        <Route path="/*" element={<Main />} />
                        <Route path="/receipts" element={<Receipts />} />
                        <Route path="/*" element={<Navigate to="/*" />} />
                    </Routes>
                </Layout>
            </Router>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('app-container'));