const vec1 = new Vec2();
const vec2 = new Vec2();
const tPos = new Vec2();
const tRect = new Rect();
const hRect = new Rect();
const queue = new Packages.arc.struct.Array();
const sortedQueue = new Packages.arc.struct.Array();

// function library made by Eye of darkness, please dont claim that you made this script.
module.exports = {
	predictAlt(entity, offsetVec, other, bulletSpeed, inheritVelocity){
		var ex = entity.getX() + offsetVec.x;
		var ey = entity.getY() + offsetVec.y;
		
		var dstA = Mathf.dst(ex, ey, other.getX(), other.getY());
		var calc = dstA / bulletSpeed;
		
		vec1.set(other.getTargetVelocityX(), other.getTargetVelocityY());
		if(other instanceof SolidEntity) vec1.set(other.velocity());
		if(inheritVelocity){
			if(entity instanceof SolidEntity){
				vec1.sub(other.velocity());
			}else{
				vec1.sub(entity.getTargetVelocityX(), entity.getTargetVelocityY());
			}
		};
		vec1.scl(calc);
		vec1.add(other.getX(), other.getY());
		
		return vec1.cpy();
	},
	collideLineHealth(bullet, x, y, angle, length, health, effectInsulated){
		vec1.trns(angle, length);
		vec1.add(x, y);
		sortedQueue.clear();
		queue.clear();
		var healthB = health;
		
		Vars.world.raycastEachWorld(x, y, vec1.x, vec1.y, new World.Raycaster({
			accept: (ax, ay) => {
				//collider.get(ax, ay);
				var tile = Vars.world.ltile(ax, ay);
				if(tile != null && tile.ent() != null && tile.getTeamID() != bullet.team.id && tile.ent().collide(bullet) && !queue.contains(tile.ent())){
					//healthB -= tile.ent().health();
					queue.add(tile.ent());
				};
				
				return false;
			}
		}));
		
		tRect.setPosition(x, y).setSize(vec1.x - x, vec1.y - y);
		
		if(tRect.width < 0){
			tRect.x += tRect.width;
			tRect.width *= -1;
		};

		if(tRect.height < 0){
			tRect.y += tRect.height;
			tRect.height *= -1;
		};
		
		var expand = 3;

		tRect.y -= expand;
		tRect.x -= expand;
		tRect.width += expand * 2;
		tRect.height += expand * 2;
		
		var conss = cons(e => {
			expand = 3;
			
			e.hitbox(hRect);
			hRect.x -= expand;
			hRect.y -= expand;
			hRect.width += expand * 2;
			hRect.height += expand * 2;
			
			var vec = Geometry.raycastRect(x, y, vec1.x, vec1.y, hRect);
			
			if(vec != null){
				queue.add(e);
			}
		});
		
		Units.nearbyEnemies(bullet.getTeam(), tRect, conss);
		
		var bool = true;
		
		while(bool){
			var closest = null;
			var cdist = 0;
			
			queue.each(cons(item => {
				if(item != null){
					var dst = item.dst(x, y);
					
					if(closest == null || dst < cdist){
						closest = item;
						cdist = dst;
					}
				}
			}));
			
			if(closest != null){
				sortedQueue.add(closest);
				queue.remove(closest);
			};
			
			bool = queue.size > 0;
		};
		var last;
		sortedQueue.each(cons(item => {
			if(healthB > 0){
				last = vec1.set(item.getX(), item.getY()).cpy();
				//healthB -= item.health();
				if(item instanceof TileEntity && item.block != null && item.block.insulated && effectInsulated){
					healthB = 0;
				};
				healthB -= item.health();
			}
		}));
		return last;
	},
	
	loadImmunities(unit){
		var statuses = Vars.content.getBy(ContentType.status);
		statuses.each(cons(stat => {
			if(stat != null){
				unit.immunities.add(stat);
			}
		}));
	},
	
	findDamagedAlly(team, x, y, range, boolff){
		if(team == Team.derelict) return null;
		
		var result = null;
		var health = 0;
		var cdist = 0;
		
		Units.nearby(team, x, y, range, cons(e => {
			if(!boolff.get(e)) return;
			
			var dst2 = Mathf.dst2(e.x, e.y, x, y);
			var healthB = e.healthf();
			
			if(result == null || healthB < health || dst2 < cdist){
				result = e;
				//cdist = dst2;
				health = healthB;
				
				if(!(healthB < 1)){
					cdist = dst2;
				}else{
					cdist = 0;
				}
			}
		}));
		
		return result;
	},
	
	nearestBullet(team, x, y, range, boolf){
		if(team == Team.derelict) return null;
		
		var result = null;
		var cdist = 0;
		
		Vars.bulletGroup.intersect(x - range, y - range, range * 2, range * 2, cons(b => {
			if(!boolf.get(b)) return;
			
			var dst2 = Mathf.dst2(b.x, b.y, x, y);
			
			if(dst2 < range * range && (result == null || dst2 < cdist) && team != b.getTeam()){
				if(!Vars.android){
					result = new TargetTrait({
						isDead: function(){return b == null},
						getTeam: function(){return b.getTeam()},
						getX: function(){return b.x},
						getY: function(){return b.y},
						setX: function(x){b.x = x},
						setY: function(y){b.y = y},
						velocity: function(){return b.velocity()}
					});
				}else{
					result = new TargetTrait({
						isDead: function(){return b == null},
						getTeam: function(){return b.getTeam()},
						getX: function(){return b.x},
						getY: function(){return b.y},
						setX: function(x){b.x = x},
						setY: function(y){b.y = y},
						velocity: function(){return b.velocity()},
						//override defaults
						getTargetVelocityX: function(){return b.velocity().x},
						getTargetVelocityY: function(){return b.velocity().y}
					});
				}
				cdist = dst2;
			}
		}));
		
		return result;
	},
	
	invalidateExperimental(target, team, x, y, range){
		if(target != null){
			return (range != Number.MAX_VALUE && !target.withinDst(x, y, range)) || target.getTeam() == team || !target.isValid();
		}else{
			return true;
		}
	},
	
	invalidateAlly(target, team, x, y, range){
		return target == null || (range != Number.MAX_VALUE && !target.withinDst(x, y, range)) || target.getTeam() != team || !target.isValid();
	},
	
	tentacleRenderer(texture, x, y, rotation, segments, length, startingLength, moveScale, moveMag, moveMagOffset, timingOffset, timeOffset) {
		const segLength = length;
		const segTimeOffset = timingOffset;
		const segDegree = moveMag;
		const segDegreeOffset = moveMagOffset;
		const segFrequency = moveScale;
			
		//const vec1 = new Vec2();
		//const vec2 = new Vec2();
		//const tPos = new Vec2();
			
		tPos.trns(rotation - 90, 0, startingLength);
		vec2.trns(rotation - 90, 0, startingLength);
		for(var i = 0; i < segments; i++){
			var sine = Mathf.sin(Time.time() + (i * segTimeOffset) + timeOffset, segFrequency, segDegree + (i * segDegreeOffset));
			var tex = Core.atlas.find(texture + "-" + i);
			
			vec1.set(tPos.x, tPos.y);
		
			Draw.rect(tex, x + vec1.x, y + vec1.y, rotation + 90 + sine);
			
			tPos.set(vec2.trns(rotation + sine, segLength)).add(vec1.x, vec1.y);
		};
	},
	
	lineTentacleRenderer(x, y, rotation, stroke, strokeOffset, segments, length, startingLength, moveScale, moveMag, moveMagOffset, timingOffset, timeOffset) {
		const segLength = length;
		const segTimeOffset = timingOffset;
		const segDegree = moveMag;
		const segDegreeOffset = moveMagOffset;
		const segFrequency = moveScale;
			
		//const vec1 = new Vec2();
		//const vec2 = new Vec2();
		//const tPos = new Vec2();
			
		tPos.trns(rotation - 90, 0, startingLength);
		vec2.trns(rotation - 90, 0, startingLength);
		for(var i = 0; i < segments; i++){
			var sine = Mathf.sin(Time.time() + (i * segTimeOffset) + timeOffset, segFrequency, segDegree + (i * segDegreeOffset));
			//var tex = Core.atlas.find(texture + i);
				
			vec1.set(tPos.x, tPos.y);
		
			tPos.set(vec2.trns(rotation + sine, segLength)).add(vec1.x, vec1.y);
			Lines.stroke(stroke / (strokeOffset * i + 1));
			Lines.line(x + vec1.x, y + vec1.y, x + tPos.x, y + tPos.y);
		};
	},
	
	legRenderer(texture, x, y, defaultRotation, segments, rotations, lengths, left) {
		//const vec1 = new Vec2();
		//const vec2 = new Vec2();
		//const tPos = new Vec2();
		
		var lastRot = defaultRotation;
		
		tPos.trns(defaultRotation - 90, 0, 0);
		for(var i = 0; i < segments; i++){
			var region = Core.atlas.find(texture + "-" + i);
			
			vec1.set(tPos.x, tPos.y);
			
			Draw.rect(region, x + vec1.x, y + vec1.y, (region.getWidth() * left) * Draw.scl, region.getHeight() * Draw.scl, lastRot - 90 + (rotations[i] * left));
			
			tPos.set(vec2.trns((rotations[i] * left) + lastRot, lengths[i])).add(vec1.x, vec1.y);
			
			//print("{" + rotations + "}" + "{" + lengths + "}");
			lastRot = Angles.angle(vec1.x, vec1.y, tPos.x, tPos.y);
		};
		
		//print("{" + rotations + "}" + "{" + lengths + "}");
	}
};