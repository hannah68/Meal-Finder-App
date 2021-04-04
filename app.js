const header = document.querySelector('.header');
const homeBtn = document.querySelector('.home-btn');
const ideaBtn = document.querySelector('.idea-btn');
const shoppingBtn = document.querySelector('.shopping-btn');

const firstPage = document.querySelector('.first-page');
const secondPage = document.querySelector('.second-page');
const thirdPage = document.querySelector('.third-page');

const breakfastBtn = document.querySelector('.breakfast-btn');
const mainBtn = document.querySelector('.main-btn');
const soupBtn = document.querySelector('.soup-btn');
const dessertBtn = document.querySelector('.dessert-btn');

const mealOfDay = document.querySelector('.meal-of-day');
const imgContainer = document.querySelector('.img-container');
const detailsInstruction = document.querySelector('.details-instruction');
const detailsIngredient = document.querySelector('.details-ingredient');
const detailsNutrition = document.querySelector('.details-nutrition');
const table = document.querySelector('table');

const mealIdeaContainer = document.querySelector('.mealIdea-container');
const titleIdea = document.querySelector('.title');
const mealIdeaSearch = document.querySelector('.mealIdea-search');
const searchBtn = document.querySelector('.search-btn');
const randMeal = document.querySelector('.random-meal');
const searchResult = document.querySelector('.search-results');

const detailsInst = document.querySelector('.details-inst');
const detailsIngr = document.querySelector('.details-ingr');
const detailsNutr = document.querySelector('.details-nutr');

// get random meal===============================
function randomMeals(type){
    titleIdea.innerText = type;
    fetch(`https://api.spoonacular.com/recipes/random/?apiKey=f2309158854b4604baac80a8c5055bca&number=1&tags=${type}`)
    .then(res => res.json())
    .then(data =>{
        let meals = data.recipes[0];
        randMeal.innerHTML = `
            <img  class="rand-img" src="${meals.image}">
            <h3>${meals.title}</h3>
        ` 
    })
}


// get searched meal==============================
function searchMeal(arr){
    let type ='';
    for(let i=0; i<arr.length; i++){
        if(arr[i] === titleIdea.innerText){
            type += arr[i];
        }
    }
    
    const term = mealIdeaSearch.value;
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=f2309158854b4604baac80a8c5055bca&type=${type}&query=${term}`)
    .then(res => res.json())
    .then(data =>{

        if(data.results === null){
            searchResult.innerHTML = `<p>there are no search result. try again!</p>`
        }else{
            searchResult.innerHTML = data.results.map(meal =>
                `<div class="meal">
                    <img src="${meal.image}" alt="${meal.title}">
                    <div class="meal-info" data-mealID="${meal.id}">
                        <h3>${meal.title}</h3>
                    </div>
                </div>
                `
            ).join('');
        }

        // clear search text
        mealIdeaSearch.value ='';
    })
}

// Get random meal of a day==================================
function randomDayOfMeal(){
    fetch('https://api.spoonacular.com/recipes/random?apiKey=f2309158854b4604baac80a8c5055bca&type')
        .then(res => res.json())
        .then(data =>{
            // console.log(data)
            let dailyMeal = data.recipes[0];
            imgContainer.innerHTML =`
                <img src="${dailyMeal.image}" alt="${dailyMeal.title}">
                <div class="meal-info" data-mealID="${dailyMeal.id}">
                    <h3>${dailyMeal.title}</h3>
                </div>
            `
        })
}

// Get meal of day details(instruction)========================
const getInstructionById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/analyzedInstructions?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            let instructionArr= data[0].steps;

            detailsInstruction.innerHTML = `
                <h3>Instruction:</h3>
                <div class="all-steps"></div>
            `;

            // loop through each obj and return each step
            const instructionSteps= instructionArr.map(inst =>{
                let st = inst.step;
                return `${st}`;
            }).join(' ').split(/[.]+/g);

            
            // loop through each step,put each step inside a new p with number
            for(let i=1; i<instructionSteps.length; i++){
                let instStep = instructionSteps[i]
                const p = document.createElement('p');
                p.innerText = `${i}-${instStep}`;
                // append each p with number into a div inside detailsInstruction.innerHTML(above)
                const allSteps = document.querySelector('.all-steps');
                allSteps.append(p);
                // console.log(instStep)
            }
        })
}

// Get meal of day details(ingredient)=========================
const getIngredientById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/ingredientWidget.json?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            let ingredientsArr = data.ingredients;

            detailsIngredient.innerHTML =`
                <h3>Ingredients:</h3>  
                <ul>${ingredientsArr.map(ing =>(
                    `<li>${ing.amount.us.value} ${ing.amount.us.unit} ${ing.name}</li>`
                )).join('')}
                </ul>
            `;
        });
}

// Get meal of day details(Nutrition)===========================
const getNutritionById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/nutritionWidget.json?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            detailsNutrition.innerHTML =`
            <h3>Nutrition Information:</h3> 
                <table>
                    <thead>
                        <tr>
                            <th>Calories</th>
                            <th>Carbohydrate</th>
                            <th>Fat</th>
                            <th>Protein</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.calories}</td>
                            <td>${data.carbs}</td>
                            <td>${data.fat}</td>
                            <td>${data.protein}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        });
}



