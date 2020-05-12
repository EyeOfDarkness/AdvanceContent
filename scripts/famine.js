const famineBullet = extend(BasicBulletType, {
	update(b){
		//const minusRange = (this.rectRangeTile * Vars.tilesize) / 2;
		
		//var target = null;
		//var cdist = 0;
		
		if(b.timer.get(1, 15)){
			this.scanTiles(b);
		};
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.missileYellowBack, b.x, b.y, 2);
		};
		
		if(b.getData() != null && b.getData() instanceof Position){
			b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(b.getData()), 0.1));
			if(this.isOnTile(b)){
				b.time(this.lifetime);
			}
		}else{
			target = Units.closestTarget(b.getTeam(), b.x, b.y, this.homingRange, boolf(e => !e.isFlying() || this.collidesAir));
			
			if(target != null){
				b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(target), 0.1));
				
				if(this.isOnTileAlt(b)){
					b.time(this.lifetime);
				}
			};
			
			/*if(this.isOnTileAlt(b)){
				b.time(this.lifetime);
			}*/
		}
	},
	
	isOnTile(b){
		var tile = Vars.world.ltileWorld(b.x, b.y);
		if(tile != null && tile.block() != null){
			var g = tile.block().group;
			var criteria = g == BlockGroup.transportation || g == BlockGroup.power || g == BlockGroup.liquids || g == BlockGroup.drills;
			
			//return b.getTeam() != tile.getTeam() && tile.block().group == BlockGroup.transportation;
			return b.getTeam() != tile.getTeam() && criteria;
		};
		return false;
	},
	
	isOnTileAlt(b){
		var tile = Vars.world.ltileWorld(b.x, b.y);
		if(tile != null){
			return b.getTeam() != tile.getTeam() && tile.block() != null && !(tile.block() instanceof StaticWall) && tile.ent() != null;
		};
		return false;
	},
	
	scanTiles(b){
		const minusRange = (this.rectRangeTile * Vars.tilesize) / 2;
		
		var target = null;
		var cdist = 0;
		
		scan:
		for(var x = 0; x < this.rectRangeTile; x++){
			yscan:
			for(var y = 0; y < this.rectRangeTile; y++){
				var tile = Vars.world.ltileWorld(((x * Vars.tilesize) - minusRange) + b.x, ((y * Vars.tilesize) - minusRange) + b.y);
				
				if(tile != null){
					var xb = tile.x * Vars.tilesize;
					var yb = tile.y * Vars.tilesize;
					
					if(!Mathf.within(b.x, b.y, tile.drawx(), tile.drawy(), this.rectRangeTile * Vars.tilesize / 2)){
						//Effects.effect(invalid, xb, yb);
						continue yscan;
					};
					
					//Effects.effect(valid, xb, yb);
					if(tile.ent() != null && tile.block() != null){
						var g = tile.block().group;
						var criteria = g == BlockGroup.transportation || g == BlockGroup.power || g == BlockGroup.liquids || g == BlockGroup.drills;
						
						if(b.getTeam() != tile.getTeam() && criteria){
							
							dst2 = Mathf.dst2(tile.drawx(), tile.drawy(), b.x, b.y);
							
							if(target == null || dst2 < cdist){
								target = tile;
								cdist = dst2;
							};
							
							//print("aaaa");
							
							//Effects.effect(validB, xb, yb);
							//scannedTiles[sequence] = tile.ent().getID();
							//sequence++;
						};
					}
				}
			}
		};
		
		b.setData(target);
		
		//print(b.getData());
	}
});

famineBullet.speed = 4.6;
famineBullet.lifetime = 56;
famineBullet.damage = 3;
famineBullet.homingRange = 50;
//warning, increasing rectRangeTile may cause lag.
famineBullet.rectRangeTile = 24;
famineBullet.splashDamageRadius = 15;
famineBullet.splashDamage = 11;
famineBullet.bulletSprite = "missile";
famineBullet.pierce = false;
famineBullet.collidesTiles = false;
famineBullet.collidesAir = true;
famineBullet.collides = true;
famineBullet.bulletWidth = 9;
famineBullet.bulletHeight = 11;
famineBullet.bulletShrink = 0;
famineBullet.backColor = Pal.missileYellowBack;
famineBullet.frontColor = Pal.missileYellow;

const famineWeap = extendContent(Weapon, "famine-equip", {});

famineWeap.reload = 43;
famineWeap.alternate = true;
famineWeap.length = 6;
famineWeap.width = 33;
famineWeap.ignoreRotation = false;
famineWeap.bullet = famineBullet;
famineWeap.inaccuracy = 15;
famineWeap.shots = 13;
famineWeap.spacing = 1;
famineWeap.shotDelay = 2;
famineWeap.shootSound = Sounds.artillery;

const famineBase = prov(() => new JavaAdapter(HoverUnit, {}));

const famine = extendContent(UnitType, "famine", {});

famine.localizedName = "Famine";
famine.create(famineBase);
famine.weapon = famineWeap;
famine.engineSize = 7.8;
famine.engineOffset = 32;
famine.flying = true;
famine.health = 9400;
famine.mass = 30;
famine.hitsize = 47;
famine.speed = 0.011;
famine.drag = 0.02;
famine.attackLength = 120;
famine.range = 190;
famine.maxVelocity = 0.78;
famine.shootCone = 40;
famine.rotatespeed = 0.01;
famine.baseRotateSpeed = 0.04;