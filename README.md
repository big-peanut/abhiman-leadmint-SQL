# project-abhiman-leadmint

This project is about a Group Chat application.Where Users can create rooms and chat securely.

# Modified project replacing sequelize ORM with SQL queries.CHECKED all the required features are working as intended or not.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

1. Clone the repository to your machine.
2. Navigate inside the project folder.
3. Install all the dependencies inside package.json using npm install
4. All secret keys are in a different file called requirements.txt

## Usage

1. Run your Node.js backend server using npm start and app.js is my entry point to the backend.
2. Open your frontend using VS codes's liveserver extension or opening the index.html through chrome and index.html is the entry point to the frontend.
3. As a new user signup to create an account and then you will be redirected to the login page.
4. Login with correct credentials to move to the main chatting page.
5. In case you want to logout then there is a logout link in the navbar too.

## Features

1. Users create account and they are authenticated using JWT(jsonwebtoken). User passwords are encrypted.
2. Real-time group chatting feature.
3. User can choose to be a prime member or non-prime member. But a non-prime member can buy prime subscription.
4. Only prime members can create group.Non-Prime members can join the first group for free after that non-prime users have to 150 coins.
5. Users can be friends.
6. Users can view profiles of other users.
7. MySQl database is used in the backend to store all the data.
