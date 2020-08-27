const elib = require("effectlib");
const spritelib = require("spritebatchcustom");
const blockLib = require("blockscore");

const tempVec = new Vec2();
const tempVec2 = new Vec2();

const blendCustomA = [Gl.srcAlphaSaturate, Gl.oneMinusSrcAlpha];

const disableEffect = elib.newEffectWDraw(21, 400, e => {
	const tex = Core.atlas.find("advancecontent-circle-large");
	var lastBatch = Core.batch;
	var lastProj = Draw.proj();
	var lastTrns = Draw.trans();
	Draw.flush();
	Core.batch = spritelib.getCustomBatch();
	Draw.trans(lastTrns);
	Draw.proj(lastProj);
	
	spritelib.blendingCustom(blendCustomA[0], blendCustomA[1]);
	
	Draw.color(Color.white);
	Draw.alpha(Interpolation.exp10Out.apply(e.fout()));
	
	//Fill.circle(e.x, e.y, e.finpow() * 210);
	Draw.rect(tex, e.x, e.y, e.finpow() * 210 * 2, e.finpow() * 210 * 2);
	
	spritelib.blendReset();
	
	Draw.flush();
	Draw.reset();
	Core.batch = lastBatch;
	Draw.proj(lastProj);
	Draw.trans(lastTrns);
});

const getWithin = (tile, tileArray) => {
	/*if(tileArray.length == 0) return false;
	for(var i = 0; i < tileArray.length; i++){
		if(tile.within(tileArray[i], 210)){
			return true;
		}
	};*/
	var out = false;
	tileArray.each(boolf(tileA => tileA != null), cons(tileB => {
		if(tile.within(tileB, 160) && !out) out = true;
	}));
	return out;
};

//const scannedTiles = new Packages.arc.struct.Array(1023);
var scannedTiles = new Packages.arc.struct.Array(32);

Events.on(EventType.WorldLoadEvent, cons(event => {
	var scanned = [];
	var arraySize = Mathf.round((Vars.world.width() * Vars.world.height()) / 4);
	scannedTiles = new Packages.arc.struct.Array(arraySize);
	for(var x = 0; x < Vars.world.width(); x += 2){
		worldY:
		for(var y = 0; y < Vars.world.height(); y += 2){
			//if(((x + y) % 3) != 1) continue worldY;
			var tx = Mathf.clamp(x, 0, Vars.world.width() - 1);
			var ty = Mathf.clamp(y, 0, Vars.world.height() - 1);
			var lt = Vars.world.ltile(tx, ty);
			
			if(lt == null || scanned.indexOf(lt) != -1) continue worldY;
			
			if(!lt.isDead() && !lt.ent().isDead() && !getWithin(lt, scannedTiles) && blockLib.getOpBlocks().getOr(lt.block(), prov(() => 0)) >= 1){
				scannedTiles.add(lt);
				//print(lt);
			};
			scanned.push(lt);
		}
	};
	scanned = [];
}));
Events.on(EventType.BlockBuildEndEvent, cons(event => {
	if(!event.breaking && !scannedTiles.contains(event.tile, true) && !getWithin(event.tile, scannedTiles) && blockLib.getOpBlocks().getOr(event.tile.block(), prov(() => 0)) >= 1) scannedTiles.add(event.tile);
	if(event.breaking && scannedTiles.contains(event.tile, true)) scannedTiles.remove(event.tile, true);
	//print(event.tile + ":" + event.breaking);
}));
Events.on(EventType.BlockDestroyEvent, cons(event => {
	if(scannedTiles.contains(event.tile, true)) scannedTiles.remove(event.tile, true);
	//print(event.tile);
}));

const stepEffect = elib.newGroundEffect(26, 26, e => {
	Draw.color(Tmp.c1.set(e.color).mul(1.1));
	
	const hm = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, (e.fout() * 7) + 0.3);
	}});
	
	Angles.randLenVectors(e.id, 12, e.rotation * e.finpow(), hm);
});
const stepRipple = elib.newGroundEffect(26, 26, e => {
	Draw.color(Tmp.c1.set(e.color).mul(1.2).add(0.2, 0.2, 0.2));
	Lines.stroke(e.fout() + 0.4);
	Lines.circle(e.x, e.y, 3 + (e.fin() * e.rotation));
});

