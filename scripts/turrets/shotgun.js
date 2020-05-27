const shotgunBullet = extend(BasicBulletType, {
	range(){
		return this.rayLength;
	},
	
	update: function(b){
		const vel = b.velocity().len() / this.speed;
		
		if(b.timer.get(1, 11)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength * vel, false);
		};
	},
	
	draw: function(b){
		const vel = b.velocity().len() / this.speed;
		
		Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, b.fin());
		
		/*for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 10);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}*/
		Drawf.tri(b.x, b.y, 15 * b.fout(), ((this.rayLength * 1.33) * vel) + 20, b.rot());
		Drawf.tri(b.x, b.y, 15 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

shotgunBullet.speed = 0.01;
shotgunBullet.damage = 50;
shotgunBullet.lifetime = 10;
shotgunBullet.pierce = true;
shotgunBullet.rayLength = 80;
shotgunBullet.despawnEffect = Fx.none;
shotgunBullet.shootEffect = Fx.none;
shotgunBullet.smokeEffect = Fx.none;

const shred = extendContent(ItemTurret, "shred", {
	shoot(tile, type){
		entity = tile.ent();
		
		entity.recoil = this.recoil;
		entity.heat = 1;
		var random = Mathf.round(Mathf.random(1, 4));
		
		this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
		
		for(var i = 0; i < random; i++){
			this.bullet(tile, type, entity.rotation + Mathf.range(30));
		};
		
		this.effects(tile);
		this.useAmmo(tile);
	},
	
	bullet(tile, type, angle){
		Bullet.create(type, tile.ent(), tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle, Mathf.random(210, 300) / 300);
	}
});

shred.ammo(Items.scrap, shotgunBullet);

const sandHit = newEffect(15, e => {
	Draw.color(Color.valueOf("ffe4ca"));
	
	const hj = new Floatc2({get: function(x, y){
		Fill.circle(e.x + x, e.y + y, 0.5 + e.fout() * 1.75);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 18.0, e.rotation, 80, hj);
});

const sandBullet = extend(BasicBulletType, {
	draw: function(b){
		Draw.color(Color.valueOf("ffe4ca"));
		
		Fill.circle(b.x, b.y, 0.5 + b.fout() * 2.75);
	}
});

sandBullet.speed = 3.7;
sandBullet.damage = 3.1;
sandBullet.lifetime = 31;
sandBullet.drag = 0.04;
//sandBullet.pierce = true;
sandBullet.despawnEffect = Fx.none;
sandBullet.hitEffect = sandHit;
sandBullet.shootEffect = Fx.none;
sandBullet.smokeEffect = Fx.none;

const sandStorm = extendContent(ItemTurret, "sandstorm", {
	shouldActiveSound(tile){
		entity = tile.ent();
		return entity.target != null && this.hasAmmo(tile);
	}
});

sandStorm.ammo(Items.sand, sandBullet);