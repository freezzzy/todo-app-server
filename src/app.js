import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import passportJWT from 'passport-jwt';

import config from '../etc/config.json';

import * as db from './utils/DatabaseUtils';

const app = express();

app.use( bodyParser.json() );
app.use( cors({ origin: '*' }) );
app.use( morgan('dev') );

db.setUpConnection();

const port = process.env.PORT || config.serverPort;

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const params = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

const strategy = new JwtStrategy(params, (jwtPayload, next) => {
  db.getUserById(jwtPayload.id).then(user => {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

passport.use(strategy);

app.use( passport.initialize() );

const apiRoutes = express.Router();

apiRoutes.post('/login', (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  db.getUserByLogin(login).then(user => {
    if (!user) {
      res.status(401).json({
        message: "User with such login not found."
      });
    } else if (user.password === password) {
      let payload = {
        id: user.id
      };
      let token = jwt.sign(payload, params.secretOrKey);
      res.json({
        message: 'Ok.',
        token: token
      });
    } else {
      res.status(401).json({
        message: 'Password incorrect'
      });
    }
  });
});

apiRoutes.get('/todos', (req, res) => {
  db.getTodosList().then(data => res.json(data));
});

apiRoutes.get('/todos/:id', (req, res) => {
  db.getTodoById(req.params.id).then(data => res.json(data));
});

apiRoutes.post('/todos', (req, res) => {
  db.createTodo(req.body).then(data => res.json(data));
});

apiRoutes.delete('/todos/:id', (req, res) => {
  db.deleteTodo(req.params.id).then(data => res.json(data));
});

apiRoutes.post('/users', (req, res) => {
  db.createUser(req.body).then(data => res.json(data));
});

apiRoutes.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getUsersList().then(data => res.json(data));
});

app.use('/api', apiRoutes);

const server = app.listen(port, () => {
  console.log('Server is up and running on port ' + port);
});
