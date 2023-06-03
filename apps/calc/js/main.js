(()=>{
    const inputResult = document.querySelector("input#result");
    const numKeyboard = document.querySelector("#keyboardNum");
    const calc = document.querySelector("#calc");
    const buttons = document.querySelectorAll('button');

    function parseCalculationString(s) {
        // --- Parse a calculation string into an array of numbers and operators
        let calculation = [],
            current = '';
        for (let i = 0, ch; ch = s.charAt(i); i++) {
            if ('^*/+-'.indexOf(ch) > -1) {
                if (current === '' && ch === '-') {
                    current = '-';
                } else {
                    calculation.push(parseFloat(current), ch);
                    current = '';
                }
            } else {
                current += s.charAt(i);
            }
        }
        if (current !== '') {
            calculation.push(parseFloat(current));
        }
        return calculation;
    }

    function calculate(calc) {
        // --- Perform a calculation expressed as an array of operators and numbers
        let ops = [{'^': (a, b) => Math.pow(a, b)},
                {'*': (a, b) => a * b, '/': (a, b) => a / b},
                {'+': (a, b) => a + b, '-': (a, b) => a - b}],
            newCalc = [],
            currentOp;

        for (let i = 0; i < ops.length; i++) {
            for (let j = 0; j < calc.length; j++) {
                if (ops[i][calc[j]]) {
                    currentOp = ops[i][calc[j]];
                } else if (currentOp) {
                    newCalc[newCalc.length - 1] =
                        currentOp(newCalc[newCalc.length - 1], calc[j]);
                    currentOp = null;
                } else {
                    newCalc.push(calc[j]);
                }
            }
            calc = newCalc;
            newCalc = [];
        }

        if (!calc.length) {
            return 0;
        }

        if (calc.length > 1) {
            console.log('Error: unable to resolve calculation');
            return calc;
        }

        return calc[0];
    }

    function blurKeys() {
        buttons.forEach(el => el.blur());
    }

    function clickKey(key) {
        blurKeys();
        document.querySelector(`button[data-key="${key}"]`)?.focus();
        document.querySelector(`button[data-key="${key}"]`)?.click();
    }

    numKeyboard.addEventListener('click', e => {
        const {target} = e;
        if (!target.classList.contains('CalcKey')) {
            return;
        }
        const inputValue = inputResult.value;
        const id = target.getAttribute('id');
        const char = target.innerText;
        if (!["tool5", "extra2", 'extra1'].includes(id)) {
            inputResult.value = inputValue + char;
            return;
        }
        if (id === 'tool5') {
            let inputVal = calculate(parseCalculationString(inputValue));
            inputVal = inputVal.toString();
            if (isNaN(inputVal)) {
                inputVal = "Error";
            }
            if (inputVal.indexOf('.') >= 0) {
                let arr = inputVal.split('.');
                arr[1] = arr[1].substr(0, 2);
                inputVal = arr.join('.');
            }
            inputResult.value = inputVal;
            return;
        }
        if (id === 'extra2') {
            inputResult.value = '';
            return;
        }
        if (id === 'extra1') {
            inputResult.value = inputValue.replace(/.$/, '');
        }
    })
    calc.addEventListener("keydown", e => {
        clickKey(e.key)
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            clickKey('=');
        }
    })
    calc.addEventListener("keyup", blurKeys);
    calc.addEventListener("mouseup", blurKeys);
})()
