const path = require('path');
const router = require('express').Router();

router.use('/api', require('./api'));

if (process.env.NODE_ENV === 'production') {
  router.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')))
}

module.exports = router;
