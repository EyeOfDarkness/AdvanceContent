const fissionB = extendContent(GenericSmelter, "fission-mkii", {	
	load(){
		this.super$load();
		//this.region = Core.atlas.find(this.name);
		this.spinnerRegion = Core.atlas.find(this.name + "-spinner");
	},
	
	generateIcons(){
	return [
		Core.atlas.find(this.name),
		Core.atlas.find(this.name + "-spinner")
	];},
	
	playerPlaced(tile){
		if(this.lastItem != null){
			Core.app.post(run(() => tile.configure(this.lastItem.id)));
		}
	},
	
	setStats(){
		this.super$setStats();
		
		var craftTimeB = 165;
		if(this.craftTime != null) craftTimeB = this.craftTime;
		var numberA = (craftTimeB * (1 / 1.7)) / 60;
		var numberB = (craftTimeB * (1 / 0.3)) / 60;
		
		this.stats.remove(BlockStat.productionTime);
		this.stats.add(BlockStat.productionTime, "{0}-{1}/s", numberA.toFixed(1), numberB.toFixed(1));
		
		this.stats.add(BlockStat.output, "{0}, {1}, {2}, {3}, {4}, {5}",
		"Copper",
		"Lead",
		"Titanium",
		"Silicon",
		"Chromium",
		"Lanthanum");
	},
	
	/*statMultiplier(num){
		var arrayc = [0.8, 0.3, 1.1, 1.7, 0.9, 0.4];
		
		return (this.craftTime * (1 / arrayc[num])) / 60;
	},*/
	
	outputsItems(){
		return true;
	},
	
	shouldConsume(tile){
		entity = tile.ent();
		
        if(entity.getItemStack() != null && entity.items.get(entity.getItemStack().item) >= this.itemCapacity){
            return false;
        };
        return true;
    },
	
	setBars(){
		this.super$setBars();
		
		if(this.hasItems && this.configurable){
			this.bars.remove("items");
			this.bars.add("items", new Func({
				get: function(entity){
					return new Bar(prov(() => Core.bundle.format("bar.items", (entity != null && entity.getItemStack() != null) ? entity.items.get(entity.getItemStack().item) : 0)), prov(() => Pal.powerBar), new Floatp({get: function(){
							if(entity != null && entity.getItemStack() != null){
								var items = entity.items.get(entity.getItemStack().item);
								var sssss = items / fissionB.itemCapacity;
								
								return sssss.toFixed(6);
							};
							return 0;
						}
					}));
				}
			}));
		};
	},
	
	draw(tile){
		entity = tile.ent();
		
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		if(entity.warmup > 0){
			//const tmpColor = new Color();
			//const g = 0.06;
			//const r = 0.04;
			var cr = Mathf.random(0.13);
			//var alphaRandom = ((1.0 - g) + Mathf.absin(Time.time(), 8.0, g) + Mathf.random(r) - r) * entity.warmup

			//Draw.alpha(((1.0 - g) + Mathf.absin(Time.time(), 8.0, g) + Mathf.random(r) - r) * entity.warmup);

			//Draw.tint(this.flameColor);
			//Draw.blend(Blending.additive);
			//Draw.color(Color.valueOf("f3e97900"), Color.valueOf("f3e979ff"), alphaRandom);
			Draw.color(Color.valueOf("fad138"));
			Fill.circle(tile.drawx(), tile.drawy(), (7.9 + Mathf.absin(Time.time(), 5.0, 1.2) + cr) * entity.warmup);
			Draw.color(Color.valueOf("ffffff"));
			//Draw.color(Color.valueOf("f3e97900"), Color.valueOf("ffffffff"), entity.warmup);
			Fill.circle(tile.drawx(), tile.drawy(), (6.4 + Mathf.absin(Time.time(), 5.0, 0.73) + cr) * entity.warmup);
			//Draw.blend();
			//Draw.color();
		};
		Draw.color();
		Draw.rect(this.spinnerRegion, tile.drawx(), tile.drawy(), entity.totalProgress * 1.6);
	},
	
	getMultiplier(entity){
		if(entity.getSequence() == 0) return 1;
		if(entity.getSequence() == 1) return 1 / 0.8;
		if(entity.getSequence() == 2) return 1 / 0.3;
		if(entity.getSequence() == 3) return 1 / 1.1;
		if(entity.getSequence() == 4) return 1 / 1.7;
		if(entity.getSequence() == 5) return 1 / 0.9;
		if(entity.getSequence() == 6) return 1 / 0.4;
	},
	
	getProgressIncrease(entity, baseTime){
		if(entity.getSequence() == 0) return 0;
		return 1 / baseTime * entity.block.getMultiplier(entity) * entity.delta() * entity.efficiency();
	},
	
	buildConfiguration(tile, table){
		entity = tile.ent();
		const chromium = Vars.content.getByName(ContentType.item, "advancecontent-chromium");
		const lanthanum = Vars.content.getByName(ContentType.item, "advancecontent-lanthanum");
		var array = [Items.copper, Items.lead, Items.titanium, Items.silicon, chromium, lanthanum];
		var arcArray = new Packages.arc.struct.Array(array);
		var stack = entity.getItemStack() == null ? null : entity.getItemStack().item;
		
		ItemSelection.buildTable(table, arcArray, prov(() => stack), cons(item => {
			this.lastItem = item;
			tile.configure(item == null ? -1 : item.id);
		}));
	},
	
	configured(tile, player, value){
		entity = tile.ent();
		
		entity.progress = 0;
		
		if(value != -1){
			entity.setSequence(this.getItemSequence(value));
			var items = new ItemStack(Vars.content.item(value), this.getItemAmount(this.getItemSequence(value)));
			entity.setItemStack(items);
		}else{
			entity.setSequence(0);
			entity.setItemStack(null);
		}
	},
	
	getItemAmount(value){
		var arrayb = [1, 3, 1, 5, 8, 4, 1];
		
		return arrayb[value];
		/*var itemV = Vars.content.item(value);
		const chromium = Vars.content.getByName(ContentType.item, "advancecontent-chromium");
		const lanthanum = Vars.content.getByName(ContentType.item, "advancecontent-lanthanum");
		
		if(itemV == Items.copper) return 3;
		if(itemV == Items.lead) return 1;
		if(itemV == Items.titanium) return 5;
		if(itemV == Items.silicon) return 8;
		if(itemV == chromium) return 4;
		if(itemV == lanthanum) return 1;*/
	},
	
	getItemSequence(value){
		var itemV = Vars.content.item(value);
		const chromium = Vars.content.getByName(ContentType.item, "advancecontent-chromium");
		const lanthanum = Vars.content.getByName(ContentType.item, "advancecontent-lanthanum");
		
		if(itemV == Items.copper) return 1;
		if(itemV == Items.lead) return 2;
		if(itemV == Items.titanium) return 3;
		if(itemV == Items.silicon) return 4;
		if(itemV == chromium) return 5;
		if(itemV == lanthanum) return 6;
		return 0;
	},
	
	customTryDump(tile){
		const chromium = Vars.content.getByName(ContentType.item, "advancecontent-chromium");
		const lanthanum = Vars.content.getByName(ContentType.item, "advancecontent-lanthanum");
		var arrayd = [Items.copper, Items.lead, Items.titanium, Items.silicon, chromium, lanthanum];
		
		for(var i = 0; i < arrayd.length; i++){
			this.tryDump(tile, arrayd[i]);
		}
	},
	
	update(tile){
		entity = tile.ent();

		if(entity.cons.valid() && entity.getSequence() != 0){

			entity.progress += this.getProgressIncrease(entity, this.craftTime);
			entity.totalProgress += entity.delta() * entity.warmup;
			entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);

			if(Mathf.chance(Time.delta() * this.updateEffectChance)){
				Effects.effect(this.updateEffect, entity.x + Mathf.range(this.size * Vars.tilesize / 2), entity.y + Mathf.range(this.size * Vars.tilesize / 2));
			}
		}else{
			entity.warmup = Mathf.lerp(entity.warmup, 0, 0.02);
			entity.totalProgress += entity.delta() * entity.warmup;
		};
		
		if(entity.progress >= 1){
			entity.cons.trigger();

			if(entity.getItemStack() != null){
				this.useContent(tile, entity.getItemStack().item);
				for(var i = 0; i < entity.getItemStack().amount; i++){
					this.offloadNear(tile, entity.getItemStack().item);
				}
			};

			Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
			entity.progress = 0;
        };
		
		if(entity.timer.get(this.timerDump, this.dumpTime)){
			//this.tryDump(tile, entity.getItemStack().item);
			//this.tryDump(tile);
			this.customTryDump(tile);
		}
	}
});
fissionB.updateEffect = Fx.fuelburn;
fissionB.craftEffect = Fx.smeltsmoke;
fissionB.configurable = true;
fissionB.lastItem = null;
fissionB.entityType = prov(() => {
	entityB = extend(GenericCrafter.GenericCrafterEntity, {
		getSequence(){
			return this._sequence;
		},
		
		setSequence(a){
			this._sequence = a
		},
		
		getItemStack(){
			return this._outputStack;
		},
		
		setItemStack(a){
			this._outputStack = a;
		},
		
		config(){
			return this._outputStack == null ? -1 : this._outputStack.item.id;
		},
		
		write(stream){
			this.super$write(stream);
			//stream.writeByte(this._sequence);
			stream.writeShort(this.getItemStack() == null ? -1 : this.getItemStack().item.id);
		},
		
		read(stream, revision){
			this.super$read(stream, revision);
			//this._sequence = stream.readByte();
			
			var itemId = stream.readShort();
			
			if(itemId != -1){
				this._outputStack = new ItemStack(Vars.content.item(itemId), this.block.getItemAmount(this.block.getItemSequence(itemId)));
				this._sequence = this.block.getItemSequence(itemId);
			}else{
				this._outputStack = null;
				this._sequence = 0;
			};
		}
	});
	entityB.setSequence(0);
	entityB.setItemStack(null);
	
	return entityB;
});