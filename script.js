"use strict";

// change if localStorage is not avaiable or full
let canLocalStorage = false;
//char limit for task
const taskCharLimit = 58;
//char limit for category
const categoryCharLimit = 15;
//flag 
let categorySelected = false;
// history + statistics soon !
let history = {
  done: [],
  deleted: []
};
// locals object is storing all pre JSON datas, used for localStorage
let locals = {
  //   tasks
  task: {
    txt: [],
    bgc: [],
    color: []
  },
  //   categorys
  cat: {
    txt: [],
    bgc: [],
    color: []
  }
};




// test if localStorage exist
function testLocalStorage() {
  try {//try to storage some data in LocalStorage
    localStorage.setItem("foo", "foo");
    localStorage.removeItem("foo");

    return true;
  } catch (e) {
    alert("We are sorry but your browser don't support localStorage");

    return false;
  }
}

// init
function init() {
  myAlert("Welcome on ToDo :)");
  //   check if this user can localStorage
  if (!testLocalStorage) {
    myAlert("We are sorry but you cannot use localStorage");
  } else {
    //     if user can localStorage than load JSON datas, if it exist
    console.log("great local storage working");
    canLocalStorage = testLocalStorage();
    const storagedCategory = JSON.parse(localStorage.getItem("catTxt"));
    const storagedBgc = JSON.parse(localStorage.getItem("catBgc"));
    const storagedFontColor = JSON.parse(localStorage.getItem("catColor"));
    if (storagedCategory) {
      storagedCategory.forEach((category, i) => {
        createCategory(
          storagedCategory[i],
          storagedBgc[i],
          storagedFontColor[i],
          false
        );
      });
    }
    const storagedTask = JSON.parse(localStorage.getItem("taskTxt"));
    const storagedTaskBgc = JSON.parse(localStorage.getItem("taskBgc"));
    const storagedTaskFontColor = JSON.parse(localStorage.getItem("taskColor"));
    if (storagedTask) {
      storagedTask.forEach((task, i) => {
        createTask(task, storagedTaskBgc[i], storagedTaskFontColor[i], false);
      });
    }
  }

}




// my own alert() function 
function myAlert(describe) {
  //   get old myAlert 
  const oldAlert = document.querySelector(".tip");
  //   if exist
  if (oldAlert) {
    //     remove it
    oldAlert.remove();
  }
  //   create new myAlert
  const newAlert = document.createElement("div");
  newAlert.classList.add("tip");
  //   fill myAlert text with argument "describe"
  newAlert.innerText = describe;
  document.body.appendChild(newAlert);
}




//DOM categorys list
const categoryList = document.querySelector(".editor__category");
const categorysWrappper = document.querySelector(".editor__categorys");
let categorys, categorysBtn;

// DOM categorys list reolad/init and addEventListeners for all their dependencies
function reoladCategorys() {
  //   categorys delete X button
  categorysBtn = document.querySelectorAll(".editor__category--button");
  [...categorysBtn].forEach(category => {
    category.addEventListener("click", deleteCategory); //delete !!
  });
  //   categorys options(all created categorys)
  categorys = document.querySelectorAll(".editor__category--option");
  [...categorys].forEach(category => {
    category.addEventListener("click", selectCategory);
  });
}





//DOM create task editor
const btnTaskSubmit = document.querySelector(".editor__submit--task");
const taskDescribe = document.querySelector(".editor__describe--task");

//DOM search panel editor
const searchPanel = document.querySelector(".editor__wrapper--search");
const btnCreateCategory = document.querySelector(".editor__create");
const searchInput = document.querySelector(".editor__search");

//DOM list and tasks (and all their dependencies "buttons")
const list = document.querySelector(".main");
let btnsDone, btnsDelete, tasks;

// DOM tasks list reolad/init and addEventListeners for all their dependencies
function reoladList() {
  tasks = document.querySelectorAll(".main__task");
  btnsDone = document.querySelectorAll("button.main__button--done");
  btnsDone.forEach(item => item.addEventListener("click", doneTask));
  btnsDelete = document.querySelectorAll("button.main__button--delete");
  btnsDelete.forEach(item => item.addEventListener("click", deleteTask));
}




//DOM new category panel editor
const createPanel = document.querySelector(".editor__wrapper--category");

//DOM new category (and dependencies)
const categoryDescribe = document.querySelector(".editor__describe--category");
const selectCategoryBgc = document.querySelector(".editor__category--bgc");
const selectCategoryFont = document.querySelector(".editor__category--font");
const btnCategorySubmit = document.querySelector(".editor__submit--category");
const btnCategoryBack = document.querySelector(".editor__cancel--category");






