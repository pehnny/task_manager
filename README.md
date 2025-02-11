# Task Manager
A simple task manager running in the terminal.

## Requierements
- NodeJS
- MariaDB
- This repo of course ;)

## Quick install
First, install the dependencies and compile the code with :
```sh
npm install
```
Second, create a `.env` file inside the main folder and configure it :
```env
DB_HOST=localhost
DB_USER=<your username>
DB_PWD=<your user password>
```
*remove the `<>` when you type your username and paswword of course ;)* <br>
**Make sure to not leak your id !!** (make sure your `.env` is ignored by git)

## Run
```sh
npm start
```
All the interactions while running the task manager are done in the terminal for now !
