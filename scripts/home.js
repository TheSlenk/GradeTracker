let email = null;
let username = null;
let term = 0;


function init(data) {
    email = data['email'];
    username = data['username'];
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
    term = parseInt(id);
    for(let i = 0; i < 3; i++) {
        if(i == term) {
            document.getElementById(`term${i}`).style.borderColor = "red";
        } else {
            document.getElementById(`term${i}`).style.borderColor = "black";
        }
    }
}