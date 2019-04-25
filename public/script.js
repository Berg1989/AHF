onload = () => {
    const username = document.getElementById('username');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    const btnSend = document.getElementById('btnSend');

    btnSend.onclick = async () => {
        const data = {
            username: username.value,
            firstname: firstname.value,
            lastname: lastname.value, 
            password: password.value,
            email: email.value
        };
        const resultat = await fetch("/user", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const svar = await resultat.json();
        console.log(svar);
        
        /*if (svar.ok) {
            console.log('Succes!');
            //window.location.href = "/session";
        }
        else {
            console.log('Fejl');
        }*/
    }
};