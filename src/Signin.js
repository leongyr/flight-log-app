import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

async function loginUser(credentials) {
  return fetch('https://flightlog-backend.herokuapp.com/user/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

export default function Signin() {
  const classes = useStyles();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password
    });
    if ('accessToken' in response) {
      swal("Success", "Logging in...", "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('accessToken', response['accessToken']);
        window.location.href = "logs";
      });
    } else {
      swal("Sign in failed", "", "error");
    }
  }

  return (
        <div className={classes.paper}>
       	  <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
	      </Avatar>
          <Typography component="h1" variant="h5">
            My Flight Log
          </Typography>
          <div>
	          <form className={classes.form} noValidate onSubmit={handleSubmit}>
	            <TextField
	              variant="outlined"
	              margin="normal"
	              required
	              fullWidth
	              id="username"
	              name="username"
	              label="Username"
	              onChange={e => setUserName(e.target.value)}
	            />
	            <TextField
	              variant="outlined"
	              margin="normal"
	              required
	              fullWidth
	              id="password"
	              name="password"
	              label="Password"
	              type="password"
	              onChange={e => setPassword(e.target.value)}
	            />
	            <Button
	              type="submit"
	              fullWidth
	              variant="contained"
	              color="primary"
	              className={classes.submit}
	            >
	              Sign In
	            </Button>
	          </form>
          </div>
          <a href="/register">Register</a>
        </div>
  );
}