const altLeg = prov(() => {
	var legB = extend(RubbleDecal, {
		_targetPosition: new Vec2(),
		_lastPos: new Vec2(),
		_owner: null,
		_progress: 0,
		_flipped: false,
		_effectSize: 0,
		addProgress(a){
			this._progress += Mathf.clamp(a);
			this._progress = Mathf.clamp(this._progress);
		},
		getFloor(){
			tileA = Vars.world.tileWorld(this._targetPosition.x, this._targetPosition.y);
			
			return tileA == null ? Blocks.air : tileA.floor();
		},
		stepEffectC(){
			if(!this.getFloor().isLiquid){
				Effects.effect(stepEffect, this.getFloor().color, this._targetPosition.x, this._targetPosition.y, this._effectSize);
				Sounds.bang.at(this._targetPosition.x, this._targetPosition.y, Mathf.random(0.9, 1.1) * 0.5);
			}else{
				Effects.effect(stepRipple, this.getFloor().color, this._targetPosition.x, this._targetPosition.y, this._effectSize);
				Sounds.splash.at(this._targetPosition.x, this._targetPosition.y, Mathf.random(0.9, 1.1) * 0.65);
			};
			if(this._effectSize / 26 > 0.1){
				Effects.shake(this._effectSize / 26, this._effectSize / 26, this._targetPosition.x, this._targetPosition.y);
			};
		},
		setProgress(){
			this._lastPos.set(this._targetPosition);
			this.stepEffectC();
			this._progress = 0;
			//this._targetPosition.set(this._lastPos);
		},
		isFlipped(){
			return this._flipped;
		},
		setC(entity, flip){
			this._targetPosition = new Vec2();
			this._lastPos = new Vec2();
			this._owner = entity;
			this._progress = 0;
			this._flipped = flip;
			this._effectSize = 34;
			//this._stepped = false;
		},
		/*steppedC(){
			return this._stepped;
		},*/
		resetA(vec){
			this._targetPosition.set(vec);
			this._lastPos.set(vec);
		},
		setTargetPos(vec){
			this._targetPosition.set(vec);
		},
		updateC(){
			//this._stepped = false;
			if(this._progress >= 1){
				this._progress = 0;
				this._lastPos.set(this._targetPosition);
				var indexA = this._owner.getSequence();
				for(var i = 0; i < this._owner.getResetGroup()[indexA].length; i++){
					this._owner.getLegs()[this._owner.getResetGroup()[indexA][i]].setProgress();
				};
				this._owner.updateLegIndex();
				//this._stepped = true;
			};
		},
		drawC(){
			var trg = this._targetPosition;
			var lst = this._lastPos;
			var own = this._owner;
			var tProg = Interpolation.pow2.apply(this._progress);
			var fProg = Interpolation.pow4.apply(this._progress);
			
			var flip = Mathf.sign(this._flipped);
			
			var fRegion = own.getType().lRF();
			var ftRegion = own.getType().fRf();
			var knRegion = own.getType().kRF();
			
			var angleFA = Angles.angle(own.x, own.y, lst.x, lst.y);
			var angleFB = Angles.angle(own.x, own.y, trg.x, trg.y);
			
			var dstFA = Mathf.dst(own.x, own.y, lst.x, lst.y) / 2;
			var dstFB = Mathf.dst(own.x, own.y, trg.x, trg.y) / 2;
			
			var dstFC = Mathf.lerp(dstFA, dstFB, fProg);
			var angleFC = Mathf.slerp(angleFA, angleFB, fProg);
			
			tempVec.trns(angleFC - 90, 0, dstFC);
			
			var tx = own.x + tempVec.x;
			var ty = own.y + tempVec.y;
			
			var angleTA = Angles.angle(tx, ty, lst.x, lst.y);
			var angleTB = Angles.angle(tx, ty, trg.x, trg.y);
			
			var dstTA = Mathf.dst(tx, ty, lst.x, lst.y);
			var dstTB = Mathf.dst(tx, ty, trg.x, trg.y);
			
			var dstTC = Mathf.lerp(dstTA, dstTB, tProg);
			var angleTC = Mathf.slerp(angleTA, angleTB, tProg);
			
			tempVec2.trns(angleTC - 90, 0, dstTC);
			tempVec2.add(tx, ty);
			
			var footAngle = Angles.angle(own.x, own.y, tempVec2.x, tempVec2.y);
			
			Draw.rect(ftRegion, tempVec2.x, tempVec2.y, ftRegion.getWidth() * flip * Draw.scl, ftRegion.getHeight() * Draw.scl, footAngle - 90);
			
			Draw.rect(fRegion, own.x, own.y, fRegion.getWidth() * flip * Draw.scl, ((dstFC * 8) + 2) * Draw.scl, angleFC - 90);
			
			Draw.rect(fRegion, tx, ty, fRegion.getWidth() * flip * Draw.scl, ((dstTC * 8) + 4) * Draw.scl, angleTC - 90);
			Draw.rect(knRegion, tx, ty, knRegion.getWidth() * flip * Draw.scl, knRegion.getHeight() * Draw.scl, angleTC - 90);
		}
	});
	return legB;
});

