const stormCharge = newEffect(27, e => {
	Draw.color(Color.valueOf("606571"), Color.valueOf("6c8fc7"), e.fin());
	const hh = new Floatc2({get: function(x, y){
		//Fill.poly(e.x + x, e.y + y, 6, 2 + e.fin() * 11, e.rotation);
		Fill.poly(e.x + x, e.y + y, 6, 1 + Mathf.sin(e.fin() * 3, 1, 2) * 5, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 2, e.fout() * 40.0, e.rotation, 135.0, hh);
});

const stormSmokeTwo = newEffect(15, e => {
	const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	trnsB.trns(e.rotation, e.fin() * (4.6 * 15));
	Fill.poly(e.x + trnsB.x, e.y + trnsB.y, 6, e.fout() * 16, e.rotation);
});

const stormSmoke = newEffect(27, e => {
	//const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	const hl = new Floatc2({get: function(x, y){
		//trnsB.trns(e.rotation, e.fin() * (4.6 * 60));
		//Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("8494b3"), e.fin());
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 9, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 20.0, e.rotation, 180.0, hl);
});

const stormBullet = extend(BasicBulletType, {
	update: function(b){
		const trnsC = new Vec2();
		const trnsD = new Vec2();
		
		if(Mathf.chance(0.9)){
			Effects.effect(stormSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		};

		if(Mathf.chance(0.7)){
			trnsC.trns(b.rot() + Mathf.range(2.0), 13);
			Lightning.create(b.getTeam(), Color.valueOf("a9d8ff"), 29, b.x + trnsC.x + Mathf.range(12.0), b.y + trnsC.y + Mathf.range(12.0), b.rot() + Mathf.range(56.0), Mathf.random(4, 22));
		};
		if(Mathf.chance(0.3)){
			trnsD.trns(b.rot() + Mathf.range(2.0), 13);
			Lightning.create(b.getTeam(), Color.valueOf("8494b3"), 14, b.x + trnsD.x + Mathf.range(12.0), b.y + trnsD.y + Mathf.range(12.0), b.rot() + Mathf.range(180.0), Mathf.random(3, 12));
		};
		Effects.effect(stormSmokeTwo, this.backColor, b.x + Mathf.range(12.9), b.y + Mathf.range(12.9), b.rot() + Mathf.range(2.0));
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), b.fin());
		Fill.poly(b.x, b.y, 6, 6 + b.fout() * 6.1, b.rot());
		Draw.reset();
	}
});

stormBullet.speed = 4.6;
stormBullet.damage = 8.6;
stormBullet.lifetime = 53;
stormBullet.hitSize = 28;
stormBullet.shootEffect = Fx.none;
stormBullet.despawnEffect = Fx.none;
stormBullet.collides = true;
stormBullet.collidesTiles = false;
stormBullet.collidesAir = true;
stormBullet.pierce = true;

const trb = new Vec2();
const storm = extendContent(ChargeTurret, "storm", {});

storm.shootType = stormBullet;
//storm.burstSpacing = 6;
storm.shots = 5;
storm.shootEffect = Fx.none;
//storm.chargeMaxDelay = 24;
storm.chargeEffects = 5;
storm.chargeEffect = stormCharge;