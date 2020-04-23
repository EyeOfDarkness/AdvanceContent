const falloutlaser = extend(BasicBulletType, {
	
	update: function(b){
		Effects.shake(1.2, 1.2, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 290.0, true);
		}
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effects.effect(this.hitEffect, Color.valueOf("ec7458aa"), hitx, hity);
			if(Mathf.chance(0.1)){
				//Fire.create(world.tileWorld(hitx + Mathf.range(6.0), hity + Mathf.range(6.0)));
				Damage.createIncend(hitx, hity, 6, 1);
			}
		}
	},
	
	draw: function(b){
		
		/*Draw.color(Color.valueOf("ec7458"));
		Lines.stroke((9 + Mathf.absin(Time.time(), 0.8, 1.5)) * b.fout() * 3.2 * 1.0);
		Lines.lineAngle(b.x, b.y, b.rot(), 310.0 * b.fout());
		Draw.reset();*/
		const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.28];
		const strokes = [2.9, 2.1, 1.4, 0.7];
		const lenscales = [1.0, 1.12, 1.15, 1.159];
		const tmpColor = new Color();
		//const baseLen = 310.0 * b.fout();

		//Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 4; s++){
			//Draw.color(colors[s]);
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.0, 0.2)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180.0, (lenscales[i] - 0.9) * 35.0);
				Lines.stroke((9 + Mathf.absin(Time.time(), 1.4, 1.5)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), 280.0 * b.fout() * lenscales[i], CapStyle.none);
			}
		};
		Draw.reset();
	}
});

falloutlaser.speed = 0.001;
falloutlaser.damage = 85;
falloutlaser.lifetime = 18;
falloutlaser.hitEffect = Fx.hitMeltdown;
falloutlaser.despawnEffect = Fx.none;
falloutlaser.hitSize = 5;
falloutlaser.drawSize = 610;
falloutlaser.pierce = true;
falloutlaser.shootEffect = Fx.none;
falloutlaser.smokeEffect = Fx.none;

/*const falloutLiquid = new Boolf({get: function(liquid){
	liquid.temperature <= 0.5 && liquid.flammability < 0.05
}});*/

const fallout = extendContent(LaserTurret, "fallout",{
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-5"),
		Core.atlas.find("advancecontent-fallout")
	];},
	
	draw: function(tile){
		Draw.rect(Core.atlas.find("advancecontent-block-5"), tile.drawx(), tile.drawy())
	}
});
fallout.shootType = falloutlaser;
fallout.update = true;
/*fallout.hasLiquid = true;
fallout.consumes.add(new ConsumeLiquidFilter(falloutLiquid, 0.53), 0.53).update(false);*/
//fallout.firingMoveFract = 0.6;
//fallout.shootDuration = 270.0;