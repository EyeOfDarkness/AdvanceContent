const neptune = extendContent(LiquidTurret, "neptune", {
	init(){
		this.createAmmo();
		
		this.super$init();
	},
	
	ammoB(liquid, bullet){
		map = new OrderedMap();
		for(var s = 0; s < liquid.length; s++){
			map.put(liquid[s], bullet[s]);
		};
		
		this.ammo = map;
	},
	
	setStats(){
		//Turret.setStats();
		this.super$setStats();
		
		this.stats.remove(BlockStat.ammo);
		
		const sV = new StatValue({
			display: function(table){
				/*if(Vars.android){
					table.add("unknown error on android, \n it cant be fixed because the crash doesnt create a log that tells me whats the error");
					return;
				};*/
				ammoMap = neptune.ammo;
				//print("sV");
				if(ammoMap == null) return;
				
				table.row();
				
				//var loopAAA = 0;
				for(var t = 0; t < neptune.liquidArrayB.length; t++){
					var type = neptune.bulletArrayB[t];
					var liquid = neptune.liquidArrayB[t];
					//print(type + "/" + liquid);
					if(liquid == null || type == null) continue;
					
					if(!Vars.android){
						table.addImage(this.icon(liquid)).size(3 * 8).padRight(4).right().top();
					}else{
						table.addImage(liquid.icon(Cicon.medium)).size(3 * 8).padRight(4).right().top();
					};
					table.add(liquid.localizedName).padRight(10).left().top();
					//loopAAA++;
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
								
								//bt.add("[stat]" + knbk + "[lightgray] knockback");
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
								
								//this.sep(bt, name);
								
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
		
		this.stats.add(BlockStat.ammo, sV);
	},
	
	createAmmo(){
		var liquidArray = [];
		var bulletArray = [];
		
		for(var i = 0; i < Vars.content.liquids().size; i++){
			var liquid = Vars.content.liquids().get(i);
			if(liquid == null) continue;
			
			var clampMax = 68719476735;
			//var tmpBullet = extend(LiquidBulletType, {});
			var tmpBullet = new LiquidBulletType(liquid);
			tmpBullet.liquid = liquid;
			
			var multiplier = 0.4;
			if(liquid.temperature > 0.5) multiplier = 1;
			
			tmpBullet.lifetime = 94;
			tmpBullet.speed = 5.2;
			tmpBullet.damage = 0.23 + Math.abs((liquid.temperature - 0.5) * multiplier * 6);
			//tmpBullet.damage = Mathf.clamp((liquid.temperature - 0.5) * 4, 0, clampMax);
			tmpBullet.knockback = Mathf.clamp(0.7 - Math.abs((liquid.temperature - 0.5) * 4), 0, 1);
			tmpBullet.drag = Mathf.clamp((liquid.viscosity - 0.5) / 13, 0, 0.05);
			if(liquid.explosiveness > 1.23){
				tmpBullet.splashDamageRadius = Mathf.clamp((liquid.explosiveness - 0.9) * 18, 0, 32);
				tmpBullet.splashDamage = Mathf.clamp((liquid.explosiveness - 0.9) * 10, 0, clampMax / 2);
			};
			
			if(liquid.effect == StatusEffects.none){
				multiplier = 0.5;
				if(liquid.temperature > 0.5) multiplier = 1.1;
				var currentStatus = StatusEffects.none;
				
				tmpBullet.damage = 2 + Math.abs((liquid.temperature - 0.5) * multiplier * 4);
				
				if(liquid.viscosity > 0.76){
					currentStatus = StatusEffects.tarred;
					tmpBullet.statusDuration = (liquid.viscosity - 0.76) * 60;
				};
				
				if(liquid.temperature > 0.85){
					currentStatus = StatusEffects.melting;
					tmpBullet.statusDuration = (liquid.temperature - 0.25) * 60;
				};
				
				if(liquid.temperature < 0.26){
					currentStatus = StatusEffects.freezing;
					tmpBullet.statusDuration = Math.abs((liquid.temperature - 0.5) * 60);
				};
				
				tmpBullet.status = currentStatus;
			};
			this.liquidArrayB[i] = liquid;
			this.bulletArrayB[i] = tmpBullet;
			liquidArray[i] = liquid;
			bulletArray[i] = tmpBullet;
		};
		this.ammoB(liquidArray, bulletArray);
	}
});
neptune.bulletArrayB = [];
neptune.liquidArrayB = [];
neptune.ammo = new ObjectMap();;