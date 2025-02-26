import { Router } from "express";
export const router = new Router();

import { userRouter } from './userRouter.js';
import { typeRouter } from './typeRouter.js';
import { brandRouter } from './brandRouter.js';
import { deviceRouter } from './deviceRouter.js';
import { basketRouter } from './basketRouter.js';
import { ratingRouter } from './ratingRouter.js';

router.use('/user', userRouter )
router.use('/type', typeRouter )
router.use('/brand', brandRouter )
router.use('/device', deviceRouter )
router.use('/basket', basketRouter )
router.use('/rating', ratingRouter )