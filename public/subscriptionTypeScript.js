createSubscriptionType();
getSubscriptionTypes();

async function createSubscriptionType(){
const btnOpret = document.getElementById('#btnOpretId');
const name = document.getElementById('#nameInput');
const duration = document.getElementById('#subLenghtInput');
const mdrPrice = document.getElementById('#mdrPriceInput');

    btnOpret.onclick = () => {
        const msg = {
            name: name.value,
            duration: duration.value, //check om nummer
            mdrPrice: mdrPrice.value, //check om nummer
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
