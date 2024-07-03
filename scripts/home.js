let email = null;
let username = null;
let term = 0;
let filter = '';
let selected = null;
function init(data) {
    email = data['email'];
    username = data['username'];
    termChange(data['term']);
    console.log(`email: ${email}, username: ${username}`);
}

function addCourse() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/addcourse');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            location.href = `/course/${xhr.responseText}`;
        }
    };
    xhr.send(JSON.stringify({'term': term}));
}

function logout() {
    if(!confirm('Are you sure you would like to log out?'))
        return;
    let xhr = new XMLHttpRequest();
    xhr.open('PUT','/logout');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            alert('Logged out!');
            location.reload();
        }
    };
    xhr.send();
}

function termChange(id) {
    document.getElementById(`term_${term}`).style.backgroundColor = "transparent"; // resets the bg color to blank
    document.getElementById(`term${term}`).style.borderColor = "black"; // resets the borderColor
    term = parseInt(id);//
    document.getElementById(`term_${term}`).style.backgroundColor = `#E5E059` // sets the background colour to something noticeable
    document.getElementById(`term_${term}`).className = "rounded-xl" // sets the background colour to something noticeable

    selected = true;
    for(let i = 0; i < 3; i++) {
        if(i == term) {
            document.getElementById(`term${i}`).style.borderColor = "red";
        } else {
            document.getElementById(`term${i}`).style.borderColor = "black";
        }
    }
    updateCourses();
}

function updateCourses() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/usercourses?username=${username}&term=${term}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            const courses = JSON.parse(xhr.response);
            const coursesDiv = document.getElementById('courses');
            const summary = document.getElementById('summary');
            let sum = 0;
            let numClasses = 0;
            console.log(courses);
            coursesDiv.innerHTML = '';
            for (const course of courses) {
                sum += parseFloat(calculateFinalGrade(course));
                numClasses++;
                if(!course['courseName'].toLowerCase().includes(filter)) 
                    continue;
                coursesDiv.innerHTML += `
                    <span style="height: fit-content;"> 
                        <hr>
                        <div style="float:left; width: 90%;"><a href="/course/${course['courseId']}">${course['courseName']}</a>
                        | Current Grade: ${calculateFinalGrade(course)}%</div> 
                        <div style="float:right; width: 10%; text-align: right;"><button onclick="deleteCourse('${course['courseId']}', '${course['courseName']}')">Delete</button></div>
                        <br>
                        <hr>
                    </span>
                `;
            }
            if (numClasses > 0) {
                summary.innerHTML = `
                    <div class = "w-full flex flex-col text-center justify-center h-full" >
                        <h1 class = "font-bold text-[4vw] text-black">${(sum / numClasses).toFixed(2)}%</h1>
                        <h1> Average Grade </h1>
                    </div>
                `;
            } else {
                summary.innerHTML = `
                    <div style="width: 100%;" class = "text-center">
                        No courses available.
                    </div>
                `;
            }
        }
    };
    xhr.send(null);
}


function changeFilter() {
    filter = document.getElementById('searchbar').value.toLowerCase();
    updateCourses();
}

function calculateFinalGrade(data) {
    let finalGrade = 0;
    for(let cat of data.categories) {
        finalGrade += cat.weight * cat.grade / 100;
    }
    return finalGrade.toFixed(2);
}

function deleteCourse(id, name) {
    console.log(id);
    if(confirm(`Are you sure you would like to delete "${name}" Course?`)) {
        let xhr = new XMLHttpRequest();
        xhr.open('PUT','/deletecourse');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                location.reload();
            }
        }
        xhr.send(JSON.stringify({'courseId': id}));
    }
}