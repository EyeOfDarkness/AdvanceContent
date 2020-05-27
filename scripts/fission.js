const fst = extendContent(GenericSmelter, "fst", {	
	load(){
		this.super$load();
		this.region = Core.atlas.find("advancecontent-fst");
		this.topRegion = Core.atlas.find("advancecontent-fission-top");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-fst"),
	];}
});

const fsl = extendContent(GenericSmelter, "fsl", {	
	load(){
		this.super$load();
		this.region = Core.atlas.find("advancecontent-fsl");
		this.topRegion = Core.atlas.find("advancecontent-fission-top");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-fsl"),
	];}
});

const fss = extendContent(GenericSmelter, "fss", {	
	load(){
		this.super$load();
		this.region = Core.atlas.find("advancecontent-fss");
		this.topRegion = Core.atlas.find("advancecontent-fission-top");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-fss"),
	];}
});

const fsc = extendContent(GenericSmelter, "fsc", {	
	load(){
		this.super$load();
		this.region = Core.atlas.find("advancecontent-fsc");
		this.topRegion = Core.atlas.find("advancecontent-fission-top");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-fsc"),
	];}
});