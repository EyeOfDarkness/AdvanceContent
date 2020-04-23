const rbHitEffect = newEffect(12, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000ff").shiftHue(Time.time() * 4.0));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
	}});
	
	Angles.randLenVectors(e.id, 6, e.finpow() * 50.0, e.rotation, 60.0, hl);
	Draw.blend();
	Draw.reset();
});

const rainbowLaserEffect = newEffect(25, e => {
	const trnsE = new Vec2();
	
	trnsE.trns(e.rotation, e.fin() * 70);
	Draw.color(Color.valueOf("ff5555ff").shiftHue(Time.time() * 2.0), Color.valueOf("ff000000").shiftHue(Time.time() * 2.0), e.fin());
	//Fill.poly(e.x, e.y, 4, e.fout() * 17, e.rotation);
	Fill.poly(e.x + trnsE.x, e.y + trnsE.y, 4, e.fout() * 6, e.rotation);
});

const rainbowLaser = extend(BasicBulletType, {
	
	update: function(b){
		const trnsB = new Vec2();
		const trnsC = new Vec2();
		
		Effects.shake(0.8, 0.8, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 245.0, true);
		};
		if(Mathf.chance(0.9)){
			trnsB.trns(b.rot(), Mathf.random(0.5, 240.0), Mathf.range(7.0));
			//trnsC.trns(b.rot() + 90, Mathf.range(7.0));
			Effects.effect(rainbowLaserEffect, b.x + trnsB.x, b.y + trnsB.y, b.rot());
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("ff000044"), Color.valueOf("ff000099"), Color.valueOf("ff3333"), Color.valueOf("ffffff")];
		const tscales = [1.4, 1.0, 0.9, 0.55];
		const strokes = [1.8, 1.4, 1.04, 0.6];
		const lenscales = [1.0, 1.16, 1.20, 1.23];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			
			Draw.color(tmpColor.set(colors[s]).shiftHue((s * 45) + (Time.time() * 2.0)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 20.0);
				Lines.stroke((9 + Mathf.absin(Time.time() + (15 * s), 1.9, 1.8)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), 230.0 * b.fout() * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

rainbowLaser.speed = 0.001;
rainbowLaser.damage = 49;
rainbowLaser.lifetime = 13;
rainbowLaser.hitEffect = rbHitEffect;
rainbowLaser.despawnEffect = Fx.none;
rainbowLaser.hitSize = 5;
rainbowLaser.drawSize = 310;
rainbowLaser.pierce = true;
rainbowLaser.shootEffect = Fx.none;
rainbowLaser.smokeEffect = Fx.none;

const rainbow = extendContent(LaserTurret, "rainbow-road",{
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("block-" + this.size);
		this.rainbowRegion = Core.atlas.find(this.name + "-rainbow");
	},
	
	drawLayer: function(tile){
		const tr2 = new Vec2();
		
		entity = tile.ent();

		tr2.trns(entity.rotation, -entity.recoil);

		Draw.rect(this.region, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);

		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time() * 2.0));
		Draw.rect(this.rainbowRegion, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);
		Draw.color();
	}
});
rainbow.shootType = rainbowLaser;
rainbow.update = true;