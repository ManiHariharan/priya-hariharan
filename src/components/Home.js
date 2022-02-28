
import React, { useState } from "react";
import logo from '../images/h2-logo.png';

import { TaxableIncomeModel } from '../entities/TaxableIncomeModel';

import "../App.css"

const RENT_PAID = 99600;
const STANDARD_DEDUCTIONS = 50000;
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
  const [isTaxCalculated, setTaxCalculated] = useState(false);
  const [isCalculatingTax, setCalculatingTax] = useState(false);

  const [getTaxableIncomeModel, setTaxableIncomeModel] = useState(new TaxableIncomeModel());

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

    setCalculatingTax(true);
    
    alert(baseSalary);

    var taxableIncomeModel = new TaxableIncomeModel();
    taxableIncomeModel.baseSalary = baseSalary;
    taxableIncomeModel.hra = hra;
    taxableIncomeModel.otherAllowance = otherAllowance;
    taxableIncomeModel.epf = epf;
    taxableIncomeModel.gratuity = gratuity;
    taxableIncomeModel.insurance = insurance;
    

    const hraA = hra;
    const hraB = Number((baseSalary/2).toFixed(2));
    const hraC = Number((RENT_PAID - (baseSalary * 0.1).toFixed(2)));
    const hraDeduction = hraC;

    taxableIncomeModel.actualHra = hraA;
    taxableIncomeModel.fiftyPercentBasic = hraB;
    taxableIncomeModel.excessRentPaid = hraC;
    taxableIncomeModel.hraDeduction = hraDeduction;

    const optional80C = (150000-epf);
    taxableIncomeModel.required80C = optional80C;

    const totalIncomeCTC = baseSalary + hra + otherAllowance;
    const totalDeductions = epf + hraDeduction + optional80C + STANDARD_DEDUCTIONS;
    const totalTaxableIncome = totalIncomeCTC - totalDeductions;
    taxableIncomeModel.incomeCTC = totalIncomeCTC;
    taxableIncomeModel.totalDeductions = totalDeductions;
    taxableIncomeModel.taxableIncome = totalTaxableIncome;

    const slabA = 12500;
    const slabB = 100000;
    const slabC = Number(((totalTaxableIncome - 1000000) * 0.3).toFixed(2));
    const slabTotal = slabA + slabB + slabC;
    const slabCess = Number((slabTotal * 0.04).toFixed(2));
    const slabTaxToBePaid = slabTotal + slabCess;
    taxableIncomeModel.taxSlabA = slabA;
    taxableIncomeModel.taxSlabB = slabB;
    taxableIncomeModel.taxSlabC = slabC;
    taxableIncomeModel.taxSlabTotal = slabTotal;
    taxableIncomeModel.taxSlabCess = slabCess;
    taxableIncomeModel.taxSlabToBePaid = slabTaxToBePaid;

    const takeHome = (totalIncomeCTC - slabTaxToBePaid);
    taxableIncomeModel.takeHomeYearly = takeHome;
    taxableIncomeModel.takeHomeMonthly = Number((takeHome / 12).toFixed(2));

    setTaxableIncomeModel(taxableIncomeModel);

    setCalculatingTax(false);
    setTaxCalculated(true);
  }

  if(isTaxCalculated){
    return (
      <div className="take-home-div">
        <h3>Income Input</h3>
        <table>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td className="income-model-td">{getTaxableIncomeModel.baseSalary}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td className="income-model-td">{getTaxableIncomeModel.hra}</td>
            </tr>
            <tr>
              <td>All Other Allowances</td>
              <td className="income-model-td">{getTaxableIncomeModel.otherAllowance}</td>
            </tr>
            <tr>
              <td>EPF</td>
              <td className="income-model-td">{getTaxableIncomeModel.epf}</td>
            </tr>
            <tr>
              <td>Gratuity</td>
              <td className="income-model-td">{getTaxableIncomeModel.gratuity}</td>
            </tr>
            <tr>
              <td>Insurance</td>
              <td className="income-model-td">{getTaxableIncomeModel.insurance}</td>
            </tr>
          </tbody>
        </table>

        <h3>HRA Calculation</h3>
        <table>
          <tbody>
            <tr>
              <td>Actual HRA received</td>
              <td className="income-model-td">{getTaxableIncomeModel.actualHra}</td>
            </tr>
            <tr>
              <td>50% of Basic Salary</td>
              <td className="income-model-td">{getTaxableIncomeModel.fiftyPercentBasic}</td>
            </tr>
            <tr>
              <td>Excess of Rent paid</td>
              <td className="income-model-td">{getTaxableIncomeModel.excessRentPaid}</td>
            </tr>
            <tr>
              <td>HRA Deduction</td>
              <td className="income-model-td">{getTaxableIncomeModel.hraDeduction}</td>
            </tr>
          </tbody>
        </table>

        <br></br>
        <table>
          <tbody>
            <tr>
              <td>Required 80C</td>
              <td>1,50,000 - EPF</td>
            </tr>
            <tr>
              <td>PPF + Education Loan</td>
              <td className="income-model-td">{getTaxableIncomeModel.required80C}</td>
            </tr>
          </tbody>
        </table>

        <h3>Taxable Income</h3>
        <table>
          <tbody>
            <tr>
              <td>Income CTC</td>
              <td className="income-model-td">{getTaxableIncomeModel.incomeCTC}</td>
            </tr>
            <tr>
              <td>Total Deductions</td>
              <td className="income-model-td">{getTaxableIncomeModel.totalDeductions}</td>
            </tr>
            <tr>
              <td>Taxable Income</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxableIncome}</td>
            </tr>
          </tbody>
        </table>

        <h3>Tax Slabs</h3>
        <table>
          <tbody>
            <tr>
              <td>5% from 2.5 to 5 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabA}</td>
            </tr>
            <tr>
              <td>20% from 5 to 10 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabB}</td>
            </tr>
            <tr>
              <td>30% for above 10 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabC}</td>
            </tr>
            <tr>
              <td>Total Income Tax</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabTotal}</td>
            </tr>
            <tr>
              <td>4% Educational Cess</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabCess}</td>
            </tr>
            <tr>
              <td>Total Tax to be Paid</td>
              <td className="income-model-td">{getTaxableIncomeModel.taxSlabToBePaid}</td>
            </tr>
          </tbody>
        </table>

        <h3>Take Home</h3>
        <table>
          <tbody>
            <tr>
              <td>Take Home - Yearly</td>
              <td className="income-model-td">{getTaxableIncomeModel.takeHomeYearly}</td>
            </tr>
            <tr>
              <td>Take Home - Monthly</td>
              <td className="income-model-td">{getTaxableIncomeModel.takeHomeMonthly}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }else if (isCalculatingTax) {
    return <div className="content">Calulating Tax to be Paid & Monthly Take Home...</div>
  } else {
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
}

export default Home;
