const pullEffectEffect = newEffect(10, e => {
	const wd = 9;
	const vA = new Vec2();
	const vB = new Vec2();
	
	vA.trns(e.rotation, e.fout() * 25, wd);
	vB.trns(e.rotation, e.fout() * 25, -wd);
	
	Draw.color(Color.valueOf("a9d8ff71"));
	
	Lines.stroke(Mathf.sin(e.fin() * 3, 1, 2) * 1.4);
	Lines.line(e.x + vA.x, e.y + vA.y, e.x + vB.x, e.y + vB.y);
});

const pullHitEffect = newEffect(12, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("3d65ff4f"));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
	}});
	
	Angles.randLenVectors(e.id, 1, e.finpow() * 19.0, e.rotation, 360.0, hl);
	Draw.blend();
	Draw.reset();
});

const gravitonlaser = extend(BasicBulletType, {
	
	update: function(b){
		const trnsA = new Vec2();
		
		Effects.shake(0.7, 0.7, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 250.0, true);
			for(var f = 0; f < 16; f++){
				trnsA.trns(b.rot(), 15.625 * f);
				Effects.effect(pullEffectEffect, b.x + trnsA.x, b.y + trnsA.y, b.rot());
			}
		};
	},
	
	hit: function(b, hitx, hity){
		const trnsA = new Vec2();
		const trnsB = new Vec2();
		const radius = 46;
		
		trnsB.trns(b.rot(), 8);
		
		if(hitx != null && hity != null){
			var tx = hitx + trnsB.x;
			var ty = hity + trnsB.y;
			
			Units.nearbyEnemies(b.getTeam(), tx - radius, ty - radius, radius * 2, radius * 2, cons(unit => {
				if(unit.withinDst(tx, ty, radius)){
					if(unit instanceof SolidEntity){
						var targetMass = 0;
						
						if(unit instanceof BaseUnit) targetMass = unit.getType().mass;
						if(unit instanceof Player) targetMass = unit.mech.mass;
						
						var angle = Angles.angle(unit.x, unit.y, b.x, b.y);
						trnsA.trns(angle, 4.5 / (targetMass / 2 + 1));
						
						unit.velocity().add(trnsA.x, trnsA.y);
						
						//print(unit);
					}
				};
			}));
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("3d65ff19"), Color.valueOf("a9d8ff31")];
		const tscales = [1, 0.8, 0.6, 0.3];
		const strokes = [2.4, 1.8];
		const lenscales = [1.0, 1.08, 1.12, 1.16];
		const tmpColor = new Color();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		//Draw.blend(Blending.additive);
		for(var s = 0; s < 2; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.5, 0.1)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 25.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 3.0, 0.8)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), 247.0 * b.fout() * lenscales[i]);
			}
		};
		//Draw.blend();
		Draw.reset();
	}
});

gravitonlaser.speed = 0.001;
gravitonlaser.damage = 0.3;
gravitonlaser.shootEffect = Fx.none;
gravitonlaser.smokeEffect = Fx.none;
gravitonlaser.lifetime = 13;
gravitonlaser.hitEffect = Fx.hitLancer;
gravitonlaser.despawnEffect = Fx.none;
gravitonlaser.hitSize = 5;
gravitonlaser.drawSize = 670;
gravitonlaser.pierce = true;

const graviton = extendContent(LaserTurret, "graviton",{});
graviton.shootType = gravitonlaser;
graviton.update = true;