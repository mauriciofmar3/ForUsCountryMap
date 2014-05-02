var numCities = window.location.hash.substring(1);

var pixDimension = 30;

var height = $(window).height();
var width = $(window).width();

cities = new Array();

canvas = document.createElement('canvas');
canvas.height = height; 
canvas.width = width; 
canvas.id = 'canvas';
initializeCities();
initializeEdges();

function initializeCities(){
	for(var i = 0; i < numCities; ++i) {
		var x = Math.floor((Math.random()*(width-pixDimension))+1);
		var y = Math.floor((Math.random()*(height-pixDimension))+1);
		cities.push(new City(x,y));
	}
}


// Sorts other cities by distance, gives each in turn a large chance of being connected
function initializeEdges(){
	for(var i = 0; i < numCities; ++i) {
		arr = new Array();
		for(var j = 0; j < numCities; ++j) 
			arr.push(cities[j]);
		arr.sort(function(a, b) {
			return pythDistance(cities[i], a) - pythDistance(cities[i], b);
		});
		var neighbors = Math.min(cities.length, Math.max(2, randInt(10+Math.log(cities.length))));
		var index = -1;
		while(neighbors > 0) {
			++index
			if(cities[i].neighbors.indexOf(arr[index]) >= 0) {
				neighbors--;
				continue;
			}
			var chance = randInt(100);
			if(chance < 98 || cities.length-index == 0) {
				cities[i].neighbors.push(arr[index]);
				arr[index].neighbors.push(cities[i]);
				neighbors--;
			}
		}
	}
}

function initializeShortestPath(cities, city1, city2) {
	clearCityVisits(cities);
	var toVisit = new Array();
	toVisit.push(city1);
	while(toVisit.length > 0) {
		var city = toVisit.shift();
		for(var i = 0; i < city.neighbors.length; ++i) {
			if(!city.neighbors[i].distance || city.neighbors[i].distance > city.distance + pythDistance(city,city.neighbors[i])) {
				city.neighbors[i].distance = city.distance + pythDistance(city, city.neighbors[i]);
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
		var highlights = $('.highlighted');
		if(highlights.length < 2)
			this.className += ' highlighted';
		if(highlights.length == 1) {
			initializeShortestPath(cities, cities[highlights[0].id.substring(4)], cities[this.id.substring(4)]);
			showShortestPath(cities[highlights[0].id.substring(4)], cities[this.id.substring(4)]);
		}
		if(highlights.length == 2) {
			for(var i = 0; i < 2; ++i)
				highlights[i].className = 'city';
			drawPaths(cities);
		}
	});
}

$(function () {
	$('body').append($(canvas));
	$('#canvas').height(height-20);
	$('#canvas').width(width-20);
	$('#canvas').css("margin-left","-8px");
	$('#canvas').css("margin-top","-8px");
	drawCities(cities);
	drawPaths(cities);
	addCityListeners();
});

function drawPaths(cities) {
	var c=document.getElementById("canvas");
	var ctx=c.getContext("2d");
	ctx.clearRect(0, 0, width, height);
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
		else {
			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
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

