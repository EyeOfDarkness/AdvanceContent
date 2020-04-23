const elecShoot = newEffect(23, e => {
	Draw.color(Color.valueOf("a9d8ff"));

	//Drawf.tri(e.x, e.y, 9 * e.fout(), 45 + e.fin() * 6, e.rotation + 90 * i);
	Fill.poly(e.x, e.y, 3, e.fout() * 24, e.rotation);
	Fill.circle(e.x, e.y, e.fout() * 11);

	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, e.fout() * 9);
});

const elecTrail = newEffect(50, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	Fill.poly(e.x, e.y, 3, e.fout() * 4, e.rotation + e.fin() * 180);
});

const elecHit = newEffect(12, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(e.fout() * 3);
	Lines.circle(e.x, e.y, e.fin() * 90);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		//Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
		Fill.poly(e.x + x, e.y + y, 3, e.fout() * 4, (e.fin() * 120) + (e.rotation + ang));
	}});
	
	Angles.randLenVectors(e.id, 7, e.finpow() * 45.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const elecBullet = extend(ArtilleryBulletType, {
	update: function(b){

		if(b.timer.get(0, 2 + b.fslope() * 1.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x, b.y, b.fslope() * 4);
		}
	}
});

elecBullet.speed = 9;
elecBullet.damage = 62;
elecBullet.lifetime = 22;
elecBullet.bulletWidth = 12;
elecBullet.bulletHeight = 19;
elecBullet.bulletShrink = 0;
elecBullet.hitSize = 9;
elecBullet.trailEffect = elecTrail;
elecBullet.hitEffect = elecHit;
elecBullet.collides = true;
elecBullet.collidesTiles = true;
elecBullet.collidesAir = true;
elecBullet.frontColor = Color.valueOf("ffffff");
elecBullet.backColor = Color.valueOf("a9d8ff");
/*elecBullet.hitSound = Sounds.spark;*/

const elec = extendContent(PowerTurret, "electron", {});

elec.shootEffect = elecShoot;
elec.shootType = elecBullet;