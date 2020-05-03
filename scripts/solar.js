const primeColor = Color.valueOf("ff9c5a");

const shootSparks = newEffect(32, e => {
	const vec = new Vec2();
	
	Draw.color(Color.valueOf("ff9c5a"));
	
	for(var b = 0; b < 3; b++){
		var rnd1 = Mathf.randomSeed(e.id + (b * 15), 50, 180) / 15; // 3.33 - 12
		var rnd2 = Mathf.randomSeed(e.id + (b * 16), 36, 240) / 15; // 2.4 - 16
		var rnd3 = Mathf.randomSeed(e.id + (b * 17), 0, 45); // 0 - 45
		var rnd4 = Mathf.randomSeed(e.id + (b * 18), 56, 410) / 15; // 3.73 - 27.33
		var rnd5 = Mathf.randomSeed(e.id + (b * 19), 230, 340) / 15; // 15.33 - 22.33
		var rndRot = Mathf.randomSeedRange(e.id + (b * 14), 35); // -35 - 35
		
		var sin = Mathf.sin(Time.time() + rnd3, rnd1, rnd2);
		var sinB = Mathf.sin((Time.time() + rnd3) - 45, rnd1, rnd2);
		
		//vec.trns(e.rotation + rndRot + (sin / 3), e.finpow() * rnd4 * 3.3, sin * e.fslope());
		//vec.add(vec2.trns(e.rotation + rndRot + (sin / 3 * e.fout()), e.fout() * rnd4 * 3.3, sin * e.fslope()));
		vec.trns(e.rotation + rndRot, e.fin() * rnd4 * 3.3, sin * e.fslope());
		Lines.stroke(1);
		Lines.lineAngle(e.x + vec.x, e.y + vec.y, e.rotation + rndRot + (sinB * 2), rnd5 / 4 * e.fout());
	};
});

const shipTrail = newEffect(24, e => {
	const lightRegion = Core.atlas.find("advancecontent-solar-conqueror-lights");
	
	if(!Core.settings.getBool("bloom")){
		Draw.blend(Blending.additive);
		Draw.color(Color.valueOf("722a18"), Color.valueOf("36080230"), e.fin());
		Draw.rect(lightRegion, e.x, e.y, e.rotation - 90);
		Draw.blend();
	}else{
		Draw.mixcol(Color.valueOf("ff9c5a"), 1);
		Draw.alpha(e.fout());
		Draw.rect(lightRegion, e.x, e.y, e.rotation - 90);
	}
	
	//Draw.color(Color.valueOf("ffffff"));
	//Fill.circle(e.x, e.y, (1 * e.fout()) * (e.rotation / 1.3));
});

const solarBullet = extend(BasicBulletType, {
	range: function(){
		return 180.0;
	},
	
	update: function(b){
		/*const vec = new Vec2();
		var owner = b.getOwner();
		var lastX = owner.getX() - b.getX();
		var lastY = owner.getY() - b.getY();*/
		this.findSide(b);
		
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), Fx.none, b.x, b.y, b.rot(), this.lengthA + 10, false);
		};
		
		//this.findSide(b);
		
		//b.setX(vec.x);
		//b.setY(vec.y);
		
		//print(b.getOwner());
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effects.effect(Fx.hitMeltdown, Color.valueOf("ec7458aa"), hitx, hity);
			if(Mathf.chance(0.1)){
				Fire.create(Vars.world.tileWorld(hitx + Mathf.range(3.0), hity + Mathf.range(3.0)));
			}
		}
	},
	
	findSide: function(b){
		const vec = new Vec2();
		const vec2 = new Vec2();
		const vec3 = new Vec2();
		const owner = b.getOwner();
		var lastX = owner.getX() - b.getX();
		var lastY = owner.getY() - b.getY();
		
		vec.trns(b.rot() * -1, lastX, lastY);
		
		/*if(vec.x + vec.y > 0){
			vec2.trns(b.rot() - 90, 14.75, 12);
		}else{
			vec2.trns(b.rot() - 90, -14.75, 12);
		};*/
		
		/*vec3.set(owner.pointerX, owner.pointerY).sub(b.x, b.y);
		var angleB = Mathf.angle(vec3.x, vec3.y);
		vec3.trns(angleB - owner.rotation, 1);
		var angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, -15.0, 15.0);*/
		
		//var angleC = Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg;
		//print(angleC);
		
		if(vec.x + vec.y > 0){
			vec2.trns(owner.rotation - 90, 12.75, 12);
			//angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, 0.0, 15.0);
		}else{
			vec2.trns(owner.rotation - 90, -12.75, 12);
			//angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, -15.0, 0.0);
		};
		
		b.setX(vec2.x + owner.x);
		b.setY(vec2.y + owner.y);
		
		vec3.set(owner.pointerX, owner.pointerY).sub(b.x, b.y);
		var angleB = Mathf.angle(vec3.x, vec3.y);
		vec3.trns(angleB - owner.rotation, 1);
		var angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, -15.0, 15.0);
		
		if(vec.x + vec.y > 0){
			//vec2.trns(owner.rotation - 90, 12.75, 12);
			angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, 0.0, 15.0);
		}else{
			//vec2.trns(owner.rotation - 90, -12.75, 12);
			angleC = Mathf.clamp(Mathf.atan2(vec3.x, vec3.y) * Mathf.radDeg, -15.0, 0.0);
		};
		
		b.rot(owner.rotation + angleC);
	},
	
	draw: function(b){
		const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.28];
		const strokes = [1.7, 1.2, 0.9, 0.4];
		const lenscales = [1.0, 1.12, 1.15, 1.159];
		const tmpColor = new Color();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 4; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.0, 0.2)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.1) * 35.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.4, 1.5)) * b.fslope() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.lengthA * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});
