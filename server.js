const express = require('express');
const app = express();
const routes = require('./routes');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${port}`);
});
