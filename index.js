
import 'dotenv/config';
import app from './src/app.js';

const PORT = 3001;
const HOST = '192.168.1.19';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

