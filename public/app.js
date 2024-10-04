(function () {
  "use strict";

  // Globals
  var NegativeBase = {
    base: 0,
    digit: 0,
    range: [],
  };

  const convertNegativeBaseToDecimal = (base, arr = []) => {
    let total = 0;
    const reversedArr = arr.reverse();

    for (let idx = 0; idx < reversedArr.length; idx++) {
      const val = reversedArr[idx] * base ** idx;
      total += (idx + 1) % 2 ? val : -val;
    }

    return total;
  };

  const convertDecimalToNegativeBase = (base, digit, decimal) => {
    let arr = [];

    while (decimal != 0) {
      let remainder = decimal % -base;
      decimal = Math.trunc(decimal / -base);

      if (remainder < 0) {
        remainder += base;
        decimal += 1;
      }

      arr.push(remainder);
    }

    if (arr.length < digit) {
      Array.from({ length: digit - arr.length }).forEach(() => arr.push(0));
    }

    return arr.reverse().join("");
  };

  const calculate = (base, digit, number = [], number2 = []) => {
    // Splice overflow
    if (number.length > digit) {
      number = number.slice(0, digit);
    }

    if (number2.length > digit) {
      number2 = number2.slice(0, digit);
    }

    // Fill zero
    if (number.length < digit) {
      Array.from({ length: digit - number.length }).forEach(() => number.unshift(0));
    }

    if (number2.length < digit) {
      Array.from({ length: digit - number2.length }).forEach(() => number2.unshift(0));
    }

    /*
      loop until can iterate and carry is not zero
        carry := number[i] + number1[i] - Carry can be greater than 'base'
        result[i] = carry mod base - Remainder
        carry = non-fractional-part(carry / base) - Quotient

      ***PS***
      arr: [3,2,4]
      index = 0 -> 3 in programming (In programming index starts 0 to length -1 from left to right)
      index = 1 -> 4 in math (In math index starts 1 to length from right to left)

      Option 1 => Starts index from 0 and reverse array and iterate with +1
      Option 2 => Start index = array length -1 and iterate with -1
    */

    let res = [];
    let carry = 0;
    let i = digit - 1;

    while (i >= 0 || carry) {
      if (i >= 0) {
        carry += number[i];
        carry += number2[i];
      }
      res.push(carry % base);
      carry = -1 * Math.trunc(carry / base);
      i--;
    }

    const result = res.reverse();
    const decimalResult = convertNegativeBaseToDecimal(base, result);
    const range = calculateNegativeBaseRange(base, digit);

    if (range[0] <= decimalResult && decimalResult <= range[1]) {
      return result.reverse().join("");
    }

    return undefined;
  };

  const calculateNegativeBaseRange = (base, digit) => {
    let arrMin = [];
    let arrMax = [];

    for (let idx = 1; idx <= digit; idx++) {
      arrMin.push(idx % 2 ? 0 : base - 1);
      arrMax.push(idx % 2 ? base - 1 : 0);
    }

    arrMin = arrMin.reverse();
    arrMax = arrMax.reverse();

    const min = convertNegativeBaseToDecimal(base, arrMin);
    const max = convertNegativeBaseToDecimal(base, arrMax);

    setNegativeBaseRange(base, arrMin, min, arrMax, max);
    return [min, max];
  };


  const getNegativeBaseValue = () => {
    const val = document.getElementById("negative-base").value;
    if (!isNaN(val)) {
      return parseInt(val);
    }
  };

  const getNegativeBaseDigit = () => {
    const val = document.getElementById("negative-base-digit").value;
    if (!isNaN(val)) {
      return parseInt(val);
    }
  };

  const getBaseInnerHtml = (val, base, spacing = true) => {
    return `<b style="${spacing ? "letter-spacing: 0.4rem" : ""}">${val}</b><sub style='${spacing ? "letter-spacing: normal;margin-left: -0.2rem;" : ""}'>${base}</sub>`;
  };

  const setConverterDecimalResult = (res) => {
    document.getElementById("negative-base-decimal").innerHTML = getBaseInnerHtml(res, 10, false);
  };

  const setConverterNegativeBaseResult = (base, res) => {
    document.getElementById("negative-base-decimal2").innerHTML = getBaseInnerHtml(res, -base, false);
  };

  const setNegativeBaseRange = (base, arrMin, min, arrMax, max) => {
    document.getElementById("negative-base-range").innerHTML =
      `${getBaseInnerHtml(arrMin.join(""), -base)} = ${getBaseInnerHtml(min, 10, false)}  ≤  <b>X</b>  ≤  ${getBaseInnerHtml(max, 10, false)} = ${getBaseInnerHtml(arrMax.join(""), -base)}`;
  };

  const setCalculationResult = (base, resBase, resDecimal) => {
    document.getElementById("negative-base-result").innerHTML = `${getBaseInnerHtml(resBase, -base)} = ${getBaseInnerHtml(resDecimal, 10, false)}`;
  };

  const triggerCalculateResult = () => {
    const el = document.getElementById("negative-base-number-i");
    const el2 = document.getElementById("negative-base-number-ii");

    if (!isNaN(el.value) && !isNaN(el2.value)) {
      const number = el.value.split("").map((i) => parseInt(i));
      const number2 = el2.value.split("").map((i) => parseInt(i));

      const result = calculate(NegativeBase.base, NegativeBase.digit, number, number2);

      if (!isNaN(result)) {
        setCalculationResult(NegativeBase.base, result, convertNegativeBaseToDecimal(NegativeBase.base, result.split("")));
      } else {
        document.getElementById("negative-base-result").innerText = "Undefined (Out of range)";
      }
    }
  };

  const clearInputs = () => {
    let el = document.getElementById("negative-base-converter");
    el.value = (NegativeBase.base - 1).toString().repeat(NegativeBase.digit);
    setConverterDecimalResult(convertNegativeBaseToDecimal(NegativeBase.base, el.value.split("")));

    el = document.getElementById("negative-base-converter2");
    el.value = NegativeBase.range[0];

    setConverterNegativeBaseResult(NegativeBase.base, convertDecimalToNegativeBase(NegativeBase.base, NegativeBase.digit, el.value));

    el = document.getElementById("negative-base-number-i");
    // el.value = convertDecimalToNegativeBase(NegativeBase.base, NegativeBase.digit, NegativeBase.range[0]);
    el.value = "212";
    const el2 = document.getElementById("negative-base-number-ii");
    // el.value = convertDecimalToNegativeBase(NegativeBase.base, NegativeBase.digit, NegativeBase.range[1]);
    el2.value = "120";

    triggerCalculateResult();
  };

  const preventOverflow = (base, digit, event) => {
    if (event.key >= base || event.data >= base) {
      event.preventDefault();
      return false;
    }

    if (event.target.value.length >= digit || !/-?[0-9]*/g.test(event.target.value)) {
      event.preventDefault();
      return false;
    }
  };

  const initHandlers = () => {
    // Handle Negative Base changes
    document.getElementById("negative-base").addEventListener("keypress", (e) => preventOverflow(10, 2, e));
    document.getElementById("negative-base").addEventListener("change", (e) => {
      NegativeBase.base = getNegativeBaseValue();

      NegativeBase.range = calculateNegativeBaseRange(NegativeBase.base, NegativeBase.digit);
      clearInputs();
    });

    // Handle digit limit changes
    document.getElementById("negative-base-digit").addEventListener("change", (e) => {
      NegativeBase.digit = getNegativeBaseDigit();

      NegativeBase.range = calculateNegativeBaseRange(NegativeBase.base, NegativeBase.digit);
      clearInputs();
    });

    // Handle converter value changes
    document.getElementById("negative-base-converter").addEventListener("keypress", (e) => preventOverflow(NegativeBase.base, NegativeBase.digit, e));
    document.getElementById("negative-base-converter").addEventListener("change", (e) => {
      if (!isNaN(e.target.value) && e.target.value.split("")?.every((i) => parseInt(i) < NegativeBase.base)) {
        setConverterDecimalResult(convertNegativeBaseToDecimal(NegativeBase.base, e.target.value.split("")));
      } else {
        setConverterDecimalResult("Out of range");
      }
    });

    document.getElementById("negative-base-converter2").addEventListener("keypress", (e) => preventOverflow(10, 10, e));
    document.getElementById("negative-base-converter2").addEventListener("change", (e) => {
      if (!isNaN(e.target.value) && parseInt(e.target.value) >= NegativeBase.range[0] && parseInt(e.target.value) <= NegativeBase.range[1]) {
        setConverterNegativeBaseResult(NegativeBase.base, convertDecimalToNegativeBase(NegativeBase.base, NegativeBase.digit, parseInt(e.target.value)));
      } else {
        setConverterNegativeBaseResult(NegativeBase.base, "Out of range");
      }
    });

    // Handle clear click event
    document.getElementById("negative-base-converter-clear").addEventListener("click", (e) => {
      document.getElementById("negative-base-converter").value = "";
      setConverterDecimalResult(0);
    });

    document.getElementById("negative-base-converter-clear2").addEventListener("click", (e) => {
      document.getElementById("negative-base-converter2").value = "";
      setConverterDecimalResult(0);
    });

    // Handle addition click event
    document.getElementById("negative-base-number-i-clear").addEventListener("click", () => {
      document.getElementById("negative-base-number-i").value = "";
      document.getElementById("negative-base-result").innerText = "-";
    });

    document.getElementById("negative-base-number-ii-clear").addEventListener("click", () => {
      document.getElementById("negative-base-number-ii").value = "";
      document.getElementById("negative-base-result").innerText = "-";
    });

    document.getElementById("negative-base-submit").addEventListener("click", () => {
      triggerCalculateResult();
    });
  };

  const init = () => {
    NegativeBase.base = getNegativeBaseValue();
    NegativeBase.digit = getNegativeBaseDigit();
    NegativeBase.range = calculateNegativeBaseRange(NegativeBase.base, NegativeBase.digit);

    initHandlers();
    clearInputs();
  };

  init();
})();
