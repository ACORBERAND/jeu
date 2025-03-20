// import * as Foret from './foret.js';

// console.log("main=", Foret.nom);
// Foret.direBonjour("foret");

document.addEventListener('DOMContentLoaded', async (event) => {
    let compteur = 0;
    let co2Accumule = 0;
    let o2Emis = 0;
    const compteurElement = document.getElementById('compteur');
    const content = document.getElementById('conteneur');
    const removeTreesButton = document.getElementById('removeTreesButton');
    const treeTypeButtons = document.querySelectorAll('.treeTypeButton');
    const type2Button = document.getElementById('type2Button');
    const type3Button = document.getElementById('type3Button');
    const time = 3000;
    let treeCount = 0;
    let removeMode = false;
    let selectedTreeType = null;
    let timerStarted = false;
    let firstType1Tree = true;
    const trees = [];

    const treePrices = {
        type1: 0,
        type2: 20,
        type3: 40
    };

    const initialSize = 5;
    const maxSize = 30;
    const growthDuration = 500; // 500 years
    const growthInterval = 10; // 10 milliseconds
    const growthStep = (maxSize - initialSize) / (growthDuration * 1000 / 8.3 / growthInterval);

    // Charger les données JSON
    let cheneData;
    try {
        const response = await fetch('./arbres_co2_o2.json');
        const data = await response.json();
        cheneData = data.chene;
    } catch (error) {
        console.error('Erreur lors du chargement des données JSON:', error);
        return;
    }

    // Initialiser les prix des boutons au chargement de la page
    updateAllButtonTexts();
    updateButtonStates();

    // Activer le mode de suppression lorsqu'on clique sur le bouton
    removeTreesButton.addEventListener('click', function () {
        removeMode = true;
        selectedTreeType = null;
        content.removeEventListener('click', handleContentClick);
    });

    // Sélectionner le type d'arbre lorsqu'on clique sur un bouton de type d'arbre
    treeTypeButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedTreeType = this.getAttribute('data-tree-type');
            removeMode = false;
            content.addEventListener('click', handleContentClick);
        });
    });

    // Gérer le clic dans le conteneur pour ajouter un arbre
    function handleContentClick(event) {
        if (selectedTreeType && event.target === content) {
            let treePrice = treePrices[selectedTreeType];
            if (selectedTreeType === 'type1' && !firstType1Tree) {
                treePrice = 5;
            }
            if (compteur >= treePrice) {
                compteur -= treePrice;
                compteurElement.textContent = compteur;
                addTree(event.clientX, event.clientY, selectedTreeType);
                if (selectedTreeType === 'type1' && firstType1Tree) {
                    firstType1Tree = false;
                    treePrices.type1 = 5; // Mettre à jour le prix pour les arbres suivants
                    updateButtonText('type1'); // Mettre à jour le texte du bouton
                    if (!timerStarted) {
                        startTimer(); // Démarrer le timer lorsque le premier arbre de type 1 est ajouté
                        timerStarted = true;
                    }
                }
                updateButtonStates();
                if (selectedTreeType === 'type1') {
                    type2Button.style.display = 'block';
                }
                if (selectedTreeType === 'type2') {
                    type3Button.style.display = 'block';
                }
            } else {
                alert("Vous n'avez pas assez de pièces pour acheter cet arbre.");
            }
        }
    }

    // Ajouter un arbre
    function addTree(x, y, treeType) {
        const tree = document.createElement('div');
        tree.className = `tree ${treeType}`;
        treeCount++;

        const rect = content.getBoundingClientRect();
        const treeX = x - rect.left + 2;
        const treeY = y - rect.top + 2;

        tree.style.left = treeX - initialSize / 2 + 'px';
        tree.style.top = treeY - initialSize / 2 + 'px';
        tree.style.width = initialSize + 'px';
        tree.style.height = initialSize + 'px';

        content.appendChild(tree);

        // Faire grandir l'arbre
        let growCount = 0;
        const growInterval = setInterval(() => {
            if (growCount < growthDuration * 1000 / 8.3 / growthInterval) {
                growTree(tree, growthStep);
                growCount++;
            } else {
                clearInterval(growInterval);
                tree.style.backgroundColor = 'brown';
                tree.isBrown = true; // Marquer l'arbre comme marron
                clearInterval(tree.coinInterval); // Arrêter l'intervalle qui ajoute des pièces

                // Set a random time between 2 and 500 years to die
                const deathTime = Math.random() * (500 - 2) + 2;
                setTimeout(() => {
                    tree.remove();
                }, deathTime * 1000 / 8.3);
            }
        }, growthInterval);

        checkCollisions(tree);

        const coinInterval = setInterval(() => {
            if (!tree.isBrown) {
                compteur++;
                compteurElement.textContent = compteur;
                updateButtonStates();
            }
        }, 2000);

        tree.coinInterval = coinInterval;

        tree.addEventListener('click', function (event) {
            if (removeMode) {
                clearInterval(tree.coinInterval);
                if (tree.isBrown) {
                    addCoins(treeType);
                }
                tree.remove();
                updateButtonStates();
            } else {
                tree.classList.toggle('selected');
            }
            event.stopPropagation();
        });

        // Ajouter l'arbre à la liste des arbres avec son âge initial
        trees.push({ element: tree, age: 0 });
    }

    // Ajouter des pièces en fonction du type d'arbre détruit
    function addCoins(treeType) {
        let coins = 0;
        switch (treeType) {
            case 'type1':
                coins = 10;
                break;
            case 'type2':
                coins = 20;
                break;
            case 'type3':
                coins = 40;
                break;
        }
        compteur += coins;
        compteurElement.textContent = compteur;
        updateButtonStates();
    }

    // Faire grandir l'arbre
    function growTree(tree, growthStep) {
        const newSize = parseFloat(tree.style.width) + growthStep;
        const deltaSize = growthStep / 2;
        tree.style.width = newSize + 'px';
        tree.style.height = newSize + 'px';
        tree.style.left = parseFloat(tree.style.left) - deltaSize + 'px';
        tree.style.top = parseFloat(tree.style.top) - deltaSize + 'px';

        checkCollisions(tree);
    }

    // Vérifier les collisions
    function checkCollisions(tree) {
        const trees = document.querySelectorAll('.tree');
        trees.forEach(otherTree => {
            if (otherTree !== tree && isColliding(tree, otherTree)) {
                clearInterval(otherTree.coinInterval);
                otherTree.remove();
            }
        });
    }

    // Vérifier si deux arbres sont en collision
    function isColliding(tree1, tree2) {
        const rect1 = tree1.getBoundingClientRect();
        const rect2 = tree2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    // Mettre à jour le texte du bouton avec le nouveau prix
    function updateButtonText(treeType) {
        const button = document.querySelector(`.treeTypeButton[data-tree-type="${treeType}"]`);
        let buttonText = '';
        const price = treePrices[treeType];
        button.setAttribute('data-price', price);
        switch (treeType) {
            case 'type1':
                buttonText = `Ajouter un arbre vert (${firstType1Tree ? 'Gratuit' : '5 pièces'})`;
                break;
            case 'type2':
                buttonText = `Ajouter un arbre rouge (${price} pièces)`;
                break;
            case 'type3':
                buttonText = `Ajouter un arbre bleu (${price} pièces)`;
                break;
        }
        button.textContent = buttonText;
    }

    // Mettre à jour le texte de tous les boutons avec les prix actuels
    function updateAllButtonTexts() {
        updateButtonText('type1');
        updateButtonText('type2');
        updateButtonText('type3');
    }

    // Mettre à jour l'état des boutons en fonction du nombre de pièces
    function updateButtonStates() {
        treeTypeButtons.forEach(button => {
            const treeType = button.getAttribute('data-tree-type');
            const price = treePrices[treeType];
            if (compteur >= price) {
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
            }
        });
    }

    // Fonction pour obtenir la valeur de CO2 en fonction de l'âge de l'arbre
    function getCO2Value(age) {
        const yearData = cheneData.find(data => data.année === Math.floor(age));
        return yearData ? yearData.CO2_absorbé_kg : 0;
    }

    // Fonction pour obtenir la valeur d'O2 en fonction de l'âge de l'arbre
    function getO2Value(age) {
        const yearData = cheneData.find(data => data.année === Math.floor(age));
        return yearData ? yearData.O2_émis_kg : 0;
    }

    // Fonction pour mettre à jour le compteur de CO2 et d'O2
    function updateCO2O2Counter() {
        let totalCO2 = 0;
        let totalO2 = 0;
        trees.forEach(tree => {
            totalCO2 += getCO2Value(tree.age);
            totalO2 += getO2Value(tree.age);
        });
        document.getElementById('co2').innerText = `CO2 accumulé par an: ${totalCO2.toFixed(2)}kg`;
        document.getElementById('o2').innerText = `O2 émis par an: ${totalO2.toFixed(2)}kg`;
    }

    // Fonction pour démarrer le timer des années
    function startTimer() {
        let years = 0;
        const yearsElement = document.getElementById('years');
        setInterval(() => {
            years += 8.3; // Incrémenter les années
            yearsElement.textContent = `Années écoulées: ${years.toFixed(2)}`;
            trees.forEach(tree => {
                tree.age += 8.3; // Incrémenter l'âge de chaque arbre
            });
            updateCO2O2Counter();
        }, 1000); // Mettre à jour toutes les secondes
    }
});