// meal of day details AddEventListener==========================
mealOfDay.addEventListener('click',function(e){
    const mealParent = e.path[1];
    const mealInfo = mealParent.lastElementChild;
    const mealId = mealInfo.getAttribute('data-mealID');
    getIngredientById(mealId);
    getInstructionById(mealId);
    getNutritionById(mealId);
});


// ========================================================================
// search result details(instruction)
const getInstrById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/analyzedInstructions?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            let instructionArr= data[0].steps;

            detailsInst.innerHTML = `
                <h3>Instruction:</h3>
                <div class="all-steps"></div>
            `;

            // loop through each obj and return each step
            const instructionSteps= instructionArr.map(inst =>{
                let st = inst.step;
                return `${st}`;
            }).join(' ').split(/[.]+/g);

            
            // loop through each step,put each step inside a new p with number
            for(let i=1; i<instructionSteps.length; i++){
                let instStep = instructionSteps[i]
                const p = document.createElement('p');
                p.innerText = `${i}-${instStep}`;
                // append each p with number into a div inside detailsInstruction.innerHTML(above)
                const allSteps = document.querySelector('.all-steps');
                allSteps.append(p);
                // console.log(instStep)
            }
         
        })
}

// search result details(ingredient)============================
const getIngrById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/ingredientWidget.json?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            let ingredientsArr = data.ingredients;

            detailsIngr.innerHTML =`
                <h3>Ingredients:</h3>  
                <ul>${ingredientsArr.map(ing =>(
                    `<li>${ing.amount.us.value} ${ing.amount.us.unit} ${ing.name}</li>`
                )).join('')}
                </ul>
            `;
        });
}

