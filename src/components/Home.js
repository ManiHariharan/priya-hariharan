
import React from "react";
import logo from '../images/h2-logo.png';

import "../App.css"

const RENT_PAID = 99600;
const H2CustomInput = (props) => {
  const inputKey = props.name;
  const inputId = props.id;

return (
  <div className="h2-input-div">
    <label className="h2-input-lbl">{inputKey}</label>
    <input className="h2-input-num" type="number" id={inputId} required/>  
  </div>
)
}

function Home() {
  

  function calculateTax() {
    const baseSalary = Number(document.getElementById('h2-base-salary').value);
    const hra = Number(document.getElementById('h2-hra-allowance').value);
    const otherAllowance = Number(document.getElementById('h2-other-allowance').value);
    const epf = Number(document.getElementById('h2-epf').value);
    const gratuity = Number(document.getElementById('h2-gratuity').value);
    const insurance = Number(document.getElementById('h2-insurance').value);
    if (baseSalary <= 0) {
      alert('Enter Valid \'Base Salary\'');
      return;
    }
    
    console.log("baseSalary = " + baseSalary);
    console.log("hra = " + hra);
    console.log("otherAllowance = " + otherAllowance);
    console.log("epf = " + epf);
    console.log("gratuity = " + gratuity);
    console.log("insurance = " + insurance);
    console.log("----------");
    alert(baseSalary);

    const hraA = hra;
    const hraB = (baseSalary/2);
    const hraC = RENT_PAID - (baseSalary * 0.1);
    console.log("hraA = " + hraA + ", hraB = " + hraB + ", hraC = " + hraC);
  }

  return (
    <div>
      <div className = "h2-salary-input-div">
      <H2CustomInput name="Base Salary" id="h2-base-salary" stateKey="h2baseSalary"/>
      <H2CustomInput name="HRA" id="h2-hra-allowance" stateKey="h2Hra"/>

      <H2CustomInput name="All Other Allowances" id="h2-other-allowance" stateKey="h2OtherAllowance"/>

      <H2CustomInput name="EPF" id="h2-epf" stateKey="h2Epf"/>
      <H2CustomInput name="Gratuity" id="h2-gratuity" stateKey="h2Gratuity"/>
      <H2CustomInput name="Insurance" id="h2-insurance" stateKey="h2Insurance"/>

      </div>

      <div className="h2-input-div">
          <button className="h2-tax-btn" onClick={calculateTax}>Calculate</button>
      </div>

    <div className = "h2p-center-flex">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
    </div>
  );
}

export default Home;