const maxChargeTime = 3 * 60;

const pandoraBulletTrail = newEffect(121, e => {
	Draw.color(Color.white, Color.valueOf("c1c1c1"), e.fin());
	const hz = new Floatc2({get: function(x, y){
		//const ang = Mathf.angle(x, y);
		Fill.poly(e.x + x, e.y + y, 4, e.fout() * 2.6, 0);
	}});
	
	Angles.randLenVectors(e.id, 3, 3 + e.fout() * 10.0, e.rotation, 360.0, hz);
	Draw.reset();
});

const pandoraBullet = extend(BasicBulletType, {
	update(b){
		//print(b + " : " + b.getData());
		if(b.getData() == null){
			//b.deflect();
			b.time(this.lifetime);
			return;
		};
		if(Mathf.chance(0.7 * Time.delta())){
			Effects.effect(pandoraBulletTrail, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		};
		var momentum = Mathf.clamp(b.time() / 80);
		b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(b.getData().x, b.getData().y), 0.7 * (Mathf.clamp((670 - (b.dst(b.getData().x, b.getData().y) / 3)) / 670) + 0.02) * momentum));
		b.velocity().setLength(this.speed);
		if(b.within(b.getData().x, b.getData().y, Vars.tilesize * 2.5)){
			b.time(this.lifetime);
		};
	},
	
	hitC(b){
		const rangeC = 210;
		var indexed = [];
		const rangeTile = Mathf.round(rangeC / Vars.tilesize);
		const offset = ((rangeTile + 1) % 2) * (Vars.tilesize / 2);
		for(var tx = -rangeTile; tx < rangeTile; tx++){
			tileYLoop:
			for(var ty = -rangeTile; ty < rangeTile; ty++){
				var zx = ((tx * Vars.tilesize) + offset) + b.x;
				var zy = ((ty * Vars.tilesize) + offset) + b.y;
				tileA = Vars.world.ltileWorld(zx, zy);
				if(indexed.lastIndexOf(tileA) != -1 || tileA == null) continue tileYLoop;
				if(!tileA.within(b, rangeC)) continue tileYLoop;
				if(tileA != null && tileA.ent() != null && !tileA.ent().isDead() && tileA.getTeam() != b.getTeam()){
					if(blockLib.getOpBlocks().get(tileA.block()) >= 1){
						tileA.ent().kill();
					};
					if(tileA.ent() != null){
						if(!tileA.ent().isDead()) indexed.push(tileA);
					}
				}
			};
		};
	},
	
	despawned(b){
		Effects.effect(this.despawnEffect, b.x, b.y, b.rot());
		this.hitSound.at(b);
		
		if(this.splashDamageRadius > 0){
			this.hit(b, b.x, b.y);
		};
		
		this.hitC(b);
	}
});
pandoraBullet.damage = 118;
pandoraBullet.speed = 5.6;
pandoraBullet.lifetime = 5 * 60;
pandoraBullet.splashDamage = 76;
pandoraBullet.splashDamageRadius = 80;
pandoraBullet.collidesTiles = false;
pandoraBullet.collidesAir = false;
pandoraBullet.collides = false;
pandoraBullet.bulletWidth = 16;
pandoraBullet.bulletHeight = 19;
pandoraBullet.bulletShrink = 0;
pandoraBullet.frontColor = Color.white;
pandoraBullet.backColor = Color.valueOf("c1c1c1");

