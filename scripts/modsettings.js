var customSpriteBatch = false;
var animatedSprite = false;
if(Vars.mobile){
	customSpriteBatch = false;
};

module.exports = {
	settingCustomSpriteBatch(){
		return customSpriteBatch;
	},
	
	settingAnimatedSprite(){
		return animatedSprite;
	}
};