const lib = require("funclib");
const elib = require("effectlib");

const healEffectB = elib.newEffectWDraw(7, 240, e => {
	if(e.data[0] != null && e.data[1] != null){
		var x1 = e.data[0].x;
		var y1 = e.data[0].y;
		var x2 = e.data[1].x;
		var y2 = e.data[1].y;
		const laser = Core.atlas.find("laser");
		const laserEnd = Core.atlas.find("laser-end");
	
		Draw.color(Color.valueOf("e8ffd7"));
		Drawf.laser(laser, laserEnd, x1, y1, x2, y2);
		Draw.color();
	}
});

const healEffect = (a, b, heal) => {
	if(a == null || b == null) return;
	
	b.healBy(Math.min(b.maxHealth() * heal, 25));
	
	var data = [a, b];
	
	Effects.effect(healEffectB, a.x, a.y, 0, data);
};

const healerWeap = extendContent(Weapon, "healer-equip", {});

healerWeap.reload = 15;
healerWeap.alternate = true;
healerWeap.length = 4;
healerWeap.width = 5;
healerWeap.ignoreRotation = false;
healerWeap.bullet = Bullets.standardCopper;

/*const healerBase = prov(() => new JavaAdapter(RepairDrone, {
	shouldRotate(){
		//return target != null;
		if(this.target != null){
			return this.target.healthf() < 1;
		}
	},
	
	getStartState(){
		print("aaaaaa");
		
		return new UnitState({
			entered: function(){
				this.target = null;
			},
		
			update: function(){
				if(this.retarget()){
					this.target = lib.findDamagedAlly(this.getTeam(), this.x, this.y, Number.MAX_VALUE, boolf(e => e.getID() != this.getID()));
					
					print("retarget");
				};
			
				if(this.target != null && this.target instanceof BaseUnit){
					print("fffff");
					if(this.target.healthf() < 1 && Mathf.within(this.x, this.y, this.target.x, this.target.y, this.getType().range)){
						if(this.getTimer().get(3, 5)){
							healEffect(this, this.target, 0.2);
						};
						//this.moveTo(this.getType().range * 0.8);
						this.circle(this.getType().range * 0.84);
						//this.rotation
					}else{
						this.circle(this.getType().range * 0.6, this.getType().speed * 0.5);
						//this.moveTo(this.getType().range * 0.55);
					};
				}
			}
		});
		
		//print("aaaaaa");
		
		//return heal;
	}
}));*/

