const deathFragBullet = extend(BasicBulletType, {
	despawned(b){
		Effects.effect(this.despawnEffect, b.x, b.y, b.rot());
		this.hitSound.at(b);
		
		Damage.damage(b.getTeam(), b.x, b.y, 20, 12 * b.damageMultiplier());
	},
	
	update(b){
		var target = Units.closestTarget(b.getTeam(), b.x, b.y, this.homingRange, boolf(e => !e.isFlying() || this.collidesAir), boolf(t => false));
		
		if(target != null){
			b.velocity().setAngle(Mathf.slerpDelta(b.velocity().angle(), b.angleTo(target), 0.03 + (0.14 * b.fin())));
		};
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.unitBack, b.x, b.y, 1.7);
		}
	}
});

deathFragBullet.bulletSprite = "missile";
deathFragBullet.speed = 4.7;
deathFragBullet.damage = 4;
deathFragBullet.lifetime = 32;
deathFragBullet.homingRange = 120;
deathFragBullet.collidesTiles = false;
deathFragBullet.pierce = true;
deathFragBullet.bulletWidth = 9;
deathFragBullet.bulletHeight = 12;
deathFragBullet.bulletShrink = 0;
deathFragBullet.frontColor = Pal.unitFront;
deathFragBullet.backColor = Pal.unitBack;

const deathBullet = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		b.velocity().rotate(Mathf.sin(Time.time() + (b.id * 4422), 9, 3) * Time.delta());
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.unitBack, b.x, b.y, 2.2);
		}
	}
});

deathBullet.speed = 4.7;
deathBullet.damage = 34;
deathBullet.lifetime = 49;
deathBullet.bulletWidth = 12;
deathBullet.bulletHeight = 18;
deathBullet.bulletShrink = 0;
deathBullet.fragVelocityMax = 1;
deathBullet.fragVelocityMin = 0.9;
deathBullet.fragBullets = 5;
deathBullet.fragBullet = deathFragBullet;
deathBullet.frontColor = Pal.unitFront;
deathBullet.backColor = Pal.unitBack;

const deathWeap = extendContent(Weapon, "death-equip", {});

deathWeap.reload = 16;
deathWeap.alternate = true;
deathWeap.length = 3;
deathWeap.width = 11;
deathWeap.ignoreRotation = false;
deathWeap.bullet = deathBullet;
deathWeap.inaccuracy = 19;
deathWeap.shots = 5;
deathWeap.spacing = 1;
deathWeap.shotDelay = 1;
deathWeap.shootSound = Sounds.artillery;

const deathBase = prov(() => new JavaAdapter(HoverUnit, {}));

const death = extendContent(UnitType, "death", {});

death.localizedName = "Death";
death.create(deathBase);
death.weapon = deathWeap;
death.engineSize = 7.8;
death.engineOffset = 38;
death.flying = true;
death.health = 9500;
death.mass = 30;
death.hitsize = 47;
death.speed = 0.011;
death.drag = 0.02;
death.attackLength = 130;
death.range = 200;
death.maxVelocity = 0.78;
death.shootCone = 80;
death.rotatespeed = 0.01;
death.baseRotateSpeed = 0.04;