const tmpVec2 = new Vec2();
const rectA = new Rect();
const rectB = new Rect();

const elib = require("effectlib");
const settingLib = require("modsettings");

const ephLaserEffect = elib.newEffectWDraw(19, 100, e => {
	var pos1 = e.data[0];
	var x = e.data[1];
	var y = e.data[2];
	var stroke = 1.8;

	Draw.color(Color.valueOf("a9d8ff"));
		
	//Fill.circle(pos1.x, pos1.y, stroke * 2 * e.fout());
		
	//Fill.circle(x, y, stroke * 2 * e.fout());
	if(pos1 != null){
		Lines.stroke(stroke * 2 * e.fout());
		Lines.line(pos1.x, pos1.y, x, y, CapStyle.none);
		Draw.reset();
		Draw.blend();
	}
});

const ephHitEffect = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8);
	}});
	
	Angles.randLenVectors(e.id, 17, e.finpow() * 50.0, e.rotation, 360.0, hl);
	Lines.stroke(0.5 + (e.fout() * 1.2));
	Lines.circle(e.x, e.y, e.finpow() * 30);
});

const suppress = b => {
	b.deflect();
	b.time(b.getBulletType().lifetime);
};

const negative = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 4 + (b.fout() * 1.5));
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 2.5 + (b.fout() * 1));
	},
	
	update(b){
		this.super$update(b);
		
		if(b.getData() == null || (b.getData() != null && !(b.getData() instanceof Bullet))){
			suppress(b);
			return;
		}
	}
});
negative.drag = 0.013;
negative.speed = 0.001;
negative.damage = 4;
negative.lifetime = 300;
negative.hitEffect = Fx.hitLancer;
negative.despawnEffect = Fx.none;
negative.hitSize = 8;
negative.drawSize = 460;
negative.pierce = true;
negative.collidesTiles = false;
negative.smokeEffect = Fx.none;

const positive = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 4 + (b.fout() * 1.5));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 2.5 + (b.fout() * 1));
	},
	
	update(b){
		this.super$update(b);
		
		if(b.getData() == null || (b.getData() != null && !(b.getData() instanceof Bullet))){
			suppress(b);
			return;
		};
		
		var c = b.getData();
		
		tmpVec2.trns(Angles.angle(b.x, b.y, c.x, c.y), 1);
		b.velocity().add(tmpVec2.x, tmpVec2.y);
		
		tmpVec2.trns(Angles.angle(c.x, c.y, b.x, b.y), 1);
		c.velocity().add(tmpVec2.x, tmpVec2.y);
		
		b.hitbox(rectA);
		c.hitbox(rectB);
		
		if(b.velocity().len() > Mathf.dst(c.x + c.velocity().x, c.y + c.velocity().y, b.x, b.y)){
			b.velocity().setLength(Mathf.dst(c.x + c.velocity().x, c.y + c.velocity().y, b.x, b.y));
		};
		
		if(c.velocity().len() > Mathf.dst(b.x + b.velocity().x, b.y + b.velocity().y, c.x, c.y)){
			c.velocity().setLength(Mathf.dst(b.x + b.velocity().x, b.y + b.velocity().y, c.x, c.y));
		};
		
		if(rectA.overlaps(rectB)){
			b.time(b.getBulletType().lifetime);
			c.time(c.getBulletType().lifetime);
			
			var medianX = (b.x + c.x) / 2;
			var medianY = (b.y + c.y) / 2;
			
			var angleBullet = ((c.rot() % 360) + (b.rot() % 360)) / 2;
			
			Effects.effect(ephHitEffect, medianX, medianY, angleBullet);
			Damage.damage(b.getTeam(), medianX, medianY, 45, 80);
		};
		rectA.set(0,0,0,0);
		rectB.set(0,0,0,0);
	}
});
positive.hitSound = Sounds.spark;
positive.drag = 0.013;
positive.speed = 0.001;
positive.damage = 4;
positive.lifetime = 300;
positive.hitEffect = Fx.hitLancer;
positive.despawnEffect = Fx.none;
positive.hitSize = 8;
positive.drawSize = 460;
positive.pierce = true;
positive.collidesTiles = false;
positive.smokeEffect = Fx.none;

