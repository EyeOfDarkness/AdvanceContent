const elib = require("effectlib");

const bulletSize = 5;

const despawnedBullet = newEffect(12, e => {
	const scales = [8.6, 7, 5.5, 4.3, 4.1, 3.9];
	const colors = [Color.valueOf("4787ff80"), Color.valueOf("a9d8ff"), Color.valueOf("ffffff"), Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), Color.valueOf("000000")];
	
	for(var i = 0; i < 6; i++){
		Draw.color(colors[i]);
		Fill.circle(e.x + Mathf.range(1), e.y + Mathf.range(1), e.fout() * bulletSize * scales[i]);
	};
	Draw.reset();
});

const attractBlock = elib.newEffectWDraw(23, 180, e => {
	var interpC = Interpolation.pow3In.apply(e.fin());
	var sizeB = 1 - Interpolation.pow5In.apply(e.fin());
	const region = e.data[0];
	var dx = e.data[1];
	var dy = e.data[2];
	var rot = e.rotation * 90;
	var lerpx = Mathf.lerp(dx, e.x, interpC);
	var lerpy = Mathf.lerp(dy, e.y, interpC);
	//const weaponB = type.weapon.region;
	//print(e.data.getType());
	
	//Draw.rect(region, lerpx, lerpy, (e.fin() * Mathf.randomSeedRange(e.id * 997, 32)) + rot);
	Draw.rect(region, lerpx, lerpy, region.getWidth() * Draw.scl * sizeB, region.getHeight() * Draw.scl * sizeB, (e.fin() * Mathf.randomSeedRange(e.id * 997, 32)) + rot);
	
	Draw.reset();
	Draw.blend();
});

const whirl = newEffect(65, e => {
	const vec = new Vec2();
	for(var i = 0; i < 2; i++){
		var h = i * 2;
		var rand1 = Interpolation.exp5In.apply((Mathf.randomSeedRange(e.id + h, 1) + 1) / 2);
		var rand2 = (Mathf.randomSeedRange(e.id * 2 + h, 360) + 360) / 2;
		var rand3 = (Mathf.randomSeedRange(e.id * 4 + h, 5) + 5) / 2;
		var angle = rand2 + ((180 + rand3) * e.fin());
		
		vec.trns(angle, rand1 * 150 * e.fout());
		
		Draw.color(Color.valueOf("4787ff"));
		Lines.stroke((1 * e.fout()) + 0.25);
		Lines.lineAngle(e.x + vec.x, e.y + vec.y, angle + 270 + 15, e.fout() * 8);
		
		//Fill.poly(e.x + vec.x, e.y + vec.y, 6, 5 * e.fout(), e.rotation);
	};
});

const singularityTrail = newEffect(55, e => {
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	
	//Fill.circle(e.x, e.y, e.rotation * e.fout());
	
	Fill.poly(e.x, e.y, 6, e.rotation * e.fout(), e.rotation);
});

