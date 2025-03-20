import * as Foret from './foret.js';

console.log("main=", Foret.nom);
Foret.direBonjour("foret");

//todo: remplacer les valeurs par des constantes, et les placer ces constante en début de prog, f
// interval de temps d'affichage & d'accroissement (affichage du timer + mise à jour de l'arbre...)
// interval du temps de vie de l'arbre (nb d'années par interval de temps du timer)
// revoir le calcul des collisions (avec les rayons et la distances entre les troncs)
// créer une classe foret et une classe arbre dans des modules séparés


// 1 timer foret (vs 1 timer / arbre)
// + limite le nombre de ressource du navigateur
// + utile aussi pour afficher les années
// + evite les conflis d'accès lors de la mise à jour des compteurs (ex: 2 arbres veullent mettre à jour le compteur de O2 en même temps)
// + évite de passer en paramètre le compteur de O2, de CO2 à chaque arbre (c'est la foret qui gère les compteurs en demandant à chaque arbre de se mettre à jour)
// - l'ajout d'un arbre (son affichage) sera ascynchrone avec le click mais synchrone avec le timer
// = les deux peuvent être syncrhone si la période du timer est sufffiament petite


// foret 

// ATTRIBUTS
// div conteneur (rectangle blanc)
// * avec une taille fixe (ex: 1000px x 1000px)
// * echelle entre sa surface de sa div et la surface de la terre (cf diametre max de la couronne de l'arbre que l'on doit voir disctinctement)
// compteur de pièces, CO2, O2, volume de bois
// interval du timer qui met à jour de temps d'affichage & d'accroissement (affichage du timer + mise à jour de l'arbre...)
// ex 1000ms (1s) ou bien 1000/8 ms
// interval du temps de vie de l'arbre (nb d'années par interval de temps du timer)
// ex 8 ans ou bien 1 an
// timer 
    // tableau d'arbres

// METHODES
// ajouter un arbre au click
// grandir les arbres (tous les arbres) à chaque interval de temp d'accroissement
// * mise à jour de l'affichage (compteurs en fonction des val retourné par les arbres, dessins des arbres)
// * détection de la fin de vie de l'arbre (marron)
// * détection des colisions

// arbre

// ATTRIBUTS
// div arbre (cercle)
// * avec une taille 
// * echelle entre sa surface de sa div et la surface de la terre (cf diametre max de la couronne de l'arbre que l'on doit voir disctinctement)
// données de croissances (tableau avec 3 lignes CO2, O2, volume de bois et autant de colonnes que d'années ou interval d'année ou interval d'année couvrant la durée de vie de l'arbre)
// age de l'arbre 

// METHODES
// grandir l'arbre :
// * prend en parmètre le nb d'années écoulées
// * retourne les valeurs de CO2, O2, volume de bois généré durant cette période
// * met à jour le rendu (dessin)

