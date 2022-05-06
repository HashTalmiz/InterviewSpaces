const router = require('express').Router();
router.get('/api/test', (req, res) => res.json({ msg: 'OK' }));

module.exports = router;
