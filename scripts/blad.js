const goldSurge = Color.valueOf("ffe87f");

const shipTrail = newEffect(44, e => {
	Draw.color(goldSurge);
	Fill.circle(e.x, e.y, 1.6 * e.fout());
});

const bladeLaserShoot = newEffect(11, e => {
	Draw.color(goldSurge);
	
	for(var g = 1; g < 3; g++){
		Drawf.tri(e.x, e.y, 5 * e.fout(), 29, e.rotation + 90 + (g * 180));
	};
	
	Drawf.tri(e.x, e.y, 7 * e.fout(), 48, e.rotation);
});

const bladeLaser = extend(BasicBulletType, {
	range: function(){
		return 190.0;
	},
	
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 170.0, false);
		};
	},
	
	/*init: function(b){
		Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0);
	},*/
	
	draw: function(b){
		const colors = [goldSurge.cpy().mul(1.0, 1.0, 1.0, 0.4), goldSurge, Color.white];
		const tscales = [1.0, 0.7, 0.5, 0.2];
		const lenscales = [1, 1.1, 1.13, 1.14];
		const length = 170.0;
		const f = Mathf.curve(b.fin(), 0.0, 0.2);
		const baseLen = length * f;
		//const lengthB = new Vec2();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 3; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < 4; i++){
				//lengthB.trns(b.rot(), baseLen * lenscales[i]);
				Lines.stroke(7 * b.fout() * (s == 0 ? 1.5 : s == 1 ? 1 : 0.3) * tscales[i]);
				//Lines.line(b.getOwner().x, b.getOwner().y, b.x + lengthB.x, b.y + lengthB.y);
				Lines.lineAngle(b.x, b.y, b.rot(), baseLen * lenscales[i]);
			}
		};
		Draw.reset();
	}
});
bladeLaser.speed = 0.001;
bladeLaser.damage = 40;
bladeLaser.hitEffect = Fx.hitFuse;
bladeLaser.despawnEffect = Fx.none;
bladeLaser.hitSize = 4;
bladeLaser.lifetime = 11;
bladeLaser.keepVelocity = false;
bladeLaser.pierce = true;
bladeLaser.shootEffect = bladeLaserShoot;
bladeLaser.smokeEffect = Fx.none;

const bladeWeapon = extendContent(Weapon, "eeeee", {});

bladeWeapon.reload = 30;
bladeWeapon.alternate = true;
bladeWeapon.width = 0;
bladeWeapon.length = 6;
bladeWeapon.bullet = bladeLaser;
bladeWeapon.shootSound = Sounds.laser;
bladeWeapon.minPlayerDist = 45;

const blad = extendContent(Mech, "blade", {
	//const minV = 3.6;
	//const maxV = 6;
	
	/*load: function(){
		weapon.load();
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
		const pred = new Vec2();
		
		if(Mathf.chance(sclb)){
			pred.trns(player.velocity().angle(), 16);
			Effects.effect(shipTrail, Pal.surge, player.x + Mathf.range(4.7) + pred.x, player.y + Mathf.range(4.7) + pred.y, player.rotation);
			if(Mathf.chance(0.25)){
				Lightning.create(player.getTeam(), goldSurge, 18 * Vars.state.rules.playerDamageMultiplier, player.x, player.y, player.rotation + Mathf.range(21.0), Mathf.floorPositive((player.velocity().len() * 2) + Mathf.random(2, 4)));
			}
		}
	},
	
	draw: function(player){
		const minV = 3.6;
		const maxV = 7;
		//const scld = Mathf.clamp((player.velocity().len() - minV) / (maxV - minV));
		
		//const scl = this.scld;
		//if(scl < 0.01) return;
		const scl = Mathf.clamp((player.velocity().len() - minV) / (maxV - minV));
		
		Draw.color(goldSurge);
		Draw.alpha(scl / 2);
		Draw.blend(Blending.additive);
		Draw.rect(Core.atlas.find(this.name + "-shield"), player.x + Mathf.range(scl / 2.0), player.y + Mathf.range(scl / 2.0), player.rotation - 90);
		Draw.blend();
	}
});

blad.flying = true;
blad.health = 210;
blad.drag = 0.027;
blad.speed = 0.24;
blad.drillPower = 4;
blad.weapon = bladeWeapon;
blad.engineColor = goldSurge;
blad.mineSpeed = 3.2;
blad.buildPower = 1.2;
blad.localizedName = "Blade";
blad.description = "Shoot an armour piercing laser. can also create lightning at high speeds.";
//blad.ability = "AC Surge Discharge Booster";

const bladePad = extendContent(MechPad, "blade-ship-pad", {});

bladePad.mech = blad;
bladePad.buildTime = 300;