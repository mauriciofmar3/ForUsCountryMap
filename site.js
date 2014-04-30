var numCities = window.location.hash.substring(1);

var pixDimension = 30;

var height = $(window).height();
var width = $(window).width();

cities = new Array();

canvas = document.createElement('canvas');
canvas.height = height; 
canvas.width = width; 
canvas.id = 'canvas';

function initializeShortestPath(cities, city1, city2) {
	clearCityVisits(cities);
	var toVisit = new Array();
	toVisit.push(city1);
	while(toVisit.length > 0) {
		var city = toVisit.shift();
		for(var i = 0; i < city.neighbors.length; ++i) {
			if(!city.neighbors[i].distance || city.neighbors[i].distance > city.distance + pythDistance(city,city.neighbors[i])) {
				city.neighbors[i].distance = city.distance + pythDistance(city, city.neighbors[i]);
				console.log(city.neighbors[i].distance);
				city.neighbors[i].path = city;
				toVisit.push(city.neighbors[i]);
			}
		}
	}
}

function showShortestPath(city1, city2){
	console.log(city1.neighbors.length + " " + city2.neighbors.length);
	while(city2.path && city2 != city1) {
		
		drawPath(city2, city2.path, "#E8F70C");
		city2 = city2.path;
	}
}

function pythDistance(city1, city2) {
	return Math.sqrt(Math.pow(Math.abs(city1.xPos-city2.xPos), 2) + Math.pow(Math.abs(city1.yPos-city2.yPos), 2));
}

function clearCityVisits(cities) {
	for(var i = 0; i < cities.length; ++i) {
		cities[i].path = false;
		cities[i].distance = false;
	}
}

function addCityListeners() { 
	$('.city').on('click', function() {
		// console.log('fdjsk');
		var highlights = $('.highlighted');
		if(highlights.length < 2)
			this.className += ' highlighted';
		if(highlights.length == 1) {
			// console.log(cities + " " + cities[highlights[0].id.substring(4)] + " " + cities[this.id.substring(4)]);
			initializeShortestPath(cities, cities[highlights[0].id.substring(4)], cities[this.id.substring(4)]);
			showShortestPath(cities[highlights[0].id.substring(4)], cities[this.id.substring(4)]);
		}
		if(highlights.length == 2) {
			for(var i = 0; i < 2; ++i)
				highlights[i].className = 'city';
		}
	});
}


for(var i = 0; i < numCities; ++i) {
	var x = Math.floor((Math.random()*(width-pixDimension))+1);
	var y = Math.floor((Math.random()*(height-pixDimension))+1);
	cities.push(new City(x,y));
}

for(var i = 0; i < numCities; ++i) {
	for(var j = i; j < numCities; ++j) {
		if(i != j) {
			var distance = Math.sqrt(Math.abs(Math.pow(cities[i].xPos - cities[j].xPos, 2)) 
														+ Math.abs(Math.pow(cities[i].yPos - cities[j].yPos, 2)));
																				
			var chance =  Math.floor(Math.sqrt(randInt(width)*randInt(width) + randInt(height)*randInt(height)))/6;
			if(chance > distance) {
				cities[i].neighbors.push(cities[j]);
				cities[j].neighbors.push(cities[i]);
			}
		}
	}
}

$(function () {
	$('body').append($(canvas));
	$('#canvas').height(height-20);
	$('#canvas').width(width-20);
	// $('#canvas').css("border","1px solid #d3d3d3");
	$('#canvas').css("margin-left","-8px");
	$('#canvas').css("margin-top","-8px");
	drawCities(cities);
	drawPaths(cities);
	addCityListeners();
});

function drawPaths(cities) {
	for(var i = 0; i < cities.length; ++i) {
		for(var j = 0; j < cities[i].neighbors.length; ++j) {
			drawPath(cities[i], cities[i].neighbors[j], null);
		}
	}
}

function drawPath(city1, city2, color) {
		var c=document.getElementById("canvas");
		var ctx=c.getContext("2d");
		ctx.beginPath();
		if(color != null) {
			ctx.strokeStyle = color;
			ctx.lineWidth = 4;
		}
		ctx.moveTo(city1.xPos + pixDimension, city1.yPos + pixDimension);
		ctx.lineTo(city2.xPos + pixDimension, city2.yPos + pixDimension);
		ctx.stroke();
}

function drawCities(cities) { 
	for(var i = 0; i < cities.length; ++i) {
		var element = document.createElement("div"); 
		element.style.left = cities[i].xPos + "px";
		element.style.top = cities[i].yPos + "px"; 
		element.style.position = "fixed";
		element.className += ' city';
		element.id = 'city' + i;
		var image = document.createElement("img"); 
		image.src = "city.gif";
		image.style.height = pixDimension + "px";
		image.style.width = pixDimension + "px";
		element.appendChild(image);
		// console.log(element);
		$('body').append($(element));
	}
}

function City(x, y) {
	this.xPos = x;
	this.yPos = y;
	this.neighbors = new Array();
}

function randInt(number) {
	return Math.floor(Math.random()*number + 1);
}

