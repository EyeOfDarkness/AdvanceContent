const bosonWChargeBeginEffect = newEffect(38, e => {
	Draw.color(Color.valueOf("4787ff"), Color.valueOf("a9d8ff"), e.fin());
	Fill.circle(e.x, e.y, 3 + (e.fin() * 6));
	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, 1.75 + (e.fin() * 5.75));
});

const bosonWChargeEffect = newEffect(24, e => {
	Draw.color(Color.valueOf("4787ff"), Color.valueOf("a9d8ff"), e.fin());
	Lines.stroke(1.5);
	
	const hk = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, Mathf.sin(e.finpow() * 3, 1, 8) + 1.5);
		Fill.circle(e.x + x, e.y + y, 2 + (e.fin() * 1.75));
	}});
	
	Angles.randLenVectors(e.id, 2, ((e.finpow() * 50.0) * -1) + 50, e.rotation, 360.0, hk);
	Draw.blend();
	Draw.reset();
});

const bosonWHitEffect = newEffect(13, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8);
	}});
	
	Angles.randLenVectors(e.id, 17, e.finpow() * 40.0, e.rotation, 360.0, hl);
	Draw.blend();
	Draw.reset();
});

const bosonWDecayHitEffect = newEffect(13, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8);
	}});
	
	Angles.randLenVectors(e.id, 17, e.finpow() * 20.0, e.rotation, 360.0, hl);
	Draw.blend();
	Draw.reset();
});

const bosonWEffect = newEffect(24, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(1.25);
	Lines.lineAngle(e.x, e.y, e.rotation, e.fout() * 4)
});

const bosonWEffectLong = newEffect(47, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(1.25);
	Lines.lineAngle(e.x, e.y, e.rotation, e.fout() * 7)
});


const bosonWDecay = extend(BasicBulletType, {
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 1.5 + (b.fout() * 3));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 0.75 + (b.fout() * 2.75));
	},
	
	update: function(b){
		if(Mathf.chance(0.8)){
			Effects.effect(bosonWEffect, b.x, b.y, b.rot() + 180)
		}
	}
});
bosonWDecay.speed = 4.8;
bosonWDecay.damage = 6.1;
bosonWDecay.drag = 0.04;
bosonWDecay.lifetime = 18;
bosonWDecay.pierce = true;
bosonWDecay.despawnEffect = Fx.none;
bosonWDecay.hitEffect = bosonWDecayHitEffect;

const bosonWbullet = extend(BasicBulletType, {
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 3 + (b.fout() * 6));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 1.75 + (b.fout() * 5.75));
	},
	
	update: function(b){
		if(b.timer.get(0, 0.75 + b.fout())){
			//Bullet.create(bosonWDecay, b, b.getTeam(), b.x, b.y, Mathf.random(360), Mathf.random(0.75, 1.25), 0.3 + b.fout());
			Effects.effect(bosonWEffectLong, b.x, b.y, b.rot() + 180);
			Bullet.create(bosonWDecay, b, b.getTeam(), b.x, b.y, b.rot() + (Mathf.range(360.0) / (this.speed / 2)), Mathf.random(0.9, 1.1), 0.3 + b.fout());
		}
	},
	
	despawned: function(b){
		for(var i; i < 12; i++){
			Bullet.create(bosonWDecay, b, b.getTeam(), b.x, b.y, Mathf.random(360), Mathf.random(0.75, 1.25), 0.3 + b.fout());
		};
		Effects.effect(bosonWHitEffect, b.x, b.y, b.rot())
	}
});
bosonWbullet.speed = 8.5;
bosonWbullet.damage = 148;
bosonWbullet.drag = 0.026;
bosonWbullet.lifetime = 48;
bosonWbullet.collides = false;
bosonWbullet.collidesTiles = false;
bosonWbullet.collidesAir = false;
bosonWbullet.shootEffect = Fx.none;
bosonWbullet.smokeEffect = Fx.none;
bosonWbullet.despawnEffect = Fx.none;

const bosonW = extendContent(ChargeTurret, "w-boson", {
	load: function(){
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-5");
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find(this.name)
	];},
});

bosonW.shootType = bosonWbullet;
bosonW.chargeEffect = bosonWChargeEffect;
bosonW.chargeBeginEffect = bosonWChargeBeginEffect;