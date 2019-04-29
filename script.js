var unit;
var ingridientArray;

function quartsToMilliliters(qt){
	return qt * 946.352946;
}

function quartsToLiters(qt){
	return qt * 0.946353;
}

function litersToQuarts(l){
	return l * 1.056688;
}

function litersToMilliliters(l){
	return l * 1000;
}

function millilitersToQuarts(ml){
	return ml * 0.0010567;
}

function milillitersToLiters(ml){
	return ml * 0.001;
}

function cupsToTbsps(c){
	return c * 16;
}

function tbspsToCups(tbsp){
	return tbsp / 16;
}

function bricksToKilograms(b){
	return 0.65 * b;
}

function kilogramsToBricks(kg){
	return kg / 0.65;
}

function bricksToGrams(b){
	return b * 650;
}

function gramsToBricks(g){
	return g / 650;
}

function bricksToPounds(b){
	return b * 1.433005;
}

function poundsToBricks(lb){
	return lb / 1.433005;
}

function bricksToOunces(b){
	return b * 22.92808;
}

function ouncesToBricks(oz){
	return oz / 22.92808;
}

function gramsToKilograms(g){
	return g / 1000;
}

function gramsToOunces(g){
	return  g / 28.34952;
}

function gramsToPounds(g){
	return g  / 453.59237;
}

function kilogramsToGrams(kg){
	return kg * 1000;
}

function kilogramsToOunces(kg){
	return kg * 35.273962;
} 

function kilogramsToPounds(kg){
	return kg * 2.204623;
}

function ouncesToPounds(oz){
	return oz * 0.0625;
}

function ouncesToGrams(oz){
	return oz * 28.349523;
}

function ouncesToKilograms(oz){
	return oz * 0.02835;
}

function poundsToOunces(lb){
	return lb * 16;
}

function poundsToGrams(lb){
	return lb * 453.59237;
}

function poundsToKilograms(lb){
	return lb * 0.453592;
}

function bricksToQuarts(b){
	var y = 1 / b;
	var ml = 680 / y;
	return ml * 0.0010567;
}

function quartsToBricks(qt){
	var ml = qt * 946.352946;
	return ml / 680;
}

// to quarts of coir
function gramsToQuarts(g){
	var bricks = gramsToBricks(g);
	return bricksToQuarts(bricks);	
}

// to grams of coir
function quartsToGrams(qt){
	var bricks = quartsToBricks(qt);
	return bricksToGrams(bricks);
}

function kilogramsToQuarts(kg){
	var grams = kg * 1000;
	return gramsToQuarts(grams);
}

function quartsToKilograms(qt){
	var grams = quartsToGrams(qt);
	return grams / 1000;
}

function ouncesToQuarts(oz){
	return oz * 0.03125;
}

function quartsToOunces(qt){
	return qt * 32;
}

// function bricksToLiters(b){
// 	var y = 1 / b;
// 	return (680 / y) / 1000;
// }

// function litersToBricks(l){
// 	return (l * 1000) / 680;
// }

// function bricksToMilliliters(b){
// 	var y = 1 / b;
// 	return 680 / y;
// }

// function millilitersToBricks(ml){
// 	return ml / 680;
// }

var conversionFunctionsMap = {
	milliliter: {liter: milillitersToLiters, quart: millilitersToQuarts},
	liter: {milliliter: litersToMilliliters, quart: litersToQuarts},
	quart: {milliliter: quartsToMilliliters, liter: quartsToLiters, brick: quartsToBricks, gram: quartsToGrams, kilogram: quartsToKilograms, ounce: quartsToOunces},
	brick: {gram: bricksToGrams, kilogram: bricksToKilograms, ounce: bricksToOunces, pound: bricksToPounds, quart: bricksToQuarts},
	cup: {tbsp: cupsToTbsps},
	tbsp: {cup: tbspsToCups},
	gram: {kilogram: gramsToKilograms, ounce: gramsToOunces, pound: gramsToPounds, brick: gramsToBricks, quart: gramsToQuarts},
	kilogram: {gram: kilogramsToGrams, ounce: kilogramsToOunces, pound: kilogramsToPounds, brick: kilogramsToBricks, quart: kilogramsToQuarts},
	ounce: {pound: ouncesToPounds, gram: ouncesToGrams, kilogram: ouncesToKilograms, brick: ouncesToBricks, quart: ouncesToQuarts},
	pound: {ounce: poundsToOunces, gram: poundsToGrams, kilogram: poundsToKilograms, brick: poundsToBricks}
}

