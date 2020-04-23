const synthUp = newEffect(15, e => {
	Draw.color(Color.valueOf("a9d8ff"));
	Fill.poly(e.x, e.y, 6, e.fout() * 5);
});

const synthPros = newEffect(15, e => {
	Draw.alpha(1);
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("ffffff"), e.fin());
	Fill.poly(e.x, e.y, 6, e.fout() * 15);
	
	Draw.alpha(1);
	Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("4787ff"), e.fin());
	Lines.stroke(e.fout() * 3);
	Lines.poly(e.x, e.y, 6, e.fin() * 15);
});

const synth = extendContent(GenericCrafter, "alloy-synth", {});

synth.craftEffect = synthPros;
synth.updateEffect = synthUp;