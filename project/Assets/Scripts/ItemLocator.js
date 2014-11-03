#pragma strict

public var isActive : boolean = false;

public static var blinkCounterOnFrames : int = 90;
public static var blinkCounterOffFrames : int = 45;
public static var itemLifespan : int = 1800;
public var counter : int = 0;
public var frames : int = 0;

public var sprite : tk2dSprite;


function onInitialize( _position : Vector2 )
{

	gameObject.transform.position = _position;
	gameObject.SetActive( true );
	isActive = true;
	frames = 0;
	counter = blinkCounterOnFrames;

}


function deactivate()
{

	gameObject.SetActive( false );
	isActive = false;

}


function updateItemLocator()
{

	// Blink
	counter--;

	if( counter <= 0 )
	{
		if( sprite.color.a == 0.0 )
		{
			sprite.color.a = 1.0;
			counter = blinkCounterOnFrames;
		}
		else
		{
			sprite.color.a = 0.0;
			counter = blinkCounterOffFrames;
		}
	}

	// Lifespan
	frames++;

	if( frames >= itemLifespan )
	{
		deactivate();
	}

}


