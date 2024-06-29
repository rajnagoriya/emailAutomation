const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

require('./controller/queue');


app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