const singularityBulletEffect = extend(BasicBulletType, {
	update: function(b){
		var interp = this.strength * Interpolation.exp10Out.apply(b.fin());
		var interpB = Interpolation.exp10Out.apply(b.fin());
		const vec = new Vec2();
		const vec2 = new Vec2();
		const tileDamage = 150;
		
		/*if(Mathf.chance(Time.delta() * (0.5 * interp))){
			Effects.effect(whirl, b.x, b.y);
		};*/
		
		Effects.shake(interpB, interpB, b.x, b.y);
		
		var array = [];
		
		if(b.timer.get(1, 7)){
			for(var s = 0; s < 16; s++){
				tileB = Units.findEnemyTile(b.getTeam(), b.x, b.y, this.rangeB, boolf(tile => array.lastIndexOf(tile.ent().getID()) == -1 && !tile.ent().isDead() && Mathf.randomBoolean())); //random boolean to reduce lag and loop size.
				if(tileB == null) break;
				
				dstB = Math.abs((Mathf.dst(b.x, b.y, tileB.x, tileB.y) / this.rangeB) - 1);
				
				if(tileB.health <= tileDamage || (tileB.block != null && Mathf.within(b.x, b.y, tileB.x, tileB.y, (interpB * bulletSize * 3.9) + (tileB.block.size / 2)))){
					tileB.kill();
					if(!Vars.headless){
						var data = [Core.atlas.find(tileB.block.name), tileB.x, tileB.y];
						Effects.effect(attractBlock, b.x, b.y, tileB.tile.rotation(), data);
					}
				};
				
				tileB.damage(tileDamage * dstB);
				array[s] = tileB.getID();
			}
		};
		
		Units.nearbyEnemies(b.getTeam(), b.x - this.rangeB, b.y - this.rangeB, this.rangeB * 2, this.rangeB * 2, cons(u => {
			if(u != null && Mathf.within(b.x, b.y, u.x, u.y, this.rangeB)){
				if(u instanceof SolidEntity){
					var hitSizeB = 0;
					if(u instanceof BaseUnit) hitSizeB = u.getType().hitsize / 2;
					if(u instanceof Player) hitSizeB = u.mech.hitsize / 2;
					//var interp = this.strength * Interpolation.exp10Out.apply(b.fin());
					var dst = Math.abs((Mathf.dst(b.x, b.y, u.x, u.y) / this.rangeB) - 1) * interp;
					var ang = Angles.angle(u.x, u.y, b.x, b.y);
					
					vec.trns(ang, dst);
					
					u.velocity().add(vec);
					
					if(u instanceof FlyingUnit){
						vec2.set(vec).scl(0.5);
						u.velocity().add(vec2);
					};
					
					u.moveBy(vec.x, vec.y);
					
					//var interpB = Interpolation.exp10Out.apply(b.fin());
					
					if(Mathf.within(b.x, b.y, u.x, u.y, (interpB * bulletSize * 3.9) + hitSizeB) && u instanceof HealthTrait){
						u.damage(120);
					};
					
					//var data = [b, u, interp];
					
					//Effects.effect(laserEffect, b.x, b.y, 0, data);
				}
			}
		}));
	},
	
	draw: function(b){
		var interp = Interpolation.exp10Out.apply(b.fin());
		
		const scales = [8.6, 7, 5.5, 4.3, 4.1, 3.9];
		const colors = [Color.valueOf("4787ff80"), Color.valueOf("a9d8ff"), Color.valueOf("ffffff"), Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), Color.valueOf("000000")];
		
		for(var i = 0; i < 6; i++){
			Draw.color(colors[i]);
			Fill.circle(b.x + Mathf.range(1), b.y + Mathf.range(1), interp * bulletSize * scales[i]);
		};
		Draw.reset();
	}
});

singularityBulletEffect.strength = 0.94;
singularityBulletEffect.rangeB = 230;
singularityBulletEffect.speed = 0.0002;
singularityBulletEffect.damage = 13;
singularityBulletEffect.collidesTiles = false;
singularityBulletEffect.lifetime = 3.5 * 60;
singularityBulletEffect.pierce = true;
singularityBulletEffect.bulletWidth = 12;
singularityBulletEffect.bulletHeight = 12;
singularityBulletEffect.bulletShrink = 0;
singularityBulletEffect.hitSize = 19;
singularityBulletEffect.despawnEffect = despawnedBullet;

const singularityBullet = extend(BasicBulletType, {
	update: function(b){
		const vec = new Vec2();
		
		if(Units.closestTarget(b.getTeam(), b.x, b.y, 20) != null){
			b.time(this.lifetime + 1);
		};
		
		if(b.timer.get(0, 2 + b.fslope() * 1.5)){
			Effects.effect(singularityTrail, this.backColor, b.x, b.y, 1 + (b.fslope() * 4));
		};
	},
	
	despawned(b){
		this.super$despawned(b);
		
		Bullet.create(singularityBulletEffect, b, b.x, b.y, b.rot());
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("a9d8ff"));
		Fill.circle(b.x, b.y, 7 + (b.fout() * 1.5));
		Draw.color(Color.valueOf("ffffff"));
		Fill.circle(b.x, b.y, 5.5 + (b.fout() * 1));
	}
});

singularityBullet.strength = 0.7;
singularityBullet.speed = 6.6;
singularityBullet.damage = 7;
singularityBullet.drag = 0.018;
singularityBullet.lifetime = 110;
singularityBullet.collidesTiles = false;
singularityBullet.pierce = true;
singularityBullet.bulletWidth = 12;
singularityBullet.bulletHeight = 12;
singularityBullet.bulletShrink = 0;
singularityBullet.hitSize = 9;
singularityBullet.despawnEffect = Fx.none;
//singularityBullet.hitSound = Sounds.spark;

const singularity = extendContent(PowerTurret, "singularity", {
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
	];}
});

singularity.shootType = singularityBullet;