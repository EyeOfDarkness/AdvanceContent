const aAWall = extendContent(Wall, "advance-alloy-wall-large", {
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.lightningChance)){
			Lightning.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}
	}
});

aAWall.lightningChance = 0.1;
aAWall.lightningDamage = 17;
aAWall.lightningLength = 15;

const aAWallSmall = extendContent(Wall, "advance-alloy-wall", {
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.lightningChance)){
			Lightning.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}
	}
});

aAWallSmall.lightningChance = 0.1;
aAWallSmall.lightningDamage = 19;
aAWallSmall.lightningLength = 13;