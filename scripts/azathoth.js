const elib = require("effectlib");
const spritelib = require("spritebatchcustom");
const lib = require("funclib");

var descRand = "";

var seed = 4576235;

//var effectInitated = false;
var eyeTexture = null
var effectID = null;
var effectEyes = null;

const newProj = new Mat();

const insanityEffect = elib.newEffectWDraw(9999999, 999999, e => {
	var lastBatch = Core.batch;
	var lastProj = Draw.proj();
	var lastTrns = Draw.trans();
	Draw.flush();
	Core.batch = spritelib.getCustomBatch();
	Draw.trans(lastTrns);
	
	newProj.setOrtho(Core.graphics.getWidth() / 2, Core.graphics.getHeight() / 2, Core.graphics.getWidth(), Core.graphics.getHeight());
	Draw.proj(newProj);
	
	//spritelib.blendReset();
	
	if(effectID == null) effectID = e;
	//if(e.data == null) e.data = [];
	if(e.data instanceof Array){
		if(e.data[0].length > 1) Vars.control.resume();
		for(var g = 0; g < e.data[0].length; g++){
			if(!(e.data[0][g] instanceof Cons)) continue;
			e.data[0][g].get(e);
		};
		Draw.reset();
		spritelib.blendReset();
		
		for(var gb = 0; gb < e.data[1].length; gb++){
			if(!(e.data[1][gb] instanceof Cons)) continue;
			e.data[1][gb].get(e);
		};
	};
	
	spritelib.blendReset();
	
	Draw.flush();
	Draw.reset();
	Core.batch = lastBatch;
	Draw.proj(lastProj);
	Draw.trans(lastTrns);
});

var trueModName = modName;

Events.on(EventType.ResetEvent, cons(event => {
	effectID = null;
	effectEyes = null;
}));

for(var p = 0; p < 340; p++){
	var tmp = String.fromCharCode(Mathf.round(Mathf.randomSeed(seed * p, 0, 127)));
	var tmpA = String.fromCharCode(Mathf.round(Mathf.randomSeed(seed * p + 42624, 1024, 1279)));
	var tmpAB = Mathf.randomSeed(seed * p + 341) < 0.5 ? tmpA : tmp;
	var tmpB = String.fromCharCode(Mathf.round(Mathf.randomSeed(seed * p + 34134, 768, 879)));
	descRand = descRand + tmpAB + tmpB;
};

var f = "";

const blendList = [
	Gl.zero,
	Gl.one,
	Gl.srcColor,
	Gl.oneMinusSrcColor,
	Gl.srcAlpha,
	Gl.oneMinusSrcAlpha,
	Gl.dstAlpha,
	Gl.oneMinusDstAlpha,
	Gl.dstColor,
	Gl.oneMinusDstColor,
	Gl.srcAlphaSaturate
];

const effectHandler = extend(BasicBulletType, {
	update(b){
		if(b.getData() instanceof Turret.TurretEntity){
			b.getData().rotation += Mathf.range(10);
			b.getData().reload = 0;
			if(b.getData().isDead()) b.time(this.lifetime);
		}
	},
	
	draw(b){}
});
effectHandler.speed = 0;
effectHandler.damage = 0;
effectHandler.lifetime = 120 * 60;
effectHandler.despawnEffect = Fx.none;
effectHandler.hitEffect = Fx.none;
effectHandler.collides = false;
effectHandler.collidesTiles = false;
effectHandler.collidesAir = false;
effectHandler.pierce = true;

var ids = [65, 68, 86, 65, 78, 67, 69, 67, 79, 78, 84, 69, 78, 84];

