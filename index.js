let mesTransactions = [];

// Load saved transactions
window.onload = function() {
    const saved = localStorage.getItem('transaction');
    if (saved) mesTransactions = JSON.parse(saved);
    afficherTransactions();

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

        html += `
        <div class="text-center m-20 border-4 border-indigo-100 shadow-md rounded-xl ${couleur} w-[80%] pr-40 pl-40 pt-15 pb-15">
            <div class="text-[150%] font-bold mb-3">${t.description}</div>
            <div class="text-[120%] text-gray-600 mb-2">${t.date}</div>
            <div class="text-[120%] mb-3">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    ${t.type === 'revenu' ? '💰 Revenu' : '💸 Dépense'}
                </span>
            </div>
            <div class="text-[200%] font-bold">${signe}${t.montant} MAD</div>
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

    mesTransactions.push({ type, montant, date, description });
    localStorage.setItem('transaction', JSON.stringify(mesTransactions));

    afficherTransactions();
    document.querySelector('form').reset();
    closePopup();
}
