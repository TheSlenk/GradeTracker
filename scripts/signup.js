const signemail = document.getElementById('signemail');
const signpass = document.getElementById('signpass');
const signpassconf = document.getElementById('signpassconf');
const signupbtn = document.getElementById('signup');
const signusername = document.getElementById('signusername');

const logemail = document.getElementById('logemail');
const logpass = document.getElementById('logpass');
const loginbtn = document.getElementById('login');

signemail.addEventListener('input', signUpEmpty);
signpass.addEventListener('input', signUpEmpty);
signpassconf.addEventListener('input', signUpEmpty);
signusername.addEventListener('input', signUpEmpty);

logemail.addEventListener('input', logInEmpty);
logpass.addEventListener('input', logInEmpty);



//TODO
function signup() {
    if(signpass.value == signpassconf.value) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/signup');
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                alert(xhr.responseText);
                location.reload();
            } 
            else if(xhr.readyState === 4 && xhr.status === 400) {
                alert(xhr.responseText);
            }
        }
        let data = {email: signemail.value, username: signusername.value, password: signpass.value};
        xhr.send(JSON.stringify(data));
    } else {
        alert('Password and Confirm Password are Not Equal!');
    }
}


//TODO
function login() {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `/login?email=${logemail.value}&password=${logpass.value}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
            location.href = '/home';
        } 
        else if(xhr.readyState === 4 && xhr.status === 400) {
            alert(xhr.responseText);
        }
    }
    xhr.send();
}


function logInEmpty() {
    if(logemail.value.length > 0 && logpass.value.length > 0) {
        loginbtn.disabled = false;
        return;
    }
    loginbtn.disabled = true;
}

function signUpEmpty() {
    if(signemail.value.length > 0 && signpass.value.length > 0 && signpassconf.value.length > 0 && signusername.value.length > 0) {
        signupbtn.disabled = false;
        return;
    }
    signupbtn.disabled = true;
}
