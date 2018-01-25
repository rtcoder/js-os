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
            console.log(newCalc);
        }
        calc = newCalc;
        newCalc = [];
    }
    if (calc.length > 1) {
        console.log('Error: unable to resolve calculation');
        return calc;
    } else {
        return calc[0];
    }
}
$(".CalcKey").click(function () {
    let id = $(this).attr("id"),
            char = $(this).text();
    if (id !== "tool5" && id !== "extra2") {
        let inputVal = $("input#result").val();
        $("input#result").val(inputVal + char);
    } else {
        switch (id) {
            case "tool5":
                let inputVal = calculate(parseCalculationString($("input#result").val()));
                inputVal = inputVal.toString();
                if (isNaN(inputVal)) {
                    inputVal = "Error";
                }
                if (inputVal.indexOf('.') >= 0) {
                    let arr = inputVal.split('.');
                    arr[1] = arr[1].substr(0, 2);
                    inputVal = arr.join('.');
                }
                $("input#result").val(inputVal);
                break;
            case "extra2":
                $("input#result").val("");
                break;
        }
    }
    $(this).blur();
    $('#result').focus();
});
$("#result").keyup(function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 13://enter
            $("#tool5").click();
            break;
        case 108://num dot
            $("#numDot").click();
            break;
        default:
            return false;
    }
});