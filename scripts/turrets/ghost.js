const shotgunShootEffect = newEffect(13, e => {
	Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, e.fin());
	Lines.stroke(e.fout() * 1.2 + 0.5);
	
	const hk = new Floatc2({get: function(x, y){
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fin() * 5 + 2);
	}});
	
	Angles.randLenVectors(e.id, 9, 27 * e.finpow(), e.rotation, 50, hk);
});

const shotgunStrong = extend(BasicBulletType, {
	range(){
		return this.rayLength * 0.9;
	},
	
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength, false);
		};
	},
	
	draw: function(b){
		Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, b.fin());
		
		for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 20);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}
		Drawf.tri(b.x, b.y, 20 * b.fout(), ((this.rayLength * 1.33) + 30), b.rot());
		Drawf.tri(b.x, b.y, 20 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

shotgunStrong.speed = 0.01;
shotgunStrong.damage = 370;
shotgunStrong.lifetime = 10;
shotgunStrong.collidesTeam = false;
shotgunStrong.pierce = true;
shotgunStrong.rayLength = 210;
shotgunStrong.hitEffect = Fx.hitFuse;
shotgunStrong.despawnEffect = Fx.none;

const shotgunMed = extend(BasicBulletType, {
	range(){
		return this.rayLength * 0.975;
	},
	
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength, false);
		};
	},
	
	draw: function(b){
		Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, b.fin());
		
		for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 15);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}
		Drawf.tri(b.x, b.y, 20 * b.fout(), ((this.rayLength * 1.33) + 30), b.rot());
		Drawf.tri(b.x, b.y, 20 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

shotgunMed.speed = 0.01;
shotgunMed.damage = 150;
shotgunMed.lifetime = 10;
shotgunMed.collidesTeam = false;
shotgunMed.pierce = true;
shotgunMed.rayLength = 180;
shotgunMed.hitEffect = Fx.hitFuse;
shotgunMed.despawnEffect = Fx.none;

const shotgunWeak = extend(BasicBulletType, {
	range(){
		return this.rayLength;
	},
	
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength, false);
		};
	},
	
	draw: function(b){
		Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, b.fin());
		
		for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 10);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}
		Drawf.tri(b.x, b.y, 20 * b.fout(), ((this.rayLength * 1.33) + 30), b.rot());
		Drawf.tri(b.x, b.y, 20 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

shotgunWeak.speed = 0.01;
shotgunWeak.damage = 90;
shotgunWeak.lifetime = 10;
shotgunWeak.collidesTeam = false;
shotgunWeak.pierce = true;
shotgunWeak.rayLength = 165;
shotgunWeak.hitEffect = Fx.hitFuse;
shotgunWeak.despawnEffect = Fx.none;
//shotgunWeak.shootEffect = Fx.lightningShoot;
//shotgunWeak.smokeEffect = Fx.lightningShoot;

const ghost = extendContent(DoubleTurret, "ghost", {
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	drawSelect(tile){
		this.super$drawSelect(tile);
		
		Drawf.dashCircle(tile.drawx(), tile.drawy(), this.shotgunType(tile), tile.getTeam().color);
	},
	
	drawPlace(x, y, rotation, valid){
		this.super$drawPlace(x, y, rotation, valid);
		
		Drawf.dashCircle(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), this.shotgunRange, Pal.placing);
	},
	
	shoot(tile, ammo){
		entity = tile.ent();
		entity.shots++;
		
		var target = entity.target;
		
		var vec = new Vec2();
		var vec2 = new Vec2();

		var i = Mathf.signs[entity.shots % 2];
		
		this.tr.trns(entity.rotation - 90, this.shotWidth * i, this.size * Vars.tilesize / 2);
		
		var len = Mathf.dst(tile.drawx(), tile.drawy(), target.getX(), target.getY());
		
		vec2.set(this.shotWidth * i, this.size * Vars.tilesize / 2).rotate(-90);
		vec.set(0, Math.max(len, (this.size * Vars.tilesize / 2) + 25)).rotate(-90);
		
		var angleB = Angles.angle(vec2.x, vec2.y, vec.x, vec.y);

		if(!this.isTargetClose(tile)){
			this.bullet(tile, ammo, entity.rotation + angleB + Mathf.range(this.inaccuracy + ammo.inaccuracy));
			this.effects(tile);
		}else{
			this.shotgunShoot(tile, ammo, angleB);
			this.effectsB(tile);
		};

		//this.effects(tile);
		this.useAmmo(tile);
	},
	
	effectsB(tile){

		entity = tile.ent();

		Effects.effect(shotgunShootEffect, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation);
		Sounds.shotgun.at(tile, Mathf.random(0.9, 1.1));
		
		Effects.shake(3.6, 2, entity);

		entity.recoil = this.recoil * 1.33;
	},
	
	shotgunType(tile){
		range = this.shotgunRange;
		rangeB = 0;
		realRange = 0;
		//entity = tile.ent();
		
		if(this.hasAmmo(tile)){
			type = this.peekAmmo(tile);
			if(type != null){
				var damage = type.damage + type.splashDamage;
			
				if(damage < 30){
					rangeB = shotgunWeak.range();
				}else if(damage < 80){
					rangeB = shotgunMed.range();
				}else{
					rangeB = shotgunStrong.range();
				};
			};
		};
		
		realRange = Math.max(range, rangeB);
		
		return realRange;
	},
	
	shotgunShoot(tile, ammo, angle){
		var damage = ammo.damage + ammo.splashDamage;
		
		entity = tile.ent();
		
		if(damage < 30){
			this.shotgunShootB(shotgunWeak, tile, angle);
		}else if(damage < 80){
			this.shotgunShootB(shotgunMed, tile, angle);
		}else{
			this.shotgunShootB(shotgunStrong, tile, angle);
		};
	},
	
	shotgunShootB(type, tile, angle){
		entity = tile.ent()
		
		const shotsB = 3;
		const spreadB = 20;
		
		for(var s = 0; s < shotsB; s++){
			//this.bullet(tile, type, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy) + (s - this.shots / 2) * this.spread);
			var angleB = (((-shotsB + s * shotsB) / shotsB) * spreadB) + angle;
			//this.bullet(tile, type, entity.rotation + angle);
			
			Bullet.create(type, entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation + angleB);
		};
		
		//this.effects(tile);
	},
	
	turnToTarget(tile, targetRot){
		entity = tile.ent();

		entity.rotation = Angles.moveToward(entity.rotation, targetRot, this.rotatespeed * entity.delta() * 1);
	},
	
	isTargetClose(tile){
		entity = tile.ent();
		
		var target = entity.target;
		
		var range = this.shotgunType(tile);
		
		return Mathf.within(tile.drawx(), tile.drawy(), target.getX(), target.getY(), range);
	},
	
	baseReloadSpeed(tile){
		if(this.isTargetClose(tile)) return 0.25;
		
		return 1;
	}
});

ghost.shotgunRange = 160;