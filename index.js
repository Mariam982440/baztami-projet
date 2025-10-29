
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


