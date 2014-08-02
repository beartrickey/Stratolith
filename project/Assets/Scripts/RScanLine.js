#pragma strict


public var rotationalVelocity : float = 0.0;

public var rotation : float = 0.0;

public var baseLength : float = 10.0;

public var sineCounter : float = 0.0;

public var lr : LineRenderer;

public var originPoint : Vector3 = Vector3.zero;

public var slgd : SublayerGameDelegate;


function onInstantiate()
{

	gameObject.transform.localPosition = originPoint;

	lr = gameObject.GetComponent( LineRenderer );
	lr.SetPosition( 0, originPoint );

	gameObject.SetActive( false );

	slgd = SublayerGameDelegate.instance;
}



function resetLineVars()
{

	rotationalVelocity = Random.Range( -0.05, 0.05 );
	
	rotation = Random.Range( 0, 6.28 );
	
	baseLength = Random.Range( 200.0, slgd.scannerWidth );

	sineCounter = Random.Range( 0.0, 3.14 );

	lr.SetWidth( Random.Range( 10.0, 15.0 ), 1.0 );

}



function updateRScanLine()
{

	//rotation
	var maxAreaUnderGraph : float = 25000.0;
	var minAreaUnderGraph : float = slgd.resultWaveThreshold + 250.0;
	var totalPossibleArea : float = maxAreaUnderGraph - minAreaUnderGraph;

	
	//calculate fan arc
	var scaledCloseness : float = (slgd.scopeList[0].areaUnderCurve - minAreaUnderGraph) / totalPossibleArea;
	var fanArc : float = scaledCloseness * 6.28;
	if( fanArc > 6.28 )
		fanArc = 6.28;

	var fanArcMin = (3.14 - (fanArc * 0.5));
	var fanArcMax = fanArcMin + fanArc;
	

	//make rotational velocity increase as player gets closer
	var tempVelocity : float = rotationalVelocity * (1.0 - (scaledCloseness * 0.5));
	rotation += tempVelocity;


	//keep inside of fan
	if( rotation > fanArcMax )
	{
		rotation = fanArcMin;
	}
		
	if( rotation < fanArcMin )
	{
		rotation = fanArcMax;
	}


	//length
	//make line length closer to that of the item as player gets closer
	var lengthDif : float = baseLength - slgd.rScanItemLength;
	var adjustedBaseLength : float = baseLength - (lengthDif * (1.0 - scaledCloseness));

	sineCounter += 0.01;
	
	var sineAdjust : float = Mathf.Sin( sineCounter ) * 100.0;
	
	var length : float = adjustedBaseLength + sineAdjust;


	//end point
	var xcomp : float = Mathf.Sin( rotation ) * length;
	var ycomp : float = Mathf.Cos( rotation ) * length;
	var endPoint : Vector3 = Vector3( xcomp, ycomp );
	lr.SetPosition( 1, endPoint );
	
	
	//start point
	xcomp = Mathf.Sin( rotation ) * 50.0;
	ycomp = Mathf.Cos( rotation ) * 50.0;
	var startPoint : Vector3 = Vector3( xcomp, ycomp );
	lr.SetPosition( 0, startPoint );


	//update color as player gets closer
	var maxColor : float = 1.0 - scaledCloseness;
	var alpha : float = 1.0 - (scaledCloseness * 0.5);
	var color : Color = Color( Random.Range( 0.0, maxColor ), Random.Range( 0.0, (maxColor * 0.25) ), Random.Range( 0.0, (maxColor * 0.5) ), alpha * 0.8 );
	// var color : Color = Color( maxColor, (maxColor * 0.94), (maxColor * 0.25), alpha );
	lr.renderer.material.SetColor( "_Color", color * 0.8 );
	lr.renderer.material.SetColor( "_SpecColor", color * 0.8 );
	lr.renderer.material.SetColor( "_Emission", color * 0.8 );
	
}


