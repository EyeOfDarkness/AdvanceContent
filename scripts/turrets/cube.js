const cubeCharge = newEffect(54, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Lines.stroke(0.1 + e.fin() * 1);
	
	const hk = new Floatc2({get: function(x, y){
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fslope() * 16);
	}});
	
	Angles.randLenVectors(e.id, 2, 2 + 65 * e.fout(), e.rotation, 360, hk);
});

const cubeChargeBegin = newEffect(120, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Fill.circle(e.x, e.y, e.finpow() * 20);
});

const cubeChargeShoot = newEffect(30, e => {
	
	Draw.color(Color.valueOf("a3e3ff"));
	Fill.circle(e.x, e.y, e.fout() * 20);
});

const cubeEffect = newEffect(23, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Fill.circle(e.x, e.y, e.fout() * 120);
});

const theLaser = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 29)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.lengthC, false);
		};
	},
	
	/*init: function(b){
		Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0);
	},*/
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			if(b.timer.get(2, 29)){
				Effects.effect(cubeEffect, Color.valueOf("ec7458aa"), hitx, hity);
				Damage.damage(b.getTeam(), hitx, hity, 120, 18000);
			}
		}
	},
	
	draw: function(b){
		const tscales = [1.0, 0.7, 0.5, 0.2];
		const lenscales = [1, 1.02, 1.026, 1.028];
		const length = this.lengthC;
		const f = Mathf.curve(b.fin(), 0.0, 0.2);
		const baseLen = length * f;

		//Draw.color(Color.valueOf("a3e3ff"));
		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		Draw.color(Color.valueOf("a3e3ff"));
		for(var i = 0; i < 4; i++){
			Lines.stroke(7 * b.fout() * 1.9 * tscales[i]);
			Lines.lineAngle(b.x, b.y, b.rot(), baseLen * lenscales[i]);
		};
		Draw.reset();
	}
});
theLaser.lengthC = 310.0;
theLaser.speed = 0.001;
theLaser.damage = 870;
theLaser.hitEffect = Fx.hitLancer;
theLaser.despawnEffect = Fx.none;
theLaser.hitSize = 4;
theLaser.lifetime = 28;
theLaser.pierce = true;
theLaser.shootEffect = cubeChargeShoot;
theLaser.smokeEffect = Fx.none;

const cubeDestroyed = newEffect(21, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Fill.rect(e.x, e.y, (Vars.tilesize * 8) * e.fout(), (Vars.tilesize * 8) * e.fout());
	Lines.stroke(e.fin() * 2);
	Lines.circle(e.x, e.y, (Vars.tilesize * 4) + (e.finpow() * 8));
});

const cubeDestroyedB = newEffect(54, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Fill.rect(e.x, e.y, (8 * 2.7) * e.fout(), (8 * 2.7) * e.fout(), e.fin() * 360);
	Lines.stroke(e.fin() * 2);
});

const cubeDestroyedC = newEffect(30, e => {
	Draw.color(Color.valueOf("a3e3ff"));
	Lines.stroke(0.1 + e.fout() * 2.3);
	
	const hb = new Floatc2({get: function(x, y){
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1 + e.fout() * 4);
	}});
	
	Angles.randLenVectors(e.id, 21, 8 + 230 * e.finpow(), e.rotation, 360, hb);
	
	const hc = new Floatc2({get: function(x, y){
		Lines.line(e.x, e.y, e.x + x, e.y + y);
	}});
	
	Lines.stroke(e.fout() * 1.5);
	Angles.randLenVectors(e.id + 6, 14, 8 + 340 * e.finpow(), e.rotation, 360, hc);
	
	Draw.reset();
});

