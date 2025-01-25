const { Router } = require('express')

const userController = require("../controllers/usersController");

const router = Router();

router.get('/', userController.get_users);
router.get('/:id', userController.get_user_by_id);
router.get('/:id/rooms', userController.get_rooms_by_users);

router.post('/', userController.post_users);

module.exports = router;