const pandoraResistance = 0.625;

const pandoraMain = prov(() => {
	pandoraMainB = extend(GroundUnit, {
		setLegs(){
			this._deathTime = 0;
			this._legHeight = [-123.5, -123.5, 0, 0, 123.5, 123.5];
			this._legs = [];
			this._resetGroup = [[0, 5], [2, 3], [1, 4]];
			this._sequence = 0;
			this._legProgress = 0;
			this._legStepped = false;
			
			for(var i = 0; i < 6; i++){
				var sign = Mathf.sign(i % 2);
				
				tempVec.set(this.x, this.y);
				
				this._legs[i] = altLeg.get();
				this._legs[i].setC(this, i % 2 == 0);
				this._legs[i].resetA(tempVec);
			}
		},
		updateLegIndex(){
			if(this.getTimer().get(5, 15)){
				this._sequence = (this._sequence + 1) % this._resetGroup.length;
			};
		},
		getSequence(){
			return this._sequence;
		},
		getResetGroup(){
			return this._resetGroup;
		},
		getLegs(){
			return this._legs;
		},
		update(){
			this.super$update();
			this.updateLegs();
			if(Units.invalidateTarget(this.target, this) && this.stuckTime < 10){
				this._deathTime -= Time.delta();
				this._deathTime = Math.max(this._deathTime, 0);
			};
			if(this.stuckTime > 10 && this.target != null){
				this._deathTime += Time.delta();
			};
			if(this._deathTime >= maxChargeTime){
				this.explode();
				this.kill();
			};
		},
		explode(){
			Effects.effect(disableEffect, this.x, this.y);
			
			Damage.damage(this.getTeam(), this.x, this.y, 240, 390);
			
			/*var blocks = Vars.indexer.getEnemy(this.getTeam(), BlockFlag.producer);
			var blockAlt = Units.findEnemyTile(this.getTeam(), this.x, this.y, 1210, boolf(a => a.block() instanceof SolarGenerator || a.block() instanceof PowerSource));
			var group = [];
			
			if(blockAlt != null && blockAlt.tile != null){
				group.push(blockAlt.tile);
			};
			
			print(blocks);
			
			blocks.each(boolf(a => a.block() instanceof PowerGenerator || a.block() instanceof PowerSource), cons(tile => {
				if(this.within(tile, 2250) && blockLib.powerScore().get(tile.block()) >= 1 && !getWithin(tile, group)){
					group.push(tile);
				}
			}));
			if(group.length == 0) return;
			for(var t = 0; t < group.length; t++){
				var ang = Mathf.random(360);
				var bulletA = Bullet.create(pandoraBullet, this, this.getTeam(), this.x, this.y, ang, 1, 1, group[t]);
				bulletA.scaleTime(t);
			};
			print(group);*/
			var offsetTime = 0;
			scannedTiles.each(boolf(item => item != null), cons(tile => {
				if(tile.getTeam() == this.getTeam()) return;
				var ang = Mathf.random(360);
				var bulletA = Bullet.create(pandoraBullet, this, this.getTeam(), this.x, this.y, ang, 1, 1, new Vec2(tile.worldx(), tile.worldy()));
				bulletA.scaleTime(offsetTime);
				offsetTime += 1;
			}));
		},
		behavior(){
			if(!Units.invalidateTarget(this.target, this)){
				if(this.dst(this.target) < Math.max(this.getWeapon().bullet.range(), this.getType().range)){
					
					this.rotate(this.angleTo(this.target));
					
					this._deathTime += Time.delta();
					
					/*if(this._deathTime >= maxChargeTime){
						this.explode();
						this.kill();
					};*/
					
					/*if(Angles.near(angleTo(target), rotation, 13f)){
						BulletType ammo = getWeapon().bullet;
						
						Vec2 to = Predict.intercept(GroundUnit.this, target, ammo.speed);
						
						getWeapon().update(GroundUnit.this, to.x, to.y);
					}*/
				}
			}
		},
		calculateDamage(amount){
			var trueAmount = Mathf.clamp(amount, 0, 290);
			if(amount > 395) this._deathTime += (amount - 393) / 2;
			if(this._deathTime >= maxChargeTime && this.health() - (trueAmount * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * pandoraResistance) <= 0){
				this.explode();
				//this.kill();
			};
			return trueAmount * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * pandoraResistance;
		},
		updateLegs(){
			for(var m = 0; m < this._resetGroup[this._sequence].length; m++){
				var groupA = this.getResetGroup()[this._sequence];
				var wd = this.getLegs()[groupA[m]].isFlipped() ? 1 : -1;
				var prog = this.stuckTime < 1 ? 0.035 * Time.delta() : 0;
				
				tempVec.trns(this.baseRotation - 90, 123.5 * wd, this._legHeight[groupA[m]]);
				tempVec.setLength(96.5);
				tempVec2.trns(this.baseRotation - 90, 0, 80 * this.velocity().len());
				tempVec.add(tempVec2);
				tempVec.add(this.x, this.y);
				
				this.getLegs()[groupA[m]].addProgress(prog);
				this.getLegs()[groupA[m]].setTargetPos(tempVec);
				this.getLegs()[groupA[m]].updateC();
			};
		},
		draw(){
			this.drawLegs();
			
			this.super$draw();
			
			if(this._deathTime < 0.0001) return;
			Draw.alpha(this._deathTime / maxChargeTime);
			Draw.blend(Blending.additive);
			Draw.rect(this.getType().lightReg(), this.x, this.y, this.rotation - 90);
			Draw.blend();
		},
		drawLegs(){
			for(var d = 0; d < this.getLegs().length; d++){
				this.getLegs()[d].drawC();
			}
		},
		added(){
			this.super$added();
			this.setLegs();
			//this.setShield();
		}
	});
	//pandoraMainB.setLegs();
	pandoraMainB.timer = new Interval(6);
	return pandoraMainB;
});