const ephemeronBullet = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("a9d8ff60"));
		Fill.circle(b.x, b.y, 11 + (b.fout() * 2.5));
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 8 + (b.fout() * 1.5));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 6.5 + (b.fout() * 1));
	},
	
	despawned(b){
		this.super$despawned(b);
		
		for(var i = 0; i < 15; i++){
			tmpVec2.trns(Mathf.range(0, 360), Mathf.range(0, this.maxRadius));
			
			var pointX = tmpVec2.x + b.x;
			var pointY = tmpVec2.y + b.y;
			var randomSign = Mathf.random(0.0, 180.0);
			var randomB = Mathf.random(0.2, 1.4);
			var angleRandom = Mathf.range(0, 360);
			var rangeRandom = Mathf.range(40, 70);
			
			tmpVec2.trns(angleRandom, rangeRandom);
			var bulletA = Bullet.create(positive, b.getOwner(), b.getTeam(), pointX + tmpVec2.x, pointY + tmpVec2.y, angleRandom + randomSign);
			
			tmpVec2.trns(angleRandom + 180, rangeRandom);
			var bulletB = Bullet.create(negative, b.getOwner(), b.getTeam(), pointX + tmpVec2.x, pointY + tmpVec2.y, angleRandom + randomSign + 180);
			
			bulletA.setData(bulletB);
			bulletB.setData(bulletA);
			
			tmpVec2.trns(angleRandom + randomSign, randomB);
			bulletA.velocity().add(tmpVec2.x, tmpVec2.y);
			
			tmpVec2.trns(angleRandom + randomSign + 180, randomB);
			bulletB.velocity().add(tmpVec2.x, tmpVec2.y);
			
			var data = [bulletA, b.x, b.y];
			
			Effects.effect(ephLaserEffect, b.x, b.y, 0, data);
			
			var datab = [bulletB, b.x, b.y];
			
			Effects.effect(ephLaserEffect, b.x, b.y, 0, datab);
		}
	}
});

ephemeronBullet.maxRadius = 80;
ephemeronBullet.laserLength = 330;
ephemeronBullet.speed = 7.7;
ephemeronBullet.damage = 10;
ephemeronBullet.lifetime = 70;
ephemeronBullet.hitEffect = Fx.hitLancer;
ephemeronBullet.despawnEffect = Fx.none;
ephemeronBullet.hitSize = 12;
ephemeronBullet.drawSize = 460;
ephemeronBullet.pierce = true;
ephemeronBullet.collidesTiles = false;
ephemeronBullet.shootEffect = Fx.lightningShoot;
ephemeronBullet.smokeEffect = Fx.none;

