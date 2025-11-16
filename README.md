# 📝 Task Manager REST API

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)

A simple **RESTful API** for managing tasks, built with **Node.js** and **Express**. Designed for **CSE 362 Lab 02**, it supports creating, retrieving, and managing tasks in-memory.

---

## 🔹 Features

- ✅ Create a new task (`POST /tasks`)
- ✅ Retrieve all tasks (`GET /tasks`)
- ✅ Retrieve a task by ID (`GET /task/:id`)
- ✅ Check server health (`GET /health`)
- ✅ Tasks have `id`, `title`, `completed`, `priority`, and `createdAt`
- ✅ Basic error handling (invalid JSON, missing title, invalid ID)

---

## 📁 Project Structure
task-manager/
├── server.js # Main server
├── package.json # Node.js metadata
├── README.md # This file
└── src/
└── routes/
└── tasks.js # Task routes

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| GET    | /tasks    | Retrieve all tasks    |
| POST   | /tasks    | Create a new task     |
| GET    | /task/:id | Retrieve a task by ID |
| GET    | /health   | Check server health   |

