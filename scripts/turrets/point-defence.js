const lib = require("funclib");

const flakEffectSmall = newEffect(15, e => {
	Draw.color(Color.gray);
	
	const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
		Fill.circle(e.x + x, e.y + y, out * 2 * 3.5 + 0.5);
		Fill.circle(e.x + (x / 2), e.y + (y / 2), out * 1 * 2.5);
	}});
	
	Angles.randLenVectors(e.id + 128, e.finpow(), 10, 17, hk);
	
	Draw.color(Color.white, Pal.lightOrange, e.fin());
	
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4 + 1);
	}});
	
	e.scaled(8, cons(s => {
		Lines.circle(s.x, s.y, 9 + Mathf.randomSeed(e.id + Mathf.round(Time.time() * 240), 0, 9) * s.fin());
	}));
	
	Angles.randLenVectors(e.id, 6, e.finpow() * 12.0, e.rotation, 360.0, hl);
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

const pointFlak = extend(BasicBulletType, {
	despawned(b){
		this.super$despawned(b);
		
		const radius = this.splashDamageRadius;
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					var damageB = type.damage + type.splashDamage;
					
					//e.scaleTime(Mathf.clamp(damageB - this.splashDamage / damageB, 0, type.lifetime));
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
					
					//print("start: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					//print("final: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					//e.velocity().x = e.velocity().x / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity().y = e.velocity().y / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity(e.velocity().len() / ((this.damage / (type.damage / this.damage)) + 1), e.rot());
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
pointFlak.lifetime = 39;
pointFlak.damage = 7;
pointFlak.speed = 5.1;
pointFlak.bulletWidth = 9.8;
pointFlak.bulletHeight = 11.6;
pointFlak.collides = false;
pointFlak.collidesAir = false;

const pointHoming = extend(BasicBulletType, {
	update: function(b){
		const radius = this.hitSize;
		var cdist = 0;
		var result = null;
		
		if(this.homingPower > 0.0001){
			target = lib.nearestBullet(b.getTeam(), b.x, b.y, this.homingRange, boolf(e => e.getBulletType().hitSize < 18 && e.getBulletType().speed < 18));
			if(target != null){
				b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(target), 0.094));
			}
		};
		
		Vars.bulletGroup.intersect(b.x - radius, b.y - radius, radius * 2, radius * 2, cons(e => {
			if(e != null){
				var dst2 = Mathf.dst2(e.x, e.y, b.x, b.y);
				if(Mathf.within(b.x, b.y, e.x, e.y, radius) && (result == null || result == b || dst2 < cdist) && e != b && e.getTeam() != b.getTeam()){
					var type = e.getBulletType();
					cdist = dst2;
					result = e;
					var damageB = type.damage + type.splashDamage;
					
					//print("start: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					//print("final: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					//e.velocity().x = e.velocity().x / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity().y = e.velocity().y / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity(e.velocity().len() / ((this.damage / (type.damage / this.damage)) + 1), e.rot());
				}
			}
		}));
	}
});
pointHoming.inaccuracy = 2.2;
pointHoming.despawnEffect = flakEffectSmall;
pointHoming.homingRange = 85;
pointHoming.homingPower = 5;
pointHoming.hitSize = 9.5;
pointHoming.lifetime = 39;
pointHoming.damage = 5;
pointHoming.ammoMultiplier = 3;
pointHoming.reloadMultiplier = 2;
pointHoming.speed = 5.4;
pointHoming.bulletWidth = 9.2;
pointHoming.bulletHeight = 10.6;
pointHoming.collides = false;
pointHoming.collidesAir = false;

const pointDense = extend(BasicBulletType, {
	update: function(b){
		const radius = this.hitSize + 4;
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
					
					//print("start: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					b.scaleTime(this.lifetime);
					e.scaleTime(Mathf.lerp(type.lifetime, 0, Mathf.clamp((damageB - this.damage) / damageB, 0, 1)));
					e.velocity().x = e.velocity().x * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					e.velocity().y = e.velocity().y * Mathf.clamp((damageB - this.damage) / damageB, 0, 1);
					//print("final: velocity:" + e.velocity().len() + " time:" + e.time() + "/" + type.lifetime);
					//e.velocity().x = e.velocity().x / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity().y = e.velocity().y / ((this.damage / (type.damage / this.damage)) + 1);
					//e.velocity(e.velocity().len() / ((this.damage / (type.damage / this.damage)) + 1), e.rot());
				}
			}
		}));
	}
});
pointDense.despawnEffect = flakEffectSmall;
pointDense.hitSize = 9.5;
pointDense.lifetime = 37;
pointDense.damage = 9;
pointDense.ammoMultiplier = 3;
pointDense.reloadMultiplier = 2;
pointDense.speed = 6;
pointDense.bulletWidth = 9.5;
pointDense.bulletHeight = 11;
pointDense.collides = false;
pointDense.collidesAir = false;

const point = extendContent(DoubleTurret, "point-defence-i", {
	/*update(tile){
		entity = tile.ent();

		if(!this.validateTarget(tile)) entity.target = null;

		entity.recoil = Mathf.lerpDelta(entity.recoil, 0, this.restitution);
		entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);

		if(hasAmmo(tile)){

			if(entity.timer.get(this.timerTarget, this.targetInterval)){
				this.findTarget(tile);
			};

			if(this.validateTarget(tile)){

				const type = this.peekAmmo(tile);
				var speed = type.speed;
				if(speed < 0.1f) speed = 9999999;

				//result = Predict.intercept(entity, entity.target, speed);
				const result = Predict.intercept(entity.getX(), entity.getY(), entity.target.x, entity.target.y, 0, 0, speed);
				if(result.isZero()){
					result.set(entity.target.x, entity.target.y);
				};

				var targetRot = result.sub(tile.drawx(), tile.drawy()).angle();

				if(Number.isNaN(entity.rotation)){
					entity.rotation = 0;
				};

				if(this.shouldTurn(tile)){
					this.turnToTarget(tile, targetRot);
				};

				if(Angles.angleDist(entity.rotation, targetRot) < this.shootCone){
					this.updateShooting(tile);
				};
			}
		}
	},*/
	
	findTarget: function(tile){
		entity = tile.ent();
		
		//entity.target = lib.nearestBullet(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(b => b.getBulletType().hitSize < 11 && b.getBulletType().speed < 11));
		
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

point.ammo(Items.graphite, pointDense,
			Items.silicon, pointHoming,
			Items.titanium, pointFlak);