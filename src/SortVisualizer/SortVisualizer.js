import React from "react";
import Selector from "../components/Selector";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Autorenew";
import SortIcon from "@material-ui/icons/Sort";
import * as Merge from "../SortingAlgorithms/mergeSort.js";
import * as Bubble from "../SortingAlgorithms/bubbleSort.js";
import * as Quick from "../SortingAlgorithms/quickSort.js";
import * as Select from "../SortingAlgorithms/selectionSort.js";
import * as Insert from "../SortingAlgorithms/insertionSort.js";
import Box from "@material-ui/core/Box";
import "./SortVisualizer.css";

//Constants.
export const MAX_ARRAY_VALUE = 500;
export const MAIN_COLOUR = "#4eccbf";
export const HIGHLIGHT_COLOUR = "#fad169";
export const SPECIAL_HIGHLIGHT = "#f0715d";
export const ANIMATION_SPEED_MS = 5;
var currTab = 0; //Represents the index of the sorting tab that's currently selected.

//Slider.
const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

//Beginning of SortVisualizer Class.
export default class SortVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currArraySize: 100,
      array: [],
      speed: 5,
      currentlyAnimating: false //Represents whether or not a sorting algorithm is currently being animated.
    };
  }

  //Once components are rendered, fill the array randomly.
  componentDidMount() {
    this.refillArray(this.state.currArraySize);
  }
  //Handle changing of the slider that controls the animation speed.
  handleSpeedSliderChange = (event, newValue) => {};

  //Handle changing of the slider that controls the array size.
  handleArraySliderChange = (event, newValue) => {
    this.setState({ currArraySize: newValue });
    this.refillArray(newValue);
  };
  //Handle clicking of 'New Array' button.
  handleNewArrayClick = event => {
    this.refillArray(this.state.currArraySize);
  };
  //Handle clicking of 'Sort' button which just calls helper method.
  handleSortClick = event => {
    this.setState({ currentlyAnimating: true }, () => this.beginSort());
  };
  //Fills the array with 'currArraySize' random elements from 1 -> MAX_ARRAY_VALUE.
  refillArray(length) {
    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(getRandomInt(1, MAX_ARRAY_VALUE));
    }
    //Ensure that colours of the bars are back to normal upon fresh refill.
    var arrayBars = document.getElementsByClassName("arrayBar");
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = MAIN_COLOUR;
    }
    this.setState({ array });
  }

  //Sorting methods that call their respective animation methods.
  async beginSort() {
    var func;
    if (currTab === 0) func = Quick.performVisualization;
    if (currTab === 1) func = Merge.performVisualization;
    if (currTab === 2) func = Insert.performVisualization;
    if (currTab === 3) func = Bubble.performVisualization;
    if (currTab === 4) func = Select.performVisualization;
    await func(this.state.array);
    this.setState({ currentlyAnimating: false });
  }

  //Turn all the bars green for a brief time after sorting.
  flashGreen() {
    var arrayBars = document.getElementsByClassName("arrayBar");
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = MAIN_COLOUR;
    }
  }

  //Tests every implemented sorting algorithm.
  testSortingAlgorithms() {
    this.test(Quick.quickSort, "quick");
    this.test(Insert.insertionSort, "insert");
    this.test(Bubble.bubbleSort, "bubble");
    this.test(Select.selectionSort, "select");
    this.test(Merge.mergeSort, "merge");
  }

  //Test for a single sorting algorithm that takes the sorting method and name as parameters.
  test(func, sortMethod) {
    var numOfTestIterations = 100;
    var arrayLength = 500;
    var visuals = [];
    for (let i = 0; i < numOfTestIterations; i++) {
      var testArray = [];
      for (let j = 0; j < arrayLength; j++) {
        testArray.push(getRandomInt(-5000, 5000));
      }
      var arrayCopy = testArray.slice().sort(function(a, b) {
        return a - b;
      });
      if (sortMethod === "merge")
        func(testArray, testArray.slice(), 0, testArray.length - 1, visuals);
      if (
        sortMethod === "bubble" ||
        sortMethod === "select" ||
        sortMethod === "insert"
      )
        func(testArray, visuals);
      if (sortMethod === "quick")
        func(testArray, 0, testArray.length - 1, visuals);
      console.log(sortMethod + ": " + arraysEqual(arrayCopy, testArray));
    }
  }

  //Beginning of render method.
  render() {
    const { array } = this.state;
    return (
      <Box display="flex" flexDirection="column" height="100vh">
        <Selector />
        <div className="contentContainer">
          <div className="speedSlider">
            <div className="speedLabelWrapper">
              <h3>Speed</h3>
            </div>
            <Slider
              orientation="vertical"
              defaultValue={30}
              min={1}
              max={16}
              step={0.01}
              aria-label="Speed"
              onChange={this.handleSpeedSliderChange}
            />
          </div>
          <div className="sliderBtnsWrapper">
            <div className="arraySizeSlider">
              <h3>Array Size</h3>
              <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="Array Size"
                defaultValue={100}
                min={5}
                max={500}
                onChange={this.handleArraySliderChange}
                disabled={this.state.currentlyAnimating}
              />
            </div>
            <div className="btnsWrapper">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<RefreshIcon />}
                className="mainBtn"
                onClick={this.handleNewArrayClick}
                disabled={this.state.currentlyAnimating}
              >
                <h3 className="btnHeading">New Array</h3>
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SortIcon />}
                className="mainBtn"
                onClick={this.handleSortClick}
                disabled={this.state.currentlyAnimating}
              >
                <h3 className="btnHeading">Sort</h3>
              </Button>
            </div>
          </div>
        </div>
        <div className="barContainer">
          {array.map((value, index) => (
            <div
              className="arrayBar"
              key={index}
              style={{
                width: `${75 / array.length}%`,
                height: `${value / (MAX_ARRAY_VALUE / 100)}%`
              }}
            ></div>
          ))}
        </div>
      </Box>
    );
  }
}

//Generates random integer within the interval [min, max].
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//Determines if two arrays are equal for testing purposes.
function arraysEqual(array1, array2) {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}
//Sets the tab index so that the correct sorting method can be chosen.
export function setCurrTab(index) {
  currTab = index;
}
