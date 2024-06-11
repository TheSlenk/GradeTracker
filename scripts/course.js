const categories = document.getElementById('categories');
const final = document.getElementById('finalgrade');
const autoUpdateFrequency = 3000;
let data;
function init(initData) {
    console.log(initData);
    data = initData;
    update();
    setTimeout(autoUpdateData, autoUpdateFrequency);
}

function autoUpdateData() {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT','/updatecourse');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log('Auto Updated Data Succefully!');
            setTimeout(autoUpdateData, autoUpdateFrequency);
        }
    };
    xhr.send(JSON.stringify(data));
}

function addCategory(id, name, grade, weight) {
    categories.innerHTML += `<div id="cat${id}"> 
                            <input id="name${id}" value="${name}" oninput="updateName(${id})">
                            <input id="grade${id}" value="${grade}" oninput="updateGrade(${id})"> 
                            <input id="weight${id}" value="${weight}" oninput="updateWeight(${id})"> 
                            <button onclick="removeCategory(${id})">Remove</button>
                            <hr>`;
}

function updateName(id) {
    console.log(data.categories[id].name);
    console.log(document.getElementById(`name${id}`).value);
    data.categories[id].name = document.getElementById(`name${id}`).value;
}

function updateGrade(id) {
    data.categories[id].grade = document.getElementById(`grade${id}`).value;
    onlyUpdateFinal();
}

function updateWeight(id) {
    data.categories[id].weight = document.getElementById(`weight${id}`).value;
    onlyUpdateFinal();
}

function removeCategory(id) {
    data.categories.splice(id, 1);
    update();
}

function addNewCategory() {
    data.categories.push({name: '', grade: 0, weight: 0});
    update();
}

function onlyUpdateFinal() {
    let finalGrade = 0;
    for(let cat of data.categories) {
        finalGrade += cat.weight * cat.grade / 100;
    }
    final.value = `%${finalGrade}`;
}

function update() {
    let weightSum = 0;
    let finalGrade = 0;
    categories.innerHTML = '';
    let id = 0;
    for(let cat of data.categories) {
        addCategory(id++, cat.name, cat.grade, cat.weight);
        weightSum += cat.weight;
        finalGrade += cat.weight * cat.grade / 100;
    }
    final.value = `%${finalGrade}`;
}