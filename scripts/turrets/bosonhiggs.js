const bosonHiggsbullet = extend(BasicBulletType, {
	update: function(b){
		if(b.timer.get(1, 15)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.laserLength, true);
		};
	},
	
	draw: function(b){
		const colors = [Color.valueOf("4787ff55"), Color.valueOf("4787ffaa"), Color.valueOf("a9d8ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.7, 0.5, 0.24];
		const strokes = [2.8, 2.4, 1.9, 1.3];
		const lenscales = [1.0, 1.13, 1.16, 1.17];
		//const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 1.0) * 45.0);
				Lines.stroke(5.8 * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.laserLength * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

bosonHiggsbullet.laserLength = 270;
bosonHiggsbullet.speed = 0.001;
bosonHiggsbullet.damage = 85;
bosonHiggsbullet.lifetime = 14;
bosonHiggsbullet.hitEffect = Fx.hitLancer;
bosonHiggsbullet.despawnEffect = Fx.none;
bosonHiggsbullet.hitSize = 13;
bosonHiggsbullet.drawSize = 460;
bosonHiggsbullet.pierce = true;
bosonHiggsbullet.shootEffect = Fx.none;
bosonHiggsbullet.smokeEffect = Fx.none;

const bosonHiggs = extendContent(PowerTurret, "higgs-boson", {
	load: function(){
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-6");
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-6"),
		Core.atlas.find(this.name)
	];},
	
	shoot: function(tile, ammo){
		entity = tile.ent();
		entity.shots++;
		entity.heat = 1;
		entity.recoil = this.recoil;

		var i = Mathf.signs[entity.shots % 2];

		this.tr.trns(entity.rotation - 90, this.shotWidth * i, this.size * Vars.tilesize / 2);
		this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));

		this.effects(tile);
		this.useAmmo(tile);
    }
});

bosonHiggs.shootType = bosonHiggsbullet;
bosonHiggs.shotWidth = 8.625;