*** Start applikation ved at indtaste: node app.js i konsollen/terminalen ***

Hvis MongoDB connection ikke kan oprettes, kan du blot sætte en ny MongoDB op, og replace connection string i config.js

Applikationen benytter port 8080 og kan tilgås via http://localhost:8080/ 

______________________________
For at starte tests med Mocha, indtast i konsollen: npm test
    ** Hvis Mocha ikke vil starte: Slet hele mappen Mocha i node_modules mappen og indtast derefter i konsollen: npm i
    ** Dette vil geninstallere Mocha.
______________________________
Til test af systemets forskellige funktioner, er der blevet lavet et admin, shop og bruger login.

Admin login: http://localhost:8080/admin/login
    Mail: admin@mail.dk
    Kode: 12345

Bruger login: http://localhost:8080/user/login
	Mail: user@mail.dk
	Kode: 12345

Shop login: http://localhost:8080/shop/login 
    Mail: shop@mail.dk
    Kode: 12345
______________________________
