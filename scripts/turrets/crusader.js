var corrupted = StatusEffects.none;

const elib = require("effectlib");

const changeTeamTile = newEffect(17, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("d291ff"), Color.valueOf("d291ff00"), e.fin());
	Fill.square(e.x, e.y, e.rotation * Vars.tilesize / 2);
	
	//Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("d291ff"));
	Lines.stroke(e.fout() * 4);
	Lines.square(e.x, e.y, (e.rotation * Vars.tilesize / 2) * e.fin());
	Draw.blend();
});

const changeTeam = elib.newEffectWDraw(78, 512, e => {
	const type = e.data.getType();
	const base = e.data;
	const vec = new Vec2();
	//const weaponB = type.weapon.region;
	//print(e.data.getType());
	
	Draw.blend(Blending.additive);
	Draw.alpha(e.fout());
	Draw.mixcol(Color.valueOf("d291ff"), 1);
	Draw.rect(type.region, base.x, base.y, base.rotation - 90);
	
	Draw.reset();
	Draw.blend();
});

const strdustCrusLaser = extend(BasicBulletType, {
	update: function(b){
		Effects.shake(1.2, 1.2, b.x, b.y);
		if(b.timer.get(1, 5)){
			this.scanUnits(b);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.lengthB, true);
		};
	},
	
	scanUnits: function(b){
		const vec = new Vec2();
		
		for(var i = 0; i < this.searchAccuracy; i++){
			vec.trns(b.rot(), (this.lengthB / this.searchAccuracy) * i);
			vec.add(b.x, b.y);
			
			var radius = (this.lengthB / this.searchAccuracy) * 2;
			
			Units.nearbyEnemies(b.getTeam(), vec.x - radius, vec.y - radius, radius * 2, radius * 2, cons(unit => {
				if(unit != null){
					if(Mathf.within(vec.x, vec.y, unit.x, unit.y, radius) && unit.getTeam() != b.getTeam() && unit instanceof BaseUnit && !unit.isDead()){
						if(unit.health() < Math.max(unit.maxHealth() * strdustCrusLaser.enemyHealthRatio, strdustCrusLaser.enemyMinHealthRatio)){
							var lastUnit = unit;
							
							unit.kill();
							
							var newUnit = lastUnit.getType().create(b.getTeam());
							newUnit.set(lastUnit.x, lastUnit.y);
							newUnit.rotation = lastUnit.rotation;
							newUnit.add();
							newUnit.health(lastUnit.health());
							newUnit.applyEffect(corrupted, Number.MAX_VALUE);
							newUnit.velocity().set(lastUnit.velocity());
							
							Effects.effect(changeTeam, newUnit.x, newUnit.y, newUnit.rotation, newUnit);
							//b.getOwner().damage(Math.min((newUnit.maxHealth() * 0.5), (b.getOwner().maxHealth() - 1)));
							//Effects.effect(convertDamage, b.getOwner().x, b.getOwner().y);
							
							//health changes after spawn, that means you cant set its health
						}
					}
				}
			}));
		}
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effects.effect(this.hitEffect, hitx, hity);
			var tile = Vars.world.ltileWorld(hitx, hity);
			if(tile != null && tile.ent() != null){
				var entity = tile.ent();
				
				if(entity.health() < Math.max(entity.maxHealth() * this.enemyHealthRatio, this.enemyMinHealthRatio)){
					tile.setTeam(b.getTeam());
					if(tile.block() != null){
						Effects.effect(changeTeamTile, tile.drawx(), tile.drawy(), tile.block().size);
					}
				}
			}
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("a379fd55"), Color.valueOf("d291ffaa"), Color.valueOf("e3baff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.24];
		const strokes = [2.3, 1.9, 1.4, 0.6];
		const lenscales = [1.0, 1.12, 1.15, 1.164];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + (0.3 - Mathf.absin(Time.time(), 1.7, 0.3))));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.9) * 55.0);
				Lines.stroke((11 + Mathf.absin(Time.time(), 1.7, 3.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), this.lengthB * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

strdustCrusLaser.enemyMinHealthRatio = 95;
strdustCrusLaser.enemyHealthRatio = 0.125;
strdustCrusLaser.searchAccuracy = 75;
strdustCrusLaser.lengthB = 360;
strdustCrusLaser.speed = 0.001;
strdustCrusLaser.damage = 110;
strdustCrusLaser.lifetime = 18;
strdustCrusLaser.hitEffect = Fx.hitLancer;
strdustCrusLaser.despawnEffect = Fx.none;
strdustCrusLaser.hitSize = 7;
strdustCrusLaser.drawSize = 780;
strdustCrusLaser.pierce = true;
strdustCrusLaser.shootEffect = Fx.none;
strdustCrusLaser.smokeEffect = Fx.none;

const strdustCrus = extendContent(LaserTurret, "stardust-crusader",{
	init(){
		this.super$init();
		
		//print(corrupted);
		corrupted = Vars.content.getByName(ContentType.status, "advancecontent-corrupted");
		//print(corrupted);
	},
	
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	draw: function(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
	}
});
strdustCrus.shootType = strdustCrusLaser;
strdustCrus.update = true;