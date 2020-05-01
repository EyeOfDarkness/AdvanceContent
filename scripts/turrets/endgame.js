const elib = require("effectlib");

const deathLaserEffect = elib.newEffectWDraw(76, 1300, e => {
	var pos1 = e.data[0];
	var pos2 = e.data[1];
	
	const colors = [Color.valueOf("ff0000"), Color.valueOf("ff8000"), Color.valueOf("ffccaa")];
	const strokes = [2, 1.2, 0.6];

	//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
	Draw.blend(Blending.additive);
	for(var s = 0; s < 3; s++){
		
		Draw.color(colors[s]);
		
		Fill.circle(pos1.x, pos1.y, strokes[s] * 4 * e.fout());
		
		Fill.circle(pos2.x, pos2.y, strokes[s] * 4 * e.fout());
		
		Lines.stroke(strokes[s] * 4 * e.fout());
		Lines.line(pos1.x, pos1.y, pos2.x, pos2.y, CapStyle.none);
	};
	Draw.reset();
	Draw.blend();
});

const vaporizeTile = newEffect(67, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000"), Color.valueOf("ff000000"), e.fin());
	Fill.square(e.x, e.y, (e.rotation * Vars.tilesize / 2) * e.fout());
	
	Draw.reset();
	Draw.blend();
});

const vaporize = elib.newEffectWDraw(78, 512, e => {
	const type = e.data.getType();
	const vec = new Vec2();
	const weaponB = type.weapon.region;
	//print(e.data.getType());
	
	Draw.blend(Blending.additive);
	Draw.alpha(e.fout());
	Draw.mixcol(Color.valueOf("ff0000"), 1);
	Draw.rect(type.region, e.x, e.y, e.rotation - 90);
	
	for(var i = 0; i < 2; i++){
		var sign = Mathf.signs[i];
		
		vec.trns(e.rotation + 90, type.weapon.width * sign, type.weaponOffsetY);
		
		Draw.rect(weaponB, e.x + vec.x, e.y + vec.y, sign * weaponB.getWidth() * Draw.scl, weaponB.getHeight() * Draw.scl, e.rotation - 90);
	};
	
	Draw.reset();
	Draw.blend();
});

const darkShockwave = elib.newEffectWDraw(56, 880, e => {
	const vec = new Vec2();
	//const lastVec = new Vec2();
	//const rand = new Vec2();
	var sides = 148;
	var poly = [];
	//var lenRand = Mathf.range(2);
	Draw.color(Color.valueOf("000000"));
	Lines.stroke(2 * e.fout());
	
	//var rand1 = Mathf.randomSeedRange(Mathf.round(Time.time() + e.id), 4);
	
	vec.trns(e.rotation, e.finpow() * 340);
	
	for(var i = 0; i < sides; i++){
		//vec.trns(360 / sides * i + e.rotation, e.finpow() * 340 + (Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i), -120, 2) * e.fin())).add(e.x, e.y);
		vec.trns(360 / sides * i + e.rotation, e.finpow() * 340 + (Mathf.clamp(Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i), -320, 320), -320, 0) * e.fin())).add(e.x, e.y);
		
		for(var b = 0; b < 2; b++){
			poly[(i * 2 + b)] = b == 0 ? vec.x : vec.y;
		};
		//poly[i] = Mathf.range(3);
		if(Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i + 1), 0, 20) / 20 >= 1){
			Lines.line(e.x, e.y, vec.x, vec.y);
		};
	};
	
	Lines.polyline(poly, sides * 2, true);
});

const endGameShoot = elib.newEffectWDraw(45, 1050, e => {
	const tex = Core.atlas.find("advancecontent-circle-large");
	var curve = Mathf.curve(e.fin(), 0, 0.2);
	var curveB = Mathf.curve(e.fin(), 0, 0.7);
	//print(e.data);
	
	Draw.color(Color.valueOf("ff0000"));
	Draw.blend(Blending.additive);
	
	Lines.stroke(1 * e.fout());
	Lines.circle(e.x, e.y, 19.3);
	
	Draw.color(Color.valueOf("ff000055"), Color.valueOf("ff000000"), curveB);
	Draw.rect(tex, e.x, e.y, e.data * curve * 2, e.data * curve * 2);
	//Fill.circle(e.x, e.y, 410 * curve);
	Draw.reset();
	Draw.blend();
});

