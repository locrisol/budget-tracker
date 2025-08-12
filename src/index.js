require('dotenv').config();
const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const { sequelize, Category, Transaction } = require('./models');
const { Op } = require('sequelize');
const app = express();

// View setup
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV === 'development',
});
app.set('view engine', 'njk');

app.use((req, res, next) => {
  res.locals.path = req.path; // available in all Nunjucks templates
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Dashboard
app.get('/', async (req, res, next) => {
  try {
    const totalIncome = await Transaction.sum('amount', { where: { type: 'income' } }) || 0;
    const totalExpense = await Transaction.sum('amount', { where: { type: 'expense' } }) || 0;
    const recent = await Transaction.findAll({
      order: [['date', 'DESC']],
      limit: 5,
      include: Category,
    });
    res.render('dashboard.njk', {
      totalIncome: parseFloat(totalIncome).toFixed(2),
      totalExpense: parseFloat(totalExpense).toFixed(2),
      net: (parseFloat(totalIncome) - parseFloat(totalExpense)).toFixed(2),
      recent,
    });
  } catch (err) {
    next(err);
  }
});

// Transactions list
app.get('/transactions', async (req, res, next) => {
  try {
    const { type, category, from, to } = req.query;
    const where = {};
    if (type) where.type = type;
    if (category) where.categoryId = category;
    if (from || to) {
      where.date = {};
      if (from) where.date[Op.gte] = from;
      if (to) where.date[Op.lte] = to;
    }
    const transactions = await Transaction.findAll({
      where,
      order: [['date', 'DESC']],
      include: Category,
    });
    const categories = await Category.findAll();
    res.render('transactions-list.njk', { transactions, categories, filters: req.query });
  } catch (err) {
    next(err);
  }
});

// New transaction form
app.get('/transactions/new', async (req, res) => {
  const categories = await Category.findAll();
  res.render('transaction-form.njk', {
    categories,
    transaction: {},
    action: '/transactions',
    method: 'POST',
    title: 'Add Transaction',
  });
});

// Edit transaction
app.get('/transactions/:id/edit', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).send('Not found');
    const categories = await Category.findAll();
    res.render('transaction-form.njk', {
      categories,
      transaction,
      action: `/transactions/${transaction.id}`,
      method: 'POST',
      title: 'Edit Transaction',
    });
  } catch (err) {
    next(err);
  }
});

// Create transaction
app.post('/transactions', async (req, res, next) => {
  try {
    const { type, amount, date, description, categoryId } = req.body;
    await Transaction.create({ type, amount, date, description, categoryId });
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

// Update transaction
app.post('/transactions/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).send('Not found');
    const { type, amount, date, description, categoryId } = req.body;
    await transaction.update({ type, amount, date, description, categoryId });
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

// Delete transaction
app.post('/transactions/:id/delete', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) await transaction.destroy();
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

// Categories list & create
app.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render('categories-list.njk', { categories });
  } catch (err) {
    next(err);
  }
});
app.post('/categories', async (req, res, next) => {
  try {
    const { name } = req.body;
    await Category.create({ name});
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
});

// API summary by category
app.get('/api/summary/by-category', async (req, res, next) => {
  try {
    const results = await Transaction.findAll({
      attributes: [
        'type',
        'categoryId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['type', 'categoryId'],
      include: [{ model: Category, attributes: ['name'] }],
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error.njk', { message: err.message });
});

// Bootstrap
(async () => {
  await sequelize.sync();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
})();
