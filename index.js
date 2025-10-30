let mesTransactions = [];
function openPopup() {
    let popup = document.getElementById('popup');
    popup.classList.remove('hidden');
}


function closePopup() {
    let popup = document.getElementById('popup');
    popup.classList.add('hidden');
}


function verifierFormulaire() {
    
    
    let type = document.getElementById('type').value;
    let montant = document.getElementById('montant').value;
    let date = document.getElementById('date').value;
    let description = document.getElementById('description').value;
    
   
    if (type === '') {
        alert('Veuillez sélectionner un type (Revenu ou Dépense)');
        return false;
    }


    if (montant === '') {
        alert('Veuillez entrer un montant');
        return false;
    }
    
    if (montant <= 0) {
        alert('Le montant doit être supérieur à 0');
        return false;
    }
    
    if (montant > 10000000) {
        alert('Le montant est trop grand (maximum 10 000 000)');
        return false;
    }


    if (date === '') {
        alert('Veuillez sélectionner une date');
        return false;
    }
    
    let dateChoisie = new Date(date);
    let aujourdhui = new Date();
    
    if (dateChoisie > aujourdhui) {
        alert('La date ne peut pas être dans le futur');
        return false;
    }
    
    if (description === '') {
        alert('Veuillez entrer une description');
        return false;
    }
    
    if (description.length < 3) {
        alert('La description doit avoir au moins 3 caractères');
        return false;
    }
    
    if (description.length > 200) {
        alert('La description est trop longue (maximum 200 caractères)');
        return false;
    }
    
    
    
    return true;
}
function afficherTransactions() {
    let zoneCartes =document.getElementById('carte-affichage');
    
    zoneCartes.innerHTML = '';
    
    for(let i=0;i<mesTransactions.length; i++){
        let transaction =mesTransactions[i];

        let couleurMontant = '';
        let signe = '';
        if (transaction.type === 'revenu') {
            couleurMontant = 'text-green-500';
            signe = '+';
        } else {
            couleurMontant = 'text-red-500';
            signe = '-';
        }

    }
    
    for (let i = 0; i < mesTransactions.length; i++) {
        
        // Récupérer une transaction
        let transaction = mesTransactions[i];
        
        // Choisir la couleur selon le type
        let couleurMontant = '';
        let signe = '';
        if (transaction.type === 'revenu') {
            couleurcarte = 'bg-green-500';
            signe = '+';
        } else {
            couleurcarte = 'bg-red-500';
            signe = '-';
        }
        
        // 4. Créer le HTML de la carte
        let carteHTML = `
            <div class="text-center m-20 border-4 border-indigo-100 shadow-md rounded-xl ${couleurcarte}  w-fit p-0">
                <div class="text-[150%] font-bold mb-3">${transaction.description}</div>
                <div class="text-[120%] text-gray-600 mb-2"> ${transaction.date}</div>
                <div class="text-[120%] mb-3">
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        ${transaction.type === 'revenu' ? '💰 Revenu' : '💸 Dépense'}
                    </span>
                </div>
                <div class="text-[200%] font-bold ">${signe}${transaction.montant} MAD</div>
            </div>
        `;
         
        
        
        // 5. Ajouter la carte dans la zone
        zoneCartes.innerHTML += carteHTML;
    }
    
    // Si aucune transaction, afficher un message
    if (mesTransactions.length === 0) {
        zoneCartes.innerHTML = `
            <div class="text-center m-20 p-20 w-full">
                <p class="text-[150%] text-gray-400">📭 Aucune transaction pour le moment</p>
                <p class="text-gray-500 mt-4">Cliquez sur "Ajouter une transaction" pour commencer</p>
            </div>
        `;
    }
}

function enregistrerTransaction(event) {
    
    event.preventDefault();
    
    let formulaireValide = verifierFormulaire();
    
    if (formulaireValide === false) {
        return;
    }
    
    let type = document.getElementById('type').value;
    let montant = document.getElementById('montant').value;
    let date = document.getElementById('date').value;
    let description = document.getElementById('description').value;

 
    let nouvelleTransaction = {
        type: type,
        montant: montant,
        date: date,
        description: description
    };
    
    mesTransactions.push(nouvelleTransaction);
   
    alert('Transaction enregistrée avec succès !');
    
    console.log('Transaction ajoutée:', nouvelleTransaction);
    console.log('Total de transactions:', mesTransactions.length);
    
    afficherTransactions()
    document.getElementById('type').value = '';
    document.getElementById('montant').value = '';
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    
    closePopup();
}

window.onload = function() {
    
    // Afficher les transactions au démarrage (vide au début)
    afficherTransactions();
    
    // Trouver le formulaire
    let formulaire = document.querySelector('form');
    
    // Quand on soumet le formulaire, appeler la fonction enregistrerTransaction
    formulaire.onsubmit = enregistrerTransaction;
    
    
};



