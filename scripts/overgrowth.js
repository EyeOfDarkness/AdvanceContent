const primeColor = Color.valueOf("cbd97f");
const lib = require("funclib");

const OvergrowthShootEffect = newEffect(10, e => {
	const vec1 = new Vec2();
	const vec2 = new Vec2();
	const vec3 = new Vec2();
	
	for(var i = 0; i < 7; i++){
		var rndRot = Mathf.randomSeedRange(e.id + i, 45);
		var rndRot2 = Mathf.randomSeedRange(e.id + 15 + i, 45);
		var rndRot3 = Mathf.randomSeedRange(e.id + 30 + i, 45);
		var rndRot4 = Mathf.randomSeedRange(e.id + 45 + i, 30);
		var rndRange = Mathf.randomSeed(e.id + 7 + i, 25, 50) / 50;
		var rndStroke = Mathf.randomSeed(e.id + 16 + i, 35, 50) / 50;
		
		vec1.trns(rndRot * e.fout() + (e.rotation + rndRot4), 15 * e.finpow() * rndRange);
		vec2.trns(rndRot2 * e.fout() + (e.rotation + rndRot4), 30 * e.finpow() * rndRange);
		vec3.trns(rndRot3 * e.fout() + (e.rotation + rndRot4), 45 * e.finpow() * rndRange);
	
		var posAx = e.x + vec1.x;
		var posAy = e.y + vec1.y;
	
		var posBx = e.x + vec2.x;
		var posBy = e.y + vec2.y;
	
		var posCx = e.x + vec3.x;
		var posCy = e.y + vec3.y;
	
		Draw.color(primeColor);
		Lines.stroke((e.fout() * 2) * rndStroke);
		Lines.curve(e.x, e.y, posAx, posAy, posBx, posBy, posCx, posCy, 16);
	}
});

const grassLaser = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 14)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.lengthA + 40, false);
		};
	},
	
	draw: function(b){
		const colors = [primeColor.cpy().mul(0.5, 0.5, 0.5, 0.33), primeColor.cpy().mul(1, 1, 1, 0.66), primeColor, Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.28];
		const strokes = [2.1, 1.4, 1.1, 0.6];
		const lenscales = [1.0, 1.2, 1.27, 1.32];
		const tmpColor = new Color();
		const vec = new Vec2();
		//const baseLen = 310.0 * b.fout();
		for(var z = 0; z < 13; z++){
			var rnd1 = Mathf.randomSeedRange(b.id + z * 2, 86);
			var rnd2 = Mathf.randomSeedRange(b.id + z * 3, 18);
			var rnd3 = Mathf.randomSeed(b.id + z * 4, 0, 110);
			var rnd4 = Mathf.randomSeed(b.id + z * 5, 50, 90) / 10;
			var rnd5 = Mathf.randomSeedRange(b.id + z * 6, 4);
			vec.trns(b.rot(), rnd3);
			Draw.color(primeColor);
			lib.lineTentacleRenderer(b.x + vec.x, b.y + vec.y, b.rot() + (rnd1 * b.fout()), 2.5 * b.fout(), 0.2, 10, rnd4 * b.fin(), 4, 2, rnd2 * b.fout(), rnd5 * b.fout(), 12, 0);
		};
		
		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 4; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.0, 0.2)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.3) * 35.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.4, 1.5)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.lengthA * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});
grassLaser.lengthA = 150;
grassLaser.speed = 0.001;
grassLaser.damage = 40;
//grassLaser.hitEffect = Fx.hitFuse;
grassLaser.despawnEffect = Fx.none;
grassLaser.hitSize = 4;
grassLaser.lifetime = 13;
grassLaser.keepVelocity = false;
grassLaser.pierce = true;

const snakeBullet = extend(BasicBulletType, {
	update: function(b){
		Damage.collideLine(b, b.getTeam(), Fx.none, b.x, b.y, b.rot() + 180, 75.0 * b.fin());
	},
	
	draw: function(b){
		Draw.color(this.backColor);
		Draw.rect(this.backRegion, b.x, b.y, this.bulletWidth, this.bulletHeight, b.rot() - 90);
		Draw.color(this.frontColor);
		Draw.rect(this.frontRegion, b.x, b.y, this.bulletWidth, this.bulletHeight, b.rot() - 90);
		
		rnd1 = Mathf.randomSeedRange(b.id * 230, 90);
		
		Draw.color(primeColor);
		lib.lineTentacleRenderer(b.x, b.y, b.rot() + 180, 2, 0.1, 10, 8 * b.fin(), 4, 2, 18, 2, 12, rnd1);
		Draw.color();
	}
});
snakeBullet.lifetime = 47;
snakeBullet.damage = 12;
snakeBullet.speed = 5.3;
snakeBullet.pierce = true;
snakeBullet.bulletWidth = 11;
snakeBullet.bulletHeight = 13;
snakeBullet.bulletSprite = "missile";
snakeBullet.backColor = Color.valueOf("cbd97f");
snakeBullet.frontColor = Color.valueOf("edf3a9");