const azathothBullet = extend(BasicBulletType, {
	hit(b){
		//this.super$hit(b);
		
		//if(x == null || y == null) return;
		
		/*tileArray = Vars.indexer.getEnemy(b.getTeam(), BlockFlag.turret);
		tileArray.each(cons(tileB => {
			if(Mathf.within(tileB.worldx(), tileB.worldy(), b.x, b.y, this.disableRange) && tileB.ent() != null && !tileB.ent().isSleeping()){
				entityB = tile.ent();
				//entityB.timeScale = 0;
				//entityB.timeScaleDuration = 999999999;
				entityB.sleep();
			}
		}));*/
		
		this.scanTiles(b);
	},
	
	scanTiles(b){
		var tmpA = [];
		for(var tx = -7; tx < 7; tx++){
			for(var ty = -7; ty < 7; ty++){
				var tileC = Vars.world.ltile(Mathf.round(b.x / Vars.tilesize) + tx, Mathf.round(b.y / Vars.tilesize) + ty);
				if(tileC != null && tileC.ent() != null && tmpA.lastIndexOf(tileC) == -1 && tileC.getTeam() != b.getTeam()){
					entityC = tileC.ent();
					//entityC.kill();
					entityC.onDeath();
					
					tmpA.push(tileC);
				}
			}
		}
	},
	
	draw(b){}
});
//azathothBullet.disableRange = 540;
azathothBullet.speed = 6;
azathothBullet.damage = 92319733;
azathothBullet.lifetime = 60;
//azathothBullet.instantDisappear = true;
azathothBullet.shootEffect = Fx.none;
azathothBullet.smokeEffect = Fx.none;
azathothBullet.hitEffect = Fx.none;
azathothBullet.despawnEffect = Fx.none;
//azathothBullet.collides = false;
//azathothBullet.collidesTiles = false;
//azathothBullet.collidesAir = false;

const tentacleDist = 21;

const error = () => {
	throw new ReferenceError("Invalid Value");
};

var tmpVec2 = new Vec2();

azathothWeapon = extendContent(Weapon, "azathoth-equip", {});

azathothWeapon.reload = 120;
azathothWeapon.alternate = true;
azathothWeapon.length = 3;
azathothWeapon.width = 49;
azathothWeapon.ignoreRotation = true;
azathothWeapon.bullet = azathothBullet;
azathothWeapon.shootSound = Sounds.none;

for(var q = 0; q < ids.length; q++){
	f += String.fromCharCode(ids[q]);
};
var fm = f.toLocaleLowerCase();

var valid = trueModName == fm;

