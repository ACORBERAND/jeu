// // const nom =  "forest"
// // function direBonjour(nom) {
// //     console.log(`Bonjour ${nom}`);
// // }
// // console.log(nom);

// //export { nom, direBonjour }; // exporte la variable nom

// //todo: remplacer les valeurs par des constantes, et les placer ces constante en début de prog, f
// // interval de temps d'affichage & d'accroissement (affichage du timer + mise à jour de l'arbre...)
// // interval du temps de vie de l'arbre (nb d'années par interval de temps du timer)
// // revoir le calcul des collisions (avec les rayons et la distances entre les troncs)
// // créer une classe foret et une classe arbre dans des modules séparés


// // 1 timer foret (vs 1 timer / arbre)
// // + limite le nombre de ressource du navigateur
// // + utile aussi pour afficher les années
// // + evite les conflis d'accès lors de la mise à jour des compteurs (ex: 2 arbres veullent mettre à jour le compteur de O2 en même temps)
// // + évite de passer en paramètre le compteur de O2, de CO2 à chaque arbre (c'est la foret qui gère les compteurs en demandant à chaque arbre de se mettre à jour)
// // - l'ajout d'un arbre (son affichage) sera ascynchrone avec le click mais synchrone avec le timer
// // = les deux peuvent être syncrhone si la période du timer est sufffiament petite


// // foret 

// // ATTRIBUTS
// // div conteneur (rectangle blanc)
// // * avec une taille fixe (ex: 1000px x 1000px)
// // * echelle entre sa surface de sa div et la surface de la terre (cf diametre max de la couronne de l'arbre que l'on doit voir disctinctement)
// // compteur de pièces, CO2, O2, volume de bois
// // interval du timer qui met à jour de temps d'affichage & d'accroissement (affichage du timer + mise à jour de l'arbre...)
// // ex 1000ms (1s) ou bien 1000/8 ms
// // interval du temps de vie de l'arbre (nb d'années par interval de temps du timer)
// // ex 8 ans ou bien 1 an
// // timer 
//     // tableau d'arbres

// // METHODES
// // ajouter un arbre au click
// // grandir les arbres (tous les arbres) à chaque interval de temp d'accroissement
// // * mise à jour de l'affichage (compteurs en fonction des val retourné par les arbres, dessins des arbres)
// // * détection de la fin de vie de l'arbre (marron)
// // * détection des colisions

// // arbre

// // ATTRIBUTS
// // div arbre (cercle)
// // * avec une taille 
// // * echelle entre sa surface de sa div et la surface de la terre (cf diametre max de la couronne de l'arbre que l'on doit voir disctinctement)
// // données de croissances (tableau avec 3 lignes CO2, O2, volume de bois et autant de colonnes que d'années ou interval d'année ou interval d'année couvrant la durée de vie de l'arbre)
// // age de l'arbre 

// // METHODES
// // grandir l'arbre :
// // * prend en parmètre le nb d'années écoulées
// // * retourne les valeurs de CO2, O2, volume de bois généré durant cette période
// // * met à jour le rendu (dessin)
// const nom =  "forest"
// function direBonjour(nom) {
//     console.log(`Bonjour ${nom}`);
// }
// console.log(nom);

// export { nom, direBonjour }; // exporte la variable nom



//  const pyromaneSpawnChance = 0.05; // 5% de chance d'apparition
//     let pyromane = null;
//     let burnedTreeLocations = []; // Stocke les positions des arbres brûlés

//     setInterval(() => {
//         if (!pyromane && Math.random() < pyromaneSpawnChance) {
//             spawnPyromane();
//         }
//     }, 10000); // Vérifie toutes les 10 secondes

//     function spawnPyromane() {
//         pyromane = document.createElement('div');
//         pyromane.className = 'pyromane';

//         const conteneurRect = content.getBoundingClientRect();
//         pyromane.style.left = `${Math.random() * (conteneurRect.width - 20)}px`;
//         pyromane.style.top = `${Math.random() * (conteneurRect.height - 20)}px`;

//         content.appendChild(pyromane);
//         movePyromane();
//     }

//     function movePyromane() {
//         if (!pyromane) return;

//         const trees = document.querySelectorAll('.tree');
//         if (trees.length === 0) {
//             removePyromane();
//             return;
//         }

//         let closestTree = null;
//         let closestDistance = Infinity;
//         const pyroRect = pyromane.getBoundingClientRect();

//         trees.forEach(tree => {
//             const treeRect = tree.getBoundingClientRect();
//             const distance = Math.sqrt(
//                 Math.pow(treeRect.left - pyroRect.left, 2) +
//                 Math.pow(treeRect.top - pyroRect.top, 2)
//             );