const ephemeron = extendContent(PowerTurret, "ephemeron", {
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		for(var i = 0; i < 9; i++){
			this.animationRegions[i] = Core.atlas.find(this.name + "-frame-" + (i + 1));
			this.heatRegions[i] = Core.atlas.find(this.name + "-heat-" + (i + 1));
		};
	},
	
	generateIcons(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	createIcons(packer){
		this.super$createIcons(packer);
		
		//increases loading time by 170%
		
		if(this.animated){
			const radius = 4;
			for(var i = 0; i < 9; i++){
				var regionB = Core.atlas.getPixmap(this.name + "-frame-" + (i + 1));
				var out = new Pixmap(regionB.width, regionB.height);
				var color = new Color();
				
				for(var x = 0; x < regionB.width; x++){
					for(var y = 0; y < regionB.height; y++){
						
						regionB.getPixel(x, y, color);
						out.draw(x, y, color);
						if(color.a < 1){
							found = false;
							outer:
							for(var rx = -radius; rx < radius; rx++){
								for(var ry = -radius; ry < radius; ry++){
									if(Structs.inBounds(rx + x, ry + y, regionB.width, regionB.height) && Mathf.dst2(rx, ry) <= (radius * radius) && color.set(regionB.getPixel(rx + x, ry + y)).a > 0.01){
										found = true;
										break outer;
									}
								}
							};
							if(found){
								out.draw(x, y, this.outlineColor);
							}
						}
					}
				};
				packer.add(MultiPacker.PageType.main, this.name + "-frame-" + (i + 1), out);
			}
		}
	},
	
	update(tile){
		entity = tile.ent();
		
		var power = this.baseReloadSpeed(tile);
		
		this.super$update(tile);
		
		if(entity.target == null){
			entity.setTargetTime(entity.getTargetTime() + Time.delta());
		}else{
			entity.setTargetTime(0);
		};
		
		if(entity.getTargetTime() > 60 || power < 0.0001){
			//entity.setFrame(Mathf.lerpDelta(entity.getFrame(), 0, 0.06));
			entity.setFrame(entity.getFrame() - (Time.delta() / 3));
			entity.setFrame(Mathf.clamp(entity.getFrame(), 0, this.animationRegions.length));
			entity.setTargetTime(60);
		};
	},
	
	updateShooting(tile){
		entity = tile.ent();
		
		//this.super$updateShooting(tile);
		type = this.peekAmmo(tile);
		
		if(entity.reload >= this.reload){
			//type = this.peekAmmo(tile);

			//this.shoot(tile, type);

			//entity.reload = 0;
			
			entity.setChargeTime(entity.getChargeTime() + Time.delta());
			if(entity.getChargeTime() >= this.chargeTime){
				//type = this.peekAmmo(tile);
				this.shoot(tile, type);
				entity.reload = 0;
				entity.setChargeTime(0);
			};
		}else{
			entity.reload += tile.entity.delta() * type.reloadMultiplier * this.baseReloadSpeed(tile);
			
			maxUsed = this.consumes.get(ConsumeType.liquid).amount;

			liquid = entity.liquids.current();

			used = Math.min(Math.min(entity.liquids.get(liquid), maxUsed * Time.delta()), Math.max(0, ((this.reload - entity.reload) / this.coolantMultiplier) / liquid.heatCapacity)) * this.baseReloadSpeed(tile);
			entity.reload += used * liquid.heatCapacity * this.coolantMultiplier;
			entity.liquids.remove(liquid, used);

			if(Mathf.chance(0.06 * used)){
				Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * Vars.tilesize / 2), tile.drawy() + Mathf.range(this.size * Vars.tilesize / 2));
			}
		};
		
		var power = this.baseReloadSpeed(tile);
		
		if(power > 0.0001){
			//entity.setFrame(Mathf.lerpDelta(entity.getFrame(), this.animationRegions.length, 0.06 * power));
			entity.setFrame(entity.getFrame() + (Time.delta() / 3));
			entity.setFrame(Mathf.clamp(entity.getFrame(), 0, this.animationRegions.length));
		}
	},
	
	shoot(tile, type){
		entity = tile.ent();
		
		entity.recoil = this.recoil;
		entity.heat = 1;
		var predict;
		
		if(entity.target != null){
			predict = Predict.intercept(tile, entity.target, type.speed);
		}else{
			tmpVec2.set(0, 0);
			predict = tmpVec2;
		};
		dst = entity.dst(predict.x, predict.y);
		maxTraveled = type.lifetime * type.speed;

		this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
		Bullet.create(type, entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation, 1, (dst / maxTraveled));
		
		//this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, 0);
		this.effects(tile);
		
		this.useAmmo(tile);
	},
	
	drawLayer(tile){
		entity = tile.ent();

		this.tr2.trns(entity.rotation, -entity.recoil);
		
		var currentFrame = Mathf.round(Mathf.clamp(entity.getFrame(), 0, this.animationRegions.length - 1));
		//print(currentFrame);

		//Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		if(this.animated){
			Draw.rect(this.animationRegions[currentFrame], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		
			if(!entity.heat <= 0.00001){
				Draw.color(this.heatColor, entity.heat);
				Draw.blend(Blending.additive);
				Draw.rect(this.heatRegions[currentFrame], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
				Draw.blend();
				Draw.color();
			};
		}else{
			Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			if(!entity.heat <= 0.00001){
				Draw.color(this.heatColor, entity.heat);
				Draw.blend(Blending.additive);
				Draw.rect(this.heatRegion, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
				Draw.blend();
				Draw.color();
			};
		};
		
		var fadeIn = entity.getChargeTime() / this.chargeTime;
		if(entity.getChargeTime() <= 0.00001) return;
		this.tr2.trns(entity.rotation, -entity.recoil + (this.size * Vars.tilesize / 2));
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, fadeIn * (1.5 + 8));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, fadeIn * (1 + 6.5));
	}
});
ephemeron.animated = settingLib.settingAnimatedSprite();
ephemeron.chargeTime = 60;
ephemeron.shootType = ephemeronBullet;
ephemeron.heatRegions = [];
ephemeron.animationRegions = [];
ephemeron.entityType = prov(() => {
	entityB = extend(Turret.TurretEntity, {
		getFrame(){
			return this._frame;
		},
		
		setFrame(a){
			this._frame = a;
		},
		
		getChargeTime(){
			return this._charge;
		},
		
		setChargeTime(a){
			this._charge = a;
		},
		
		getTargetTime(){
			return this._targetTime;
		},
		
		setTargetTime(a){
			this._targetTime = a;
		},
		
		getBool(){
			return this._targetBool;
		},
		
		setBool(a){
			this._targetBool = a;
		}
	});
	entityB.setChargeTime(0);
	entityB.setFrame(0);
	entityB.setTargetTime(60);
	entityB.setBool(false);
	
	return entityB;
});