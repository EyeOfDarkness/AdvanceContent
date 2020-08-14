const lib = require("funclib");

const striderWeap = extendContent(Weapon, "strider-equip", {
	load: function(){
		this.region = Core.atlas.find("advancecontent-strider-equip");
	}
});

striderWeap.reload = 8;
striderWeap.alternate = true;
striderWeap.length = 14;
striderWeap.width = 16.25;
striderWeap.recoil = 2.4;
striderWeap.bullet = Bullets.standardDenseBig;
striderWeap.shootSound = Sounds.artillery;
striderWeap.minPlayerDist = 35;

const striderBase = prov(() => new JavaAdapter(GroundUnit, {
	draw(){
		const vec = new Vec2();
		const walk = (this.walkTime * this.type.speed * 5) / 3.9;
		
		Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
		
		const floor = this.getFloorOn();
		
		if(floor.isLiquid){
			Draw.color(Color.white, floor.color, this.drownTime * 0.4);
		}else{
			Draw.color(Color.white);
		};
		
		Draw.rect(this.type.baseRegion, this.x, this.y, this.baseRotation - 90);

		var lens = [11, 19, 19];
		for(var l = 0; l < 2; l++){
			var signB = [1, -1];
			var offsets = [0, 180 * Mathf.radiansToDegrees];
			var offsetsB = [180 * Mathf.radiansToDegrees, 0];
			vec.trns(this.baseRotation - 90, 9 * Mathf.signs[l], 9);
			
			var ft1 = Mathf.sin(walk + offsets[l], 6, 20);
			var ft2 = Mathf.sin(walk + 180 + offsets[l], 6, -22);
			var ft3 = Mathf.sin(walk + 45 + offsets[l], 6, -40);
			var rots = [ft1 + 30, ft2 + 60, ft3 + -40];
			
			lib.legRenderer("advancecontent-strider-leg", this.x + vec.x, this.y + vec.y, this.baseRotation, 3, rots, lens, signB[l]);
			
			vec.trns(this.baseRotation - 90, 8 * signB[l], -9);
			
			ft1 = Mathf.sin(walk + 90 + offsetsB[l], 6, 16);
			ft2 = Mathf.sin(walk + 45 + offsetsB[l], 6, -26);
			ft3 = Mathf.sin(walk + offsetsB[l], 6, 21);
			rots = [ft1 + -60, ft2 + -45, ft3 + 80];
			
			lib.legRenderer("advancecontent-strider-leg", this.x + vec.x, this.y + vec.y, this.baseRotation + 180, 3, rots, lens, Mathf.signs[l]);
		};
		
		Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
		
		for(var a = 0; a < 2; a++){
			var sign = Mathf.signs[a];
			
			var tra = this.rotation - 90;
			var trY = -this.type.weapon.getRecoil(this, sign > 0) + this.type.weaponOffsetY;
			var w = -sign * this.type.weapon.region.getWidth() * Draw.scl;
			Draw.rect(this.type.weapon.region,
			this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY),
			this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY), w, this.type.weapon.region.getHeight() * Draw.scl, this.rotation - 90);
		};
		
		Draw.mixcol();
		Draw.color();
	}
}));

const strider = extendContent(UnitType, "strider", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.legRegion = Core.atlas.find("blank");
		this.baseRegion = Core.atlas.find(this.name + "-base");
	}
});

strider.localizedName = "Strider";
strider.description = "Multiple legs allows it to move faster";
strider.create(striderBase);
strider.weapon = striderWeap;
strider.health = 2200;
strider.mass = 5;
strider.hitsize = 26;
strider.speed = 0.33;
strider.drag = 0.5;
strider.range = 80;
strider.maxVelocity = 0.78;
strider.shootCone = 30;
strider.rotatespeed = 0.06;
strider.baseRotateSpeed = 0.02;

const striderFac = extendContent(UnitFactory, "strider-factory", {});

striderFac.unitType = strider;