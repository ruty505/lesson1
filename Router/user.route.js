import express from 'express';
import { users } from '../users.js';

const  router=express.Router()

// הרשמה
router.post('/signup',(req,res)=>{
        const id =req.body.id;
    const name =req.body.name;
   const password =req.body.password;
   const email =req.body.email;
    if (!name || !email || !password|| !id) {
    return res.status(400).json({ error: 'name, email, password and id are required' });
    else {
        const user={id:id, name:name, email:email, password:password}
        users.push(user)}
});


export default router;
