
import express from 'express';
import { signUp, login, getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();
router.post ('/:signup', signUp);
router.get('/', getAllUsers);
router.post('/login', login);
export default router;