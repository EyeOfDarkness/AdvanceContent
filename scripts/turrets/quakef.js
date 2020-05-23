const elib = require("effectlib");

const shellEjectHuge = elib.newGroundEffect(27, 400, e => {
	Draw.color(Pal.lightOrange, Color.lightGray, Pal.lightishGray, e.fin());
	var rot = e.rotation + 90;
	
	for(var i = 0; i < 2; i++){
		var sign = Mathf.signs[i];
		
		var len = (19 + e.finpow() * 9) * sign;
		var lr = rot + Mathf.randomSeedRange(e.id + sign + 6, 16 * e.fin()) * sign;
		Draw.rect(Core.atlas.find("casing"),
		e.x + Angles.trnsx(lr, len) + Mathf.randomSeedRange(e.id + sign + 7, 3.3 * e.fin()),
		e.y + Angles.trnsy(lr, len) + Mathf.randomSeedRange(e.id + sign + 8, 3.3 * e.fin()),
		3, 6,
		rot + e.fin() * 30 * sign + Mathf.randomSeedRange(e.id + sign + 9, 40 * e.fin()));
	}
});

quake = extendContent(DoubleTurret, "quake", {
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		
		for(var i = 0; i < 3; i++){
			this.heatArrayRegion[i] = Core.atlas.find(this.name + "-heat-" + (i + 1));
		}
	},
	
	draw: function(tile){
        Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
        Draw.color();
    },
	
	drawLayer(tile){
		entity = tile.ent();
		//this.super$drawLayer(tile);
		
		this.tr2.trns(entity.rotation, -entity.recoil);
		
		Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		
		for(var i = 0; i < 3; i++){
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
		
		for(var h = 0; h < 3; h++){
			entity.getArrayHeat()[h] = Mathf.lerpDelta(entity.getArrayHeat()[h], 0, this.cooldown);
		};
		
		//print(entity.getArrayHeat());
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find(this.name)
	];},
	
	shoot: function(tile, ammo){
		//const tr3 = new Vec2();
		entity = tile.ent();
		entity.shots++;
		entity.recoil = this.recoil;
		//entity.heat = 1;
		entity.getArrayHeat()[entity.shots % 3] = 1;
		
		const type = this.peekAmmo(tile);
		const predict = Predict.intercept(tile, entity.target, type.speed * (this.extraVelocity + 1));
		const dst = entity.dst(predict.x, predict.y);
		const maxTraveled = type.lifetime * (type.speed * (this.extraVelocity + 1));
		
		const i = (entity.shots % 3) - 1;
		const b = (entity.shots % 3) == 1 ? 1 : 0;
		
		//tr3.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2 + (this.midBarrelOff * b)) - entity.recoil);
		this.tr.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2 + (this.midBarrelOff * b)) - entity.recoil);
		
        for(var s = 0; s < this.shotsB; s++){
            Bullet.create(ammo, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y,
            entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy), (1.0 + this.extraVelocity) + Mathf.range(this.velocityInaccuracy), (dst / maxTraveled));
        };

		this.effects(tile);
		this.useAmmo(tile);
	}
});
quake.heatArrayRegion = [];
quake.shotWidth = 5.9;
quake.extraVelocity = 0.4;
quake.shotsB = 9;
quake.midBarrelOff = 4;
quake.inaccuracy = 9;
quake.reload = 20;
quake.ammoEjectBack = 8;
//quake.ammoUseEffect = Fx.shellEjectBig;
quake.ammoUseEffect = shellEjectHuge;
quake.velocityInaccuracy = 0.14;
quake.cooldown = 0.03;
quake.restitution = 0.02;
quake.recoil = 5;
quake.shootShake = 2;
quake.range = 360;
quake.shootSound = Sounds.artillery;
quake.entityType = prov(() => {
	entityB = extendContent(ItemTurret.ItemTurretEntity, quake, {
		getArrayHeat(){
			return this._arrayHeat;
		},
		
		setArrayHeat(a){
			this._arrayHeat = a;
		}
	});
	entityB.setArrayHeat([0, 0, 0]);
	
	return entityB;
});
quake.ammo(
		Items.graphite, Bullets.artilleryDense,
		Items.silicon, Bullets.artilleryHoming,
		Items.pyratite, Bullets.artilleryIncendiary,
		Items.blastCompound, Bullets.artilleryExplosive,
		Items.plastanium, Bullets.artilleryPlastic
		);