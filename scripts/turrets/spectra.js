const sHitEffect = newEffect(12, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000ff").shiftHue(Time.time() * 3.0));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
	}});
	
	Angles.randLenVectors(e.id, 4, e.finpow() * 30.0, e.rotation, 70.0, hl);
	Draw.blend();
	Draw.reset();
});

const spectralaser = extend(BasicBulletType, {
	
	update: function(b){
		Effects.shake(0.8, 0.8, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 190.0, false);
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("ff000055"), Color.valueOf("ff0000"), Color.valueOf("ffffff")];
		const tscales = [1, 0.8, 0.55];
		const strokes = [1.1, 0.75, 0.4];
		const lenscales = [1.0, 1.07, 1.09];
		const tmpColor = new Color();

		for(var s = 0; s < 3; s++){
			
			Draw.color(tmpColor.set(colors[s]).shiftHue(Time.time() * 2.0));
			for(var i = 0; i < 3; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 15.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.4, 1.5)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), 187.0 * b.fout() * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

spectralaser.speed = 0.001;
spectralaser.damage = 21;
spectralaser.lifetime = 13;
spectralaser.hitEffect = sHitEffect;
spectralaser.despawnEffect = Fx.none;
spectralaser.hitSize = 5;
spectralaser.drawSize = 310;
spectralaser.pierce = true;
spectralaser.shootEffect = Fx.none;
spectralaser.smokeEffect = Fx.none;

const spectra = extendContent(LaserTurret, "spectra",{
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

		//drawer.get(tile, entity);
		Draw.rect(this.region, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);

		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time() * 2.0));
		Draw.rect(this.rainbowRegion, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);
		Draw.color();
	}
});
spectra.shootType = spectralaser;
spectra.update = true;