const primeColor = Color.valueOf("dcdde3");

const claymoreMissile = extend(MissileBulletType, {});
claymoreMissile.speed = 6;
claymoreMissile.damage = 12;
claymoreMissile.lifetime = 93;
claymoreMissile.backColor = Color.valueOf("cccedb");
claymoreMissile.frontColor = Color.valueOf("ececec");
claymoreMissile.splashDamageRadius = 20;
claymoreMissile.splashDamage = 10;
claymoreMissile.bulletWidth = 7;
claymoreMissile.bulletHeight = 9;
claymoreMissile.bulletShrink = 0;
claymoreMissile.drag = -0.004;
claymoreMissile.keepVelocity = true;
claymoreMissile.trailColor = primeColor;
claymoreMissile.weaveMag = 3.0;
claymoreMissile.weaveScale = 4.0;

const claymoreLaser = extend(BasicBulletType, {
	range: function(){
		return 140.0;
	},
	
	update: function(b){
		const lengthC = (Mathf.clamp(b.velocity().len()) * 100) * 160;
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), lengthC, false);
		};
	},
	
	/*init: function(b){
		Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0);
	},*/
	
	draw: function(b){
		const colors = [Color.valueOf("dcdde377"), primeColor, Color.valueOf("ffffff")];
		const tscales = [1.0, 0.7, 0.5, 0.2];
		const lenscales = [1, 1.1, 1.13, 1.14];
		//const lengthC = (this.speed * 100) * 140;
		const alphaB = Mathf.clamp(b.velocity().len() * 100);
		const lengthC = (Mathf.clamp(b.velocity().len()) * 100) * 160;
		const tmpColor = new Color();
		//const vectB = new Vec2();
		const vectC = new Vec2();
		
		const ownerX = b.getOwner().x;
		const ownerY = b.getOwner().y;
		const ownerVelocity = Mathf.clamp((b.getOwner().velocity().len() - 4.6) / (9.2 - 4.6));

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 3; s++){
			//Draw.color(tmpColor.set(colors[s]).mul(1, 1, 1, alphaB * b.fout()));
			//Draw.color(tmpColor.set(colors[s]).mul(1, 1, 1, alphaB * Mathf.sin(b.fin() * 3, 1, 1)));
			Draw.color(tmpColor.set(colors[s]).mul(1, 1, 1, ownerVelocity * Mathf.sin(b.fin() * 3, 1, 1)));
			for(var i = 0; i < 4; i++){
				Lines.stroke(7 * b.fout() * (s == 0 ? 1.5 : s == 1 ? 1 : 0.3) * tscales[i]);
				//vectB.trns(b.rot(), b.fin() * (alphaB * 120));
				//vectC.trns(b.rot(), lengthC * lenscales[i]);
				//vectC.trns(b.getOwner().velocity().angle(), lengthC * lenscales[i]);
				vectC.trns(b.getOwner().velocity().angle(), (ownerVelocity * 160) * lenscales[i]);
				//Lines.line(b.x + vectB.x, b.y + vectB.y, b.x + vectC.x, b.y + vectC.y);
				Lines.line(ownerX, ownerY, ownerX + vectC.x, ownerY + vectC.y);
			}
		};
		Draw.reset();
	}
});
claymoreLaser.speed = 0.01;
claymoreLaser.damage = 23;
claymoreLaser.hitEffect = Fx.hitLancer;
claymoreLaser.despawnEffect = Fx.none;
//claymoreLaser.lengthB = 140.0;
claymoreLaser.hitSize = 4;
claymoreLaser.lifetime = 10;
claymoreLaser.keepVelocity = false;
claymoreLaser.pierce = true;
claymoreLaser.shootEffect = Fx.none;
claymoreLaser.smokeEffect = Fx.none;

const claymoreWeapon = extendContent(Weapon, "eeeef", {});

claymoreWeapon.reload = 60;
claymoreWeapon.alternate = true;
claymoreWeapon.width = 4.2;
claymoreWeapon.length = 2;
claymoreWeapon.ignoreRotation = true;
claymoreWeapon.spacing = 1;
claymoreWeapon.shots = 5;
claymoreWeapon.velocityRnd = 0.2;
claymoreWeapon.bullet = claymoreMissile;
claymoreWeapon.shootSound = Sounds.missile;
claymoreWeapon.minPlayerDist = 35;

const claymre = extendContent(Mech, "claymore", {
	//const minV = 3.6;
	//const maxV = 6;
	
	/*load: function(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.shield = Core.atlas.find(this.name + "-shield");
	},*/
	
	/*scld: function(player){
		const minV = 3.6;
		const maxV = 6;
		return Mathf.clamp((player.velocity().len() - minV) / (maxV - minV));
	},*/
	updateAlt: function(player){
		const minVb = 4.6;
		const maxVb = 9.2;
		const sclb = Mathf.clamp((player.velocity().len() - minVb) / (maxVb - minVb));
		const vectA = new Vec2();
		
		//if(sclb < 8.2 && player.timer.get(0, 3))
		if(sclb > 0.2 && player.timer.get(0, 3)){
				//Bullet.create(claymoreLaser.lengthB(sclb * 140.0), player.getTeam(), player.x, player.y, player.rotation);
				vectA.trns(player.velocity().angle(), sclb * 13);
				Bullet.create(claymoreLaser, player, player.getTeam(), player.x + vectA.x, player.y + vectA.y, player.velocity().angle(), sclb, 1);
		}
	},
	
	draw: function(player){
		const minVC = 5.6;
		const maxVC = 9.8;
		const sclC = Mathf.clamp((player.velocity().len() - minVC) / (maxVC - minVC));
		const minV = 3.6;
		const maxV = 7;
		const scl = Mathf.clamp((player.velocity().len() - minV) / (maxV - minV));
		
		Draw.color(primeColor);
		Draw.alpha(scl / 2);
		Draw.blend(Blending.additive);
		Draw.rect(Core.atlas.find(this.name + "-shield"), player.x + Mathf.range(scl / 1.8), player.y + Mathf.range(scl / 1.8), player.rotation - 90);
		//Draw.rect(Core.atlas.find(this.name + "-airshield"), player.x + Mathf.range(scl / 1.2), player.y + Mathf.range(scl / 1.2), player.velocity().angle() - 90);
		//Draw.blend();
		
		//Draw.color(primeColor);
		Draw.alpha(sclC / 1.2);
		//Draw.blend(Blending.additive);
		Draw.rect(Core.atlas.find(this.name + "-airshield"), player.x + Mathf.range(sclC / 1.2), player.y + Mathf.range(sclC / 1.2), player.velocity().angle() - 90);
		Draw.blend();
	}
});

claymre.flying = true;
claymre.health = 270;
claymre.drag = 0.018;
claymre.speed = 0.21;
claymre.drillPower = 4;
claymre.maxSpeed = 15;
claymre.weapon = claymoreWeapon;
claymre.engineColor = primeColor;
claymre.engineOffset = 8;
claymre.mineSpeed = 3.2;
claymre.buildPower = 1.2;
claymre.localizedName = "Claymore";
claymre.description = "generates a laser at high speeds, useful for disabling production.";

const claymorePad = extendContent(MechPad, "claymore-ship-pad", {});

claymorePad.mech = claymre;
//claymorePad.buildTime = 1;
claymorePad.buildTime = 300;