const elib = require("effectlib");
const lib = require("funclib");

const tempVec = new Vec2();
const tempVec2 = new Vec2();

const ravagerResistance = 0.06;

/*const predictParticle = newEffect(10, e => {
	Fill.circle(e.x, e.y, 1.2);
});*/

const pointDefenceLaser = elib.newEffectWDraw(32, 1300, e => {
	var pos1 = e.data[0];
	var pos2 = e.data[1];
	
	const colors = [Color.valueOf("ff3630aa"), Color.valueOf("ff9482"), Color.valueOf("000000")];
	const strokes = [2.2, 1.6, 0.8];
	for(var i = 0; i < 3; i++){
		Draw.color(colors[i]);
		
		Fill.circle(pos1.x, pos1.y, strokes[i] * 4 * e.fout());
		
		Fill.circle(pos2.x, pos2.y, strokes[i] * 4 * e.fout());
		
		Lines.stroke(strokes[i] * 4 * e.fout());
		Lines.line(pos1.x, pos1.y, pos2.x, pos2.y, CapStyle.none);
	}
});

const stepEffect = elib.newGroundEffect(26, 26, e => {
	Draw.color(Tmp.c1.set(e.color).mul(1.1));
	
	//print("effect:" + e.id + ":" + e.color + ": {" + e.x + "," + e.y + "," + e.rotation + "}");
	
	const hm = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, (e.fout() * 7) + 0.3);
		//print("test");
	}});
	
	Angles.randLenVectors(e.id, 12, e.rotation * e.finpow(), hm);
});
const stepRipple = elib.newGroundEffect(26, 26, e => {
	Draw.color(Tmp.c1.set(e.color).mul(1.2).add(0.2, 0.2, 0.2));
	Lines.stroke(e.fout() + 0.4);
	Lines.circle(e.x, e.y, 3 + (e.fin() * e.rotation));
});

