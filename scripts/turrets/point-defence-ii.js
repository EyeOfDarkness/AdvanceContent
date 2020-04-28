const lib = require("funclib");

const fakeLightning = newEffect(10, e => {
	//const length = Mathf.ceil(e.data.len() / 8);
	Lines.stroke(3 * e.fout());
	Draw.color(Pal.surge, Color.white, e.fin());
	
	Lines.line(e.x, e.y, e.data.x, e.data.y);
	
	Fill.square(e.data.x, e.data.y, 5 * e.fout(), 45);
	Fill.square(e.x, e.y, 5 * e.fout(), 45);
	
});

const flakEffectPlast = newEffect(17, e => {
	Draw.color(Pal.plastaniumBack, Color.gray, e.finpow());
	
	const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
		Fill.circle(e.x + x, e.y + y, out * 3 * 4 + 0.5);
		Fill.circle(e.x + (x / 2), e.y + (y / 2), out * 2 * 3);
	}});
	
	Angles.randLenVectors(e.id + 128, e.finpow(), 11, 34, hk);
	
	Draw.color(Color.white, Pal.plastaniumBack, e.fin());
	
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4 + 1);
	}});
	
	e.scaled(9, cons(s => {
		Lines.circle(s.x, s.y, 14 + Mathf.randomSeed(e.id + Mathf.round(Time.time() * 240), 0, 14) * s.fin());
	}));
	//Lines.circle(e.x, e.y, 14 + Mathf.range(0, 14) * e.fin());
	
	Angles.randLenVectors(e.id, 7, e.finpow() * 20.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const flakEffectSurge = newEffect(17, e => {
	Draw.color(Color.gray);
	
	/*const hk = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, );
	}});*/
	
	const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
		Fill.circle(e.x + x, e.y + y, out * 3 * 4 + 0.5);
		Fill.circle(e.x + (x / 2), e.y + (y / 2), out * 2 * 3);
	}});
	
	Angles.randLenVectors(e.id + 128, e.finpow(), 11, 43, hk);
	
	Draw.color(Color.white, Pal.surge, e.fin());
	
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4.5 + 1);
	}});
	
	e.scaled(8, cons(s => {
		Lines.circle(s.x, s.y, 17 + Mathf.randomSeed(e.id + Mathf.round(Time.time() * 240), 0, 17) * s.fin());
	}));
	//Lines.circle(e.x, e.y, 14 + Mathf.range(0, 14) * e.fin());
	
	Angles.randLenVectors(e.id, 7, e.finpow() * 28.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const flakEffect = newEffect(17, e => {
	Draw.color(Color.gray);
	
	/*const hk = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, );
	}});*/
	
	const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
		Fill.circle(e.x + x, e.y + y, out * 3 * 4 + 0.5);
		Fill.circle(e.x + (x / 2), e.y + (y / 2), out * 2 * 3);
	}});
	
	Angles.randLenVectors(e.id + 128, e.finpow(), 11, 34, hk);
	
	Draw.color(Color.white, Pal.lightOrange, e.fin());
	
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4 + 1);
	}});
	
	e.scaled(8, cons(s => {
		Lines.circle(s.x, s.y, 14 + Mathf.randomSeed(e.id + Mathf.round(Time.time() * 240), 0, 14) * s.fin());
	}));
	//Lines.circle(e.x, e.y, 14 + Mathf.range(0, 14) * e.fin());
	
	Angles.randLenVectors(e.id, 7, e.finpow() * 20.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const pointSurge = extend(BasicBulletType, {
	despawned(b){
		this.super$despawned(b);
		
		const radius = this.splashDamageRadius + 3;
		const vec = new Vec2();
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					var damageB = type.damage + type.splashDamage;
					
					vec.set(e.x, e.y);
					
					Effects.effect(fakeLightning, b.x, b.y, 0, vec);
					
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.speedDamage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.speedDamage) / damageB, 0, 1);
				}
			}
		}));
	},
	
	update: function(b){
		const radius = this.hitSize + 7.7;
		var cdist = 0;
		var result = null;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				var dst2 = Mathf.dst2(e.x, e.y, b.x, b.y);
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && (result == null || result == b || dst2 < cdist) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					cdist = dst2;
					result = e;
					var damageB = type.damage + type.splashDamage;
					
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
				}
			}
		}));
	}
});
pointSurge.inaccuracy = 2.3;
pointSurge.despawnEffect = flakEffectSurge;
pointSurge.splashDamageRadius = 31.8;
pointSurge.ammoMultiplier = 3;
pointSurge.speedDamage = 8.6;
pointSurge.splashDamage = 9;
pointSurge.hitSize = 9.5;
pointSurge.lifetime = 48;
pointSurge.damage = 11.8;
pointSurge.speed = 4.9;
pointSurge.bulletWidth = 10.9;
pointSurge.bulletHeight = 13.1;
pointSurge.collides = false;
pointSurge.collidesAir = false;

