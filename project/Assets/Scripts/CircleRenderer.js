#pragma strict

public var lineRenderer : LineRenderer = null;

public var numPoints : int = 50;

public var arcLength : float = 0.0;

public var radius : float = 0.0;


function onInitialize( _radius : float, _hacked : boolean )
{

	// Color
	var color : Color = Color( 1.0, 1.0, 1.0, 0.2 );
	
	if( _hacked == false )
	{
		color.r = 255.0 / 255.0;
		color.g = 239.0 / 255.0;
		color.b = 64.0 / 255.0;
	}

	lineRenderer.gameObject.renderer.material.SetColor( "_Color", color );
	lineRenderer.gameObject.renderer.material.SetColor( "_SpecColor", color );
	lineRenderer.gameObject.renderer.material.SetColor( "_Emission", color );

	// Shape
	radius = _radius;
	arcLength = ( Math.PI * 2.0 ) / (numPoints - 1);

	for( var i : int = 0; i < numPoints; i++ )
	{

		var rotation : float = i * arcLength;

		var xComp = Math.Cos( rotation ) * radius;
    	var yComp = Math.Sin( rotation ) * radius;

	    var position : Vector2 = new Vector3( xComp, yComp, 0.0 );
	    lineRenderer.SetPosition( i, position );

	}

}