const overgrowthBulletAFrag = extend(BasicBulletType, {
	update: function(b){
		var rndRot = Mathf.randomSeedRange(b.id + 45, 6);
		var rndRange = Mathf.randomSeed(b.id + 7, 25, 50) / 50;
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), Fx.none, b.x, b.y, b.rot() + rndRot, 45.0 * rndRange);
		};
	},
	
	draw: function(b){
		const vec1 = new Vec2();
		const vec2 = new Vec2();
		const vec3 = new Vec2();
	
		var rndRot = Mathf.randomSeedRange(b.id, 45);
		var rndRot2 = Mathf.randomSeedRange(b.id + 15, 45);
		var rndRot3 = Mathf.randomSeedRange(b.id + 30, 45);
		var rndRot4 = Mathf.randomSeedRange(b.id + 45, 6);
		var rndRange = Mathf.randomSeed(b.id + 7, 25, 50) / 50;
		var rndStroke = Mathf.randomSeed(b.id + 16, 35, 50) / 50;
		var slopeB = (b.fslope() * -1) + 1;
		
		vec1.trns(rndRot * slopeB + (b.rot() + rndRot4), 18 * b.finpow() * rndRange);
		vec2.trns(rndRot2 * slopeB + (b.rot() + rndRot4), 36 * b.finpow() * rndRange);
		vec3.trns(rndRot3 * slopeB + (b.rot() + rndRot4), 54 * b.finpow() * rndRange);
	
		var posAx = b.x + vec1.x;
		var posAy = b.y + vec1.y;
	
		var posBx = b.x + vec2.x;
		var posBy = b.y + vec2.y;
	
		var posCx = b.x + vec3.x;
		var posCy = b.y + vec3.y;
	
		Draw.color(primeColor);
		Lines.stroke((b.fout() * 2) * rndStroke);
		Lines.curve(b.x, b.y, posAx, posAy, posBx, posBy, posCx, posCy, 16);
	}
});
overgrowthBulletAFrag.lifetime = 16;
overgrowthBulletAFrag.damage = 6;
overgrowthBulletAFrag.speed = 0.001;
overgrowthBulletAFrag.pierce = true;
overgrowthBulletAFrag.status = StatusEffects.tarred;
overgrowthBulletAFrag.statusDuration = 300;
overgrowthBulletAFrag.keepVelocity = false;
overgrowthBulletAFrag.despawnEffect = Fx.none;

const overgrowthBulletA = extend(BasicBulletType, {});

overgrowthBulletA.lifetime = 25;
overgrowthBulletA.damage = 8;
overgrowthBulletA.speed = 6.7;
overgrowthBulletA.bulletWidth = 11;
overgrowthBulletA.bulletHeight = 17;
overgrowthBulletA.bulletShrink = 0;
overgrowthBulletA.splashDamageRadius = 16;
//overgrowthBulletA.status = StatusEffects.tarred;
overgrowthBulletA.backColor = Color.valueOf("cbd97f");
overgrowthBulletA.frontColor = Color.valueOf("edf3a9");
overgrowthBulletA.fragBullet = overgrowthBulletAFrag;
overgrowthBulletA.fragBullets = 12;
overgrowthBulletA.despawnEffect = Fx.none;

const pestilenceShot = extend(BasicBulletType, {});

pestilenceShot.lifetime = 35;
pestilenceShot.damage = 8;
pestilenceShot.speed = 6.7;
pestilenceShot.bulletWidth = 6;
pestilenceShot.bulletHeight = 8.7;
pestilenceShot.backColor = Color.valueOf("cbd97f");
pestilenceShot.frontColor = Color.valueOf("edf3a9");
pestilenceShot.hitEffect = Fx.hitBulletSmall;

const pestilenceFly = extend(MissileBulletType, {
	range: function(){
		return 190;
	},
	
	update: function(b){
		//b.velocity().rotate(Mathf.sin(Time.time() + b.id * 4422, this.weaveScale, this.weaveMag) * Time.delta());
		
		if(Mathf.chance(0.2)){
            Effects.effect(Fx.missileTrail, primeColor, b.x, b.y, 2.0);
        }
		
        if(this.homingPower > 0.0001){
            /*TargetTrait*/ target = Units.closestTarget(b.getTeam(), b.x, b.y, this.homingRange);
            if(target != null){
                b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(target), 0.12));
				if(b.timer.get(1, 9)){
					Calls.createBullet(pestilenceShot, b.getTeam(), b.x, b.y, b.rot(), Mathf.random(0.9, 1.0), Mathf.random(0.8, 1.0));
				}
            }
        }
    }
});

