let display = document.getElementById('result');
let currentInput = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points in a number
    if (value === '.' && display.value.includes('.') && !isOperator(display.value.slice(-1))) {
        const lastNumber = display.value.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes('.')) {
            return;
        }
    }
    
    // Prevent multiple operators in a row
    if (isOperator(value) && isOperator(display.value.slice(-1))) {
        return;
    }
    
    display.value += value;
    currentInput = display.value;
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function calculate() {
    try {
        if (display.value === '') return;
        
        // Replace × with * for evaluation
        let expression = display.value.replace(/×/g, '*');
        
        // Basic validation to prevent arbitrary code execution
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        let result = eval(expression);
        
        // Handle division by zero and other math errors
        if (!isFinite(result)) {
            throw new Error('Math Error');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Math Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    currentInput = display.value;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*') {
        appendToDisplay(key);
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser shortcut
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Prevent form submission on Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});