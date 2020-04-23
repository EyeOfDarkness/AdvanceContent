const bosonZbullet = extend(BasicBulletType, {
	load: function(){
		this.region = Core.atlas.find("circle");
	},
	
	draw: function(b){
		const vel = b.velocity().len() * 4;
		
		Draw.color(Color.valueOf("a9d8ff"));
		Draw.rect(this.region, b.x, b.y, 4.75, 4 + vel, b.rot() - 90);
		
		Draw.color(Color.valueOf("ffffff"));
		Draw.rect(this.region, b.x, b.y, 3, 2.75 + (vel / 1.2), b.rot() - 90);
	}
});
bosonZbullet.speed = 9.5;
bosonZbullet.damage = 56;
bosonZbullet.splashDamage = 8;
bosonZbullet.splashDamageRadius = 16;
bosonZbullet.drag = 0.005;
bosonZbullet.lifetime = 27;
bosonZbullet.hitSize = 8;
bosonZbullet.despawnEffect = Fx.hitLancer;
bosonZbullet.shootEffect = Fx.none;
bosonZbullet.smokeEffect = Fx.none;
bosonZbullet.hitEffect = Fx.hitLancer;

const bosonZ = extendContent(PowerTurret, "z-boson", {
	load: function(){
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-5");
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	drawLayer(tile){
		this.super$drawLayer(tile);
		
		const vec = new Vec2();
		
		entity = tile.ent();
		
		vec.trns(entity.rotation, -10 + -entity.recoil);
		
		Draw.color(Color.valueOf("00d9ff"), Color.valueOf("ccffff"), entity.heat);
		Lines.stroke(1.5);
		Lines.lineAngle(tile.drawx() + vec.x, tile.drawy() + vec.y, entity.rotation, entity.shots / 3.125, CapStyle.none);
		Draw.reset();
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find(this.name)
	];},
	
	update(tile){
		this.super$update(tile);
		
		entity = tile.ent();
		if(entity.target == null || tile.entity.power.status == 0){
			//entity.shots = 0;
			if((entity.timer.get(this.timerShots, 8) || tile.entity.power.status == 0) && entity.shots > 0){
				entity.shots--;
			}
		};
		
		if(this.baseReloadSpeed(tile) >= this.maxReload){
			//entity.shots = Mathf.round(this.baseReloadSpeed(tile) * this.reloadEase);
			entity.shots--;
			entity.shots--;
		};
		
		//print("shots:" + entity.shots);
	},
	
	shoot: function(tile, type){
		const tr3 = new Vec2();
		entity = tile.ent();
		entity.shots++;
		entity.recoil = this.recoil;
		entity.heat = 1;
		
		const i = Mathf.signs[entity.shots % 2];
		
		tr3.trns(entity.rotation - 90, this.shotWidth * i, this.size * Vars.tilesize / 2);
		
		var vx = tile.drawx() + tr3.x;
		var vy = tile.drawy() + tr3.y;

		if(this.baseReloadSpeed(tile) < 12){
			Lightning.create(tile.getTeam(), Color.valueOf("a9d8ff"), 16, vx, vy, entity.rotation, Mathf.floor((18 - this.baseReloadSpeed(tile)) * tile.entity.power.status));
		};
		Bullet.create(this.shootType, tile.entity, tile.getTeam(), vx, vy, entity.rotation + Mathf.range(this.inaccuracy / (1 + Mathf.clamp(entity.shots / this.reloadEase, 0, this.maxReload))));
		
		//this.consumes.power(0.95);
		
		this.effects(tile);
		this.useAmmo(tile);
	},
	
	effects: function(tile){
		const tr3 = new Vec2();
		entity = tile.ent();
		//entity.shots++;
		
		const i = Mathf.signs[entity.shots % 2];
		tr3.trns(entity.rotation - 90, this.shotWidth * i, this.size * Vars.tilesize / 2);
		
		const shootEffectB = this.shootEffect == Fx.none ? this.peekAmmo(tile).shootEffect : this.shootEffect;
		const smokeEffectB = this.smokeEffect == Fx.none ? this.peekAmmo(tile).smokeEffect : this.smokeEffect;

		Effects.effect(shootEffectB, tile.drawx() + tr3.x, tile.drawy() + tr3.y, entity.rotation);
		Effects.effect(smokeEffectB, tile.drawx() + tr3.x, tile.drawy() + tr3.y, entity.rotation);
		this.shootSound.at(tile, Mathf.random(0.9, 1.1) + (this.baseReloadSpeed(tile) / 3));

		if(this.shootShake > 0){
		Effects.shake(this.shootShake, this.shootShake, tile.entity);
		};

		entity.recoil = this.recoil;
	},
	
	baseReloadSpeed: function(tile){
		entity = tile.ent();
		
		return (1 + Mathf.clamp(entity.shots / this.reloadEase, 0, this.maxReload)) * tile.entity.power.status;
	}
});

bosonZ.timerShots = bosonZ.timers++;
bosonZ.shotWidth = 5.6;
bosonZ.maxReload = 13;
bosonZ.reloadEase = 5;
bosonZ.inaccuracy = 2.3;
bosonZ.shootType = bosonZbullet;