var createLeg = prov(() => {
	//to create a new object, rubble decal is just a base
	legAC = extend(RubbleDecal, {
		_lastPos: null,
		_owner: null,
		_kneeRegion: null,
		_footRegion: null,
		_femurRegion: null,
		_tibiaRegion: null,
		_effectSize: 10,
		_stepDamage: 0,
		_targetedPosition: null,
		_legLength: 77.5,
		_femurAngleOffset: 0,
		_femurSpeed: 0.07,
		_tibiaSpeed: 0.04,
		_flipped: false,
		_femurAngle: 0,
		_tibiaAngle: 0,
		_tibiaLength: 1,
		_locked: false,
		_lastRotation: 0,
		legReset(){
			//set leg stats here
			this._effectSize = 56;
			this._stepDamage = 220;
			this._legLength = 77.5;
			this._femurAngleOffset = 0;
			//this._femurSpeed = 0.07;
			//this._tibiaSpeed = 0.05;
			this._femurSpeed = 0.05;
			this._tibiaSpeed = 0.03;
			this._femurAngle = 0;
			this._tibiaAngle = 0;
			this._tibiaLength = 1;
			this._locked = false;
			this._lastRotation = 0;
			this._lastPos = new Vec2();
		},
		setVec(vc){
			this._targetedPosition = vc;
		},
		setFlipped(flp){
			this._flipped = flp;
		},
		setRegions(kn, ft, fe, ti){
			this._kneeRegion = kn;
			this._footRegion = ft;
			this._femurRegion = fe;
			this._tibiaRegion = ti;
		},
		isFlipped(){
			return this._flipped;
		},
		lengthR(){
			tempVec.trns(this._femurAngle, this._legLength);
			tempVec2.trns(this._tibiaAngle, this._tibiaLength);
			tempVec.add(tempVec2.x + this._owner.getX(), tempVec2.y + this._owner.getY());
			return Mathf.dst(tempVec.x, tempVec.y, this._owner.getX(), this._owner.getY());
		},
		resetB(x, y){
			if(this._owner instanceof GroundUnit){tempVec.trns(this._owner.baseRotation - 90, x, y)}else{tempVec.trns(this._owner.rotation - 90, x, y)};
			this._targetedPosition.set(tempVec);
			this._targetedPosition.add(this._owner.x, this._owner.y);
			this._locked = false;
		},
		setA(entity, vec){
			this._owner = entity;
			this._targetedPosition.set(vec);
			this._femurAngle = Angles.angle(this._owner.getX(), this._owner.getY(), vec.x, vec.y);
			this._tibiaAngle = Angles.angle(this._owner.getX(), this._owner.getY(), vec.x, vec.y);
			this._tibiaLength = Mathf.clamp(Mathf.dst(this._owner.getX(), this._owner.getY(), vec.x, vec.y) - this._legLength, 1, this._legLength * 2);
			//this._femurAngle = angle;
			//this._tibiaAngle = angle;
			//this._tibiaLength = length;
		},
		getFloor(){
			tileA = Vars.world.tileWorld(this._targetedPosition.x, this._targetedPosition.y);
			
			return tileA == null ? Blocks.air : tileA.floor();
		},
		updateC(){
			//tempVec.set(this._targetedPosition);
			//tempVec.sub(this._owner.getX(), this._owner.getX());
			
			var flip = Mathf.sign(this._flipped);
			
			//var angleF = tempVec.angle();
			var angleF = Angles.angle(this._owner.getX(), this._owner.getY(), this._targetedPosition.x, this._targetedPosition.y);
			
			tempVec.trns(this._femurAngle, this._legLength);
			
			var angleT = Angles.angle(this._owner.getX() + tempVec.x, this._owner.getY() + tempVec.y, this._targetedPosition.x, this._targetedPosition.y);
			var lengthT = Mathf.dst(this._owner.getX() + tempVec.x, this._owner.getY() + tempVec.y, this._targetedPosition.x, this._targetedPosition.y);
			
			if(!this._locked){
				tempVec2.trns(this._femurAngle, this._legLength);
				tempVec.set(tempVec2);
				tempVec2.trns(this._tibiaAngle, this._tibiaLength);
				tempVec.add(tempVec2.x + this._owner.getX(), tempVec2.y + this._owner.getY());
				var dstt = Mathf.clamp((this._legLength - tempVec.dst(this._targetedPosition)) / (this._legLength * 2.2), 0, 0.6);
				//print(dstt);
				
				//this._femurAngle = Mathf.slerpDelta(this._femurAngle, angleF, this._femurSpeed);
				this._femurAngle = Mathf.slerpDelta(this._femurAngle, angleF + (this._femurAngleOffset * flip), this._femurSpeed);
				this._tibiaAngle = Mathf.slerpDelta(this._tibiaAngle, angleT, this._tibiaSpeed + dstt);
				this._tibiaLength = Mathf.lerpDelta(this._tibiaLength, lengthT, this._tibiaSpeed + dstt);
				
				tempVec2.trns(this._femurAngle, this._legLength);
				tempVec.set(tempVec2);
				tempVec2.trns(this._tibiaAngle, this._tibiaLength);
				tempVec.add(tempVec2.x + this._owner.getX(), tempVec2.y + this._owner.getY());
				//tempVec.add(this._owner.velocity().x, this._owner.velocity().y);
				if(this._targetedPosition.epsilonEquals(tempVec, 0.25) || this._lastPos.epsilonEquals(tempVec, 0.08)){
					if(!this.getFloor().isLiquid){
						Effects.effect(stepEffect, this.getFloor().color, this._targetedPosition.x, this._targetedPosition.y, this._effectSize);
						Sounds.bang.at(this._targetedPosition.x, this._targetedPosition.y, Mathf.random(0.9, 1.1) * 0.5);
					}else{
						Effects.effect(stepRipple, this.getFloor().color, this._targetedPosition.x, this._targetedPosition.y, this._effectSize);
						Sounds.splash.at(this._targetedPosition.x, this._targetedPosition.y, Mathf.random(0.9, 1.1) * 0.65);
					};
					if(this._effectSize / 26 > 0.1){
						Effects.shake(this._effectSize / 26, this._effectSize / 26, this._targetedPosition.x, this._targetedPosition.y);
					};
					if(this._stepDamage > 0.01){
						Damage.damage(this._owner.getTeam(), this._targetedPosition.x, this._targetedPosition.y, this._effectSize, this._stepDamage);
					};
					//Sounds.bang.at(this._targetedPosition.x, this._targetedPosition.y, Mathf.random(0.9, 1.1) * 0.5);
					//print("locked");
					this._locked = true;
				};
				this._lastPos.set(tempVec);
			}else{
				//this._femurAngle = Mathf.slerpDelta(this._femurAngle, angleF, this._femurSpeed);
				this._femurAngle = Mathf.slerpDelta(this._femurAngle, angleF + (this._femurAngleOffset * flip), this._femurSpeed);
				this._tibiaAngle = Mathf.slerpDelta(this._tibiaAngle, angleT, 1);
				this._tibiaLength = Mathf.lerpDelta(this._tibiaLength, lengthT, 1);
			};
			//this._lastPos.set(this._targetedPosition);
		},
		drawCustom(){
			var ownr = this._owner;
			
			var flip = Mathf.sign(this._flipped);
			
			tempVec.trns(this._femurAngle, this._legLength);
			tempVec2.trns(this._tibiaAngle, this._tibiaLength);
			tempVec.add(tempVec2);
			Draw.rect(this._footRegion, ownr.getX() + tempVec.x, ownr.getY() + tempVec.y, this._footRegion.getWidth() * flip * Draw.scl, this._footRegion.getHeight() * Draw.scl, this._tibiaAngle - 90);
			
			Draw.rect(this._femurRegion, ownr.getX(), ownr.getY(), this._femurRegion.getWidth() * flip * Draw.scl, this._femurRegion.getHeight() * Draw.scl, this._femurAngle - 90);
			
			tempVec.trns(this._femurAngle, this._legLength);
			
			Draw.rect(this._tibiaRegion, ownr.getX() + tempVec.x, ownr.getY() + tempVec.y, this._tibiaRegion.getWidth() * flip * Draw.scl, ((this._tibiaLength * 8) + 4) * Draw.scl, this._tibiaAngle - 90);
			Draw.rect(this._kneeRegion, ownr.getX() + tempVec.x, ownr.getY() + tempVec.y, this._kneeRegion.getWidth() * flip * Draw.scl, this._kneeRegion.getHeight() * Draw.scl, this._tibiaAngle - 90);
		}
	});
	return legAC;
});

