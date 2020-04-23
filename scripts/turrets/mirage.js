const mirage = extendContent(DoubleTurret, "mirage",{
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-5");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find(this.name)
	];},
});