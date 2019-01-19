import React, { Component } from 'react';
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Dashboard from '@material-ui/icons/Dashboard';
import List from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';
import Feed from './Feed.js';
import FormData from 'form-data';
import { withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appbar: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding:  20,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#eceff1'
  },
  appBarSpacer: theme.mixins.toolbar,
})

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {names: [], selectedFile: ""}
    this.loadVideos = this.loadVideos.bind(this)
    this.handleselectedFile = this.handleselectedFile.bind(this)
    this.submitFile = this.submitFile.bind(this)
  }

  componentDidMount() {
      this.loadVideos()
  }

  loadVideos() {
    this.setState({names: []})
    axios
      .get('https://www.googleapis.com/storage/v1/b/swamphacks2019videos/o')
      .then(response => response.data.items.map(data => this.setState(prevState => ({
        names: [...prevState.names, data.name]})
      )))
  }

  handleselectedFile(event) {
    event.preventDefault()

    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  submitFile() {
    const { selectedFile } = this.state

    const URL = 'https://www.googleapis.com/upload/storage/v1/b/swamphacks2019videos/o?uploadType=media&name=' + selectedFile.name
    const data = new FormData();
    data.append('file', selectedFile);
    data.append('filename', selectedFile.name);

    axios
      .post(URL, data, {header: {'Content-Type': 'video/mp4'}})
      .catch(err => console.log(err))
      .then(this.loadVideos())
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <h1>Dashboard</h1>
            <IconButton>
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <h2 color="black">Video Feeds</h2>
          <Grid container spacing={24} className={classes.container}>
              {this.state.names.map((name, i) => <Feed key={i} name={name}/>)}
          </Grid>
          <div className={classes.appBarSpacer} />
          <label>Upload a new file</label>
          <br/>
          <input type="file" id="video" accept="video/*" onChange={this.handleselectedFile}/>
          <Button color="primary" onClick={this.submitFile}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
