const elib = require("effectlib");

const whirl = newEffect(65, e => {
	const vec = new Vec2();
	for(var i = 0; i < 2; i++){
		var h = i * 2;
		var rand1 = Interpolation.exp5In.apply((Mathf.randomSeedRange(e.id + h, 1) + 1) / 2);
		var rand2 = (Mathf.randomSeedRange(e.id * 2 + h, 360) + 360) / 2;
		var rand3 = (Mathf.randomSeedRange(e.id * 4 + h, 5) + 5) / 2;
		var angle = rand2 + ((180 + rand3) * e.fin());
		
		vec.trns(angle, rand1 * 70 * e.fout());
		
		Draw.color(Color.valueOf("a9d8ff"));
		Lines.stroke((1 * e.fout()) + 0.25);
		Lines.lineAngle(e.x + vec.x, e.y + vec.y, angle + 270 + 15, e.fout() * 8);
		
		//Fill.poly(e.x + vec.x, e.y + vec.y, 6, 5 * e.fout(), e.rotation);
	};
});

const laserEffect = elib.newEffectWDraw(7, 400, e => {
	var pos1 = e.data[0];
	var pos2 = e.data[1];
	var stroke = e.data[2] * 1.8;

	Draw.color(Color.valueOf("a9d8ff"));
		
	Fill.circle(pos1.x, pos1.y, stroke * 2 * e.fout());
		
	Fill.circle(pos2.x, pos2.y, stroke * 2 * e.fout());
		
	Lines.stroke(stroke * 2 * e.fout());
	Lines.line(pos1.x, pos1.y, pos2.x, pos2.y, CapStyle.none);
	Draw.reset();
	Draw.blend();
});

const gluonTrail = newEffect(55, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	//Fill.circle(e.x, e.y, e.rotation * e.fout());
	
	Fill.poly(e.x, e.y, 6, e.rotation * e.fout(), e.rotation);
});

const gluonBulletEffect = extend(BasicBulletType, {
	update: function(b){
		const vec = new Vec2();
		const vec2 = new Vec2();
		
		if(Mathf.chance(Time.delta() * (0.7 * b.fout()))){
			Effects.effect(whirl, b.x, b.y);
		};
		
		Units.nearbyEnemies(b.getTeam(), b.x - this.rangeB, b.y - this.rangeB, this.rangeB * 2, this.rangeB * 2, cons(u => {
			if(u != null && Mathf.within(b.x, b.y, u.x, u.y, this.rangeB)){
				if(u instanceof SolidEntity){
					var interp = this.strength * Interpolation.pow2In.apply(b.fout());
					var dst = Math.abs((Mathf.dst(b.x, b.y, u.x, u.y) / this.rangeB) - 1) * interp;
					var ang = Angles.angle(u.x, u.y, b.x, b.y);
					
					vec.trns(ang, dst);
					
					u.velocity().add(vec);
					
					if(u instanceof FlyingUnit){
						vec2.set(vec).scl(0.5);
						u.velocity().add(vec2);
					};
					
					u.moveBy(vec.x, vec.y);
					
					//var data = [b, u, interp];
					
					//Effects.effect(laserEffect, b.x, b.y, 0, data);
				}
			}
		}));
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, b.fout() * 7.5);
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, b.fout() * 5.5);
	}
});

gluonBulletEffect.strength = 0.3;
gluonBulletEffect.rangeB = 100;
gluonBulletEffect.speed = 0.0002;
gluonBulletEffect.damage = 2;
gluonBulletEffect.lifetime = 5 * 60;
gluonBulletEffect.pierce = true;
gluonBulletEffect.bulletWidth = 12;
gluonBulletEffect.bulletHeight = 12;
gluonBulletEffect.bulletShrink = 0;
gluonBulletEffect.hitSize = 12;
gluonBulletEffect.despawnEffect = Fx.none;

const gluonBullet = extend(BasicBulletType, {
	update: function(b){
		const vec = new Vec2();
		
		if(b.timer.get(0, 2 + b.fslope() * 1.5)){
			Effects.effect(gluonTrail, this.backColor, b.x, b.y, 1 + (b.fslope() * 4));
		};
		
		Units.nearbyEnemies(b.getTeam(), b.x - this.rangeB, b.y - this.rangeB, this.rangeB * 2, this.rangeB * 2, cons(u => {
			if(u != null && Mathf.within(b.x, b.y, u.x, u.y, this.rangeB)){
				if(u instanceof SolidEntity){
					var dst = Math.abs((Mathf.dst(b.x, b.y, u.x, u.y) / this.rangeB) - 1) * this.strength;
					var ang = Angles.angle(u.x, u.y, b.x, b.y);
					
					if(Angles.angleDist(b.rot() - 180, ang - 180) < 90){
						//print("aaaa");
						
						vec.trns(ang, dst);
						
						u.velocity().add(vec);
						
						//if(u instanceof FlyingUnit) u.velocity().add(vec);
						
						u.moveBy(vec.x, vec.y);
						
						var data = [b, u, this.strength];
						
						Effects.effect(laserEffect, b.x, b.y, 0, data);
					};
				}
			}
		}));
	},
	
	despawned(b){
		this.super$despawned(b);
		
		Bullet.create(gluonBulletEffect, b, b.x, b.y, b.rot());
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 6 + (b.fout() * 1.5));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 4.5 + (b.fout() * 1));
	}
});

gluonBullet.strength = 0.7;
gluonBullet.rangeB = 80;
gluonBullet.speed = 8.6;
gluonBullet.damage = 5;
gluonBullet.drag = 0.03;
gluonBullet.lifetime = 50;
gluonBullet.pierce = true;
gluonBullet.bulletWidth = 12;
gluonBullet.bulletHeight = 12;
gluonBullet.bulletShrink = 0;
gluonBullet.hitSize = 9;
gluonBullet.despawnEffect = Fx.none;
//gluonBullet.hitSound = Sounds.spark;

const gluon = extendContent(PowerTurret, "gluon", {});

gluon.shootType = gluonBullet;