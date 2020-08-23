import React, {useState} from 'react';
import { Typography, Button, Radio } from 'antd';
import { BulbOutlined, CloseCircleOutlined  } from '@ant-design/icons'
import logo from './logo.svg';
import './App.css';
import { TwitterPicker   } from 'react-color';

let api = require("./api.js");

const { Title } = Typography;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function App() {

  const [color, setColor] = useState("#000")


  const switch_lights = hex => {
    setColor(hex)
    let color = hexToRgb(hex)
    api.lights(color, results => {
      console.log(results.data)
    })

  }

  const set_color = color => {
    console.log(color)
    setColor(color.hex)
    color = hexToRgb(color.hex)
    api.lights(color, results => {
      console.log(results.data)
    })
  }

  return (
    <div className="App">
      <header className="App-header" style={{backgroundColor: color}}>
          <Title>Kitchen Lights</Title>

          <Button
            icon={<BulbOutlined/>}
            style={{marginBottom: 10, color: "white", borderColor: "white"}}  //opacity: color !== "#000" ? 0:1
            size="large" value="0" shape="round" type="text"
            onClick={() => switch_lights("#f2ba49")}> Turn those bad boys on
          </Button>
          <Button
            icon={<CloseCircleOutlined/>}
            style={{marginBottom: 30, color: "white", borderColor: "white"}}
            size="large" value="1" shape="round" type="text"
            onClick={() => switch_lights("#000000")}> Let's sleep
          </Button>

          <div style={{textAlign: "Left"}}>
            <p> feeling fancy?</p>
            <TwitterPicker
              color={color}
              onChangeComplete={set_color}/>
          </div>


      </header>

    </div>
  );
}

export default App;
