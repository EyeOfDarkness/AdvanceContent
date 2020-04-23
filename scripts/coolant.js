const ftop = modName + "-coolant-factory-top";
const fliquid = modName + "-coolant-factory-liquid";

const tierA = extendContent(LiquidConverter, "tiera-coolant-factory", {
	load(){
		this.super$load();
		
		this.topRegion = Core.atlas.find(ftop);
		this.liquidRegion = Core.atlas.find(fliquid);
	},
	
	draw(tile){
		mod = tile.entity.liquids;
		
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		if(mod.total() > 0.001){
			Draw.color(this.outputLiquid.liquid.color);
			Draw.alpha(mod.get(this.outputLiquid.liquid) / this.liquidCapacity);
			Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
			Draw.color();
		};
		
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	},
	
	generateIcons(){
		return [Core.atlas.find(this.name), Core.atlas.find(ftop)];
	}
});

const tierB = extendContent(LiquidConverter, "tierb-coolant-factory", {
	load(){
		this.super$load();
		
		this.topRegion = Core.atlas.find(ftop);
		this.liquidRegion = Core.atlas.find(fliquid);
	},
	
	draw(tile){
		mod = tile.entity.liquids;
		
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		if(mod.total() > 0.001){
			Draw.color(this.outputLiquid.liquid.color);
			Draw.alpha(mod.get(this.outputLiquid.liquid) / this.liquidCapacity);
			Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
			Draw.color();
		};
		
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	},
	
	generateIcons(){
		return [Core.atlas.find(this.name), Core.atlas.find(ftop)];
	}
});

const tierC = extendContent(LiquidConverter, "tierc-coolant-factory", {
	load(){
		this.super$load();
		
		this.topRegion = Core.atlas.find(ftop);
		this.liquidRegion = Core.atlas.find(fliquid);
	},
	
	draw(tile){
		mod = tile.entity.liquids;
		
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		if(mod.total() > 0.001){
			Draw.color(this.outputLiquid.liquid.color);
			Draw.alpha(mod.get(this.outputLiquid.liquid) / this.liquidCapacity);
			Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
			Draw.color();
		};
		
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	},
	
	generateIcons(){
		return [Core.atlas.find(this.name), Core.atlas.find(ftop + "-large")];
	}
});