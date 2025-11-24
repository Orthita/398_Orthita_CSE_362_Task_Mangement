const db = require('./config/db');

async function seedDatabase() {
  try {
    console.log('Checking task count...');

    const [countRows] = await db.query('SELECT COUNT(*) as total FROM tasks');
    const total = countRows[0].total;

    if (total > 0) {
      console.log(`Database already has ${total} tasks. Seeding skipped.`);
      process.exit(0);
    }

    console.log('Seeding 15 sample tasks...');

    const tasks = [
      ['Learn MySQL', 'Basic SQL commands', 'pending'],
      ['Practice Express.js', 'Routes and middlewares', 'in-progress'],
      ['Finish Lab 3', 'CRUD + DB connection', 'pending'],
      ['Learn Pagination', 'Add skip & limit', 'completed'],
      ['Learn Search Queries', 'LIKE + filtering', 'pending'],
      ['Watch Node tutorials', 'Youtube playlist', 'in-progress'],
      ['Build ToDo App', 'Frontend + backend', 'pending'],
      ['Start GitHub project', 'Push to repo', 'completed'],
      ['Make REST API', 'Full CRUD', 'pending'],
      ['Learn Soft Delete', 'deleted_at column', 'pending'],
      ['Learn Restore feature', 'PUT /restore', 'in-progress'],
      ['Write Report', 'LAB 3 requirements', 'pending'],
      ['Test With Postman', 'GET POST PUT DELETE', 'completed'],
      ['Fix bugs', 'Pagination issue', 'pending'],
      ['Finish Assignment', 'Submit via LMS', 'pending']
    ];

    const sql = `
      INSERT INTO tasks (title, description, status)
      VALUES ?
    `;

    await db.query(sql, [tasks]);

    console.log('Seeding completed successfully ✔');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
