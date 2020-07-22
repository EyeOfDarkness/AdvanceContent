const scoreLib = require("itemscorelib");

const omniTurret = extendContent(ItemTurret, "omniturret", {
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
	},
	
	generateIcons(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	ammoB(item, bullet){
		map = new OrderedMap();
		for(var s = 0; s < item.length; s++){
			map.put(item[s], bullet[s]);
		};
		
		this.ammo = map;
	},
	
	setStats(){
		this.super$setStats();
		
		/*this.stats.remove(BlockStat.ammo);
		
		const sV = new StatValue({
			display: function(table){
				ammoMap = omniTurret.ammo;
				if(ammoMap == null) return;
				
				table.row();
				
				for(var t = 0; t < omniTurret.itemArrayB.length; t++){
					var type = omniTurret.bulletArrayB[t];
					var item = omniTurret.itemArrayB[t];
					if(item == null || type == null) continue;
					
					if(!Vars.android){
						table.addImage(this.icon(item)).size(3 * 8).padRight(4).right().top();
					}else{
						table.addImage(item.icon(Cicon.medium)).size(3 * 8).padRight(4).right().top();
					};
					table.add(item.localizedName).padRight(10).left().top();
					table.table(Tex.underline, cons(bt => {
						if(type.damage > 0){
							var dmg = type.damage.toFixed(1);
							bt.add(Core.bundle.format("bullet.damage", dmg.toString()));
							bt.row();
						};
						
						if(type.splashDamage > 0){
							var spDmg = type.splashDamage.toFixed(1);
							if(!Vars.android){
								this.sep(bt, Core.bundle.format("bullet.splashdamage", spDmg.toString(), Strings.fixed(type.splashDamageRadius / Vars.tilesize, 1)));
							}else{
								var spRad = type.splashDamageRadius / Vars.tilesize;
								var spRadFixed = spRad.toFixed(1);
								bt.add(Core.bundle.format("bullet.splashdamage", spDmg.toString(), spRadFixed.toString()));
								bt.row();
							}
						};
						
						if(type.knockback > 0){
							if(!Vars.android){
								this.sep(bt, Core.bundle.format("bullet.knockback", Strings.fixed(type.knockback, 1)));
							}else{
								var knbk = type.knockback.toFixed(1);
								
								bt.add(Core.bundle.format("bullet.knockback", knbk));
								bt.row();
							}
						};
						
						if(type.status != null && type.status != StatusEffects.none){
							if(!Vars.android){
								var statusName = type.status.name.toString();
								var shouldUpperCase = true;
								var newStatusName = "";
								
								if(type.status.name != null){
									for(var b = 0; b < statusName.length; b++){
										tmpLetter = statusName.charAt(b);
										if(shouldUpperCase) tmpLetter = tmpLetter.toUpperCase();
										shouldUpperCase = false;
										if(tmpLetter.indexOf("-") != -1){
											shouldUpperCase = true;
											tmpLetter = " ";
										};
										newStatusName += tmpLetter;
									};
								}else{
									newStatusName = "Unknown Effect";
								};
							
								this.sep(bt, newStatusName);
							}else{
								var nameb = "unknown-effect";
								
								if(type.status.name != null) nameb = type.status.name;
								
								bt.add(nameb.toString());
								bt.row();
							};
						};
					})).left().padTop(-9);
					table.row();
				};
			},
			
			sep: function(table, text){
				table.row();
				table.add(text);
			},
			
			icon: function(t){
				return t.icon(Cicon.medium);
			}
		});
		
		this.stats.add(BlockStat.ammo, sV);*/
	},
	
	generateBullets(){
		var type = scoreLib.scores();
		var keys = type.keys().toArray().toArray();
		var values = type.values().toArray().toArray();
		var bulletTypes = [];
		var items = [];
		for(var p = 0; p < keys.length; p++){
			var itemType = keys[p];
			var itemScore = values[p];
			if(itemType == null || itemScore == null) continue;
			
			var bType = new BasicBulletType(Math.min(6 + (itemScore / 7), 8.5), 15 + (itemScore * 1.84), "bullet");
			bType.lifetime = (this.range / bType.speed) + 2;
			bType.bulletWidth = 11 + Math.min(itemScore / 7.25, 15);
			bType.bulletHeight = 14.75 + Math.min(itemScore / 3.75, 23);
			bType.hitSize = 7 + Math.min(itemScore / 8.5, 15);
			bType.bulletShrink = 0;
			bType.reloadMultiplier = 1 / Math.max(1, itemScore / (17 * Math.max(1, itemScore / 24)));
			if(itemType.radioactivity > 0.6){
				bType.status = StatusEffects.corroded;
				bType.statusDuration = itemScore * 3;
			};
			
			if(itemType.flammability > 0.53){
				bType.status = StatusEffects.burning;
				bType.statusDuration = itemType.flammability * 60;
				bType.backColor = Pal.lightOrange;
				bType.frontColor = Pal.lightishOrange;
				
				if(itemType.flammability > 1.4){
					bType.incendAmount = 1;
					bType.incendChance = (itemType.flammability - 1.4) * 5;
				};
			};
			
			if(itemType.explosiveness > 0.001){
				bType.splashDamage = itemType.explosiveness < 1 ? itemType.explosiveness * 30 : 30 + Math.sqrt((itemType.explosiveness - 1) * 3);
				bType.splashDamageRadius = itemScore < 30 ? itemScore : 30 + Mathf.sqrt((itemScore - 30) * 2);
				
				if(itemType.explosiveness > 0.5){
					bType.backColor = Pal.missileYellowBack;
					bType.frontColor = Pal.missileYellow;
				}
			};
			bulletTypes.push(bType);
			items.push(itemType);
		};
		this.itemArrayB = items;
		this.bulletArrayB = bulletTypes;
		this.ammoB(items, bulletTypes);
	},
	
	init(){
		scoreLib.loadItems();
		
		this.generateBullets();
		
		this.super$init();
	}
});
omniTurret.itemArrayB = [];
omniTurret.bulletArrayB = [];
omniTurret.range = 430;