
import React, { useState } from "react";
import logo from '../images/h2-logo.png';

import { TaxableIncomeModel } from '../entities/TaxableIncomeModel';
import NumberFormat from 'react-number-format';


import "../App.css"

// const RENT_PAID = 99600; //99,600
const STANDARD_DEDUCTIONS = 50000; //50,000
const MAX_DEDUCTIONS_80C = 150000; //1,50,000

const MAX_DEDUCTIONS_80EEB_EV  = 150000; //1.5 L - Interest Paid on Electric Vehicle Loan
const MAX_DEDUCTIONS_80CCD_NPS =  50000; //50 K - National Pension Scheme
const MAX_DEDUCTIONS_HOME_LOAN = 200000; //2.0 L

const SLAB_A_START =  250000; //2,50,000
const SLAB_B_START =  500000; //5,00,000
const SLAB_C_START = 1000000; //10,00,000

const SLAB_A_TAX = 0.05; //5%
const SLAB_B_TAX = 0.20; //20%
const SLAB_C_TAX = 0.30; //30%

// 2022
const NEW_SLAB_2022_A_START =  250000; // 2.5 L
const NEW_SLAB_2022_B_START =  500000; // 5.0 L
const NEW_SLAB_2022_C_START =  750000; // 7.5 L
const NEW_SLAB_2022_D_START = 1000000; //10.0 L
const NEW_SLAB_2022_E_START = 1250000; //12.5 L
const NEW_SLAB_2022_F_START = 1500000; //15.0 L

// 2022
const NEW_SLAB_2022_A_TAX = 0.05; // 5%
const NEW_SLAB_2022_B_TAX = 0.10; //10%
const NEW_SLAB_2022_C_TAX = 0.15; //15%
const NEW_SLAB_2022_D_TAX = 0.20; //20%
const NEW_SLAB_2022_E_TAX = 0.25; //25%
const NEW_SLAB_2022_F_TAX = 0.30; //30%

const KEY_LOCAL_STORAGE = 'h2-take-home-input';

function getUserInput(elemId) {
  return Number(document.getElementById(elemId).value.split(',').join(''));
}

function setUserInput(elemId, elemValue) {
  var element = document.getElementById(elemId);
  if (element) {
    element.value = elemValue;
  } else {
    console.error('No element found for ' + elemId);
  }
}

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

function updateTotalCTC() {
  const baseSalary = getUserInput('h2-base-salary');
  const hra = getUserInput('h2-hra-allowance');
  const otherAllowance = getUserInput('h2-other-allowance');
  const epf = getUserInput('h2-epf');
  const gratuity = getUserInput('h2-gratuity');
  const insurance = getUserInput('h2-insurance');
  const totalCTCInput = baseSalary + hra + otherAllowance + epf + gratuity + insurance;
  document.getElementById('h2-total-ctc-inp').value = totalCTCInput;
}

const H2SalaryInput = (props) => {
  const inputKey = props.name;
  const inputId = props.id;

  return (
    <tr>
      <td>
        <label className="h2-input-lbl">{inputKey}</label>
      </td>
      <td>
        <NumberFormat id={inputId} className="h2-number-input" value={0}
          onValueChange={() => updateTotalCTC()}
          thousandSeparator={true} thousandsGroupStyle='lakh'/>
      </td>
    </tr>
  );
}

const H2ExemptionInput = (props) => {
  const inputKey = props.name;
  const inputId = props.id;

  return (
    <tr>
      <td>
        <label className="h2-input-lbl">{inputKey}</label>
      </td>
      <td>
        <NumberFormat id={inputId} className="h2-number-input" value={0} 
            thousandSeparator={true} thousandsGroupStyle='lakh'/>
      </td>
    </tr>
  );
}

