const express = require('express');
const app = express();
const taskRoutes = require('./routes/tasks'); // updated path

app.use(express.json()); // Parse JSON bodies
app.use('/tasks', taskRoutes); // Mount task routes

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
