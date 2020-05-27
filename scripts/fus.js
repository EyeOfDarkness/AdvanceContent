const fusion = extendContent(GenericSmelter, "fusion", {	
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find(this.name + "-top");
		this.topRegionB = Core.atlas.find(this.name + "-topB");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-fusion"),
		Core.atlas.find("advancecontent-fusion-topB")
	];},
	
	draw: function(tile){
		entity = tile.ent();
		
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		if(entity.warmup > 0 && this.flameColor.a > 0.001){
			const g = 0.3;
			const r = 0.06;
			const cr = Mathf.random(0.1);

			Draw.alpha(((1.0 - g) + Mathf.absin(Time.time(), 8.0, g) + Mathf.random(r) - r) * entity.warmup);

			Draw.tint(this.flameColor);
			Draw.blend(Blending.additive);
			Draw.color(1.0, 1.0, 1.0, entity.warmup);
			Draw.rect(this.topRegion, tile.drawx(), tile.drawy(), 20.0 + Mathf.absin(Time.time(), 10.0, 5.0), 20.0 + Mathf.absin(Time.time(), 10.0, 5.0));
			//Fill.circle(tile.drawx(), tile.drawy(), 1.9 + Mathf.absin(Time.time(), 5.0, 1.0) + cr);
			Draw.blend();
		};
		Draw.color();
		Draw.rect(this.topRegionB, tile.drawx(), tile.drawy(), entity.totalProgress * 1.2);
	}
});