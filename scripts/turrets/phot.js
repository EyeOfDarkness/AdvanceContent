const photonlaser = extend(BasicBulletType, {
	
	update: function(b){
		Effects.shake(0.8, 0.8, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 150.0, false);
		}
	},
	
	/*hit: function(b, hitx, hity){
	Effects.effect(this.hitEffect, Color.valueOf("a9d8ffaa"), hitx, hity);
		if(Mathf.chance(0.1)){
			//Fire.create(world.tileWorld(hitx + Mathf.range(6.0), hity + Mathf.range(6.0)));
			Damage.createIncend(hitx, hity, 6, 1);
		}
	},*/
	
	draw: function(b){
		
		const colors = [Color.valueOf("a9d8ff5f"), Color.valueOf("a9d8ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.8, 0.6, 0.3];
		const strokes = [0.92, 0.6, 0.28];
		const lenscales = [1.0, 1.18, 1.21, 1.217];
		const tmpColor = new Color();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 3; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.5, 0.1)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 25.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.4, 1.5)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), 147.0 * b.fout() * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

photonlaser.speed = 0.001;
photonlaser.damage = 16;
photonlaser.lifetime = 13;
photonlaser.hitEffect = Fx.hitLancer;
photonlaser.despawnEffect = Fx.none;
photonlaser.hitSize = 5;
photonlaser.drawSize = 610;
photonlaser.pierce = true;
photonlaser.shootEffect = Fx.none;
photonlaser.smokeEffect = Fx.none;

const photon = extendContent(LaserTurret, "photon", {});
photon.shootType = photonlaser;
photon.update = true;