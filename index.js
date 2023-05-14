const $ = document;
const pizzas = [
  {
    name: 'Margherita',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE'],
  },
  {
    name: 'Pepperoni',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 slices of pepperoni.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'PEPPERONI'],
  },
  {
    name: 'Ham and Pineapple',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 pieces of ham. 5/ Add 12 pieces of pineapple.',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'HAM', 'PINEAPPLE'],
  },
  {
    name: 'Chicken',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add 12 pieces of chicken',
    requiredSteps: ['ROLL DOUGH', 'PIZZA SAUCE', 'CHEESE', 'CHICKEN'],
  },
  {
    name: 'Vegetarian',
    method:
      '1/ Roll the dough base to the required thickness and shape. 2/ Add sauce to the base. 3/ Top with cheese. 4/ Add handful of onions. 5/ Add handful of peppers. 6/ Add small handful of mushrooms. 7/ Add garlic.',
    requiredSteps: [
      'ROLL DOUGH',
      'PIZZA SAUCE',
      'CHEESE',
      'ONIONS',
      'PEPPERS',
      'MUSHROOMS',
      'GARLIC',
    ],
  },
];

let orders = [
  {
    id: 1,
    pizzas: [
      {
        quantity: 1,
        name: 'Ham and Pineapple',
      },
      {
        quantity: 2,
        name: 'Pepperoni',
      },
    ],
  },
  {
    id: 2,
    pizzas: [
      {
        quantity: 2,
        name: 'Margherita',
      },
      {
        quantity: 1,
        name: 'Pepperoni',
      },
    ],
  },
  {
    id: 3,
    pizzas: [
      {
        quantity: 2,
        name: 'Pepperoni',
      },
      {
        quantity: 1,
        name: 'Margherita',
      },
      {
        quantity: 1,
        name: 'Ham and Pineapple',
      },
    ],
  },
], gameStarted = false;
const gameLenght = 300;
let countdownTime = gameLenght, completedPizzas = 0;
const cookingTime = 20;
let completedSteps = [];
let wastedPizzas = 0;
let compledtedOrders = 0;

$.querySelector('#gameLength').innerText = `Game length is ${gameLenght} seconds`

$.querySelector('#endBtn').style.display = 'none';

const ingredients = [
  'ROLL DOUGH',
  'PIZZA SAUCE',
  'CHEESE',
  'PEPPERONI',
  'HAM',
  'PINEAPPLE',
  'ONIONS',
  'PEPPERS',
  'MUSHROOMS',
  'GARLIC',
  'CHICKEN',
];

/* Creating the start of game and end of game functions 
 */


function startOfGame() {
  if (gameStarted) {
    return;
  }
  startOfGameUI();
  gameStarted = true;
  const orders = $.getElementsByClassName('order_wrapper');
  Array.from(orders).forEach(function (order) {
    order.remove();
  });
  createOrderList();
  ordersTimer();
  countdownTimer();
  gameTimer();
  countdownTimerRef = setInterval(countdownTimer, 1000);

  checkOven();
  listIngredients();
}

function startOfGameUI() {
  $.querySelector('#startBtn').style.display = 'none';
  $.querySelector('#endBtn').style.display = 'inline';

  $.querySelector('#message').innerText = 'Chef, our first orders are coming in !';
  setTimeout(function () {
    $.querySelector('#message').innerText = '';
  }, 2500);
  $.querySelector('#method').style.display = 'block';
  $.querySelector('#stats').style.display = 'none';
  compledtedOrders = 0;
  completedPizzas = 0;
  wastedPizzas = 0;
  $.querySelector('#ingredients').innerHTML = '';
  countdownTime = gameLenght;
}

function endOfGame() {
  endOfGameUI();
  gameStarted = false;
  clearInterval(orderTimerRef);
  clearInterval(countdownTimerRef);
  clearInterval(gameTimerRef);

}

function endOfGameUI() {
  $.querySelector('#startBtn').style.display = 'inline';
  $.querySelector('#endBtn').style.display = 'none';
  $.querySelector('#method').style.display = 'none';
  $.querySelector('#stats').style.display = 'block';
  $.querySelector('#completedOrders').innerText = compledtedOrders;
  $.querySelector('#completedPizzas').innerText = completedPizzas;
  $.querySelector('#wastedPizzas').innerText = wastedPizzas;
  $.querySelector('#stats').className = 'fade-in';
}