const baseBullet = extend(BasicBulletType, {});

baseBullet.damage = Number.MAX_VALUE;

const visualLaser = extend(BasicBulletType, {
	draw: function(b){
		const length = b.velocity().len() * 50000;
		const colors = [Color.valueOf("ff0000"), Color.valueOf("ff8000"), Color.valueOf("ffccaa")];
		const strokes = [2, 1.2, 0.6];
		const vec = new Vec2();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		Draw.blend(Blending.additive);
		for(var s = 0; s < 3; s++){
			//vec.trns(b.rot(), length + (b.finpow() * 26 * (length / 100)));
			vec.trns(b.rot(), length);
			
			Draw.color(colors[s]);
			
			Fill.circle(b.x, b.y, strokes[s] * 4 * b.fout());
			
			Fill.circle(b.x + vec.x, b.y + vec.y, strokes[s] * 4 * b.fout());
			
			Lines.stroke(strokes[s] * 4 * b.fout());
			Lines.line(b.x, b.y, b.x + vec.x, b.y + vec.y, CapStyle.none);
		};
		Draw.reset();
		Draw.blend();
	}
});

visualLaser.speed = 0.00002;
visualLaser.damage = 0;
visualLaser.lifetime = 76;
visualLaser.hitEffect = Fx.none;
visualLaser.despawnEffect = Fx.none;
visualLaser.drawSize = 880;
visualLaser.collidesAir = false;
visualLaser.collidesTiles = false;
visualLaser.collides = false;
visualLaser.collidesTeam = false;
visualLaser.shootEffect = Fx.none;
visualLaser.smokeEffect = Fx.none;