const ravagerMain = prov(() => {
	ravagerMainB = extend(GroundUnit, {
		setEffects(){
			this._legHArray = [195, 195, 62.5, 62.5, -62.5, -62.5, -195, -195];
			this._legsA = [];
			this._rGroup = [];
			this._sequence = 0;
			for(var n = 0; n < 8; n++){
				var sign = Mathf.sign(n % 2);
				
				tempVec.set(155 * sign, this._legHArray[n]);
				tempVec.setLength(155);
				tempVec.add(this.x, this.y);
				
				this._legsA[n] = createLeg.get();
				this._legsA[n].setVec(new Vec2());
				this._legsA[n].setA(this, tempVec);
				this._legsA[n].setFlipped(n % 2 == 0);
				this._legsA[n].setRegions(this.getType().kRF(), this.getType().fRf(), this.getType().lRF(), this.getType().lRF());
				this._legsA[n].legReset();
				
				if(n <= 1){
					this._rGroup[n] = n == 0 ? [0, 3, 4, 7] : [1, 2, 5, 6];
				};
			};
		},
		calculateDamage(amount){
			trueAmount = amount < 4000 ? amount : Math.max(amount - ((amount - 4000) * 3), 0);
			return trueAmount * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * ravagerResistance;
		},
		getLegHeight(){
			return this._legHArray;
		},
		getLegs(){
			return this._legsA;
		},
		getResetGroup(){
			return this._rGroup;
		},
		setProgress(a){
			this._legProg = a;
		},
		getProgress(){
			return this._legProg;
		},
		setCustomTimer(){
			this._targetArray = [null, null, null];
			this._targetGroup = [[0, 1], [2, 3], [4, 5]];
			this._barrelHeights = [3, 3, 3, 3, 7, 7];
			this._weaponReloads = [7, 7, 7, 7, 40, 40];
			this._weaponInaccuracy = [3, 3, 3, 3, 11, 11];
			this._weaponShots = [1, 1, 1, 1, 5, 5];
			this._bulletArray = [nightmareFlakBullet, nightmareFlakBullet, nightmareFlakBullet, nightmareFlakBullet, nightmareArtilleryBullet, nightmareArtilleryBullet];
			this._weaponAngle = [0, 0, 0, 0, 0, 0];
			this._multiWeaponMountX = [29, -29, 40, -40, 28, -28];
			this._multiWeaponMountY = [18, 18, -12, -12, -20, -20];
			this._customTimer = new Interval(6);
		},
		getFlip(index, left){
			var tmp;
			switch(index){
				case 0:
				case 1:
					tmp = left ? 0 : 1;
					break;
				case 2:
				case 3:
					tmp = left ? 2 : 3;
					break;
				case 4:
				case 5:
					tmp = left ? 4 : 5;
					break;
				default:
					tmp = left ? 0 : 1;
			};
			return tmp;
		},
		getShootSound(index, x, y){
			switch(index){
				case 0:
				case 1:
				case 2:
				case 3:
					Sounds.missile.at(x, y);
					break;
				case 4:
				case 5:
					Sounds.artillery.at(x, y);
					break;
				default:
					Sounds.artillery.at(x, y);
			}
		},
		getMultiWeapRegion(index){
			var tmp;
			switch(index){
				case 0:
				case 1:
				case 2:
				case 3:
					tmp = ravagerMinigun.region;
					break;
				case 4:
				case 5:
					tmp = ravagerMinigun.artilleryRegion();
					break;
				default:
					tmp = ravagerMinigun.region;
			};
			return tmp;
		},
		getBarrelHeights(){
			return this._barrelHeights;
		},
		getWeapReload(){
			return this._weaponReloads;
		},
		getIndexBullet(){
			return this._bulletArray;
		},
		getCustomTimer(){
			return this._customTimer;
		},
		getWeapAngle(){
			return this._weaponAngle;
		},
		setSequence(a){
			this._sequence = a;
		},
		getSequence(){
			return this._sequence;
		},
		getTargets(){
			return this._targetArray;
		},
		behavior(){
			//this.super$behavior();
			if(!Units.invalidateTarget(this.target, this)){
				if(this.dst(this.target) < this.getWeapon().bullet.range() && (this.dst(this.target) > this.getWeapon().bullet.range() / 2.5 || this.target.maxHealth() > this.getWeapon().bullet.damage / 1.5)){
					this.rotate(this.angleTo(this.target));
					
					if(Angles.near(this.angleTo(this.target), this.rotation, 13)){
						var ammo = this.getWeapon().bullet;

						var to = Predict.intercept(this, this.target, ammo.speed);

						this.getWeapon().update(this, to.x, to.y);
					}
				}
			};
			
			//if(!Units.invalidateTarget(this.target, this)) this.updateMWeapons();
			//this.updateMWeapons();
		},
		targetClosest(){
			var bf1 = boolf(u => (this.getType().targetAir || !u.isFlying()) && ((u != this.getTargets()[0] && u != this.getTargets()[1] && u != this.getTargets()[2]) || u.maxHealth() > this.getWeapon().bullet.damage / 1.5) && u.velocity().len() < 1.1 && ((this.dst(u) > this.getWeapon().bullet.range() / 2.5) || u.maxHealth() > this.getWeapon().bullet.damage / 1.5));
			var bft = boolf(tile => (tile.ent() != null && ((tile.ent() != this.getTargets()[0] && tile.ent() != this.getTargets()[1] && tile.ent() != this.getTargets()[2]) || tile.ent().maxHealth() > this.getWeapon().bullet.damage / 1.5)) && (this.dst(tile) > this.getWeapon().bullet.range() / 2.5));
			var newTarget = Units.closestTarget(this.getTeam(), this.x, this.y, Math.max(this.getWeapon().bullet.range(), this.type.range), bf1, bft);
			if(newTarget != null){
				this.target = newTarget;
			}
		},
		/*updateMWeapons(){
			for(var h = 0; h < 6; h++){
				tempVec.trns(this.rotation - 90, this._multiWeaponMountX[h], this._multiWeaponMountY[h]);
				tempVec.add(this.x, this.y);
				
				if(Mathf.within(tempVec.x, tempVec.y, this.target.getX(), this.target.getY(), this.getIndexBullet()[h].range()) && !Units.invalidateTarget(this.target, this)){
					var to = Predict.intercept(this, this.target, this.getIndexBullet()[h].speed);
					var targetAngle = Angles.angle(tempVec.x, tempVec.y, to.x, to.y);
					
					this.getWeapAngle()[h] = Angles.moveToward(this.getWeapAngle()[h], targetAngle, 3.7);
					if(Angles.near(this.getWeapAngle()[h], targetAngle, 13)) ravagerMinigun.updateC(this, this._multiWeaponMountX[h], this._multiWeaponMountY[h], 11, this._weaponShots[h], h);
				}else{
					if(!Angles.within(this.getWeapAngle()[h], this.rotation, 2.2)){
						this.getWeapAngle()[h] = Angles.moveToward(this.getWeapAngle()[h], this.rotation, 2.8);
					}else{
						this.getWeapAngle()[h] = Angles.moveToward(this.getWeapAngle()[h], this.rotation, 80);
					}
				}
			}
		},*/
		update(){
			this.super$update();
			
			//print("test");
			
			this.updateMTarget();
			
			this.updateLegs();
			
			this.countBullets();
			
			//this.updateMWeapAlt();
		},
		collision(other, x, y){
			this.super$collision(other, x, y);
			
			if(other instanceof Bullet && other.getBulletType() != null && other.getBulletType().pierce){
				other.scaleTime(other.getBulletType().lifetime / 6);
				other.deflect();
			}
		},
		countBullets(){
			if(this.timer.get(6, 5)){
				var totalDamage = 0;
				const rangeD = 312;
				
				Vars.bulletGroup.intersect(this.x - rangeD, this.y - rangeD, rangeD * 2, rangeD * 2, cons(b => {
					if(Mathf.within(this.x, this.y, b.x, b.y, rangeD) && b.getBulletType() != null && b.getTeam() != this.getTeam() && !(b instanceof Lightning)){
						var piercing = b.getBulletType().pierce ? 60 : 1;
						var tmpDamage = b.getBulletType().damage + b.getBulletType().splashDamage * piercing;
						var currentBType = b.getBulletType();
						var totalFragBullets = 1;
						for(var i = 0; i < 16; i++){
							if(currentBType.fragBullet == null) break;
							
							var frag = currentBType.fragBullet;
							//var frags = currentBullet.fragBullets;
							
							piercing = frag.pierce ? 60 : 1;
							
							totalFragBullets *= currentBType.fragBullets;
							
							tmpDamage += (frag.damage + frag.splashDamage) * piercing * totalFragBullets;
							
							currentBType = currentBType.fragBullet;
						};
						//var extraDamage = b.getBulletType().pierce ? (this.getSize() / b.getBulletType().speed) * Time.delta() : 1;
						//totalDamage += (b.getBulletType().damage + (b.getBulletType().splashDamage * Math.max(1, b.getBulletType().splashDamageRadius / 4))) * extraDamage;
						totalDamage += tmpDamage;
					}
				}));
				
				if(totalDamage < 9000 / ravagerResistance) return;
				//if(totalDamage < 2) return;
				
				Vars.bulletGroup.intersect(this.x - rangeD, this.y - rangeD, rangeD * 2, rangeD * 2, cons(b => {
					if(Mathf.within(this.x, this.y, b.x, b.y, rangeD) && b.getBulletType() != null && b.getTeam() != this.getTeam() && !(b instanceof Lightning)){
						b.time(b.getBulletType().lifetime);
						b.deflect();
						
						Effects.effect(pointDefenceLaser, this.x, this.y, 0, [this, new Vec2(b.x, b.y)]);
					}
				}));
			}
		},
		updateMTarget(){
			if(this.timer.get(5, 20)){
				this.getTargets()[0] = Units.closestTarget(this.getTeam(), this.x, this.y, this._bulletArray[0].range());
				this.getTargets()[1] = this.strongestTarget();
				this.getTargets()[2] = Units.closestTarget(this.getTeam(), this.x, this.y, this._bulletArray[4].range(), boolf(unit => !unit.isFlying()));
				//print(this.getTargets());
			};
			for(var i = 0; i < this._targetGroup.length; i++){
				var rangeB = this._bulletArray[i * 2].range();
				if(!Units.invalidateTarget(this.getTargets()[i], this.getTeam(), this.x, this.y, rangeB)){
					for(var s = 0; s < this._targetGroup[i].length; s++){
						group = this._targetGroup[i][s];
						
						tempVec.trns(this.rotation - 90, this._multiWeaponMountX[group], this._multiWeaponMountY[group]);
						tempVec2.set(tempVec);
						tempVec.add(this.x, this.y);
						
						//var to = Predict.intercept(this, this.getTargets()[i], this.getIndexBullet()[group].speed);
						var to = lib.predictAlt(this, tempVec2, this.getTargets()[i], this.getIndexBullet()[group].speed, false);
						//Effects.effect(predictParticle, to.x, to.y);
						var targetAngle = Angles.angle(tempVec.x, tempVec.y, to.x, to.y);
						
						this.getWeapAngle()[group] = Angles.moveToward(this.getWeapAngle()[group], targetAngle, 4.6);
						if(Angles.near(this.getWeapAngle()[group], targetAngle, 13)) ravagerMinigun.updateC(this, this._multiWeaponMountX[group], this._multiWeaponMountY[group], this._weaponInaccuracy[group], this._weaponShots[group], group);
					}
				}else{
					if(this.getTargets()[i] != null) this.getTargets()[i] = null;
					for(var s = 0; s < this._targetGroup[i].length; s++){
						group = this._targetGroup[i][s];
						
						this.getWeapAngle()[group] = Angles.moveToward(this.getWeapAngle()[group], this.rotation, 2.9);
					}
				};
			}
		},
		strongestTarget(){
			var rangeA = this._bulletArray[2].range();
			var out = null;
			var last = 0;
			Units.nearbyEnemies(this.getTeam(), this.x - rangeA, this.y - rangeA, rangeA * 2, rangeA * 2, cons(unit => {
				if(Mathf.within(this.x, this.y, unit.x, unit.y, rangeA) && !unit.isDead()){
					var st = unit.health() + unit.getWeapon().bullet.damage + unit.getWeapon().bullet.splashDamage;
					if(out == null || st > last){
						out = unit;
						last = st;
					}
				}
			}));
			if(out != null) return out;
			
			return Units.findEnemyTile(this.getTeam(), this.x, this.y, rangeA, boolf(t => true));
		},
		updateLegs(){
			//var distance = 130;
			var distance = 110;
			var progress = this.walkTime % distance;
			for(var m = 0; m < this.getLegs().length; m++){
				this.getLegs()[m].updateC();
			};
			if(progress < this.getProgress()){
				var groupA = this.getResetGroup()[this.getSequence()];
				for(var v = 0; v < groupA.length; v++){
					//var legHeightArray = [155, 155, 77.5, 77.5, -77.5, -77.5, 155, 155];
					var wd = this.getLegs()[groupA[v]].isFlipped() ? 1 : -1;
					//tempVec.trns(this.baseRotation, this.getLegHeight()[groupA[v]], 155 * wd);
					//tempVec.set(this.getLegHeight()[groupA[v]], 155 * wd);
					tempVec.set(155 * wd, this.getLegHeight()[groupA[v]]);
					tempVec.setLength(155);
					//tempVec2.trns(this.baseRotation, 0, 126);
					tempVec2.set(0, 40);
					tempVec.add(tempVec2);
					
					//tempVec.trns(this.baseRotation, legHeightArray[v]);
					this.getLegs()[groupA[v]].resetB(tempVec.x, tempVec.y);
				}
				this.setSequence((this.getSequence() + 1) % this.getResetGroup().length);
			};
			this.setProgress(progress);
		},
		draw(){
			var floor = this.getFloorOn();
			
			if(floor.isLiquid){
				Draw.color(Color.white, floor.color, this.drownTime * 0.4);
			}else{
				Draw.color(Color.white);
			};
			
			this.drawLegs();
			
			Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
			
			this.drawBottomWeapons();
			
			this.drawBody();
			
			this.drawTopWeapons();
			
			Draw.mixcol();
			
			//Draw.rect(this.getType().bottomReg(), this.x, this.y, this.rotation - 90);
			
			//this.super$draw();
		},
		drawBottomWeapons(){
			for(var s = 0; s < 2; s++){
				var i = Mathf.signs[s];
				var tra = this.rotation - 90;
				var trY = -this.getWeapon().getRecoil(this, i > 0) + this.getType().weaponOffsetY;
				var w = -i * this.getWeapon().region.getWidth() * Draw.scl;
				Draw.rect(this.getWeapon().region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * i, trY),
				this.y + Angles.trnsy(tra, this.getWeapon().width * i, trY), w, this.getWeapon().region.getHeight() * Draw.scl, this.rotation - 90);
			};
		},
		drawBody(){
			Draw.rect(this.getType().region, this.x, this.y, this.rotation - 90);
		},
		drawTopWeapons(){
			for(var u = 0; u < 6; u++){
				tempVec2.trns(this.rotation - 90, this._multiWeaponMountX[u], this._multiWeaponMountY[u]);
				tempVec.trns(this.getWeapAngle()[u], -ravagerMinigun.getRecoilC(this, u));
				tempVec2.add(this.x + tempVec.x, this.y + tempVec.y);
				
				//var regionB = ravagerMinigun.region;
				var regionB = this.getMultiWeapRegion(u);
				
				var flpp = Mathf.signs[u % 2] * regionB.getWidth() * Draw.scl;
				var heightP = regionB.getHeight() * Draw.scl;
				
				Draw.rect(regionB, tempVec2.x, tempVec2.y, flpp, heightP, this.getWeapAngle()[u] - 90);
			}
		},
		drawLegs(){
			for(var d = 0; d < this.getLegs().length; d++){
				this.getLegs()[d].drawCustom();
			}
		},
		added(){
			this.setEffects();
			
			this.super$added();
		}
	});
	ravagerMainB.setCustomTimer();
	ravagerMainB.timer = new Interval(7);
	ravagerMainB.setProgress(0);
	ravagerMainB.setSequence(0);
	return ravagerMainB;
});

