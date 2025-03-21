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
    const points = [];

    const treePrices = {
        type1: 0,
        type2: 20,
        type3: 40
    };

    const initialSize = 5;
    const maxSize = 30;
    const growthDurationType1 = 500; // 500 years for type1
    const growthDurationType2 = 120; // 120 years for type2
    const growthDurationType3 = 500; // 500 years for type3
    const growthInterval = 10; // 10 milliseconds
    const growthStepType1 = (maxSize - initialSize) / (growthDurationType1 * 1000 / 8.3 / growthInterval);
    const growthStepType2 = (maxSize - initialSize) / (growthDurationType2 * 1000 / 8.3 / growthInterval);
    const growthStepType3 = (maxSize - initialSize) / (growthDurationType3 * 1000 / 8.3 / growthInterval);

    // Charger les données JSON
    let cheneData, bouleauData, sapinData;
    try {
        const response = await fetch('./arbres_co2_o2.json');
        const data = await response.json();
        cheneData = data.chene;
        bouleauData = data.bouleau;
        sapinData = data.sapin;
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
                updateCO2O2Counter(); // Mettre à jour les compteurs après l'ajout d'un arbre
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
        const growthStep = treeType === 'type2' ? growthStepType2 : (treeType === 'type3' ? growthStepType3 : growthStepType1);
        const growInterval = setInterval(() => {
            if (growCount < (treeType === 'type2' ? growthDurationType2 : (treeType === 'type3' ? growthDurationType3 : growthDurationType1)) * 1000 / 8.3 / growthInterval) {
                growTree(tree, growthStep);
                growCount++;
            } else {
                clearInterval(growInterval);
                if (tree && tree.parentElement) {
                    tree.style.backgroundColor = 'brown';
                    tree.isBrown = true; // Marquer l'arbre comme marron
                    clearInterval(tree.coinInterval); // Arrêter l'intervalle qui ajoute des pièces
                    updateCO2O2Counter(); // Mettre à jour les compteurs après que l'arbre devient marron
                }
            }
        }, growthInterval);

        checkCollisions(tree);

        const coinInterval = setInterval(() => {
            if (tree && tree.parentElement && !tree.isBrown) {
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
                trees.splice(trees.indexOf(tree), 1); // Supprimer l'arbre de la liste
                updateButtonStates();
                updateCO2O2Counter(); // Mettre à jour les compteurs après la suppression de l'arbre
            } else {
                tree.classList.toggle('selected');
            }
            event.stopPropagation();
        });

        // Ajouter l'arbre à la liste des arbres avec son âge initial
        trees.push({ element: tree, age: 0, type: treeType });
        updateCO2O2Counter(); // Mettre à jour les compteurs après l'ajout d'un arbre
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
                updateCO2O2Counter(); // Mettre à jour les compteurs après la suppression de l'arbre
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
    function getCO2Value(age, type) {
        let yearData;
        switch (type) {
            case 'type1':
                yearData = cheneData.find(data => data.année === Math.floor(age));
                break;
            case 'type2':
                yearData = bouleauData.find(data => data.année === Math.floor(age));
                break;
            case 'type3':
                yearData = sapinData.find(data => data.année === Math.floor(age));
                break;
        }
        return yearData ? yearData.CO2_absorbé_kg : 0;
    }

    // Fonction pour obtenir la valeur d'O2 en fonction de l'âge de l'arbre
    function getO2Value(age, type) {
        let yearData;
        switch (type) {
            case 'type1':
                yearData = cheneData.find(data => data.année === Math.floor(age));
                break;
            case 'type2':
                yearData = bouleauData.find(data => data.année === Math.floor(age));
                break;
            case 'type3':
                yearData = sapinData.find(data => data.année === Math.floor(age));
                break;
        }
        return yearData ? yearData.O2_émis_kg : 0;
    }

    // Fonction pour mettre à jour le compteur de CO2 et d'O2
    function updateCO2O2Counter() {
        let totalCO2 = 0;
        let totalO2 = 0;
        trees.forEach(tree => {
            if (!tree.isBrown) {
                totalCO2 += getCO2Value(tree.age, tree.type);
                totalO2 += getO2Value(tree.age, tree.type);
            }
        });
        document.getElementById('co2').innerText = `CO2 accumulé par an: ${totalCO2.toFixed(2)}kg`;
        document.getElementById('o2').innerText = `O2 émis par an: ${totalO2.toFixed(2)}kg`;
        window.co2Accumule = totalCO2;
        window.o2Accumule = totalO2;
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
                const yearData = (tree.type === 'type2' && tree.age >= 120) || (tree.type === 'type3' && tree.age >= 500) ? null : getYearData(tree.age, tree.type);
                if (!yearData && tree && tree.parentElement && !tree.isBrown) {
                    tree.style.backgroundColor = 'brown';
                    tree.isBrown = true; // Marquer l'arbre comme marron
                    clearInterval(tree.coinInterval); // Arrêter l'intervalle qui ajoute des pièces
                    updateCO2O2Counter(); // Mettre à jour les compteurs après que l'arbre devient marron
                }
            });
            updateCO2O2Counter();
        }, 1000); // Mettre à jour toutes les secondes
    }

    // Fonction pour obtenir les données de l'année en fonction de l'âge et du type d'arbre
    function getYearData(age, type) {
        let yearData;
        switch (type) {
            case 'type1':
                yearData = cheneData.find(data => data.année === Math.floor(age));
                break;
            case 'type2':
                yearData = bouleauData.find(data => data.année === Math.floor(age));
                break;
            case 'type3':
                yearData = sapinData.find(data => data.année === Math.floor(age));
                break;
        }
        return yearData;
    }

    // Fonction pour créer et déplacer le point mobile
    function createMovingPoint() {
        if (points.length >= 2) return; // Limiter à deux points maximum

        const point = document.createElement('div');
        point.className = 'moving-point';
        point.style.position = 'absolute';
        point.style.width = '30px';
        point.style.height = '30px';
        point.style.backgroundColor = 'red';
        point.style.borderRadius = '50%';

        // Position initiale aléatoire sur le bord du conteneur
        let pointX, pointY;
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        switch (side) {
            case 0: // top
                pointX = Math.random() * (content.clientWidth - 30);
                pointY = 0;
                break;
            case 1: // right
                pointX = content.clientWidth - 30;
                pointY = Math.random() * (content.clientHeight - 30);
                break;
            case 2: // bottom
                pointX = Math.random() * (content.clientWidth - 30);
                pointY = content.clientHeight - 30;
                break;
            case 3: // left
                pointX = 0;
                pointY = Math.random() * (content.clientHeight - 30);
                break;
        }

        point.style.left = `${pointX}px`;
        point.style.top = `${pointY}px`;

        content.appendChild(point);
        points.push(point);

        // Déplacer le point
        const moveInterval = setInterval(() => {
            const dx = (Math.random() - 0.5) * 20; // Augmenter la valeur de déplacement
            const dy = (Math.random() - 0.5) * 20; // Augmenter la valeur de déplacement
            let newLeft = parseFloat(point.style.left) + dx;
            let newTop = parseFloat(point.style.top) + dy;

            // Garder le point dans les limites du conteneur
            if (newLeft < 0) newLeft = 0;
            if (newLeft > content.clientWidth - 30) newLeft = content.clientWidth - 30;
            if (newTop < 0) newTop = 0;
            if (newTop > content.clientHeight - 30) newTop = content.clientHeight - 30;

            point.style.left = `${newLeft}px`;
            point.style.top = `${newTop}px`;

            // Vérifier les collisions avec les arbres
            trees.forEach(tree => {
                if (isColliding(point, tree.element)) {
                    clearInterval(tree.coinInterval);
                    tree.element.remove();
                    trees.splice(trees.indexOf(tree), 1); // Supprimer l'arbre de la liste
                    updateCO2O2Counter(); // Mettre à jour les compteurs après la suppression de l'arbre
                    clearInterval(moveInterval);
                    point.remove(); // Supprimer le point après la collision
                    points.splice(points.indexOf(point), 1); // Supprimer le point de la liste
                }
            });
        }, 100);
    }

    // Créer un point mobile toutes les 30 secondes
    setInterval(createMovingPoint, 120000);
});


