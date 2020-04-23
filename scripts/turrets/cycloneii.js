const cycloneii = extendContent(ItemTurret, "cyclone-ii", {
	shoot: function(tile, type){
		entity = tile.ent();

		entity.recoil = this.recoil;
		entity.heat = 1;

		//this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));

		for(var i = 0; i < this.shots; i++){
			this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
			this.bullet(tile, type, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy));
			this.effects(tile);
		};

		//this.effects(tile);
		this.useAmmo(tile);
    },
	
	bullet: function(tile, type, angle){
        Bullet.create(type, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle, (this.extraVelocity + 1));
    }
});

//cycloneii.shootShake = 4;
cycloneii.extraVelocity = 0.28;
cycloneii.recoil = 3;
cycloneii.shots = 2;
//cycloneii.shootEffect = Fx.lightningShoot;
cycloneii.ammo(Items.metaglass, Bullets.flakGlass,
			   Items.blastCompound, Bullets.flakExplosive,
			   Items.plastanium, Bullets.flakPlastic,
			   Items.surgealloy, Bullets.flakSurge);