#pragma strict



public var position : Vector2;

public var velocity : Vector2;

public var target : GameObject;

public var isActive : boolean;

public var bulletType : int;

public var slgd : SublayerGameDelegate;

public var circleIcon : tk2dSprite;

public var sightIcon : tk2dSprite;

public var damage : float = 0.0;


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

	damage = _source.bulletDamage;
	
	//color
	if( _source.hackedScopeList[0] == true )
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
	position = _source.gameObject.transform.position;
	gameObject.transform.position = position;
	
	var positionDif : Vector2 = target.transform.position - gameObject.transform.position;
	
	var speed : float = 0.01;//4.0;
	
	velocity = positionDif.normalized * speed;

}



function updateBullet()
{

	// Increase speed
	var speed : float = velocity.magnitude;
	speed *= 1.25;

	// Cap speed
	if( speed >= 2.0 )
		speed = 2.0;

	// Update velocity
	velocity = velocity.normalized * speed;
	
	
	//update position
	position += velocity;
	
	
	//measure distance to target
	if( target.activeSelf == true )
	{
	
		var positionDif : Vector2 = position - target.transform.position;
		var distance : float = positionDif.magnitude;
		
		
		// if( distance < ( velocity.magnitude * 0.75 ) )
		if( distance < 10.0 )
		{
			
			//bullet hit stratolith
			if( target == slgd.stratolithIcon )
			{
				slgd.stratolithHitByBullet( this );
			}
			else //bullet hit other drone
			{
			
				var drone : Drone = target.GetComponent( Drone );
				
				if( drone != null )
				{
					drone.hitByBullet( this );
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

	gameObject.transform.position = position;
	gameObject.transform.position.z = -50.0;

}



function deactivate()
{

	isActive = false;
	gameObject.SetActive( false );
	
}



