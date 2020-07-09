const tempVecF = new Vec2();
const tempVecG = new Vec2();
const tempVecH = new Vec2();
//var legLength = 32;
var legLength = 27;

const disintegratorBullet = new BasicBulletType(8.5, 67, "bullet");
disintegratorBullet.lifetime = 42;
disintegratorBullet.bulletWidth = 16;
disintegratorBullet.bulletHeight = 23;
disintegratorBullet.shootEffect = Fx.shootBig;
disintegratorBullet.splashDamage = 29;
disintegratorBullet.splashDamageRadius = 23;

const disintegratorWeapon = extendContent(Weapon, "disintegration", {
	load(){
		this.region = Core.atlas.find("advancecontent-disintegration");
	}
});

disintegratorWeapon.reload = 50;
disintegratorWeapon.alternate = true;
disintegratorWeapon.spacing = 0;
disintegratorWeapon.shots = 4;
disintegratorWeapon.shotDelay = 4;
disintegratorWeapon.length = 27;
disintegratorWeapon.width = 30;
disintegratorWeapon.ignoreRotation = false;
disintegratorWeapon.bullet = disintegratorBullet;
disintegratorWeapon.shootSound = Sounds.artillery;

const disintegratorMain = prov(() => {
	disintegratorMainB = extend(GroundUnit, {
		setLegOffset(){
			var tmpArray = [];
			
			for(var s = 0; s < 4; s++){
				tmpArray[s] = new Vec2();
			};
			
			this._legs = tmpArray;
		},
		
		setLegs(){
			this._femurAngleProgress = [0, 0, 0, 0];
			this._tibiaAngleProgress = [0, 0, 0, 0];
			this._tibiaLengthProgress = [1, 1, 1, 1];
			this._lastProgress = [0, 0];
		},
		
		getLastProgress(){
			return this._lastProgress;
		},
		
		getFemurAProgress(){
			return this._femurAngleProgress;
		},
		
		getTibiaAProgress(){
			return this._tibiaAngleProgress;
		},
		
		getTibiaLProgress(){
			return this._tibiaLengthProgress;
		},
		
		getLegOffset(){
			return this._legs;
		},
		
		added(){
			this.super$added();
			
			var distance = 120;
			var walkDistance = 150;
			var distanceMargin = walkDistance * 2;
			
			for(var b = 0; b < 2; b++){
				var sign = Mathf.signs[b];
				var progress = (this.walkTime + ((distance / 2) * b)) % distance;
				var legOff1 = this.getLegOffset()[b].dst2(this.x, this.y) > distanceMargin * distanceMargin;
				var legOff2 = this.getLegOffset()[b + 2].dst2(this.x, this.y) > distanceMargin * distanceMargin;
				if(progress < this.getLastProgress()[b] || legOff1 || legOff2){
					this.getLegOffset()[b].trns(this.baseRotation, -walkDistance / 5, sign * 65).add(this.x, this.y);
					this.getLegOffset()[b + 2].trns(this.baseRotation, walkDistance / 1.5, -sign * 70).add(this.x, this.y);
				};
			}
		},
		
		update(){
			this.super$update();
			
			var type = this.type;
			
			var distance = 120;
			var walkDistance = 150;
			var distanceMargin = walkDistance * 2;
			
			for(var b = 0; b < 2; b++){
				var sign = Mathf.signs[b];
				var progress = (this.walkTime + ((distance / 2) * b)) % distance;
				var legOff1 = this.getLegOffset()[b].dst2(this.x, this.y) > distanceMargin * distanceMargin;
				var legOff2 = this.getLegOffset()[b + 2].dst2(this.x, this.y) > distanceMargin * distanceMargin;
				if(progress < this.getLastProgress()[b] || legOff1 || legOff2){
					this.getLegOffset()[b].trns(this.baseRotation, -walkDistance / 5, sign * 65).add(this.x, this.y);
					this.getLegOffset()[b + 2].trns(this.baseRotation, walkDistance / 1.5, -sign * 70).add(this.x, this.y);
				};
				this.getLastProgress()[b] = progress;
				
				for(var n = 0; n < 2; n++){
					var r = (b * 2) + n;
					
					var offset = this.getLegOffset()[r];
					
					var effeciency = (this.stuckTime / 2) + 1;

					tempVecH.trns(this.baseRotation + 90, 21 * Mathf.signs[(n + b) % 2], sign * -9);
					
					this.getFemurAProgress()[r] = Mathf.slerpDelta(this.getFemurAProgress()[r], Angles.angle(this.x + tempVecH.x, this.y + tempVecH.y, offset.x, offset.y), 0.032 / effeciency);
					
					tempVecF.trns(this.getFemurAProgress()[r], legLength).add(tempVecH.x, tempVecH.y);
					
					this.getTibiaAProgress()[r] = Mathf.slerpDelta(this.getTibiaAProgress()[r], Angles.angle(this.x + tempVecF.x, this.y + tempVecF.y, offset.x, offset.y), 0.093 / effeciency);
					this.getTibiaLProgress()[r] = Mathf.lerpDelta(this.getTibiaLProgress()[r], Mathf.dst(this.x + tempVecF.x, this.y + tempVecF.y, offset.x, offset.y), 0.093 / effeciency);
					//tempVecG.trns(this.getTibiaAProgress()[r], this.getTibiaLProgress()[r]).add(tempVecF.x, tempVecF.y);
				}
			}
		},
		
		draw(){
			Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
			
			floor = this.getFloorOn();
			
			if(floor.isLiquid){
				Draw.color(Color.white, floor.color, 0.5);
			};
			
			this.drawLegs();
			
			if(floor.isLiquid){
				Draw.color(Color.white, floor.color, this.drownTime * 0.4);
			}else{
				Draw.color(Color.white);
			};
			
			Draw.rect(this.type.baseRegion, this.x, this.y, this.baseRotation - 90);
			
			Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
			
			this.drawWeapons();
			
			Draw.mixcol();
		},
		
		drawWeapons(){
			for(var v = 0; v < 2; v++){
				var i = Mathf.signs[v];
				
				var tra = this.rotation - 90;
				var trY = -this.type.weapon.getRecoil(this, i > 0) + this.type.weaponOffsetY;
				var w = -i * this.type.weapon.region.getWidth() * Draw.scl;
				Draw.rect(this.type.weapon.region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * i, trY),
				this.y + Angles.trnsy(tra, this.getWeapon().width * i, trY), w, this.type.weapon.region.getHeight() * Draw.scl, this.rotation - 90);
			}
		},
		
		drawLegs(){
			var type = this.type;
			
			var stateb = Vars.state.is(GameState.State.menu) || Vars.state.isPaused();
			
			var distance = 100;
			var walkDistance = 150;
			var distanceMargin = walkDistance * 2;
			
			for(var b = 0; b < 2; b++){
				var sign = Mathf.signs[b];
				
				for(var n = 0; n < 2; n++){
					var r = (b * 2) + n;
					
					var offset = this.getLegOffset()[r];

					tempVecH.trns(this.baseRotation + 90, 21 * Mathf.signs[(n + b) % 2], sign * -9);
					
					tempVecF.trns(this.getFemurAProgress()[r], legLength).add(tempVecH.x, tempVecH.y);
					
					tempVecG.trns(this.getTibiaAProgress()[r], this.getTibiaLProgress()[r]).add(tempVecF.x, tempVecF.y);
					
					Draw.rect(type.foot(), this.x + tempVecG.x, this.y + tempVecG.y, Angles.angle(this.x, this.y, this.x + tempVecG.x, this.y + tempVecG.y) - 90);
					
					var tibiaAngle = Angles.angle(this.x + tempVecF.x, this.y + tempVecF.y, this.x + tempVecG.x, this.y + tempVecG.y);
					
					var reg = type.tibia();
					
					Draw.rect(reg, this.x + tempVecF.x, this.y + tempVecF.y, reg.getWidth() * Draw.scl, ((this.getTibiaLProgress()[r] * 8) + 4) * Draw.scl, tibiaAngle - 90);
					
					reg = type.femur();
					
					Draw.rect(reg, this.x + tempVecH.x, this.y + tempVecH.y, Angles.angle(tempVecH.x, tempVecH.y, tempVecF.x, tempVecF.y) - 90);
					
					reg = type.knee();
					
					Draw.rect(reg, this.x + tempVecF.x, this.y + tempVecF.y, tibiaAngle - 90);
				}
			}
		}
	});
	disintegratorMainB.setLegs();
	disintegratorMainB.setLegOffset();
	return disintegratorMainB;
});

