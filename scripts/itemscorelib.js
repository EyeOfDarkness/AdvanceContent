//Item scoring system, by Eye of Darkness.
const itemScores = new OrderedMap(128);
//Used for item factories.
const scanLayer = 5;
var loaded = false;

const itemsLoad = () => {
	//var tmpScores = new OrderedMap(128);
	var tmpItemArray = [];
	var tmpItemScores = [];
	
	//sets initial values.
	for(var i = 0; i < Vars.content.items().size; i++){
		var item = Vars.content.items().get(i);
		if(item == null) continue;
		var type = item.type == ItemType.resource ? 1 : 1.5;
		var hardness = Math.max(item.hardness, 0.5) * 3.5;
		
		var score = item.cost * type * hardness;
		
		tmpItemArray[i] = item;
		tmpItemScores[i] = score;
	};
	//unoptimized, but easy to comprehend. may be inaccurate if theres backward factories.
	for(var j = 0; j < scanLayer; j++){
		blockB:
		for(var i = 0; i < Vars.content.blocks().size; i++){
			var block = Vars.content.blocks().get(i);
			if(block == null) continue blockB;
			if(block instanceof GenericCrafter && block.outputItem != null && block.consumes.has(ConsumeType.item)){
				
				var itemStacks = block.consumes.get(ConsumeType.item);
				if(itemStacks == null && itemStacks instanceof ConsumeItems) continue blockB;
				tmpScoreA = 0;
				for(var f = 0; f < itemStacks.items.length; f++){
					tmpScoreA += (tmpItemScores[tmpItemArray.indexOf(itemStacks.items[f].item)] * Math.max(itemStacks.items[f].amount, 1)) / block.outputItem.amount;
				};
				tmpItemScores[tmpItemArray.indexOf(block.outputItem.item)] = tmpScoreA;
			};
			//resets value.
			if(block instanceof Floor && block.itemDrop != null){
				itemB = block.itemDrop;
				var typeB = itemB.type == ItemType.resource ? 1 : 1.5;
				var hardnessB = Math.max(itemB.hardness, 0.5) * 3.5;
		
				var scoreB = itemB.cost * typeB * hardnessB;
				tmpItemScores[tmpItemArray.indexOf(itemB)] = scoreB;
			};
		}
	};
	for(var k = 0; k < tmpItemArray.length; k++){
		itemScores.put(tmpItemArray[k], tmpItemScores[k]);
	};
};

module.exports = {
	loadItems(){
		if(loaded) return;
		itemsLoad();
		loaded = true;
	},
	
	scores(){
		return itemScores;
	}
};