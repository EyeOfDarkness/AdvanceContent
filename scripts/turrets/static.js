const shockEffect = newEffect(18, e => {
	Draw.color(Color.valueOf("f3e979"), Color.white, e.fin());
	
	Fill.square(e.x, e.y, 0.1 + e.fout() * 1.8, 45);
});

const customShock = new StatusEffect("custom-shock");
customShock.speedMultiplier = 0.25;
customShock.damage = 0.02;
customShock.armorMultiplier = 0.9;
customShock.effect = shockEffect;

const staticLaser = extend(BasicBulletType, {
	update: function(b){
		Effects.shake(0.4, 0.4, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.lengthB, true);
		};
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effects.effect(this.hitEffect, hitx, hity);
		}
	},
	
	draw: function(b){
		const vec = new Vec2();
		
		var array = [];
		
		for(var i = 0; i < this.sharpness; i++){
			var rand = Mathf.clamp(Mathf.randomSeedRange((b.id + Mathf.ceil(i / 4) * 128) + (Mathf.ceil(Time.time() / 1.5) * this.sharpness), 256), -1, 1);
			
			vec.trns(b.rot(), (this.lengthB / this.sharpness) * i, rand * 8 * Mathf.clamp(i, 0, 1) * b.fout());
			vec.add(b.x, b.y);
			
			for(var s = 0; s < 2; s++){
				array[(i * 2 + s)] = s == 0 ? vec.x : vec.y;
			};
		};
		
		Draw.color(Color.valueOf("f3e979"), Color.white, b.fin());
		Lines.stroke(2 * b.fout());
		
		Lines.polyline(array, this.sharpness * 2, false);
	}
});

staticLaser.sharpness = 140;
staticLaser.lengthB = 220;
staticLaser.speed = 0.001;
staticLaser.damage = 18.5;
staticLaser.lifetime = 18;
staticLaser.hitEffect = Fx.none;
staticLaser.despawnEffect = Fx.none;
staticLaser.hitSize = 7;
staticLaser.drawSize = 460;
staticLaser.pierce = true;
staticLaser.status = customShock;
staticLaser.statusDuration = 5 * 60;
staticLaser.shootEffect = Fx.none;
staticLaser.smokeEffect = Fx.none;

const staticTurret = extendContent(LaserTurret, "static", {});
staticTurret.shootType = staticLaser;
staticTurret.update = true;