const elib = require("effectlib");

const shellEjectHugeB = elib.newGroundEffect(27, 400, e => {
	Draw.color(Pal.lightOrange, Color.lightGray, Pal.lightishGray, e.fin());
	var rot = e.rotation + 90;
	
	for(var i = 0; i < 2; i++){
		var sign = Mathf.signs[i];
		
		var len = (16 + e.finpow() * 6) * sign;
		var lr = rot + Mathf.randomSeedRange(e.id + sign + 6, 13 * e.fin()) * sign;
		Draw.rect(Core.atlas.find("casing"),
		e.x + Angles.trnsx(lr, len) + Mathf.randomSeedRange(e.id + sign + 7, 3.3 * e.fin()),
		e.y + Angles.trnsy(lr, len) + Mathf.randomSeedRange(e.id + sign + 8, 3.3 * e.fin()),
		3, 6,
		rot + e.fin() * 30 * sign + Mathf.randomSeedRange(e.id + sign + 9, 40 * e.fin()));
	}
});

shatter = extendContent(DoubleTurret, "shatter", {
	load(){
		this.super$load();
		
		for(var i = 0; i < 2; i++){
			this.heatArrayRegion[i] = Core.atlas.find(this.name + "-heat-" + (i + 1));
		}
	},
	
	drawLayer(tile){
		entity = tile.ent();
		//this.super$drawLayer(tile);
		
		this.tr2.trns(entity.rotation, -entity.recoil);
		
		Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		
		for(var i = 0; i < 2; i++){
			if(!(entity.getArrayHeat()[i] <= 0.00001)){
				Draw.color(this.heatColor, entity.getArrayHeat()[i]);
				Draw.blend(Blending.additive);
				Draw.rect(this.heatArrayRegion[i], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
				Draw.blend();
				Draw.color();
			}
		}
	},
	
	update(tile){
		this.super$update(tile);
		
		entity = tile.ent();
		
		for(var h = 0; h < 2; h++){
			entity.getArrayHeat()[h] = Mathf.lerpDelta(entity.getArrayHeat()[h], 0, this.cooldown);
		};
		
		//print(entity.getArrayHeat());
	},
	
	shoot: function(tile, ammo){
		//const tr3 = new Vec2();
		entity = tile.ent();
		entity.shots++;
		entity.recoil = this.recoil;
		entity.getArrayHeat()[entity.shots % 2] = 1;
		//entity.heat = 1;
		
		const type = this.peekAmmo(tile);
		const predict = Predict.intercept(tile, entity.target, type.speed * (this.extraVelocity + 1));
		const dst = entity.dst(predict.x, predict.y);
		const maxTraveled = type.lifetime * (type.speed * (this.extraVelocity + 1));
		
		const i = Mathf.signs[entity.shots % 2];
		//const i = (entity.shots % 2) <= 0 ? -1 : 1;
		
		//tr3.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
		this.tr.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
		//this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
		
        for(var s = 0; s < this.shotsB; s++){
            Bullet.create(ammo, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y,
            entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy), (1.0 + this.extraVelocity) + Mathf.range(this.velocityInaccuracy), (dst / maxTraveled));
        };

		this.effects(tile);
		this.useAmmo(tile);
	}
});
shatter.heatArrayRegion = [];
shatter.shotWidth = 4.4;
shatter.extraVelocity = 0.2;
shatter.shotsB = 7;
shatter.inaccuracy = 10;
shatter.reload = 30;
shatter.ammoEjectBack = 8;
shatter.ammoUseEffect = shellEjectHugeB;
shatter.velocityInaccuracy = 0.2;
shatter.cooldown = 0.03;
shatter.restitution = 0.02;
shatter.recoil = 5;
shatter.shootShake = 2;
shatter.range = 320;
shatter.shootSound = Sounds.artillery;
shatter.entityType = prov(() => {
	entityB = extendContent(ItemTurret.ItemTurretEntity, shatter, {
		getArrayHeat(){
			return this._arrayHeat;
		},
		
		setArrayHeat(a){
			this._arrayHeat = a;
		}
	});
	entityB.setArrayHeat([0, 0]);
	
	return entityB;
});
shatter.ammo(
		Items.graphite, Bullets.artilleryDense,
		Items.silicon, Bullets.artilleryHoming,
		Items.pyratite, Bullets.artilleryIncendiary,
		Items.blastCompound, Bullets.artilleryExplosive,
		Items.plastanium, Bullets.artilleryPlastic
		);