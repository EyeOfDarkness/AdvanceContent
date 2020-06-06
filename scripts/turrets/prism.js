const prHitEffect = newEffect(16, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000ff").shiftHue(Time.time() * 2.0));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
		//Fill.poly(e.x + x, e.y + y, 4, ((e.finpow() * -1) + 1) * 8, e.rotation + ang);
	}});
	
	Angles.randLenVectors(e.id, 1, e.finpow() * 70.0, e.rotation, 80.0, hl);
	Draw.blend();
	Draw.reset();
});

const prismBullet = extend(BasicBulletType, {
	update: function(b){
		Effects.shake(0.1, 0.1, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.laserLength, false);
		};
	},
	
	draw: function(b){
		if(b.getData() == null){
			return;
		};
		
		var width = Mathf.clamp(1 - b.getOwner().getBulletHeat());
		
		const tscales = [1, 0.74, 0.5, 0.24];
		//const strokes = [2.8, 2, 1.6, 0.8];
		const lenscales = [0.92, 1, 1.017, 1.025];
		const tmpColor = new Color();
		
		Draw.blend(Blending.additive);
		Draw.color(tmpColor.set(Color.valueOf("ff0000")).shiftHue(b.getData() + (Time.time() * 2.0)));
		for(var i = 0; i < 4; i++){
			Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.9) * 55.0);
			Lines.stroke((9 + Mathf.absin(Time.time(), 1.7, 3.1)) * b.fout() * width * tscales[i]);
			Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), (this.laserLength * lenscales[i]), CapStyle.none);
		};
		Draw.reset();
		Draw.blend();
	}
});
prismBullet.laserLength = 330;
prismBullet.speed = 0.001;
prismBullet.damage = 32;
prismBullet.lifetime = 17;
prismBullet.hitEffect = prHitEffect;
prismBullet.despawnEffect = Fx.none;
prismBullet.hitSize = 5;
prismBullet.drawSize = 740;
prismBullet.pierce = true;
prismBullet.shootEffect = Fx.none;
prismBullet.smokeEffect = Fx.none;

