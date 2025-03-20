// const nom =  "forest"
// function direBonjour(nom) {
//     console.log(`Bonjour ${nom}`);
// }
// console.log(nom);

//export { nom, direBonjour }; // exporte la variable nom

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
