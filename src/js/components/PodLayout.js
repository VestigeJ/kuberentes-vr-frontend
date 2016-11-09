import React from 'react';
import ReactDom from 'react-dom';
import {Entity} from 'aframe-react';
import Pod from './Pod';
import podData from '../mock/pods.json';
import io from 'socket.io-client';

const socket = io('http://blackpearl.local:9003');

class PodLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pods: [],
            podsLoaded: false
        };
        this.destroyChildPod = this.destroyChildPod.bind(this);
        socket.on('newPod', (newPod) => this.podAddEvent(newPod));
        socket.on('removePod', (removePod) => this.podRemoveEvent(removePod));
        socket.on('initPod', (initPod) => this.podInitEvent(initPod));
    }

    podInitEvent(initPod) {
      this.setState({pods: initPod.podList});
      this.setState({ podsLoaded: true });
    }

    podAddEvent(newPod) {
        let pod = newPod,
            podList = this.state.pods
        if(pod.name) {
            podList.push(
                pod
            );
            this.setState({pods: podList});
        } else {
            console.log("Unknown pod data received")
            console.log(pod);
        }
    }

    podRemoveEvent(removePod) {
        let pod = removePod
        var podsUpdate = this.state.pods.filter(function (el) {
            return el.name != removePod.name
        });
        this.setState({ pods: podsUpdate })
    }

    loadPodsFromServer() {
        socket.emit('sniffPods', "true");
    }

    componentDidMount() {
      this.loadPodsFromServer(); 
    }
    randomPosition() {
        return {x: Math.random() * 50 - 25, y: 10, z: Math.random() * 50 - 25};
    }

    destroyChildPod(evt) {
        var pod = {
            name: evt.srcElement.id
        }
        socket.emit('k8sDestroyPod', pod)
    }

    render() {

        let podList = this.state.pods
        if (this.state.podsLoaded) {
            podList = podList.map((pod) => (
                <Pod podPOS={this.randomPosition()} ip={pod.ip} startTime={pod.start} namespace={pod.namespace} name={pod.name} type={pod.type} key={pod.name} color="#3774E0" />
            ))
            return(
                <Entity id="podHolder" onDestroy={this.destroyChildPod}>
                    {podList}
                </Entity>
            );
        } else {
            return(
                <Pod podPOS={this.randomPosition()} name="test" key="test" color="red" />
            );

        }
    }
}

export default PodLayout;