const prism = extendContent(PowerTurret, "prism", {
	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.damage);
		this.stats.add(BlockStat.damage, this.shootType.damage * 60 / 5, StatUnit.perSecond);
	},
	
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		for(var i = 0; i < 16; i++){
			this.rainbowRegions[i] = Core.atlas.find(this.name + "-rainbow-" + (i + 1));
		}
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	drawLayer: function(tile){
		entity = tile.ent();

		this.tr2.trns(entity.rotation, -entity.recoil);

		Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		
		Draw.blend(Blending.additive);
		for(var h = 0; h < 16; h++){
			Draw.color(Color.valueOf("ff0000").shiftHue((Time.time() * 2.0) + (h * (360 / 16))));
			Draw.rect(this.rainbowRegions[h], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		};
		Draw.blend();
		Draw.color();
	},
	
	update(tile){
		this.super$update(tile);
		
		entity = tile.ent();
		
		if(entity.getBulletLife() > 0 && this.hasLasers(tile)){
			for(var n = 0; n < entity.getBullet().length; n++){
				entBullet = entity.getBullet()[n];
				if(entBullet == null){
					entity.getBullet()[n] = null;
					continue;
				};
				
				var data = (n * (360 / entity.getBullet().length));
				var sine = Mathf.sinDeg(data + (entity.getBulletTime() * this.angleShiftStrength));
				this.tr.trns(entity.rotation, (this.size * Vars.tilesize / 2) + -entity.recoil, sine * this.sideOffset);
				
				entBullet.rot(entity.rotation + ((sine * 40) * entity.getBulletHeat()));
				entBullet.set(tile.drawx() + this.tr.x, tile.drawy() + this.tr.y);
				entBullet.time(0);
			};
			
			var shakeB = Mathf.clamp(1 - entity.getBulletHeat()) * 2.3;
			
			Effects.shake(shakeB, shakeB, tile.drawx(), tile.drawy());
			
			entity.heat = 1;
			entity.recoil = (1 - entity.getBulletHeat()) * this.recoil;
			entity.setBulletTime(entity.getBulletTime() + Time.delta());
			//entity.bulletLife -= Time.delta();
			//entity.setBulletLife(entity.getBulletLife() - (Time.delta() * ((1 * this.overdriveStrength) / (entity.timeScale * this.overdriveStrength))));
			entity.setBulletLife(entity.getBulletLife() - (Time.delta() * ((1 * this.overdriveStrength) / (this.overdriveStrength + (entity.timeScale - 1)))));
			if(entity.getBulletLife() <= 0){
				this.clearLasers(tile);
				entity.setBulletHeat(0);
				entity.setBulletTime(0);
			}
		};
		
		//entity.setBulletTime(entity.getBulletTime() + Time.delta());
		entity.setBulletHeat(Mathf.lerpDelta(entity.getBulletHeat(), 0, this.fade));
	},
	
	clearLasers(tile){
		entity = tile.ent();
		
		for(var b = 0; b < entity.getBullet().length; b++){
			entity.getBullet()[b] = null;
		};
	},
	
	updateShooting(tile){
		entity = tile.ent();
		
		if(entity.getBulletLife() > 0 && this.hasLasers(tile)){
			return;
		};
		
		if(entity.reload >= this.reload){
			type = this.peekAmmo(tile);
			
			this.shoot(tile, type);
			
			entity.reload = 0;
		}else{
			liquid = entity.liquids.current();
			maxUsed = this.consumes.get(ConsumeType.liquid).amount;
			
			used = this.baseReloadSpeed(tile) * (tile.isEnemyCheat() ? maxUsed : Math.min(entity.liquids.get(liquid), maxUsed * Time.delta())) * liquid.heatCapacity * this.coolantMultiplier;
			entity.reload += Math.max(used, 1 * Time.delta()) * entity.power.status;
			entity.liquids.remove(liquid, used);
			
			if(Mathf.chance(0.06 * used)){
				Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * Vars.tilesize / 2), tile.drawy() + Mathf.range(this.size * Vars.tilesize / 2));
			}
		}
	},
	
	hasLasers(tile){
		entity = tile.ent();
		var num = 0;
		var bool = false;
		
		for(var i = 0; i < entity.getBullet().length; i++){
			if(entity.getBullet()[i] != null){
				num++;
			};
		};
		if(num > 0) bool = true;

		return bool;
	},
	
	bullet(tile, type, angle){
		entity = tile.ent();
		
		entity.setBulletTime(0);
		entity.setBulletLife(this.shootDuration);
		for(var s = 0; s < 6; s++){
			var data = (s * (360 / 6));
			var sine = Mathf.sinDeg(data + (entity.getBulletTime() * this.angleShiftStrength));
			this.tr.trns(angle, this.size * Vars.tilesize / 2, sine * this.sideOffset);
			entity.getBullet()[s] = Bullet.create(type, entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle + (sine * 40));
			entity.getBullet()[s].setData(data);
		};
		
		entity.setBulletHeat(1);
	},
	
	turnToTarget(tile, targetRot){
		entity = tile.ent();

		entity.rotation = Angles.moveToward(entity.rotation, targetRot, this.rotatespeed * entity.delta() * (entity.getBulletLife() > 0 ? Mathf.lerp(1, this.firingMoveFract, 1 - entity.getBulletHeat()) : 1));
	},
	
	shouldActiveSound(tile){
		entity = tile.ent();
		var num = 0;
		var bool = false;
		
		for(var i = 0; i < entity.getBullet().length; i++){
			if(entity.getBullet()[i] != null){
				num++;
			};
		};
		if(num > 0) bool = true;

		return entity.getBulletLife() > 0 && bool;
	}
});
prism.overdriveStrength = 3;
prism.fade = 0.012;
prism.angleShiftStrength = 7;
prism.sideOffset = 3;
prism.rainbowRegions = [];
prism.consumes.add(new ConsumeLiquidFilter(boolf(liquid => liquid.temperature <= 0.5 && liquid.flammability < 0.1), 0.75)).update(false).boost();
prism.shootDuration = 440;
prism.firingMoveFract = 0.05;
prism.shootType = prismBullet;
prism.entityType = prov(() => {
	entityB = extend(Turret.TurretEntity, {
		getBulletHeat(){
			return this._bulletHeat;
		},
		
		setBulletHeat(a){
			this._bulletHeat = a;
		},
		
		setBullet(a){
			this._bullet = a;
		},
		
		getBullet(){
			return this._bullet;
		},
		
		getBulletLife(){
			return this._bulletlife;
		},
		
		setBulletLife(a){
			this._bulletlife = a;
		},
		
		getBulletTime(){
			return this._bulletTime;
		},
		
		setBulletTime(a){
			this._bulletTime = a;
		}
	});
	entityB.setBulletHeat(0);
	entityB.setBullet([null, null, null, null, null, null]);
	entityB.setBulletLife(0);
	entityB.setBulletTime(0);
	
	return entityB;
});