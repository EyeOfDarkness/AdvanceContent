const elib = require("effectlib");

const empEffect = elib.newEffectWDraw(13, 28, e => {	
	Draw.color(Color.valueOf("a9d8ff"));
	Fill.square(e.x, e.y, 1.75 * e.fout(), 45);
	Draw.reset();
});

const empBlockDamage = elib.newEffectWDraw(20, 40, e => {
	var curve = Mathf.curve(e.fin(), 0, 0.3);
	
	Draw.color(Color.valueOf("a9d8ff"));
	Lines.stroke(0.25 + (e.fout() * 1.5));
	//Lines.circle(e.x, e.y, radius * curve);
	Lines.square(e.x, e.y, (e.rotation * Vars.tilesize / 2) * curve);
	Draw.reset();
});

const empHit = elib.newEffectWDraw(25, 220, e => {
	var radius = 110;
	var curve = Mathf.curve(e.fin(), 0, 0.3);
	
	Draw.color(Color.valueOf("a9d8ff"));
	Lines.stroke(0.25 + (e.fout() * 1.5));
	Lines.circle(e.x, e.y, radius * curve);
	Draw.reset();
});

//does nothing other than extending EMP.
const empEffectBullet = extend(BasicBulletType, {
	update(b){
		if(b.getData() != null && !b.getData().isDead()){
			var entity = b.getData();
			if(Mathf.chance(0.7 * Time.delta())){
				entity.productionEfficiency = 0;
				entity.generateTime = 0;
				entity.power.status = 0;
			};
			
			if(Mathf.chance(0.125 * Time.delta())){
				entity.cons.trigger();
			};
			
			if(Mathf.chance(0.3 * Time.delta())){
				Effects.effect(empEffect, entity.x + Mathf.range(entity.block.size * Vars.tilesize / 2), entity.y + Mathf.range(entity.block.size * Vars.tilesize / 2));
			};
		}
	},
	
	draw(b){}
});
empEffectBullet.speed = 0.001;
empEffectBullet.damage = 0;
empEffectBullet.lifetime = 23;
empEffectBullet.despawnEffect = Fx.none;
empEffectBullet.hitEffect = Fx.none;
empEffectBullet.collidesTiles = false;
empEffectBullet.collidesAir = false;
empEffectBullet.collides = false;

const empUnitBullet = extend(BasicBulletType, {
	hit(b){
		Effects.effect(this.hitEffect, b.x, b.y, b.rot());
		this.hitSound.at(b);
		
		Effects.effect(empHit, b.x, b.y, b.rot());
			
		var range = 110;
		
		/*var tile = Units.findEnemyTile(b.getTeam(), b.x, b.y, range, boolf(t => t.block() instanceof PowerBlock));
		if(tile != null){
			//var entity = tile.ent();
			
			//print(tile);
			
			if(tile.power.graph.getBatteryStored() > 0){
				tile.power.graph.useBatteries(9000);
				//print("drained");
			};
		}*/
		
		var array = [];
		
		for(var i = 0; i < 20; i++){
			var tileB = Units.findEnemyTile(b.getTeam(), b.x, b.y, range, boolf(t => t.block() instanceof PowerBlock && array.lastIndexOf(t.ent().getID()) == -1));
			if(tileB == null) break;
			
			var powerGraph = tileB.power.graph;
			var blockB = tileB.block;
			
			if(powerGraph.getBatteryStored() > 1){
				//more blocks = more used energy
				//EMP now clears links so it now use more batteries
				powerGraph.useBatteries(17000);
				//print("drained");
			};
			
			if(tileB instanceof PowerGenerator.GeneratorEntity){
				tileB.productionEfficiency = 0;
				tileB.generateTime = 0;
				
				if(tileB instanceof  NuclearReactor.NuclearReactorEntity){
					tileB.heat = 0;
					tileB.damage(7);
				};
				
				tileB.power.status = 0;
				
				tileB.damage(1);
				
				Bullet.create(empEffectBullet, b.getOwner(), b.getTeam(), tileB.x, tileB.y, 0, 1, 1, tileB);
			};
			
			if(tileB.block instanceof PowerNode) this.clearPowerNode(tileB);
			
			powerGraph.distributePower(powerGraph.getPowerNeeded() + 4000, -1000);
			//print(tileB + "|tile entity");
			//var entityB = tileB.ent();
			
			Effects.effect(empBlockDamage, tileB.x, tileB.y, blockB.size);
			
			tileB.damage(1);
			
			array[i] = tileB.getID();
		};
		
		//print(array + "|array");
	},
	
	clearPowerNode(entity){
		var powerM = entity.power;
		var powerLinks = powerM.links;
		for(var s = 0; s < powerLinks.size; s++){
			other = powerLinks.items[s];
			
			if(powerLinks.contains(other)) entity.block.configured(entity.getTile(), null, other);
		}
	}
});

empUnitBullet.speed = 5.7;
empUnitBullet.damage = 90;
empUnitBullet.lifetime = 35;
empUnitBullet.splashDamage = 28;
empUnitBullet.splashDamageRadius = 30;
empUnitBullet.bulletWidth = 14;
empUnitBullet.bulletHeight = 20;
empUnitBullet.bulletShrink = 0;
empUnitBullet.hitSize = 7;
empUnitBullet.backColor = Color.valueOf("a9d8ff");
empUnitBullet.frontColor = Color.white;
empUnitBullet.hitEffect = Fx.hitLancer;
empUnitBullet.hitSound = Sounds.spark;

const empWeap = extendContent(Weapon, "emp-equip", {});

empWeap.reload = 95;
empWeap.alternate = true;
empWeap.length = 16;
empWeap.width = 0;
empWeap.ignoreRotation = false;
empWeap.bullet = empUnitBullet;
empWeap.shootSound = Sounds.spark;

const empUnitBase = prov(() => new JavaAdapter(HoverUnit, {}));

const empUnit = extendContent(UnitType, "emp3", {});

empUnit.localizedName = "Emp-T3";
empUnit.create(empUnitBase);
empUnit.weapon = empWeap;
empUnit.engineSize = 4.2;
empUnit.engineOffset = 12;
empUnit.flying = true;
empUnit.health = 1200;
empUnit.mass = 5;
empUnit.hitsize = 20;
empUnit.speed = 0.07;
empUnit.drag = 0.02;
empUnit.attackLength = 130;
empUnit.range = 150;
empUnit.maxVelocity = 0.92;
empUnit.shootCone = 15;
empUnit.rotatespeed = 0.013;
empUnit.baseRotateSpeed = 0.06;