const router = require('express').Router();
const ctrl = require('../controllers/socialController');
const { auth } = require('../middleware/auth');

router.get('/posts', auth, ctrl.getMyPosts);
router.post('/import', auth, ctrl.importPost);
router.post('/convert/:postId', auth, ctrl.convertToProduct);

module.exports = router;