const nightmareBulletAC = extend(BasicBulletType, {
	update(b){
		if(b.timer.get(1, 35)){
			var vec = lib.collideLineHealth(b, b.x, b.y, b.rot(), this.maxLaserRange, 14000, true);
			if(vec instanceof Vec2){
				b.setData(vec.cpy());
			}else{
				tempVec.trns(b.rot(), this.maxLaserRange);
				tempVec.add(b.x, b.y);
				b.setData(tempVec.cpy());
			};
			if(b.getData() == null && !(b.getData() instanceof Vec2)) return;
			var lenA = Mathf.dst(b.getData().x, b.getData().y, b.x, b.y);
			//print(vec);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), lenA, true);
			
			tempVec.trns(b.rot(), lenA);
			tempVec.add(b.x, b.y);
			this.hitB(b, tempVec.x, tempVec.y);
		};
	},
	hitB(b, x, y){
		const rangeC = 53 * 1.15;
		Units.nearbyEnemies(b.getTeam(), x - rangeC, y - rangeC, rangeC * 2, rangeC * 2, cons(e => {
			if(Mathf.within(e.x, e.y, x, y, rangeC + (e.getSize() / 2))){
				var dstA = ((rangeC + (e.getSize() / 2)) - Mathf.dst(e.x, e.y, x, y)) / rangeC;
				var extra = e.maxHealth() < 8000 ? 0 : (e.maxHealth() - 8000) * 1.3;
				var damageB = Math.min(Math.max(dstA, 0) * 2, 1) * (2100 + extra);
				
				var lastHealth = e.health();
				
				e.damage(damageB);
				
				if(Mathf.equal(lastHealth, e.health, 0.06) && e != null && damageB > 2){
					e.kill();
				};
			}
		}));
		var indexed = [];
		const rangeTile = Mathf.round(rangeC / Vars.tilesize);
		const offset = ((rangeTile + 1) % 2) * (Vars.tilesize / 2);
		for(var tx = -rangeTile; tx < rangeTile; tx++){
			tileYLoop:
			for(var ty = -rangeTile; ty < rangeTile; ty++){
				var zx = ((tx * Vars.tilesize) + offset) + x;
				var zy = ((ty * Vars.tilesize) + offset) + y;
				tileA = Vars.world.ltileWorld(zx, zy);
				if(indexed.lastIndexOf(tileA) != -1) continue tileYLoop;
				if(tileA != null && tileA.ent() != null && !tileA.ent().isDead() && tileA.getTeam() != b.getTeam()){
					//var dstA = ((rangeC + (e.getSize() / 2)) - Mathf.dst(e.x, e.y, x, y)) / rangeC;
					var dstA = (rangeC - Mathf.dst(tileA.drawx(), tileA.drawy(), x, y)) / rangeC;
					var extra = tileA.ent().maxHealth() < 8000 ? 0 : tileA.ent().maxHealth() - 8000;
					var damageB = Math.min(Math.max(dstA, 0) * 2, 1) * (2100 + extra);
					
					var lastHealth = tileA.ent().health();
					
					tileA.ent().damage(damageB);
					if(tileA.ent() == null) continue tileYLoop;
					if(Mathf.equal(lastHealth, tileA.ent().health, 0.06) && damageB > 2){
						tileA.ent().kill();
					};
					
					if(!tileA.ent().isDead()) indexed.push(tileA);
				}
			};
		};
	},
	range(){
		return this.maxLaserRange;
	},
	draw(b){
		if(b.getData() == null && !(b.getData() instanceof Vec2)) return;
		var len = Mathf.dst(b.getData().x, b.getData().y, b.x, b.y);
		//var angle = Angles.angle(b.getData().x, b.getData().y, b.x, b.y);
		const colors = [Color.valueOf("de000055"), Color.valueOf("ff3630aa"), Color.valueOf("ff9482"), Color.valueOf("000000")];
		//const colors = [Color.valueOf("54413d55"), Color.valueOf("b74c27aa"), Color.valueOf("db9210"), Color.valueOf("ffdb2e"), Color.valueOf("fffb9c"), Color.valueOf("ffffff")];
		//const strokes = [3.0, 2.45, 2.0, 1.6, 1.2, 0.8];
		const tscales = [1, 0.74, 0.5, 0.24];
		const strokes = [2.9, 2.2, 1.6, 0.8];
		const strokesAlt = [1.3, 1.15, 0.95, 0.8];
		const lenscales = [1.0, 1.12, 1.15, 1.164];
		//const tmpColor = new Color();
		//var f = Mathf.curve(b.fin(), 0.0, 0.17);
		//var e = Interpolation.pow2InInverse.apply(Mathf.curve(b.fin(), 0.0, 0.56));
		var e = Interpolation.pow2InInverse.apply(Mathf.curve(b.fin(), 0.0, 0.76));
		//var baseLen = len * f;
		
		for(var s = 0; s < 4; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.9) * 62.0);
				Tmp.v2.trns(b.rot(), len);
				//Tmp.v2.trns(b.rot(), (lenscales[i] - 0.5) * 68.0);
				Lines.stroke(9 * b.fout() * strokes[s] * tscales[i]);
				Lines.line(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.x + Tmp.v2.x, b.y + Tmp.v2.y, CapStyle.none);
				//Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), baseLen + ((lenscales[i] - 0.5) * (62.0 * 2)), CapStyle.none);
				//Fill.circle(b.getData().x, b.getData().y, b.fslope() * 67 * strokes[s]);
			};
			Tmp.v1.trns(b.rot(), len);
			//(0.5 - Math.abs(f - 0.5)) * 2;
			Fill.circle(Tmp.v1.x + b.x, Tmp.v1.y + b.y, ((0.5 - Math.abs(e - 0.5)) * 2) * 53 * strokesAlt[s]);
		};

		/*for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.2, 0.4)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.9) * 55.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.7, 3.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.maxLaserRange * b.fout() * lenscales[i], CapStyle.none);
			}
		};*/
		Draw.reset();
	}
});
nightmareBulletAC.maxLaserRange = 340;
nightmareBulletAC.speed = 0.001;
nightmareBulletAC.damage = 1210;
//nightmareBulletAC.damage = 1;
nightmareBulletAC.lifetime = 34;
nightmareBulletAC.pierce = true;
nightmareBulletAC.drawSize = 680;
nightmareBulletAC.keepVelocity = false;
nightmareBulletAC.hitEffect = Fx.hitMeltdown;
nightmareBulletAC.despawnEffect = Fx.none;
nightmareBulletAC.shootEffect = Fx.none;
nightmareBulletAC.smokeEffect = Fx.none;

