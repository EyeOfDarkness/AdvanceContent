const neutShoot = newEffect(28, e => {
	Draw.color(Color.valueOf("a9d8ff"));

	//Drawf.tri(e.x, e.y, 9 * e.fout(), 45 + e.fin() * 6, e.rotation + 90 * i);
	Fill.poly(e.x, e.y, 3, e.fout() * 12, e.rotation);
	Fill.circle(e.x, e.y, e.fout() * 6);

	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, e.fout() * 4.5);
});

const neutTrail = newEffect(55, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	Fill.poly(e.x, e.y, 3, e.fout() * 4, e.rotation + e.fin() * 180);
});

const neutHit = newEffect(20, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		//Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
		Fill.poly(e.x + x, e.y + y, 3, e.fout() * 5, (e.fin() * 120) + (e.rotation + ang));
	}});
	
	Angles.randLenVectors(e.id, 7, e.finpow() * 50.0, e.rotation, 360.0, hl);
	Draw.reset();
});

const neutBullet = extend(FlakBulletType, {
	update(b){
		this.super$update(b);

		if(b.timer.get(0, 2 + b.fslope() * 1.5)){
			Effects.effect(this.trailEffect, this.backColor, b.x, b.y, b.fslope() * 4);
		}
	},
	
	/*hit: function(b, x, y){
		Effects.effect(this.hitEffect, x, y, b.rot());
		for(var a; a < this.fragBullets; a++){
			Lightning.create(b.getTeam, Color.valueOf("a9d8ff"), 18, b.x, b.y, Mathf.random(360), Mathf.random(4, 16));
		}
	}*/
});

neutBullet.explodeRange = 30;
neutBullet.speed = 8.7;
neutBullet.damage = 7;
neutBullet.lifetime = 30;
neutBullet.bulletWidth = 8;
neutBullet.bulletHeight = 14;
neutBullet.bulletShrink = 0;
neutBullet.hitSize = 7;
neutBullet.splashDamageRadius = 45;
neutBullet.splashDamage = 28;
neutBullet.trailEffect = neutTrail;
neutBullet.hitEffect = neutHit;
neutBullet.collides = true;
neutBullet.collidesTiles = true;
neutBullet.collidesAir = true;
neutBullet.frontColor = Color.valueOf("ffffff");
neutBullet.backColor = Color.valueOf("a9d8ff");

const neut = extendContent(PowerTurret, "neutron", {});

neut.shootEffect = neutShoot;
neut.shootType = neutBullet;