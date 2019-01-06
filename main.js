var player;
var grounds = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	grounds = [];
	createPlayer();
	strokeWeight(4);
	textAlign(CENTER);
	addGround(true);
	addGround();
	addGround();
	addGround();
}

function r(a, b=windowWidth) {
	return (a % b + b) % b
}

function draw() {
	background(0);
	fill(255);
	textSize(48);
	text("Score: " + player.score, windowWidth/2-300, 80);
	text("x" + player.multiplier, windowWidth/2+300, 80);
	if (player.gravity == 0) {
		text("GAME OVER (PRESS R TO RESTART)", windowWidth/2, windowHeight/2);
	}
	mouseHovered();
	keyDown();
	push();
	// translate(windowWidth/2, windowHeight/2);
	
	player.draw();

	for (var i = grounds.length - 1; i >= 0; i--) {
		g = grounds[i];
		if (g.destroy) {
			grounds.splice(i,1);
			addGround();
		} else {
			g.draw();
		}
	}

	pop();
}

function createPlayer() {
	player = {
		y: 100,
		life: 0,
		radius: 40,
		vel: 0,
		maxVel: 20,
		gravity: 1,
		bar: 300,
		gap: 600,
		multiplier: 1,
		score: 0,
		draw: function () {
			this.life++;

			this.y += this.vel;
			this.vel = min(this.maxVel, this.vel + this.gravity);

			if (player.y > player.bar) {
				for (var i = grounds.length - 1; i >= 0; i--) {
					g = grounds[i];
					g.y -= (player.y-player.bar);
				}
				player.y = player.bar;
			}

			var pow = color(255, 255*(this.multiplier-1)/3, 0)
			stroke(pow);
			noFill();
			ellipse(windowWidth/2, this.y, this.radius);
		},
		bounce: function () {
			this.vel = -this.maxVel;
			this.multiplier = 1;
		},
		die: function () {
			this.gravity = 0;
			this.vel = 0;
		},
	}
}

function ground(p1, p2, y) {
	this.p1 = p1;
	this.p2 = p2;
	this.y = y;
	this.destroy = false;
	this.hp = 3;
	this.scoring = true;
	this.draw = function () {

		pA = r(this.p1 + shift + baseShift);
		pB = r(this.p2 + shift + baseShift);

		if (this.y - player.y < player.radius && this.y - player.y > 0 && (windowWidth/2 < r(pA) || windowWidth/2 > r(pB))) {
			this.hp--;
			if (this.hp == 0) {
				player.die();
			} else {
				if (player.multiplier > 3) {
					this.destroy = true;
				}
				player.bounce();
			}
		}

		if (this.y < player.bar-150) {
			this.destroy = true;
		}

		if (this.y < player.bar-10 && this.scoring) {
			if (player.gap <= 100) {
				player.gap *= 0.95;
			} else {
				player.gap -= 5;
			}
			player.score += player.multiplier
			player.multiplier++;
			this.scoring = false;
		}

		stroke(color(255*(this.hp-1)/2, 255*(this.hp-1)/2, 255));
		if (pA > pB) {
			line(pB, this.y, pA, this.y);
		} else {
			line(0, this.y, pA, this.y);
			line(windowWidth, this.y, pB, this.y);
		}
		
	}
}

function addGround(i=false) {
	var x = random(windowWidth);
	if (i) {
		grounds.push(new ground(x, x+player.gap, 1000));
	} else {
		grounds.push(new ground(x, x+player.gap, grounds[grounds.length-1].y + player.bar));
	}
	
	
}


var baseShift = 0;
var shift = 0;

mouse = {
	x: 0,
	y: 0,
	selected: false,
}

function mousePressed() {
	mouse.x = mouseX;
	mouse.y = mouseY;
	mouse.selected = true;
}

function mouseHovered() {
	if (mouse.selected) {
		shift = mouseX - mouse.x;
	}
}

function mouseReleased() {
	baseShift += mouseX - mouse.x;
	shift = 0;
	mouse.selected = false;
}

function keyDown() {
	if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
		baseShift -= 40;
	}
	if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
		baseShift += 40;
	}
}

function keyPressed() {
	if (keyCode == 82) {
		// restart game
		setup();
	}
}

