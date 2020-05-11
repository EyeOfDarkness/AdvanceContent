const arcCharge = newEffect(27, e => {
	Draw.color(Color.valueOf("606571"), Color.valueOf("6c8fc7"), e.fin());
	const hh = new Floatc2({get: function(x, y){
		//Fill.poly(e.x + x, e.y + y, 6, 2 + e.fin() * 11, e.rotation);
		Fill.poly(e.x + x, e.y + y, 6, 1 + Mathf.sin(e.fin() * 3, 1, 2) * 5, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 2, e.fout() * 40.0, e.rotation, 135.0, hh);
});

const arcSmokeTwo = newEffect(15, e => {
	const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	trnsB.trns(e.rotation, e.fin() * (4.6 * 15));
	Fill.poly(e.x + trnsB.x, e.y + trnsB.y, 6, e.fout() * 16, e.rotation);
});

const arcSmoke = newEffect(27, e => {
	//const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	const hl = new Floatc2({get: function(x, y){
		//trnsB.trns(e.rotation, e.fin() * (4.6 * 60));
		//Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("8494b3"), e.fin());
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 9, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 20.0, e.rotation, 180.0, hl);
});

const arcCasterBullet = extend(BasicBulletType, {
	update: function(b){
		const trnsC = new Vec2();
		const trnsD = new Vec2();
		
		if(Mathf.chance(0.9)){
			Effects.effect(arcSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		};

		if(Mathf.chance(Time.delta() * 0.5)){
			trnsC.trns(b.rot() + Mathf.range(2.0), 12);
			Lightning.create(b.getTeam(), Color.valueOf("a9d8ff"), 29, b.x + trnsC.x + Mathf.range(12.0), b.y + trnsC.y + Mathf.range(12.0), b.rot() + Mathf.range(46.0), Mathf.random(4, 18));
		};
		if(Mathf.chance(Time.delta() * 0.2)){
			trnsD.trns(b.rot() + Mathf.range(2.0), 12);
			Lightning.create(b.getTeam(), Color.valueOf("8494b3"), 14, b.x + trnsD.x + Mathf.range(12.0), b.y + trnsD.y + Mathf.range(12.0), b.rot() + Mathf.range(180.0), Mathf.random(3, 12));
		};
		Effects.effect(arcSmokeTwo, this.backColor, b.x + Mathf.range(12.0), b.y + Mathf.range(12.0), b.rot() + Mathf.range(2.0));
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), b.fin());
		Fill.poly(b.x, b.y, 6, 6 + b.fout() * 6.1, b.rot());
		Draw.reset();
	}
});

arcCasterBullet.speed = 4.6;
arcCasterBullet.damage = 8;
arcCasterBullet.lifetime = 43;
arcCasterBullet.hitSize = 21;
//arcCasterBullet.hitEffect = arcHit;
arcCasterBullet.despawnEffect = Fx.none;
arcCasterBullet.shootEffect = Fx.none;
arcCasterBullet.collides = true;
arcCasterBullet.collidesTiles = false;
arcCasterBullet.collidesAir = true;
arcCasterBullet.pierce = true;

const arcCaster = extendContent(ChargeTurret, "arc-caster", {});

arcCaster.shootType = arcCasterBullet;
//arcCaster.shootEffect = arcCasterShoot;
arcCaster.chargeEffect = arcCharge;
//arcCaster.chargeBeginEffect = arcChargeBegin