const pointPlastic = extend(BasicBulletType, {
	despawned(b){
		this.super$despawned(b);
		
		const radius = this.splashDamageRadius;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					var damageB = type.damage + type.splashDamage;
					
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1);
				}
			}
		}));
	},
	
	update: function(b){
		const radius = this.hitSize + 5.7;
		var cdist = 0;
		var result = null;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				var dst2 = Mathf.dst2(e.x, e.y, b.x, b.y);
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && (result == null || result == b || dst2 < cdist) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					cdist = dst2;
					result = e;
					var damageB = type.damage + type.splashDamage;
					
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
				}
			}
		}));
	}
});
pointPlastic.backColor = Pal.plastaniumBack;
pointPlastic.frontColor = Pal.plastaniumFront;
pointPlastic.inaccuracy = 2.1;
pointPlastic.despawnEffect = flakEffectPlast;
pointPlastic.splashDamageRadius = 23.8;
pointPlastic.ammoMultiplier = 3;
pointPlastic.splashDamage = 5;
pointPlastic.hitSize = 9.5;
pointPlastic.lifetime = 48;
pointPlastic.damage = 9;
pointPlastic.speed = 4.6;
pointPlastic.bulletWidth = 10.2;
pointPlastic.bulletHeight = 12.4;
pointPlastic.collides = false;
pointPlastic.collidesAir = false;

const pointFlak = extend(BasicBulletType, {
	despawned(b){
		this.super$despawned(b);
		
		const radius = this.splashDamageRadius;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					var damageB = type.damage + type.splashDamage;
					
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.splashDamage) / damageB, 0, 1);
				}
			}
		}));
	},
	
	update: function(b){
		const radius = this.hitSize + 2.7;
		var cdist = 0;
		var result = null;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				var dst2 = Mathf.dst2(e.x, e.y, b.x, b.y);
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && (result == null || result == b || dst2 < cdist) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					cdist = dst2;
					result = e;
					var damageB = type.damage + type.splashDamage;
					
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
				}
			}
		}));
	}
});
pointFlak.inaccuracy = 1.2;
pointFlak.despawnEffect = flakEffect;
pointFlak.splashDamageRadius = 19.8;
pointFlak.ammoMultiplier = 1;
pointFlak.splashDamage = 4;
pointFlak.hitSize = 9.5;
pointFlak.lifetime = 42;
pointFlak.damage = 7;
pointFlak.speed = 5.1;
pointFlak.bulletWidth = 9.8;
pointFlak.bulletHeight = 11.6;
pointFlak.collides = false;
pointFlak.collidesAir = false;

const point = extendContent(DoubleTurret, "defender", {
	findTarget: function(tile){
		entity = tile.ent();
		
		entity.target = lib.nearestBullet(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(b => b.getBulletType().hitSize < 11 && b.getBulletType().speed < 11));
	},
	
	validateTarget(tile){
        entity = tile.ent();
		if(!Vars.android){
			return !(lib.invalidateExperimental(entity.target, tile.getTeam(), tile.drawx(), tile.drawy(), Number.MAX_VALUE));
		}else{
			return !(entity.target == null || entity.target.getTeam() == tile.getTeam());
		}
    }
});

point.ammo(Items.titanium, pointFlak,
			Items.plastanium, pointPlastic,
			Items.surgealloy, pointSurge);