const theCube = extendContent(ChargeTurret, "the-cube", {
	generateIcons: function(){
	return [
		Core.atlas.find(this.name)
	];},
	
	load: function(){
		this.baseRegion = Core.atlas.find(this.name);
	},
	
	onDestroyed: function(tile){
		//const wx = tile.worldx();
		//const wy = tile.worldy();
		const dx = tile.drawx();
		const dy = tile.drawy();
		const radius = 150;
		const damageC = 1300;
		const falloffC = 6;
		
		Effects.effect(cubeDestroyed, dx, dy, 0);
		Effects.effect(cubeDestroyedB, dx, dy, 0);
		Effects.effect(cubeDestroyedC, dx, dy, 0);
		Effects.effect(Fx.blockExplosionSmoke, dx, dy, 0);
		
		for(var s = 1; s < falloffC; s++){
			Damage.damage(Team.derelict, dx, dy, 150 + (radius / s), damageC / falloffC);
		};
		
		for(var a = 1; a < 12; a++){
			Lightning.create(Team.derelict, Color.valueOf("a3e3ff"), 64, dx, dy, Mathf.random(360), Mathf.random(47, 96));
		};
		//Damage.dynamicExplosion(wx, wy, 30, 60, 0, 120, Color.valueOf("a3e3ff"));
		
        if(!tile.floor().solid && !tile.floor().isLiquid){
            RubbleDecal.create(tile.drawx(), tile.drawy(), 8);
        };
	},
	
	drawLayer: function(tile){
		entity = tile.ent();
		const sizeB = 2.7 + Mathf.sin(Time.time(), 35, 0.12);
		const sizeC = 4;
		//const rotationB = entity.rotation + 45 + Mathf.sin(Time.time(), 4, 34);
		const rotationB = Mathf.sin(Time.time(), 80, 24);
		//const rotationC = (Mathf.sinDeg(entity.rotation) * 32) + Mathf.sin(Time.time(), 140, 35);
		const rotationC = entity.rotation + Mathf.sin(Time.time(), 140, 35);
		const directionB = new Vec3(1, 1, 0.5);
		const directionC = new Vec3(0, 0, -1);
		const shadeB = 3;
		
		const point1 = new Vec3();
		const point2 = new Vec3();
		const point3 = new Vec3();
		const point4 = new Vec3();
		const point5 = new Vec3();
		const point6 = new Vec3();
		const point7 = new Vec3();
		const point8 = new Vec3();
		const point9 = new Vec3();
		
		const tx = tile.drawx();
		const ty = tile.drawy();
		
		//const c1z = Mathf.clamp((point1.z + point2.z + point3.z + point4.z) / 4);
		//const c2z = Mathf.clamp((point1.z + point3.z + point5.z + point7.z) / 4);
		
		//const b1z = (point1.z + point2.z + point3.z + point4.z) < 0 ? 0 : 1;
		//const b2z = (point1.z + point3.z + point5.z + point7.z) < 0 ? 0 : 1;
		
		//this set is too complex for me to use Arrays and loops
		
		point1.set(point9.set(sizeC, sizeC, sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point2.set(point9.set(sizeC, sizeC, -sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point3.set(point9.set(sizeC, -sizeC, sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point4.set(point9.set(sizeC, -sizeC, -sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point5.set(point9.set(-sizeC, sizeC, sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point6.set(point9.set(-sizeC, sizeC, -sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point7.set(point9.set(-sizeC, -sizeC, sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		point8.set(point9.set(-sizeC, -sizeC, -sizeC).rotate(directionC, rotationC)).rotate(directionB, rotationB);
		
		const b1z = (point1.z + point2.z + point3.z + point4.z) < 0 ? 0 : 1;
		const b2z = (point1.z + point3.z + point5.z + point7.z) < 0 ? 0 : 1;
		const b3z = (point6.z + point2.z + point1.z + point5.z) < 0 ? 0 : 1;
		const b4z = (point7.z + point3.z + point4.z + point8.z) < 0 ? 0 : 1;
		const b5z = (point8.z + point4.z + point2.z + point6.z) < 0 ? 0 : 1;
		const b6z = (point7.z + point8.z + point6.z + point5.z) < 0 ? 0 : 1;
		
		const c1z = Mathf.clamp((point1.z + point2.z + point3.z + point4.z) / sizeC / shadeB);
		const c2z = Mathf.clamp((point1.z + point3.z + point5.z + point7.z) / sizeC / shadeB);
		const c3z = Mathf.clamp((point6.z + point2.z + point1.z + point5.z) / sizeC / shadeB);
		const c4z = Mathf.clamp((point7.z + point3.z + point4.z + point8.z) / sizeC / shadeB);
		const c5z = Mathf.clamp((point8.z + point4.z + point2.z + point6.z) / sizeC / shadeB);
		const c6z = Mathf.clamp((point7.z + point8.z + point6.z + point5.z) / sizeC / shadeB);
		
		const b1x = (point1.x * sizeB) + tx;
		const b1y = (point1.y * sizeB) + ty;
		const b2x = (point2.x * sizeB) + tx;
		const b2y = (point2.y * sizeB) + ty;
		const b3x = (point3.x * sizeB) + tx;
		const b3y = (point3.y * sizeB) + ty;
		const b4x = (point4.x * sizeB) + tx;
		const b4y = (point4.y * sizeB) + ty;
		const b5x = (point5.x * sizeB) + tx;
		const b5y = (point5.y * sizeB) + ty;
		const b6x = (point6.x * sizeB) + tx;
		const b6y = (point6.y * sizeB) + ty;
		const b7x = (point7.x * sizeB) + tx;
		const b7y = (point7.y * sizeB) + ty;
		const b8x = (point8.x * sizeB) + tx;
		const b8y = (point8.y * sizeB) + ty;
		
		Draw.color(Color.valueOf("a3e3ff").mul(c1z, c1z, 1, b1z));
		Fill.quad(b1x, b1y, b2x, b2y, b4x, b4y, b3x, b3y);
		Draw.color(Color.valueOf("a3e3ff").mul(c2z, c2z, 1, b2z));
		Fill.quad(b5x, b5y, b1x, b1y, b3x, b3y, b7x, b7y);
		Draw.color(Color.valueOf("a3e3ff").mul(c3z, c3z, 1, b3z));
		Fill.quad(b6x, b6y, b2x, b2y, b1x, b1y, b5x, b5y);
		Draw.color(Color.valueOf("a3e3ff").mul(c4z, c4z, 1, b4z));
		Fill.quad(b7x, b7y, b3x, b3y, b4x, b4y, b8x, b8y);
		Draw.color(Color.valueOf("a3e3ff").mul(c5z, c5z, 1, b5z));
		Fill.quad(b8x, b8y, b4x, b4y, b2x, b2y, b6x, b6y);
		Draw.color(Color.valueOf("a3e3ff").mul(c6z, c6z, 1, b6z));
		Fill.quad(b7x, b7y, b8x, b8y, b6x, b6y, b5x, b5y);
		
		Draw.reset();
	}
});
theCube.shootType = theLaser;
theCube.chargeEffect = cubeCharge;
theCube.chargeBeginEffect = cubeChargeBegin;
theCube.chargeEffects = 13;
theCube.chargeMaxDelay = 36;