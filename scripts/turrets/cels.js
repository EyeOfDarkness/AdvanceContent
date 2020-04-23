const celsHit = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), e.fin());
	
	const hj = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, 3 + e.fout() * 3, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 2, e.finpow() * 17.0, e.rotation, 60.0, hj);
});

const celsTrail = newEffect(27, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), e.fin());
	
	Fill.poly(e.x, e.y, 6, e.fout() * 4.1, e.rotation + e.fin() * 270);
});

const celsSmoke = newEffect(13, e => {
	Draw.color(Color.valueOf("4d668f77"), Color.valueOf("35455f00"), e.fin());
	
	//Fill.poly(e.x, e.y, 6, e.fout() * 7.1, e.rotation + e.fin() * 270);
	
	const hk = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 4.1, e.rotation + e.fin() * 270);
	}});
	
	Angles.randLenVectors(e.id, 2, e.finpow() * 13.0, e.rotation, 60.0, hk);
});

const celsBullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(0, 1 + b.fslope() * 0.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x + Mathf.range(0.6), b.y + Mathf.range(0.6), b.rot());
		};
		
		if(Mathf.chance(0.7)){
			Effects.effect(celsSmoke, this.backColor, b.x + Mathf.range(1.7), b.y + Mathf.range(1.7), b.rot());
		}
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4f72e1"), b.fin());
		Fill.poly(b.x, b.y, 6, 3 + b.fin() * 4.1, b.rot() + b.fin() * 270);
		Draw.reset();
	}
});

celsBullet.speed = 4.7;
celsBullet.drag = 0.034;
celsBullet.damage = 20;
celsBullet.lifetime = 18;
celsBullet.hitSize = 4;
celsBullet.shootEffect = Fx.none;
celsBullet.smokeEffect = Fx.none;
celsBullet.trailEffect = celsTrail;
celsBullet.hitEffect = celsHit;
celsBullet.despawnEffect = Fx.none;
celsBullet.collides = true;
celsBullet.collidesTiles = true;
celsBullet.collidesAir = true;
celsBullet.pierce = true;
celsBullet.statusDuration = 770;
celsBullet.status = StatusEffects.burning;
//fahrBullet.frontColor = Color.valueOf("ffffff");
//fahrBullet.backColor = Color.valueOf("a9d8ff");

const cels = extendContent(PowerTurret, "celsius", {});

cels.shootType = celsBullet;