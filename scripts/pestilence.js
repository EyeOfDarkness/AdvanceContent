const status = new StatusEffect("fgsfhsfsr");
status.speedMultiplier = 1;
status.armorMultiplier = 5;
status.damageMultiplier = 1.5;

const summonEffect = newEffect(11, e => {
	Draw.color(Pal.accent);
	Lines.stroke((e.fout() * 2) + 0.5);
	Lines.poly(e.x, e.y, 4, e.fin() * 17, 0);
	Draw.reset();
});

const rangeBullet = extend(BasicBulletType, {});
rangeBullet.damage = 0;
rangeBullet.lifetime = 230;
rangeBullet.speed = 1;

const pestilenceWeap = extendContent(Weapon, "pestilence-equip", {
	shoot(p, x, y, angle, left){
		//this.super$shoot(p, x, y, angle, left);
		const vec = new Vec2();
		
		if(p != null){
			var newUnit = UnitTypes.wraith.create(p.getTeam());
		
			newUnit.rotation = angle;
			newUnit.set(p.getX() + x, p.getY() + y);
			newUnit.add();
			newUnit.applyEffect(status, Number.MAX_VALUE);
			vec.trns(angle, 2);
			newUnit.velocity().set(vec);
			Effects.effect(summonEffect, p.getX() + x, p.getY() + y);
			Sounds.missile.at(p.getX() + x, p.getY() + y, Mathf.random(0.8, 1.0));
		}
	}
});

pestilenceWeap.reload = 13;
pestilenceWeap.alternate = true;
pestilenceWeap.length = 4;
pestilenceWeap.width = 18;
pestilenceWeap.ignoreRotation = false;
//pestilenceWeap.recoil = 1.4;
pestilenceWeap.bullet = rangeBullet;
//pestilenceWeap.shots = 5;
//pestilenceWeap.spacing = 1;
//pestilenceWeap.shotDelay = 3;
//pestilenceWeap.shootSound = Sounds.artillery;
//pestilenceWeap.minPlayerDist = 35;

const pestilenceBase = prov(() => new JavaAdapter(HoverUnit, {}));

const pestilence = extendContent(UnitType, "pestilence", {});

pestilence.localizedName = "Pestilence";
pestilence.create(pestilenceBase);
pestilence.weapon = pestilenceWeap;
pestilence.engineSize = 7.8;
pestilence.engineOffset = 31;
pestilence.flying = true;
pestilence.health = 9200;
pestilence.mass = 30;
pestilence.hitsize = 47;
pestilence.speed = 0.015;
pestilence.drag = 0.02;
pestilence.attackLength = 148;
pestilence.range = 230;
pestilence.maxVelocity = 0.78;
pestilence.shootCone = 150;
pestilence.rotatespeed = 0.01;
pestilence.baseRotateSpeed = 0.04;