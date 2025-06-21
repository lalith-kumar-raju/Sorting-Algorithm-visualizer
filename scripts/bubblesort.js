const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

let comparisons = 0;
let swaps = 0;

class BubbleSort {
    constructor(array) {
        this.array = [...array];
        this.steps = [];
        this.currentStep = 0;
        comparisons = 0;
        swaps = 0;
        this.generateSteps();
    }

    generateSteps() {
        const arr = [...this.array];
        const n = arr.length;
        let sorted = Array(n).fill(false);
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [j, j + 1],
                    sorted: [...sorted],
                    message: `Comparing ${arr[j]} and ${arr[j + 1]}`
                });
                comparisons++;

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swaps++;

                    this.steps.push({
                        array: [...arr],
                        comparing: [j, j + 1],
                        sorted: [...sorted],
                        message: `Swapped ${arr[j]} and ${arr[j + 1]}`
                    });
                } else {
                    this.steps[this.steps.length - 1].message += ` - No swap needed`;
                }
            }
            
            sorted[n - i - 1] = true;
            this.steps.push({
                array: [...arr],
                comparing: [],
                sorted: [...sorted],
                message: `Element ${arr[n - i - 1]} is now in its final position`
            });
        }

        sorted[0] = true;
        this.steps.push({
            array: [...arr],
            comparing: [],
            sorted: sorted,
            message: `Array is now fully sorted!`
        });
    }

    getCurrentStep() {
        return this.steps[this.currentStep];
    }

    hasNextStep() {
        return this.currentStep < this.steps.length - 1;
    }

    nextStep() {
        if (this.hasNextStep()) {
            this.currentStep++;
            return this.getCurrentStep();
        }
        return null;
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            return this.getCurrentStep();
        }
        return null;
    }
}

const visualization = document.getElementById('visualization');
const arrayInput = document.getElementById('arrayInput');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const completeBtn = document.getElementById('completeBtn');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const speedControl = document.getElementById('sortingSpeed');
const prevBtn = document.getElementById('prevBtn');

let sorter = null;

function createBars(array) {
    visualization.innerHTML = '';
    array.forEach(value => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = value;
        visualization.appendChild(cell);
    });
}

function updateVisualization(step) {
    const cells = visualization.children;
    
    step.array.forEach((value, index) => {
        const cell = cells[index];
        cell.textContent = value;
        cell.className = 'cell';
        
        if (step.comparing.includes(index)) {
            cell.classList.add('comparing');
        }
        if (step.sorted[index]) {
            cell.classList.add('sorted');
        }
    });

    message.innerHTML = step.message.replace(/\n/g, '<br>');

    prevBtn.disabled = sorter.currentStep === 0;
    nextBtn.disabled = !sorter.hasNextStep();
    completeBtn.disabled = !sorter.hasNextStep();

    if (step.comparing.length === 0 && step.sorted.every(x => x)) {
        nextBtn.disabled = true;
        prevBtn.disabled = false;
        completeBtn.disabled = true;
        arrayInput.value = '';
        arrayInput.disabled = false;
        startBtn.disabled = false;
        createConfetti();
    }
}

function parseInput(input) {
    return input.split(/[\s,]+/).map(Number).filter(num => !isNaN(num));
}

function resetVisualization() {
    arrayInput.value = '';
    arrayInput.disabled = false;
    startBtn.disabled = false;
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    completeBtn.disabled = true;
    visualization.innerHTML = '';
    message.textContent = 'Enter numbers to start sorting visualization';
    sorter = null;
}

resetBtn.addEventListener('click', resetVisualization);

function startSorting() {
    let array = parseInput(arrayInput.value);
    
    if (array.length < 2) {
        message.textContent = 'Please enter at least 2 valid numbers';
        return;
    }

    // Enforce 8 element limit
    array = enforceArrayLimit(array);
    arrayInput.value = array.join(', ');
    
    sorter = new BubbleSort(array);
    createBars(array);
    updateVisualization(sorter.getCurrentStep());
    
    startBtn.disabled = true;
    arrayInput.disabled = true;
    nextBtn.disabled = false;
    prevBtn.disabled = true;
    completeBtn.disabled = false;
}

startBtn.addEventListener('click', startSorting);

nextBtn.addEventListener('click', () => {
    if (sorter && sorter.hasNextStep()) {
        const step = sorter.nextStep();
        updateVisualization(step);
    }
});

completeBtn.addEventListener('click', async () => {
    if (sorter) {
        while (sorter.hasNextStep()) {
            const step = sorter.nextStep();
            updateVisualization(step);
            await delay(100);
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (sorter) {
        const step = sorter.previousStep();
        if (step) {
            updateVisualization(step);
        }
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms / sortingSpeed));
}

function generateRandomArray() {
    const size = Math.min(
        parseInt(document.getElementById('arraySize').value) || 5,
        8 // Hard limit of 8 elements
    );
    const array = Array.from(
        {length: size}, 
        () => Math.floor(Math.random() * 99) + 1
    );
    arrayInput.value = array.join(', ');
}

generateBtn.addEventListener('click', generateRandomArray);
speedControl.addEventListener('input', (e) => {
    sortingSpeed = e.target.value;
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (sorter) {
        if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        }
    }
});

// Update confetti animation function
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = (Math.random() * (windowWidth - 10)) + 'px';
        
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
            { 
                transform: `translate3d(${Math.random() * 200 - 100}px,${windowHeight - 20}px,0) rotate(${Math.random() * 720}deg)`,
                opacity: 0 
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            delay: Math.random() * 1500
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Update array size limit enforcement
function enforceArrayLimit(arr) {
    return arr.slice(0, 8); // Limit to 8 elements
}



document.addEventListener("keydown", function (event) {

    if (event.ctrlKey) {

        event.preventDefault();

    }

    if (event.keyCode == 123) {

        event.preventDefault();

    }

})
document.addEventListener('contextmenu',

    event => event.preventDefault()

)