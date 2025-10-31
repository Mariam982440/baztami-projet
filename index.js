const darkLightBtn = document.querySelector('.dark-light');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    htmlElement.classList.add('dark');
} else if (currentTheme === 'light') {
    htmlElement.classList.remove('dark');
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
    }
}

darkLightBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

let mesTransactions = [];
let indexModifier = null;

// Load saved transactions
window.onload = function() {
    const saved = localStorage.getItem('transaction');
    if (saved) mesTransactions = JSON.parse(saved);
    afficherTransactions();
    calculerEtAfficherTotaux();

    document.querySelector('form').onsubmit = enregistrerTransaction;
};

// Pour le popup to open and close
function openPopup() { 
    if (indexModifier === null) {
        document.getElementById('type').value = '';
        document.getElementById('montant').value = '';
        document.getElementById('date').value = '';
        document.getElementById('description').value = '';
        document.querySelector('#popup h2').textContent = 'Nouvelle Transaction';
    } else {
        document.querySelector('#popup h2').textContent = 'Modifier Transaction';
    }
    
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').classList.add('flex');
}

function closePopup() { 
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('popup').classList.remove('flex');
    
    indexModifier = null;
    
    document.querySelector('form').reset();
}

// Pour afficher les transactions
function afficherTransactions() {
    const zone = document.getElementById('carte-affichage');

    if (mesTransactions.length === 0 || mesTransactions.every(t => t.status === 'deleted')) {
        zone.innerHTML = `
        <div class="text-center m-20 p-20 w-full">
            <p class="text-[150%] text-gray-400 dark:text-gray-500">Aucune transaction pour le moment</p>
            <p class="text-gray-500 dark:text-gray-600 mt-4">Cliquez sur "Ajouter une transaction" pour commencer</p>
        </div>`;
        return;
    }

    let html = '';

    for (let i = 0; i < mesTransactions.length; i++) {
        const t = mesTransactions[i];
        if (t.status === "deleted") continue; 
        
        const couleur = t.type === 'revenu' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20';
        const signe = t.type === 'revenu' ? '+' : '-';
        const cadre = t.type === 'revenu' ? 'border-green-300 dark:border-green-700' : 'border-red-300 dark:border-red-700';
        const textColor = 'text-gray-800 dark:text-gray-200';
        const dateColor = 'text-gray-600 dark:text-gray-400';

        html += `
        <div class="flex justify-between text-center mx-20 border-4 ${cadre} shadow-md rounded-xl ${couleur} w-[50%] py-6 px-12">
            <div class="flex flex-col justify-start">
                <div class="text-[160%] font-bold mb-3 ${textColor}">${t.description}</div>
                <div class="text-[90%] ${dateColor} mb-2">${t.date}</div>
            </div>
            <div class="flex gap-10 justify-end items-center">
                <div class="text-[140%] font-bold ${textColor}">${signe}${t.montant} MAD</div>
                <button onclick="supprimerTransaction(${i})" class="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <i class="text-[160%] fa-solid fa-trash"></i>
                </button>
                <button onclick="modifierTransaction(${i})" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <i class="text-[160%] fa-regular fa-pen-to-square"></i>
                </button>
            </div>
        </div>`;
    }

    zone.innerHTML = html;
}

function calculerEtAfficherTotaux() {
    let revenuTotal = 0;
    let depenseTotal = 0;
    
    for (let i = 0; i < mesTransactions.length; i++) {
        const transaction = mesTransactions[i];
        if (transaction.status === 'deleted') continue;
        
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
    let soldeFormate = soldeNet.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let revenuFormate = revenuTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let depenseFormate = depenseTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('solde').innerHTML = `
        <div class="text-[200%] dark:text-gray-300">Solde Net</div>
        <div class="text-[290%] font-bold">${soldeFormate} MAD</div>
    `;
    
    document.getElementById('revenu').innerHTML = `
        <div class="text-[200%] dark:text-gray-300">Revenu Total</div>
        <div class="text-[290%] text-green-500 dark:text-green-400 font-bold">+${revenuFormate} MAD</div>
    `;
    
    document.getElementById('depense').innerHTML = `
        <div class="text-[200%] dark:text-gray-300">Dépenses Totales</div>
        <div class="text-[290%] text-red-500 dark:text-red-400 font-bold">-${depenseFormate} MAD</div>
    `;
}

function supprimerTransaction(index) {
    
    const confirmer = confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?");
    
    if (!confirmer) {
        
        return;
    }

    
    mesTransactions[index].status = 'deleted';
    localStorage.setItem('transaction', JSON.stringify(mesTransactions)); 
    afficherTransactions(); 
    calculerEtAfficherTotaux();
}

function modifierTransaction(index) {
    indexModifier = index;
    document.getElementById('description').value = mesTransactions[index].description;
    document.getElementById('montant').value = mesTransactions[index].montant;
    document.getElementById('type').value = mesTransactions[index].type;
    document.getElementById('date').value = mesTransactions[index].date;
    
    openPopup();
}

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

    if (indexModifier !== null) {
        // Modification
        mesTransactions[indexModifier].type = type;
        mesTransactions[indexModifier].montant = montant;
        mesTransactions[indexModifier].date = date;
        mesTransactions[indexModifier].description = description;

        indexModifier = null; 
    } else {
        // Ajout
        mesTransactions.push({
            type,
            montant,
            date,
            description,
            status: "active"
        });
    }

    localStorage.setItem('transaction', JSON.stringify(mesTransactions));

    afficherTransactions();
    calculerEtAfficherTotaux();
    
    document.querySelector('form').reset();
    closePopup();
}