// returns function from conversionFunctionsMap
function determineFunction(from, to){
	return conversionFunctionsMap[from][to];
}

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
};

function convertIfNeeded(value, unit, direction){
	var arg1 = unit;
	var arg2 = 'quart';

	if (direction == 'back'){
		arg1 = 'quart';
		arg2 = unit;
	}

	if (unit != 'quart'){
		var f = determineFunction(arg1, arg2);	
		converted = f.call(undefined, value);
		return parseFloat(converted).toFixed(2);
	} else {
		return value;
	}
}

function calculate(spawn, vermiculite, coir, water, gypsum){
	var spawnUnit = spawn.unit;
	// convert spawn value to quarts (needed for calculation)
	var spawnValue = convertIfNeeded(spawn.spawn, spawnUnit)
	// convert previous value to quarts (in order to compare current value with previous value)
	var spawnPreviousValue = convertIfNeeded(spawn.previousValue, spawn.previousUnit);

	var vermValue = vermiculite.vermiculite;
	var coirValue = coir.coir;
	var waterValue = water.water;
	var gypsumValue = gypsum.gypsum;

	// calculate how much spawn there is compared to base value of 5 quarts
	var spawnFraction;
	if (spawnValue < spawnPreviousValue){
		spawnFraction = spawnPreviousValue / spawnValue;
		vermValue /= spawnFraction;
		coirValue /= spawnFraction;
		waterValue /= spawnFraction;
		gypsumValue /= spawnFraction;
	} else if (spawnValue > spawnPreviousValue){
		spawnFraction = spawnValue / spawnPreviousValue; 
		vermValue *= spawnFraction;
		coirValue *= spawnFraction;
		waterValue *= spawnFraction;
		gypsumValue *= spawnFraction;
	}
	// else ???

	// convert back from quarts to current unit (if needed)
	spawnValue = convertIfNeeded(spawnValue, spawnUnit, 'back')

	// in next calculation current spawn value/unit will be previous value/unit 
	spawn.previousValue = spawnValue;
	spawn.previousUnit = spawnUnit;

	vermiculite.vermiculite = vermValue;
	coir.coir = coirValue;
	water.water = waterValue;
	gypsum.gypsum = gypsumValue;
	$('#spawn-input').val(parseFloat(spawnValue).toFixed(2));
	$('#verm-input').val(parseFloat(vermValue).toFixed(2));
	$('#coir-input').val(parseFloat(coirValue).toFixed(2));
	$('#water-input').val(parseFloat(waterValue).toFixed(2));
	$('#gypsum-input').val(parseFloat(gypsumValue).toFixed(2));
}

