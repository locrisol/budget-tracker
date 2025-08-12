# Personal Budget / Expense Tracker

## Overview
A solo-built application to log income and expenses, categorize them, and visualize cash flow to aid personal financial awareness.

## Tech Stack
- Node.js + Express for backend routing  
- Sequelize ORM with SQLite for data persistence (zero config)  
- Nunjucks for server-side templating  
- Chart.js (via CDN) for client-side visual summaries  
- dotenv for configuration

## Features
- Add/edit/delete income and expense entries  
- Categorize transactions  
- Dashboard with totals, net balance, recent activity  
- Aggregated summaries (by category) for visualization  
- Sample seed data for immediate demo

## Setup
1. Copy `.env.example` to `.env` and adjust if needed  
2. Install dependencies: `npm install`  
3. Seed database: `npm run seed`  
4. Start in dev: `npm run dev`  
5. Open `http://localhost:3000`  

## Data Model
- Category: name, type (expense/income)  
- Transaction: type, amount, date, description, category

## Future Improvements
- Authentication for multi-user  
- Recurring transactions  
- Export to CSV / PDF  
- Monthly budgeting goals  
- Persist charts snapshots

