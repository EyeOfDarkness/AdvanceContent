typhn = extendContent(DoubleTurret, "typhoon", {
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		//this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	shoot: function(tile, ammo){
		//const tr3 = new Vec2();
		entity = tile.ent();
		entity.shots++;
		entity.recoil = this.recoil;
		
		const type = this.peekAmmo(tile);
		
		var i = Mathf.signs[entity.shots % 2];
		//const i = (entity.shots % 2) <= 0 ? -1 : 1;
		
		//this.tr.trns(entity.rotation - 90, this.shotWidth * i + Mathf.range(this.xRand), (this.size * Vars.tilesize / 2) - entity.recoil);
		//this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
		
        for(var s = 0; s < this.shotsB; s++){
			this.tr.trns(entity.rotation - 90, this.shotWidth * i + Mathf.range(this.xRand), (this.size * Vars.tilesize / 2) - entity.recoil);
			Bullet.create(ammo, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy), (this.extraVelocity + 1));
			this.effects(tile);
        };

		//this.effects(tile);
		this.useAmmo(tile);
	}
});

typhn.shotWidth = 11;
typhn.extraVelocity = 0.5;
typhn.recoil = 3.7;
typhn.shotsB = 2;
typhn.ammo(Items.metaglass, Bullets.flakGlass,
			Items.blastCompound, Bullets.flakExplosive,
			Items.plastanium, Bullets.flakPlastic,
			Items.surgealloy, Bullets.flakSurge);