//                                                  ! Main App Engine Functions !


//toggle editors search/create category
function toggleMenu() {
  searchPanel.classList.toggle("displayFlex");
  createPanel.classList.toggle("displayFlex");
}


// search function 
const searchTask = e => {
  const searchText = e.target.value.toLowerCase().trim();
  let activeTasks = [...tasks];

  activeTasks = activeTasks.filter(task =>
    task.textContent.toLowerCase().includes(searchText)
  );
  //   if task is searched than display it, if not, do not.
  tasks.forEach(task => {
    task.parentNode.style.display = "none";
    activeTasks.forEach(active => {
      if (task == active) {
        task.parentNode.style.display = "flex";
      }
    });
  });
};





//           tasks menagment


// under function push taks bgc, txt, color to localStorage
function setLocalTasks() {
  localStorage.setItem("taskTxt", JSON.stringify(locals.task.txt));
  localStorage.setItem("taskBgc", JSON.stringify(locals.task.bgc));
  localStorage.setItem("taskColor", JSON.stringify(locals.task.color));
}

// create task function
const createTask = (describe, bgc, fontColor, create) => {
  if (create) {//if this function is creating new category, than check if its fit to our Limits and have all argument
    // if this function is not creating that mean its loading old ones from LocalStorage
    let alreadyExist = false;
    if (!categorySelected) return myAlert("Pick category!");
    if (!describe) return myAlert("Task describe is empty");
    if (describe.length > taskCharLimit)
      return myAlert(
        "Task describe is too long, max " + taskCharLimit + " characters"
      );
    if (tasks) {//check if new task name is not a duplicate
      tasks.forEach(cat => {
        if (cat.innerText === describe) {
          alreadyExist = true;
        }
      });
    }
    if (alreadyExist) return myAlert(describe + " already exist");
  }
  //create element li
  const newTask = document.createElement("li");
  newTask.classList.add("main__li");
  newTask.style.backgroundColor = bgc;
  newTask.style.color = fontColor;
  //create element delete
  const newDone = document.createElement("button");
  newDone.classList.add("main__button");
  newDone.classList.add("main__button--done");
  //create element p 
  const newDescribe = document.createElement("p");
  newDescribe.classList.add("main__task");
  newDescribe.innerText = describe;
  //create element delete
  const newDelete = document.createElement("button");
  newDelete.classList.add("main__button");
  newDelete.classList.add("main__button--delete");
  //all elements complete
  newTask.appendChild(newDone);
  newTask.appendChild(newDescribe);
  newTask.appendChild(newDelete);
  //   add new task to DOM
  list.appendChild(newTask);
  //   reolad tasks and its dependencies + addEventListeners
  reoladList();
  //   if its possible to use LocalStorage, than push new task dependencies into locals.task array.
  if (canLocalStorage) {
    locals.task.txt.push(describe);
    locals.task.bgc.push(bgc);
    locals.task.color.push(fontColor);
    //     updated tasks dependencies array put into LocalStorage 
    setLocalTasks();
  }
};





// categorys menagment

// under function
function setLocalCategory() {
  localStorage.setItem("catTxt", JSON.stringify(locals.cat.txt));
  localStorage.setItem("catBgc", JSON.stringify(locals.cat.bgc));
  localStorage.setItem("catColor", JSON.stringify(locals.cat.color));
}

// create category function its similar to create task function
const createCategory = (describe, bgc, fontColor, create) => {
  if (create) {
    let alreadyExist = false;
    if (!describe || !bgc || !fontColor)
      return myAlert("pick color and name your category");
    if (describe.length > categoryCharLimit)
      return myAlert(
        "Category describe is too long, max " +
        categoryCharLimit +
        " characters"
      );
    if (categorys) {
      categorys.forEach(cat => {
        if (cat.innerText === describe) {
          alreadyExist = true;
        }
      });
    }
    if (alreadyExist) return myAlert(describe + " already exist");

    myAlert("Category: " + describe + " created");
  }
  const newCategory = document.createElement("div");
  newCategory.classList.add("editor__category--option");
  newCategory.innerText = describe;
  newCategory.style.backgroundColor = bgc;
  newCategory.style.color = fontColor;
  const newButton = document.createElement("button");
  newButton.classList.add("editor__category--button");
  newCategory.appendChild(newButton);

  categorysWrappper.appendChild(newCategory);

  reoladCategorys();

  if (canLocalStorage) {
    locals.cat.txt.push(describe);
    locals.cat.bgc.push(bgc);
    locals.cat.color.push(fontColor);
    setLocalCategory();
  }
};


