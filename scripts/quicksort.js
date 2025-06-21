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

class QuickSort {
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
        this.quickSort(arr, 0, arr.length - 1);
        
        this.steps.push({
            array: [...arr],
            comparing: [],
            sorted: Array(arr.length).fill(true),
            message: `
                <div class="message-content">
                    <div class="step"><strong>Sorting Complete!</strong></div>
                    <div class="step">Quick Sort finished (${comparisons} comparisons, ${swaps} swaps)</div>
                    <div class="step">Array is fully sorted</div>
                </div>
            `
        });
    }

    partition(arr, low, high) {
        const pivotIndex = Math.floor((low + high) / 2);
        const pivot = arr[pivotIndex];
        
        [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
        swaps++;
        this.steps.push({
            array: [...arr],
            comparing: [pivotIndex, high],
            sorted: this.getSortedArray(arr.length),
            message: `
                <div class="message-content">
                    <div class="step"><strong>Pivot Selection➡️</strong></div>
                    <div class="step">Selected ${pivot} as pivot</div>
                    <div class="step">Moving pivot to end</div>
                </div>
            `
        });

        let i = low;
        
        // Partition around pivot
        for (let j = low; j < high; j++) {
            comparisons++;
            this.steps.push({
                array: [...arr],
                comparing: [j, high],
                sorted: this.getSortedArray(arr.length),
                message: `
                    <div class="message-content">
                        <div class="step"><strong>Comparing Elements➡️</strong></div>
                        <div class="step">Comparing ${arr[j]} with pivot ${pivot}</div>
                        <div class="step">Elements smaller than ${pivot} go to the left</div>
                        <div class="step">Elements larger than ${pivot} stay in place</div>
                    </div>
                `
            });

            if (arr[j] < pivot) {
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    swaps++;
                    this.steps.push({
                        array: [...arr],
                        comparing: [i, j],
                        sorted: this.getSortedArray(arr.length),
                        message: `
                            <div class="message-content">
                                <div class="step"><strong>Swapping Elements➡️</strong></div>
                                <div class="step">${arr[i]} is smaller than pivot ${pivot}</div>
                                <div class="step">Moving ${arr[i]} to the left side (position ${i})</div>
                                <div class="step">This helps organize elements around the pivot</div>
                            </div>
                        `
                    });
                }
                i++;
            }
        }

        // Place pivot in its final position
        [arr[i], arr[high]] = [arr[high], arr[i]];
        swaps++;
        this.steps.push({
            array: [...arr],
            comparing: [i, high],
            sorted: this.getSortedArray(arr.length),
            message: `
                <div class="message-content">
                    <div class="step"><strong>Pivot Placement➡️</strong></div>
                    <div class="step">Moving pivot ${pivot} to its final position (index ${i})</div>
                    <div class="step">All elements to the left are smaller than ${pivot}</div>
                    <div class="step">All elements to the right are larger than ${pivot}</div>
                    <div class="step">${pivot} is now in its correct sorted position!</div>
                </div>
            `
        });

        return i;
    }

    quickSort(arr, low, high) {
        if (low < high) {
            this.steps.push({
                array: [...arr],
                comparing: [low, high],
                sorted: this.getSortedArray(arr.length),
                message: `
                    <div class="message-content">
                        <div class="step"><strong>New Partition➡️</strong></div>
                        <div class="step">Working on indices ${low} to ${high}</div>
                        <div class="step">Organizing elements</div>
                    </div>
                `
            });

            const pivotIndex = this.partition(arr, low, high);

            // Mark pivot position as sorted
            const sortedArray = this.getSortedArray(arr.length);
            sortedArray[pivotIndex] = true;
            this.steps.push({
                array: [...arr],
                comparing: [],
                sorted: sortedArray,
                message: `
                    <div class="message-content">
                        <div class="step"><strong>Partition Complete➡️</strong></div>
                        <div class="step">Element ${arr[pivotIndex]} is now in its final position</div>
                        <div class="step">Left side contains all smaller elements</div>
                        <div class="step">Right side contains all larger elements</div>
                        <div class="step">Will now recursively sort both sides</div>
                    </div>
                `
            });

            // Recursively sort sub-arrays
            this.quickSort(arr, low, pivotIndex - 1);  // Sort left side
            this.quickSort(arr, pivotIndex + 1, high); // Sort right side
        }
    }

    getSortedArray(length) {
        return Array(length).fill(false);
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

    array = enforceArrayLimit(array);
    arrayInput.value = array.join(', ');
    
    sorter = new QuickSort(array);
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

function checkMobileDisplay() {
    const mobileIndicator = document.querySelector('.mobile-indicator');
    if (!mobileIndicator) {
        console.warn('Mobile indicator element not found');
        return;
    }

    // Update visibility based on screen size
    const isMobile = window.innerWidth <= 768;
    mobileIndicator.style.display = isMobile ? 'block' : 'none';
}

// Listen for resize events
window.addEventListener('resize', checkMobileDisplay);
// Initial check
window.addEventListener('DOMContentLoaded', checkMobileDisplay);



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