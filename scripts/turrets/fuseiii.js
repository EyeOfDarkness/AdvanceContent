const rangeB = 150;

const fuseiiiBullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength, false);
		};
	},
	
	draw: function(b){
		Draw.color(Color.white, Pal.lancerLaser, b.fin());
		
		for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 10);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}
		Drawf.tri(b.x, b.y, 20 * b.fout(), (this.rayLength + 30), b.rot());
		Drawf.tri(b.x, b.y, 20 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

fuseiiiBullet.speed = 0.01;
fuseiiiBullet.damage = 165;
fuseiiiBullet.lifetime = 10;
fuseiiiBullet.collidesTeam = false;
fuseiiiBullet.pierce = true;
fuseiiiBullet.rayLength = rangeB + 20;
fuseiiiBullet.hitEffect = Fx.hitLancer;
fuseiiiBullet.despawnEffect = Fx.none;
fuseiiiBullet.shootEffect = Fx.lightningShoot;
fuseiiiBullet.smokeEffect = Fx.lightningShoot;

const fuseiii = extendContent(ItemTurret, "fuse-iii", {
	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.shots);
		this.stats.add(BlockStat.shots, this.shots + this.sideShots, StatUnit.none);
	},
	
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-5");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find(this.name)
	];},
	
	shoot: function(tile, type){
		entity = tile.ent();
		
		const sideOffset = [-5, 0, 5];
		const yOffset = [4, 0, 4];
		
		entity.recoil = this.recoil;
		
		for(var i = 0; i < this.sideShots; i++){
			this.tr.trns(entity.rotation, (this.size * Vars.tilesize / 2) - yOffset[i], sideOffset[i]);
			var angleB = ((-this.sideShots + i * this.sideShots) / this.sideShots) * this.sideSpread;
			
			for(var s = 0; s < this.shots; s++){
				//this.bullet(tile, type, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy) + (s - this.shots / 2) * this.spread);
				var angle = ((-this.shots + s * this.shots) / this.shots) * this.spread;
				this.bullet(tile, type, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy) + angle + angleB);
			};
			
			this.effects(tile);
		};
		
		this.useAmmo(tile);
	}
});

fuseiii.ammoPerShot = 3;
fuseiii.sideShots = 3;
fuseiii.sideSpread = 11;
fuseiii.spread = 30;
fuseiii.range = rangeB;
fuseiii.shootShake = 4;
fuseiii.recoil = 5;
fuseiii.shots = 3;
fuseiii.ammo(Items.graphite, fuseiiiBullet);