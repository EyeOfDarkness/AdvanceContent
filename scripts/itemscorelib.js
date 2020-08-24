//Item scoring system, by Eye of Darkness.
const itemScores = new OrderedMap(128);
const liquidScores = new OrderedMap(128);

//const blockLib = require("blockscore");

//Used for item factories.
const scanLayer = 5;

const liquidDivides = 6;
var loaded = false;

const getDefaultScoreLiquid = liquid => {
	var temprC = Math.abs(liquid.temperature - 0.5) * 2;
	var viscC = Math.abs(liquid.viscosity - 0.5) * 2;
		
	return (scoreD = 0.5 + temprC + viscC + Math.max(liquid.explosiveness * 1.2, 0)) / liquidDivides;
};
const getDefaultScoreItem = item => {
	var typeC = item.type == ItemType.resource ? 1 : 1.5;
	var hardnessC = Math.max(item.hardness, 0.5) * 3.5;
		
	return scoreE = item.cost * typeC * hardnessC;
};

const itemsLoad = () => {
	//var tmpScores = new OrderedMap(128);
	var tmpItemArray = [];
	var tmpItemScores = [];
	var tmpItemtypes = [];
	
	var tmpLiquidArray = [];
	var tmpLiquidScoresAC = [];
	var tmpLiquidType = [];
	
	//sets initial values.
	for(var i = 0; i < Vars.content.items().size; i++){
		var item = Vars.content.items().get(i);
		if(item == null) continue;
		var type = item.type == ItemType.resource ? 1 : 1.5;
		var hardness = Math.max(item.hardness, 0.5) * 3.5;
		
		var score = item.cost * type * hardness;
		
		tmpItemArray[i] = item;
		tmpItemScores[i] = score;
		tmpItemtypes[i] = 0;
	};
	for(var c = 0; c < Vars.content.liquids().size; c++){
		var liquid = Vars.content.liquids().get(c);
		if(liquid == null) continue;
		//var type = item.type == ItemType.resource ? 1 : 1.5;
		//var hardness = Math.max(item.hardness, 0.5) * 3.5;
		var tempr = Math.abs(liquid.temperature - 0.5) * 2;
		var visc = Math.abs(liquid.viscosity - 0.5) * 2;
		
		//print(liquid + ":" + tempr + ":" + visc);
		
		var scoreC = (0.5 + tempr + visc + Math.max(liquid.explosiveness * 1.2, 0)) / liquidDivides;
		
		tmpLiquidArray[c] = liquid;
		tmpLiquidScoresAC[c] = scoreC;
		tmpLiquidType[c] = 0;
	};
	//unoptimized, but easy to comprehend. may be inaccurate if theres backward factories.
	for(var j = 0; j < scanLayer; j++){
		blockB:
		for(var i = 0; i < Vars.content.blocks().size; i++){
			//print("1:" + tmpLiquidScoresAC);
			var block = Vars.content.blocks().get(i);
			//if(block == null || (j == scanLayer - 1 && !(block instanceof Floor))) continue blockB;
			if(block == null) continue blockB;
			if(block instanceof GenericCrafter && block.outputItem != null){
				
				//var itemStacks = block.consumes.get(ConsumeType.item);
				//if(itemStacks == null && itemStacks instanceof ConsumeItems) continue blockB;
				tmpScoreA = 0;
				tmpScoreB = 0;
				if(block.consumes.has(ConsumeType.item)){
					if(block.consumes.get(ConsumeType.item) instanceof ConsumeItems){
						var itemStacks = block.consumes.get(ConsumeType.item);
						for(var f = 0; f < itemStacks.items.length; f++){
							//var fMultiplyer = tmpItemtypes[tmpItemArray.indexOf(itemStacks.items[f].item)] == 2 ? 1.5 : 1;
							tmpScoreA += (tmpItemScores[tmpItemArray.indexOf(itemStacks.items[f].item)] * Math.max(itemStacks.items[f].amount, 1));
						};
					}
				};
				if(block.consumes.has(ConsumeType.liquid)){
					if(block.consumes.get(ConsumeType.liquid) instanceof ConsumeLiquid){
						var liquidStacks = block.consumes.get(ConsumeType.liquid);
						//var fMultiplyer = tmpLiquidType[tmpLiquidArray.indexOf(liquidStacks.liquid)] == 2 ? 1.5 : 1;
						
						tmpScoreB += tmpLiquidScoresAC[tmpLiquidArray.indexOf(liquidStacks.liquid)] * liquidStacks.amount;
						//tmpScoreB /= liquidDivides;
					}
				};
				if(tmpItemtypes[tmpItemArray.indexOf(block.outputItem.item)] == 0){
					tmpItemScores[tmpItemArray.indexOf(block.outputItem.item)] = Math.max((tmpScoreA + tmpScoreB) / block.outputItem.amount, getDefaultScoreItem(block.outputItem.item));
					tmpItemtypes[tmpItemArray.indexOf(block.outputItem.item)] = 2;
				};
			};
			if(block instanceof GenericCrafter && block.outputLiquid != null){
				tmpScoreC = 0;
				tmpScoreD = 0;
				var liqconvAmount = 0;
				if(block.consumes.has(ConsumeType.item)){
					if(block.consumes.get(ConsumeType.item) instanceof ConsumeItems){
						var itemStacks = block.consumes.get(ConsumeType.item);
						for(var f = 0; f < itemStacks.items.length; f++){
							//var fMultiplyer = tmpItemtypes[tmpItemArray.indexOf(itemStacks.items[f].item)] == 2 ? 1.5 : 1;
							tmpScoreC += (tmpItemScores[tmpItemArray.indexOf(itemStacks.items[f].item)] * Math.max(itemStacks.items[f].amount, 1));
						};
					}
				};
				if(block.consumes.has(ConsumeType.liquid)){
					if(block.consumes.get(ConsumeType.liquid) instanceof ConsumeLiquid){
						var liquidStacks = block.consumes.get(ConsumeType.liquid);
						//var fMultiplyer = tmpLiquidType[tmpLiquidArray.indexOf(liquidStacks.liquid)] == 2 ? 1.5 : 1;
						
						tmpScoreD += tmpLiquidScoresAC[tmpLiquidArray.indexOf(liquidStacks.liquid)] * liquidStacks.amount;
						//tmpScoreD /= liquidDivides;
						//tmpScoreD += tmpLiquidScoresAC[tmpLiquidArray.indexOf()];
						liqconvAmount = liquidStacks.amount;
					}
				};
				var trueAmount = !(block instanceof LiquidConverter) ? block.outputLiquid.amount : liqconvAmount;
				//trueAmount /= liquidDivides;
				if(tmpLiquidType[tmpLiquidArray.indexOf(block.outputLiquid.liquid)] == 0){
					tmpLiquidScoresAC[tmpLiquidArray.indexOf(block.outputLiquid.liquid)] = Math.max((tmpScoreC + tmpScoreD) / trueAmount, getDefaultScoreLiquid(block.outputLiquid.liquid));
					tmpLiquidType[tmpLiquidArray.indexOf(block.outputLiquid.liquid)] = 2;
				}
			};
			//resets value.
			if(block instanceof Floor){
				if(block.itemDrop != null){
					itemB = block.itemDrop;
					var typeB = itemB.type == ItemType.resource ? 1 : 1.5;
					var hardnessB = Math.max(itemB.hardness, 0.5) * 3.5;
			
					var scoreB = itemB.cost * typeB * hardnessB;
					tmpItemScores[tmpItemArray.indexOf(itemB)] = scoreB;
					tmpItemtypes[tmpItemArray.indexOf(itemB)] = 1;
				};
				if(block.liquidDrop != null){
					var liquidB = block.liquidDrop;
					var temprB = Math.abs(liquidB.temperature - 0.5) * 2;
					var viscB = Math.abs(liquidB.viscosity - 0.5) * 2;
					//temprB = liquid.viscosity > 0.5 ? liquid.viscosity - 0.5 : -(liquid.viscosity - 0.5);
					//viscB = liquid.temperature > 0.5 ? liquid.temperature - 0.5 : -(liquid.temperature - 0.5);
					//temprB *= 2;
					//viscB *= 2;
					
					//print(liquidB + ":" + temprB + ":" + viscB);
					//print(temprB + viscB + Math.max(liquidB.explosiveness, 0));
					
					var scoreC = (0.5 + temprB + viscB + Math.max(liquidB.explosiveness * 1.2, 0)) / liquidDivides;
					
					//print(scoreC);
					
					tmpLiquidScoresAC[tmpLiquidArray.lastIndexOf(liquidB)] = Math.max(scoreC, 0.1);
					tmpLiquidType[tmpLiquidArray.lastIndexOf(liquidB)] = 1;
				};
				//print("1: " + tmpLiquidScoresAC);
			};
			//print("evo:< " + j + " : " + i + " : " + block + " > 2: " + tmpLiquidScoresAC);
			//print(tmpLiquidArray);
		};
	};
	for(var k = 0; k < tmpItemArray.length; k++){
		itemScores.put(tmpItemArray[k], tmpItemScores[k]);
	};
	for(var lm = 0; lm < tmpLiquidArray.length; lm++){
		liquidScores.put(tmpLiquidArray[lm], tmpLiquidScoresAC[lm]);
	};
	//print(itemScores);
	//print(tmpLiquidScoresAC);
	//print(liquidScores);
};

module.exports = {
	loadItems(){
		if(loaded) return;
		itemsLoad();
		//blockLib.loadB();
		loaded = true;
	},
	
	getLiquidDiv(){
		return liquidDivides;
	},
	
	liquidScores(){
		return liquidScores;
	},
	
	scores(){
		return itemScores;
	}
};