const tempRect = new Rect();

const nightmareFlakBullet = extend(FlakBulletType, {
	hitA(b, x, y){
		Effects.effect(this.hitEffect, x, y, b.rot());
		this.hitSound.at(b);

		Effects.shake(this.hitShake, this.hitShake, b);

		if(this.splashDamageRadius > 0){
			Damage.damage(b.getTeam(), x, y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
		};
	},
	hit(b){
		//if(x == null || y == null) return;
		//this.super$hit(b);
		this.hitA(b, b.x, b.y);
		
		b.hitbox(tempRect);
		Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
			if(unit.getTeam() != b.getTeam()){
				var lastHealthC = unit.health();
				
				//print(lastHealthC);
				
				unit.damage(1);
				
				//print(lastHealthC + "/" + unit.health);
				
				if(Mathf.equal(lastHealthC, unit.health, 0.002)){
					unit.kill();
				};
				
				if(unit.maxHealth() > 9000 && !unit.isDead()){
					unit.damage(Math.max((unit.maxHealth() - 9000) / 8, 0));
				};
			}
		}));
	}
});
nightmareFlakBullet.bulletSprite = "missile";
nightmareFlakBullet.speed = 5.4;
nightmareFlakBullet.lifetime = 50;
nightmareFlakBullet.damage = 8;
nightmareFlakBullet.shootEffect = Fx.shootSmall;
nightmareFlakBullet.bulletWidth = 9;
nightmareFlakBullet.bulletHeight = 11;
nightmareFlakBullet.bulletShrink = 0;
nightmareFlakBullet.hitEffect = Fx.blastExplosion;
nightmareFlakBullet.despawnEffect = Fx.blastExplosion;
nightmareFlakBullet.splashDamage = 46;
nightmareFlakBullet.splashDamageRadius = 26;
nightmareFlakBullet.homingPower = 6;
nightmareFlakBullet.hitSound = Sounds.explosion;
//nightmareFlakBullet.fragBullet = Bullets.glassFrag;
//nightmareFlakBullet.fragBullets = 6;
nightmareFlakBullet.backColor = Pal.missileYellowBack;
nightmareFlakBullet.frontColor = Pal.missileYellow;

