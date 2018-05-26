//Définition de la structure d'un noeud

COLLISION = 1
NOCOLLISION = 2
OTHER = 3

function Node(parent, action) {
	this.parent = parent; //Noeud parent, null si racine
	this.children = []; //Noeuds enfants, liste vide à la création du noeud
	this.action = action; //L'action qui a menée au noeud, null si racine
	this.visits = 0; //Nombre de fois que le noeud a été visité
	this.wins = 0; //Nombre de fois que le noeud a mené à une victoire
    this.grid = null;
    this.isWon = 1;

	if (this.parent == null) { // Si c'est la racine, la liste des sprites est égale à Game.sprites
		this.sprites = Mcts.sprites;
        this.grid = $.extend(true, {}, this.sprites[0].grid);

    } else { // Sinon, la liste des sprites correspond aux sprites du noeud parent sur lesquels on a appliqué move
        this.sprites = [];
        var length;
        for (var key in Mcts.sprites) {
            length = this.sprites.push($.extend(true, {}, Mcts.sprites[key]));
            this.sprites[length-1].visible = false;
            if (this.grid == null){
                this.grid = $.extend(true, {}, this.sprites[length-1].grid);
            }
        }

        Mcts.booleans[KEY_CODES[action]] = true;
        for (var key in this.sprites) {
            this.sprites[key].move(Game.delta, Mcts.booleans);
            updateGrid(this.sprites[key], this.grid);

        }
        Mcts.booleans[KEY_CODES[action]] = false;

    }

    console.log(this.grid);

	//Fonction qui permet de calculer le score UCB qui permet de trouver un compromis entre exploration et exploitation
	this.UCB = function () {
		return this.ratio() + Mcts.c*Math.sqrt((this.visits == 0 || this.parent.visits == 0) ? 0 : Math.log(this.parent.visits)/this.visits);
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



function updateGrid(sprite, grid) {
    var gridx = Math.floor(sprite.x / GRID_SIZE);
    var gridy = Math.floor(sprite.y / GRID_SIZE);
    gridx = (gridx >= grid.length) ? 0 : gridx;
    gridy = (gridy >= grid[0].length) ? 0 : gridy;
    gridx = (gridx < 0) ? grid.length-1 : gridx;
    gridy = (gridy < 0) ? grid[0].length-1 : gridy;

    if (isNaN(gridx) || isNaN(gridy) || grid[gridx] == undefined){
        return;
    }
    
    var newNode = grid[gridx][gridy];
    if (newNode != sprite.currentNode) {
        if (sprite.currentNode) {
            sprite.currentNode.leave(sprite);
        }
        newNode.enter(sprite);
        sprite.currentNode = newNode;
    }
}


function findCollisionCandidates(sprite) {
    if (!sprite.currentNode) return [];
    var cn = sprite.currentNode;
    var canidates = [];
    if (cn.nextSprite) canidates.push(cn.nextSprite);
    if (cn.north.nextSprite) canidates.push(cn.north.nextSprite);
    if (cn.south.nextSprite) canidates.push(cn.south.nextSprite);
    if (cn.east.nextSprite) canidates.push(cn.east.nextSprite);
    if (cn.west.nextSprite) canidates.push(cn.west.nextSprite);
    if (cn.north.east.nextSprite) canidates.push(cn.north.east.nextSprite);
    if (cn.north.west.nextSprite) canidates.push(cn.north.west.nextSprite);
    if (cn.south.east.nextSprite) canidates.push(cn.south.east.nextSprite);
    if (cn.south.west.nextSprite) canidates.push(cn.south.west.nextSprite);
    return canidates;
}


function checkCollisionAgainst(sprite, candidates) {
    for (var i = 0; i < candidates.length; i++) {
        var ref = candidates[i];
        do {
            if (sprite.checkCollision(sprite, ref) == COLLISION) return false;
            ref = ref.nextSprite;
        } while (ref)
    }
    return true;
}

function checkCollision(me, other) {
    if (me == other ||
        me.collidesWith.indexOf(other.name) == -1) return;
    var trans = other.transformedPoints();
    var px, py;
    var count = trans.length/2;
    for (var i = 0; i < count; i++) {
        px = trans[i*2];
        py = trans[i*2 + 1];
        // mozilla doesn't take into account transforms with isPointInPath >:-P
        if (me.pointInPolygon(px, py)){
            me.collision(other);
            other.collision(me);

            if (me.name == 'ship')
                return COLLISION;
        }
        if (me.name == 'ship')
            return NOCOLLISION;
        return OTHER;
    }
};