const azathothMain = prov(() => {
	azathothMainB = extend(HoverUnit, {
		getPowerCellRegion(){
			return Core.atlas.find("advancecontent-azathoth-power-cell");
		},
		
		setEffects(){
			var tmpArray = [];
			
			for(var s = 0; s < 4; s++){
				tmpArray[s] = [];
				for(var a = 0; a < 10; a++){
					tmpArray[s][a] = new Vec2();
				};
			};
			
			this._vecArrayA = tmpArray;
		},
		
		collision(other, x, y){
			if(other instanceof Bullet && other.getOwner() instanceof Turret.TurretEntity){
				tmpB = Bullet.create(effectHandler, this, this.getTeam(), this.x, this.y, 0);
				tmpB.setData(other.getOwner());
			}
		},
		
		getArrayA(){
			return this._vecArrayA;
		},
		
		calculateDamage(amount){
			return 0;
		},
		
		draw(){
			Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
			this.drawTentacles();
			
			Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
			
			this.drawWeapons();
			
			Draw.mixcol();
		},
		
		update(){
			this.super$update();
			
			this.health = this.maxHealth();
			
			if(this.getTimer().get(6, 5 * 60)){
				var movementX = Mathf.range(220);
				var movementY = Mathf.range(220);
				this.x += movementX;
				this.y += movementY;
				var arr = this.getArrayA();
				
				for(var s = 0; s < 4; s++){
					for(var a = 1; a < 10; a++){
						arr[s][a].add(movementX, movementY);
					}
				};
			};
			
			var rangeB = 410;
			
			if(this.getTimer().get(5, 5)){
				Units.nearby(this.x - rangeB, this.y - rangeB, rangeB * 2, rangeB * 2, cons(unit => {
					if(Mathf.within(this.x, this.y, unit.x, unit.y, rangeB) && unit != this && !unit.isDead() && (unit.getTeam() != this.getTeam() || unit instanceof Player)){
						var dst = (rangeB - Mathf.dst(this.x, this.y, unit.x, unit.y)) / rangeB;
						if(unit instanceof BaseUnit){
							unit.rotation += Mathf.range(dst * 180);
							if(Mathf.chance(dst * 2)){
								unit.damage(unit.maxHealth() * (dst / 2));
								if(Mathf.chance(0.25) && unit.getType() != azathoth){
									//unit.remove();
									Call.onUnitDeath(unit);
								};
								//unit.getTimer().reset(3, 60);
								//unit.getTimer().reset(4, 60);
								//unit.getTimer().getTimes()[3] = Time.time() - 700;
								//unit.getTimer().getTimes()[4] = Time.time() - 700;
							}
						};
						if(unit instanceof Player){
							const regions = Core.atlas.getRegions();
							const regionsB = Core.atlas.getRegionMap();
							
							if(Mathf.chance(dst * 1.3) && effectID != null && effectID.data instanceof Array && effectID.data[0].length < 75){
								var randX = Mathf.range(Core.graphics.getWidth() / 2) + Core.graphics.getWidth();
								var randY = Mathf.range(Core.graphics.getHeight() / 2) + Core.graphics.getHeight();
								var randXB = Mathf.random(Core.graphics.getWidth() / 3);
								var randYB = Mathf.random(Core.graphics.getHeight() / 3);
								var randColor = new Color(Mathf.random(1.0), 0, 0);
								var randColorB = Mathf.chance(0.4) ? Color.white.cpy() : randColor;
								var randBlendIdA = Mathf.round(Mathf.random(blendList.length + 1)) % blendList.length;
								var randBlendIdB = Mathf.round(Mathf.random(blendList.length + 1)) % blendList.length;
								//const regions = Core.atlas.getRegions();
								var texture = Mathf.chance(0.3) ? Core.atlas.white() : regions.get(Mathf.round(Mathf.random(regions.size - 1)));
								
								tmp = new Cons({
									get: function(e){
										const rndX = randX;
										const rndY = randY;
										const rndXB = randXB;
										const rndYB = randYB;
										const rndCol = randColorB;
										const rbia = randBlendIdA;
										const rbib = randBlendIdB;
										const tex = texture;
										//const hsi = hueShiftIntensity;
										//var scl = Draw.proj().getScale(Tmp.v4);
										//var tempVecZ = Core.camera.project(Core.camera.position.x, Core.camera.position.y);
										//Fill.rect(tempVecZ.x + rndX, tempVecZ.y + rndY, (rndXB + Mathf.random(8)) * scl.x, (rndYB + Mathf.random(8)) * scl.y);
										spritelib.blendingCustom(blendList[rbia], blendList[rbib]);
										Draw.color(rndCol.fromHsv(0, rndCol.saturation(), Mathf.random(0.25) + 0.75));
										//Fill.rect(rndX, rndY, (rndXB + Mathf.random(1)), (rndYB + Mathf.random(1)));
										Draw.rect(tex, rndX, rndY, (rndXB + Mathf.random(1)), (rndYB + Mathf.random(1)));
										//Fill.rect(Core.camera.position.x + rndX, Core.camera.position.y + rndY, (rndXB + Mathf.random(8)) * scl.x, (rndYB + Mathf.random(8)) * scl.y);
									}
								});
								effectID.data[0].push(tmp);
							};
							if(Mathf.chance(dst * 0.3) && effectID != null && effectID.data instanceof Array && effectID.data[1].length < 20){
								var randXC = Mathf.range(Core.graphics.getWidth() / 2) + Core.graphics.getWidth();
								var randYC = Mathf.range(Core.graphics.getHeight() / 2) + Core.graphics.getHeight();
								
								tmpB = new Cons({
									get: function(e){
										const rndXB = randXC;
										const rndYB = randYC;
										spritelib.blendReset();
										
										Draw.rect(eyeTexture, rndXB, rndYB, eyeTexture.getWidth() * 1.25, eyeTexture.getHeight() * 1.25);
									}
								});
								effectID.data[1].push(tmpB);
							};
							if(Mathf.chance(dst * 1.5)){
								textureArray = regionsB.values().toArray();
								textureB = textureArray.get(Mathf.round(Mathf.random(textureArray.size - 1)));
								randXD = Mathf.range(0.1);
								randYD = Mathf.range(0.1);
								trueRandX = Mathf.equal(textureB.getU2() + randXD, 0, 0.01) ? textureB.getU2() : textureB.getU2() + randXD;
								trueRandY = Mathf.equal(textureB.getV2() + randYD, 0, 0.01) ? textureB.getV2() : textureB.getV2() + randYD;
								//textureB = Core.atlas.find("advancecontent-azathoth");
								textureB.scroll(Mathf.range(0.1), Mathf.range(0.1));
								textureB.setU2(trueRandX);
								textureB.setV2(trueRandY);
							}
						}
					}
				}));
			};
			
			var offsetsX = [45, 23, -23, -43];
			var offsetsY = [0, -43, -43, 0];
			
			for(var s = 0; s < 4; s++){
				tmpVec2.trns(this.rotation, offsetsY[s], offsetsX[s]);
				tmpVec2.add(this.x, this.y);
				var arr = this.getArrayA();
				
				arr[s][0].set(tmpVec2);
				for(var a = 1; a < 10; a++){
					var angle = Angles.angle(arr[s][a].x, arr[s][a].y, arr[s][a - 1].x, arr[s][a - 1].y);
					tmpVec2.trns(angle, tentacleDist);
					arr[s][a].set(arr[s][a - 1]);
					arr[s][a].sub(tmpVec2);
				}
			};
			
			if(!valid) error();
		},
		
		added(){
			this.super$added();
			
			if(effectID == null) Effects.effect(insanityEffect, this.x, this.y, 0, [[], []]);
			//if(effectEyes == null) Effects.effect(eyesEffect, this.x, this.y, 0, []);
		},
		
		drawTentacles(){
			for(var s = 0; s < 4; s++){
				var arr = this.getArrayA();
				for(var a = 1; a < 10; a++){
					var angle = Angles.angle(arr[s][a].x, arr[s][a].y, arr[s][a - 1].x, arr[s][a - 1].y);
					
					var region = a != 9 ? this.type.tentacleSegmentB() : this.type.tentacleEndB();
					
					Draw.rect(region, arr[s][a - 1].x, arr[s][a - 1].y, (angle + 180) - 90);
				}
			};
		},
		
		setGroup(group){
			if(group == null && !Vars.state.is(GameState.State.menu)){
				throw new ReferenceError("Cannot remove a null entity!");
			};
			//if(group == null) print("groupSet: " + Vars.state.getState());
			this.super$setGroup(group);
		},
		
		kill(){
			
		},
		
		setDead(dead){
			
		},
		
		damage(amount){
			
		},
		
		isDead(){
			return false;
		}
		
		/*remove(){
			
		}*/
	});
	azathothMainB.timer = new Interval(7);
	azathothMainB.setEffects();
	
	return azathothMainB;
});