const healerBase = prov(() => {
	//new JavaAdapter(RepairDrone, {});
	b = extend(RepairDrone, {
		/*behavior(){
			if(this.health <= this.maxHealth() * this.type.retreatPercent && !this.state.is(this.retreat) && Geometry.findClosest(this.x, this.y, Vars.indexer.getAllied(this.team, BlockFlag.repair)) != null){
				this.setState(this.retreat);
			}else{
				//altAI(this);
				this.healAI.update();
			}
		},*/
		
		update(){
			this.super$update();

			if(!this.state.is(this.retreat)) this.altAI();
		},
		
		/*countsAsEnemy(){
			return true;
		},*/
		
		altAI(){
			if(this.retarget() && !this.state.is(this.retreat)){
				//var out = lib.findDamagedAlly(this.getTeam(), this.x, this.y, Number.MAX_VALUE, boolf(e => e != this));
				this.target = lib.findDamagedAlly(this.getTeam(), this.x, this.y, 99999, boolf(e => e != this && !e.isDead() && ((e instanceof BaseUnit && (e.getType() != this.getType() || e.healthf() < 1)) || e instanceof Player)));
				//var target1 = Units.closest(this.getTeam(), this.x, this.y, 99999, boolf(e => e != this && !e.isDead()));
				//target1 = Units.closest(this.getTeam(), this.x, this.y, 99999, boolf(e => e != this && e.healthf() < target1.healthf()));
				
				//this.target = target1;
				//print(this.target);
			};
			
			if(this.target != null && this.target instanceof Unit){
				if(this.target.healthf() < 1 && Mathf.within(this.x, this.y, this.target.x, this.target.y, this.getType().range)){
					//this.circle(this.getType().range * 0.75, this.getType().speed);
					const tmpVec = new Vec2();
					
					if(this.target instanceof BaseUnit){
						tmpVec.trns(this.target.rotation + 180, Math.min(Math.max(this.target.getType().hitsize * 1.5, this.getType().range * 0.6), this.getType().range * 0.85));
					}else{
						tmpVec.trns(this.target.rotation + 180, Math.min(Math.max(this.target.mech.hitsize * 1.5, this.getType().range * 0.6), this.getType().range * 0.85));
					};
					
					var angle = Angles.angle(this.x, this.y, this.target.x + tmpVec.x, this.target.y + tmpVec.y);
					var dst = Mathf.clamp(Mathf.dst(this.x, this.y, this.target.x + tmpVec.x, this.target.y + tmpVec.y) / 3, 0, this.getType().speed / 2);
					
					tmpVec.trns(angle, dst);
					
					this.velocity().add(tmpVec);
					
					if(this.getTimer().get(4, 5)){
						healEffect(this, this.target, 0.02);
					};
					
					//this.rotation
				}else if(Mathf.within(this.x, this.y, this.target.x, this.target.y, this.getType().range * 0.55)){
					this.circle(this.getType().range * 0.5, this.getType().speed * 0.05);
					//print("close");
				}else{
					//print("follow");
					var dst = (Mathf.dst(this.x, this.y, this.target.x, this.target.y) / 90) - ((this.getType().range * 0.5) / 90);
					//print(dst);
					var dst2 = Mathf.clamp(dst, 0, 5);
					this.circle(this.getType().range * 0.5, this.getType().speed * (0.05 + dst2));
				}
			}
		},
		
		updateTargeting(){
			if(this.target == null || (this.target instanceof Unit && (this.target.isDead() || this.target.getTeam() != this.team)) || this.target instanceof TileEntity){
				this.target = null;
			}
		},
		
		getTarget(){
			return this.target;
		},
		
		setTarget(a){
			this.target = a;
		},
		
		shouldRotate(){
			//return target != null;
			if(this.target != null){
				return this.target.healthf() < 1;
			};
			return false;
		},
		
		getStartState(){
			//this.target = null;
			//this.healAI.entered();
			
			return this.healAI;
			//print(this.healAI);
		}
	});
	
	//b.timer = new Interval(6);
	b.healAI = new UnitState({
		entered: function(){
			//b.setTarget(null);
			//print("entered");
		},
		
		update: function(){
			//print("update");
			
			/*if(b.retarget()){
				var out = lib.findDamagedAlly(b.getTeam(), b.x, b.y, Number.MAX_VALUE, boolf(e => e.getID() != b.getID()));
				b.setTarget(out);
			};
			
			if(b.getTarget() != null && b.getTarget() instanceof BaseUnit){
				if(b.getTarget().healthf() < 1 && Mathf.within(b.x, b.y, b.getTarget().x, b.getTarget().y, b.getType().range)){
					if(b.getTimer().get(4, 5)){
						healEffect(b, b.getTarget(), 0.2);
					};
					b.circleB(b.getType().range * 0.84, b.getType().speed);
					//b.rotation
				}else{
					b.circleB(b.getType().range * 0.6, b.getType().speed * 0.5);
				};
			}*/
		},
		
		exited: function(){
			//b.setTarget(null);
		}
	});
	
	return b;
});

const healer = extendContent(UnitType, "angel", {});

healer.localizedName = "AC Angel";
healer.create(healerBase);
healer.weapon = healerWeap;
healer.engineSize = 2.2;
healer.engineOffset = 7.4;
//to prevent a crash
healer.retreatPercent = 0;
//healer.rotateWeapon = true;
healer.flying = true;
healer.health = 130;
healer.mass = 2;
healer.hitsize = 7;
healer.speed = 0.36;
healer.drag = 0.02;
healer.attackLength = 180;
healer.range = 110;
healer.maxVelocity = 4.9;
healer.shootCone = 45;
healer.rotatespeed = 0.01;
healer.baseRotateSpeed = 0.04;

const healerFac = extendContent(UnitFactory, "angel-factory", {});

healerFac.unitType = healer;