function calculateMix(coir, water, mix){	
	
	var mixCoirValue = coir.coir;
	var mixCoirUnit = coir.unit;
	var mixCoirPreviousValue = coir.previousValue;

	var mixWaterValue = water.water
	var mixWaterUnit = water.unit
	// convert coir unit to quarts (needed for calculation) 
	mixCoirValue = convertIfNeeded(mixCoirValue, mixCoirUnit);

	// convert previous unit to quart (in order to compare curent value to previous value)
	mixCoirPreviousValue = convertIfNeeded(mixCoirPreviousValue, coir.previousUnit);

	// calculate how much coir there is compared to base value of 1 brick
	var mixCoirFraction;
	if (mixCoirValue < mixCoirPreviousValue){
		mixCoirFraction = mixCoirPreviousValue / mixCoirValue;
		mixWaterValue /= mixCoirFraction;
	} else if (mixCoirValue > mixCoirPreviousValue){
		mixCoirFraction = mixCoirValue / mixCoirPreviousValue; 
		mixWaterValue *= mixCoirFraction;
	}
	// else ???

	// convert water to bricks (in order to sum water and coir)
	mixWaterValue = convertIfNeeded(mixWaterValue, mixWaterUnit);

	// convert coir back from brick to current unit
	mixCoirValue = convertIfNeeded(mixCoirValue, mixCoirUnit, 'back')
	// convert water back from brick to current unit
	mixWaterValue = convertIfNeeded(mixWaterValue, mixWaterUnit, 'back');
	// calculate mix
	var mixValue;
	if (mixCoirUnit == 'brick'){
		mixValue = mixCoirValue * 9;
	} else {
		var f = determineFunction(mixCoirUnit, 'brick');
		mixValue = f.call(undefined, mixCoirValue) * 9;
	}
	
	coir.previousValue = mixCoirValue;
	coir.previousUnit = mixCoirUnit;

	coir.coir = mixCoirValue;
	water.water = mixWaterValue;
	mix.mix = mixValue;

	$('#mixWater-input').val(parseFloat(mixWaterValue).toFixed(2));
	$('#mix-input').val(parseFloat(mixValue).toFixed(2));
}

