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
	shoot: function(tile, ammo){
		const tr3 = new Vec2();
		entity = tile.ent();
		entity.shots++;
		entity.recoil = this.recoil;
		entity.heat = 1;
		
		const type = this.peekAmmo(tile);
		const predict = Predict.intercept(tile, entity.target, type.speed * (this.extraVelocity + 1));
		const dst = entity.dst(predict.x, predict.y);
		const maxTraveled = type.lifetime * (type.speed * (this.extraVelocity + 1));
		
		const i = Mathf.signs[entity.shots % 2];
		//const i = (entity.shots % 2) <= 0 ? -1 : 1;
		
		tr3.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
		//this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
		
        for(var s = 0; s < this.shotsB; s++){
            Bullet.create(ammo, tile.entity, tile.getTeam(), tile.drawx() + tr3.x, tile.drawy() + tr3.y,
            entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy), (1.0 + this.extraVelocity) + Mathf.range(this.velocityInaccuracy), (dst / maxTraveled));
        };

		this.effects(tile);
		this.useAmmo(tile);
	},
	
	effects: function(tile){
		const tr3 = new Vec2();
		entity = tile.ent();
		//entity.shots++;
		
		const i = Mathf.signs[entity.shots % 2];
		//const i = (entity.shots % 2) <= 0 ? -1 : 1;
		tr3.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
		
		const shootEffectB = this.shootEffect == Fx.none ? this.peekAmmo(tile).shootEffect : this.shootEffect;
		const smokeEffectB = this.smokeEffect == Fx.none ? this.peekAmmo(tile).smokeEffect : this.smokeEffect;

		Effects.effect(shootEffectB, tile.drawx() + tr3.x, tile.drawy() + tr3.y, entity.rotation);
		Effects.effect(smokeEffectB, tile.drawx() + tr3.x, tile.drawy() + tr3.y, entity.rotation);
		this.shootSound.at(tile, Mathf.random(0.9, 1.1));

		if(this.shootShake > 0){
		Effects.shake(this.shootShake, this.shootShake, tile.entity);
		};

		entity.recoil = this.recoil;
	}
});
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
shatter.ammo(
		Items.graphite, Bullets.artilleryDense,
		Items.silicon, Bullets.artilleryHoming,
		Items.pyratite, Bullets.artilleryIncendiary,
		Items.blastCompound, Bullets.artilleryExplosive,
		Items.plastanium, Bullets.artilleryPlastic
		);