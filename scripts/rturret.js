const lib = require("funclib");

const rBeamEffect = newEffect(16, e => {
	const colors = [Pal.heal, Color.white];
	const strokes = [2, 1.25];
	const vec = e.data;

	for(var s = 0; s < 2; s++){
		Draw.color(colors[s]);
	
		Fill.circle(e.x, e.y, strokes[s] * 4 * e.fslope());
	
		Fill.circle(vec.x, vec.y, strokes[s] * 4 * e.fslope());
	
		Lines.stroke(strokes[s] * 4 * e.fslope());
		Lines.line(e.x, e.y, vec.x, vec.y, CapStyle.none);
	};
	Draw.reset();
});

const rScanner = extend(BasicBulletType, {
	update: function(b){
		const vec = new Vec2();
		var lastTile;
		
		if(b.timer.get(1, 4)){
			//Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.lengthC, false);
			for(var i = 0; i < this.searchAccuracy; i++){
				vec.trns(b.rot(), (this.lengthB / this.searchAccuracy) * i);
				
				var tx = b.x + vec.x;
				var ty = b.y + vec.y;
				
				//Effects.effect(Fx.hitLaser, tx, ty);
				
				var tile = Vars.world.ltileWorld(tx, ty);
				
				//print(tile + Time.time());
				
				if(tile != null && tile != lastTile && tile.entity != null && !(tile.block() instanceof BuildBlock)){
					if(tile.getTeam() == b.getTeam() && tile.entity.health() < tile.entity.maxHealth()){
						
						var data = new Vec2(tile.drawx(), tile.drawy());
						
						//var dst = Mathf.dst(b.x, b.y, tx, ty);
						
						Effects.effect(Fx.healBlockFull, Pal.heal, tile.drawx(), tile.drawy(), tile.block().size);
						tile.entity.healBy((this.healPercent / 100) * tile.entity.maxHealth());
						
						Effects.effect(rBeamEffect, b.x, b.y, 0, data);
						
						//print("test2");
						
						break;
					};
					//print("test1");
				};
				
				lastTile = tile;
			}
		}
	},
	
	draw: function(b){}
});

rScanner.healPercent = 0.975;
rScanner.speed = 0.001;
rScanner.searchAccuracy = 25;
rScanner.lengthB = 75;
rScanner.damage = 0;
rScanner.lifetime = 3;
rScanner.hitEffect = Fx.none;
rScanner.despawnEffect = Fx.none;
rScanner.pierce = true;
rScanner.collidesAir = false;
rScanner.collidesTiles = true;
rScanner.collides = false;
rScanner.collidesTeam = true;
rScanner.shootEffect = Fx.none;
rScanner.smokeEffect = Fx.none;

const rTurret = extendContent(PowerTurret, "repair-turret", {	
	validateTarget(tile){
		entity = tile.ent();
		return !lib.invalidateAlly(entity.target, tile.getTeam(), tile.drawx(), tile.drawy(), Number.MAX_VALUE);
	},
	
	findTarget: function(tile){
		entity = tile.ent();
		
		entity.target = Units.findAllyTile(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead() && e.entity.healthf() < 1 && e != tile));
		
		//print(entity.target);
	}
});

rTurret.shootType = rScanner;