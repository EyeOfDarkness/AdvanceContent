const elib = require("effectlib");

const spellCardOver = elib.newEffectWDraw(54, 1300, e => {
	const vec = new Vec2();
	const vec2 = new Vec2();
	//const lastVec = new Vec2();
	//const rand = new Vec2();
	var power = new Interpolation.PowOut(2).apply(e.fin());
	var power2 = new Interpolation.PowOut(3).apply(e.fin());
	var power3 = Interpolation.pow4Out.apply(e.fin());
	var sides = 148;
	var poly = [];
	var poly2 = [];
	//var lenRand = Mathf.range(2);
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
	Lines.stroke(12 * e.fslope());
	
	//Fill.circle(e.x, e.y, power3 * 570);
	
	vec.trns(e.rotation, e.finpow() * 340);
	
	for(var i = 0; i < sides; i++){
		var rand = Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i), 0, 160) / 160;
		var smooth = Interpolation.pow2.apply(rand);
		//vec.trns(360 / sides * i + e.rotation, power * 340 + (Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i), -60, 60) * e.finpow())).add(e.x, e.y);
		vec.trns(360 / sides * i + e.rotation, power * 540 + (smooth * 60 * e.fin())).add(e.x, e.y);
		
		rand = Mathf.randomSeed(Mathf.round(Time.time() * 270 + e.id + i + sides), 0, 230) / 230;
		smooth = Interpolation.pow2.apply(rand);
		
		vec2.trns(360 / sides * i + e.rotation, power2 * 440 + (smooth * 190 * e.fin())).add(e.x, e.y);
		
		for(var b = 0; b < 2; b++){
			poly[(i * 2 + b)] = b == 0 ? vec.x : vec.y;
			poly2[(i * 2 + b)] = b == 0 ? vec2.x : vec2.y;
		};
	};
	Lines.polyline(poly, sides * 2, true);
	
	Draw.color(Color.valueOf("ff0000").shiftHue(Time.time() + 40));
	
	Lines.polyline(poly2, sides * 2, true);
	
	Draw.alpha(e.fout() / 2);
	Fill.circle(e.x, e.y, power3 * 570);
	
	Draw.blend();
	Draw.reset();
});

const clearEffect = newEffect(25, e => {
	//const curve1 = e.finpow();
	const curve1 = Interpolation.pow3In.apply(e.fin());
	const curve2 = Mathf.curve(e.fout(), 0, 0.3);
	const lerpx = Mathf.lerp(e.x, e.data.x, curve1);
	const lerpy = Mathf.lerp(e.y, e.data.y, curve1);
	
	Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()), Color.valueOf("ff000000").shiftHue(Time.time()), e.fin());
	Fill.circle(lerpx, lerpy, curve2 * 4);
	
	Draw.color();
});

const bulletLarge = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
		Fill.circle(b.x, b.y, this.radius);
		
		Draw.color();
		Fill.circle(b.x, b.y, this.radius * 0.85);
	}
});

bulletLarge.lifetime = 260;
bulletLarge.speed = 2.3;
bulletLarge.damage = 25;
bulletLarge.pierce = false;
bulletLarge.bulletShrink = 0;
bulletLarge.bulletWidth = 15.5;
bulletLarge.bulletHeight = 23;
bulletLarge.hitSize = 8;
bulletLarge.radius = 8.5;

const bulletSlowAlt = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
		Fill.circle(b.x, b.y, this.radius);
		
		Draw.color();
		Fill.circle(b.x, b.y, this.radius * 0.85);
	}
});

bulletSlowAlt.lifetime = 390;
bulletSlowAlt.speed = 1.1;
bulletSlowAlt.damage = 12;
bulletSlowAlt.pierce = false;
bulletSlowAlt.hitSize = 4;
bulletSlowAlt.radius = 4.5;

const bulletSlow = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
		Fill.circle(b.x, b.y, this.radius);
		
		Draw.color();
		Fill.circle(b.x, b.y, this.radius * 0.85);
	}
});

