const priceTable = document.querySelector('.price-table');
const goldAmount = document.querySelector('#gold-amount');
const btnNumber = document.querySelector('.btn-number');
const customerResult = document.querySelector('.customer-result');
const remainder = document.querySelector('.remainder');
const cost = document.querySelector('.cost');
const decisions = document.querySelector('.decisions');

const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const modalText = document.querySelector('.modal-info-text');


let n = 0;
let arrPrices = []; //array for prices
let arrCustomer = []; // array to display to user

const numPrices = {
    1: 4,
    2: 7,
    3: 5,
    4: 4,
    5: 5,
    6: 6,
    7: 5,
    8: 5,
    9: 6,
};

//CREATE AN ARRAY OF NUMBERS
let arr = [];
for(let prop in numPrices){
    arr.push(prop);
}

//CREATE AN ARRAY OF PRICES
for (let i = 0; i < (arr.length + 1); i++) {
    if (numPrices[arr[i]]) {
        arrPrices.push(numPrices[i+1]);
    }
}

createRowInTable(arr.length);            //create row with numbers
createRowInTable(arr.length, numPrices); //create row with prices


// FIND MIN PRICE
let minPrice = Math.min.apply(Math, arrPrices);

const countSum = (n) => {

    if (n < 0 || n == 0 || n > Math.pow(10, 6)) {
        customerResult.textContent = 'Ooops, your gold amount is incorrect';
    } else if (n < minPrice) {
        customerResult.textContent = 'Ooops, your gold is not enough. Find or earn more';
    } else {
        let result = [];
        let sum = 0;

        while (sum < (n + 1) && result.length < 9) {
            result.push(minPrice);
            sum = result.reduce((a, b) => a + b, minPrice);
        }

        //CHECK SUM OF NUMBERS IN ARRAY
        let sumNumbersInArray = result.reduce((a, b) => a + b, 0);

        if (sumNumbersInArray == n) {
            sumInNumber(result);
        } else if (sumNumbersInArray < n) {

            let goldRemainder = n - sumNumbersInArray;
            let maxNumber = Math.max.apply(Math, arr);
            let maxPriceOfMaxNumber = numPrices[maxNumber];

            let resultArr = Array.from(result);

            for (let j = 0; j < resultArr.length; j++) {

                if (resultArr[j] < maxPriceOfMaxNumber) {
                    let param = maxPriceOfMaxNumber - resultArr[j];

                    if ((goldRemainder - param) > 0) {
                        resultArr[j] = maxPriceOfMaxNumber;
                        goldRemainder -= param;
                    } else {
                        resultArr[j] += goldRemainder;
                        goldRemainder -= goldRemainder;
                    } 
                }
        }

        cost.innerHTML = `${n - goldRemainder} <img class="icon-coins" src='img/coins.png'/>`;
        remainder.innerHTML = `${goldRemainder} <img class="icon-save" src='img/treasure.png'/>`;

        decisions.classList.add('open');

        sumInNumber(resultArr);
        }
    }
};

function findKeys(expectedValue) {
    const accum = [];
    
    const entries = Object.entries(numPrices);
    for (const [key, value] of entries) {
        if (value === expectedValue) {
        accum.push(Number(key));
        }
    }

    arrCustomer.push(Math.max.apply(Math, accum));
};

function sumInNumber(array) {
    for (let i=0; i < array.length; i++) {
        if (array[i] in numPrices) {
            findKeys(array[i]);
        }
    }

    customerResult.textContent = +arrCustomer.join('');

    arrPrices = [];
    arrCustomer = [];
};


// CREATE THE TABLE ROW IN HTML
function createRowInTable(col, arr) {
    const tr = document.createElement('tr');

    for (let i = 0; i < col; i++) {
        const td = document.createElement('td'); //create 9 td
        
        //content of td
        if (!arr) {
            td.innerHTML = `${i+1}`;
            tr.append(td);
        } else {
            td.innerHTML = `${arr[i+1]} <img class="icon-coins" src='img/coins.png'/>`;
            tr.append(td);
        }
    }
    priceTable.append(tr);
};

// MODAL WINDOW: OPEN AND TEXT
function openModalWindow() {
    modal.classList.add('open-modal');
    decisions.classList.remove('open');
};

//AUTOMATIC MODAL WINDOW CLOSE
function closeModal() {
    setTimeout(() => {
        modal.classList.remove('open-modal');
    }, 2500);
};

btnNumber.addEventListener('click', () => {
    n = Number(goldAmount.value);
    countSum(n);
});

btnYes.addEventListener('click', () => {
    openModalWindow();
    modalText.textContent = 'Thanks and bless you!';
    closeModal();
});

btnNo.addEventListener('click', () => {
    openModalWindow();
    modalText.innerHTML = `
        <p>Well, find more Gold and come back!</p>
        <img class="modal-img" src="img/come-back.png" alt="come back">
        `;
    closeModal();
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('open-modal');
    goldAmount.value = '';
    customerResult.textContent = '_ _ _ _ _ _ _ _ _ _';
    cost.innerHTML = '_ _ _';
    remainder.innerHTML = '_ _ _';
});