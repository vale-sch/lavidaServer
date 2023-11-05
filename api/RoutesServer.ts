import { CreateUser } from "../api/CreateUser";
import { CheckUser } from "../api/CheckUser";



const express = require('express');

const router = express.Router();

console.log('routes running on 3000');

router.post('/create', CreateUser);
router.post('/check', CheckUser);

module.exports = router;