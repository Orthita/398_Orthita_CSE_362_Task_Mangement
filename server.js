const express = require('express');
const taskRouter = require('./routes/tasks');

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to Task Manager API');
});


app.use('/tasks', taskRouter);


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON format' });
  }
  next(err);
});


const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
