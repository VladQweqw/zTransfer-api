const { Router } = require('express')

const roomController = require("../controllers/roomController");
const router = Router();

router.post('/', roomController.post_room);
router.post('/join/:id', roomController.enterRoom);

router.get('/', roomController.get_rooms);
router.get('/:id', roomController.get_room_by_id);



module.exports = router;