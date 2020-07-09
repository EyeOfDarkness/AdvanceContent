const elib = require("effectlib");

const tmpRandom = new Rand();
const tmpVec = new Vec2();

const ashPoint = (x, y, size) => {
	Fill.circle(x, y, 11 * size);
};

const ashesRandom = (seed, amount, x, y, radius, fade) => {
	tmpRandom.setSeed(seed * 9997);
	for(var d = 0; d < amount; d++){
		var scl = radius * tmpRandom.nextFloat();
		var vang = tmpRandom.nextFloat() * 360;
		var randSize = tmpRandom.nextFloat();
		tmpVec.set(scl, 0).rotate(vang);
		ashPoint(tmpVec.x + x, tmpVec.y + y, randSize * fade);
	}
};

const resurrect = elib.newEffectWDraw(74, 45, e => {
	Draw.color(Pal.rubble, Pal.darkFlame, Pal.lightFlame, e.fin());
	//Draw.color(Pal.rubble, Pal.rubble, Pal.darkFlame, e.fin());
	
	//var slopeA = (0.5 - Math.abs(e.finpow() - 0.5)) * 2;
	
	ashesRandom(e.id, 23, e.x, e.y, ((1 - e.finpow()) * 123), e.fin());
	
	var interpolate = Interpolation.pow3In.apply(e.fin());
	var slopeB = (0.5 - Math.abs(interpolate - 0.5)) * 2;
	
	Draw.reset();
	Draw.alpha(e.fin());
	Draw.rect(e.data.getType().region, e.x, e.y, e.data.rotation - 90);
	
	Draw.blend(Blending.additive);
	Draw.mixcol(Pal.lightFlame, 1);
	Draw.alpha(slopeB);
	Draw.rect(e.data.getType().region, e.x, e.y, e.data.rotation - 90);
	Draw.blend();
	Draw.reset();
});

var effectArray = [];

const clearHolesb = function(array){
	return array != null;
};

Events.on(EventType.WaveEvent, cons(event => {
	if(effectArray.length == 0) return;
	effectArray = effectArray.filter(clearHolesb);
	for(var s = 0; s < effectArray.length; s++){
		effectArray[s].add();
		Effects.effect(resurrect, effectArray[s].x, effectArray[s].y, effectArray[s].rotation, effectArray[s]);
		effectArray[s] = null;
	}
}));

Events.on(EventType.ResetEvent, cons(event => {
	//print(effectArray);
	effectArray = [];
	//print(effectArray);
}));

const trailEffect = newEffect(24, e => {
	var trailRegion = e.data.fireRegionsF()[Mathf.randomSeed(e.id, 0, 4)];
	
	if(!Core.settings.getBool("bloom")){
		Draw.blend(Blending.additive);
		Draw.color(Color.valueOf("722a18"), Color.valueOf("36080230"), e.fin());
		Draw.rect(trailRegion, e.x, e.y, e.rotation - 90);
		Draw.blend();
	}else{
		Draw.mixcol(Color.valueOf("ff9c5a"), 1);
		Draw.alpha(e.fout());
		Draw.rect(trailRegion, e.x, e.y, e.rotation - 90);
	};
	
	//Draw.color(Color.valueOf("ffffff"));
	//Fill.circle(e.x, e.y, (1 * e.fout()) * (e.rotation / 1.3));
});

const phoenixMain = prov(() => {
	phoenixMainB = extend(HoverUnit, {
		onDeath(){
			this.super$onDeath();
			
			if(this.getLife() <= 0) return;
			
			//var next = this.init(this.getType(), this.getTeam());
			var next = this.getType().create(this.getTeam());
			next.set(this.x, this.y);
			next.rotation = this.rotation;
			next.setLife(this.getLife() - 1);
			next.setDrawTime(74);
			
			if(effectArray.lastIndexOf(next) == -1){
				effectArray.push(next);
			};
			
			//Effects.effect(ashes, this.x, this.y, this.rotation);
		},
		
		update(){
			this.super$update();
			
			Effects.effect(trailEffect, this.x, this.y, this.rotation, this.getType());
			
			if(this.getDrawTime() > 0){
				this.setDrawTime(this.getDrawTime() - Time.delta());
			};
		},
		
		draw(){
			if(this.getDrawTime() <= 0) this.super$draw();
		},
		
		getLife(){
			return this._lives;
		},
		
		setLife(a){
			this._lives = a;
		},
		
		getDrawTime(){
			return this._drawTime;
		},
		
		setDrawTime(a){
			this._drawTime = a;
		},
		
		added(){
			this.super$added();
			
			//Effects.effect(resurrect, this.x, this.y, this.rotation, this);
		}
	});
	//phoenixMainB.setDrawTime(74);
	phoenixMainB.setDrawTime(0);
	phoenixMainB.setLife(3);
	return phoenixMainB;
});

