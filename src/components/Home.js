
import React, { useState } from "react";
import logo from '../images/h2-logo.png';

import { TaxableIncomeModel } from '../entities/TaxableIncomeModel';
import NumberFormat from 'react-number-format';


import "../App.css"

const RENT_PAID = 99600; //99,600
const STANDARD_DEDUCTIONS = 50000; //50,000

const SLAB_A_START = 250000; //2,50,000
const SLAB_B_START = 500000; //5,00,000
const SLAB_C_START = 1000000; //10,00,000

const SLAB_A_TAX = 0.05; //5%
const SLAB_B_TAX = 0.20; //20%
const SLAB_C_TAX = 0.30; //30%

function getUserInput(elemId) {
  return Number(document.getElementById(elemId).value.split(',').join(''));
}

const H2CustomInput = (props) => {
  const inputKey = props.name;
  const inputId = props.id;

  return (
    <div className="h2-input-div">
      <label className="h2-input-lbl">{inputKey}</label>
      <NumberFormat id={inputId} value={0}
          onValueChange={() => {
            const baseSalary = getUserInput('h2-base-salary');
            const hra = getUserInput('h2-hra-allowance');
            const otherAllowance = getUserInput('h2-other-allowance');
            const epf = getUserInput('h2-epf');
            const gratuity = getUserInput('h2-gratuity');
            const insurance = getUserInput('h2-insurance');
            const totalCTCInput = baseSalary + hra + otherAllowance + epf + gratuity + insurance;
            document.getElementById('h2-total-ctc-inp').value = totalCTCInput;
          }}
          thousandSeparator={true} thousandsGroupStyle='lakh'/>
    </div>
  );
}

