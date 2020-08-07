var totalSegments = 35;

var segmentOffset = 19;

const tempVec = new Vec2();
const tempVec2 = new Vec2();

const stormBullet = extend(BasicBulletType, {

});
stormBullet.damage = 34;
stormBullet.speed = 8;
stormBullet.lifetime = 190 / 8;
stormBullet.pierce = false;
stormBullet.bulletWidth = 10;
stormBullet.bulletHeight = 17;
stormBullet.bulletShrink = 0;
stormBullet.splashDamage = 19;
stormBullet.splashDamageRadius = 28;
stormBullet.backColor = Pal.unitBack;
stormBullet.frontColor = Pal.unitFront;
stormBullet.keepVelocity = false;
stormBullet.knockback = 0;
stormBullet.shootEffect = Fx.none;
stormBullet.smokeEffect = Fx.none;

const falseUnit = prov(() => {
	falseUnitB = extend(FlyingUnit, {
		setOwner(a){
			this._owner = a;
			this.team = a.getTeam();
		},
		/*setType(a){
			this.type = a;
		},
		setTeam(a){
			this.team = a;
		},*/
		getOwner(){
			return this._owner;
		},
		maxHealth(){
			return this.getOwner().maxHealth();
		},
		applyEffect(effect, duration){
			if(this.dead || Vars.net.client() || this.getOwner().isDead()) return;
			this.getOwner().getStatuses().handleApply(this.getOwner(), effect, duration);
		},
		getDamageMultipler(){
			return this.getOwner().getDamageMultipler();
		},
		hasEffect(effect){
			return this.getOwner().hasEffect(effect);
		},
		update(){
			if(this.getOwner() == null || this.getOwner().isDead()) this.remove();
		},
		added(){
			this.super$added();
			
			if(this.loaded) this.remove();
		},
		kill(){
			this.getOwner().kill();
		},
		updateCustom(){
			this.health = this.getOwner().health();
			this.updateTargeting();
			this.state.update();
		},
		updateStatusC(){
			this.status.update(this);
			//return this.status;
		},
		getTargetVelocityX(){
			//to increase targeting accuracy
			if(!this.getWeapon().bullet.keepVelocity) return 0;
			
			return this.velocity().x;
		},
		getTargetVelocityY(){
			if(!this.getWeapon().bullet.keepVelocity) return 0;
			
			return this.velocity().y;
		},
		countsAsEnemy(){
			return false;
		},
		damage(amount){
			this.getOwner().damage(amount);
		},
		health(amount){
			this.getOwner().health(amount);
		},
		health(){
			return this.getOwner().health();
		},
		draw(){
			
		},
		drawAll(){
			
		},
		drawShadow(offsetX, offsetY){
			
		}
	});
	falseUnitB.setOwner(null);
	//falseUnitB.setType(null);
	return falseUnitB;
});

