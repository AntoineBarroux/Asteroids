//Définition de la structure d'un noeud

function Node(parent, action) {
	this.parent = parent; //Noeud parent, null si racine
	this.children = []; //Noeuds enfants, liste vide à la création du noeud
	this.action = action; //L'action qui a menée au noeud, null si racine
	this.visits = 0; //Nombre de fois que le noeud a été visité
	this.wins = 0; //Nombre de fois que le noeud a mené à une victoire
	this.c = Math.sqrt(2); //Paramètre d'exploration, à tunner (dans la théorie égal à sqrt(2))

	/*if (this.parent == null) { // Si c'est la racine, la liste des sprites est égale à Game.sprites
		this.sprites = Mcts.sprites;
	} else{ // Sinon, la liste des sprites correspond aux sprites du noeud parent sur lesquels on a appliqué move
		this.sprites = [];
		for (var i = 0; i<this.parent.sprites.length; i++){
            this.sprites[i] = Object.assign({}, this.parent.sprites[i].move(delta)); //Comment avoir le delta ici ?
        }
	}*/

	//Fonction qui permet de calculer le score UCB qui permet de trouver un compromis entre exploration et exploitation
	this.UCB = function () {
		return this.ratio() + this.c*Math.sqrt((this.visits == 0 || this.parent.visits == 0) ? 0 : Math.log(this.parent.visits)/this.visits);
	}

	//Fonction qui permet de calculer le ratio wins/visits
	this.ratio = function () {
		return this.visits == 0 ? 0 : this.wins/this.visits;
	}

	//Fonction qui permet de vérifier si le noeud est terminal
	this.isLeaf = function () {
		return this.children.length == 0; //À optimiser ?
	}

	//Fonction qui retourne le noeud enfant optimal
	this.bestChild = function () {
		var currentMax = this.children[0];
	    for (var i = this.children.length - 1; i >= 0; i--) {
	        if(this.children[i].UCB()>currentMax.UCB()) currentMax = this.children[i];
	    }
	    return currentMax;
	};

	//Fonction qui permet d'ajouter un noeud enfant
	this.addChild = function (child) {
		this.children.push(child);
		return child;
	}

	//Fonction qui permet de vérifier si un noeud à été complètement développé
	this.fullyExpanded = function () {
		return this.children.length == 4 ? true : false;
	}
}
