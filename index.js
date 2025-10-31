let mesTransactions = [];

// Load saved transactions
window.onload = function() {
    const saved = localStorage.getItem('transaction');
    if (saved) mesTransactions = JSON.parse(saved);
    afficherTransactions();
    calculerEtAfficherTotaux();

    document.querySelector('form').onsubmit = enregistrerTransaction;
};

// pour le popup to open and close
function openPopup() { document.getElementById('popup').classList.remove('hidden'); }
function closePopup() { document.getElementById('popup').classList.add('hidden'); }

// pour afficher les transaction
function afficherTransactions() {
    const zone = document.getElementById('carte-affichage');

    if (mesTransactions.length === 0) {
        zone.innerHTML = `
        <div class="text-center m-20 p-20 w-full">
            <p class="text-[150%] text-gray-400">Aucune transaction pour le moment</p>
            <p class="text-gray-500 mt-4">Cliquez sur "Ajouter une transaction" pour commencer</p>
        </div>`;
        return;
    }

    // 
    let html = '';

    // boucle sur les transactions
    for (let i = 0; i < mesTransactions.length; i++) {
        const t = mesTransactions[i];
        const couleur = t.type === 'revenu' ? 'bg-green-500' : 'bg-red-500';
        const signe = t.type === 'revenu' ? '+' : '-';
        const cadre = t.type === 'revenu'? 'border-green-300':'border-red-300';

        html += `
        <div
        class="flex justify-between text-center bg-opacity-20 mx-20  border-4 ${cadre} shadow-md rounded-xl ${couleur} w-[50%]  py-6 px-12">
        <div class="flex flex-col  justify-start">

            <div class="text-[160%] font-bold mb-3">${t.description}</div>
            <div class="text-[90%] text-gray-600 mb-2">${t.date}</div>

        </div>
        <div class="flex gap-10 justify-end items-center ">
            <div class="text-[140%] font-bold">${signe}${t.montant} MAD</div>
            <button><i class=" text-[160%] fa-regular fa-trash"></i></button>
            <button><i class=" text-[160%] fa-regular fa-pen-to-square"></i></button>
        </div>


    </div>`;


        

    }

    // modifie html
    zone.innerHTML = html;
}


// pour enregistrer une nouvelle transaction
function enregistrerTransaction(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const montant = parseFloat(document.getElementById('montant').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    if (!type || !montant || !date || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    mesTransactions.push({ type, montant, date, description, status: "active" });
    localStorage.setItem('transaction', JSON.stringify(mesTransactions));

    afficherTransactions();
    calculerEtAfficherTotaux();
    document.querySelector('form').reset();
    closePopup();
}

function calculerEtAfficherTotaux() {
    let revenuTotal = 0;
    let depenseTotal = 0;
    
    for (let i = 0; i < mesTransactions.length; i++) {
        const transaction = mesTransactions[i];
        const montant = parseFloat(transaction.montant);
        
        if (transaction.type === 'revenu') {
            revenuTotal = revenuTotal + montant;
        } else if (transaction.type === 'depense') {
            depenseTotal = depenseTotal + montant;
        }
    }
    
    let soldeNet = revenuTotal - depenseTotal;
    
    afficherLesTotaux(soldeNet, revenuTotal, depenseTotal);
}


function afficherLesTotaux(soldeNet, revenuTotal, depenseTotal) {
    // Formater les montants avec des espaces
    let soldeFormate = soldeNet.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let revenuFormate = revenuTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let depenseFormate = depenseTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Choisir la couleur du solde selon s'il est positif ou négatif
    let couleurSolde = soldeNet >= 0 ? 'text-blue-500' : 'text-red-500';
    
    // Modifier le HTML
    document.getElementById('solde').innerHTML = `
        <div class="text-[200%]">Solde Net</div>
        <div class="text-[290%] font-bold">${soldeFormate} MAD</div>
    `;
    
    document.getElementById('revenu').innerHTML = `
        <div class="text-[200%]">Revenu Total</div>
        <div class="text-[290%] text-green-500 font-bold">+${revenuFormate} MAD</div>
    `;
    
    document.getElementById('depense').innerHTML = `
        <div class="text-[200%]">Dépenses Totales</div>
        <div class="text-[290%] text-red-500 font-bold">-${depenseFormate} MAD</div>
    `;
}

function supprimerTransaction(index){
    mesTransactions[index].status='deleted';
    
    localStorage.setItem('transaction', JSON.stringify(mesTransactions)); 
    afficherTransactions(); 
    calculerEtAfficherTotaux();
}