function Home() {
  const [isTaxCalculated, setTaxCalculated] = useState(false);
  const [isCalculatingTax, setCalculatingTax] = useState(false);

  const [getTaxableIncomeModel, setTaxableIncomeModel] = useState(new TaxableIncomeModel());

  function calculateNewTax() {
    setTaxCalculated(false);
  }

  function calculateTax() {
    const baseSalary = getUserInput('h2-base-salary');
    const hra = getUserInput('h2-hra-allowance');
    const otherAllowance = getUserInput('h2-other-allowance');
    const epf = getUserInput('h2-epf');
    const gratuity = getUserInput('h2-gratuity');
    const insurance = getUserInput('h2-insurance');
    
    if (baseSalary <= 0) {
      alert('Enter \'Basic Salary\'');
      return;
    }

    const totalCTCInput = baseSalary + hra + otherAllowance + epf + gratuity + insurance;
    if (totalCTCInput <= SLAB_A_START) {
      alert('Total CTC input is less than \''+getReadableValue(SLAB_A_START)+'\'');
      return;
    }

    setCalculatingTax(true);

    var taxableIncomeModel = new TaxableIncomeModel();
    taxableIncomeModel.baseSalary = getReadableValue(baseSalary);
    taxableIncomeModel.hra = getReadableValue(hra);
    taxableIncomeModel.otherAllowance = getReadableValue(otherAllowance);
    taxableIncomeModel.epf = getReadableValue(epf);
    taxableIncomeModel.gratuity = getReadableValue(gratuity);
    taxableIncomeModel.insurance = getReadableValue(insurance);
    taxableIncomeModel.totalCTC = getReadableValue(totalCTCInput);
    

    const hraA = hra;
    const hraB = (baseSalary/2);
    const tenPercentBasic = (baseSalary * 0.1);
    const hraC = (RENT_PAID > tenPercentBasic) ? (RENT_PAID - tenPercentBasic) : 0;
    const hraDeduction = getHraDeduction(hraA, hraB, hraC);

    taxableIncomeModel.actualHra = getReadableValue(hraA);
    taxableIncomeModel.fiftyPercentBasic = getReadableValue(hraB);
    taxableIncomeModel.excessRentPaid = getReadableValue(hraC);
    taxableIncomeModel.hraDeduction = getReadableValue(hraDeduction);

    taxableIncomeModel.standardDeduction = getReadableValue(STANDARD_DEDUCTIONS);

    const optional80C = (150000-epf);
    taxableIncomeModel.required80C = getReadableValue(optional80C);

    const totalIncomeCTC = baseSalary + hra + otherAllowance;
    const totalDeductions = epf + hraDeduction + optional80C + STANDARD_DEDUCTIONS;
    const totalTaxableIncome = totalIncomeCTC - totalDeductions;
    taxableIncomeModel.incomeCTC = getReadableValue(totalIncomeCTC);
    taxableIncomeModel.totalDeductions = getReadableValue(totalDeductions);
    taxableIncomeModel.taxableIncome = getReadableValue(totalTaxableIncome);

    var slabA = 0;
    var slabB = 0;
    var slabC = 0;
    if (totalTaxableIncome > SLAB_A_START) {
      if (totalTaxableIncome < SLAB_B_START) {
        slabA = (totalTaxableIncome - SLAB_A_START) * SLAB_A_TAX;
      } else if (totalTaxableIncome < SLAB_C_START) {
        slabA = SLAB_A_START * SLAB_A_TAX;
        slabB = (totalTaxableIncome - SLAB_B_START) * SLAB_B_TAX;
      } else {
        slabA = SLAB_A_START * SLAB_A_TAX;
        slabB = SLAB_B_START * SLAB_B_TAX;
        slabC = (totalTaxableIncome - SLAB_C_START) * SLAB_C_TAX;
      }
    }
    const slabTotal = slabA + slabB + slabC;
    const slabCess = slabTotal * 0.04;
    const slabTaxToBePaid = slabTotal + slabCess;
    taxableIncomeModel.taxSlabA = getReadableValue(slabA);
    taxableIncomeModel.taxSlabB = getReadableValue(slabB);
    taxableIncomeModel.taxSlabC = getReadableValue(slabC);
    taxableIncomeModel.taxSlabTotal = getReadableValue(slabTotal);
    taxableIncomeModel.taxSlabCess = getReadableValue(slabCess);
    taxableIncomeModel.taxSlabToBePaid = getReadableValue(slabTaxToBePaid);

    const takeHome = (totalIncomeCTC - slabTaxToBePaid);
    taxableIncomeModel.takeHomeYearly = getReadableValue(takeHome);
    taxableIncomeModel.takeHomeMonthly = getReadableValue(takeHome / 12);

    setTaxableIncomeModel(taxableIncomeModel);

    setCalculatingTax(false);
    setTaxCalculated(true);
  }

  function getHraDeduction(hraA, hraB, hraC) {
    if ((hraA === 0) && (hraC === 0)) {
      return hraB;
    }

    if (hraA === 0) {
      if (hraB < hraC) {
        return hraB;
      } else {
        return hraC;
      }
    }

    if (hraC === 0) {
      if (hraA < hraB) {
        return hraA;
      } else {
        return hraB;
      }
    }

    var minVal = hraA;
    if (hraB < minVal) {
      minVal = hraB;
    }
    if (hraC < minVal) {
      minVal = hraC;
    }
    return minVal;
  }

  function getReadableValue (originalFLoatValue) {
    return originalFLoatValue.toLocaleString('en-IN', {maximumFractionDigits:0});
  }

  if(isTaxCalculated) {
    return (
      <div className="take-home-div">
        <table>
          <tbody>
            <tr>
              <td colSpan="3" className="h2-headed-td"><b>CTC Input</b></td>
            </tr>
            <tr>
              <td>A1</td>
              <td>Basic Salary</td>
              <td className="income-model-td">{getTaxableIncomeModel.baseSalary}</td>
            </tr>
            <tr>
              <td>A2</td>
              <td>HRA</td>
              <td className="income-model-td">{getTaxableIncomeModel.hra}</td>
            </tr>
            <tr>
              <td>A3</td>
              <td>All Other Allowances</td>
              <td className="income-model-td">{getTaxableIncomeModel.otherAllowance}</td>
            </tr>
            <tr>
              <td>A4</td>
              <td>EPF</td>
              <td className="income-model-td">{getTaxableIncomeModel.epf}</td>
            </tr>
            <tr>
              <td>A5</td>
              <td>Gratuity</td>
              <td className="income-model-td">{getTaxableIncomeModel.gratuity}</td>
            </tr>
            <tr>
              <td>A6</td>
              <td>Insurance</td>
              <td className="income-model-td">{getTaxableIncomeModel.insurance}</td>
            </tr>
            <tr>
              <td>A7</td>
              <td><b>Total CTC</b> (A1 + A2 + A3 + A4 + A5 + A6)</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.totalCTC}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Deductions</b></td>
            </tr>
            <tr>
              <td>B1</td>
              <td>Actual HRA received (A2)</td>
              <td className="income-model-td">{getTaxableIncomeModel.actualHra}</td>
            </tr>
            <tr>
              <td>B2</td>
              <td>50% of Basic Salary (A1)</td>
              <td className="income-model-td">{getTaxableIncomeModel.fiftyPercentBasic}</td>
            </tr>
            <tr>
              <td>B3</td>
              <td>Excess of Rent paid (99,600 - 10% of A1)</td>
              <td className="income-model-td">{getTaxableIncomeModel.excessRentPaid}</td>
            </tr>
            <tr>
              <td>C1</td>
              <td>HRA Deduction (Minimum of B1, B2, B3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.hraDeduction}</td>
            </tr>
            <tr>
              <td>C2</td>
              <td>Loan Interests / PPF / Other Savings (1,50,000 - EPF)</td>
              <td className="income-model-td">{getTaxableIncomeModel.required80C}</td>
            </tr>
            <tr>
              <td>C3</td>
              <td>Default Standard Deductions</td>
              <td className="income-model-td">{getTaxableIncomeModel.standardDeduction}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Taxable Income</b> (Old Tax Regime)</td>
            </tr>
            <tr>
              <td>D1</td>
              <td>Income CTC (A1 + A2 + A3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.incomeCTC}</td>
            </tr>
            <tr>
              <td>D2</td>
              <td>Total Deductions (A4 + C1 + C2 + C3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.totalDeductions}</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>Taxable Income (D1 - D2)</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.taxableIncome}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Tax Slabs</b></td>
            </tr>
            <tr>
              <td>E1</td>
              <td>5% from 2.5 to 5 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabA}</td>
            </tr>
            <tr>
              <td>E2</td>
              <td>20% from 5 to 10 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabB}</td>
            </tr>
            <tr>
              <td>E3</td>
              <td>30% for above 10 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabC}</td>
            </tr>
            <tr>
              <td>E4</td>
              <td>Total Income Tax (E1 + E2 + E3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabTotal}</td>
            </tr>
            <tr>
             <td>E5</td>
              <td>4% Educational Cess (for E4)</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabCess}</td>
            </tr>
            <tr>
              <td>E6</td>
              <td>Total Tax to be Paid (E4 + E5)</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.taxSlabToBePaid}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Take Home</b></td>
            </tr>
            <tr>
              <td>F1</td>
              <td>Take Home - Yearly (D1 - E6)</td>
              <td className="income-model-td">{getTaxableIncomeModel.takeHomeYearly}</td>
            </tr>
            <tr>
              <td>F2</td>
              <td>Take Home - Monthly</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.takeHomeMonthly}</td>
            </tr>
          </tbody>
        </table>
        <div className="h2-input-div">
            <button className="h2-tax-btn" onClick={calculateNewTax}>Calculate New</button>
        </div>
      </div>
    );
  }else if (isCalculatingTax) {
    return <div className="content">Calulating Tax to be Paid & Monthly Take Home...</div>
  } else {
    return (
      <div>
        <div className = "h2p-center-flex">
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <div className = "h2-salary-input-div">
          <H2CustomInput name="Basic Salary *" id="h2-base-salary" stateKey="h2baseSalary"/>
          <H2CustomInput name="HRA" id="h2-hra-allowance" stateKey="h2Hra"/>
  
          <H2CustomInput name="All Other Allowances (Part-A)" id="h2-other-allowance" stateKey="h2OtherAllowance"/>
  
          <H2CustomInput name="EPF" id="h2-epf" stateKey="h2Epf"/>
          <H2CustomInput name="Gratuity" id="h2-gratuity" stateKey="h2Gratuity"/>
          <H2CustomInput name="Insurance" id="h2-insurance" stateKey="h2Insurance"/>

          <div className="h2-input-div">
            <label className="h2-input-lbl">Total CTC input</label>
            <NumberFormat id="h2-total-ctc-inp" value={0} disabled
                thousandSeparator={true} thousandsGroupStyle='lakh'/>
          </div>
        </div>
  
        <div className="h2-input-div">
            <button className="h2-tax-btn" onClick={calculateTax}>Calculate</button>
        </div>
      </div>
    );
    }
}

export default Home;
