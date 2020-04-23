const primeColor = Color.valueOf("a3e3ff");

const changeTeamEffect = newEffect(15, e => {
	Draw.color(primeColor, Color.valueOf("a3e3ff00"), e.fin());
	Fill.square(e.x, e.y, e.rotation * Vars.tilesize / 2);
	
	Draw.blend(Blending.additive);
	Draw.color(primeColor, Color.valueOf("2857ff"), e.fin());
	Lines.stroke(e.fout() * 4);
	Lines.square(e.x, e.y, (e.rotation * Vars.tilesize / 2) * e.fin());
	Draw.blend();
});

const shipTrail = newEffect(39, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("59a7ff"), Color.valueOf("2857ff"), e.fin());
	Fill.circle(e.x, e.y, ((1 * e.fout()) * e.rotation) / 1.7);
	Draw.blend();
	
	//Draw.color(Color.valueOf("ffffff"));
	//Fill.circle(e.x, e.y, (1 * e.fout()) * (e.rotation / 1.3));
});

const strdustBullet = extend(BasicBulletType, {
	hitTile: function(b, tile){
		this.hit(b);
		if(tile.entity != null){
			if(tile.entity.health() < tile.entity.maxHealth() * 0.1){
				tile.setTeam(b.getTeam());
				if(tile.block() != null){
					Effects.effect(changeTeamEffect, tile.drawx(), tile.drawy(), tile.block().size);
				}
			};
			//print(tile.entity.health());
			//print(tile.entity.maxHealth() / 90)
		}
		//tile.setTeam(b.getTeam());
	},
	
	draw: function(b){
		/*Draw.color(primeColor);
		Lines.stroke(2);
		Lines.lineAngleCenter(b.x, b.y, b.rot(), 9);
		Draw.color(Color.white);
		Lines.lineAngleCenter(b.x, b.y, b.rot(), 4);
		Draw.reset();*/
		
		const lengthB = 8;
		const colors = [Color.valueOf("a3e3ff80"), Color.valueOf("a3e3ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.8, 0.6];
		const strokes = [1.13, 0.6, 0.28];
		const lenscales = [1.0, 1.61, 1.97];
		const tmpColor = new Color();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 3; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.5, 0.1)));
			for(var i = 0; i < 3; i++){
				Lines.stroke((3 + Mathf.absin(Time.time(), 3.2, 1)) * strokes[s] * tscales[i]);
				Tmp.v1.trns(b.rot() + 180, lengthB * lenscales[i] / 2);
				//Lines.lineAngleCenter(b.x, b.y, b.rot(), 5 * lenscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), lengthB * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});
strdustBullet.speed = 8;
strdustBullet.damage = 12;
strdustBullet.lifetime = 24;
strdustBullet.splashDamageRadius = 20;
strdustBullet.splashDamage = 8;
strdustBullet.hitSize = 8;
strdustBullet.bulletWidth = 7;
strdustBullet.bulletHeight = 9;
strdustBullet.bulletShrink = 0;
strdustBullet.keepVelocity = true;

const strdustWeapon = extendContent(Weapon, "stardust", {
	load: function(){
		this.region = Core.atlas.find("advancecontent-stardust-equip");
	}
});

strdustWeapon.reload = 15;
strdustWeapon.alternate = true;
strdustWeapon.length = 9;
strdustWeapon.width = 8.5;
strdustWeapon.recoil = 1.4;
strdustWeapon.bullet = strdustBullet;
strdustWeapon.shootSound = Sounds.missile;
strdustWeapon.minPlayerDist = 35;

const strdust = extendContent(Mech, "stardust-corruptor", {
	
	load: function(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.legRegion = Core.atlas.find(this.name + "-leg");
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.lightRegion = Core.atlas.find(this.name + "-lights");
	},
	
	updateAlt: function(player){
		const vectA = new Vec2();
		const shift = Mathf.clamp(player.velocity().len(), 0, 2);
		
		for(var i = 0; i < 2; i++){
			const size = (this.engineSize * 1.5) * player.boostHeat;
			var sn = Mathf.signs[i];
			vectA.trns(player.rotation - 90, 9.5 * sn, -3.75 + (shift * 2));
			Effects.effect(shipTrail, player.x + vectA.x, player.y + vectA.y, (size + Mathf.absin(Time.time(), 2, size / 4)) / 2);
		};
		vectA.trns(player.rotation + 90, 0, this.engineOffset - (shift * 2));
		Effects.effect(shipTrail, player.x + vectA.x, player.y + vectA.y, (size + Mathf.absin(Time.time(), 2, size / 4)) / 2);
	},
	
	draw: function(player){
		const vectA = new Vec2();
		const health = player.healthf();
		for(var i = 0; i < 2; i++){
			const size = (this.engineSize * 1.5) * player.boostHeat;
			const sizeB = (size + Mathf.absin(Time.time(), 2, size / 4)) / 2;
			const shift = Mathf.clamp(player.velocity().len(), 0, 2);
			var sn = Mathf.signs[i];
			vectA.trns(player.rotation - 90, 9.5 * sn, -3.75);
			
			Draw.color(primeColor);
			Fill.circle(player.x + vectA.x, player.y + vectA.y, sizeB);
	
			vectA.trns(player.rotation - 90, 9.5 * sn, -3.75 + (shift / 1.5));
			Draw.color(Color.valueOf("ffffff"));
			Fill.circle(player.x + vectA.x, player.y + vectA.y, sizeB / 1.7);
		};
		
		Draw.color(Color.black, Color.white, health + Mathf.absin(Time.time(), health * 5.0, 1.0 - health));
		Draw.blend(Blending.additive);
		Draw.rect(this.lightRegion, player.x, player.y, player.rotation - 90);
		Draw.blend();
		Draw.reset();
	}
});

strdust.flying = false;
strdust.health = 470;
strdust.speed = 0.28;
strdust.boostSpeed = 0.7;
strdust.mass = 5;
strdust.drillPower = 4;
strdust.shake = 4.5;
strdust.hitsize = 23;
strdust.weapon = strdustWeapon;
strdust.weaponOffsetX = 8.5;
strdust.weaponOffsetY = 6;
strdust.engineColor = primeColor;
strdust.engineOffset = 9;
strdust.engineSize = 5;
strdust.mineSpeed = 1.7;
strdust.buildPower = 1.6;
strdust.itemCapacity = 80;
strdust.localizedName = "Stardust Corruptor";
strdust.description = "Shoots a bullet that turns weakened enemy blocks into your team.";

const strdustPad = extendContent(MechPad, "stardust-corruptor-mech-pad", {});

strdustPad.mech = strdust;
strdustPad.buildTime = 1;
strdustPad.buildTime = 700;