/* OVEn code funtion to add elemnts to the Oven 
 */

let oven = [],
  pizzaCompletedOrder = 0;
const ovenCapacity = 6;

function displayOvenItems() {
  $.querySelector('#oven').innerHTML = '';
  oven.forEach(function (pizza) {
    const pizzaDiv = $.createElement('div');
    pizzaDiv.className = 'pizza_div';
    const image = $.createElement('img');
    image.src = 'pizza.svg';
    const pizzaName = createOneElem('p', `${pizza.name}`);
    //console.log(pizzaName);
    pizzaDiv.append(
      image,
      pizzaName);
    $.querySelector('#oven').appendChild(pizzaDiv);
  });
}

function addToOven() {
  pizzaCompletedOrder++;
  const pizzaName = $.querySelector('#current_pizza').innerText;
  //console.log(pizzaName);
  if (pizzaName) {
    const canAddToOven = stepsCompleted(pizzaName);
    if (canAddToOven) {
      const pizzaForOven = {
        name: pizzaName,
        timeAdded: Date.now()
      }
      oven.push(pizzaForOven);
      displayOvenItems();
      clearCanvas();
      completedSteps = [];
    }
  }
}

function stepsCompleted(pizzaName) {
  const pizzaObject = pizzas.find(function (pizza) {
    return pizza.name === pizzaName;
  })
  const stepsRequired = pizzaObject.requiredSteps;
  const checkSteps = stepsRequired.every(function (elem, index) {
    return elem === completedSteps[index];
  });
  if (completedSteps.length > stepsRequired.length) {
    showErrorMsg('You have used too many ingredients');
    wastedPizza();
    return;
  }
  if (completedSteps.length < stepsRequired.length) {
    showErrorMsg('You have not used enough ingredients');
  }
  if (completedSteps.length === stepsRequired.length && !checkSteps) {
    showErrorMsg('You have used the  wrong ingredients');
    wastedPizza();
    return;
  }
  if (oven.length < ovenCapacity) { return true; }
  return false;
}

function showErrorMsg(message) {
  $.querySelector('#message').innerText = message;
  setTimeout(function () {
    $.querySelector('#message').innerText = "";
  }, 2000)
}

// helper function to create elements this function will create elements 
/**
 * We do call this one the helper function as it's task does repeat a lot and the syntax is quiet similar in
 * most cases 
 */

function createOneElem(element, content) {  // we create a function that will create elemenst acepting 2 params 
  const elem = $.createElement(element);
  elem.appendChild(
    $.createTextNode(content));

  return elem;
}
let totalPizzas = 0;
function createListOfPizza(pizzas) {
  totalPizzas = 0;
  // create pizza Ul for each  order
  const pizzaList = $.createElement('ul');
  pizzas.forEach(function (pizza) {
    const orderQuantityElem = $.createElement('span');
    const pizzaQuantity = $.createTextNode(`${pizza.quantity} - `);
    totalPizzas += pizza.quantity;
    orderQuantityElem.appendChild(pizzaQuantity);

    // pizza name 
    const pizzaNameElem = $.createElement('span');
    pizzaNameElem.appendChild(
      $.createTextNode(pizza.name));

    // Create List Item 
    const pizzaItem = $.createElement('li');
    pizzaNameElem.classList.add('pizza_name');
    pizzaItem.append(orderQuantityElem, pizzaNameElem);
    pizzaList.append(pizzaItem);
  });
  return pizzaList;
}

/* This functions is created to select the order and move it to the WORKING ON section 
 * we do this with event listener 
 */

function selectCurrentOrder(event) {
  const pizzas = $.querySelectorAll('.pizza_name');
  pizzas.forEach(function (pizza) {
    pizza.addEventListener('click', selectCurrentPizza);
  });

  if ($.querySelector('#working_on').children.length > 1) return;   // if the working_on element has more than 1 children invoke 'return ' to stop the function
  let element = event.target;   // store the event element in this variable 
  const orderWrapper = element.closest('.order_wrapper');  // find the closest element that has that selector called '' Order_wrapper''
  if (orderWrapper !== null) {  //  if they are not elems do this 
    orderWrapper.removeEventListener('click', selectCurrentOrder);
    const orderDiv = $.querySelector('#working_on');
    orderDiv.appendChild(orderWrapper);
    const completeButton = createOneElem('button', 'Complete');
    completeButton.className = 'complete_btn';
    completeButton.addEventListener('click', completeOrder);
    orderDiv.appendChild(completeButton);
    const orderNumber = orderWrapper.getAttribute('data-order-number');
    orders = orders.filter((order) => order.id != orderNumber);

  }
}

