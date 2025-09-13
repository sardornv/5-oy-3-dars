const elLoading = document.getElementById("loading")
const elSkeleton = document.getElementById("skeleton")
const elContainer = document.getElementById("container")
const elCardTEmplate = document.getElementById("cardTemplate")
const elError = document.getElementById("error")
const elForm = document.getElementById("form")
const elPrevBtn = document.getElementById("prev")
const elNextBtn = document.getElementById("next")
const elPagination = document.getElementById("pagination")
const elModalBox = document.getElementById("modalBox")
const elHour = document.getElementById("hour")
const elMinute = document.getElementById("minute")
const elSecond = document.getElementById("second")
const elModalBtn = document.getElementById("modalBtn")
const elTime = document.getElementById("time")
const elEditForm = document.getElementById("editForm")
const elCancelBtn = document.getElementById("cancelBtn")



    setTimeout(() => {
        elLoading.classList.add("hidden");
        elSkeleton.classList.remove("hidden");
    }, 1000) 
    

    let editID = null;
    
    const limit = 6;
    let skip = 0;

// INIT 
function init () {
    elLoading.classList.remove("hidden")
    fetch(`https://json-api.uz/api/project/fn43/cars?skip=${skip}&limit=${limit}`).then((res) => {
        return res.json()
    }).then((res) => {
        elTime.classList.remove("hidden")
        elModalBtn.classList.remove("hidden")
        elPagination.classList.remove("hidden")
        elLoading.classList.add("hidden")
        elSkeleton.classList.remove("hidden")
        ui(res.data)
    }).catch(() => {
        elError.classList.remove("hidden")
        console.log("Hatolik");
    }).finally(() => {
        elSkeleton.remove()
    })
}
init()

// DELETE EL 
function deleteEl (id) {
    fetch(`https://json-api.uz/api/project/fn43/cars/${id}`,{
        method:"DELETE",
    }).then((res) => {
        init()
        console.log("Malumot o'chdi");
    }).then((res) => {})
    .finally(() => {})
}

// ADD EL 
function addEl (newEl) {
    fetch(`https://json-api.uz/api/project/fn43/cars`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(newEl),
    }).then((res) => {
        elModalBox.classList.add("hidden")
        alert("Malumot qo'shildi")
        init()
    }).finally(() => {})
}

// CARD TEMPLATE
function ui (cars) {
    elContainer.innerHTML = ""
    cars.forEach(element => {
        const clone = elCardTEmplate.cloneNode(true).content;
        const elTitle = clone.querySelector("h2");
        const elText = clone.querySelector("p");
        const elDeleteBtn = clone.querySelector(".delete-btn");
        const elEditBtn = clone.querySelector(".edit-btn");

        elTitle.innerText = element.name;
        elText.innerText = element.description;
        elDeleteBtn.id = element.id;
        elEditBtn.id = element.id;

        elContainer.append(clone)
    });
}

// DELETE BTN 
document.addEventListener("click", (evt) => {
    if(evt.target.classList.contains("delete-btn"))
        deleteEl(evt.target.id)

    if(evt.target.classList.contains("edit-btn"))
        getById(evt.target.id)
        editID = evt.target.id
        elEditForm.classList.remove("hidden")
    
})

// EDIT EL 


function editEl (editedEL){
    fetch(`https://json-api.uz/api/project/fn43/cars/${editedEL.id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(editedEL),
    }).then((res) => {
        init()
    })
    .finally(() => {})
}

function getById (id) {
    fetch(`https://json-api.uz/api/project/fn43/cars/${id}`)
    .then((res) => {
        return res.json()
    }).then((res) => {
        fill(res)
    }).finally(() => {})
}

function fill (obj) {
    elEditForm.name.value = obj.name;
    elEditForm.description.value = obj.description;
    elEditForm.price.value = obj.price;
    elEditForm.category.value = obj.category;
}

elCancelBtn.addEventListener("click",() => {
    elEditForm.classList.add("hidden")
})


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    elModalBox.classList.add("hidden")
    const formData = new FormData(elForm);
    const result = {};
    formData.forEach((value, key) => {
        result[key] = value
    })
    if(evt.submitter.id === "addBtn"){
        addEl(result)
    }

    if(evt.submitter.id === "edit-btnn"){
        if(editID){
            result.id = editID;
            editEl()
            editID = null
        }
    }

    elForm.reset()
})

// PAGINATION 
elNextBtn.addEventListener("click", () => {
    skip = skip + limit
    init()
})
elPrevBtn.addEventListener("click", () => {
    skip = skip - limit
    init()
})

// TIME 
function getTime (){
    const now = new Date();
    const hour = now.getHours() < 10 ? "0" + now.getHours()  : now.getHours()
    const minute = now.getMinutes() < 10 ? "0" + now.getMinutes()  : now.getMinutes()
    const second = now.getSeconds() < 10 ? "0" + now.getSeconds()  : now.getSeconds()

    elHour.textContent = `${hour} : `
    elMinute.textContent = `${minute} : `
    elSecond.textContent = second
}

setInterval(getTime,1000)
