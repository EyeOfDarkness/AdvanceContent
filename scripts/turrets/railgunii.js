const railFirstHit = newEffect(14, e => {
	Draw.color(Color.gray);
	
	var range = 27;
	var color = Pal.lightOrange;
	if(e.data != null) range = e.data;
	if(e.color != null) color = e.color;
	
	/*const hk = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, );
	}});*/
	
	const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
		Fill.circle(e.x + x, e.y + y, out * 12 + 0.5);
		Fill.circle(e.x + (x / 2), e.y + (y / 2), out * 9);
	}});
	
	Angles.randLenVectors(e.id + 128, e.finpow(), 9, (range * 1.2), hk);
	
	Draw.color(Color.white, color, e.fin());
	
	Lines.stroke(0.5 + e.fout());
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4 + 1);
	}});

	Lines.circle(e.x, e.y, (range * 0.9) * e.fin());
	
	Angles.randLenVectors(e.id, 7, e.finpow() * range, e.rotation, 360.0, hl);
	Draw.reset();
});

const railTrail = newEffect(50, e => {
	Draw.color(e.color);
	
	e.scaled(16, cons(s => {
		const hk = new Angles.ParticleConsumer({accept: function(x, y, en, out){
			Fill.circle(s.x + x, s.y + y, out * 2 * 3 + 0.5);
			Fill.circle(s.x + (x / 2), s.y + (y / 2), out * 2);
		}});
	
		Angles.randLenVectors(e.id, s.finpow(), 3, 14, hk);
	}));
	
	Fill.circle(e.x, e.y, e.fout() * 2.6);
	
	Draw.reset();
});

const railExplosive = extend(BasicBulletType, {
	hit(b, x, y){
		this.super$hit(b, x, y);
		
		b.velocity().x = b.velocity().x * ((this.speed - this.speedDamage) / this.speed);
		b.velocity().y = b.velocity().y * ((this.speed - this.speedDamage) / this.speed);
		b.scaleTime(this.speedDamage / 4);
		
		if(b.getData() == null){
			Damage.damage(b.getTeam(), x, y, this.firstHitRadius, this.firstHitDamage * b.damageMultiplier());
			Effects.effect(railFirstHit, this.effectColor, x, y, b.rot(), this.firstHitRadius);
			b.setData(0);
		};
	},
	
	update(b){
		Effects.effect(railTrail, this.effectColor, b.x + Mathf.range(2), b.y + Mathf.range(2));
		
		var tile = Vars.world.ltileWorld(b.x, b.y);
		
		if(tile != null){
			if(tile.entity != null && tile.getTeam() != b.getTeam()){
				tile.entity.damage(this.damage);
				this.hit(b, b.x, b.y);
			}
		}
	}
});

railExplosive.effectColor = Pal.missileYellowBack;
railExplosive.firstHitDamage = 44;
railExplosive.firstHitRadius = 39;
railExplosive.speedDamage = 3.1;
railExplosive.ammoMultiplier = 4;
railExplosive.speed = 9.4;
railExplosive.damage = 17;
railExplosive.lifetime = 36;
railExplosive.hitSize = 9;
railExplosive.bulletWidth = 15;
railExplosive.bulletHeight = 22;
railExplosive.bulletShrink = 0.25;
railExplosive.backColor = Pal.missileYellowBack;
railExplosive.frontColor = Pal.missileYellow;
railExplosive.collidesTiles = false;
railExplosive.pierce = true;

const railThorium = extend(BasicBulletType, {
	hit(b, x, y){
		this.super$hit(b, x, y);
		
		b.velocity().x = b.velocity().x * ((this.speed - this.speedDamage) / this.speed);
		b.velocity().y = b.velocity().y * ((this.speed - this.speedDamage) / this.speed);
		b.scaleTime(this.speedDamage / 4);
		
		if(b.getData() == null){
			Damage.damage(b.getTeam(), x, y, this.firstHitRadius, this.firstHitDamage * b.damageMultiplier());
			Effects.effect(railFirstHit, this.effectColor, x, y, b.rot(), this.firstHitRadius);
			b.setData(0);
		};
	},
	
	update(b){
		Effects.effect(railTrail, this.effectColor, b.x + Mathf.range(2), b.y + Mathf.range(2));
		
		var tile = Vars.world.ltileWorld(b.x, b.y);
		
		if(tile != null){
			if(tile.entity != null && tile.getTeam() != b.getTeam()){
				tile.entity.damage(this.damage);
				this.hit(b, b.x, b.y);
			}
		}
	}
});

railThorium.effectColor = Pal.bulletYellowBack;
railThorium.firstHitDamage = 30;
railThorium.firstHitRadius = 32;
railThorium.speedDamage = 1.9;
railThorium.speed = 10;
railThorium.damage = 22;
railThorium.lifetime = 36;
railThorium.hitSize = 8;
railThorium.bulletWidth = 14;
railThorium.bulletHeight = 21;
railThorium.bulletShrink = 0.25;
railThorium.backColor = Pal.bulletYellowBack;
railThorium.frontColor = Pal.bulletYellow;
railThorium.collidesTiles = false;
railThorium.pierce = true;

const railPlastic = extend(BasicBulletType, {
	hit(b, x, y){
		this.super$hit(b, x, y);
		
		b.velocity().x = b.velocity().x * ((this.speed - this.speedDamage) / this.speed);
		b.velocity().y = b.velocity().y * ((this.speed - this.speedDamage) / this.speed);
		b.scaleTime(this.speedDamage / 4);
		
		if(b.getData() == null){
			Damage.damage(b.getTeam(), x, y, this.firstHitRadius, this.firstHitDamage * b.damageMultiplier());
			Effects.effect(railFirstHit, this.effectColor, x, y, b.rot(), this.firstHitRadius);
			b.setData(0);
		};
	},
	
	update(b){
		Effects.effect(railTrail, this.effectColor, b.x + Mathf.range(2), b.y + Mathf.range(2));
		
		var tile = Vars.world.ltileWorld(b.x, b.y);
		
		if(tile != null){
			if(tile.entity != null && tile.getTeam() != b.getTeam()){
				tile.entity.damage(this.damage);
				this.hit(b, b.x, b.y);
			}
		}
	}
});

railPlastic.effectColor = Pal.plastaniumBack;
railPlastic.firstHitDamage = 21;
railPlastic.firstHitRadius = 36;
railPlastic.speedDamage = 2.1;
railPlastic.speed = 13;
railPlastic.damage = 19;
railPlastic.lifetime = 36;
railPlastic.hitSize = 6;
railPlastic.bulletWidth = 11;
railPlastic.bulletHeight = 17;
railPlastic.bulletShrink = 0.25;
railPlastic.backColor = Pal.plastaniumBack;
railPlastic.frontColor = Pal.plastaniumFront;
railPlastic.collidesTiles = false;
railPlastic.pierce = true;

const railgun = extendContent(ItemTurret, "railgun-ii", {});

railgun.ammo(Items.blastCompound, railExplosive,
			Items.plastanium, railPlastic,
			Items.thorium, railThorium);