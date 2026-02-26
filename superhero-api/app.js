require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const incidentRoutes = require('./routes/incidentRoutes');
const heroRoutes = require('./routes/heroRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/heroes', heroRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));