const nightmareArtilleryBullet = extend(ArtilleryBulletType, {});
nightmareArtilleryBullet.bulletSprite = "shell";
nightmareArtilleryBullet.damage = 0.1;
nightmareArtilleryBullet.speed = 2.6;
nightmareArtilleryBullet.lifetime = 130;
nightmareArtilleryBullet.bulletShrink = 0.125;
nightmareArtilleryBullet.bulletWidth = 14;
nightmareArtilleryBullet.bulletHeight = 15;
nightmareArtilleryBullet.collides = true;
nightmareArtilleryBullet.collidesTiles = true;
nightmareArtilleryBullet.splashDamageRadius = 30;
nightmareArtilleryBullet.splashDamage = 70;
nightmareArtilleryBullet.backColor = Pal.missileYellowBack;
nightmareArtilleryBullet.frontColor = Pal.missileYellow;
nightmareArtilleryBullet.hitEffect = Fx.blastExplosion;
nightmareArtilleryBullet.knockback = 0.8;

const ravagerNightmare = extendContent(Weapon, "advancecontent-nightmare", {
	load(){
		this.super$load();
		//this.shootSound = Vars.content.getByName(ContentType.block, "advancecontent-end-game").shootSound;
	}
	/*init(){
		this.super$init();
		this.shootSound = Vars.content.getByName(ContentType.block, "advancecontent-end-game").shootSound;
	}*/
});
ravagerNightmare.name = "advancecontent-nightmare";
ravagerNightmare.bullet = nightmareBulletAC;
ravagerNightmare.alternate = true;
//ravagerNightmare.length = 265 / 4;
ravagerNightmare.length = 255 / 4;
ravagerNightmare.width = 224 / 4;
ravagerNightmare.reload = 5 * 60;
ravagerNightmare.recoil = 3.5;

