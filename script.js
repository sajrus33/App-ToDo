// newest version on codepen
"use strict";
let canLocalStorage = false;
const taskCharLimit = 50;
const categoryCharLimit = 15;
let categorySelected = false;
let history = {
  done: [],
  deleted: []
};
let locals = {
  task: {
    txt: [],
    bgc: [],
    color: []
  },
  cat: {
    txt: [],
    bgc: [],
    color: []
  }
};

// test if localStorage exist
function testLocalStorage() {
  try {
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
  if (!testLocalStorage) {
    myAlert("We are sorry but you cannot use localStorage");
  } else {
    console.log("great local storage working");
    canLocalStorage = testLocalStorage();
    const storagedCategory = JSON.parse(localStorage.getItem("catTxt"));
    const storagedBgc = JSON.parse(localStorage.getItem("catBgc"));
    const storagedFontColor = JSON.parse(localStorage.getItem("catColor"));
    console.log(storagedCategory);
    if (storagedCategory) {
      storagedCategory.forEach((category, i) => {
        console.log(
          category,
          storagedCategory[i],
          storagedBgc[i],
          storagedFontColor[i]
        );

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
// my own alert
function myAlert(describe) {
  const oldAlert = document.querySelector(".tip");
  if (oldAlert) {
    oldAlert.remove();
  }
  const newAlert = document.createElement("div");
  newAlert.classList.add("tip");
  newAlert.innerText = describe;
  document.body.appendChild(newAlert);
}
//categorys list
const categoryList = document.querySelector(".editor__category");
const categorysWrappper = document.querySelector(".editor__categorys");
let categorys, categorysBtn;

function reoladCategorys() {
  categorysBtn = document.querySelectorAll(".editor__category--button");
  [...categorysBtn].forEach(category => {
    category.addEventListener("click", deleteCategory); //delete !!
  });

  categorys = document.querySelectorAll(".editor__category--option");
  [...categorys].forEach(category => {
    category.addEventListener("click", selectCategory);
  });
}

//create task
const btnTaskSubmit = document.querySelector(".editor__submit--task");
const taskDescribe = document.querySelector(".editor__describe--task");

//search panel
const searchPanel = document.querySelector(".editor__wrapper--search");
const btnCreateCategory = document.querySelector(".editor__create");
const searchInput = document.querySelector(".editor__search");

//list and tasks
const list = document.querySelector(".main");

let btnsDone, btnsDelete, tasks;

function reoladList() {
  console.log(tasks);
  tasks = document.querySelectorAll(".main__task");
  btnsDone = document.querySelectorAll("button.main__button--done");
  btnsDone.forEach(item => item.addEventListener("click", doneTask));
  btnsDelete = document.querySelectorAll("button.main__button--delete");
  btnsDelete.forEach(item => item.addEventListener("click", deleteTask));
}
// new category panel
const createPanel = document.querySelector(".editor__wrapper--category");

//new category
const categoryDescribe = document.querySelector(".editor__describe--category");
const selectCategoryBgc = document.querySelector(".editor__category--bgc");
const selectCategoryFont = document.querySelector(".editor__category--font");
const btnCategorySubmit = document.querySelector(".editor__submit--category");
const btnCategoryBack = document.querySelector(".editor__cancel--category");

//                                                   fun
//
function toggleMenu() {
  searchPanel.classList.toggle("displayFlex");
  createPanel.classList.toggle("displayFlex");
}
const searchTask = e => {
  const searchText = e.target.value.toLowerCase();

  let activeTasks = [...tasks];

  activeTasks = activeTasks.filter(task =>
    task.textContent.toLowerCase().includes(searchText)
  );
  tasks.forEach(task => (task.parentNode.style.display = "none"));
  tasks.forEach(task => {
    activeTasks.forEach(active => {
      if (task == active) {
        task.parentNode.style.display = "flex";
      }
    });
  });
};
// tasks menagment
// under function
function setLocalTasks() {
  localStorage.setItem("taskTxt", JSON.stringify(locals.task.txt));
  localStorage.setItem("taskBgc", JSON.stringify(locals.task.bgc));
  localStorage.setItem("taskColor", JSON.stringify(locals.task.color));
}
// create task
const createTask = (describe, bgc, fontColor, create) => {
  if (create) {
    let alreadyExist = false;
    if (!categorySelected) return myAlert("Pick category!");
    if (!describe) return myAlert("Task describe is empty");
    if (describe.length > taskCharLimit)
      return myAlert(
        "Task describe is too long, max " + taskCharLimit + " characters"
      );
    if (tasks) {
      tasks.forEach(cat => {
        if (cat.innerText === describe) {
          alreadyExist = true;
        }
      });
    }
    if (alreadyExist) return myAlert(describe + " already exist");
  }
  //li
  const newTask = document.createElement("li");
  newTask.classList.add("main__li");
  newTask.style.backgroundColor = bgc;
  newTask.style.color = fontColor;
  //delete
  const newDone = document.createElement("button");
  newDone.classList.add("main__button");
  newDone.classList.add("main__button--done");
  //p
  const newDescribe = document.createElement("p");
  newDescribe.classList.add("main__task");
  newDescribe.innerText = describe;
  // edit
  // const newEdit = document.createElement("button");
  // newEdit.classList.add("main__button");
  // newEdit.classList.add("main__button--edit");
  //delete
  const newDelete = document.createElement("button");
  newDelete.classList.add("main__button");
  newDelete.classList.add("main__button--delete");
  //complete
  newTask.appendChild(newDone);
  newTask.appendChild(newDescribe);
  // newTask.appendChild(newEdit);
  newTask.appendChild(newDelete);

  list.appendChild(newTask);
  reoladList();

  if (canLocalStorage) {
    locals.task.txt.push(describe);
    locals.task.bgc.push(bgc);
    locals.task.color.push(fontColor);
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
// create cat
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
// delete cat
const deleteCategory = e => {
  const toDelet = locals.cat.txt.indexOf(e.target.parentNode.innerText);
  for (let prop in locals.cat) {
    if (locals.cat.hasOwnProperty(prop)) {
      locals.cat[prop].splice(toDelet, 1);
    }
  }
  e.target.parentNode.remove();
  reoladCategorys();
  if (canLocalStorage) {
    setLocalCategory();
  }
};
// select cat
const selectCategory = e => {
  categorysWrappper.classList.toggle("displayFlex");
  categoryList.style.backgroundColor = e.target.style.backgroundColor;
  categoryList.style.color = e.target.style.color;
  categoryList.innerText = e.target.innerText.replace("delete", "");
  if (!categorySelected) {
    categorySelected = true;
  }
};
// under fun for listen
function setSelectBgc() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.previousElementSibling.style.backgroundColor = this.style.backgroundColor;
}
function setSelectFontColor() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.previousElementSibling.previousElementSibling.style.color = this.style.backgroundColor;
}
function setSelectBoth() {
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.style.color = this.style.backgroundColor;
  this.style.backgroundColor = this.options.item(this.selectedIndex).text;
  this.style.backgroundColor = this.style.backgroundColor;
}
const deleteTask = e => {
  e.target.parentNode.style.backgroundColor = "black";
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

//                                   LISTEN !

//creating category
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
  if (categorys) {
    categorysWrappper.classList.toggle("displayFlex");
  } else {
    myAlert("Lets create new category !");
  }
});
searchInput.addEventListener("input", searchTask);
//hheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
searchInput.addEventListener("click", function () {
  event.target.value = "";
});
btnCreateCategory.addEventListener("click", toggleMenu);
btnCategoryBack.addEventListener("click", toggleMenu);
btnTaskSubmit.addEventListener(
  "click",
  function () {
    createTask(
      taskDescribe.value,
      categoryList.style.backgroundColor,
      categoryList.style.color,
      true
    );
  },
  false
);
categoryDescribe.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnCategorySubmit.click();
  }
});
taskDescribe.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnTaskSubmit.click();
  }
});

init();
myAlert("Welcome on ToDo :)");


