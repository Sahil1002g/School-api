const express = require('express');
const app = express();

// ✅ This enables JSON body parsing
app.use(express.json());

const schoolRoutes = require('./routes/schoolRoutes');
app.use('/', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