const stormMain = prov(() => {
	stormMainB = extend(FlyingUnit, {
		setSegments(){
			/*this._unitSegment = {
				segments: [],
				segmentVelocities: []
				seg: function(){
					return this.segments;
				},
				segV: function(){
					return this.segmentVelocities;
				}
			};*/
			this._unitSegment = [[], [], []];
			//this._unitSegment.segments = [];
			//this._unitSegment.segmentVelocities = [];
			var tmp = this.getSegments();
			//var tmpArray = [];
			//var tmpArrayB = [];
			
			for(var i = 0; i < totalSegments; i++){
				tmp[0][i] = new Vec2();
				tmp[1][i] = new Vec2();
				tmp[2][i] = stormSegment.create(this.getTeam());
				//tmp[2][i].setType(this.getType());
				//tmp[2][i].setOwner(this);
			};
		},
		
		getStatuses(){
			return this.status;
		},
		
		customSetRect(){
			this._rect = new Rect();
			//this.hitbox(getRect());
		},
		
		getRect(){
			return this._rect;
		},
		
		/*behavior(){
			this.super$behavior();
			
			for(rg = 0; rg < totalSegments; rg += 3){
				if(this.getSegments()[2][rg] == null) break;
				if(!Units.invalidateTarget(this.target, this.getTeam(), this.getSegments()[0][rg].x, this.getSegments()[0][rg].y, this.getWeapon().bullet.range()) && this.getFireSeq() == (rg / 3) % 18){
					//this.getSegments()[3][rg].getWeapon().update(this.getSegments()[3][rg], this.target.getX(), this.target.getY());
					this.getWeapon().update(this.getSegments()[2][rg], this.target.getX(), this.target.getY());
				};
			};
			if(!Units.invalidateTarget(this.target, this)) this.setFireSeq((this.getFireSeq() + 1) % 18);
		},*/
		
		setFireSeq(val){
			this._seqF = val;
		},
		
		getFireSeq(){
			return this._seqF;
		},
		
		getSegments(){
			return this._unitSegment;
		},
		
		drawSize(){
			return (segmentOffset * totalSegments) * 2;
		},
		
		drawShadow(offsetX, offsetY){
			this.super$drawShadow(offsetX, offsetY);
			//Draw.rect(getIconRegion(), x + offsetX, y + offsetY, rotation - 90);
			for(var m = totalSegments - 1; m > -1; m--){
				var region = m == totalSegments - 1 ? this.getType().tRegion() : this.getType().sRegion();
				var tmpB = this.getSegments()[0];
				var angleC = m <= 0 ? Angles.angle(tmpB[m].x, tmpB[m].y, this.x, this.y) : Angles.angle(tmpB[m].x, tmpB[m].y, tmpB[m - 1].x, tmpB[m - 1].y);
				Draw.rect(region, tmpB[m].x + offsetX, tmpB[m].y + offsetY, angleC - 90);
			};
		},
		
		draw(){
			for(var m = totalSegments - 1; m > -1; m--){
				var tmpB = this.getSegments()[0];
				
				/*Draw.color(Color.black, this.getTeam().color, this.healthf() + Mathf.absin(Time.time(), Math.max(this.healthf() * 5, 1), 1 - this.healthf()));
				Draw.rect(this.getPowerCellRegion(), tmpB[m].x, tmpB[m].y, this.rotation - 90);
				Draw.color();*/
				
				Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
				var region = m == totalSegments - 1 ? this.getType().tRegion() : this.getType().sRegion();
				//var tmpB = this.getSegments()[0];
				var angleC = m <= 0 ? Angles.angle(tmpB[m].x, tmpB[m].y, this.x, this.y) : Angles.angle(tmpB[m].x, tmpB[m].y, tmpB[m - 1].x, tmpB[m - 1].y);
				Draw.rect(region, tmpB[m].x, tmpB[m].y, angleC - 90);
				Draw.mixcol();
				
				Draw.color(Color.black, this.getTeam().color, this.healthf() + Mathf.absin(Time.time(), Math.max(this.healthf() * 5, 1), 1 - this.healthf()));
				Draw.rect(this.getPowerCellRegion(), tmpB[m].x, tmpB[m].y, angleC - 90);
				Draw.color();
			};
			
			this.super$draw();
		},
		
		update(){
			this.super$update();
			
			//this.updateSegmentVelocity();
			this.updateSegments();
			/*for(var l = 0; l < totalSegments; l++){
				var tmp = this.getSegments();
				var angleB = l == 0 ? Angles.angle(tmp[0][l].x, tmp[0][l].y, this.x, this.y) : Angles.angle(tmp[0][l].x, tmp[0][l].y, tmp[0][l - 1].x, tmp[0][l - 1].y);
				tmp[2][l].set(tmp[0][l].x, tmp[0][l].y);
				tmp[2][l].rotation = angleB;
			}*/
			//this.updateRect();
		},
		
		updateVelocityStatus(){
			this.status.update(this);
			var tmpAmount = 0;
			//print(this.item);
			if(this.item.amount != null) tmpAmount = Mathf.clamp(this.item.amount, 0, this.getItemCapacity());
			this.item.amount = tmpAmount;
			
			this.velocity().limit(this.maxVelocity());
			this.velocity().scl((1 + (this.status.getSpeedMultiplier() - 1)) * Time.delta());
			
			this.updateSegmentVelocity();
			
			if(this.x < -Vars.finalWorldBounds || this.y < -Vars.finalWorldBounds || this.x >= (Vars.world.width() * Vars.tilesize) + Vars.finalWorldBounds || this.y >= (Vars.world.height() * Vars.tilesize) + Vars.finalWorldBounds){
				this.kill();
			};
			
			if(this.getTeam() != Vars.state.rules.waveTeam){
				var relativeSize = Vars.state.rules.dropZoneRadius + (this.getSize() / 2) + 1;
				Vars.spawner.getGroundSpawns().each(cons(spawn => {
					if(this.withinDst(spawn.worldx(), spawn.worldy(), relativeSize)){
						Tmp.v1.set(this);
						Tmp.v1.sub(spawn.worldx(), spawn.worldy());
						Tmp.v1.setLength(0.1 + 1 - this.dst(spawn) / relativeSize);
						Tmp.v1.scl(0.45 * Time.delta());
						this.velocity().add(Tmp.v1);
						Tmp.v1.setZero();
					}
				}));
			};
			
			var warpDst = 180;
			
			if(this.x < 0) this.velocity().x += (-this.x / warpDst);
			if(this.y < 0) this.velocity().y += (-this.y / warpDst);
			if(this.x > Vars.world.unitWidth()) this.velocity().x -= ((this.x - Vars.world.unitWidth()) / warpDst);
			if(this.y > Vars.world.unitHeight()) this.velocity().y -= ((this.y - Vars.world.unitHeight()) / warpDst);
			
			this.drownTime = 0;
			this.move(this.velocity().x * Time.delta(), this.velocity().y * Time.delta());
			
			this.velocity().scl(Mathf.clamp(1 - this.drag() * Time.delta()));
		},
		
		updateSegmentVelocity(){
			for(var j = 0; j < totalSegments; j++){
				var tmpC = this.getSegments()[1];
				var tmpD = this.getSegments()[0];
				//tmpC[j].limit(this.maxVelocity()).scl((1 + (this.status.getSpeedMultiplier() - 1)) * Time.delta());
				tmpC[j].limit(this.maxVelocity());
				//tmpC[j].scl((1 + (this.status.getSpeedMultiplier() - 1)));
				var angleB = j != 0 ? Angles.angle(tmpD[j].x, tmpD[j].y, tmpD[j - 1].x, tmpD[j - 1].y) : angleB = Angles.angle(tmpD[j].x, tmpD[j].y, this.x, this.y);
				var velocity = j != 0 ? tmpC[j - 1].len() : this.velocity().len();
				/*if(j != 0){
					//angleB = Angles.angle(tmpC[j].x, tmpC[j].y, tmpC[j - 1].x, tmpC[j - 1].y);
					angleB = Angles.angle(tmpD[j].x, tmpD[j].y, tmpD[j - 1].x, tmpD[j - 1].y);
					velocity = tmpC[j - 1].len();
				}else{
					angleB = Angles.angle(tmpD[j].x, tmpD[j].y, this.x, this.y);
					velocity = this.velocity().len();
				};*/
				var trueVel = Math.max(velocity, tmpC[j].len());
				
				tempVec.trns(angleB, trueVel);
				//tempVec.scl(0.5);
				tmpC[j].add(tempVec);
				tmpC[j].setLength(trueVel);
				
				if(this.getTeam() != Vars.state.rules.waveTeam){
					var relativeSize = Vars.state.rules.dropZoneRadius + (this.getSize() / 2) + 1;
					Vars.spawner.getGroundSpawns().each(cons(spawn => {
						if(Mathf.within(tmpD[j].x, tmpD[j].y, spawn.worldx(), spawn.worldy(), relativeSize)){
							Tmp.v1.set(tmpD[j].x, tmpD[j].y);
							Tmp.v1.sub(spawn.worldx(), spawn.worldy());
							Tmp.v1.setLength(0.1 + 1 - this.dst(spawn) / relativeSize);
							Tmp.v1.scl(0.45 * Time.delta());
							tmpC[j].add(Tmp.v1);
							Tmp.v1.setZero();
						}
					}));
				};
				//tmpC[j].set(tempVec);
			};
			//applies time delta scale.
			for(var p = 0; p < totalSegments; p++){
				var tmpC = this.getSegments()[1];
				tmpC[p].scl((1 + (this.status.getSpeedMultiplier() - 1)) * Time.delta());
			};
		},
		
		updateSegments(){
			//tempVec2.trns(this.velocity().angle() + 180, segmentOffset);
			tempVec2.trns(Angles.angle(this.getSegments()[0][0].x, this.getSegments()[0][0].y, this.x, this.y) + 180, segmentOffset);
			tempVec2.add(this.x, this.y);
			this.getSegments()[0][0].set(tempVec2);
			//var angleC = Angles.angle(this.getSegments()[0][0].x, this.getSegments()[0][0].y, this.x, this.y);
			//this.getSegments()[2][0].set(this.getSegments()[0][0].x, this.getSegments()[0][0].y);
			//this.getSegments()[2][0].rotation = angleC;
			//this.getSegments()[2][0].updateCustom();
			for(var g = 1; g < totalSegments; g++){
				var tmpB = this.getSegments()[0];
				//var tmpQ = this.getSegments()[2];
				var angle = Angles.angle(tmpB[g].x, tmpB[g].y, tmpB[g - 1].x, tmpB[g - 1].y);
				tempVec.trns(angle, segmentOffset);
				tmpB[g].set(tmpB[g - 1]);
				tmpB[g].sub(tempVec);
				//tmpQ[g].set(tmpB[g].x, tmpB[g].y);
				//tmpQ[g].rotation = angle;
				//tmpQ[g].updateCustom();
			};
			for(var h = 0; h < totalSegments; h++){
				var tmpC = this.getSegments()[0][h];
				var tmpQ = this.getSegments()[2][h];
				var vel = this.getSegments()[1][h];
				//var angleD = h == 0 ? Angles.angle(tmpC.x, tmpC.y, this.x, this.y) : tmpC.x, tmpC.y, this.getSegments()[0][h - 1].x, this.getSegments()[0][h - 1].y);
				tmpC.add(vel);
				var angleD = h == 0 ? Angles.angle(tmpC.x, tmpC.y, this.x, this.y) : Angles.angle(tmpC.x, tmpC.y, this.getSegments()[0][h - 1].x, this.getSegments()[0][h - 1].y);
				tmpQ.velocity().set(vel);
				vel.scl(Mathf.clamp(1 - this.drag() * Time.delta()));
				tmpQ.set(tmpC.x, tmpC.y);
				tmpQ.rotation = angleD;
				tmpQ.updateCustom();
			};
		},
		
		added(){
			this.super$added();
			
			tempVec2.set(0, 0);
			
			for(var v = 0; v < this.getSegments()[0].length; v++){
				tempVec.trns(this.rotation + 180 + (v * (360 / (totalSegments / 2))), segmentOffset);
				tempVec.add(tempVec2);
				tempVec2.set(tempVec);
				this.getSegments()[0][v].set(this.x + tempVec.x, this.y + tempVec.y);
				this.getSegments()[2][v].set(this.x + tempVec.x, this.y + tempVec.y);
				this.getSegments()[2][v].add();
				//this.getSegments()[2][v].setType(this.getType());
				this.getSegments()[2][v].setOwner(this);
				//this.getSegments()[2][v].setTeam(this.getTeam());
				this.getSegments()[2][v].updateStatusC();
			}
		}
	});
	stormMainB.setFireSeq(0);
	stormMainB.customSetRect();
	stormMainB.setSegments();
	return stormMainB;
});