bulletSlow.lifetime = 590;
bulletSlow.speed = 1.1;
bulletSlow.damage = 12;
bulletSlow.pierce = false;
bulletSlow.hitSize = 4;
bulletSlow.radius = 4.5;

const kami = extendContent(PowerTurret, "curtain-of-bullets", {
	load(){
		this.super$load();
		
		this.region = Core.atlas.find("blank");
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.gunRegion = Core.atlas.find(this.name + "-gun");
		
		for(var l = 0; l < 4; l++){
			this.rainbowRegion[l] = Core.atlas.find(this.name + "-rainbow-" + (l + 1));
		};
	},
	
	update(tile){
		entity = tile.ent();
		
		if(entity.timer.get(this.timerTarget, this.targetInterval)){
			this.findTargetB(tile);
		};
		
		if(!this.validateTarget(tile)) entity.target = null;

		if(this.validateTarget(tile) && tile.entity.cons.valid()){
			this.updateShootingB(tile);
		};
		
		if(entity.target == null && entity.shots > 1){
			entity.shots--;
		};
	},
	
	shootSoundB(tile, x, y, pitch){
		this.shootSound.at(tile.drawx() + x, tile.drawy() + y, 1 + pitch);
	},
	
	draw(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		for(var l = 0; l < 4; l++){
			Draw.color(Color.valueOf("ff0000").shiftHue(Time.time() + (l * 17)));
			Draw.rect(this.rainbowRegion[l], tile.drawx(), tile.drawy());
		};
		Draw.color();
	},
	
	drawLayer(tile){
		entity = tile.ent();
		
		var target = entity.target;
		
		if(entity.shots < 1900){
			for(var i = 0; i < 2; i++){
				var sign = Mathf.signs[i];
				
				this.tr.trns(entity.rotation + (90 * sign), entity.reload * 290);
				
				Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
				Fill.circle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), Mathf.curve(entity.reload, 0, 0.2) * 12);
			};
		};
		if(entity.shots > 1900 && entity.shots < 3500){
			for(var s = 0; s < 3; s++){
				this.tr.trns(360 / 3 * s + entity.rotation, entity.reload * 290);
				
				Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
				Fill.circle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), Mathf.curve(entity.reload, 0, 0.2) * 12);
			}
		};
		if(entity.shots > 3500 && entity.shots < 4900){
			for(var v = 0; v < 2; v++){
				this.tr.trns(360 / 2 * v, entity.reload * 70);
				var angle = 0;
				
				if(target != null) angle = Angles.angle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), target.getX(), target.getY());
				//if(entity.shots > 3500 && entity.shots < 3570) Draw.alpha
				
				Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
				if(entity.shots > 3500 && entity.shots < 3570) Draw.alpha((entity.shots - 3500) / 70);
				
				Draw.rect(this.gunRegion, this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), angle - 90);
				//Fill.circle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), Mathf.curve(entity.reload, 0, 0.2) * 12);
			}
		};
		if(entity.shots > 4900 && entity.shots < 6470) this.drawB(tile);
		if(entity.shots > 6470) this.drawC(tile);
		Draw.color();
	},
	
	drawB(tile){
		entity = tile.ent();
		
		var target = entity.target;
		
		for(var v = 0; v < Mathf.ceil(2 + entity.heat); v++){
			this.tr.trns(360 / (2 + entity.heat) * v, entity.reload * 70);
			var angle = 0;
			
			if(target != null) angle = Angles.angle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), target.getX(), target.getY());
			//if(entity.shots > 3500 && entity.shots < 3570) Draw.alpha
			
			Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
			
			Draw.rect(this.gunRegion, this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), angle - 90);
			//Fill.circle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), Mathf.curve(entity.reload, 0, 0.2) * 12);
		}
	},
	
	drawC(tile){
		entity = tile.ent();
		
		this.tr.x = Mathf.sin(entity.shots, 89 * 1.5, entity.reload * 290);
		this.tr.y = Mathf.sin(entity.shots + 90, 127 * 1.5, entity.reload * 160);
		
		Draw.color(Color.valueOf("ff0000").shiftHue(Time.time()));
		Fill.circle(this.tr.x + tile.drawx(), this.tr.y + tile.drawy(), Mathf.curve(entity.reload, 0, 0.2) * 12);
	},
	
	findTargetB(tile){
		entity = tile.ent();
		
		entity.target = Units.closestTarget(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead() && e instanceof Player));
	},
	
	generateIcons(){
	return [
		Core.atlas.find(this.name)
	];},
	
	updateShootingB(tile){
		entity = tile.ent();
		
		entity.shots++;
		
		//print(entity.shots);
		
		var seq = entity.shots;
		
		if(seq > 50 && seq < 500) this.sequenceA(tile);
		
		if(seq > 500 && seq < 570) this.trns(tile);
		
		if(seq > 570 && seq < 1100) this.sequenceB(tile);
		
		if(seq > 1100 && seq < 1300) this.trnsB(tile);
		
		if(seq > 1300 && seq < 1900) this.sequenceC(tile);
		
		if(seq > 1900 && seq < 1970) this.trnsC(tile);
		
		if(seq > 1970 && seq < 2500) this.sequenceD(tile);
		
		if(seq > 2500 && seq < 2570) this.trnsD(tile);
		
		if(seq == 2570) this.clearBullets(tile);
		
		if(seq > 2570 && seq < 3500) this.sequenceE(tile);
		
		if(seq > 3500 && seq < 3570){
			this.sequenceE(tile);
			this.trnsE(tile);
		};
		
		if(seq > 3570 && seq < 4900){
			this.sequenceE(tile);
			this.sequenceF(tile);
		};
		
		if(seq == 4900) this.clearBullets(tile);
		
		if(seq > 4900 && seq < 4970){
			//this.sequenceE(tile);
			this.trnsF(tile);
		};
		
		if(seq > 4970 && seq < 5800){
			//this.sequenceE(tile);
			this.sequenceG(tile);
		};
		
		if(seq > 5800 && seq < 5870) this.trnsG(tile);
		
		if(seq > 5870 && seq < 6400) this.sequenceH(tile);
		
		if(seq > 6400 && seq < 6470) this.trnsH(tile);
		
		if(seq > 6470 && seq < 6540){
			this.trnsI(tile);
			this.sequenceI(tile);
		};
		
		if(seq > 6540 && seq < 7800) this.sequenceI(tile);
		
		if(seq > 7800 && seq < 7870) this.trnsJ(tile);
		
		if(seq > 7870){
			//entity.shots = 50;
			entity.rotation = 90;
			entity.reload = 0;
			entity.shots = 50;
		};
	},
	
	clearBullets(tile){
		entity = tile.ent();
		var target = entity.target;
		
		Vars.bulletGroup.intersect(tile.drawx() - this.range, tile.drawy() - this.range, this.range * 2, this.range * 2, cons(b => {
			if(b != null){
				if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, this.range) && b.getOwner() == entity){
					b.scaleTime(Mathf.lerp(b.time(), b.getBulletType().lifetime, 0.999));
					b.velocity(0.001, b.rot());
					b.deflect();
					const vec = new Vec2()
					if(target instanceof TileEntity || target instanceof BaseUnit) vec.set(tile.drawx(), tile.drawy());
					if(target instanceof Player) vec.set(target.getX(), target.getY());
					
					Effects.effect(clearEffect, b.x, b.y, 0, vec);
				}
			}
		}));
		
		Effects.effect(spellCardOver, tile.drawx(), tile.drawy());
		this.breakSound.at(tile, Mathf.random(0.95, 1.05));
	},
	
	bulletsShoot(tile, type, speed, x, y, bullets, rotation, extra, extraSpread){
		entity = tile.ent();
		
		//var bulletAngle = bullets == 1 ? 2 : bullets;
		
		for(var i = 0; i < bullets; i++){
			var angle = 360 / bullets * i + rotation;
			
			for(var b = 0; b < extra; b++){
				//var angleB = (b - extra / 2) * extraSpread;
				var angleB = ((-extra + b * extra) / extra) * extraSpread;
				Bullet.create(type, entity, tile.getTeam(), tile.drawx() + x, tile.drawy() + y, angle + angleB, speed);
			}
		}
	},
	
	bulletsShootB(tile, type, speed, x, y, bullets, rotation, sineMag, sineRot){
		entity = tile.ent();
		
		//var bulletAngle = bullets == 1 ? 2 : bullets;
		
		for(var i = 0; i < bullets; i++){
			var sin = Mathf.sinDeg((360 / bullets * i) * 2 + sineRot) * sineMag;
			var angle = 360 / bullets * i + rotation;
			
			Bullet.create(type, entity, tile.getTeam(), tile.drawx() + x, tile.drawy() + y, angle, speed + sin);
		}
	},
	
	sequenceA(tile){
		entity = tile.ent();
		
		const bullets = 3;
		const bulletsB = 15;
		
		var shootAt1 = entity.shots % 6 == 0;
		var shootAt2 = entity.shots % 23 == 0;
		
		if(shootAt1){
			/*for(var i = 0; i < bullets; i++){
				var angle = 360 / bullets * i + (entity.shots * 0.3);
				
				Bullet.create(bulletSlow, entity, tile.getTeam(), tile.drawx(), tile.drawy(), angle);
			}*/
			this.bulletsShoot(tile, bulletSlow, 1, 0, 0, bullets, entity.shots * 0.35, 3, 15);
			this.shootSoundB(tile, 0, 0, 1.5);
		};
		
		if(shootAt2){
			for(var x = 0; x < bulletsB; x++){
				var angle = 360 / bulletsB * x - (entity.shots * 0.25);
				
				Bullet.create(bulletSlow, entity, tile.getTeam(), tile.drawx(), tile.drawy(), angle, 1.2);
			};
			this.shootSoundB(tile, 0, 0, 0);
		}
	},
	
	trns(tile){
		entity = tile.ent();
		
		entity.reload = Mathf.lerp(0, 1, (entity.shots - 500) / 70);
	},
	
	trnsB(tile){
		entity = tile.ent();
		
		entity.rotation += 0.4;
		
		var shootAt1 = entity.shots % 21 == 0;
		
		entity.reload = Mathf.lerp(1, 0, (entity.shots - 1100) / 200);
		
		//entity.rotation = Mathf.lerp(entity.rotation, 0, (entity.shots - 1100) / 200);
		
		for(var i = 0; i < 2; i++){
			var sign = Mathf.signs[i];
			
			this.tr2.trns(entity.rotation + (90 * sign), entity.reload * 290);
			if(shootAt1){
				this.bulletsShoot(tile, bulletSlow, 0.9, this.tr2.x, this.tr2.y, 12, entity.rotation, 1, 1);
				this.shootSoundB(tile, this.tr2.x, this.tr2.y, 1.5);
			};
		}
	},
	
	sequenceB(tile){
		entity = tile.ent();
		//print("seqB");
		var shootAt1 = entity.shots % 6 == 0;
		
		entity.rotation += 0.4;
		
		for(var i = 0; i < 2; i++){
			var sign = Mathf.signs[i];
			
			this.tr2.trns(entity.rotation + (90 * sign), entity.reload * 290);
			if(shootAt1){
				this.bulletsShoot(tile, bulletSlow, 1, this.tr2.x, this.tr2.y, 3, (entity.shots * 3) + (90 * sign), 1, 1);
				this.shootSoundB(tile, this.tr2.x, this.tr2.y, 1.5);
			};
		}
	},
	
	sequenceC(tile){
		entity = tile.ent();
		
		if(entity.rotation != 0) entity.rotation = 0;
		var rot = entity.shots % 120 < 60;
		var shootAt1 = entity.shots % 6 == 0;
		
		if(rot){
			if(shootAt1){
				this.shootSoundB(tile, 0, 0, 1.5);
				this.bulletsShoot(tile, bulletSlow, 1, 0, 0, 4, 90 - (entity.shots * 0.5), 5, 8);
			}
		}else{
			if(shootAt1){
				this.shootSoundB(tile, 0, 0, 1.5);
				this.bulletsShoot(tile, bulletSlow, 1, 0, 0, 4, 45 + (entity.shots * 0.5), 5, 8);
			}
		};
	},
	
	trnsC(tile){
		entity = tile.ent();
		
		entity.reload = Mathf.lerp(0, 1, (entity.shots - 1900) / 70);
	},
	
	sequenceD(tile){
		entity = tile.ent();
		
		var shootAt1 = entity.shots % 39 == 0;
		var shootAt2 = entity.shots % 8 == 0;
		
		entity.rotation += 0.3;
		
		for(var s = 0; s < 3; s++){
			this.tr2.trns(360 / 3 * s + entity.rotation, entity.reload * 290);
			
			if(shootAt1){
				this.bulletsShoot(tile, bulletSlow, 0.9, this.tr2.x, this.tr2.y, 12, entity.rotation * 5, 1, 1);
				this.shootSoundB(tile, this.tr2.x, this.tr2.y, 0);
			}
		};
		
		if(shootAt2){
			this.bulletsShoot(tile, bulletSlow, 0.9, 0, 0, 3, entity.rotation * 1.1, 2, 4);
			this.shootSoundB(tile, 0, 0, 1.5);
		}
	},
	
	trnsD(tile){
		entity = tile.ent();
		
		var shootAt1 = entity.shots % 31 == 0;
		
		entity.rotation += 0.3;
		entity.reload = Mathf.lerp(1, 0, (entity.shots - 2500) / 70);
		
		if(shootAt1){
			this.bulletsShoot(tile, bulletSlowAlt, 1.8, 0, 0, 26, 0, 1, 1);
			this.shootSoundB(tile, 0, 0, 0);
		}
	},
	
	trnsE(tile){
		entity = tile.ent();
		entity.reload = Mathf.lerp(0, 1, (entity.shots - 3500) / 70);
	},
	
	trnsF(tile){
		entity = tile.ent();
		entity.heat = Mathf.lerp(0, 1, (entity.shots - 4900) / 70);
	},
	
	trnsG(tile){
		entity = tile.ent();
		entity.heat = Mathf.lerp(1, 2, (entity.shots - 5800) / 70);
	},
	
	trnsH(tile){
		entity = tile.ent();
		entity.reload = Mathf.lerp(1, 0, (entity.shots - 6400) / 70);
		entity.heat = Mathf.lerp(2, 0, (entity.shots - 6400) / 70);
	},
	
	trnsI(tile){
		entity = tile.ent();
		entity.reload = Mathf.lerp(0, 1, (entity.shots - 6470) / 70);
	},
	
	trnsJ(tile){
		entity = tile.ent();
		entity.reload = Mathf.lerp(1, 0, (entity.shots - 7800) / 70);
	},
	
	sequenceE(tile){
		entity = tile.ent();
		
		var shootAt1 = entity.shots % 24 == 0;
		
		if(entity.rotation != 0) entity.rotation = 0;
		
		if(shootAt1){
			this.bulletsShootB(tile, bulletSlowAlt, 2.2, 0, 0, 19, entity.shots / 2, 0.33, (entity.shots / 1.5) * -1);
			this.shootSoundB(tile, 0, 0, 0.5);
		}
	},
	
	sequenceF(tile){
		entity = tile.ent();
		const vec3 = new Vec2();
		
		//var shootAt2 = entity.shots % 47 == 0;
		
		//if(shootAt2) this.bulletsShoot(tile, bulletSlow, 1.4, 0, 0, 16, (entity.shots / 1.5), 1, 1);
		
		for(var s = 0; s < 2; s++){
			this.tr2.trns(360 / 2 * s, entity.reload * 70);
			var tx = this.tr2.x + tile.drawx();
			var ty = this.tr2.y + tile.drawy();
			var angle = 0;
			
			if(entity.target != null){
				angle = Angles.angle(tx, ty, entity.target.getX(), entity.target.getY());
				vec3.trns(angle, 9);
			};
			
			var hx = this.tr2.x + vec3.x;
			var hy = this.tr2.y + vec3.y;
			
			for(var i = 0; i < 11; i++){
				var shootAt1 = entity.shots % 145 == (i * 5);
				if(shootAt1){
					this.bulletsShoot(tile, bulletLarge, 2.2, hx, hy, 1, angle, 1, 1);
					this.shootSoundB(tile, hx, hy, 2);
				}
			};
		};
	},
	
	sequenceG(tile){
		entity = tile.ent();
		const vec3 = new Vec2();
		
		var shootAt2 = entity.shots % 48 == 0;
		
		if(shootAt2){
			this.bulletsShoot(tile, bulletSlow, 1.4, 0, 0, 16, (entity.shots / 3), 1, 1);
			this.shootSoundB(tile, 0, 0, 0);
		};
		
		for(var s = 0; s < 3; s++){
			this.tr2.trns(360 / 3 * s, entity.reload * 70);
			var tx = this.tr2.x + tile.drawx();
			var ty = this.tr2.y + tile.drawy();
			var angle = 0;
			
			if(entity.target != null){
				angle = Angles.angle(tx, ty, entity.target.getX(), entity.target.getY());
				vec3.trns(angle, 9);
			};
			
			var hx = this.tr2.x + vec3.x;
			var hy = this.tr2.y + vec3.y;
			
			for(var i = 0; i < 11; i++){
				var shootAt1 = entity.shots % 145 == (i * 5);
				if(shootAt1){
					this.bulletsShoot(tile, bulletLarge, 2.2, hx, hy, 1, angle, 3, 25);
					this.shootSoundB(tile, hx, hy, 2);
				}
			};
		};
	},
	
	sequenceH(tile){
		entity = tile.ent();
		const vec3 = new Vec2();
		
		var shootAt2 = entity.shots % 64 == 0;
		
		if(shootAt2){
			this.bulletsShoot(tile, bulletSlow, 1.4, 0, 0, 19, (entity.shots / 3), 1, 1);
			this.shootSoundB(tile, 0, 0, 0);
		};
		
		for(var s = 0; s < 4; s++){
			this.tr2.trns(360 / 4 * s, entity.reload * 70);
			var tx = this.tr2.x + tile.drawx();
			var ty = this.tr2.y + tile.drawy();
			var angle = 0;
			
			if(entity.target != null){
				angle = Angles.angle(tx, ty, entity.target.getX(), entity.target.getY());
				vec3.trns(angle, 9);
			};
			
			var hx = this.tr2.x + vec3.x;
			var hy = this.tr2.y + vec3.y;
			
			for(var i = 0; i < 9; i++){
				var shootAt1 = entity.shots % 145 == (i * 5);
				if(shootAt1){
					this.bulletsShoot(tile, bulletLarge, 2.2, hx, hy, 1, angle, 3, 25);
					this.shootSoundB(tile, hx, hy, 2);
				}
			};
		};
	},
	
	sequenceI(tile){
		entity = tile.ent();
		
		var shootAt1 = entity.shots % 20 == 0;
		
		this.tr2.x = Mathf.sin(entity.shots, 89 * 1.5, entity.reload * 290);
		this.tr2.y = Mathf.sin(entity.shots + 90, 127 * 1.5, entity.reload * 160);
		
		if(shootAt1){
			this.bulletsShootB(tile, bulletSlowAlt, 2.2, this.tr2.x, this.tr2.y, 22, (entity.shots / 2) * -1, 0.33, (entity.shots / 1.5));
			this.shootSoundB(tile, 0, 0, 0.5);
		}
	}
});

kami.range = 570;
kami.shootType = bulletSlow;
kami.rainbowRegion = [];