# Poster.Multikassa_VM

Integration for Poster POS and Multikass Virtual Cash Desk users by Ismail

Integration plugin with the Multikassa service for fiscalization and sale of products through the Poster POS application. Includes work with two products: Smart cash register (Online cash register + Terminal) and Virtual Cash register

Структура проекта:
```
poster.multikassa/
├── assets/img/
├── manage_platform/    # Исходники файлов и скриптов для интерфейса в админ части платформы Poster    
│   └── app/            # Vue файлы интерфейса приложения
│       └── ...         
│   └── ajax.php       
│   └── index.php       # файл для oauth авторизации и перенаправления
│   └── app.php         # файл интерфейса приложения
│   └── install.php     # скрипт для установки плагина
├── pos_platform/       # Исходники файлов и скриптов для интерфейса в админ части платформы Poster    
│   └── app/            # React файлы интерфейса приложения (главная логика)
│       └── ...         
│   └── ajax.php        
│   └── app.php         # файл инициализации приложения
├── src/                # классы, исходники и прочее вспомогающие файлы
│   └── pm_rest.php     # PosterMultikassaApi - вспомогательный класс для работы с авторизацией, профилем 
  
```
