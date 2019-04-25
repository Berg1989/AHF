onload = () => {
    const navn = document.querySelector('#navn');
    const password = document.querySelector('#password');
    const button = document.querySelector('#button');
    const fejl = document.querySelector('#fejl');

    button.onclick = async () => {
        const data = {navn: navn.value, password: password.value};
        const resultat = await fetch("/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const svar = await resultat.json();
        if (svar.ok)
            window.location.href = "/session";
        else {
            fejl.innerHTML = "Login fejl!";
        }
    }
};