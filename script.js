
// cela aparatura se odvija u objektu sa imenom 'coffeeMachine'

let coffeeMachine = {
    water: 400, // pocetna vrednost za vodu u aparatu
    coffee: 200, // pocetna vrednost za kafu u aparatu
    milk: 100, // pocetna vrednost za mleko u aparatu
    credit: 100, // pocetna vrednost za broj kredita u aparatu
    // statusi ----------------------------------------------------------------------------
    // ovde pozivamo helper funkciju koja je definisana na liniji 66,
    waterStatus: function () {
        this.rawStatus('water-status', 'water');
    },
    coffeeStatus: function () {
        this.rawStatus('coffee-status', 'coffee');
    },
    milkStatus: function () {
        this.rawStatus('milk-status', 'milk');
    },
    creditStatus: function () {
        this.rawStatus('credit', 'credit');
    },
    // add -------------------------------------------------------------------------------
    // za sve add* funkcije pozivamo addRaw helper funkciju definisanu na liniji 75,
    addWater: function () {
        this.rawAdd('vode', 'water', 400, 'water-status');
    },
    addCoffee: function () {
        this.rawAdd('kafe', 'coffee', 200, 'coffee-status');
    },
    addMilk: function () {
        this.rawAdd('mleka', 'milk', 100, 'milk-status');
    },
    addCredit: function () {
        this.rawAdd('kredita', 'credit', 100, 'credit');
    },
    // empty -----------------------------------------------------------------------------
    // za sve empty* funkcije pozivamo emptyRaw helper funkciju definisanu na liniji 98,
    emptyWater: function (kolicinaVode) {
        this.rawEmpty('water', kolicinaVode, 'water-status');
    },
    emptyCoffee: function (kolicinaKafe) {
        this.rawEmpty('coffee', kolicinaKafe, 'coffee-status');
    },
    emptyMilk: function (kolicinaMleka) {
        this.rawEmpty('milk', kolicinaMleka, 'milk-status');
    },
    emptyCredit: function (kolicinaKredita) {
        this.rawEmpty('credit', kolicinaKredita, 'credit');
    },
    // beverages -------------------------------------------------------------------------
    // za sve make* funkcije pozivamo makeDrink helper funkciju definisanu na liniji 122,
    makeShortEspresso: function () {
        this.makeDrink('Short Espresso', 20, 10, false, 30)
    },
    makeLongEspresso: function () {
        this.makeDrink('Long Espresso', 40, 10, false, 40);
    },
    makeCapuchino: function () {
        this.makeDrink('Capuchino', 20, 10, 10, 50);
    },
    /* ---------------------------------------------------------------------------------------------------------------------
    helper funkcija za proveru statusa sastojaka i kredita,
    u HTML-u pronalazi paragrafe sa dodeljenim id vrednostima i u njih upisuje vrednosti propertija iz objekta coffeeMachine
    ----------------------------------------------------------------------------------------------------------------------*/
    rawStatus: function (id, prop) {
        return document.getElementById(id).innerText = this[prop];
    },
    /* ---------------------------------------------------------------------------------------------------------------------
    helper funkcija za dodavanje sastojaka i kredita,
    kada se pokrene ova funkcija otvara prompt() gde se upisuje neka brojcana vrednost koja mora biti ceo pozitivan broj, ako nije pustamo alert(),
    ali ipak zbir trenutnog stanja i nove vrednosti nesme da nadmasi pocetnu vrednost. Ako do toga dodje pustamo alert().
    na dnu funkcije postoji dodatak za kontrolu izgleda poruke iz p#message NAKON promene stanja vrednosti. 
    ----------------------------------------------------------------------------------------------------------------------*/
    rawAdd: function (naziv, prop, max, id) { // naziv=ime za prompt, prop = ime atributa, max=maks kolicina sastojka, id = water-status itede
        let addPromptValue = Number(prompt('Koliko ' + naziv + ' zelite da sipate u aparat?'));
        if (addPromptValue%1===0 && !isNaN(addPromptValue) && addPromptValue > 0  ){
            addPromptValue = Number(addPromptValue);
        }else{
            alert ('Morate uneti ceo broj veci od 0.');
            return;
        }
        let noviRaw = this[prop] + addPromptValue;
        if (noviRaw <= max) {
            coffeeMachine[prop] = noviRaw;
            this.rawStatus(id, prop);
        } else {
            alert('Nemozete dodati vise od ' + max);
            return;
        };
        document.getElementById('message').innerText = 'DISPLAY MESSAGE';
        document.getElementById('message').style.color = 'black';
    },
  /* ---------------------------------------------------------------------------------------------------------------------
    helper funkcija za skidanje kolicine sastojaka i kredita,
    ova funkcija ce se pokrenuti iskljucivo prilikom procesa izrade kafe.
    ----------------------------------------------------------------------------------------------------------------------*/
    rawEmpty: function (prop, kolicina, id) { // prop = ime atributa, kolicina = kolicina sastojka id = water-status itede
        if (this[prop] >= kolicina) {
            this[prop] -= kolicina;
            this.rawStatus(id, prop);
        }
    },
    /* ---------------------------------------------------------------------------------------------------------------------
    helper funkcija za izradu raznih vrsta kafa,
    kada se pokrene ova funkcija radi sledece:
    1.  definise ime napitka sto je bitno za SWITCH koji sledi,
    2.  pravi dva niza: prvi sa upozoravajucim porukama koje sprecavaju izradu kafe i drugi sa afirmativnim porukama.
    3.  pozivaju se funkcije koje proveravaju kolicine sastojaka i u zavisnosti od stanja preko
        push() metode popunjavaju prethodno definisane nizove.
    4.  Nazalost jedan napitak ima vise sastojaka - a obzirom da nam je lista napitaka konacna treba da se 
        kroz SWITCH uslovni iskaz kapucinu dodeli jos jedan check point. Samo jedan od tri napitka ima ovakvu situaciju
        pa je zato DEFAULT za situacije koje se cesce ponavljaju, a CASE samo za kapucino.
    5.  Nakon provere preko IF/ELSE uslovnog iskaza ulazimo u sam proces izrade napitka gde ispisujemo afirmativne poruke,
        skidamo kredite odmah i preko SetTimeout()-a sa malim zakasnjenjem skidamo i ostale sastojke,
        na samom kraju vracamo sadrzaj poruke na pocetnu vrednost preko dodatnog SetTimeout()-a.
        Ukoliko zbog nemogucnosti da se pokrene proces izrade kafe moramo ispisati poruke gresaka dobro je
        takve poruke malo izdvojiti bojom.
    5a. Nije neophodno da IF/ELSE procenjuje situaciju preko sadrzaja niza
        procenu je moguce odraditi i preko drugih parametara ove funkcije 
    ----------------------------------------------------------------------------------------------------------------------*/
    makeDrink: function (drinkName, kolicinaVode, kolicinaKafe, kolicinaMleka, kolicinaKredita) {

        let drinkType = drinkName;

        let errorMsgs = [];
        let confirmMsgs = [];

        if (this.water < kolicinaVode) {
            errorMsgs.push('Machine is out of water');
        } else {
            confirmMsgs.push('Pouring water.');
        };
        if (this.coffee < kolicinaKafe) {
            errorMsgs.push('Machine is out of coffee');
        } else {
            confirmMsgs.push('Pouring coffee.');
        };
        switch (drinkType) {
            case 'Capuchino':
                if (this.milk < kolicinaMleka) {
                    errorMsgs.push('Machine is out of milk');
                } else {
                    confirmMsgs.push('Pouring milk.');
                };
                break;
            default:
                break;
        };
        if (this.credit < kolicinaKredita) {
            errorMsgs.push('Machine is out of credits');
        }
        if (errorMsgs.length === 0) {
            document.getElementById('message').innerText = 'Preparing ' + drinkName + '\n' + confirmMsgs.join('\n');
            document.getElementById('message').style.color = 'black';
            this.emptyCredit(kolicinaKredita);
            setTimeout(this.emptyWater.bind(this), 1000, kolicinaVode);
            setTimeout(this.emptyCoffee.bind(this), 2000, kolicinaKafe);
            setTimeout(this.emptyMilk.bind(this), 3000, kolicinaMleka);
            setTimeout(function (){
                document.getElementById('message').innerText = drinkName + ' is finished';
            }, 4000);
            setTimeout(function(){
                document.getElementById('message').innerText = 'DISPLAY MESSAGE';
                document.getElementById('message').style.color = 'black';
            }, 5500);
        } else {
            errorMsgs.splice(0, 0, 'Please refill :)');
            document.getElementById('message').innerText = errorMsgs.join(' \n');
            document.getElementById('message').style.color = 'red';
        }
    }
};

// Pozivanje status funkcija koje treba da prikazu pocetne kolicine sastojaka prilikom ucitavanja strane.

(waterStatus = function () {
    document.getElementById('water-status').innerText = coffeeMachine.water;
})();
(coffeeStatus = function () {
    document.getElementById('coffee-status').innerText = coffeeMachine.coffee;
})();
(milkStatus = function () {
    document.getElementById('milk-status').innerText = coffeeMachine.milk;
})();
(creditStatus = function () {
    return document.getElementById('credit').innerText = coffeeMachine.credit;
})();