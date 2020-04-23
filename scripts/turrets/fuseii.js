const fuseiiAlt = newEffect(10, e => {
	Draw.color(Color.white, Pal.lancerLaser, e.fin());
	
	Drawf.tri(e.x, e.y, 20 * e.fout(), (140 + 50), e.rotation);
	Drawf.tri(e.x, e.y, 20 * e.fout(), 10, e.rotation + 180);
	Draw.reset();
});

const fuseiiBullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 17)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.rayLength, false);
		};
	},
	
	draw: function(b){
		Draw.color(Color.white, Pal.lancerLaser, b.fin());
		
		for(var i = 0; i < 7; i++){
			Tmp.v1.trns(b.rot(), i * 8);
			var sl = Mathf.clamp(b.fout() - 0.5) * (80 - i * 10);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() + 90);
			Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 4, sl, b.rot() - 90);
		}
		Drawf.tri(b.x, b.y, 20 * b.fout(), (this.rayLength + 30), b.rot());
		Drawf.tri(b.x, b.y, 20 * b.fout(), 10, b.rot() + 180);
		Draw.reset();
	}
});

fuseiiBullet.speed = 0.01;
fuseiiBullet.damage = 145;
fuseiiBullet.lifetime = 10;
fuseiiBullet.collidesTeam = false;
fuseiiBullet.pierce = true;
fuseiiBullet.rayLength = 140 + 20;
fuseiiBullet.hitEffect = Fx.hitLancer;
fuseiiBullet.despawnEffect = Fx.none;
fuseiiBullet.shootEffect = fuseiiAlt;
fuseiiBullet.smokeEffect = Fx.lightningShoot;

const fuseii = extendContent(ItemTurret, "fuse-ii", {});

fuseii.shootShake = 4;
fuseii.recoil = 5;
fuseii.shots = 3;
fuseii.shootEffect = Fx.lightningShoot;
fuseii.ammo(Items.graphite, fuseiiBullet);