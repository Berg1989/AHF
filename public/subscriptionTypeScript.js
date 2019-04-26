async function createSubscriptionType(){
    document.querySelector('#btnOpretId').onclick = () => {
        const msg = {
            name: document.querySelector('#nameInput').value,
            duration: document.querySelector('#subLenghtInput').value, //check om nummer
            mdrPrice: document.querySelector('#mdrPriceInput').value, //check om nummer
        };
        fetch('/subscriptionType', {
            method: "POST",
            body: JSON.stringify(msg),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status >= 400)
                    throw new Error(response.status);
                else
                    update();
                return response.json();
            })
            .then(resultat => console.log(`Resultat: %o`, resultat))
            .catch(fejl => console.log('Fejl: ' + fejl));
    };
}

async function getSubscriptionTypes() {
    const [template, userResponse] =
        await Promise.all([fetch('/subTypes.hbs'),fetch('/api/subscriptionTypes')]);
    const templeteText = await  template.text();
    const subTypes = await userResponse.json();
    const compiledTemplate = Handlebars.compile(templeteText);
    document.querySelector('#jokes').innerHTML = compiledTemplate({subTypes});
    
}