const pandoraWeap = extendContent(Weapon, "advancecontent-pandora-equip", {});
pandoraWeap.bullet = Bullets.standardMechSmall;

const pandora = extendContent(UnitType, "pandora", {
	load(){
		this.super$load();
		
		this.legRegion = Core.atlas.find("clear");
		this.baseRegion = Core.atlas.find("clear");
		
		this.lightRegion = Core.atlas.find(this.name + "-light");
		
		this.legRegionB = Core.atlas.find(this.name + "-leg");
		this.kneeRegionB = Core.atlas.find(this.name + "-knee");
		this.footRegionB = Core.atlas.find(this.name + "-foot");
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
		var resistance = (1 - pandoraResistance) * 100;
		table.add("Damage Resistance: " + resistance.toFixed(1) + "%").color(Color.lightGray);
		table.row();
		table.row();
	},
	lightReg(){
		return this.lightRegion;
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
pandora.localizedName = "Pandora";
pandora.create(pandoraMain);
pandora.description = "The jar that brought evil in another universe, now brings balance here.";
pandora.health = 24000;
pandora.hitsize = 50;
pandora.hitsizeTile = 13;
pandora.weapon = pandoraWeap;
pandora.flying = false;
pandora.mass = 50;
pandora.drag = 0.45;
pandora.speed = 0.3;
pandora.range = 290;
pandora.maxVelocity = 1.1;
pandora.rotatespeed = 0.07;
pandora.baseRotateSpeed = 0.00002;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = pandora;*/