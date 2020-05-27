const eclipseHit = newEffect(15, e => {
	Draw.color(Color.valueOf("c2ebff"), Color.valueOf("68c0ff"), e.fin());
	
	const hj = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 4, 3 + e.fout() * 9, 0);
	}});
	
	Angles.randLenVectors(e.id, 4, e.finpow() * 28.0, e.rotation, 360.0, hj);
	
	Draw.color(Color.valueOf("ffffff"), Color.valueOf("a9d8ff"), e.fin());
	
	Lines.stroke(1.5 * e.fout());
	
	const hk = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
	}});
	
	Angles.randLenVectors(e.id * 11, 7, e.finpow() * 42.0, e.rotation, 360.0, hk);
});

const eclipseBullet = extend(BasicBulletType, {
	update: function(b){
		const trnsb = new Vec2();
		Effects.shake(1.2, 1.2, b.x, b.y);
		
		if(b.timer.get(1, 5) && b.getData() != null){
			b.getData()[1] = true;
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), Math.min(this.lengthB, b.getData()[0]), true);
			//b.getData()[1] = true;
		};
	},
		
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null && b.getData() != null && b.getData()[1]){
			//var angle = Angles.angle(b.x, b.y, hitx, hity);
			Effects.effect(this.hitEffect, hitx, hity, b.rot());
			len = Mathf.dst(b.x, b.y, hitx, hity);
			b.getData()[0] = len;
			b.getData()[1] = false;
			//b.setData(len);
		}
	},
	
	draw: function(b){
		if(b.getData()[0] == null){
			return
		};
		
		const colors = [Color.valueOf("59a7ff55"), Color.valueOf("59a7ffaa"), Color.valueOf("a3e3ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.24];
		const strokes = [2.8, 2, 1.6, 0.8];
		const lenscales = [0.92, 1, 1.017, 1.025];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.2, 0.4)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.8) * 55.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.7, 3.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), (Math.min(this.lengthB, b.getData()[0]) * lenscales[i]) * 1.12, CapStyle.none);
			}
		};
		Draw.reset();
	}
});

eclipseBullet.scanAccuracy = 30;
eclipseBullet.lengthB = 490;
eclipseBullet.speed = 0.001;
eclipseBullet.damage = 390;
eclipseBullet.knockback = 2.2;
eclipseBullet.lifetime = 18;
eclipseBullet.hitEffect = eclipseHit;
eclipseBullet.despawnEffect = Fx.none;
eclipseBullet.hitSize = 7;
eclipseBullet.drawSize = 720;
eclipseBullet.pierce = true;
eclipseBullet.shootEffect = Fx.none;
eclipseBullet.smokeEffect = Fx.none;

const eclipse = extendContent(PowerTurret, "eclipse", {
	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.damage);
		this.stats.add(BlockStat.damage, this.shootType.damage * 60 / 5, StatUnit.perSecond);
	},
	
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	update(tile){
		this.super$update(tile);
		
		entity = tile.ent();
		
		if(entity.getBulletLife() > 0 && entity.getBullet() != null){
			var entBullet = entity.getBullet();
			
			this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, 0);
			entBullet.rot(entity.rotation);
			entBullet.set(tile.drawx() + this.tr.x, tile.drawy() + this.tr.y);
			entBullet.time(0);
			if(entBullet.getData() != null){
				//var bulletLength = entBullet.getData()[0] + (this.growthSpeed * Time.delta());
				//var bulletBool = entBullet.getData()[1];
				//var data = [bulletLength, bulletBool];
				
				if(entBullet.getData()[1]){
					entity.setBulletHeat(Mathf.lerp(entity.getBulletHeat(), 1, 0.09));
					entBullet.getData()[0] = entBullet.getData()[0] + ((this.growthSpeed * Time.delta()) * entity.getBulletHeat());
				}else{
					entity.setBulletHeat(Mathf.lerp(entity.getBulletHeat(), 0, 0.18));
				};
				
				//entBullet.setData(entBullet.getData() + (this.growthSpeed * Time.delta()));
				//entBullet.setData(data);
			};
			entity.heat = 1;
			entity.recoil = this.recoil;
			//entity.bulletLife -= Time.delta();
			entity.setBulletLife(entity.getBulletLife() - Time.delta());
			if(entity.getBulletLife() <= 0){
				entity.setBullet(null);
			}
		}
	},
	
	updateShooting(tile){
		entity = tile.ent();
		
		if(entity.getBulletLife() > 0 && entity.getBullet() != null){
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
			//used = Math.min(Math.min(entity.liquids.get(liquid), maxUsed * Time.delta()), Math.max(0, ((this.reload - entity.reload) / this.coolantMultiplier) / liquid.heatCapacity)) * this.baseReloadSpeed(tile);
			//entity.reload += used * liquid.heatCapacity * this.coolantMultiplier;
			//print(used);
			entity.reload += Math.max(used, 1 * Time.delta()) * entity.power.status;
			entity.liquids.remove(liquid, used);
			
			if(Mathf.chance(0.06 * used)){
				Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * Vars.tilesize / 2), tile.drawy() + Mathf.range(this.size * Vars.tilesize / 2));
			}
		}
	},
	
	bullet(tile, type, angle){
		entity = tile.ent();
		data = [10, true];
		bullet = Bullet.create(type, entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle);
		bullet.setData(data);
		
		entity.setBulletHeat(1.25);
		entity.setBullet(bullet);
		entity.setBulletLife(this.shootDuration);
		
		for(var i = 0; i < 4; i++){
			Lightning.create(tile.getTeam(), Color.valueOf("a3e3ff"), 12, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle + Mathf.range(50), Mathf.random(14, 32));
		}
	},
	
	turnToTarget(tile, targetRot){
		entity = tile.ent();

		entity.rotation = Angles.moveToward(entity.rotation, targetRot, this.rotatespeed * entity.delta() * (entity.getBulletLife() > 0 ? this.firingMoveFract : 1));
	},
	
	shouldActiveSound(tile){
		entity = tile.ent();

		return entity.getBulletLife() > 0 && entity.getBullet() != null;
	}
});

eclipse.consumes.add(new ConsumeLiquidFilter(boolf(liquid => liquid.temperature <= 0.5 && liquid.flammability < 0.1), 1.1)).update(false).boost();
eclipse.shootDuration = 320;
eclipse.growthSpeed = 25;
eclipse.firingMoveFract = 0.12;
eclipse.shootType = eclipseBullet;
eclipse.entityType = prov(() => {
	entity = extend(Turret.TurretEntity, {
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
		}
	});
	entity.setBulletHeat(0);
	entity.setBullet(null);
	entity.setBulletLife(0);
	
	return entity;
});