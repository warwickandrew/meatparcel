const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// @route   Get api/auth
// @desc    Test route
// @access  Private
router.get('/', auth, (req, res) => res.send('Auth route'));

module.exports = router;