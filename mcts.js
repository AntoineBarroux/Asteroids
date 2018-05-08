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

const NB_ACTIONS = 4;

var canMove = true; //Temporaire pour dire quand envoyer une action random

// Méthode permettant de faciliter la génération de nombres entiers aléatoires
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

// Méthode permettant de récupérer la taille d'un objet (= son nombre de propriétés)
function size(obj){
    var size = 0;
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
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

Mcts.prototype.generate = function(sprites, score){
    var index = getRandomInt(NB_ACTIONS);
    var currentSprites = [];
    var sprite;
    for (var i = 0; i < Game.sprites.length; i++) { // Game.sprite = tout les sprites ?
        sprite = sprites[i];
        if (sprite.visible && sprite.name != 'ship'){
            currentSprites.push(sprite);
            if (sprite.name == 'ship'){
                if (sprite.bulletCounter <= 0) console.log('canShoot');
                else console.log('can\'t shoot');
            }
        }
    }
	

    //Envoie une action random toutes les 0.5s
    //Problème : la touche reste appuyée
    /*if (canMove) {
        mctsTemp = this;
        canMove = false;
        setTimeout(function () {
            mctsTemp.notify(SET_CODES[index]);
            console.log(KEY_CODES[SET_CODES[index]]);
            canMove = true;
        }, 500);
    }*/

    this.play();



    //console.log(sprites);
    //
    //
};



// Direction la direction de l'état initial, speed la vitesse initiale, closeEnnemies un
// tableau des ennemis les plus proches dans un cercle prédéterminé.
/*var State = function(direction, speed, closeEnnemies) {
    this.canShoot = true;
    this.direction = direction;
    this.speed = speed;
    this.closeEnnemies = closeEnnemies;
};*/ //Pas utile pour le moment

//Implémentation du mcts
Mcts.prototype.play = function () {
    if (Game.hasOwnProperty("counter")) Game.counter = Game.counter + 1;
    else Game.counter = 0;


    if (Game.counter >= 10) return;
    // Permet de copier l'objet Game.sprites
    else{
        Mcts.sprites = Object.assign({}, Game.sprites);
        var root = new Node(null, null); //Initialisation de l'arbre de recherche

        for (var i = 0; i < 1; i++) { //50 tours pour le moment, paramètre à tunner
            var nodeToSimulate = this.select(root); //Phases de sélection et de développement
            var isWon = this.simulate(nodeToSimulate); //Phase de simulation
            this.backpropagate(nodeToSimulate,isWon); //Phase de "back-propagation"
        }

        //Une fois mcts complété, on choisit le noeud optimal
        currentMax = root.children[0];
        for (var i = root.children.length - 1; i >= 0; i--) {
            if(root.children[i].ratio()>currentMax.ratio()) currentMax = root.children[i];
        }

        this.notify(currentMax.action); //On transmet la meilleur action au listener càd on execute la meilleure action
    }

}


//Fonction qui permet de sélectionner le noeud à exploiter et à développer les noeuds traversés
Mcts.prototype.select = function (node) {
    var currentNode = node;
    while(!currentNode.isLeaf()) {
        this.expand(currentNode);
        currentNode = currentNode.bestChild();
    }
    return currentNode;
}


//Fonction qui permet fe développer un noeud en choisissant une action non existante parmi les noeuds enfants
Mcts.prototype.expand = function (node) {
    outloop: //Pour "break"/"continue" les 2 loop en même temps
    for (var i = SET_CODES.length - 1; i >= 0; i--) {
        for (var i = node.children.length - 1; i >= 0; i--) {
            if(node.children[i].action == SET_CODES[i]) {
                continue outloop;
            }
        }
        node.addChild(new Node(node, SET_CODES[i])); //Revoir le node.board
        break outloop;
    }
}


//Fonction qui permet d'effectuer la simulation sur un noeud, retourne true si la simulation s'est soldé par un win
Mcts.prototype.simulate = function () {
    //Test avec une proba de win de 1/10
    var index = getRandomInt(10);
    if (index == 5) return true;
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





/*Mcts.prototype.getPlay = function(){
	for(var i = 0;i<15;i++){
		runSimu();
	}
}

Mcts.prototype.runSimu = function(){
	var Root = new Noeud{null};
	root.spriteList = Game.sprites;
	listCopy = root.spriteList;
	var index = getRandomInt(NB_ACTIONS);
	var keyPre = KEY_CODES[index];
	KEY_STATUS.keyPre = true; // ici j'essaye de lui dire que KEY_STATUS.up ou KEY_STATUS.down etc est pressé => simulation de pression d'une touche
	thisFrame = Date.now(); // comment définir la frame de base ? a revoir
    elapsed = thisFrame - lastFrame;
    lastFrame = thisFrame;
    delta = elapsed / 30;
	var tempNode = new Noeud{root};
	tempNode.spriteList = listCopy; // plutôt que faire une copie, on peut écrire tempNode.spriteList = root.spriteList mais je sais 
	//pas si du coup modifier tempNode.spriteList modifiera root.spriteList, a voir
	 for (i = 0; i < tempNode.length; i++) {
		if(tempNode.spriteList[i].name == "ship"){temp.node.spriteList[i].preMove(delta);} //maybe useless voir le code de la fonction moove
        tempNode.spriteList[i].move(delta);
        if (temp.Node.spriteList[i].reap) { //jsp à quoi sert le .reap mais comme c dans la main loop ça doit être utile je regarderais + tard
            tempNode.spriteList[i].reap = false;
            tempNode.spriteList.splice(i, 1);
            i--;
        }
     }
	 tempNode.nbPlayed++;
	 switch(keyPre){
		case 'space':
		root.chilS = tempNode;
		break;
		case 'left' :
		root.chilG = tempNode;
		break;
		case 'up' :
		root.chilU = tempNode;
		break;
		case 'right' :
		root.chilD = tempNode;
		break;
		default:
	 }
	 //ajouter la partie si c win ou non
	
	
	
	}
*/
