const settingLib = require("modsettings");

const muonLaser = extend(BasicBulletType, {
	update: function(b){
		var velocity = b.velocity().len() / this.speed;
		if(b.timer.get(1, 15)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.laserLength * velocity, true);
		};
	},
	
	draw: function(b){
		var velocity = b.velocity().len() / this.speed;
		const colors = [Color.valueOf("4787ff55"), Color.valueOf("4787ffaa"), Color.valueOf("a9d8ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.7, 0.5, 0.24];
		const strokes = [2.8, 2.4, 1.9, 1.3];
		const lenscales = [1.0, 1.13, 1.16, 1.17];
		//const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 45.0);
				Lines.stroke(3.8 * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.laserLength * lenscales[i] * velocity, CapStyle.none);
			}
		};
		Draw.reset();
	}
});

muonLaser.laserLength = 330;
muonLaser.speed = 0.001;
muonLaser.damage = 200;
muonLaser.lifetime = 14;
muonLaser.hitEffect = Fx.hitLancer;
muonLaser.despawnEffect = Fx.none;
muonLaser.hitSize = 13;
muonLaser.drawSize = 460;
muonLaser.pierce = true;
muonLaser.shootEffect = Fx.lightningShoot;
muonLaser.smokeEffect = Fx.none;

const muon = extendContent(PowerTurret, "muon", {
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		for(var i = 0; i < 15; i++){
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
			for(var i = 0; i < 15; i++){
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
		
		this.super$updateShooting(tile);
		
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

		//this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
		
		var shotsB = this.shots - 1;
		
		for(var s = 0; s < shotsB + 1; s++){
			//var angle = ((-this.shots + (s * this.shots)) / this.shots) * this.spread;
			var angleOffset = (shotsB - (s * 2));
			var angle = angleOffset * this.spread;
			
			this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, angleOffset * 2);
			
			//var sin = (Mathf.sinDeg((360 / (s * shotsB)) + (9 * 90)) + 1) / 4;
			var fin = s / shotsB;
			var offset = (0.5 - Math.abs(fin - 0.5)) * 2;
			
			Bullet.create(type, entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation + angle, 0.5 + (offset / 2));
			this.effectsb(tile, angle);
		};
		this.shootSound.at(tile, Mathf.random(0.9, 1.1));
		
		//this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, 0);
		//this.effects(tile);
		this.useAmmo(tile);
	},
	
	effectsb(tile, angle){
		shootEffectb = this.shootEffect == Fx.none ? this.peekAmmo(tile).shootEffect : this.shootEffect;
		smokeEffectb = this.smokeEffect == Fx.none ? this.peekAmmo(tile).smokeEffect : this.smokeEffect;

		entity = tile.ent();

		Effects.effect(shootEffectb, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation + angle);
		Effects.effect(smokeEffectb, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation + angle);
		//this.shootSound.at(tile, Mathf.random(0.9, 1.1));

		if(this.shootShake > 0){
			Effects.shake(this.shootShake, this.shootShake, entity);
		};

		entity.recoil = this.recoil;
    },
	
	drawLayer(tile){
		entity = tile.ent();

		this.tr2.trns(entity.rotation, -entity.recoil);
		
		var currentFrame = Mathf.round(Mathf.clamp(entity.getFrame(), 0, this.animationRegions.length - 1));
		//print(currentFrame);

		//Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		if(this.animated){
			Draw.rect(this.animationRegions[currentFrame], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			
			if(entity.heat <= 0.00001) return;
			Draw.color(this.heatColor, entity.heat);
			Draw.blend(Blending.additive);
			Draw.rect(this.heatRegions[currentFrame], tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			Draw.blend();
			Draw.color();
		}else{
			Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			if(entity.heat <= 0.00001) return;
			Draw.color(this.heatColor, entity.heat);
			Draw.blend(Blending.additive);
			Draw.rect(this.heatRegion, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			Draw.blend();
			Draw.color();
		}
	}
});
muon.animated = settingLib.settingAnimatedSprite();
muon.shootType = muonLaser;
muon.heatRegions = [];
muon.animationRegions = [];
muon.entityType = prov(() => {
	entityB = extend(Turret.TurretEntity, {
		getFrame(){
			return this._frame;
		},
		
		setFrame(a){
			this._frame = a;
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
	entityB.setFrame(0);
	entityB.setTargetTime(60);
	entityB.setBool(false);
	
	return entityB;
});