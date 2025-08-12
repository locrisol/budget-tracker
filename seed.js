require('dotenv').config();
const { sequelize, Category, Transaction } = require('./src/models');

(async () => {
  await sequelize.sync({ force: true });

  // Create categories
  const food = await Category.create({ name: 'Food'});
  const transport = await Category.create({ name: 'Transport'});
  const salary = await Category.create({ name: 'Salary'});
  const freelance = await Category.create({ name: 'Freelance'});

  // Sample transactions
  await Transaction.bulkCreate([
    { type: 'income', amount: 2500.00, date: '2025-08-01', description: 'Monthly salary', categoryId: salary.id },
    { type: 'expense', amount: 12.50, date: '2025-08-02', description: 'Lunch', categoryId: food.id },
    { type: 'expense', amount: 2.75, date: '2025-08-03', description: 'Bus fare', categoryId: transport.id },
    { type: 'income', amount: 300.00, date: '2025-08-04', description: 'Side gig', categoryId: freelance.id },
    { type: 'expense', amount: 45.00, date: '2025-08-05', description: 'Groceries', categoryId: food.id },
  ]);

  console.log('Seeded sample data');
  process.exit(0);
})();