function loadLastInput(h2IncomeModel) {
  setUserInput('h2-base-salary', h2IncomeModel.baseSalary);
  setUserInput('h2-hra-allowance', h2IncomeModel.hra);
  setUserInput('h2-other-allowance', h2IncomeModel.otherAllowance);
  setUserInput('h2-epf', h2IncomeModel.epf);
  setUserInput('h2-gratuity', h2IncomeModel.gratuity);
  setUserInput('h2-insurance', h2IncomeModel.insurance);

  setUserInput('h2-house-rent-paid', h2IncomeModel.houseRendPaid);
  setUserInput('h2-loan-interest-education', h2IncomeModel.exemptionInterestEducation);
  setUserInput('h2-loan-interest-home', h2IncomeModel.exemptionInterestHome);
  setUserInput('h2-loan-interest-vehicle', h2IncomeModel.exemptionInterestEV);
  setUserInput('h2-national-pension-scheme', h2IncomeModel.exemptionNPS);
  setUserInput('h2-exemption-80c', h2IncomeModel.exemption80C);

  updateTotalCTC();
}

function Home() {
  const [isTaxCalculated, setTaxCalculated] = useState(false);
  const [isCalculatingTax, setCalculatingTax] = useState(false);

  const [getTaxableIncomeModel, setTaxableIncomeModel] = useState(new TaxableIncomeModel());

  function loadLocalStorage() {
    const existLocalStorage = localStorage.getItem(KEY_LOCAL_STORAGE);
    if (existLocalStorage) {
      const localStorageJson = JSON.parse(existLocalStorage);
      loadLastInput(localStorageJson);
      alert('The exisitng user input values from localStorage loaded successfully');
    } else {
      alert('No localStorage available');
    }
  }

  function saveLocalStorage() {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(getTaxableIncomeModel));
    alert('The current user input values saved in localStorage');
  }

  const editTaxIput = async event => {
    calculateNewTax();
    await delay(1000);
    loadLastInput(getTaxableIncomeModel);
  };

  function calculateNewTax() {
    setTaxCalculated(false);
  }

  function calculateTax() {
    // CTC Inputs
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

    // Exemption Inputs
    const houseRendPaid = getUserInput('h2-house-rent-paid');

    const exemptionInterestEducation = getUserInput('h2-loan-interest-education');

    const homeLoan = getUserInput('h2-loan-interest-home');
    const exemptionInterestHome = (homeLoan >= MAX_DEDUCTIONS_HOME_LOAN) ? MAX_DEDUCTIONS_HOME_LOAN : homeLoan;

    const ev = getUserInput('h2-loan-interest-vehicle');
    const exemptionInterestEV = (ev >= MAX_DEDUCTIONS_80EEB_EV) ? MAX_DEDUCTIONS_80EEB_EV : ev;

    const nps = getUserInput('h2-national-pension-scheme');
    const exemptionNPS = (nps >= MAX_DEDUCTIONS_80CCD_NPS) ? MAX_DEDUCTIONS_80CCD_NPS : nps;

    const exemptionInput = getUserInput('h2-exemption-80c');
    const exemption80C = (exemptionInput >= MAX_DEDUCTIONS_80C) ? MAX_DEDUCTIONS_80C : exemptionInput;

    var taxableIncomeModel = new TaxableIncomeModel();
    taxableIncomeModel.baseSalary = getReadableValue(baseSalary);
    taxableIncomeModel.hra = getReadableValue(hra);
    taxableIncomeModel.otherAllowance = getReadableValue(otherAllowance);
    taxableIncomeModel.epf = getReadableValue(epf);
    taxableIncomeModel.gratuity = getReadableValue(gratuity);
    taxableIncomeModel.insurance = getReadableValue(insurance);
    taxableIncomeModel.totalCTC = getReadableValue(totalCTCInput);

    taxableIncomeModel.houseRendPaid = getReadableValue(houseRendPaid);
    taxableIncomeModel.exemptionInterestEducation = getReadableValue(exemptionInterestEducation);
    taxableIncomeModel.exemptionInterestHome = getReadableValue(exemptionInterestHome);
    taxableIncomeModel.exemptionInterestEV = getReadableValue(exemptionInterestEV);
    taxableIncomeModel.exemptionNPS = getReadableValue(exemptionNPS);
    taxableIncomeModel.exemption80C = getReadableValue(exemption80C);

    const hraA = hra;
    const hraB = (baseSalary * 0.4);
    const tenPercentBasic = (baseSalary * 0.1);
    const hraC = (houseRendPaid > tenPercentBasic) ? (houseRendPaid - tenPercentBasic) : 0;
    const hraDeduction = getHraDeduction(hraA, hraB, hraC);

    taxableIncomeModel.actualHra = getReadableValue(hraA);
    taxableIncomeModel.fiftyPercentBasic = getReadableValue(hraB);
    taxableIncomeModel.excessRentPaid = getReadableValue(hraC);
    taxableIncomeModel.hraDeduction = getReadableValue(hraDeduction);

    taxableIncomeModel.standardDeduction = getReadableValue(STANDARD_DEDUCTIONS);

    const totalExemption = exemption80C + exemptionNPS + exemptionInterestHome + exemptionInterestEducation + exemptionInterestEV;
    taxableIncomeModel.totalExemption = getReadableValue(totalExemption);

    const totalIncomeCTC = baseSalary + hra + otherAllowance;
    const totalDeductions = hraDeduction + totalExemption + STANDARD_DEDUCTIONS;
    const totalTaxableIncome = (totalIncomeCTC > totalDeductions) ? (totalIncomeCTC - totalDeductions) : 0;
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

    var newSlab2022A = 0;
    var newSlab2022B = 0;
    var newSlab2022C = 0;
    var newSlab2022D = 0;
    var newSlab2022E = 0;
    var newSlab2022F = 0;

    if (totalIncomeCTC > NEW_SLAB_2022_A_START) {
      if (totalIncomeCTC < NEW_SLAB_2022_B_START) {
        // Above Rs.2.50 - Rs.5 lakh
        // 5% of the total income that is more than Rs.2.5 lakh
        newSlab2022A = (totalIncomeCTC - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
      } else if (totalIncomeCTC < NEW_SLAB_2022_C_START) {
        // Above Rs.5 lakh - Rs.7.50 lakh
        // 10% of the total income that is more than Rs.5 lakh + Rs.12,500
        newSlab2022A = (NEW_SLAB_2022_B_START - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
        newSlab2022B = (totalIncomeCTC - NEW_SLAB_2022_B_START) * NEW_SLAB_2022_B_TAX;
      } else if (totalIncomeCTC < NEW_SLAB_2022_D_START) {
        // Above Rs.7.50 lakh - Rs.10 lakh
        // 15% of the total income that is more than Rs.7.5 lakh + Rs.37,500
        newSlab2022A = (NEW_SLAB_2022_B_START - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
        newSlab2022B = (NEW_SLAB_2022_C_START - NEW_SLAB_2022_B_START) * NEW_SLAB_2022_B_TAX;
        newSlab2022C = (totalIncomeCTC - NEW_SLAB_2022_C_START) * NEW_SLAB_2022_C_TAX;
      } else if (totalIncomeCTC < NEW_SLAB_2022_E_START) {
        // Above Rs.10 lakh - Rs.12.50 lakh
        // 20% of the total income that is more than Rs.10 lakh + Rs.75,000
        newSlab2022A = (NEW_SLAB_2022_B_START - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
        newSlab2022B = (NEW_SLAB_2022_C_START - NEW_SLAB_2022_B_START) * NEW_SLAB_2022_B_TAX;
        newSlab2022C = (NEW_SLAB_2022_D_START - NEW_SLAB_2022_C_START) * NEW_SLAB_2022_C_TAX;
        newSlab2022D = (totalIncomeCTC - NEW_SLAB_2022_D_START) * NEW_SLAB_2022_D_TAX;
      } else if (totalIncomeCTC < NEW_SLAB_2022_F_START) {
        // Above Rs.12.50 - Rs.15 lakh
        // 25% of the total income that is more than Rs.12.5 lakh + Rs.1,25,000
        newSlab2022A = (NEW_SLAB_2022_B_START - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
        newSlab2022B = (NEW_SLAB_2022_C_START - NEW_SLAB_2022_B_START) * NEW_SLAB_2022_B_TAX;
        newSlab2022C = (NEW_SLAB_2022_D_START - NEW_SLAB_2022_C_START) * NEW_SLAB_2022_C_TAX;
        newSlab2022D = (NEW_SLAB_2022_E_START - NEW_SLAB_2022_D_START) * NEW_SLAB_2022_D_TAX;
        newSlab2022E = (totalIncomeCTC - NEW_SLAB_2022_E_START) * NEW_SLAB_2022_E_TAX;
      } else {
        // Above Rs.15 lakh
        // 30% of the total income that is more than Rs.15 lakh + Rs.1,87,500
        newSlab2022A = (NEW_SLAB_2022_B_START - NEW_SLAB_2022_A_START) * NEW_SLAB_2022_A_TAX;
        newSlab2022B = (NEW_SLAB_2022_C_START - NEW_SLAB_2022_B_START) * NEW_SLAB_2022_B_TAX;
        newSlab2022C = (NEW_SLAB_2022_D_START - NEW_SLAB_2022_C_START) * NEW_SLAB_2022_C_TAX;
        newSlab2022D = (NEW_SLAB_2022_E_START - NEW_SLAB_2022_D_START) * NEW_SLAB_2022_D_TAX;
        newSlab2022E = (NEW_SLAB_2022_F_START - NEW_SLAB_2022_E_START) * NEW_SLAB_2022_E_TAX;
        newSlab2022F = (totalIncomeCTC - NEW_SLAB_2022_F_START) * NEW_SLAB_2022_F_TAX;
      }
    }
    const newSlab2022Total = newSlab2022A + newSlab2022B + newSlab2022C + newSlab2022D + newSlab2022E + newSlab2022F;

    taxableIncomeModel.newTaxSlab2022A = getReadableValue(newSlab2022A);
    taxableIncomeModel.newTaxSlab2022B = getReadableValue(newSlab2022B);
    taxableIncomeModel.newTaxSlab2022C = getReadableValue(newSlab2022C);
    taxableIncomeModel.newTaxSlab2022D = getReadableValue(newSlab2022D);
    taxableIncomeModel.newTaxSlab2022E = getReadableValue(newSlab2022E);
    taxableIncomeModel.newTaxSlab2022F = getReadableValue(newSlab2022F);
    taxableIncomeModel.newTaxSlab2022Total = getReadableValue(newSlab2022Total);

    const takeHome = (totalIncomeCTC - slabTaxToBePaid);
    taxableIncomeModel.takeHomeYearly = getReadableValue(takeHome);
    taxableIncomeModel.takeHomeMonthly = getReadableValue(takeHome / 12);

    const newTakeHome = (totalIncomeCTC - newSlab2022Total);
    taxableIncomeModel.newTakeHomeYearly = getReadableValue(newTakeHome);
    taxableIncomeModel.newTakeHomeMonthly = getReadableValue(newTakeHome / 12);

    setTaxableIncomeModel(taxableIncomeModel);

    setCalculatingTax(false);
    setTaxCalculated(true);
  }

  function getHraDeduction(hraA, hraB, hraC) {
    if (hraC === 0) {
      return 0;
    }

    // if ((hraA === 0) && (hraC === 0)) {
    //   return hraB;
    // }

    if (hraA === 0) {
      if (hraB < hraC) {
        return hraB;
      } else {
        return hraC;
      }
    }

    // if (hraC === 0) {
    //   if (hraA < hraB) {
    //     return hraA;
    //   } else {
    //     return hraB;
    //   }
    // }

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
              <td colSpan="3" className="h2-headed-td"><b>HRA Deductions</b></td>
            </tr>
            <tr>
              <td>B1</td>
              <td>Actual HRA received (A2)</td>
              <td className="income-model-td">{getTaxableIncomeModel.actualHra}</td>
            </tr>
            <tr>
              <td>B2</td>
              <td>40% of Basic Salary (A1)</td>
              <td className="income-model-td">{getTaxableIncomeModel.fiftyPercentBasic}</td>
            </tr>
            <tr>
              <td>B3</td>
              <td>Excess of Rent paid (Actual - 10% of A1)</td>
              <td className="income-model-td">{getTaxableIncomeModel.excessRentPaid}</td>
            </tr>
            <tr>
              <td>B4</td>
              <td>HRA Deduction (Minimum of B1, B2, B3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.hraDeduction}</td>
            </tr>
            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Other Deductions</b></td>
            </tr>
            <tr>
              <td>C1</td>
              <td>80 C (1.5 L max)</td>
              <td className="income-model-td">{getTaxableIncomeModel.exemption80C}</td>
            </tr>
            <tr>
              <td>C2</td>
              <td>80CCD - NPS Contribution from Employee (50 K max)</td>
              <td className="income-model-td">{getTaxableIncomeModel.exemptionNPS}</td>
            </tr>
            <tr>
              <td>C3</td>
              <td>Interest Paid on Home Loan (2.0 L max)</td>
              <td className="income-model-td">{getTaxableIncomeModel.exemptionInterestHome}</td>
            </tr>
            <tr>
              <td>C4</td>
              <td>80 EEB - Interest Paid on Electric Vehicle Loan (1.5 L max)</td>
              <td className="income-model-td">{getTaxableIncomeModel.exemptionInterestEV}</td>
            </tr>
            <tr>
              <td>C5</td>
              <td>80 E - Interest Paid on Education Loan</td>
              <td className="income-model-td">{getTaxableIncomeModel.exemptionInterestEducation}</td>
            </tr>
            <tr>
              <td>C6</td>
              <td>Total Exemptions</td>
              <td className="income-model-td">{getTaxableIncomeModel.totalExemption}</td>
            </tr>
            <tr>
              <td>C7</td>
              <td>Default Standard Deductions</td>
              <td className="income-model-td">{getTaxableIncomeModel.standardDeduction}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Taxable Income</b></td>
            </tr>
            <tr>
              <td>D1</td>
              <td>Income CTC (A1 + A2 + A3)</td>
              <td className="income-model-td">{getTaxableIncomeModel.incomeCTC}</td>
            </tr>
            <tr>
              <td>D2</td>
              <td>Total Deductions (B4 + C6 + C7)</td>
              <td className="income-model-td">{getTaxableIncomeModel.totalDeductions}</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>Taxable Income (D1 - D2)</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.taxableIncome}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Old Tax Regime</b> for Taxable Income : {getTaxableIncomeModel.taxableIncome} (D3)</td>
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
              <td colSpan="3" className="h2-headed-td"><b>2022-23 New Tax Regime</b> for CTC Income : {getTaxableIncomeModel.incomeCTC} (D1)</td>
            </tr>
            <tr>
              <td>F1</td>
              <td>5% from 2.5 to 5 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022A}</td>
            </tr>
            <tr>
              <td>F2</td>
              <td>10% from 5 to 7.5 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022B}</td>
            </tr>
            <tr>
              <td>F3</td>
              <td>15% from 7.5 to 10 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022C}</td>
            </tr>
            <tr>
              <td>F4</td>
              <td>20% from 10 to 12.5 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022D}</td>
            </tr>
            <tr>
             <td>F5</td>
              <td>25% from 12.5 to 15 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022E}</td>
            </tr>
            <tr>
             <td>F6</td>
              <td>30% for above 15 lakhs</td>
              <td className="income-model-td">{getTaxableIncomeModel.newTaxSlab2022F}</td>
            </tr>
            <tr>
              <td>F7</td>
              <td>Total Income Tax (F1 + F2 + F3 + F4 + F5)</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.newTaxSlab2022Total}</td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Monthly Take Home</b></td>
            </tr>
            <tr>
              <td>H1</td>
              <td>Old Tax Regime (D1 - E6) = {getTaxableIncomeModel.takeHomeYearly}</td>
              <td className="income-model-td">{getTaxableIncomeModel.takeHomeMonthly}</td>
            </tr>
            <tr>
              <td>H2</td>
              <td>2022-23 New Tax Regime (D1 - F7) = {getTaxableIncomeModel.newTakeHomeYearly}</td>
              <td className="income-model-td h2-bgcolor-td">{getTaxableIncomeModel.newTakeHomeMonthly}</td>
            </tr>
          </tbody>
        </table>
        <div className="h2-button-div">
            <button className="h2-tax-btn" onClick={editTaxIput}>Edit Input</button>
            <button className="h2-tax-btn" onClick={saveLocalStorage}>Save localStorage</button>
            <button className="h2-tax-btn" onClick={calculateNewTax}>Calculate New</button>
        </div>
      </div>
    );
  }else if (isCalculatingTax) {
    return <div className="content">Calulating Tax to be Paid & Monthly Take Home...</div>
  } else {
    return (
      <div>
        <table className = "h2-salary-input-div">
          <tbody>
            <tr>
              <td colSpan="3" className="h2-headed-td"><b>CTC Input</b></td>
            </tr>
            <H2SalaryInput name="Basic Salary *" id="h2-base-salary" stateKey="h2baseSalary"/>
            <H2SalaryInput name="HRA" id="h2-hra-allowance" stateKey="h2Hra"/>
  
            <H2SalaryInput name="All Other Allowances (Part-A)" id="h2-other-allowance" stateKey="h2OtherAllowance"/>
  
            <H2SalaryInput name="EPF" id="h2-epf" stateKey="h2Epf"/>
            <H2SalaryInput name="Gratuity" id="h2-gratuity" stateKey="h2Gratuity"/>
            <H2SalaryInput name="Insurance" id="h2-insurance" stateKey="h2Insurance"/>

            <tr>
              <td>
              <label className="h2-input-lbl">Total CTC input</label>
              </td>
              <td>
              <NumberFormat id="h2-total-ctc-inp" className="h2-number-input" value={0} disabled
                  thousandSeparator={true} thousandsGroupStyle='lakh'/>
              </td>
            </tr>

            <tr>
              <td colSpan="3" className="h2-headed-td"><b>Exemptions Declaration</b></td>
            </tr>
            <H2ExemptionInput name="House Rent Paid" id="h2-house-rent-paid" stateKey="h2houseRentPaid"/>
            <H2ExemptionInput name="Interest Paid on Education Loan" id="h2-loan-interest-education" stateKey="h2LoanInterestEducation"/>
            <H2ExemptionInput name="Interest Paid on Home Loan (max - 2 L)" id="h2-loan-interest-home" stateKey="h2LoanInterestHome"/>
            <H2ExemptionInput name="Interest Paid on Electric Vehicle Loan (max - 1.5 L)" id="h2-loan-interest-vehicle" stateKey="h2LoanInterestVehicle"/>
            <H2ExemptionInput name="NPS Contribution from Employee (max - 50 K)" id="h2-national-pension-scheme" stateKey="h2ExemptionNPS"/>
            <H2ExemptionInput name="80 C (max - 1.5 L)" id="h2-exemption-80c" stateKey="h2Exemption80C"/>

            <tr>
              <td>
              <button className="h2-tax-btn" onClick={loadLocalStorage}>Load Last Input</button>
              </td>
              <td>
              <button className="h2-tax-btn" onClick={calculateTax}>Calculate</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className = "h2p-center-flex">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
    );
    }
}

export default Home;
