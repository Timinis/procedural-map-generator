import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as MapFactory from './library/mapGeneration.ts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.myRef.current === null) return;
    let canvasContext = this.myRef.current.getContext('2d');
    let mapWidth = 50;
    let mapHeight = 30;
    let easyMap = MapFactory.generateNewMap(mapWidth, mapHeight);
    let randomMapScramble = Math.floor(Math.random() * 100);

    let randomizedMap;
    if (randomMapScramble % 2 === 0) {
      let randomCutCounts = MapFactory.getRandomIntInclusive(3, 7);
      randomizedMap = MapFactory.mapRandomizerBreadth(easyMap, randomCutCounts);
    } else {
      let randomCutCounts = MapFactory.getRandomIntInclusive(2, 4);
      randomizedMap = MapFactory.mapRandomizerDepth(easyMap, randomCutCounts);
    }

    let mapToBeDrawn = MapFactory.getLeaf(randomizedMap);

    canvasContext.fillStyle = 'gray';
    canvasContext.fillRect(20, 20, mapWidth * 20.5, mapHeight * 20.5);
    mapToBeDrawn.forEach(element => {
      canvasContext.fillStyle = 'yellow';
      canvasContext.fillRect(
        20 * (element.xAxis[0] + 1) + 20,
        20 * (element.yAxis[0] + 1) + 20,
        (element.xAxis[1] - element.xAxis[0]) * 20,
        (element.yAxis[1] - element.yAxis[0]) * 20
      );
    });
  };

  render() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    return (
      <div>
        <canvas
          id="procedural-map"
          ref={this.myRef}
          width={width.toString()}
          height={height.toString()}
        />
      </div>
    );
  }
}
export default App;