//             if (distance < closestDistance) {
//                 closestDistance = distance;
//                 closestTree = tree;
//             }
//         });

//         if (!closestTree) return;

//         pyromane.style.left = `${closestTree.style.left}`;
//         pyromane.style.top = `${closestTree.style.top}`;

//         setTimeout(() => {
//             if (pyromane && closestTree) {
//                 burnedTreeLocations.push({
//                     left: closestTree.style.left,
//                     top: closestTree.style.top
//                 });
//                 closestTree.remove();
//                 movePyromane();
//             }
//         }, 5000);
//     }

//     function removePyromane() {
//         if (pyromane) {
//             pyromane.remove();
//             pyromane = null;
//             burnedTreeLocations = []; // On vide la liste des arbres brûlés lorsque le pyromane disparaît
//         }
//     }


// const forestGuardButton = document.getElementById('forestGuardButton');
//     const forestGuardPrice = 50;
//     let forestGuard = null;

//     forestGuardButton.addEventListener('click', function () {
//         if (compteur >= forestGuardPrice && !forestGuard) {
//             compteur -= forestGuardPrice;
//             compteurElement.textContent = compteur;
//             createForestGuard();
//             forestGuardButton.classList.add('disabled');
//             forestGuardButton.textContent = "Garde forestier engagé";
//         } else {
//             alert("Vous n'avez pas assez de pièces ou un garde est déjà présent.");
//         }
//     });

//     function createForestGuard() {
//         forestGuard = document.createElement('div');
//         forestGuard.className = 'forest-guard';

//         const detectionRadius = document.createElement('div');
//         detectionRadius.className = 'detection-radius';
//         forestGuard.appendChild(detectionRadius);

//         forestGuard.style.left = '50%';
//         forestGuard.style.top = '50%';

//         content.appendChild(forestGuard);

//         setInterval(checkForPyromane, 500);
//         setInterval(checkNearbyTrees, 500);
//         setInterval(moveForestGuard, 4000);
//     }

//     function checkForPyromane() {
//         if (!forestGuard || !pyromane) return;

//         const guardRect = forestGuard.getBoundingClientRect();
//         const pyroRect = pyromane.getBoundingClientRect();

//         const distance = Math.sqrt(
//             Math.pow(pyroRect.left - guardRect.left, 2) +
//             Math.pow(pyroRect.top - guardRect.top, 2)
//         );

//         if (distance < 40) {
//             removePyromane();
//             console.log("Le garde forestier a éliminé le pyromane !");
//         }
//     }

//     function moveForestGuard() {
//         if (!forestGuard) return;

//         const conteneurRect = content.getBoundingClientRect();
//         let targetX, targetY;

//         if (burnedTreeLocations.length > 0 && Math.random() < 0.7) {
//             const target = burnedTreeLocations[Math.floor(Math.random() * burnedTreeLocations.length)];
//             targetX = parseFloat(target.left);
//             targetY = parseFloat(target.top);
//         } else {
//             targetX = Math.random() * (conteneurRect.width - 20);
//             targetY = Math.random() * (conteneurRect.height - 20);
//         }

//         forestGuard.style.left = `${targetX}px`;
//         forestGuard.style.top = `${targetY}px`;
//     }

//     function updateGuardVision(detectedTrees) {
//         const visionList = document.getElementById('detected-trees-list');
//         visionList.innerHTML = "";
    
//         if (Object.keys(detectedTrees).length === 0) {
//             visionList.innerHTML = "<li>Aucun arbre détecté</li>";
//             return;
//         }
    
//         for (const [color, count] of Object.entries(detectedTrees)) {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${count} arbre(s) ${color}`;
//             visionList.appendChild(listItem);
//         }
//     }


// // Vérification des arbres proches du garde forestier
// function checkNearbyTrees() {
//     if (!forestGuard) return;

//     const guardRect = forestGuard.getBoundingClientRect();
//     const trees = document.querySelectorAll('.tree');
//     const detectedTrees = {};

//     trees.forEach(tree => {
//         const treeRect = tree.getBoundingClientRect();
//         const distance = Math.sqrt(
//             Math.pow(treeRect.left - guardRect.left, 2) +
//             Math.pow(treeRect.top - guardRect.top, 2)
//         );

//         if (distance < 40) { // Rayon de détection ajusté (80px de diamètre = 40px de rayon)
//             const treeType = tree.classList.contains('type1') ? "Vert" :
//                              tree.classList.contains('type2') ? "Rouge" :
//                              tree.classList.contains('type3') ? "Bleu" : "Inconnu";

//             detectedTrees[treeType] = (detectedTrees[treeType] || 0) + 1;
//         }
//     });

//     updateGuardVision(detectedTrees);
// }
