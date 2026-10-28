import { users } from '../users.js';


// הרשמה
export const signUp = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 101;
  const user = { id: newId, name, email, password, Books: [] };
  users.push(user);

  res.status(201).json(user);
};

    // התחברות למערכת
export const login = (req, res) => {    const email = req.body.email;
    const password = req.body.password;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
      res.status(200).json(user);
}; 
   
// הצגת כל המשתמשים
export const getAllUsers = (req, res) => { 
       res.status(200).json(users);
};

