const aCompressor = extendContent(GenericCrafter, "advance-compressor", {
	load(){
		this.super$load();
		
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	
	draw(tile){
		this.super$draw(tile);
		
		entity = tile.ent();
		
		Draw.alpha(Mathf.absin(entity.totalProgress, 3, 0.9) * entity.warmup);
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
		Draw.reset();
	}
});