function completeOrder(event) {
  const curentOrder = $.querySelector('#working_on > .order_wrapper');
  const totalPizzasOnOrder = curentOrder.getAttribute('data-total-pizzas');
  if (pizzaCompletedOrder < totalPizzasOnOrder) {
    showErrorMsg('You have not completed all pizzas to complete order');
    return;
  }
  curentOrder.remove();
  let completeButton = event.target;
  completeButton.remove();
  compledtedOrders++;
  pizzaCompletedOrder = 0;
}


function createSingleOrder(order) {
  // wrapper 
  const orderWrapper = $.createElement('div');
  orderWrapper.className = 'order_wrapper';
  orderWrapper.addEventListener('click', selectCurrentOrder);

  //order number
  const orderNumberElem = createOneElem('h4', `Order : ${order.id}`);
  orderWrapper.appendChild(orderNumberElem);

  const pizzaList = createListOfPizza(order.pizzas);
  orderWrapper.setAttribute('data-total-pizzas', totalPizzas);
  orderWrapper.setAttribute('data-order-number', order.id);
  orderWrapper.appendChild(pizzaList);
  return orderWrapper;
}

/* this function creates a list of orders that will then be displayed to see on the page 
 */
function createOrderList() {
  $.querySelector('#orders').innerHTML = '';
  orders.forEach(function (order) {
    let singleOrder = createSingleOrder(order);
    $.querySelector('#orders').appendChild(singleOrder);
  });
}

/* This functions is used to take the current Pizza name and then add it as the value of te element '' Working On '' 
 on the page, this one is above the Oven and Waste buttons.
*/
function selectCurrentPizza(e) {
  const pizzaName = e.target.innerText;
  $.querySelector('#current_pizza').innerText = pizzaName;
  displayMethod(pizzaName);
}

function displayMethod(pizzaName) {
  $.querySelector('#pizza_name').innerHTML = pizzaName;
  const selectedPizzas = pizzas.find((pizza) => pizza.name === pizzaName);
  const methodSteps = selectedPizzas.method.split('.');
  $.querySelector('#pizza_method').innerHTML = '';
  methodSteps.forEach(function (method) {

    const steps = createOneElem('p', method);
    $.querySelector('#pizza_method').appendChild(steps);
  })
}

$.querySelector('#startBtn').addEventListener('click', startOfGame);
$.querySelector('#endBtn').addEventListener('click', endOfGame);
$.querySelector('#add-to-oven').addEventListener('click', addToOven);

let orderNumber = orders.length + 1;
function generateNewOrder() {
  let pizzas = [];
  const orderItems = Math.ceil(Math.random() * 5);

  for (let i = 0; i <= orderItems; i++) {
    pizzas.push(generateNewPizza());
  }
  const newOrder = {
    id: orderNumber,
    pizzas
  };
  orders.push(newOrder);
  orderNumber++;
  createOrderList();
}

function generateNewPizza() {
  const quantity = Math.ceil(Math.random() * 3);
  const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)]
  const pizza = {
    quantity,
    name: randomPizza.name
  };
  return pizza;
}
let orderTimerRef = '';
function ordersTimer() {
  orderTimerRef = setInterval(generateNewOrder, 3000);
}

let countdownTimerRef = '';
function countdownTimer() {
  countdownTime -= 1;
  $.querySelector('#gameLength').innerText = `Time Left ${countdownTime}`;
}

let gameTimerRef = '';
function gameTimer() {
  gameTimerRef = setTimeout(endOfGame, gameLenght * 1000);
}

function checkOven() {
  setInterval(function () {
    oven.forEach(function (pizza) {
      if (Date.now() - cookingTime * 1000 > pizza.timeAdded) {
        oven.shift();
        displayOvenItems();
        completedPizzas++;
      }
    });
  });
}

function listIngredients() {
  ingredients.forEach(function (ingredient) {
    const ingredientElem = createOneElem('button', ingredient);
    ingredientElem.className = 'ingredient';
    ingredientElem.addEventListener('click', stepCompleted);
    $.querySelector('#ingredients').appendChild(ingredientElem)
  })
}

