import React, { useState, useEffect } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    maxHeight: 680,
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  button: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    minWidth: 650,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    padding: theme.spacing(0, 2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const token = localStorage.getItem('accessToken');

async function getLogs() {
  return fetch('https://flightlog-backend.herokuapp.com/flightLog/', {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Authorization': "Bearer " + token,
      'Content-Type': 'application/json'
    }),
  })
    .then(data => data.json());
 }

 async function createLog(entry) {
  return fetch('https://flightlog-backend.herokuapp.com/flightLog/', {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Authorization': "Bearer " + token,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(entry)
  })
 }

async function updateLog(id, entry) {
  console.log(id);
  console.log(entry);
  return fetch('https://flightlog-backend.herokuapp.com/flightLog/' + id, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Authorization': "Bearer " + token,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(entry)
  })
 }

 async function deleteLog(id) {
  return fetch('https://flightlog-backend.herokuapp.com/flightLog/' + id, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Authorization': "Bearer " + token,
      'Content-Type': 'application/json'
    }),
  })
 }

export default function Logs() {
  if(!token) {
    window.location.href = "/";
  }

  const classes = useStyles();
  const [fetchData, setFetchData] = useState(true);
  const [entries, setEntries] = useState([]);
  const [tailNumber, setTailNumber] = useState();
  const [flightID, setFlightID] = useState();
  const [takeoff, setTakeoff] = useState();
  const [landing, setLanding] = useState();
  const [duration, setDuration] = useState();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [value, setValue] = useState([]);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userID");
    window.location.href = "/";
  };

  const triggerDataFetch = () => setFetchData(t => !t);

  const handleCreate = async e => {
    e.preventDefault();
    createLog({
      tailNumber: tailNumber,
      flightID: flightID,
      takeoff: takeoff,
      landing: landing,
      duration: duration,
    })
    triggerDataFetch();
  }

  const handleUpdate = async e => {
    e.preventDefault();
    const newItem = {
      tailNumber: tailNumber, 
      flightID: flightID, 
      takeoff: takeoff, 
      landing: landing, 
      duration: duration,
    }
    updateLog(value, newItem);
    const newEntries = entries.map((item) => {
      if (item._id === value) {
        return newItem;
      }
      return item;
    });
    setEntries(newEntries);
  }

  const handleDelete = (id) => {
    deleteLog(id).then(setEntries(entries.filter(item => item._id !== id)));
  }

  const showCreateBox = () => {
    setOpenCreate(true);
  };

  const hideCreateBox = () => {
    setOpenCreate(false);
  };

  const showEditBox = (entry) => {
    setTailNumber(entry.tailNumber);
    setFlightID(entry.flightID);
    setTakeoff(entry.takeoff);
    setLanding(entry.landing);
    setDuration(entry.duration);
    setValue(entry._id);
    setOpenEdit(true);
  };

  const hideEditBox = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    getLogs().then(entries => {
      setEntries(entries);
    });
  },[fetchData]);

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            <b>Flight Logs</b>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Flight ID"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="contained" size="small" className={classes.button} onClick={showCreateBox}>New Log</Button>
          <Dialog open={openCreate} onClose={hideCreateBox} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Flight Log</DialogTitle>
            <form onSubmit={handleCreate}>
              <DialogContent>
                <DialogContentText>Please key in the flight details:</DialogContentText>
                  <TextField required margin="dense" id="tailNumber" name="tailNumbers" label="Tail Number" fullWidth onChange={e => setTailNumber(e.target.value)}/>
                  <TextField required margin="dense" id="flightID" name="flightID" label="Flight ID" fullWidth onChange={e => setFlightID(e.target.value)}/>
                  <TextField required margin="dense" id="takeoff" name="takeoff" label="Take Off" fullWidth onChange={e => setTakeoff(e.target.value)}/>
                  <TextField required margin="dense" id="landing" name="landing" label="Landing" fullWidth onChange={e => setLanding(e.target.value)}/>
                  <TextField required margin="dense" id="duration" name="duration" label="Duration" fullWidth onChange={e => setDuration(e.target.value)}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={hideCreateBox} color="primary">Cancel</Button>
                <Button type="submit" onClick={hideCreateBox} color="primary">Create</Button>
              </DialogActions>
            </form>
          </Dialog>
          <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={handleLogout}>Log Out</Button>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper} className={classes.container}>
        <Table stickyHeader className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Index</b></TableCell>
              <TableCell><b>Tail Number</b></TableCell>
              <TableCell><b>Flight ID</b></TableCell>
              <TableCell><b>Take Off</b></TableCell>
              <TableCell><b>Landing</b></TableCell>
              <TableCell><b>Duration</b></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(entries.length !== 0) ? (
              entries.filter((item) => !search.length || item.flightID.toLowerCase().includes(search.toLowerCase())
              )
              .map((entry,index) => (
                <TableRow key={entry._id}>
                  <TableCell component="th" scope="row">{index+1}</TableCell>
                  <TableCell>{entry.tailNumber}</TableCell>
                  <TableCell>{entry.flightID}</TableCell>
                  <TableCell>{entry.takeoff}</TableCell>
                  <TableCell>{entry.landing}</TableCell>
                  <TableCell>{entry.duration}</TableCell>
                  <TableCell><Button color="primary" onClick={(e) => showEditBox(entry)}>Edit</Button></TableCell>
                  <TableCell><Button color="secondary" onClick={(e) => handleDelete(entry._id)}>Delete</Button></TableCell>
                </TableRow>
              ))) : (
                <TableRow>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              )
            }
            <Dialog open={openEdit} onClose={hideEditBox} aria-labelledby="form-dialog-title2">
              <DialogTitle id="form-dialog-title2">Edit Flight Log</DialogTitle>
              <form  onSubmit={handleUpdate}>
                <DialogContent>
                    <TextField required margin="dense" id="tailNumber" name="tailNumbers" label="Tail Number" fullWidth defaultValue={tailNumber} onChange={e => setTailNumber(e.target.value)}/>
                    <TextField required margin="dense" id="flightID" name="flightID" label="Flight ID" fullWidth defaultValue={flightID} onChange={e => setFlightID(e.target.value)}/>
                    <TextField required margin="dense" id="takeoff" name="takeoff" label="Take Off" fullWidth defaultValue={takeoff} onChange={e => setTakeoff(e.target.value)}/>
                    <TextField required margin="dense" id="landing" name="landing" label="Landing" fullWidth defaultValue={landing} onChange={e => setLanding(e.target.value)}/>
                    <TextField required margin="dense" id="duration" name="duration" label="Duration" fullWidth defaultValue={duration} onChange={e => setDuration(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={hideEditBox} color="primary">Cancel</Button>
                  <Button type="submit" onClick={hideEditBox} color="primary">Save</Button>
                </DialogActions>
              </form>
            </Dialog>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 