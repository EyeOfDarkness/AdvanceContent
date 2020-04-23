const kelvHit = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("5e6e8c"), e.fin());
	//Lines.stroke(e.fout() * 2.5);
	//Lines.poly(e.x, e.y, 6, 3 + e.fin() * 8, e.rotation + e.fin() * 135);
	
	//Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	//Fill.poly(e.x, e.y, 6, e.fout() * 3, e.rotation + e.fin() * 135);
	const hj = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, 3 + e.fout() * 4, e.rotation + (e.fin() * 135));
	}});
	
	Angles.randLenVectors(e.id, 2, e.finpow() * 21.0, e.rotation, 60.0, hj);
});

const kelvShoot = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	Fill.poly(e.x, e.y, 6, e.fout() * 5, e.rotation + e.fin() * 180);
});

const kelvTrail = newEffect(27, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("5e6e8c"), e.fin());
	
	Fill.poly(e.x, e.y, 6, e.fout() * 3.1, e.rotation + e.fin() * 270);
});

const kelvSmoke = newEffect(13, e => {
	Draw.color(Color.valueOf("5e6e8c77"), Color.valueOf("50555e00"), e.fin());
	
	Fill.poly(e.x, e.y, 6, e.fout() * 3.1, e.rotation + e.fin() * 270);
});

const kelvBullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(0, 1 + b.fslope() * 0.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x, b.y, b.rot());
		};
		
		if(Mathf.chance(0.3)){
			Effects.effect(kelvSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		}
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("8494b3"), b.fin());
		Fill.poly(b.x, b.y, 6, 3 + b.fin() * 3.1, b.rot() + b.fin() * 270);
		Draw.reset();
	}
});

kelvBullet.speed = 3.6;
kelvBullet.damage = 9;
kelvBullet.lifetime = 29;
kelvBullet.hitSize = 7;
kelvBullet.shootEffect = Fx.none;
kelvBullet.smokeEffect = Fx.none;
kelvBullet.trailEffect = kelvTrail;
kelvBullet.hitEffect = kelvHit;
kelvBullet.despawnEffect = Fx.none;
kelvBullet.collides = true;
kelvBullet.collidesTiles = true;
kelvBullet.collidesAir = true;
kelvBullet.pierce = true;
kelvBullet.statusDuration = 570;
kelvBullet.status = StatusEffects.burning;
kelvBullet.frontColor = Color.valueOf("ffffff");
kelvBullet.backColor = Color.valueOf("a9d8ff");

const kelv = extendContent(PowerTurret, "kelvin", {});

kelv.shootEffect = kelvShoot;
kelv.shootType = kelvBullet;