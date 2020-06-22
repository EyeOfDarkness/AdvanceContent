const settingLib = require("modsettings");

//anuke limited blending so i thought it would be a good idea to extend sprite batch.
const forceSpriteBatch = extend(SpriteBatch, {
	flush(){
		if(this.idx == 0) return;
		
		this.renderCalls = 0;
		
		this.getShader().bind();
		this.setupMatrices();

		if(this.customShader != null && this.apply){
			this.customShader.apply();
		}

		this.renderCalls++;
		this.totalRenderCalls++;
		var spritesInBatch = this.idx / 24;
		if(spritesInBatch > this.maxSpritesInBatch) this.maxSpritesInBatch = spritesInBatch;
		var count = spritesInBatch * 6;
		
		if(!this.forceNonBlendingEnum){
			if(this.blending != Blending.disabled){
				Gl.enable(Gl.blend);
				Gl.blendFuncSeparate(this.blending.src, this.blending.dst, this.blending.src, this.blending.dst);
			}else{
				Gl.disable(Gl.blend);
			};
		}else{
			if(this.blendingSrc != null && this.blendingDst != null){
				Gl.enable(Gl.blend);
				Gl.blendFuncSeparate(this.blendingSrc, this.blendingDst, this.blendingSrc, this.blendingDst);
			}
		};

		this.lastTexture.bind();
		var meshb = this.mesh;
		meshb.setVertices(this.vertices, 0, this.idx);
		meshb.getIndicesBuffer().position(0);
		meshb.getIndicesBuffer().limit(count);
		meshb.render(this.getShader(), Gl.triangles, 0, count);

		this.idx = 0;
	},
	
	getShader(){
        if(this.customShader == null){
            return this.shader;
        }
        return this.customShader;
    },
	
	setColor(tint){
		this.color.set(tint);
		this.colorPacked = tint.toFloatBits();
		//this.setColorAlt(tint, 0, 0, 0);
	},

	setColor(r, g, b, a){
		this.color.set(r, g, b, a);
		this.colorPacked = color.toFloatBits();
		//this.setColorAlt(r, g, b, a);
	},
	
	/*setColorAlt(r, g, b, a){
		if(r instanceof Color){
			this.color.set(r);
			this.colorPacked = r.toFloatBits();
		}else{
			this.color.set(r, g, b, a);
			this.colorPacked = color.toFloatBits();
		}
	},*/
	
	setupMatrices(){
		this.combinedMatrix.set(this.projectionMatrix).mul(this.transformMatrix);
		this.getShader().setUniformMatrix4("u_projTrans", BatchShader.copyTransform(this.combinedMatrix));
		this.getShader().setUniformi("u_texture", 0);
	},
	
	setPackedColor(packedColor){
		this.color.abgr8888(packedColor);
		this.colorPacked = packedColor;
	},
	
	setMixColor(tint){
		//this.setMixColorAlt(r, 0, 0, 0);
		this.mixColor.set(tint);
		this.mixColorPacked = tint.toFloatBits();
	},

	setMixColor(r, g, b, a){
		//this.setMixColorAlt(r, g, b, a);
		this.mixColor.set(r, g, b, a);
		this.mixColorPacked = mixColor.toFloatBits();
	},
	
	/*setMixColorAlt(r, g, b, a){
		if(r instanceof Color){
			this.mixColor.set(r);
			this.mixColorPacked = r.toFloatBits();
		}else{
			this.mixColor.set(r, g, b, a);
			this.mixColorPacked = mixColor.toFloatBits();
		}
	},*/
	
	setPackedMixColor(packedColor){
		this.mixColor.abgr8888(packedColor);
		this.mixColorPacked = packedColor;
	},
	
	getProjection(){
		return this.projectionMatrix;
	},

	getTransform(){
		return this.transformMatrix;
	},

	setProjection(projection){
		this.flush();
		this.projectionMatrix.set(projection);
	},

	setTransform(transform){
		this.flush();
		this.transformMatrix.set(transform);
	},
	
	setShader(shader, applyb){
		//this.altSetShader(shader, applyb);
		this.flush();
		this.customShader = shader;
		this.apply = applyb;
	},
	
	setShader(shader){
		this.setShader(shader, true);
	},
	
	/*altSetShader(shader, applyB){
		this.flush();
		this.customShader = shader;
		this.apply = applyb;
	},*/
	
	setBlending(blendingb){
		this.flush();
		this.forceNonBlendingEnum = false;
		this.blending = blendingb;
	},
	
	setCustomBlending(src, dst){
		this.flush();
		this.forceNonBlendingEnum = true;
		this.blendingSrc = src;
		this.blendingDst = dst;
	},
	
	customBool(apply){
		this.forceNonBlendingEnum = apply;
	}
});
forceSpriteBatch.forceNonBlendingEnum = false;
forceSpriteBatch.blendingSrc = null;
forceSpriteBatch.blendingDst = null;
if(settingLib.settingCustomSpriteBatch()){
	Core.batch = forceSpriteBatch;
};
//print("AdvanceContent Custom SpriteBatch is used: " + forceSpriteBatch == Core.batch);

var isBatch = () => Core.batch == forceSpriteBatch;

module.exports = {
	blendingCustom(src, dst){
		if(isBatch()){
			Core.batch.setCustomBlending(src, dst);
		}
	},
	
	blendReset(){
		if(isBatch()){
			Core.batch.setCustomBlending(Gl.srcAlpha, Gl.oneMinusSrcAlpha);
			Core.batch.customBool(false);
		}
	},
	
	isCustomBatch(){
		return isBatch();
	},
	
	getCustomBatch(){
		return forceSpriteBatch;
	}
};