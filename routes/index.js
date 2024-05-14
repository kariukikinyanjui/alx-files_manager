import express from 'express';
import UsersController from '../controllers/UsersController';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

module.exports = router;