document.addEventListener('DOMContentLoaded', (event) => {
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



// === GESTION DU PYROMANE ===

    // Probabilité d'apparition du pyromane
    const pyromaneSpawnChance = 0.05; // 5% de chance d'apparition
    let pyromane = null;
    let burnedTreeLocations = []; // Stocke les positions des arbres brûlés

    setInterval(() => {
        if (!pyromane && Math.random() < pyromaneSpawnChance) {
            spawnPyromane();
        }
    }, 10000); // Vérifie toutes les 10 secondes

    function spawnPyromane() {
        pyromane = document.createElement('div');
        pyromane.className = 'pyromane';

        const conteneurRect = content.getBoundingClientRect();
        pyromane.style.left = `${Math.random() * (conteneurRect.width - 20)}px`;
        pyromane.style.top = `${Math.random() * (conteneurRect.height - 20)}px`;

        content.appendChild(pyromane);
        movePyromane();
    }

    function movePyromane() {
        if (!pyromane) return;

        const trees = document.querySelectorAll('.tree');
        if (trees.length === 0) {
            removePyromane();
            return;
        }

        let closestTree = null;
        let closestDistance = Infinity;
        const pyroRect = pyromane.getBoundingClientRect();

        trees.forEach(tree => {
            const treeRect = tree.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(treeRect.left - pyroRect.left, 2) +
                Math.pow(treeRect.top - pyroRect.top, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestTree = tree;
            }
        });

        if (!closestTree) return;

        pyromane.style.left = `${closestTree.style.left}`;
        pyromane.style.top = `${closestTree.style.top}`;

        setTimeout(() => {
            if (pyromane && closestTree) {
                burnedTreeLocations.push({
                    left: closestTree.style.left,
                    top: closestTree.style.top
                });
                closestTree.remove();
                movePyromane();
            }
        }, 5000);
    }

    function removePyromane() {
        if (pyromane) {
            pyromane.remove();
            pyromane = null;
            burnedTreeLocations = []; // On vide la liste des arbres brûlés lorsque le pyromane disparaît
        }
    }

    // === Garde forestier ===
    const forestGuardButton = document.getElementById('forestGuardButton');
    const forestGuardPrice = 50;
    let forestGuard = null;

    forestGuardButton.addEventListener('click', function () {
        if (compteur >= forestGuardPrice && !forestGuard) {
            compteur -= forestGuardPrice;
            compteurElement.textContent = compteur;
            createForestGuard();
            forestGuardButton.classList.add('disabled');
            forestGuardButton.textContent = "Garde forestier engagé";
        } else {
            alert("Vous n'avez pas assez de pièces ou un garde est déjà présent.");
        }
    });

    function createForestGuard() {
        forestGuard = document.createElement('div');
        forestGuard.className = 'forest-guard';

        const detectionRadius = document.createElement('div');
        detectionRadius.className = 'detection-radius';
        forestGuard.appendChild(detectionRadius);

        forestGuard.style.left = '50%';
        forestGuard.style.top = '50%';

        content.appendChild(forestGuard);

        setInterval(checkForPyromane, 500);
        setInterval(checkNearbyTrees, 500);
        setInterval(moveForestGuard, 4000);
    }

    function checkForPyromane() {
        if (!forestGuard || !pyromane) return;

        const guardRect = forestGuard.getBoundingClientRect();
        const pyroRect = pyromane.getBoundingClientRect();

        const distance = Math.sqrt(
            Math.pow(pyroRect.left - guardRect.left, 2) +
            Math.pow(pyroRect.top - guardRect.top, 2)
        );

        if (distance < 40) {
            removePyromane();
            console.log("Le garde forestier a éliminé le pyromane !");
        }
    }

    function moveForestGuard() {
        if (!forestGuard) return;

        const conteneurRect = content.getBoundingClientRect();
        let targetX, targetY;

        if (burnedTreeLocations.length > 0 && Math.random() < 0.7) {
            const target = burnedTreeLocations[Math.floor(Math.random() * burnedTreeLocations.length)];
            targetX = parseFloat(target.left);
            targetY = parseFloat(target.top);
        } else {
            targetX = Math.random() * (conteneurRect.width - 20);
            targetY = Math.random() * (conteneurRect.height - 20);
        }

        forestGuard.style.left = `${targetX}px`;
        forestGuard.style.top = `${targetY}px`;
    }

    function updateGuardVision(detectedTrees) {
        const visionList = document.getElementById('detected-trees-list');
        visionList.innerHTML = "";
    
        if (Object.keys(detectedTrees).length === 0) {
            visionList.innerHTML = "<li>Aucun arbre détecté</li>";
            return;
        }
    
        for (const [color, count] of Object.entries(detectedTrees)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${count} arbre(s) ${color}`;
            visionList.appendChild(listItem);
        }
    }


// Vérification des arbres proches du garde forestier
function checkNearbyTrees() {
    if (!forestGuard) return;

    const guardRect = forestGuard.getBoundingClientRect();
    const trees = document.querySelectorAll('.tree');
    const detectedTrees = {};

    trees.forEach(tree => {
        const treeRect = tree.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(treeRect.left - guardRect.left, 2) +
            Math.pow(treeRect.top - guardRect.top, 2)
        );

        if (distance < 40) { // Rayon de détection ajusté (80px de diamètre = 40px de rayon)
            const treeType = tree.classList.contains('type1') ? "Vert" :
                             tree.classList.contains('type2') ? "Rouge" :
                             tree.classList.contains('type3') ? "Bleu" : "Inconnu";

            detectedTrees[treeType] = (detectedTrees[treeType] || 0) + 1;
        }
    });

    updateGuardVision(detectedTrees);
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
        if (age >= 1 && age < 10) {
            return 10;
        } else if (age >= 10 && age < 50) {
            return 25;
        } else if (age >= 50 && age < 200) {
            return 40;
        } else if (age >= 200 && age < 500) {
            return 30;
        } else {
            return 0;
        }
    }

    // Fonction pour mettre à jour le compteur de CO2
    function updateCO2Counter() {
        let totalCO2 = 0;
        trees.forEach(tree => {
            totalCO2 += getCO2Value(tree.age);
        });
        document.getElementById('co2').innerText = `CO2 accumulé par an: ${totalCO2}kg`;
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
            updateCO2Counter();
        }, 1000); // Mettre à jour toutes les secondes
    }
});