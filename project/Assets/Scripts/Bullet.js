#pragma strict



public var position : Vector2;

public var velocity : Vector2;

public var target : GameObject;

public var isActive : boolean;

public var bulletType : int;

public var slgd : SublayerGameDelegate;

public var circleIcon : tk2dSprite;

public var sightIcon : tk2dSprite;


function onInstantiate()
{

	gameObject.SetActive( false );
	
	isActive = false;

	slgd = SublayerGameDelegate.instance;

}



function onInit( _source : Drone, _target : GameObject )
{

	isActive = true;
	
	gameObject.SetActive( true );
	
	target = _target;
	
	bulletType = _source.droneType;
	
	
	//color
	if( _source.hacked == true )
	{
		circleIcon.SetSprite( "Radar-WeaponNull" );
		sightIcon.SetSprite( "Radar-WeaponNullSight" );
	}
	else
	{
		circleIcon.SetSprite( "Radar-WeaponHostile" );
		sightIcon.SetSprite( "Radar-WeaponHostileSight" );
	}

	
	//set velocity
	position = _source.position;
	gameObject.transform.position = _source.gameObject.transform.position;
	
	var positionDif : Vector2 = target.transform.position - gameObject.transform.position;
	
	var speed : float = 4.0;
	
	velocity = positionDif.normalized * speed;

}



function updateBullet()
{

	//increase velocity
	velocity *= 1.12;
	
	
	//update position
	position += velocity;
	
	
	//measure distance to target
	if( target.activeSelf == true )
	{
	
		var positionDif : Vector2 = position - target.transform.position;
		var distance : float = positionDif.magnitude;
		
		
		if( distance < ( velocity.magnitude * 0.75 ) )
		{
			
			//bullet hit stratolith
			if( target == slgd.shieldScannerCenter.gameObject )
			{
				slgd.stratolithHitByBullet( bulletType );
			}
			else //bullet hit other drone
			{
			
				var drone : Drone = target.GetComponent( Drone );
				
				if( drone != null )
				{
					drone.hitByBullet( bulletType );
				}
			
			}
		
			deactivate();
		}
		
	}
	
	
	//bullet went out of scanner range
	var scannerCenterDif : Vector2 = position - slgd.shieldScannerCenter.position;
	var distanceFromScannerCenter : float = scannerCenterDif.magnitude;
	
	if( distanceFromScannerCenter >= 1000.0 )
	{
		deactivate();
	}

}



function updateBulletGraphics()
{

	gameObject.transform.localPosition = position;
	gameObject.transform.localPosition.z = -50.0;

}



function deactivate()
{

	isActive = false;
	gameObject.SetActive( false );
	
}



