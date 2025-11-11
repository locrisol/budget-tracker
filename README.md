# Budget Tracker

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-black?logo=express)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-3e77e6?logo=sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-044a64?logo=sqlite&logoColor=white)
![Nunjucks](https://img.shields.io/badge/Nunjucks-Templating-009639)
![Chart.js](https://img.shields.io/badge/Chart.js-Visualisation-f76b6b?logo=chart.js&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A lightweight and privacy-focused web application to record and categorise personal income and expenses.  
All data is stored locally using SQLite — **no accounts, no external APIs, no data sharing**.

---

## Features

- Add, view, edit and delete transactions
- Create **unlimited** custom income/expense categories
- Automatic calculation of:
  - Total income
  - Total expenses
  - Net balance
- Visual dashboard powered by **Chart.js**
- Fully server-rendered UI using Nunjucks
- Local database (`data.sqlite`) for privacy and portability

---

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Node.js, Express.js |
| Database | SQLite (Sequelize ORM) |
| Templating | Nunjucks |
| Styling | Bootstrap 5 + Bootswatch Lux theme |
| Charts | Chart.js |
| Dev Tools | Nodemon |

---

## Project Structure

```text
budget-tracker/
├─ config/
│  └─ database.js
├─ models/
│  ├─ Category.js
│  └─ Transaction.js
├─ routes/
│  ├─ categories.js
│  ├─ transactions.js
│  └─ index.js
├─ views/                 # Nunjucks templates
│  ├─ layout.njk
│  ├─ dashboard.njk
│  ├─ categories.njk
│  ├─ transactions.njk
│  └─ add-transaction.njk
├─ public/
│  └─ scripts.js
├─ seed.js
├─ index.js
└─ data.sqlite            # created automatically after first run
```

---

## Getting Started

Make sure you have **Node.js** installed.

```bash
# Install dependencies
npm install

# (Optional) Seed example transactions
node seed

# Start the server
npm start

# Then, visit
http://localhost:3000
```

## How It Works

1. **Routing & Controllers (Express)**
   - Incoming requests are handled in route files under `/routes`
   - Each route triggers controller logic that interacts with the database

2. **Data Persistence (Sequelize + SQLite)**
   - Models in `/models` define the tables (`Category` and `Transaction`)
   - CRUD operations are executed through Sequelize ORM methods
   - All data is stored locally in `data.sqlite`

3. **Server-Side Rendering (Nunjucks)**
   - Controllers pass data to `.njk` templates in `/views`
   - The UI is generated entirely on the server using `layout.njk` as the base layout

4. **Dashboard Aggregation**
   - On each request, totals are computed using SQL `SUM()` queries
   - These values are passed directly to Chart.js for visualisation
   - No client-side state or SPA logic required

5. **Local-First Design**
   - The app does **not** require authentication, accounts, or external APIs
   - All financial data remains private and stored on the user's machine

## Data Model

### Category
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER (Primary Key) | Auto-increment |
| name | STRING | Unique, required |

### Transaction
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER (Primary Key) | Auto-increment |
| amount | DECIMAL/NUMBER | Required |
| type | ENUM (`income` / `expense`) | Required |
| description | STRING/TEXT | Optional |
| date | DATE | Required |
| categoryId | INTEGER (Foreign Key) | References `Category.id` |

**Relationship:**  
`Category (1) ── (M) Transaction`

## Possible Improvements

- Authentication and multi-user support
- Monthly and yearly budget breakdowns
- CSV / PDF export of transaction history
- Import from bank CSV files
- Recurring payments (scheduled transactions)
- Dashboard filters (by category, date range)
- Automated tests and CI workflow
- Performance tuning for large datasets (indexes, pagination)

> This project is complete and not planned for further expansion.
