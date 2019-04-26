onload = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const btnSend = document.getElementById('btnSend');

    btnSend.onclick = async () => {
        const data = {
            username: username.value,
            password: password.value,
        };
        const resultat = await fetch("/login/add", {
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