// search result details(Nutrition)==========================
const getNutrById =(mealId)=>{
    fetch(`https://api.spoonacular.com/recipes/${mealId}/nutritionWidget.json?apiKey=f2309158854b4604baac80a8c5055bca`)
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            detailsNutr.innerHTML =`
            <h3>Nutrition Information:</h3> 
                <table>
                    <thead>
                        <tr>
                            <th>Calories</th>
                            <th>Carbohydrate</th>
                            <th>Fat</th>
                            <th>Protein</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.calories}</td>
                            <td>${data.carbs}</td>
                            <td>${data.fat}</td>
                            <td>${data.protein}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        });
}

// search result details AddEventListener====================
searchResult.addEventListener('click', e=>{
    const mealParent = e.path[1];
    const mealInfo = mealParent.lastElementChild;
    const mealId = mealInfo.getAttribute('data-mealID');
    getIngrById(mealId);
    getInstrById(mealId);
    getNutrById(mealId);
})



// idea button addEventListener====================================
ideaBtn.addEventListener('click',function(){
    secondPage.classList.add('show');
    secondPage.classList.remove('hide');
    firstPage.classList.add('hide');
    header.classList.add('hide');
    header.classList.remove('show');
    firstPage.classList.remove('show');
    randomDayOfMeal();
});


// Home Button addEventListener=================================
homeBtn.addEventListener('click',function(){
    header.classList.remove('hide');
    firstPage.classList.remove('hide');
    header.classList.add('show');
    firstPage.classList.add('show');
    secondPage.classList.add('hide');
    secondPage.classList.remove('show');

})

// breakfast btn addEventListener======================================
breakfastBtn.addEventListener('click',function(){
    mealIdeaContainer.classList.add('show');
    mealOfDay.classList.add('hide');
    detailsNutrition.classList.add('hide');
    detailsInstruction.classList.add('hide');
    detailsIngredient.classList.add('hide');
    randomMeals('breakfast');
    searchResult.innerHTML ='';
    randMeal.innerHTML ='';
    detailsInst.innerHTML ='';
    detailsNutr.innerHTML ='';
    detailsIngr.innerHTML ='';
});

// main course btn addEventListener=================================
mainBtn.addEventListener('click',function(){
    mealIdeaContainer.classList.add('show');
    mealOfDay.classList.add('hide');
    detailsNutrition.classList.add('hide');
    detailsInstruction.classList.add('hide');
    detailsIngredient.classList.add('hide');
    randomMeals('main course');
    searchResult.innerHTML ='';
    randMeal.innerHTML ='';
    detailsInst.innerHTML ='';
    detailsNutr.innerHTML ='';
    detailsIngr.innerHTML ='';
});

// Soup btn addEventListener===================================
soupBtn.addEventListener('click',function(){
    mealIdeaContainer.classList.add('show');
    mealOfDay.classList.add('hide');
    detailsNutrition.classList.add('hide');
    detailsInstruction.classList.add('hide');
    detailsIngredient.classList.add('hide');
    randomMeals('soup');
    searchResult.innerHTML ='';
    randMeal.innerHTML ='';
    detailsInst.innerHTML ='';
    detailsNutr.innerHTML ='';
    detailsIngr.innerHTML ='';
});

// dessert btn addEventListener=====================================
dessertBtn.addEventListener('click',function(){
    mealIdeaContainer.classList.add('show');
    mealOfDay.classList.add('hide');
    detailsNutrition.classList.add('hide');
    detailsInstruction.classList.add('hide');
    detailsIngredient.classList.add('hide');
    randomMeals('dessert');
    searchResult.innerHTML ='';
    randMeal.innerHTML ='';
    detailsInst.innerHTML ='';
    detailsNutr.innerHTML ='';
    detailsIngr.innerHTML ='';
});

// search button addEventListener================================
searchBtn.addEventListener('click',function(){
    randMeal.innerHTML ='';
    searchMeal(['breakfast','main course','dessert','soup']);
})

// /////=============================================================
// shopping list
const pencil = document.querySelector("#pencil");
const groceries = document.getElementsByClassName("groceries");
const allItems = document.querySelector(".all-items");
const userInput = document.querySelector("#userinput");
     

// add items to the list of shopping=============
function addItem(list){
    const item = '-' + list;
    // create div element
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(item));

    // line-through text decoration
    div.addEventListener('click',function(){
        div.style.textDecoration = 'line-through'
    });

    allItems.insertAdjacentElement("beforeend", div);

    // create delete button
    const btn = document.createElement('button');
    btn.classList.add('btn-delete');
    btn.innerHTML = `<i class="fas fa-trash-alt"></i>`;

    div.appendChild(btn);

    // delete the list
    btn.addEventListener('click',function(){
        deleteList(list);
        div.remove()
    })

    userInput.value = '';

    // save item to the local storage
    saveToStorage(list)
}


// save to local storage================
function saveToStorage(list){
    let listItem;
    if(localStorage.getItem('listItem') === null){
        listItem =[]
    }else{
        listItem = JSON.parse(localStorage.getItem('listItem'))
    }

    listItem.push(list);
    // set new item to the local storage
    localStorage.setItem('listItem',JSON.stringify(listItem))
}

// when reload the page, i want to see the items on my list=====
function displayList(){
    let listItem;
    if(localStorage.getItem('listItem') === null){
        listItem =[]
    }else{
        listItem = JSON.parse(localStorage.getItem('listItem'))
    }

    listItem.forEach(function(list){
        const item = '-' + list;
        const div = document.createElement('div');

        div.appendChild(document.createTextNode(item));

        div.addEventListener('click',function(){
            div.style.textDecoration = 'line-through'
        });

        allItems.insertAdjacentElement("beforeend", div);

        const btn = document.createElement('button');
        btn.classList.add('btn-delete');
        btn.innerHTML =  `<i class="fas fa-trash-alt"></i>`;

        div.appendChild(btn);

        div.addEventListener('click',function(){
            deleteList(list);
            div.remove();
        });

        userInput.value = '';

    });
}

// Delete list from local storage=========
function deleteList(list){
    let listItem;
    if(localStorage.getItem('listItem') === null){
        listItem =[]
    }else{
        listItem = JSON.parse(localStorage.getItem('listItem'))
    }

    const listIndex = listItem.indexOf(list);
    listItem.splice(listIndex,1);
    // localStorage.setItem(key, value);
    localStorage.setItem('listItem', JSON.stringify(listItem));
}


// AddEventListener reload the page==============
window.addEventListener('DOMContentLoaded',displayList);


//AddEventListener enter list ======================
userInput.addEventListener('keypress', function(e){
    if(e.key == 'Enter'){
        if(userInput.value){
            addItem(userInput.value)
            // saveToStorage(userInput.value)
        }
    }
})

//AddEventListener shoppingBtn======================
shoppingBtn.addEventListener('click',function(){
    header.classList.remove('show');
    firstPage.classList.remove('show');
    firstPage.classList.add('hide');
    header.classList.add('hide');
    thirdPage.classList.remove('hide');
    thirdPage.classList.add('show');
})

// back button shopping=====================
const backBtnShopping = document.querySelector('.back-btn-shopping');

backBtnShopping.addEventListener('click',function(){
    firstPage.classList.remove('hide');
    header.classList.remove('hide');
    header.classList.add('show');
    firstPage.classList.add('show');
    thirdPage.classList.remove('show');
    thirdPage.classList.add('hide');
})