const ravagerMinigun = extendContent(Weapon, "advancecontent-ravager-launcher", {
	load(){
		this.super$load();
		this.artilleryWeap = Core.atlas.find("advancecontent-ravager-artillery");
	},
	artilleryRegion(){
		return this.artilleryWeap;
	},
	updateC(shooter, mountx, mounty, inaccuracyA, shots, index){
		if(shooter.getCustomTimer().get(index, shooter.getWeapReload()[index])){
			var angleQ = shooter.getWeapAngle()[index];
			var bulletQ = shooter.getIndexBullet()[index];
			var flip = index % 2 == 0;
			
			shooter.getCustomTimer().reset(shooter.getFlip(index, !flip), shooter.getWeapReload()[shooter.getFlip(index, !flip)] / 2);
			
			tempVec.trns(shooter.rotation - 90, mountx, mounty);
			tempVec2.trns(angleQ, shooter.getBarrelHeights()[index]);
			tempVec.add(tempVec2);
			
			shooter.getShootSound(index, shooter.getX() + tempVec.x, shooter.getY() + tempVec.y);
			
			for(var l = 0; l < shots; l++){
				this.shootC(shooter, tempVec.x, tempVec.y, angleQ + Mathf.range(inaccuracyA), bulletQ);
			}
		}
	},
	shootC(shooter, mountx, mounty, angle, bullet){
		Bullet.create(bullet, shooter, shooter.getTeam(), shooter.getX() + mountx, shooter.getY() + mounty, angle);
	},
	getRecoilC(shooter, index){
		return (1 - Mathf.clamp(shooter.getCustomTimer().getTime(index) / shooter.getWeapReload()[index])) * this.recoil;
	}
});
ravagerMinigun.name = "advancecontent-ravager-launcher";
ravagerMinigun.bullet = Bullets.flakGlass;
ravagerMinigun.length = 54 / 4;
ravagerMinigun.width = 224 / 4;
ravagerMinigun.reload = 9;
ravagerMinigun.inaccuracy = 13;
ravagerMinigun.shootSound = Sounds.shootSnap;

