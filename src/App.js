import React, { Component } from 'react';
import { captureUserMedia, S3Upload } from './AppUtils';
import Button from '@material-ui/core/Button';
import RecordRTC from'recordrtc';
import Webcam from './webcam';
import { Modal } from 'react-bootstrap';
//import logo from './logo.svg';
//import './App.css';
const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class App extends Component {
  constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { flag: true,
                 src: null,
                 recordVideo: null,
                 //uploadSuccess: null,
                // uploading: false
               };

  this.handleClick = this.handleClick.bind(this);
  this.requestUserMedia = this.requestUserMedia.bind(this);
  this.startRecord = this.startRecord.bind(this);
  this.stopRecord = this.stopRecord.bind(this);
}
handleClick(){
  this.setState(state=>({
    //this.state.flag?0:1
    flag:!state.flag
  }));
  console.log(this.state.flag);
}
stopVideo(){
  this.setState(state=>({
    src:null
  }))
}
componentDidMount() {
   if(!hasGetUserMedia) {
     alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
     return;
   }
   this.requestUserMedia();
 }

 requestUserMedia() {
   console.log('requestUserMedia')
   captureUserMedia((stream) => {
     this.setState({ src: window.URL.createObjectURL(stream) });
     console.log('setting state', this.state)
   });
}
startRecord() {
    captureUserMedia((stream) => {
      this.state.recordVideo = RecordRTC(stream, { type: 'video' });
      this.state.recordVideo.startRecording();
    });

    setTimeout(() => {
      this.stopRecord();
    }, 4000);
  }

  stopRecord() {
    this.state.recordVideo.stopRecording(() => {
      let params = {
        type: 'video/webm',
        data: this.state.recordVideo.blob,
        id: Math.floor(Math.random()*90000) + 10000
      }

      //this.setState({ uploading: true });

    /*  S3Upload(params)
      .then((success) => {
        console.log('enter then statement')
        if(success) {
          console.log(success)
          this.setState({ uploadSuccess: true, uploading: false });
        }
      }, (error) => {
        alert(error, 'error occurred. check your aws settings and try again.')
      })*/
    });
}
  render() {
      return (
      <div className="App">
        <Modal show={this.state.uploadSuccess}><Modal.Body>Upload success!</Modal.Body></Modal>
        <div><Webcam src={this.state.src}/></div>
        {this.state.uploading ?<div>Uploading...</div> : null}
        <div><button onClick={this.startRecord}>Start Record</button></div>
        <div><buttton onClick={this.stopVideo}>Stop Video</button></div>
        <Button color={this.state.flag?'primary':'default'} onClick={this.handleClick} >
        Stop
        </Button>
      </div>
    );
  }
}

export default App;
