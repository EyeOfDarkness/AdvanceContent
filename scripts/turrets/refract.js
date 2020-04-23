const reHitEffect = newEffect(16, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000ff").shiftHue(Time.time() * 2.0));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		//Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
		Fill.poly(e.x + x, e.y + y, 4, ((e.finpow() * -1) + 1) * 8, e.rotation + ang);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 70.0, e.rotation, 80.0, hl);
	Draw.blend();
	Draw.reset();
});

const refractorLaserEffect = newEffect(25, e => {
	const trnsE = new Vec2();
	
	trnsE.trns(e.rotation, e.fin() * 70);
	Draw.color(Color.valueOf("ff5555ff").shiftHue(Time.time() * 2.0), Color.valueOf("ff000000").shiftHue(Time.time() * 2.0), e.fin());
	//Fill.poly(e.x, e.y, 4, e.fout() * 17, e.rotation);
	Fill.poly(e.x + trnsE.x, e.y + trnsE.y, 4, e.fout() * 6, e.rotation);
});

const refractorLaser = extend(BasicBulletType, {
	
	update: function(b){
		const trnsB = new Vec2();
		const trnsC = new Vec2();
		
		Effects.shake(0.8, 0.8, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.laserLength * 1.10, true);
		};
		trnsB.trns(b.rot(), Mathf.random(0.5, 270.0), Mathf.range(8.0));
		Effects.effect(refractorLaserEffect, b.x + trnsB.x, b.y + trnsB.y, b.rot());
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("ff000044"), Color.valueOf("ff000066"), Color.valueOf("ff000099"), Color.valueOf("ff3333"), Color.valueOf("ff8080"), Color.valueOf("ffffff")];
		const tscales = [1.4, 1.1, 0.9, 0.55];
		const strokes = [3, 2.4, 1.8, 1.4, 1.04, 0.6];
		const lenscales = [1.0, 1.10, 1.15, 1.167];
		const tmpColor = new Color();

		for(var s = 0; s < 6; s++){
			
			Draw.color(tmpColor.set(colors[s]).shiftHue((s * 17) + (Time.time() * 2.0)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 34.0);
				Lines.stroke((8 + Mathf.absin(Time.time() + (2 * s), 1.9, 1.3)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.laserLength * b.fout() * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

refractorLaser.laserLength = 290;
refractorLaser.speed = 0.001;
refractorLaser.damage = 109;
refractorLaser.lifetime = 17;
refractorLaser.hitEffect = reHitEffect;
refractorLaser.despawnEffect = Fx.none;
refractorLaser.hitSize = 5;
refractorLaser.drawSize = 410;
refractorLaser.pierce = true;
refractorLaser.shootEffect = Fx.none;
refractorLaser.smokeEffect = Fx.none;

const refractor = extendContent(LaserTurret, "refraction", {
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		
		for(i = 0; i < 6; i++){
			this.rainbowRegions[i] = Core.atlas.find(this.name + "-rainbow-" + (i + 1));
		};
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	drawLayer: function(tile){
		//const tr2 = new Vec2();
		
		entity = tile.ent();

		this.tr.trns(entity.rotation, -entity.recoil);

		Draw.rect(this.region, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation - 90);

		for(var h = 0; h < 6; h++){
			Draw.color(Color.valueOf("ff0000").shiftHue((Time.time() * 2.0) + (h * 17)));
			Draw.rect(this.rainbowRegions[h], tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation - 90);
			Draw.color();
		}
	}
});
refractor.shootType = refractorLaser;
refractor.update = true;
refractor.rainbowRegions = [];