const ravagerType = extendContent(UnitType, "ravager", {
	load(){
		this.super$load();
		
		this.legRegion = Core.atlas.find("clear");
		this.baseRegion = Core.atlas.find("clear");
		
		this.bottomRegionB = Core.atlas.find(this.name + "-bottom");
		
		this.legRegionB = Core.atlas.find(this.name + "-leg");
		this.kneeRegionB = Core.atlas.find(this.name + "-knee");
		this.footRegionB = Core.atlas.find(this.name + "-foot");
		
		ravagerMinigun.load();
	},
	init(){
		this.super$init();
		lib.loadImmunities(this);
		ravagerNightmare.shootSound = Vars.content.getByName(ContentType.block, "advancecontent-the-cube").shootSound;
	},
	displayInfo(table){
		table.table(cons(title => {
			title.addImage(this.icon(Cicon.xlarge)).size(8 * 6);
			title.add("[accent]" + this.localizedName).padLeft(5);
		}));
		
		table.row();
		
		table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
		
		table.row();
		
		if(this.description != null){
			table.add(this.displayDescription()).padLeft(5).padRight(5).width(400).wrap().fillX();
			table.row();

			table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
			table.row();
		};
		
		table.left().defaults().fillX();

		table.add(Core.bundle.format("unit.health", this.health));
		table.row();
		table.add(Core.bundle.format("unit.speed", Strings.fixed(this.speed, 1)));
		table.row();
		var resistance = (1 - ravagerResistance) * 100;
		table.add("Damage Resistance: " + resistance.toFixed(1) + "%").color(Color.lightGray);
		table.row();
		table.row();
	},
	bottomReg(){
		return this.bottomRegionB;
	},
	lRF(){
		return this.legRegionB;
	},
	kRF(){
		return this.kneeRegionB;
	},
	fRf(){
		return this.footRegionB;
	}
});
ravagerType.localizedName = "Ravager";
ravagerType.create(ravagerMain);
ravagerType.description = "The main cannon shoots the melted dreams of dead children.";
ravagerType.hitsize = 77;
ravagerType.hitsizeTile = 13;
ravagerType.weapon = ravagerNightmare;
ravagerType.flying = false;
ravagerType.health = 32767;
ravagerType.mass = 70;
ravagerType.drag = 0.45;
ravagerType.speed = 0.2;
ravagerType.range = 290;
ravagerType.weaponOffsetY = -63 / 4;
ravagerType.maxVelocity = 1.1;
ravagerType.rotatespeed = 0.065;
ravagerType.baseRotateSpeed = 0.00001;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = ravagerType;*/