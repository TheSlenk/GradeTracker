const categories = document.getElementById('categories');
const final = document.getElementById('finalgrade');
const average = document.getElementById('currentAvg')
const autoUpdateFrequency = 5000;
let data;

const saveImg = "/save.png";
const savingImg = "/saving.gif";


function init(initData) {
    console.log(initData);
    data = initData;
    document.getElementById('courseName').value = data['courseName'];
    update();
    setTimeout(autoUpdateData, autoUpdateFrequency);
}

window.addEventListener("beforeunload", (e) => {
    updateData();
    return null;
});

async function updateData(_callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT','/updatecourse');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log('Auto Updated Data Succefully!');
            _callback();
        }
    };
    xhr.send(JSON.stringify(data));
}

function autoUpdateData() {
    updateData(() => { 
        document.getElementById("saveanim").setAttribute("src", savingImg);
        setTimeout(() => {document.getElementById("saveanim").setAttribute("src", saveImg); }, 2100);
        setTimeout(autoUpdateData, autoUpdateFrequency); 
    });
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
    data.categories[id].name = document.getElementById(`name${id}`).value;
}

function updateGrade(id) {
    data.categories[id].grade = parseFloat(document.getElementById(`grade${id}`).value);
    onlyUpdateFinal();
}

function updateWeight(id) {
    data.categories[id].weight = parseFloat(document.getElementById(`weight${id}`).value);
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

function updateCourseName() {
    data['courseName'] = document.getElementById('courseName').value;
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
    // average.value = `%${cat.grade}`
    final.value = `%${finalGrade.toFixed(2)}`;
}