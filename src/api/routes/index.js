import express from 'express';

const app = express.Router();

// app.use('/auth', require('./auth'));
// app.use('/dashboard', require('./dashboard'));

// fs.readdirSync(__dirname + '/../models').forEach(function (file) {
//   if (file.substr(-3) == '.js') {
//     const modelName = file.replace('.js', '');
//     app.use('/' + modelName, import('./' + modelName));
//   }
// });

export default app;

