
document.addEventListener('DOMContentLoaded', (event) => {
    checkLoginState();
});

function checkLoginState() {
    // le statut de connexion est vérifié en fonction de l'existence d'une variable de session.
    var isLoggedIn = sessionStorage.getItem('userLoggedIn'); // => sessionStorage

    if (isLoggedIn) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
    }
}
// Afficher la fenêtre contextuelle
function showPopup() {
    var popup = document.getElementById('subscribe-popup');
    popup.style.display = 'block';
}

// Popup penceresini kapat
function closePopup() {
    var popup = document.getElementById('subscribe-popup');
    popup.style.display = 'none';
}
// Afficher une fenêtre contextuelle lorsque vous cliquez sur le bouton
document.getElementById('subscribe').addEventListener('click', showPopup);
// Fermez la fenêtre contextuelle lorsque vous cliquez sur le bouton Fermer
document.querySelector('.close').addEventListener('click', closePopup);

// Fermer la fenêtre contextuelle lorsque vous cliquez en dehors de la fenêtre
window.onclick = function(event) {
    var popup = document.getElementById('subscribe-popup');
    if (event.target == popup) {
        popup.style.display = 'none';
    }
}
// Afficher la fenêtre contextuelle de connexion
function showLoginPopup() {
    var popup = document.getElementById('login-popup');
    popup.style.display = 'block';
}
// Fermer la fenêtre contextuelle de connexion
function closeLoginPopup() {
    var popup = document.getElementById('login-popup');
    popup.style.display = 'none';
}

// 'login' => event listener
document.getElementById('login-btn').addEventListener('click', showLoginPopup);

// Semblable aux fonctions existantes pour les opérations de fermeture, connectez-vous pour une fenêtre contextuelle
var closeButtons = document.getElementsByClassName("close");
for(var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function() {
        closeLoginPopup();
        closePopup(); // même bouton de fermeture pour les deux popups
    });
}
// Fermez toutes les fenêtres contextuelles lorsque vous cliquez en dehors de la fenêtre
window.onclick = function(event) {
    if (event.target == document.getElementById('login-popup')) {
        closeLoginPopup();
    }
    if (event.target == document.getElementById('subscribe-popup')) {
        closePopup();
    }
}
// Add event listener for subscription form submission
document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('/Backend/subscribe.php', {
        method: 'POST',
        body: data
    })
        .then(response => response.text())
        .then(text => {
            if (text === 'success') {
                alert('Subscription successful.');
                closePopup();
            } else {
                alert('Subscription failed: ' + text);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
})


const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirm-password').value;
if (password !== confirmPassword) {
    alert('Passwords do not match.');

}

//let userMarker = null;
//login
document.getElementById('login-form').addEventListener('submit', function(event) {
event.preventDefault();
var email = document.getElementById('login-email').value;
var password = document.getElementById('login-password').value;
loginuser(email, password); // Appel de la fonction loginuser
});

function loginuser(email, password) {
fetch('/Backend/login.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
})
.then(response => response.text())
.then(text => {
    if (text === 'success') {
        document.getElementById('subscribe').style.display= 'none';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('messages-btn').style.display = 'block';
        document.getElementById('filter-btn').style.display = 'block';
        document.getElementById('mypage-btn').style.display = 'block';

        sessionStorage.setItem('isLoggedIn', true);

        //localStorage.setItem('isLoggedIn', 'true');
        console.log('Connexion réussie');

        showUserAddressOnMap();

    } else { //login failed
        alert('Les informations de connexion sont incorrectes.');
    }
})
.catch(error => {
    console.error('Error:', error);
});
}

//logout
document.getElementById('logout-btn').addEventListener('click', logoutuser);

function logoutuser(){
sessionStorage.clear();
sessionStorage.setItem('isLoggedIn', false);
fetch('/Backend/logout.php',{
    method:'POST'
})
.then(response => response.text())
.then(text => {
    if (userMarker) {
        userMarker.remove();
    }
    sessionStorage.clear();
    //Pour supprimer les annonces ajoutées au panier avec session storege
    window.location.reload()
    //window.location.href = 'index.html';
})
.catch(error => {
    console.error('Error:', error);
})
}
// Affiche les publicités sur la page d'accueil.
document.addEventListener('DOMContentLoaded', () => {
fetchAds();
setInterval(fetchAds, 300000);
});
function fetchAds(){
fetch('/Backend/accueil.php')
    .then(response => response.json())
    .then( data => {
        console.log('publicité : ', data)
        if (data.ads && data.ads.length) {
            const adsContainer = document.getElementById('ads-container');
            adsContainer.innerHTML = '';
            data.ads.forEach(ad => {
                const adDiv = document.createElement('div');
                adDiv.className = 'ad';
                adDiv.innerHTML = `
                    <h3>${ad.title}</h3>
                    <p>${ad.situation}</p>
                    <img src="${ad.photo_url}" alt="ads Image">
                    <p>nom: ${ad.product_name}</p>
                    <p>price: ${ad.product_price}</p>
                    <p>Stock: ${ad.product_stock}</p>
                    <p>Adresse: ${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}</p>
                    <p>creation_date: ${new Date(ad.creation_date).toLocaleDateString()}</p>
                `;
                adsContainer.appendChild(adDiv);

                adDiv.addEventListener('click', function() {
                    window.location.href = `ad.html?id=${ad.id}`; // Redirection vers la page de détail
                });
                //console.log(document.querySelectorAll('.ad'));
                //document.querySelectorAll('.ad').style.backgroundImage = `url('${ad.photo_url}')`;
            });
            const ads = document.querySelectorAll('.ad');
            ads.forEach(adElement => {
                const img = adElement.querySelector('img'); // Prendre l'URL depuis l'élément <img>.
                if (img && img.src) {
                    adElement.style.backgroundImage = `url('${img.src}')`;
                }
            });
        } else {
            console.error('No ads to display');
        }
    })
    .catch(error =>{
        console.error('fetch error' , error);
});

}

// Bastien et Scapin


const emailInput = document.getElementById('login-email');
const suggestionsBox = document.getElementById('email-suggestions');
const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
emailInput.addEventListener('input', function() {
const value = emailInput.value;
const atPosition = value.indexOf('@');
if (atPosition !== -1) {
    const query = value.slice(atPosition + 1);
    const filteredDomains = domains.filter(domain => domain.startsWith(query));
    if (filteredDomains.length > 0) {
        suggestionsBox.innerHTML = filteredDomains.map(domain => `<div>${value.slice(0, atPosition + 1)}${domain}</div>`).join('');
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
    }
} else {
    suggestionsBox.style.display = 'none';
}
});
suggestionsBox.addEventListener('click', function(e) {
if (e.target.tagName === 'DIV') {
    emailInput.value = e.target.textContent;
    suggestionsBox.style.display = 'none';
}
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function (e) {
let value = e.target.value.replace(/\D/g, '');
if (value.length > 3 && value.length <= 6) {
    value = value.replace(/(\d{3})(\d+)/, '$1 $2');
} else if (value.length > 6 && value.length <= 10) {
    value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
} else if (value.length > 10) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
e.target.value = value;
});


// Password strength and match feedback
document.getElementById('password').addEventListener('input', function() {
const passwordFeedback = document.getElementById('password-feedback');
if (this.value.length >= 8) {
    passwordFeedback.textContent = 'Mot de passe valide';
    passwordFeedback.style.color = 'green';
} else {
    passwordFeedback.textContent = 'Le mot de passe doit contenir au moins 8 caractères';
    passwordFeedback.style.color = 'red';
}
});




