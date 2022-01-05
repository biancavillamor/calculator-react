import React, { useState } from "react";

import Button from "./components/Button";
import Container from "./components/Container";
import GridContainer from "./components/GridContainer";
import Screen from "./components/Screen";

// set calculator button values as a grid
const calcBtns = [
  ["C", "+-", "%", "e", "π"],
  ["sin", "cos", "tan", "√", "x^2"],
  [7, 8, 9, "/", "x^3"],
  [4, 5, 6, "*", "x^y"],
  [1, 2, 3, "+", "e^x"],
  [0, ".", "=", "-", "10^x"],
];

const App = () => {
  // set initial states for operator, value, and memory
  const [value, setValue] = useState(0);
  const [ans, setAns] = useState (0);
  const [operator, setOperator] = useState("");
  const [mem, setMem] = useState(0);
  const [memop, setMemop] = useState("");

  // function to handle buttons for 0-9
  // prevents multiple leading zeroes
  // accounts for dec point as first input
  // sets answer to 0 if there was no operator handled (for multiple calcs)
  const handleInput = event => {
    const num = event.target.innerHTML;

    if (value.toString().length < 16) {
      setValue(
        value === 0 && num === "0"
        ? "0"
        : value % 1 === 0
        ? Number(value + num)
        : value + num
      );
      setAns(!operator ? 0 : ans);
    }
    event.preventDefault();
  };

  // function to handle decimal point
  // ensure no repeat decimals
  const handleDecimal = event => {
    const dec = event.target.innerHTML;
    setValue(!value.toString().includes(".") ? value + dec : value);
    event.preventDefault();
  };  

  const calc = (x, y, op) =>
        op === "+"
          ? x + y
          : op === "-"
          ? x - y
          : op === "*"
          ? x * y
          : op === "/"
          ? x / y
          : Math.pow(x, y);

  const handleOperators = event => {
    const op = event.target.innerHTML;
    if (ans && value) {
      handleEquals();
      setOperator(op);
    }
    else {
      setOperator(op);
      setAns(!ans && value ? value : ans);
      setValue(0);
      resetMem();
    }
    event.preventDefault();
  };

  const handleEquals = () => {
    if (operator && value) {
      setMem(value);
      setMemop(operator);          
      setAns(
        value === 0 && operator === "/"
          ? "Error"
          : calc(Number(ans), Number(value), operator)
      );
      setOperator("");
      setValue(0);
    }
    else if (mem && memop) {
      setValue(
        value === 0 && operator === "/"
          ? "Error"
          : calc(Number(ans), Number(mem), memop)
      );
    }
  };

  const handlePercent = () => {
    let tempVal = value ? parseFloat(value) : 0;
    let tempAns = ans ? parseFloat(ans) : 0;
    setValue(tempVal /= 100)
    setAns(tempAns /= 100);
  };

  const handleSign = () => {
    let tempVal = value ? parseFloat(value) : 0;
    let tempAns = ans ? parseFloat(ans) : 0;
    setValue(tempVal * -1)
    setAns(tempAns * -1);
  };

  const returnPiNatural = event => {
    const val = event.target.innerHTML
    if (val === "π") {
      setValue(3.141592);
    }
    else {
      setValue(2.718281);
    }
    setAns(0);
    event.preventDefault();
  };

  const handleExponent = event => {
    const val = event.target.innerHTML
    let tempVal = value ? parseFloat(value) : 0;
    let tempAns = ans ? parseFloat(ans) : 0;
    if (val === "x^2") {
      setValue(Math.pow(tempVal, 2));
      setAns(Math.pow(tempAns, 2));
    }
    if (val === "x^3") {
      setValue(Math.pow(tempVal, 3));
      setAns(Math.pow(tempAns, 3));
    }
    if (val === "10^x") {
      setValue(Math.pow(10, tempVal));
      setAns(Math.pow(10, tempAns));
    }
    if (val === "e^x") {
      setValue(Math.pow(2.718281, tempVal))
      setAns(Math.pow(2.718281, tempAns));
    }
    else {
      setValue(Math.pow(tempVal, 0.5));
      setAns(Math.pow(tempAns, 0.5));
    }
    event.preventDefault();
  };

  const handleTriangle = event => {
    let tempVal = value ? parseFloat(value) : 0;
    let tempAns = ans ? parseFloat(ans) : 0;
    const val = event.target.innerHTML;
    if (val === "sin") {
      setValue(Math.sin(tempVal));
      setAns(Math.sin(tempAns));
    }
    if (val === "cos") {
      setValue(Math.cos(tempVal));
      setAns(Math.cos(tempAns));
    }
    if (val === "tan") {
      setValue(Math.tan(tempVal));
      setAns(Math.tan(tempAns));
    }

    event.preventDefault();
  };

  const handleReset = () => {
    setValue(0);
    setAns(0);
    setOperator("");
    setMem(0);
  };

  const resetMem = () => {
    setMem(0);
    setMemop("");
  };

  return (
    <Container>
      <Screen value={!value ? ans : value} />
      <GridContainer>
        {
          calcBtns.flat().map((b, i) => {
            return (
              <Button
               key={i}
               className={b === 0 ? "zero" : ""}
               value={b}
               onClick={
                b === "sin" || b === "cos" || b === "tan"
                ? handleTriangle
                 : b === "x^2" || b === "x^3" || b === "10^x" || b === "e^x" || b === "√"
                 ? handleExponent
                 : b === "π" || b === "e"
                 ? returnPiNatural
                 : b === "+-"
                 ? handleSign
                 : b === "%"
                 ? handlePercent
                 : b === "+" || b === "-" || b === "*" || b === "/" || b === "x^y"
                 ? handleOperators
                 : b === "="
                 ? handleEquals
                 : b === "C"
                 ? handleReset
                 : b === "."
                 ? handleDecimal
                 : handleInput
               }
               />
            )
          })
        }
      </GridContainer>
    </Container>
  );
};

export default App;
