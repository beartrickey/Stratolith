#pragma strict

public static var numDots : int = 40;
public var dotList = new tk2dSprite[numDots];
public var dotContainer : GameObject = null;

public static var columnHeight : float = 160.0;
public static var dotsPerValue : float = numDots / 10;
public static var dotSpacing : float = columnHeight / numDots;

public var baseValueIndicator : tk2dSprite = null;
public var boostIndicator : tk2dSprite = null;


function onInstantiate()
{

	var i : int = 0;
	for( var child : Transform in dotContainer.transform )
	{
    	dotList[i] = child.gameObject.GetComponent( tk2dSprite );
    	i++;
	}

}


function setGauge( baseValue : int, actualValue : int, boost : boolean )
{

	// Set value dots
	var numActiveDots : int = actualValue * dotsPerValue;

	Debug.Log('setGauge');
	Debug.Log('baseValue: ' + baseValue);
	Debug.Log('actualValue: ' + actualValue);
	Debug.Log('numActiveDots: ' + numActiveDots);

	for( var i : int = 0; i < numDots; i++ )
	{

		var dot : tk2dSprite = dotList[i];

		if( i <= numActiveDots )
		{
			dot.gameObject.SetActive( true );
			dot.gameObject.transform.localPosition.y = i * dotSpacing;
		}
		else
		{
			dot.gameObject.SetActive( false );
		}

	}

	// Set base value triangle
	baseValueIndicator.gameObject.SetActive( true );
	baseValueIndicator.gameObject.transform.localPosition.y = baseValue * dotsPerValue * dotSpacing;

	// Set boost indicator
	boostIndicator.gameObject.SetActive( boost );

}



function turnGaugeOff()
{

	for( var i : int = 0; i < numDots; i++ )
	{
		dotList[i].gameObject.SetActive( false );
	}

	baseValueIndicator.gameObject.SetActive( false );

	boostIndicator.gameObject.SetActive( false );

}








