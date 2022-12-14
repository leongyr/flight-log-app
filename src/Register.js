import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
}));

async function registerUser(credentials) {
  return fetch('https://flightlog-backend.herokuapp.com/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

export default function Register() {
  const classes = useStyles();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await registerUser({
      username,
      password
    });
    if ('id' in response) {
      swal("Success", "User created", "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('userID', response['id']);
        window.location.href = "/";
      });
    } else {
      swal("Registration failed", "", "error");
    }
  }

  return (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            My Flight Log - Register
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
	              Register
	            </Button>
	          </form>
          </div>
          <a href="/">Sign In</a>
        </div>
  );
}