const disintegratorUnit = extendContent(UnitType, "disintegrator", {
	load(){
		this.super$load();
		
		this.legRegionA = Core.atlas.find(this.name + "-leg-1");
		this.legRegionB = Core.atlas.find(this.name + "-leg-2");
		this.footRegion = Core.atlas.find(this.name + "-foot");
		this.kneeRegion = Core.atlas.find(this.name + "-knee");
	},
	
	foot(){
		return this.footRegion;
	},
	
	knee(){
		return this.kneeRegion;
	},
	
	femur(){
		return this.legRegionA;
	},
	
	tibia(){
		return this.legRegionB;
	}
});

disintegratorUnit.localizedName = "Disintegrator";
disintegratorUnit.create(disintegratorMain);
//disintegratorUnit.description = "";
disintegratorUnit.weapon = disintegratorWeapon;
disintegratorUnit.engineSize = 0;
disintegratorUnit.engineOffset = 0;
disintegratorUnit.flying = false;
disintegratorUnit.health = 19000;
//disintegratorUnit.health = 3000;
disintegratorUnit.mass = 10;
disintegratorUnit.hitsize = 45;
disintegratorUnit.speed = 0.29;
disintegratorUnit.drag = 0.4;
disintegratorUnit.range = 180;
disintegratorUnit.maxVelocity = 1.1;
disintegratorUnit.shootCone = 16;
disintegratorUnit.rotatespeed = 0.1;
disintegratorUnit.baseRotateSpeed = 0.00001;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = disintegratorUnit;*/