import {Router} from "express";
export const router = Router();

router.get('/', function (req: any, res: any) {
    res.send('Hello World')
});
