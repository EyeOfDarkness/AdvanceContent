const excalLaser = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0, false);
		};
	},
	
	/*init: function(b){
		Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0);
	},*/
	
	draw: function(b){
		const colors = [Pal.lancerLaser.cpy().mul(1.0, 1.0, 1.0, 0.4), Pal.lancerLaser, Color.white];
		const tscales = [1.0, 0.7, 0.5, 0.2];
		const lenscales = [1, 1.1, 1.13, 1.14];
		const length = 190.0;
		const f = Mathf.curve(b.fin(), 0.0, 0.2);
		const baseLen = length * f;

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 3; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < 4; i++){
				Lines.stroke(7 * b.fout() * (s == 0 ? 1.5 : s == 1 ? 1 : 0.3) * tscales[i]);
				Lines.lineAngle(b.x, b.y, b.rot(), baseLen * lenscales[i]);
			}
		};
		Draw.reset();
	}
});
excalLaser.speed = 0.001;
excalLaser.damage = 205;
excalLaser.hitEffect = Fx.hitLancer;
excalLaser.despawnEffect = Fx.none;
excalLaser.hitSize = 4;
excalLaser.lifetime = 16;
excalLaser.pierce = true;

const excalChargeBegin = newEffect(60, e => {
	Draw.color(Color.valueOf("a9d8ff"));
	Fill.circle(e.x, e.y, e.fin() * 5);

	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, e.fin() * 4);
});

const excalLaserShootSmoke = newEffect(26, e => {
	Draw.color(Pal.lancerLaser);
	
	const hl = new Floatc2({get: function(x, y){
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fout() * 9.5);
	}});
	
	Angles.randLenVectors(e.id, 9, 95.0, e.rotation, 0.0, hl);
});

/*const excalCharge = newEffect(28, e => {
	Draw.color(Color.valueOf("a9d8ff"));

	Angles.randLenVectors(e.id, 2, 1 + 20 * e.fout(), e.rotation, 180, (x, y) => {
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fslope() * 3 + 1);
	});
});*/

const excalShoot = newEffect(19, e => {
	Draw.color(Color.valueOf("a9d8ff"));

	/*for(var i = 1; i < 5; i++){
		Drawf.tri(e.x, e.y, 9 * e.fout(), 36 + e.fin() * 6, e.rotation + 90 * i);
	};*/
	
	for(var i = 0; i < 2; i++){
		Drawf.tri(e.x, e.y, 9 * e.fout(), 36 + e.fin() * 6, e.rotation + 90 + (180 * i));
	};

	Draw.color(Color.valueOf("a9d8ff"));
	Fill.circle(e.x, e.y, e.fout() * 9);

	Draw.color(Color.valueOf("ffffff"));
	Fill.circle(e.x, e.y, e.fout() * 7.5);
});

const excal = extendContent(ChargeTurret, "excalibur", {});

excal.chargeBeginEffect = excalChargeBegin;
excal.chargeEffect = Fx.lancerLaserCharge;
excal.smokeEffect = excalLaserShootSmoke;
excal.shootEffect = excalShoot;
excal.shootType = excalLaser;