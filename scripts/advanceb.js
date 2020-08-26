const healEffectAA = newEffect(20, e => {
	Draw.color(Pal.lancerLaser);
	Draw.alpha(e.fout());
	Fill.square(e.x, e.y, e.rotation * Vars.tilesize / 2);
});
const upgradeEffectAA = newEffect(50, e => {
	Draw.color(Pal.lancerLaser);
	//Draw.alpha(e.fout());
	//Fill.square(e.x, e.y, e.rotation * Vars.tilesize / 2);
	Lines.stroke((1.7 * e.fout()) + 0.5);
	Lines.square(e.x, e.y, e.finpow() * e.rotation * Vars.tilesize / 2);
});
const levelUpTime = 60 * 60 * 3;
const maxLevel = 8;
const activeWallEntity = prov(() => {
	activeWallEntityB = extend(TileEntity, {
		added(){
			this.super$added();
		},
		maxHealth(){
			return this.block.health + ((this.getLevel() * 410) * (this.block.size * this.block.size));
		},
		setProgress(a){
			this._levelUpProgress = a;
		},
		getProgress(){
			return this._levelUpProgress;
		},
		setLevel(a){
			this._healthLevel = Math.min(a, maxLevel);
		},
		getLevel(){
			return this._healthLevel;
		},
		write(stream){
			this.super$write(stream);
			stream.writeByte(this._healthLevel);
			stream.writeShort(this._levelUpProgress);
		},
		read(stream, revision){
			this.super$read(stream, revision);
			this._healthLevel = stream.readByte();
			this._levelUpProgress = stream.readShort();
		}
	});
	activeWallEntityB.setProgress(0);
	activeWallEntityB.setLevel(0);
	return activeWallEntityB;
});

const aaAWall = extendContent(Wall, "active-advance-wall-large", {
	load(){
		this.super$load();
		this.chargeRegion = Core.atlas.find(this.name + "-charge");
	},
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.lightningChance)){
			Lightning.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}
	},
	update(tile){
		//print("a");
		entity = tile.ent();
		if(!(entity.getLevel() >= maxLevel)) entity.setProgress(entity.getProgress() + Time.delta());
		//print(entity + ":" + entity.getLevel() + ":" + entity.getProgress());
		if(entity.getProgress() > levelUpTime){
			entity.setLevel(entity.getLevel() + 1);
			//print(entity + ":" + entity.getLevel());
			Effects.effect(upgradeEffectAA, tile.drawx(), tile.drawy(), this.size);
			entity.setProgress(0);
		};
		if(entity.timer.get(this.healTimer, 120) && entity.health() < entity.maxHealth() - 0.0001){
			entity.healBy(entity.maxHealth() * 0.03);
			Effects.effect(healEffectAA, tile.drawx(), tile.drawy(), this.size);
		}
	},
	draw(tile){
		this.super$draw(tile);
		entity = tile.ent();
		
		Draw.alpha(entity.getProgress() / levelUpTime);
		Draw.rect(this.chargeRegion, tile.drawx(), tile.drawy());
		Draw.color();
	}
});

aaAWall.healTimer = aaAWall.timers++;
//aaAWall.extraHealthTimer = aaAWall.timers++;
aaAWall.lightningChance = 0.2;
aaAWall.lightningDamage = 21;
aaAWall.lightningLength = 15;
aaAWall.entityType = activeWallEntity;

const aaAWallSmall = extendContent(Wall, "active-advance-wall", {
	load(){
		this.super$load();
		this.chargeRegion = Core.atlas.find(this.name + "-charge");
	},
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.lightningChance)){
			Lightning.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}
	},
	update(tile){
		entity = tile.ent();
		if(!(entity.getLevel() >= maxLevel)) entity.setProgress(entity.getProgress() + Time.delta());
		//print(entity + ":" + entity.getLevel() + ":" + entity.getProgress());
		if(entity.getProgress() > levelUpTime){
			entity.setLevel(entity.getLevel() + 1);
			//print(entity + ":" + entity.getLevel());
			Effects.effect(upgradeEffectAA, tile.drawx(), tile.drawy(), this.size);
			entity.setProgress(0);
		};
		if(entity.timer.get(this.healTimer, 120) && entity.health() < entity.maxHealth() - 0.0001){
			entity.healBy(entity.maxHealth() * 0.02);
			Effects.effect(healEffectAA, tile.drawx(), tile.drawy(), this.size);
		}
	},
	draw(tile){
		this.super$draw(tile);
		entity = tile.ent();
		
		Draw.alpha(entity.getProgress() / levelUpTime);
		Draw.rect(this.chargeRegion, tile.drawx(), tile.drawy());
		Draw.color();
	}
});

aaAWallSmall.healTimer = aaAWallSmall.timers++;
//aaAWallSmall.extraHealthTimer = aaAWallSmall.timers++;
aaAWallSmall.lightningChance = 0.2;
aaAWallSmall.lightningDamage = 23;
aaAWallSmall.lightningLength = 13;
aaAWallSmall.entityType = activeWallEntity;