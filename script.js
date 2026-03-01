const display = document.querySelector(".answer");
const buttons = document.querySelectorAll(".buttons button");
let isBinaryMode = false;
buttons.forEach(button => {
    button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;
     if (value) {
            display.value += value;
        }

        if (action === "clear") {
            display.value = "";
        }

        if (action === "equals") {
            display.value = calculateloop(display.value);
        }
       if (action === "binary") {

    if (!isBinaryMode) {
        // Decimal → Binary
        let decimalValue = Number(display.value);
        display.value = convertToBinary(decimalValue);
        isBinaryMode = true;
    } else {
        // Binary → Decimal
        let decimalValue = convertBinaryToDecimal(display.value);
        display.value = decimalValue;
        isBinaryMode = false;
    }
 }
 if (action === "delete") {
    display.value = display.value.slice(0, -1);
 }
    });
});

function calculateloop(expr) {
    const tokens= [];
    let number= "";
    let operators= "+-*/()";

 for (let i = 0; i < expr.length; i++) {
    let char = expr[i];
    
     if (!isNaN(char) || char === ".") {
            number += char;
        }

        // If operator
        else if (operators.includes(char)) {

            // push completed number first
            if (number !== "") {
                tokens.push(number);
                number = "";
            }

            tokens.push(char);
        }
    }

    // Push last number
    if (number !== "") {
        tokens.push(number);
    }
   
   let postfix = IntoPostfix(tokens);
   
    let result = evaluatePostfix(postfix);
   
    return result;
}

function Num2Binary(num, bits = 8) {
   num = Number(num);
    if (num === 0) {
        return "0".padStart(bits, "0");
    }
     if (num < 0) {
        return "-" + Num2Binary(-num);

    }

   
    let binary = "";

   
    while (num > 0) {
        binary = (num % 2) + binary;
        num = Math.floor(num / 2);
    }
     while (binary.length < bits) {
        binary = "0" + binary;
    }
    if (num >= 0) {
        return binary;
    }
    let inverted = "";
    for (let i = 0; i < binary.length; i++) {
        inverted += binary[i] === "0" ? "1" : "0";
    }
     let result = "";
    let carry = 1;

    for (let i = bits - 1; i >= 0; i--) {
        let bit = inverted[i] === "1" ? 1 : 0;

        let sum = bit + carry;

        if (sum === 2) {
            result = "0" + result;
            carry = 1;
        } else if (sum === 1) {
            result = "1" + result;
            carry = 0;
        } else {
            result = "0" + result;
            carry = 0;
        }
    }

    return result;
}

   
   
function IntoPostfix(tokens) {
    let output = [];
    let stack = [];
    let precedence = (op) => {
        if (op === "+" || op === "-") return 1;
        if (op === "*" || op === "/") return 2;
        return 0;
    }

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (!isNaN(token)) {
            output.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop(); // Pop the "("
        } else {
            while (stack.length > 0 && precedence(token) <= precedence(stack[stack.length - 1])) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }
    console.log(output);
    evaluatePostfix(output);
    return output;
    
    }
    function evaluatePostfix(postfix) {
    let stack = []; 
    for (let i = 0; i < postfix.length; i++) {
        let token = postfix[i];
        if (!isNaN(token)) {
            stack.push(Number(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();
            if (token === "+") {
                stack.push(a + b);
            } else if (token === "-") {
                stack.push(a - b);
            } else if (token === "*") {
                stack.push(a * b);
            } else if (token === "/") {
                stack.push(a / b);
            }
        }
    }
    console.log(stack[0]);
    return stack[0];
}
function convertToBinary(num, bits = 8) {

    let isNegative = num < 0;

    if (isNegative) {
        num = -num;   // work with absolute value
    }

    let binary = "";

    while (num > 0) {
        binary = (num % 2) + binary;
        num = Math.floor(num / 2);
    }

    while (binary.length < bits) {
        binary = "0" + binary;
    }

    if (!isNegative) {
        return binary;
    }

    // 2's complement
    let inverted = "";
    for (let i = 0; i < bits; i++) {
        inverted += binary[i] === "0" ? "1" : "0";
    }

    let result = "";
    let carry = 1;

    for (let i = bits - 1; i >= 0; i--) {
        let bit = inverted[i] === "1" ? 1 : 0;
        let sum = bit + carry;

        if (sum === 2) {
            result = "0" + result;
            carry = 1;
        } else if (sum === 1) {
            result = "1" + result;
            carry = 0;
        } else {
            result = "0" + result;
            carry = 0;
        }
    }

    return result;
}
function convertBinaryToDecimal(binaryStr) {

    let isNegative = binaryStr[0] === "1"; // assume 2’s complement

    if (!isNegative) {
        let decimal = 0;
        let power = 1;

        for (let i = binaryStr.length - 1; i >= 0; i--) {
            if (binaryStr[i] === "1") {
                decimal += power;
            }
            power *= 2;
        }

        return decimal;
    }

    // If negative (2’s complement)
    // Step 1: subtract 1
    let result = "";
    let borrow = 1;

    for (let i = binaryStr.length - 1; i >= 0; i--) {
        let bit = binaryStr[i] === "1" ? 1 : 0;

        if (bit - borrow < 0) {
            result = "1" + result;
            borrow = 1;
        } else {
            result = (bit - borrow) + result;
            borrow = 0;
        }
    }

    // Step 2: invert bits
    let inverted = "";
    for (let i = 0; i < result.length; i++) {
        inverted += result[i] === "0" ? "1" : "0";
    }

    // Step 3: convert positive part
    let decimal = 0;
    let power = 1;

    for (let i = inverted.length - 1; i >= 0; i--) {
        if (inverted[i] === "1") {
            decimal += power;
        }
        power *= 2;
    }

    return -decimal;
}