// delete category function (for categorys delete buttons listeners)
const deleteCategory = e => {
  //   look for index of clicked category
  const toDelet = locals.cat.txt.indexOf(e.target.parentNode.innerText);
  //   find it by index and remove from locals.cat array
  for (let prop in locals.cat) {
    if (locals.cat.hasOwnProperty(prop)) {
      locals.cat[prop].splice(toDelet, 1);
    }
  }
  //   remove DOM of this category
  e.target.parentNode.remove();
  //   reolad DOM categorys and listeners
  reoladCategorys();
  if (canLocalStorage) {
    //     localStorage setters
    setLocalCategory();
  }
};


// select category function (for existing category to choose, listener)
const selectCategory = e => {
  //   close, categorys choosing menu
  categorysWrappper.classList.toggle("displayFlex");
  //   set "select".categorys style on selected one (choosen category)
  categoryList.style.backgroundColor = e.target.style.backgroundColor;
  categoryList.style.color = e.target.style.color;
  categoryList.innerText = e.target.innerText.replace("delete", "");
  //   change flag if there is any category selected by user
  if (!categorySelected) {
    categorySelected = true;
  }
};




//another under functions for listeners

// change select bgc 
function setSelectBgc() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.previousElementSibling.style.backgroundColor = this.style.backgroundColor;
}

// change select font color 
function setSelectFontColor() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.previousElementSibling.previousElementSibling.style.color = this.style.backgroundColor;
}

// change select font color and bgc
function setSelectBoth() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.style.color = this.style.backgroundColor;
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.style.backgroundColor = this.style.backgroundColor;
}

// delete task function (for task delete X button)
const deleteTask = e => {
  e.target.parentNode.style.backgroundColor = "black";
  e.target.parentNode.style.color = "black";
  e.target.style.display = "none";
  const toDelet = locals.task.txt.indexOf(e.target.innerText);
  setTimeout(() => {
    e.target.parentNode.remove();
    reoladList();
  }, 300);
  for (let prop in locals.task) {
    if (locals.task.hasOwnProperty(prop)) {
      locals.task[prop].splice(toDelet, 1);
    }
  }
  if (canLocalStorage) {
    setLocalTasks();
  }
};

// done task function (for task delete X button)
const doneTask = e => {
  const toDelet = locals.task.txt.indexOf(e.target.innerText);
  for (let prop in locals.task) {
    if (locals.task.hasOwnProperty(prop)) {
      locals.task[prop].splice(toDelet, 1);
    }
  }
  e.target.style.display = "none";
  e.target.parentNode.style.transform = "translateX(100%)";
  setTimeout(() => {
    e.target.parentNode.remove();
    reoladList();
  }, 300);
  if (canLocalStorage) {
    setLocalTasks();
  }
};

//                                  INIT.. LISTENERS !  

//creating category editor listeners
selectCategoryBgc.addEventListener("change", setSelectBgc, true);
selectCategoryFont.addEventListener("change", setSelectFontColor, true);
categoryList.addEventListener("change", setSelectBoth);

btnCategorySubmit.addEventListener("click", function () {
  createCategory(
    categoryDescribe.value,
    categoryDescribe.style.backgroundColor,
    categoryDescribe.style.color,
    true
  );
});

categoryList.addEventListener("click", function () {
  if (categorys && categorys.length) {
    categorysWrappper.classList.toggle("displayFlex");
  } else {
    myAlert("Lets create new category !");
  }
});

searchInput.addEventListener("input", searchTask);
searchInput.addEventListener("click", function () {
  event.target.value = "";
});
// change search editor into create category editor
btnCreateCategory.addEventListener("click", toggleMenu, { passive: true });
btnCreateCategory.addEventListener("touchstart", toggleMenu, { passive: true });

// change create category editor into search editor
btnCategoryBack.addEventListener("click", toggleMenu, { passive: true });
btnCategoryBack.addEventListener("touchstart", toggleMenu, { passive: true });

// task ADD button listener (adding task on click)
btnTaskSubmit.addEventListener(
  "click",
  function () {
    //     create new task with current arguments, from user interfejs
    createTask(
      taskDescribe.value,
      categoryList.style.backgroundColor,
      categoryList.style.color,
      true
    );
  },
  false
);
// create category on Enter
categoryDescribe.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnCategorySubmit.click();
  }
});
// create task on Enter
taskDescribe.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnTaskSubmit.click();
  }
});
// on window load run init function (checking if can local storage, loading already existing ones(by getting them from localStorage and creating with task/category create function.))
window.onload = init;



