#pragma strict

public var isActive : boolean = false;

public static var blinkCounterOnFramesNormal : int = 90;
public static var blinkCounterOffFramesNormal : int = 45;

public static var blinkCounterOnFramesFast : int = 20;
public static var blinkCounterOffFramesFast : int = 10;

public static var itemLifespan : int = 3600; // 1 minute
public var counter : int = 0;
public var frames : int = 0;

public var sprite : tk2dSprite;


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