pestilenceFly.homingPower = 7;
pestilenceFly.homingRange = 110;
//pestilenceFly.range = 190;
pestilenceFly.lifetime = 90;
pestilenceFly.pierce = true;
pestilenceFly.collidesTiles = true;
pestilenceFly.backColor = Color.valueOf("cbd97f");
pestilenceFly.frontColor = Color.valueOf("edf3a9");
pestilenceFly.damage = 2;
pestilenceFly.speed = 3.5;
pestilenceFly.bulletWidth = 7;
pestilenceFly.bulletHeight = 10;
pestilenceFly.bulletShrink = 0;
pestilenceFly.hitEffect = Fx.hitBulletSmall;

const overgrowthBullet = extend(BasicBulletType, {
	range: function(){
		return 130;
	},
	
	despawned: function(b){
		for(var i = 0; i < 12; i++){
			Bullet.create(this.frags[Mathf.round(Mathf.random(0, 3))], b, b.x, b.y, b.rot() + Mathf.range(32.0), Mathf.random(0.75, 1.25));
		}
	},
	
	draw: function(b){}
});
overgrowthBullet.speed = 0.001;
overgrowthBullet.damage = 30;
overgrowthBullet.frags = [pestilenceFly, overgrowthBulletA, snakeBullet, grassLaser];
//overgrowthBullet.lifetime = 19;
overgrowthBullet.lifetime = 1;
overgrowthBullet.minRotation = 16;
overgrowthBullet.widthOffset = 8;
overgrowthBullet.lengthOffset = 8;
//overgrowthBullet.recoil = 0.4;
overgrowthBullet.hitSize = 12;
overgrowthBullet.collidesTiles = false;
overgrowthBullet.collidesAir = false;
overgrowthBullet.collides = false;
overgrowthBullet.instantDisappear = true;
overgrowthBullet.keepVelocity = false;
overgrowthBullet.despawnEffect = Fx.none;
overgrowthBullet.shootEffect = OvergrowthShootEffect;
overgrowthBullet.smokeEffect = Fx.none;

const overgrowthWeapon = extendContent(Weapon, "overgrowth-equip", {
	load: function(){
		this.region = Core.atlas.find("advancecontent-overgrowth-equip");
	}
});

overgrowthWeapon.reload = 60;
overgrowthWeapon.alternate = true;
overgrowthWeapon.length = 8;
overgrowthWeapon.width = 8;
overgrowthWeapon.recoil = 1.3;
overgrowthWeapon.minPlayerDist = 200;
overgrowthWeapon.bullet = overgrowthBullet;
overgrowthWeapon.shootSound = Sounds.shotgun;

const overgrowth = extendContent(Mech, "overgrowth-summoner", {
	load: function(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.legRegion = Core.atlas.find(this.name + "-leg");
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.lightRegion = Core.atlas.find(this.name + "-lights");
	},
	
	draw: function(player){
		const sin = Mathf.sin(Time.time(), 6, 0.5);
		const cos = Mathf.cos(Time.time(), 6, 0.5);
		
		Draw.blend(Blending.additive);
		Draw.rect(this.lightRegion, player.x + sin, player.y + cos, player.rotation - 90);
		Draw.blend();
	}
});

overgrowth.flying = false;
overgrowth.health = 470;
overgrowth.speed = 0.22;
overgrowth.boostSpeed = 0.6;
overgrowth.mass = 6;
overgrowth.drillPower = 5;
overgrowth.shake = 5.5;
overgrowth.hitsize = 23;
overgrowth.weapon = overgrowthWeapon;
overgrowth.weaponOffsetX = 8;
overgrowth.weaponOffsetY = 3.5;
overgrowth.engineColor = primeColor;
overgrowth.engineOffset = 9;
overgrowth.engineSize = 5;
overgrowth.mineSpeed = 1.7;
overgrowth.buildPower = 1.5;
overgrowth.itemCapacity = 90;
overgrowth.localizedName = "Overgrowth Summoner";
overgrowth.description = "Shoots an assortment of bullets. good at destroying units, destroys everything in close range.";

const overgrowthPad = extendContent(MechPad, "overgrowth-summoner-mech-pad", {});

overgrowthPad.mech = overgrowth;
overgrowthPad.buildTime = 700;
//overgrowthPad.buildTime = 700;