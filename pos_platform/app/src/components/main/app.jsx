export default function Main(props) {   
    console.log(props);

    return (
        <h1>main</h1>
    );
}

// export default class Main extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             emoji: '',
//             message: '',
//         };

//         Poster.interface.showApplicationIconAt({
//             functions: 'Multikassa',
//             order: 'Кнопка платформы',
//             payment: 'My Button',
//         });

//         // Подписываемся на клик по кнопке
//         Poster.on('applicationIconClicked', (data) => {
//             this.setState({ emoji: '👩‍🍳', message: 'Вы открыли окно заказа!' });

//             Poster.interface.popup({ width: 500, height: 400, title: 'My app' });
//         });

//     }

//     render() {
//         const { emoji, message } = this.state;

//         return (
//             <div className="main">
//                 <h1>{emoji}</h1>
//                 <p>{message}</p>
//             </div>
//         );
//     }
// }