const loadImmunities = unitType => {
	var statuses = Vars.content.getBy(ContentType.status);
	statuses.each(cons(stat => {
		if(stat != null){
			unitType.immunities.add(stat);
		}
	}));
};

const phoenixBullet = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		if(Mathf.chance(0.5 * Time.delta())){
			Effects.effect(this.trailEffect, this.backColor, b.x + Mathf.range(2), b.y + Mathf.range(2), b.rot());
		};
	},
	
	draw(b){
		Draw.color(Pal.lightFlame, Pal.darkFlame, b.fin());
		Fill.circle(b.x, b.y, 0.34 + b.fslope() * 1.5);
		Draw.reset();
	}
});

phoenixBullet.speed = 4.6;
phoenixBullet.damage = 14;
phoenixBullet.lifetime = 56;
phoenixBullet.homingPower = 0.1;
phoenixBullet.homingRange = 80;
phoenixBullet.hitSize = 2;
phoenixBullet.shootEffect = Fx.none;
phoenixBullet.smokeEffect = Fx.none;
phoenixBullet.trailEffect = Fx.ballfire;
phoenixBullet.hitEffect = Fx.hitFlameSmall;
phoenixBullet.despawnEffect = Fx.none;
phoenixBullet.collides = true;
phoenixBullet.collidesTiles = true;
phoenixBullet.collidesAir = true;
phoenixBullet.pierce = false;
phoenixBullet.statusDuration = 300;
phoenixBullet.status = StatusEffects.burning;

const phoenixWeapon = extendContent(Weapon, "phoenix-equip", {});

phoenixWeapon.reload = 4;
phoenixWeapon.alternate = true;
phoenixWeapon.spacing = 3;
phoenixWeapon.shots = 2;
phoenixWeapon.inaccuracy = 24;
phoenixWeapon.length = 43;
phoenixWeapon.width = 0;
phoenixWeapon.ignoreRotation = false;
phoenixWeapon.bullet = phoenixBullet;
phoenixWeapon.shootSound = Sounds.flame;

const phoenixUnit = extendContent(UnitType, "phoenix-unit", {
	load(){
		this.super$load();
		
		for(var i = 0; i < 5; i++){
			this.fireRegions[i] = Core.atlas.find(this.name + "-flame-" + (i + 1));
		};
		//print(this.fireRegions);
	},
	
	fireRegionsF(){
		return this.fireRegions;
	},
	
	init(){
		this.super$init();
		
		loadImmunities(this);
	}
});

phoenixUnit.localizedName = "Phoenix";
phoenixUnit.fireRegions = [];
phoenixUnit.create(phoenixMain);
phoenixUnit.description = "Fake Real Phoenix.";
phoenixUnit.weapon = phoenixWeapon;
phoenixUnit.engineSize = 0;
phoenixUnit.engineOffset = 0;
phoenixUnit.flying = true;
phoenixUnit.health = 12000;
//phoenixUnit.health = 3000;
phoenixUnit.mass = 10;
phoenixUnit.hitsize = 20;
phoenixUnit.speed = 0.03;
phoenixUnit.drag = 0.02;
phoenixUnit.attackLength = 160;
phoenixUnit.range = 170;
phoenixUnit.maxVelocity = 3.92;
phoenixUnit.shootCone = 6;
phoenixUnit.rotatespeed = 0.11;
phoenixUnit.baseRotateSpeed = 0.1;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = phoenixUnit;*/