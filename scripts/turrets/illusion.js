const illusion = extendContent(DoubleTurret, "illusion", {
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	shoot(tile, ammo){
		entity = tile.ent();
		entity.shots++;
		
		var target = entity.target;
		
		var vec = new Vec2();
		var vec2 = new Vec2();

		var i = Mathf.signs[entity.shots % 2];
		
		this.tr.trns(entity.rotation - 90, this.shotWidth * i, this.size * Vars.tilesize / 2);
		
		var len = Mathf.dst(tile.drawx(), tile.drawy(), target.getX(), target.getY());
		//var len = Mathf.dst(tile.getX(), tile.getY(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y);
		
		//vec.set(0, (this.shotWidth * i) / len);
		
		vec2.set(this.shotWidth * i, this.size * Vars.tilesize / 2).rotate(-90);
		vec.set(0, Math.max(len, (this.size * Vars.tilesize / 2) + 25)).rotate(-90);
		
		var angleB = Angles.angle(vec2.x, vec2.y, vec.x, vec.y);

		this.bullet(tile, ammo, entity.rotation + angleB + Mathf.range(this.inaccuracy + ammo.inaccuracy));

		this.effects(tile);
		this.useAmmo(tile);
	}
});