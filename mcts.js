// Les codes clavier associés aux actions du jeu. L'algo doit renvoyer une de ces clés pour faire agir
// le vaisseau.
KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    70: 'f',
    71: 'g',
    72: 'h',
    77: 'm',
    80: 'p'
};

SET_CODES = [32,37,38,39]; //Actions possibles (dans l'ordre : tirer, tourner à gauche, avancer, tourner à droite)

// Méthode permettant de faciliter la génération de nombres entiers aléatoires
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}


// L'objet MCTS qui correspond à l'algorithme de Monte Carlo. Il possède un listener qui est le jeu associé et permettra d'envoyer les décisions qu'il
// aura prise à chaque frame.
var Mcts = function(listener){
    this.listener = listener;
};

// La méthode notify permettra d'envoyer l'action à réaliser au listener
Mcts.prototype.notify = function(action){
    this.listener.notify(action);
};



//Implémentation du mcts
Mcts.prototype.play = function () {
    var root = new Node(null, new Board(Game.sprites),null); //Initialisation de l'arbre de recherche
    
    for (var i = 0; i < 50; i++) { //50 tours pour le moment, paramètre à tunner
        var nodeToSimulate = this.select(root); //Phases de sélection et de développement
        var isWon = this.simulate(nodeToSimulate); //Phase de simulation
        this.backpropagate(nodeToSimulate,isWon); //Phase de "back-propagation"
    }

        

    //Une fois mcts complété, on choisit le noeud optimal
    currentMax = root.children[0];
    for (var i = root.children.length - 1; i > 0; i--) {
        if(root.children[i].ratio()>currentMax.ratio()) currentMax = root.children[i];
    }

    this.notify(currentMax.action); //On transmet la meilleur action au listener càd on execute la meilleure action
}


//Fonction qui permet de sélectionner le noeud à exploiter et à développer les noeuds traversés
Mcts.prototype.select = function (node) {
    var currentNode = node;
    while(!currentNode.isLeaf()) {
        if(!currentNode.fullyExpanded()) return this.expand(currentNode);
        currentNode = currentNode.bestChild();
    } 
    this.expand(currentNode);
    currentNode = currentNode.bestChild();
    return currentNode;
}


//Fonction qui permet fe développer un noeud en choisissant une action non existante parmi les noeuds enfants
Mcts.prototype.expand = function (node) {
    outloop:
    for (var i = SET_CODES.length - 1; i >= 0; i--) {
        for (var j = node.children.length - 1; j >= 0; j--) {
            if(node.children[j].action == SET_CODES[i]) {
                continue outloop;
            }
        }
        return node.addChild(new Node(node, node.board, SET_CODES[i])); //Revoir le node.board
    }
}


//Fonction qui permet d'effectuer la simulation sur un noeud, retourne true si la simulation s'est soldé par un win
Mcts.prototype.simulate = function () {
    //Test avec une proba de win de 1/8
    var index = getRandomInt(8);
    if (index == 1) return true;
    return false;
}

//Fonction qui permet de "back-propager" le résultat d'une simulation et mettre à jour les noeuds parents
Mcts.prototype.backpropagate = function (node,isWon) {

    //On remonte les noeuds parents et on incrémente le nombre de visite et le nombre de victoires (si victoire il y a)
    while(node != null){
        node.visits++;
        node.wins += isWon; 
        node = node.parent;
    }
}

