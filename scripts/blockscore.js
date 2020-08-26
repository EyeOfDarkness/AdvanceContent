//Block Scoring System by Eye of Darkness, used to tell if something is OP or not.
//the more mods the longer this loads.
//blockScore > 1 = OP, blockScore < 0.1 = under powered.

const scoreLib = require("itemscorelib");

var itemScoresAC = scoreLib.scores();
var liquidScoresAC = scoreLib.liquidScores();

const opBlocks = new OrderedMap(512);
const powerBlockScores = new OrderedMap(128);
const turretScores = new OrderedMap(256);
const menderScores = new OrderedMap(64);
const overdriveScrores = new OrderedMap(64);
const wallScores = new OrderedMap(128);

const divideExt = (value, divider) => {
	return (value / divider) + (1 - (1 / divider));
};

const getRequirements = (block, useVariance) => {
	var requirements = 0;
	//var variance = (useVariance && block.requirements.length != 0) ? Math.max(0, (block.requirements.length - 1) * (block.requirements[0].amount * itemScoresAC.get(block.requirements[0].item))) : 0;
	var variance = 0;
	
	for(var i = 0; i < block.requirements.length; i++){
		requirements += itemScoresAC.get(block.requirements[i].item) * block.requirements[i].amount;
		variance += block.requirements[i].amount;
	};
	if(block.requirements.length != 0) variance /= block.requirements.length;
	variance /= 3;
	variance = Math.min(variance, 800);
	var varianceB = (useVariance && block.requirements.length != 0) ? Math.max(0, (block.requirements.length - 1) * variance) : 0;
	//print(block + " : " + block.requirements.length + " : " + requirements);
	
	return Math.max(requirements + varianceB, 0.1);
};

const getConsumesItems = block => {
	if(!block.consumes.has(ConsumeType.item)) return 0;
	var tmp = 0;
	var items = block.consumes.get(ConsumeType.item);
	if(items instanceof ConsumeItems){
		for(var i = 0; i < items.items.length; i++){
			tmp += itemScoresAC.get(items.items[i].item) * items.items[i].amount;
		}
	};
	if(items instanceof ConsumeItemFilter){
		Vars.content.items().each(cons(it => {
			if(items.filter.get(it)) tmp = Math.max(tmp, itemScoresAC.get(it));
		}));
	};
	return tmp;
};
const getConsumesPower = block => {
	if(!block.consumes.has(ConsumeType.power)) return 0;
	return block.consumes.get(ConsumeType.power).usage * 60;
};
const getConsumesLiquid = block => {
	if(!block.consumes.has(ConsumeType.liquid)) return 0;
	var tmp = 0;
	var liquid = block.consumes.get(ConsumeType.liquid);
	
	if(liquid instanceof ConsumeLiquid){
		tmp = (liquidScoresAC.get(liquid.liquid) * liquid.amount) / scoreLib.getLiquidDiv();
	};
	if(liquid instanceof ConsumeLiquidFilter){
		Vars.content.liquids().each(cons(lq => {
			if(liquid.filter.get(lq)) tmp = Math.max(tmp, (liquidScoresAC.get(lq) * liquid.amount) / scoreLib.getLiquidDiv());
		}));
	};
	return tmp;
};

const div = 3;

