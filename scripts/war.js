const warBullet = extend(BasicBulletType, {
	hit(b, x, y){
		this.super$hit(b, b.x, b.y);
		
		Damage.damage(b.getTeam(), b.x, b.y, 35, 52 * b.damageMultiplier());
	},
	
	update(b){
		this.super$update(b);
		
		//b.velocity().rotate(Mathf.sin(Time.time() + (b.id * 4422), 9, 3) * Time.delta());
		//b.velocity().rotate(Mathf.sin(Time.time(), 7, 3) * Time.delta());
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.bulletYellowBack, b.x, b.y, 2.2);
		}
	}
});

warBullet.speed = 4.7;
warBullet.damage = 54;
warBullet.splashDamageRadius = -1;
warBullet.splashDamage = 350;
warBullet.lifetime = 49;
warBullet.bulletWidth = 13;
warBullet.bulletHeight = 19;
warBullet.bulletShrink = 0;
//warBullet.frontColor = Pal.unitFront;
//warBullet.backColor = Pal.unitBack;

const warWeap = extendContent(Weapon, "war-equip", {
	load(){
		this.region = Core.atlas.find("advancecontent-war-machine");
	}
});

warWeap.reload = 45;
warWeap.alternate = true;
warWeap.length = 4;
warWeap.width = 24;
warWeap.ignoreRotation = false;
warWeap.bullet = warBullet;
warWeap.inaccuracy = 0.1;
warWeap.shots = 5;
warWeap.spacing = 5;
warWeap.shootSound = Sounds.artillery;

const warBase = prov(() => new JavaAdapter(HoverUnit, {}));

const war = extendContent(UnitType, "war", {});

war.localizedName = "War";
war.create(warBase);
war.weapon = warWeap;
war.engineSize = 7.8;
war.engineOffset = 38;
war.weaponOffsetY = -9;
war.rotateWeapon = true;
war.flying = true;
war.health = 9500;
war.mass = 30;
war.hitsize = 47;
war.speed = 0.011;
war.drag = 0.02;
war.attackLength = 180;
war.range = 200;
war.maxVelocity = 0.78;
war.shootCone = 45;
war.rotatespeed = 0.01;
war.baseRotateSpeed = 0.04;