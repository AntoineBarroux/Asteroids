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

SET_CODES = [32, 37, 38, 39, 40];

const NB_ACTIONS = 5;

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
	





    //console.log(sprites);
    //this.notify(SET_CODES[0]);
};



// Direction la direction de l'état initial, speed la vitesse initiale, closeEnnemies un
// tableau des ennemis les plus proches dans un cercle prédéterminé.
var State = function(direction, speed, closeEnnemies) {
    this.canShoot = true;
    this.direction = direction;
    this.speed = speed;
    this.closeEnnemies = closeEnnemies;
};


//Définition de la structure d'un noeud
var Noeud = function(){
	//constructeur du noeud root
	/*this.init = function(){
		this.ship = Game.ship; // pour savoir quel sprite est le ship
		this.nbwin = 0;
		this.nbPlayed = 0;
		this.pere=null;
		this.chilD = null;
		this.chilG = null;
		this.chilU = null;
		this.chilS = null;
		this.spriteList = {};
	}*/
	//constructeur des noeuds non root
	this.init = function(p){
		this.ship = p.ship; // pour savoir quel sprite est le ship
		this.nbwin = 0;
		this.nbPlayed = 0;
		this.pere=p;
		this.chilD = null;
		this.chilG = null;
		this.chilU = null;
		this.chilS = null;
		this.spriteList = {};
	}
	
}
Mcts.prototype.getPlay = function(){
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
	tempNode.spriteList = listCopy; /* plutôt que faire une copie, on peut écrire tempNode.spriteList = root.spriteList mais je sais 
	pas si du coup modifier tempNode.spriteList modifiera root.spriteList, a voir */
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


}