const endGame = extendContent(PowerTurret, "end-game", {
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.region = Core.atlas.find("clear");
		this.regionLights = Core.atlas.find(this.name + "-lights");
		this.wheelRegion = Core.atlas.find(this.name + "-wheel");
		this.wheelRegionLights = Core.atlas.find(this.name + "-wheel-lights");
		this.plateRegion = Core.atlas.find(this.name + "-plate");
		this.plateRegionLights = Core.atlas.find(this.name + "-plate-lights");
	},
	
	generateIcons(){
	return [
		Core.atlas.find(this.name),
		Core.atlas.find(this.name + "-wheel"),
		Core.atlas.find(this.name + "-plate")
	];},
	
	draw: function(tile){
		entity = tile.ent();
		
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		Draw.blend(Blending.additive);
		Draw.alpha((0.5 + Mathf.absin(Time.time(), 5, 0.5)) * entity.heat);
		Draw.rect(this.regionLights, tile.drawx(), tile.drawy());
		Draw.blend();
		Draw.color();
	},
	
	drawLayer: function(tile){
		entity = tile.ent();
		
		//Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		Draw.rect(this.wheelRegion, tile.drawx(), tile.drawy(), entity.recoil);
		
		Draw.blend(Blending.additive);
		Draw.alpha((0.5 + Mathf.absin(Time.time() - 15, 5, 0.5)) * entity.heat);
		Draw.rect(this.wheelRegionLights, tile.drawx(), tile.drawy(), entity.recoil);
		Draw.blend();
		Draw.reset();
		
		Draw.rect(this.plateRegion, tile.drawx(), tile.drawy(), -entity.recoil);
		
		Draw.blend(Blending.additive);
		Draw.alpha((0.5 + Mathf.absin(Time.time() - 30, 5, 0.5)) * entity.heat);
		Draw.rect(this.plateRegionLights, tile.drawx(), tile.drawy(), -entity.recoil);
		Draw.color(Color.valueOf("ff0000"));
		Lines.stroke(1);
		Lines.swirl(tile.drawx(), tile.drawy(), 19.3, entity.reload / this.reload, 90);
		Draw.blend();
		Draw.reset();
	},
	
	update(tile){
		entity = tile.ent();
		
		//entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);
		//entity.recoil = Mathf.lerpDelta(entity.recoil, 0, 0.01);
		
		if(!this.validateTarget(tile)) entity.target = null;
		
		if(/*tile.entity.cons.valid()*/ entity.cons.valid()){
			//this.updateShootingB(tile);
			
			if(entity.timer.get(this.bulletTimer, 3)){
				this.destroyBullets(tile);
				this.scanBullets(tile);
			};
			
			if(entity.timer.get(this.timerTarget, this.targetInterval)){
				this.findTargetB(tile);
			};
			
			if(this.validateTarget(tile)){
				this.updateShootingB(tile);
			}
		};
		
		if(entity.target == null){
			entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);
			entity.recoil = Mathf.lerpDelta(entity.recoil, 0, 0.01);
		};
		
		//print(entity.target);
		//print(entity.shots);
	},
	
	updateShootingB(tile){
		entity = tile.ent();
		
		entity.heat = Mathf.lerpDelta(entity.heat, 1, 0.016);
		entity.recoil = Mathf.lerpDelta(entity.recoil, 360, 0.05 * entity.heat);
		//if(entity.shots < 360) entity.shots++;
		
		//if(entity.heat < 1) entity.heat += 0.07;
		
		if(entity.reload >= this.reload){
			entity.reload = 0;
			
			this.shootB(tile);
			
			//tile.entity.cons.trigger();
			entity.cons.trigger();
		}else{
			entity.reload += tile.entity.delta() * this.baseReloadSpeed(tile);
		};
	},
	
	findTargetB(tile){
		entity = tile.ent();
		
		entity.target = Units.closestTarget(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead()));
	},
	
	shootB(tile){
		entity = tile.ent();
		
		//var tileB = Units.findEnemyTile(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead()));
		
		if(entity.target != null){
			this.onDestroyedB(tile, this.range);
		};
		
		this.destroyTile(tile);
		
		this.destroyBullets(tile);
	},
	
	destroyTile(tile){
		//entity = tile.ent();
		
		for(var f = 0; f < 256; f++){
			var tileB = Units.findEnemyTile(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead()));
			
			if(tileB == null) break;
			
			this.laserEffectC(tile.drawx(), tile.drawy(), tileB.x, tileB.y);
			
			tileB.damage(Number.MAX_VALUE);
			if(tileB.block.size > 2) Effects.effect(vaporizeTile, tileB.x, tileB.y, tileB.block.size);
		}
	},
	
	laserEffectC(x, y, x2, y2){
		const vec1 = new Vec2();
		const vec2 = new Vec2();
		vec1.set(x, y);
		vec2.set(x2, y2);
		data = [vec1, vec2];
		
		Effects.effect(deathLaserEffect, x, y, 0, data);
	},
	
	destroyBullets(tile){
		Vars.bulletGroup.intersect(tile.drawx() - this.range, tile.drawy() - this.range, this.range * 2, this.range * 2, cons(b => {
			if(b != null){
				if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, this.range) && b instanceof Bullet && b.getBulletType() != null){	
					var damageB = 0;
					var currentBullet = b.getBulletType();
					var totalFragBullets = 1;
					
					for(var f = 0; f < 16; f++){
						if(currentBullet.fragBullet == null) break;
						
						var frag = currentBullet.fragBullet;
						//var frags = currentBullet.fragBullets;
						
						totalFragBullets *= currentBullet.fragBullets;
						
						damageB += (frag.damage + frag.splashDamage) * totalFragBullets;
						
						currentBullet = currentBullet.fragBullet;
						
						//totalFragBullets *= currentBullet.fragBullets;
						
						//print("damage:" + damageB + " totalFragBullets:" + totalFragBullets);
					};
					
					if(b.getTeam() != tile.getTeam() && (b.getShieldDamage() + damageB > 1000 || b.getBulletType().splashDamageRadius > 75) && b != null){
						
						//b.reset();
						//b.remove();
						//b.absorb();
						//print(frag + ":" + (frag.damage + frag.splashDamage * (b.getBulletType().fragBullets * 2)));
						var ang = Angles.angle(tile.drawx(), tile.drawy(), b.x, b.y);
						
						b.scaleTime(Mathf.lerp(b.time(), b.getBulletType().lifetime, 0.999));
						b.velocity(0.001, ang);
						b.resetOwner(b.getOwner(), tile.getTeam());
						b.deflect();

						this.laserEffectC(tile.drawx(), tile.drawy(), b.x, b.y);
					}
				}
			}
		}));
	},
	
	scanBullets(tile){
		entity = tile.ent();
		const radius = (this.size * Vars.tilesize / 2) * 1.333;
		
		Vars.bulletGroup.intersect(tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(b => {
			if(b != null){
				if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, radius) && b.getOwner() != null && !b.getBulletType().collidesTiles){
					var owner = b.getOwner();
					//this.range
					if(!Mathf.within(tile.drawx(), tile.drawy(), owner.x, owner.y, this.range)){
						if(owner instanceof HealthTrait && !owner.isDead()){
							owner.kill();
							this.laserEffectC(b.x, b.y, owner.x, owner.y);
							if(owner instanceof TileEntity) Effects.effect(vaporizeTile, owner.x, owner.y, owner.block.size);
							if(owner instanceof BaseUnit) Effects.effect(vaporize, owner.x, owner.y, owner.rotation, owner);
						};
						
						b.scaleTime(Mathf.lerp(b.time(), b.getBulletType().lifetime, 0.999));
						b.resetOwner(entity, tile.getTeam());
						b.deflect();
					
						this.laserEffectC(tile.drawx(), tile.drawy(), b.x, b.y);
						//print("aaaaaaa");
					};
				}
			}
		}));
	},
	
	onDestroyed(tile){
		//this.findTileTarget(tile);
		//this.shootB(tile);
		this.onDestroyedB(tile, 640);
		
		this.super$onDestroyed(tile);
	},
	
	onDestroyedB(tile, range){
		//entity = tile.ent();
		// 640
		var radius = range;
		
		Units.nearbyEnemies(tile.getTeam(), tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(unit => {
			if(unit.withinDst(tile.drawx(), tile.drawy(), radius)){
				if(!unit.isDead() && unit instanceof HealthTrait){
					//var dst = Mathf.dst(tile.drawx(), tile.drawy(), unit.x, unit.y);
					//var ang = Angles.angle(tile.drawx(), tile.drawy(), unit.x, unit.y);
					
					//Bullet.create(visualLaser, null, tile.getTeam(), tile.drawx(), tile.drawy(), ang, dst);
					if(unit instanceof BaseUnit) Effects.effect(vaporize, unit.x, unit.y, unit.rotation, unit);
					
					this.laserEffectC(tile.drawx(), tile.drawy(), unit.x, unit.y);
					
					//unit.setDead(true);
					unit.kill();
				}
			}
		}));
		
		this.destroyTile(tile);
		
		Effects.effect(darkShockwave, tile.drawx(), tile.drawy());
		Effects.effect(endGameShoot, tile.drawx(), tile.drawy(), 0, range);
		this.shootSound.at(tile, Mathf.random(0.9, 1.1));
	},
	
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		if(entity != null && bullet != null){
			const owner = bullet.getOwner();
			
			if(!Mathf.within(entity.x, entity.y, bullet.x, bullet.y, this.range / 1.5)){
				if(owner != null){
					if(owner instanceof HealthTrait){
						this.laserEffectC(bullet.x, bullet.y, owner.x, owner.y);
						if(!owner.isDead()) owner.kill();
						
						if(owner instanceof TileEntity) Effects.effect(vaporizeTile, owner.x, owner.y, owner.block.size);
						if(owner instanceof BaseUnit) Effects.effect(vaporize, owner.x, owner.y, owner.rotation, owner);
					};
				};
				this.laserEffectC(entity.x, entity.y, bullet.x, bullet.y);
				
				bullet.scaleTime(Mathf.lerp(bullet.time(), bullet.getBulletType().lifetime, 1));
				bullet.deflect();
				bullet.resetOwner(entity, entity.getTeam());
			}else if(owner != null){
				if(!Mathf.within(entity.x, entity.y, owner.x, owner.y, this.range) && owner instanceof HealthTrait){
					if(!owner.isDead()){
						owner.kill();
						
						this.laserEffectC(entity.x, entity.y, owner.x, owner.y);
						if(owner instanceof TileEntity) Effects.effect(vaporizeTile, owner.x, owner.y, owner.block.size);
						if(owner instanceof BaseUnit) Effects.effect(vaporize, owner.x, owner.y, owner.rotation, owner);
					}
				}
			}
		}
	}
});

endGame.reload = 380;
endGame.shootType = baseBullet;
endGame.bulletTimer = endGame.timers++;