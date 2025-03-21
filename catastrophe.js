export function triggerCatastrophe(trees, content) {
    console.log('Catastrophe déclenchée !'); // Ajout du console.log pour vérifier que l'action se lance

    if (trees.length > 0) {
        // Détruire un arbre aléatoire
        const treeIndex = Math.floor(Math.random() * trees.length);
        const tree = trees[treeIndex];
        clearInterval(tree.coinInterval);
        tree.element.remove();
        trees.splice(treeIndex, 1);
        console.log('Un arbre a été supprimé');
    } else {
        console.log('Aucun arbre à supprimer');
    }
}