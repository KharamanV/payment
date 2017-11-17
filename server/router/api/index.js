const router = require('express').Router();
const { auth, security } = require('./auth');

router.use('/auth', auth);
router.use(security());

// Private routes below

module.exports = router;