$(document).ready(function(){
	var ua = navigator.userAgent;

	// coir water toggle
	$('.coir-water-calc').hide();
	$('.angles').addClass('fa-angle-down');
	$('.coir-water-btn').click(function(){
		$('.coir-water-calc').toggle();
	   $('.coir-water-btn').html(function(i, text){
	   	show = `Coir/water calculator<br><i class="angles fas fa-angle-down"></i>`
	   	hide = `Hide<br><i class="angles fas fa-angle-up"></i>`
	     return text === show ? hide : show
	   });
	 });

	// initial placeholder values
	var spawn_value = $('#spawn-input').val();
	var verm_value = $('#verm-input').val();
	var coir_value = $('#coir-input').val();
	var water_value = $('#water-input').val();
	var gypsum_value = $('#gypsum-input').val();

	// objects to support search by key
	var spawn = {spawn: spawn_value, unit: 'quart', previousValue: 5, previousUnit: 'quart'};
	var verm = {'vermiculite': verm_value, 'unit': 'quart'};
	var coir = {'coir': coir_value, 'unit': 'brick'};
	var water = {'water': water_value, 'unit': 'quart'};
	var gypsum = {'gypsum': gypsum_value, 'unit': 'cup'};

	ingridientArray = [spawn, verm, coir, water, gypsum]

	mixIngridientArray = [coir, water]

	// dropdowns
  $(".main-calc-dropdown li a").click(function(){
		// https://stackoverflow.com/a/22000328/4821316
  	var hash;
  	var unit = $(this).text();
  	var btn = $(this).parents(".dropdown").find('.btn');
  	btn.html(unit + ' <span class="caret"></span>');
  	btn.val($(this).data('value'));
  	var cardValue = $.trim($(this).parent().parent().parent().parent().siblings('.card').text().toLowerCase());
	  	
		var ingridientMap = {
			'spawn': ingridientArray[0],
			'vermiculite': ingridientArray[1],
			'coir': ingridientArray[2],
			'water': ingridientArray[3],
			'gypsum': ingridientArray[4]
		}
		ingridient = ingridientMap[cardValue];
		var previousUnit = ingridient.unit;

		if (previousUnit == unit){
			return;
		}

		var f = determineFunction(previousUnit, unit);
		var converted = f.call(undefined, ingridient[cardValue]);
		ingridient.unit = unit;
		ingridient[cardValue] = converted;
		converted = parseFloat(converted).toFixed(2);
		$(this).parent().parent().parent().parent().children().first().find('input').val(converted); // preko html id-a? 
	});

	// var eventListener;
	// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)){
 //  	// mobile
 //  	eventListener = 'input'
	// // } else if (/Chrome/i.test(ua)){
	// // 	// chrome on mobile and on computer
	// } else {
	//   // other computer browsers
	//   eventListener = 'keyup'
	// }

  // https://stackoverflow.com/a/49029711/4821316
	$('#spawn-input').on('keyup input', debounce(function(event){
	 	if (event.keyCode >= 48 && event.keyCode <= 57) {
			spawn_value = $('#spawn-input').val();
			spawn.spawn = spawn_value;
			$('.inputs').each(function(i){
				ingridientArray[i].unit = $.trim($(this).parent().parent().children('.dropdown').find('.btn').text());
			});
			calculate(spawn, verm, coir, water, gypsum);
		} else {
			return false;
		}
  }, 500));

 	mixCoir = {coir: 1, unit: 'brick', previousValue: 1, previousUnit: 'brick'}
 	mixWater = {water: 4, unit: 'quart'}
 	mix = {mix: 9, unit: 'quart'}
 	mixIngridientArray = [mixCoir, mixWater, mix]

	$(".coir-water-input").on('keyup input', debounce(function(event){
  	 if (event.keyCode >= 48 && event.keyCode <= 57){
  	 		mix_coir_value = $('#mix-calc-coir-input').val();
  	 		mixCoir.previousValue = mixCoir.coir;
  	 		mixCoir.previousUnit = mixCoir.unit;
  	 		mixCoir.coir = mix_coir_value;
				$('.coir-water-input').each(function(i){
					mixIngridientArray[i].unit = $.trim($(this).parent().parent().children('.dropdown').find('.btn').text());
				});
				calculateMix(mixCoir, mixWater, mix);
			} else {
				return false;
  	 }
	}, 500));

	$(".coir-water-dropdown li a").click(function(){
		var unit = $(this).text();
  	var btn = $(this).parents(".dropdown").find('.btn');
  	btn.html(unit + ' <span class="caret"></span>');
  	btn.val($(this).data('value'));
  	var cardValue = $.trim($(this).parent().parent().parent().parent().siblings('.card').text().toLowerCase());

  	var mixIngridientMap = {
			'coir': mixIngridientArray[0],
			'water': mixIngridientArray[1]
		}
		ingridient = mixIngridientMap[cardValue];
		var previousUnit = ingridient.unit;
		if (previousUnit == unit){
			return;
		}
		var f = determineFunction(previousUnit, unit);
		var converted = f.call(undefined, ingridient[cardValue]);
		ingridient.previousUnit = ingridient.unit // set previous unit
		ingridient.previousValue = ingridient[cardValue]; // set previous value
		ingridient.unit = unit; // set new unit
		ingridient[cardValue] = converted; // set new value
		converted = parseFloat(converted).toFixed(2);
		$(this).parent().parent().parent().parent().children().first().find('input').val(converted);
	});

	$('#pf-tek-info').hide();
	$('#pf-tek-calc').hide();

	$("#pf-tek-nav").click(function(){
		$('#damion-calc').hide();
		$('.additional-text').hide();
		$('.coir-water-calc').hide();
		$('#damion-info').hide();

		$('#pf-tek-info').show();
		$('#pf-tek-calc').show();
	});

	$("#damion-tek-nav").click(function(){
		$('#damion-calc').show();
		$('.additional-text').show();
		$('.coir-water-calc').show();
		$('#damion-info').show();

		$('.coir-water-btn').html(`Coir/water calculator<br><i class="angles fas fa-angle-down"></i>`);
		$('.coir-water-calc').hide();
		$('#pf-tek-info').hide();
		$('#pf-tek-calc').hide();
	});
});