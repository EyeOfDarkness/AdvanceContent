const spritelib = require("spritebatchcustom");

const tempVec = new Vec2();
const tempVec2 = new Vec2();

const darksideTrans = extendContent(StatusEffect, "darkside-trans", {
	update(unit, time){
		this.super$update(unit, time);
		//unit.rotation += Mathf.randomSeedRange(unit.getID(), 11);
		unit.velocity().limit(1.3);
	}
});
darksideTrans.armorMultiplier = 0.9;
darksideTrans.speedMultiplier = 0.9;

const tempColor = new Color();

const slope = val => {
	return 1 - ((0.5 - Math.abs(val - 0.5)) * 2);
};

const blendCustomA = [Gl.srcAlphaSaturate, Gl.oneMinusSrcAlpha];

const darksideLaser = extend(BasicBulletType, {
	update(b){
		if(b.timer.get(1, 5)){
			Units.nearbyEnemies(b.getTeam(), b.x - this.effectArea, b.y - this.effectArea, this.effectArea * 2, this.effectArea * 2, cons(unit => {
				if(unit.within(b, this.effectArea + (unit.getSize() / 2)) && Angles.within(b.rot(), Angles.angle(b.x, b.y, unit.x, unit.y), this.areaAngle)){
					unit.applyEffect(darksideTrans, 3 * 60);
					unit.damage(this.damage);
				}
			}));
		}
	},
	draw(b){
		var lastBatch = Core.batch;
		var lastProj = Draw.proj();
		var lastTrns = Draw.trans();
		Draw.flush();
		Core.batch = spritelib.getCustomBatch();
		Draw.trans(lastTrns);
		Draw.proj(lastProj);
		spritelib.blendingCustom(blendCustomA[0], blendCustomA[1]);
		for(var i = 0; i < 19; i++){
			/*for(var s = 0; s < 2; s++){
				var cVec = s == 0 ? tempVec : tempVec2;
				cVec.trns((b.rot() - this.areaAngle) + ((this.areaAngle / 6) * (i + s)), this.effectArea);
			};*/
			var angA = this.areaAngle * 2 * b.fout();
			tempVec.trns((b.rot() - (angA / 2)) + ((angA / 19) * (i + 0)), this.effectArea);
			tempVec2.trns((b.rot() - (angA / 2)) + ((angA / 19) * (i + 1)), this.effectArea);
			Draw.color(tempColor.set(1, 0, 0, 1).shiftHue(((Time.time() + ((slope(i / 18) * 90) * b.fout())) * 4.3) / 2));
			Fill.tri(b.x, b.y, b.x + tempVec.x, b.y + tempVec.y, b.x + tempVec2.x, b.y + tempVec2.y);
			Draw.reset();
		};
		spritelib.blendReset();
	
		Draw.flush();
		Draw.reset();
		Core.batch = lastBatch;
		Draw.proj(lastProj);
		Draw.trans(lastTrns);
	}
});
darksideLaser.damage = 31;
darksideLaser.speed = 0.001;
darksideLaser.pierce = true;
darksideLaser.collidesTiles = false;
darksideLaser.collidesAir = false;
darksideLaser.collides = false;
darksideLaser.areaAngle = 30;
darksideLaser.effectArea = 290;
darksideLaser.drawSize = 600;
darksideLaser.hitEffect = Fx.none;
darksideLaser.despawnEffect = Fx.none;
darksideLaser.shootEffect = Fx.none;
darksideLaser.smokeEffect = Fx.none;

const darksideTurret = extendContent(LaserTurret, "darkside", {
	init(){
		this.super$init();
		this.activeSound = Vars.content.getByName(ContentType.block, "advancecontent-eclipse").activeSound;
	},
	load(){
		this.super$load();
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
	},
	generateIcons(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	findTarget(tile){
		entity = tile.ent();

		entity.target = Units.closestEnemy(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead()));
	}
});
darksideTurret.health = 7500;
darksideTurret.range = 275;
darksideTurret.shootType = darksideLaser;
darksideTurret.shootDuration = 330;
darksideTurret.coolantMultiplier = 2;
darksideTurret.size = 7;
darksideTurret.localizedName = "Dark Side";
darksideTurret.description = "The Dark Side of the Moon. only targets units.";
darksideTurret.rotatespeed = 3.76;
darksideTurret.powerUse = 45;
darksideTurret.reload = 340;
darksideTurret.activeSoundVolume = 1.3;