solarBullet.lengthA = 180;
solarBullet.speed = 0.001;
solarBullet.damage = 30;
solarBullet.lifetime = 14;
//solarBullet.recoil = 0.4;
solarBullet.hitSize = 12;
solarBullet.keepVelocity = false;
solarBullet.pierce = true;
solarBullet.despawnEffect = Fx.none;
solarBullet.shootEffect = shootSparks;
solarBullet.smokeEffect = Fx.none;

const solarWeapon = extendContent(Weapon, "solarflare", {
	load: function(){
		this.region = Core.atlas.find("advancecontent-solar-equip");
	}
});

solarWeapon.reload = 3;
solarWeapon.alternate = false;
solarWeapon.length = 12;
//solarWeapon.width = 14.75;
solarWeapon.width = 14.75;
solarWeapon.recoil = 0.7;
solarWeapon.minPlayerDist = 200;
solarWeapon.bullet = solarBullet;
solarWeapon.shootSound = Sounds.flame;

const solar = extendContent(Mech, "solar-conqueror", {
	
	load: function(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.legRegion = Core.atlas.find(this.name + "-leg");
		this.baseRegion = Core.atlas.find(this.name + "-base");
		//this.lightRegion = Core.atlas.find(this.name + "-lights");
	},
	
	/*scld: function(player){
		const minV = 3.6;
		const maxV = 6;
		return Mathf.clamp((player.velocity().len() - minV) / (maxV - minV));
	},*/
	updateAlt: function(player){
		const vectA = new Vec2();
		const shift = Mathf.clamp(player.velocity().len(), 0, 4);
		
		//const tx = Vars.world.toTile(player.x);
		//const ty = Vars.world.toTile(player.y);
		//const tile = Vars.world.ltile(tx, ty);
		const target = Units.closestTarget(player.getTeam(), player.x, player.y, 15, boolf(e => !e.isFlying()));
		
		//print(target);
		
		if(player.getTimer().get(5, 1)){
			vectA.trns(player.velocity().angle() - 90, 0, shift * 2);
			Effects.effect(shipTrail, player.x + vectA.x + Mathf.range(1.0), player.y + vectA.y + Mathf.range(1.0), player.rotation);
		};
		
		if(target != null && shift > 0.1 && player.getTimer().get(4, 6) && player.achievedFlight){
			//print("enemy spotted")
			Bullet.create(Bullets.bombIncendiary, player, player.x, player.y, player.rotation + Mathf.range(6.0))
		}
	}
});

solar.flying = false;
solar.health = 530;
solar.speed = 0.2;
solar.boostSpeed = 0.5;
solar.mass = 6;
solar.drillPower = 5;
solar.shake = 5.5;
solar.hitsize = 27;
solar.weapon = solarWeapon;
solar.weaponOffsetX = 14.75;
solar.weaponOffsetY = 4.5;
solar.engineColor = primeColor;
solar.engineOffset = 9;
solar.engineSize = 5;
solar.mineSpeed = 1.7;
solar.buildPower = 1.5;
solar.itemCapacity = 90;
solar.localizedName = "Solar Conqueror";
solar.description = "Shoots a powerful laser and drops bombs.";

const solarPad = extendContent(MechPad, "solar-conqueror-mech-pad", {});

solarPad.mech = solar;
solarPad.buildTime = 700;
//solarPad.buildTime = 700;