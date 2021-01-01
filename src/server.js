import 'dotenv/config.js';

import app from './app.js';

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
