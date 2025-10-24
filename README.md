<div align="center">
  <img src="frontend/public/sparrow.svg" alt="sparrow" width="120" />
  <h1>Sparrow</h1>
</div>

[![中文 README](https://img.shields.io/badge/README-%E4%B8%AD%E6%96%87-red?style=flat-square)](README-zh.md)

A lightweight fullstack starter built with Spring Boot &amp; React, perfect for tool systems, admin panels and mini apps.

## Introduction
While AI has made it easier to turn ideas into reality, building a clean, reliable, and extensible project foundation still requires thoughtful design, solid tech choices, and hands-on experience. 

Sparrow is a lightweight fullstack starter built with Spring Boot and React, designed as a practical starting point for tool systems, admin panels, and mini apps. 

It aims to reduce the overhead of setting up core infrastructure, helping developers focus more on building what matters.

## Screenshots
![register](documents/assets/screenshots/register.png)

see more screenshots in [this directory](documents/assets/screenshots/).

## Key Features
- Light / Dark mode
- Full multi-language support
- User login and registration
- Role-based access control
- Configurable system settings
- API key authentication
- Basic CRUD operations (user management)
- User password reset with email verification


## Key TechStack

### Backend
- Java 17
- [Spring Boot](https://spring.io/projects/spring-boot) 3.5.3
- [sa-token](https://github.com/dromara/Sa-Token) 1.44.0
- [mybatis-plus](https://baomidou.com/en/) 3.5.12

### Frontend
- [React](https://react.dev/) ^19.1.0
- [Vite](https://vite.dev/) ^8.2.0
- [Mantine UI](https://ui.mantine.dev/) ^8.2.1
- [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/) ^8.2.0
- [tabler icons](https://tabler.io/icons) ^3.34.0

## Deployment

Default username and password is `root` / `Root@123.`.

### Run with Docker
**You need to prepare a mysql database before you run the docker image.**

[Here](documents/deployment/docker-run.sh) is a sample `docker run command` that you can use to run Sparrow with your own MySQL.


### Run with Docker Compose
With Docker Compose, you can easily set up both the Sparrow application and a MySQL database. 

[Here](documents/deployment/docker-compose.yml) is a sample `docker-compose.yml` file that you can use to run Sparrow.


### Run with JAR
**Make sure you have Java 17 installed on your machine.**

Download the latest JAR file from the [releases page](https://github.com/aizhimou/sparrow/releases) and run it with [this](documents/deployment/jar-run.sh) command.


## Development

### Source Code directory structure
```
sparrow
├── backend  // Backend source code directory
│   ├── pom.xml  // Maven configuration file
│   ├── src  // Java Source code directory
├── Dockerfile  // Dockerfile for building the backend image
├── documents  // Documentation directory
│   └── deployment
├── frontend  // Frontend source code directory
│   ├── eslint.config.js  // ESLint configuration file
│   ├── index.html  // Main HTML file
│   ├── package-lock.json  // NPM lock file
│   ├── package.json  // NPM configuration file
│   ├── public  // Public assets directory
│   ├── src  // React source code directory
│   └── vite.config.js  // Vite configuration file
├── LICENSE
└── README.md
```

### Role Based Access Control
![Architecture Diagram](documents/assets/sparrow-role-based-permission.drawio.svg)

All api can be authenticated with a token or an api key in the same role.

### Develop

#### Connect to you own MySQL database
You can change the database connection settings in the `application.yml` file in the `backend/src/main/resources` directory.

The default initial database schema and data can be found in the `backend/src/main/resources/schema.sql` and `backend/src/main/resources/data.sql` files.
The database will be automatically created when you run the application.

### Run the backend
You can run the backend with Maven or your favorite IDE. Make sure you have Java 17 and Maven installed on.

#### Run the frontend
Use `npm install` to install the dependencies, then use `npm run dev` to start the development server.

Local network proxy is enabled by default, you can change the proxy settings in the `vite.config.js` file in the `frontend` directory if you need to.

### Write your own business code
Write anything you want to build your own application 💡

###  Build
#### Build JAR file
1. Build the frontend first with `npm run build`
2. copy the `frontend/dist` directory to the `backend/src/main/resources/static` directory.
3. Run `mvn clean package` in the `backend` directory to build the JAR file.
4. The JAR file will be generated in the `backend/target` directory.
5. You can run the JAR file with `java -jar target/sparrow-<version>.jar` command, where `<version>` is the version of the JAR file.

#### Build Docker image
You can use the `Dockerfile` in the root directory to build the Docker image.