function stepCompleted(event) {
  if ($.querySelector('#current_pizza').innerText === '') {
    showErrorMsg('First, select the pizza you want to work on');
    return;
  }
  event.target.setAttribute('disabled', true);
  const stepName = event.target.innerText;
  completedSteps.push(stepName);
  makePizza(stepName);
}

const canvas = $.querySelector('#pizza_area');
const ctx = canvas.getContext('2d');

/**
 * Drawing the Pizza circle 
 */

function makePizza(ingredient) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  switch (ingredient) {
    case 'ROLL DOUGH':
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
      ctx.lineWidth = 15;
      ctx.strokeStyle = '#f5cf89';
      ctx.stroke();
      ctx.fillStyle = '#f5d69d';
      ctx.fill();
      break;
    case 'PIZZA SAUCE':
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
      ctx.fillStyle = '#ed4434';
      ctx.fill();
      break;
    case 'CHEESE':
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 94, 0, 2 * Math.PI);
      ctx.fillStyle = '#f7bc4d';
      ctx.fill();
      break;
    case 'PEPPERONI':
      const peperoniPositions = [
        [78, 62], [118, 74], [147, 57], [116, 134], [125, 189], [162, 162],
        [190, 85], [192, 143], [150, 115], [76, 95], [80, 190], [61, 135]
      ];
      peperoniPositions.forEach(function (piece) {
        ctx.beginPath();
        ctx.arc(piece[0], piece[1], 10, 0, Math.PI * 2);
        ctx.fillStyle = '#db3611';
        ctx.fill();
      });
      break;
    case 'HAM':
      const hamPositons = [
        [81, 62], [108, 74], [147, 47], [130, 124], [125, 160], [159, 145], [197, 82],
        [202, 132], [158, 90], [90, 140], [105, 135]
      ];

      hamPositons.forEach(function (piece) {
        ctx.fillStyle = '#f58c8c';
        ctx.rotate((Math.random() * 2 * Math.PI) / 180);
        ctx.fillRect(piece[0], piece[1], 8, 32,);
      });
      break;
    case 'PINEAPPLE':
      const pinePOsitions = [
        [81, 62], [108, 74], [147, 47], [130, 124], [125, 160], [159, 145], [197, 82],
        [202, 132], [158, 90], [90, 140], [105, 135]
      ];

      pinePOsitions.forEach(function (piece) {
        ctx.fillStyle = '#ebe534';
        ctx.rotate((Math.random() * 2 * Math.PI) / 180);
        ctx.fillRect(piece[0], piece[1], 12, 18,);
      });
      break;
    case 'ONIONS':
      const onionPosition = [
        [81, 62], [108, 74], [147, 47], [130, 124], [125, 160], [159, 145], [197, 82],
        [202, 132], [158, 90], [90, 140], [105, 135]
      ];

      onionPosition.forEach(function (piece) {
        ctx.fillStyle = '#d0efb5';
        ctx.rotate((Math.random() * 2 * Math.PI) / 260);
        ctx.fillRect(piece[0], piece[1], 12, 18,);
      });
      break;
    case 'PEPPERS':

      const peperPosition = [
        [81, 62], [108, 74], [147, 47], [130, 124], [125, 160], [159, 145], [197, 82],
        [202, 132], [158, 90], [90, 140], [105, 135]
      ];

      peperPosition.forEach(function (piece) {
        ctx.fillStyle = '#055e68';
        ctx.rotate((Math.random() * 2 * Math.PI) / 90);
        ctx.fillRect(piece[0], piece[1], 12, 18,);
      });
      break;
    case 'MUSHROOMS':
      const mushPosition = [
        [81, 62], [108, 74], [147, 47], [110, 104], [159, 145], [197, 82],
        [202, 132], [90, 140], [105, 135]
      ];

      mushPosition.forEach(function (piece) {
        ctx.fillStyle = '#1e6f5c';
        ctx.rotate((Math.random() * 2 * Math.PI) / 300);
        ctx.fillRect(piece[0], piece[1], 12, 18,);
      });
      break;
  }
}

function clearCanvas() {
  const steps = $.getElementsByClassName('ingredient');
  Array.from(steps).forEach(function (elem) {
    elem.removeAttribute('disabled');
  })

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function wastedPizza() {
  wastedPizzas++;
  completedSteps = [];
  clearCanvas();
}

$.querySelector('#waste').addEventListener('click', wastedPizza)