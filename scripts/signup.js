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




function signup() {

}

function login() {

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
