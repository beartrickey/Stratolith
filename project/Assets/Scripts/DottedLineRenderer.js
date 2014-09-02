#pragma strict

public var numDots : int = 64;

public var dotList = new tk2dSprite[numDots];



function onInstantiate()
{
	
	//pool dots
	for( var d : int = 0; d < numDots ; d++ )
	{
	
		var dotPrefab : GameObject = SublayerGameDelegate.instance.dotPrefab;
	
		//make dots
		var dotGameObject : GameObject = GameObject.Instantiate( dotPrefab, Vector3( 0.0, 0.0, -50.0 ), dotPrefab.transform.rotation );
		var dot : tk2dSprite = dotGameObject.GetComponent( tk2dSprite );
		dot.color = Color( 1.0, 1.0, 1.0, 0.2 );
		dotGameObject.SetActive( false );
		dotList[d] = dot;
		
	}
	
}



function setDotState( _dotState : boolean )
{

	for( var i : int = 0; i < numDots ; i++ )
	{
	
		dotList[i].gameObject.SetActive( _dotState );
		
	}

}



function setDotColor( _color : Color )
{

	for( var i : int = 0; i < numDots ; i++ )
	{
	
		dotList[i].color = _color;
		
	}

}



function drawLineBetweenPoints( _startPoint : Vector2, _endPoint : Vector2 )
{

	//reset all dots
	setDotState( false );

	var dotLength : float = 4.0;
	
	var spaceLength : float = 4.0;
	
	var lengthOfSpaceDotPair : float = spaceLength + dotLength;
	
	var pointDif : Vector2 = _endPoint - _startPoint;
	
	var length : float = pointDif.magnitude;
	
	var numberOfDotsInLine : float = (length / lengthOfSpaceDotPair) / 2.0;
	
	
	//angle
	var angleInRads : float = Mathf.Atan2( pointDif.y, pointDif.x );
	var angleInDegrees : float = angleInRads * Mathf.Rad2Deg;

	
	for( var i : float = 0.0; i < numberOfDotsInLine; i++ )
	{
	
		var scaledLength : float = i / numberOfDotsInLine;
	
		var pointOffset : Vector2 = pointDif * scaledLength;
	
		dotList[i].gameObject.SetActive( true );
		dotList[i].gameObject.transform.position = _endPoint - pointOffset;
		dotList[i].gameObject.transform.position.z = -50.0;
		dotList[i].gameObject.transform.eulerAngles.z = angleInDegrees;
		
	}

}