const stormWeap = extendContent(Weapon, "storm-equip", {});
stormWeap.bullet = stormBullet;
stormWeap.width = 0;
stormWeap.length = 0;
stormWeap.alternate = true;
stormWeap.ignoreRotation = true;
stormWeap.reload = 63;
stormWeap.shootSound = Sounds.shootSnap;

const stormType = extendContent(UnitType, "storm-unit", {
	load(){
		this.super$load();
		this.segmentRegion = Core.atlas.find(this.name + "-segment");
		this.tailRegion = Core.atlas.find(this.name + "-tail");
	},
	
	sRegion(){
		return this.segmentRegion;
	},
	
	tRegion(){
		return this.tailRegion;
	}
});
stormType.localizedName = "Storm Devourer";
stormType.create(stormMain);
stormType.description = "The daughter of the Devourer.";
stormType.weapon = stormWeap;
stormType.engineSize = 0;
stormType.engineOffset = 0;
stormType.flying = true;
stormType.health = 24000;
stormType.mass = 4;
stormType.hitsize = segmentOffset / 1.35;
stormType.speed = 0.31;
stormType.drag = 0.09;
stormType.attackLength = 170;
stormType.range = 180;
stormType.maxVelocity = 4.92;
stormType.shootCone = 130;
stormType.rotatespeed = 0.0012;
stormType.baseRotateSpeed = 0.005;

const stormSegment = extendContent(UnitType, "storm-unit-segment", {
	isHidden(){
		return true;
	}
});
stormSegment.localizedName = "Storm Segment";
stormSegment.create(falseUnit);
stormSegment.description = "Used to prevent duplication on reload, dont spawn";
stormSegment.weapon = stormWeap;
stormSegment.engineSize = 0;
stormSegment.engineOffset = 0;
stormSegment.flying = true;
stormSegment.health = 24000;
stormSegment.mass = 4;
stormSegment.hitsize = segmentOffset / 1.35;
stormSegment.speed = 0.31;
stormSegment.drag = 0.09;
stormSegment.attackLength = 170;
stormSegment.range = 180;
stormSegment.maxVelocity = 4.92;
stormSegment.shootCone = 130;
stormSegment.rotatespeed = 0.0012;
stormSegment.baseRotateSpeed = 0.005;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = stormType;*/