#pragma strict


public var delayTime : int; //time from beginning of assault to this particular drone's entrance

public var delayCounter : int = 0;

public var drone : Drone;

public var droneModelNumber : String;

public var pathTemplate : PathTemplate;

public var numPoints : int = 16;

public var pathRotation : float;

public var pointList = new Transform[numPoints];

public var message : String = "";




function getNextPointIndex( _currentPointIndex : int ) : int
{

	var nextPoint : int = _currentPointIndex + 1;
	
	if( pathTemplate.pointList[nextPoint] == null )
		return 0;
		
	return nextPoint;

}



function getPositionForIndex( _pointIndex : int ) : Vector2
{

	//set rotation
	pathTemplate.gameObject.transform.eulerAngles.z = pathRotation;
	
	
	//get position
	return pathTemplate.pointList[_pointIndex].position;

}



