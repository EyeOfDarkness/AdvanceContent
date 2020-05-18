const fahrHit = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), e.fin());
	
	const hj = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, 3 + e.fout() * 9, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 6, e.finpow() * 34.0, e.rotation, 180.0, hj);
});

const fahrShoot = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), e.fin());
	
	const hl = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, 3 + e.fout() * 8, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 26.0, e.rotation, 60.0, hl);
});

const fahrTrail = newEffect(27, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), e.fin());
	
	Fill.poly(e.x, e.y, 6, e.fout() * 6.1, e.rotation + e.fin() * 270);
});

const fahrSmoke = newEffect(13, e => {
	Draw.color(Color.valueOf("4d668f77"), Color.valueOf("35455f00"), e.fin());
	
	//Fill.poly(e.x, e.y, 6, e.fout() * 7.1, e.rotation + e.fin() * 270);
	
	const hk = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 7.1, e.rotation + e.fin() * 270);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 13.0, e.rotation, 60.0, hk);
});

const fahrBullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(0, 1 + b.fslope() * 0.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x + Mathf.range(0.9), b.y + Mathf.range(0.9), b.rot());
		};
		
		if(Mathf.chance(0.7)){
			Effects.effect(fahrSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		}
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), b.fin());
		Fill.poly(b.x, b.y, 6, 3 + b.fin() * 4.1, b.rot() + b.fin() * 270);
		Draw.reset();
	}
});

fahrBullet.speed = 6.2;
fahrBullet.drag = 0.02;
fahrBullet.damage = 5;
fahrBullet.lifetime = 58;
fahrBullet.hitSize = 9;
fahrBullet.shootEffect = Fx.none;
fahrBullet.smokeEffect = Fx.none;
fahrBullet.trailEffect = fahrTrail;
fahrBullet.hitEffect = fahrHit;
fahrBullet.despawnEffect = Fx.none;
fahrBullet.collides = true;
fahrBullet.collidesTiles = true;
fahrBullet.collidesAir = true;
fahrBullet.pierce = true;
fahrBullet.statusDuration = 570;
fahrBullet.status = StatusEffects.burning;
fahrBullet.frontColor = Color.valueOf("ffffff");
fahrBullet.backColor = Color.valueOf("a9d8ff");

const fahr = extendContent(PowerTurret, "fahrenheit", {});

fahr.shootEffect = fahrShoot;
fahr.shootType = fahrBullet;