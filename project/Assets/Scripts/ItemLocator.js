#pragma strict

public var isActive : boolean = false;

public static var blinkCounterOnFramesNormal : int = 90;
public static var blinkCounterOffFramesNormal : int = 45;

public static var blinkCounterOnFramesFast : int = 20;
public static var blinkCounterOffFramesFast : int = 10;

public static var itemLifespan : int = 7200; // 2 minutes
public var counter : int = 0;
public var frames : int = 0;

public var sprite : tk2dSprite;


public static var techUpgradeJson = [

	// EW Cannon
	{
		"index": 0,
		"name": "EW Cannon",
		"requiredItems": 1,
		"dependency": -1,
		"description": ""
	},

	// Cannon Amplifier
	{
		"index": 0,
		"name": "Cannon Amplifier",
		"requiredItems": 1,
		"dependency": -1, // EW Cannon
		"description": ""
	},

	// Scope 2
	{
		"index": 0,
		"name": "Power Diversion",
		"requiredItems": 5,
		"dependency": -1, // EW Cannon
		"description": ""
	},

	// Scope 3
	{
		"index": 0,
		"name": "Emergency Power Surge",
		"requiredItems": 5,
		"dependency": -1, // Scope 2
		"description": ""
	},

	// Dock 1
	{
		"index": 0,
		"name": "First Docking Bay",
		"requiredItems": 10,
		"dependency": -1,
		"description": ""
	},

	// Dock 2
	{
		"index": 0,
		"name": "Second Docking Bay",
		"requiredItems": 10,
		"dependency": -1, // First Dock
		"description": ""
	},

	// Dock 3
	{
		"index": 0,
		"name": "Third Docking Bay",
		"requiredItems": 10,
		"dependency": -1, // Second Dock
		"description": ""
	},

	// Stratolith Armor
	{
		"index": 0,
		"name": "Stratolith Armor",
		"requiredItems": 10,
		"dependency": -1, // Third Dock (All docks)
		"description": "Reduces damage taken by hostile drones"
	}

];


function onInitialize( _position : Vector2 )
{

	gameObject.transform.position = _position;
	gameObject.SetActive( true );
	isActive = true;
	frames = 0;
	counter = blinkCounterOnFramesNormal;

}


function deactivate()
{

	gameObject.SetActive( false );
	isActive = false;

}


function updateItemLocator()
{

	// Lifespan
	frames++;

	if( frames >= itemLifespan )
	{
		deactivate();
	}

	var framesRemaining = itemLifespan - frames;

	// Blink
	counter--;

	if( counter <= 0 )
	{
		if( sprite.color.a == 0.0 )
		{
			sprite.color.a = 1.0;

			counter = blinkCounterOnFramesNormal;

			if( framesRemaining < 600 )
				counter = blinkCounterOnFramesFast;				

		}
		else
		{
			sprite.color.a = 0.0;

			counter = blinkCounterOffFramesNormal;

			if( framesRemaining < 600 )
				counter = blinkCounterOffFramesFast;
		}
	}

	

}


