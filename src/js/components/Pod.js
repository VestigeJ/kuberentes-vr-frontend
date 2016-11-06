import React from 'react';
import ReactDom from 'react-dom';
import {Entity} from 'aframe-react';

class Pod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            color: props.color
        }
    }
    
    componentWillMount() {
    }

    componentDidMount() {
        // Fun hack to make physics and grab register newly added objects
        [].slice.call(document.querySelectorAll('.controllers')).forEach((el) => el.removeAttribute('sphere-collider'));
        [].slice.call(document.querySelectorAll('.controllers')).forEach((el) => el.setAttribute('sphere-collider', 'objects: .pod;'));
        // [].slice.call(document.querySelectorAll('.controllers')).forEach((el) => el.components['sphere-collider']);

        // Enable physics on the appended object
        ReactDom.findDOMNode(this).setAttribute('dynamic-body', '');

        // Dynamically set position to spawn object
        ReactDom.findDOMNode(this).setAttribute('position', this.props.podPOS);
    }
    componentWillUnmount()  {
        console.log("Removing: " + this.props.name)
    }

    render() {
        // Lights crash textures on mobile, disable them
        let lights = null;
        if (AFRAME.utils.isMobile()){
          lights = lights
        } else {
          lights = lights
            // Lights are a huge performance hit unfortunately, revisit later on
            //   lights = <Entity light={{type: 'point', color: '#63C7B2', intensity: '0.05'}} />
        }
        return(
            <Entity key={name}
            geometry={{ primitive: 'box' }} 
            id={this.props.name}
            material={` metalness:0.3; roughness: 0; src: #floor`} 
            className="pod"
            the-void 
            >
                {lights}

            </Entity>
        )
    }
}
 
export default Pod;