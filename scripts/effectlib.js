module.exports = {
	newEffectWDraw(lifetime, drawDst, renderer){
		return new Effects.Effect(lifetime, drawDst, new Effects.EffectRenderer({render: renderer}));
	},
	
	newGroundEffect(lifetime, staticLife, renderer){
		return new GroundEffectEntity.GroundEffect(lifetime, staticLife, new Effects.EffectRenderer({render: renderer}));
	}
}