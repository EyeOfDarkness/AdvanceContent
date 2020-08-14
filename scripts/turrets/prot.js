const protLightning = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(0, 2)){
			Lightning.create(b.getTeam(), Color.valueOf("a9d8ff"), 18, b.x, b.y, Mathf.random(360), Mathf.random(4, 16));
		}
	},
	
	draw: function(b){},
});
protLightning.speed = 0.001;
protLightning.damage = 0.1;
protLightning.lifetime = 1;

const protShoot = newEffect(28, e => {
	Draw.color(Color.valueOf("a9d8ff"));

	//Drawf.tri(e.x, e.y, 9 * e.fout(), 45 + e.fin() * 6, e.rotation + 90 * i);
	Fill.poly(e.x, e.y, 3, e.fout() * 36, e.rotation);
	Fill.circle(e.x, e.y, e.fout() * 11);

	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, e.fout() * 9);
});

const protTrail = newEffect(55, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	Fill.poly(e.x, e.y, 3, e.fout() * 8, e.rotation + e.fin() * 180);
});

const protHit = newEffect(20, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff00"), e.fin());
	Lines.stroke(e.fout() * 4);
	Lines.circle(e.x, e.y, e.fin() * 150);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		//Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
		Fill.poly(e.x + x, e.y + y, 3, e.fout() * 6, (e.fin() * 135) + (e.rotation + ang));
	}});
	
	Angles.randLenVectors(e.id, 12, e.finpow() * 64.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const protBullet = extend(ArtilleryBulletType, {
	update: function(b){

		if(b.timer.get(0, 2 + b.fslope() * 1.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x, b.y, b.fslope() * 4);
		}
	},
	
	/*hit: function(b, x, y){
		Effects.effect(this.hitEffect, x, y, b.rot());
		for(var a; a < this.fragBullets; a++){
			Lightning.create(b.getTeam, Color.valueOf("a9d8ff"), 18, b.x, b.y, Mathf.random(360), Mathf.random(4, 16));
		}
	}*/
});

protBullet.speed = 8;
protBullet.damage = 44;
protBullet.lifetime = 35;
protBullet.bulletWidth = 18;
protBullet.bulletHeight = 27;
protBullet.bulletShrink = 0;
protBullet.fragBullet = protLightning;
protBullet.fragBullets = 3;
protBullet.hitSize = 15;
protBullet.splashDamageRadius = 45;
protBullet.splashDamage = 23;
protBullet.trailEffect = protTrail;
protBullet.hitEffect = protHit;
protBullet.collides = true;
protBullet.collidesTiles = true;
protBullet.collidesAir = false;
protBullet.frontColor = Color.valueOf("ffffff");
protBullet.backColor = Color.valueOf("a9d8ff");

const prot = extendContent(PowerTurret, "proton", {});

prot.shootEffect = protShoot;
prot.shootType = protBullet;