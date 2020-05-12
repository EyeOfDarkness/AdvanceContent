const shrapnel = extend(BasicBulletType, {
	draw(b){
		var random = Mathf.randomSeed(b.id, 0, 2) + 1;
		var randRot = Mathf.randomSeedRange(b.id * 15, 180) * b.fin();
		var region = Core.atlas.find("advancecontent-shrapnel-" + random);
		
		Draw.mixcol(Color.valueOf("f8c266"), b.fout());
		Draw.rect(region, b.x, b.y, b.rot() * randRot);
		Draw.reset();
	}
});

shrapnel.drag = 0.02;
shrapnel.lifetime = 27;
shrapnel.speed = 17.6;
shrapnel.damage = 23;
shrapnel.pierce = true;
shrapnel.hitSize = 3;

const lightTrail = newEffect(32, e => {
	const lightRegion = Core.atlas.find("advancecontent-legacy-battery-particle");
	const vec = new Vec2();
	const tmpCol = new Color();
	const colors = [Color.valueOf("f8c266"), Color.valueOf("fb9567")];
	var energy = 750000;
	var randRot = (Mathf.randomSeedRange(e.id * 412, 360) + 360) / 2;
	var len = Mathf.randomSeedRange(e.id * 127, 2.8);
	var randRotVel = (((Mathf.randomSeedRange(e.id * 45, energy) + energy) / 2) * (1 - e.data[0])) * e.fin();
	
	vec.trns(randRot, len * e.fin());
	//var randX = Mathf.randomSeedRange(e.id * 431, 3.5) * e.fin();
	//var randY = Mathf.randomSeedRange(e.id * 246, 3.5) * e.fin();
	
	if(!Core.settings.getBool("bloom")){
		Draw.mixcol(Color.valueOf("a26c00"), e.data[0]);
		Draw.blend(Blending.additive);
		Draw.alpha((e.fout() * e.data[1]) / 1.5);
		Draw.rect(lightRegion, e.x + vec.x, e.y + vec.y, (e.rotation - 90) + randRotVel);
		Draw.blend();
		Draw.reset();
	}else{
		tmpCol.lerp(colors, 1 - e.data[0]);
		Draw.mixcol(tmpCol, 1);
		Draw.alpha(e.fout() * e.data[1]);
		Draw.rect(lightRegion, e.x + vec.x, e.y + vec.y, (e.rotation - 90) + randRotVel);
		Draw.reset();
	}
});

const legacyBat = extendContent(GenericCrafter, "legacy-battery", {
	load(){
		this.super$load();
		
		//this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.lightIntRegion = Core.atlas.find(this.name + "-internal-lights");
		this.spinnerRegion = Core.atlas.find(this.name + "-spinner");
		this.spinnerLightsRegion = Core.atlas.find(this.name + "-spinner-lights");
		this.glassRegion = Core.atlas.find(this.name + "-glass");
		this.topBRegion = Core.atlas.find(this.name + "-top");
		this.topLightsRegion = Core.atlas.find(this.name + "-top-lights");
	},
	
	init(){
		this.super$init();
		
		//print(this.powerBuffered);
		this.powerBuffered = this.consumes.getPower().capacity;
		//print(this.powerBuffered);
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find(this.name + "-base"),
		Core.atlas.find(this.name + "-internal-lights"),
		Core.atlas.find(this.name + "-spinner"),
		Core.atlas.find(this.name + "-spinner-lights"),
		Core.atlas.find(this.name + "-glass"),
		Core.atlas.find(this.name + "-top"),
		Core.atlas.find(this.name + "-top-lights")
	];},
	
	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.productionTime);
	},
	
	update(tile){
		//print(this.consumes.getPower());
		entity = tile.ent();
		
		//var getRot = entity.totalProgress;
		//var getHeat = entity.warmup;
		//var strength = 0;
		
		var powerB = (entity.power.status * this.powerBuffered);
		//var inB = Mathf.clamp(entity.power.status * 10);
		//var inC = Interpolation.pow2.apply(Interpolation.pow2Out.apply(inB));
		
		if(entity.power.status > 0.000001){
			entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.06);
			//strength = (inC * 27.4143135) * entity.warmup;
			//entity.progress = strength;
		}else{
			entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.06);
			//entity.progress = Mathf.lerpDelta(entity.progress, 0, 0.06);
			//strength = entity.progress;
		};
		
		//var strength = (inC * 27.4143135) * entity.warmup;
		var strength = Mathf.log(1.7, powerB + 1) * entity.warmup;
		
		var data = [1 - entity.power.status, Mathf.clamp(entity.power.status * 1000)];
		
		if(powerB > 0.01) Effects.effect(lightTrail, tile.drawx(), tile.drawy(), entity.totalProgress, data);
		
		entity.totalProgress += strength * entity.delta();
		
		
		if(entity.totalProgress > 360) entity.totalProgress -= 360;
		//if(entity.rotation > 360) entity.rotation -= 360;
	},
	
	onDestroyed(tile){
		entity = tile.ent();
		var x = tile.drawx();
		var y = tile.drawy();
		
		Damage.dynamicExplosion(x, y, 0, 2 * 3.5, (entity.power.status * this.powerBuffered) / 120, Vars.tilesize * this.size / 2, Pal.darkFlame);
		if(!tile.floor().solid && !tile.floor().isLiquid){
			RubbleDecal.create(tile.drawx(), tile.drawy(), this.size);
		};
		
		var interp = Interpolation.pow2InInverse.apply(entity.power.status);
		
		if(entity.power.status > 0.00001){
			for(var i = 0; i < 18; i++){
				Bullet.create(shrapnel, entity, Team.derelict, tile.drawx(), tile.drawy(), Mathf.random(360), interp * Mathf.random(0.33, 1.25), Mathf.random(0.75, 1.25));
			}
		}
	},
	
	draw(tile){
		entity = tile.ent();
		
		var getRot = entity.totalProgress;
		
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		var power = Mathf.clamp(1 - entity.power.status);
		
		//print(entity.warmup + "/" + entity.totalProgress + "/" + entity.power.status);
		
		Draw.mixcol(this.emptyLightColor, power);
		Draw.rect(this.lightIntRegion, tile.drawx(), tile.drawy());
		
		Draw.reset();
		Draw.rect(this.spinnerRegion, tile.drawx(), tile.drawy(), getRot);
		
		Draw.mixcol(this.emptyLightColor, power);
		Draw.rect(this.spinnerLightsRegion, tile.drawx(), tile.drawy(), getRot);
		
		Draw.reset();
		Draw.rect(this.glassRegion, tile.drawx(), tile.drawy());
		Draw.rect(this.topBRegion, tile.drawx(), tile.drawy());
		
		Draw.mixcol(this.emptyLightColor, power);
		Draw.rect(this.topLightsRegion, tile.drawx(), tile.drawy());
		Draw.reset();
	}
});

//legacyBat.powerBuffered = 750000;
legacyBat.powerBuffered = 0;
//legacyBat.powerBuffered = legacyBat.consumes.getPower().buffered;
legacyBat.emptyLightColor = Color.valueOf("f8c266");

//legacyBat.entityType = prov(() => new GenericCrafter.GenericCrafterEntity);