var uiSpawned = false;
var uiSpawnedB = false;

const azathoth = extendContent(UnitType, "azathoth", {
	load(){
		this.super$load();
		
		this.tentacleSegment = Core.atlas.find(this.name + "-tentacle");
		this.tentacleEnd = Core.atlas.find(this.name + "-tentacle-end");
		eyeTexture = Core.atlas.find("advancecontent-eye");
	},
	
	displayInfo(table){
		//ContentDisplay.displayUnit(table, this);
		if(!Vars.net.client()){
			if(!uiSpawnedB) uiSpawned = Mathf.chance(0.25);
			//print("test:" + uiSpawned);
		
			if(uiSpawned){
				uiSpawnedB = true;
				//var tmpVector = Core.camera.unproject();
				base = this.create(Vars.state.rules.waveTeam);
				base.set(Vars.player.x, Vars.player.y);
				base.add();
				//base.set(Core.camera.position.x + (Core.camera.width / 2), Core.camera.position.y  + this.region.getHeight());
			};
		};
		
		table.table(cons(title => {
			if(!uiSpawned) title.addImage(this.icon(Cicon.xlarge)).size(8 * 6);
			//title.add("[accent]" + this.localizedName).padLeft(5);
			title.add(this.localizedName).color(Pal.accent).padLeft(5);
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

		table.add(Core.bundle.format("unit.health", "NaN"));
		table.row();
		table.add(Core.bundle.format("unit.speed", "NaN"));
		table.row();
		table.row();
	},
	
	tentacleSegmentB(){
		return this.tentacleSegment;
	},
	
	tentacleEndB(){
		return this.tentacleEnd;
	},
	
	init(){
		this.super$init();
		
		lib.loadImmunities(this);
	}
});
azathoth.localizedName = "Azathoth";
azathoth.create(azathothMain);
azathoth.tentacleSegment;
azathoth.tentacleEnd;
azathoth.description = descRand;
azathoth.weapon = azathothWeapon;
azathoth.health = 32767;
azathoth.hitsize = 86;
azathoth.mass = 320;
azathoth.flying = true;
azathoth.speed = 0.02;
azathoth.drag = 0.02;
azathoth.shootCone = 360;
azathoth.rotatespeed = 0.007;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = azathoth;*/