const handlePower = block => {
	var requirements = getRequirements(block, true);
	var power = 2;
	var printType = "";
	var itemPower = getConsumesItems(block);
	var liquidPower = getConsumesLiquid(block);
	var consumeTime = 1;
	var powerProd = block.powerProduction * 40;
	//var div = 3;
	var sizeDiff = (block.size / div) + (1 - (1 / div));
	
	requirements /= 16;
	
	if(block instanceof PowerGenerator){
		//power = (block.powerProduction / block.size) / requirements;
		if(block instanceof ImpactReactor || block instanceof ItemLiquidGenerator || block instanceof NuclearReactor) consumeTime = block.itemDuration / 60;
		power = Mathf.clamp(((powerProd / sizeDiff) / (((itemPower / consumeTime) + liquidPower) * 2)) / requirements, 0, 32767);
		printType = "PowerGenerator:";
	};
	if(block instanceof SolarGenerator){
		power = Mathf.clamp(((powerProd / sizeDiff) * 3.4) / requirements, 0, 32767);
		printType = "SolarGenerator:";
	};
	if(block instanceof ThermalGenerator){
		power = Mathf.clamp((powerProd / sizeDiff) / requirements, 0, 32767);
		printType = "ThermalGenerator:";
	};
	
	powerBlockScores.put(block, power);
	if(power >= 1) opBlocks.put(block, power);
	
	//print(printType + " " + block.localizedName + " || Score: " + power);
};
const handleMenders = block => {
	var requirements = getRequirements(block, true);
	requirements /= 1.5;
	var itemPower = getConsumesItems(block);
	var powerPower = getConsumesPower(block);
	var powS = requirements + powerPower;
	//var range = divideExt(block.range + block.phaseRangeBoost, 30);
	var range = block.range + block.phaseRangeBoost;
	var sizeDiff = divideExt(block.size, 4);
	var trueRange = divideExt(range * range, requirements / (80 * sizeDiff));
	var phase = (block.phaseBoost * divideExt(block.useTime, 60)) / itemPower;
	var reload = (block.reload / 60) * 2;
	var healStrength = ((block.healPercent + phase) / reload) * trueRange;
	//var reload = block.reload / 60;
	//var power = ((requirements - (requirements * ((block.healPercent + block.phaseBoost) / 100))) * 3) / requirements;
	var power = ((healStrength * powS * 2) / (powS * sizeDiff)) / 8500;
	
	menderScores.put(block, power);
	if(power >= 1) opBlocks.put(block, power);
	
	//print("MendProjector: " + block.localizedName + " || Score: " + power);
};
const handleOverdrives = block => {
	var requirements = getRequirements(block, false);
	requirements /= 1.5;
	var itemPower = getConsumesItems(block);
	var powerPower = getConsumesPower(block);
	var powS = requirements + powerPower;
	var sizeDiff = divideExt(block.size, 4);
	var range = block.range + block.phaseRangeBoost;
	var trueRange = divideExt(range * range, requirements / (80 * sizeDiff));
	//var phase = (block.speedBoostPhase * ((block.useTime / 60) + (1 - (1 / 60)))) / itemPower;
	var phase = (block.speedBoostPhase * divideExt(block.useTime, 60)) / itemPower;
	var reload = (block.reload / 60) * 2;
	var healStrength = ((block.speedBoost + phase) / reload) * trueRange;
	//var power = ((((block.speedBoost + phase) / 1.5) * powS) * trueRange) / (powS * sizeDiff);
	var power = ((healStrength * powS * 2) / (powS * sizeDiff)) / 600;
	
	overdriveScrores.put(block, power);
	if(power >= 1) opBlocks.put(block, power);
	
	//print("OverdriveProjector: " + block.localizedName + " || Score: " + power);
};

/*const handleWalls = block => {
	var requirements = getRequirements(block, true);
	requirements *= 10;
	
	power = block.health / requirements;
	if(block.buildVisibility == BuildVisibility.sandboxOnly || block.buildVisibility == BuildVisibility.hidden) power = 0;
	
	print(requirements);
	print("Wall: " + block.localizedName + " || Score: " + power);
};*/

/*const boolB = block => {
	return block instanceof BlockPart || block instanceof StaticWall || block instanceof Floor || block instanceof Rock || block instanceof TreeBlock;
};*/

const loadBlocks = () => {
	//scoreLib.loadItems();
	
	Vars.content.blocks().each(cons(block => {
		//print(block);
		if(block != null && block.update){
			if(block instanceof PowerGenerator || block instanceof PowerSource){
				handlePower(block);
			};
			if(block instanceof MendProjector){
				handleMenders(block);
			};
			if(block instanceof OverdriveProjector){
				handleOverdrives(block);
			};
			/*if(block instanceof Wall){
				handleWalls(block);
			}*/
		}
	}));
};

var loaded = false;

module.exports = {
	loadB(){
		if(loaded) return;
		//print("Block: loaded");
		loadBlocks();
		loaded = true;
	},
	getOpBlocks(){
		return opBlocks;
	},
	powerScore(){
		return powerBlockScores;
	}
}