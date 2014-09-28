#pragma strict


public static var droneModelNumberList = new Array( "6611", "8808", "1111", "5555", "7373", "2121", "0101" );
public static var droneAttackRangeList = new Array( 300.0, 560.0, 75.0, 200.0, 200.0, 560.0, 0.0 );
public static var droneBulletDamageList = new Array( 2.0, 5.0, 20.0, 1.0, 1.0, 1.0, 0.0 );
public static var droneHealthList = new Array( 3.0, 5.0, 20.0, 2.0, 50.0, 5.0, 10.0 );
public static var droneReloadFramesList = new Array( 180, 360, 0, 180, 180.0, 260.0, 0.0 );
public static var droneMaxSpeedList = new Array( 0.15, 0.15, 0.0375, 0.15, 0.15, 0.15, 0.2 );
public static var droneNullifiableList = new Array( true, true, false, true, false, false, true );
public static var droneBlueprintSpriteId = new Array( 82, 85, 84, -1, 86, 83, -1 );


public var isActive : boolean = false;

public var scopeList = new Scope[3];

public var counter : int = 0;

public var droneType : int = 0;

public var maxHealth : float = 0.0;
public var health : float = 0.0;

// List of flags for each scopes hack state
public var hackedScopeList = new boolean[3];

public var nullifiable : boolean = false;


//movement
public var position : Vector2; //the absolute position of drone icon

public var direction : float;

public var speed : float = 0.0;

public var startSpeed : float = 0.1;

public var maxSpeed : float = 0.3;

public var accelRate : float = 1.04;

public var decelRate : float = 0.998;


//paths
public var dronePath : DronePath;

public var currentPoint : int = 0;

public var destination : Vector2 = Vector2( 0.0, 0.0 );


//power diversion
public var damageIndex : int = 0;
public var speedIndex : int = 0;
public var healthIndex : int = 0;
public var rangeIndex : int = 0;

public static var DRONE_POWER_NONE : int = -1;
public static var DRONE_POWER_VELO : int = 0;
public static var DRONE_POWER_WEAP : int = 1;
public static var DRONE_POWER_SHLD : int = 2;
public static var DRONE_POWER_RNGE : int = 3;
public var dronePowerState : int = DRONE_POWER_NONE;


//combat vars
public var attackTarget : GameObject = null;
public var attackRange : float = 200.0;
public var reloadCounterMax : int = 180;
public var reloadCounter : int = 0;

public var attackNullDroneNextReload : boolean = false;


public var slgd : SublayerGameDelegate;

public var bulletDamage : float = 0.0;


////graphics
public var boxCollider : BoxCollider;

public var droneSelectionBox : tk2dSprite;

public var destinationIcon : tk2dSprite;

public var targetIcon : tk2dSprite;

public var targetLine : DottedLineRenderer;

public var icon : tk2dSprite;


//damage
public var jitterCounter : int = 0;


//label
public var droneInfoLabel : tk2dTextMesh;

public var modelString : String;


//drone docking
public var droneDockingCounter : int = 0;



////MODELS
public static var DRONE_MODEL_6611 : int = 0; //null close range strike
public static var DRONE_MODEL_8808 : int = 1; //null long range strike
public static var DRONE_MODEL_1111 : int = 2; //non-null tokkou strike
public static var DRONE_MODEL_5555 : int = 3; //null close range
public static var DRONE_MODEL_7373 : int = 4; //non-null med range strike
public static var DRONE_MODEL_2121 : int = 5; //non-null long range strike
public static var DRONE_MODEL_RAND : int = 99;



////STATES
public static var DRONE_STATE_IDLE : int = 0;
public static var DRONE_STATE_MOVE : int = 1;
public static var DRONE_STATE_ATTK : int = 2;
public static var DRONE_STATE_DOCK : int = 3;
public static var DRONE_STATE_CHRG : int = 4;
public static var DRONE_STATE_PREPARING_TO_DOCK : int = 5;
public static var DRONE_STATE_DOCKED : int = 6;
public static var DRONE_STATE_PREPARING_TO_LAUNCH : int = 7;
public static var DRONE_STATE_DYING : int = 8;
public static var DRONE_STATE_CHARGED_TO_DEATH : int = 9;
public static var DRONE_STATE_FOLLOWING_PATH : int = 10;
public static var DRONE_STATE_RSCAN_START : int = 11;
public static var DRONE_STATE_RSCAN_WAIT_AT_ITEM : int = 12;
public static var DRONE_STATE_RSCAN_RETURN : int = 13;

public var state : int = DRONE_STATE_IDLE;



function onInstantiate()
{

	gameObject.SetActive( false );
	
	isActive = false;

	slgd = SublayerGameDelegate.instance;
	
	targetLine.onInstantiate();

}



function initRandomDrone( _hackable : boolean, _damageIndex : int, _speedIndex : int, _healthIndex : int, _rangeIndex : int, _path : DronePath )
{

	// Set Values
	damageIndex = _damageIndex;
	speedIndex = _speedIndex;
	healthIndex = _healthIndex;
	rangeIndex = _rangeIndex;

	modelString = damageIndex.ToString("D1") + speedIndex.ToString("D1") + healthIndex.ToString("D1") + rangeIndex.ToString("D1");

	adjustStatsForPowerDiversion();

	health = maxHealth;

	nullifiable = _hackable;

	droneType = DRONE_MODEL_RAND;


	// Set Path
	dronePath = _path;

	currentPoint = 1;

	state = DRONE_STATE_FOLLOWING_PATH;

	hackedScopeList[0] = false;
	hackedScopeList[1] = false;
	hackedScopeList[2] = false;

	attackTarget = slgd.shieldScannerCenter.gameObject;
	
	
	// Set position
	position = dronePath.getPositionForIndex(0);
	
	
	// Set target
	destination = dronePath.getPositionForIndex(1);
	
	
	// Adjust for new target
	adjustForNewTargetPoint();
	
	
	// Set proper direction
	var dif : Vector2 = position - destination;
	var angleFromDroneToTargetInRads : float = Mathf.Atan2( dif.x, dif.y );
	var angleFromDroneToTargetInDegrees : float = angleFromDroneToTargetInRads * Mathf.Rad2Deg;
	angleFromDroneToTargetInDegrees -= 180.0;
	angleFromDroneToTargetInDegrees = Mathf.Abs( angleFromDroneToTargetInDegrees );
	
	icon.gameObject.transform.localEulerAngles.z = angleFromDroneToTargetInDegrees;
	direction = icon.gameObject.transform.localEulerAngles.z;
	
	baseInitialize();

}



function baseInitialize()
{

	updateLabelText();
	
	counter = 0;
	
	reloadCounter = 0;
	
	jitterCounter = 0;

	isActive = true;

	
	//reset graphics
	gameObject.SetActive( true );
	droneInfoLabel.gameObject.SetActive( true );
	
	gameObject.transform.localScale.x = 1.0;
	gameObject.transform.localScale.y = 1.0;
	
	updateDroneGraphics();
	
	setDroneColor();

}



function initializeDrone( _dronePath : DronePath )
{

	dronePath = _dronePath;
	
	droneType = dronePath.droneType;
	
	currentPoint = 1;

	state = DRONE_STATE_FOLLOWING_PATH;
	
	hackedScopeList[0] = false;
	hackedScopeList[1] = false;
	hackedScopeList[2] = false;
	
	setValuesForDroneType();
	
	attackTarget = slgd.shieldScannerCenter.gameObject;
	
	
	//set position
	position = dronePath.getPositionForIndex(0);
	
	
	//set target
	destination = dronePath.getPositionForIndex(1);
	
	
	//adjust for new target
	adjustForNewTargetPoint();
	
	
	//set proper direction
	var dif : Vector2 = position - destination;
	var angleFromDroneToTargetInRads : float = Mathf.Atan2( dif.x, dif.y );
	var angleFromDroneToTargetInDegrees : float = angleFromDroneToTargetInRads * Mathf.Rad2Deg;
	angleFromDroneToTargetInDegrees -= 180.0;
	angleFromDroneToTargetInDegrees = Mathf.Abs( angleFromDroneToTargetInDegrees );
	
	icon.gameObject.transform.localEulerAngles.z = angleFromDroneToTargetInDegrees;
	direction = icon.gameObject.transform.localEulerAngles.z;
	
	baseInitialize();

}



function initializeDockedDrone( _droneType )
{
	
	droneType = _droneType;

	dronePath = null;

	state = DRONE_STATE_IDLE;
	
	hackedScopeList[0] = true;
	hackedScopeList[1] = true;
	hackedScopeList[2] = true;
	
	setValuesForDroneType();

	attackTarget = null;

	
	//set position
	position = slgd.shieldScannerCenter.gameObject.transform.position;
	
	
	baseInitialize();

}



function setValuesForDroneType()
{

	attackRange = droneAttackRangeList[droneType];
	modelString = droneModelNumberList[droneType];
	health = droneHealthList[droneType];
	reloadCounterMax = droneReloadFramesList[droneType];
	maxSpeed = droneMaxSpeedList[droneType];

}



function updateDrone()
{

	handleNavigation();
	
	updatePosition();
	
	handleTactical();
	
	droneCollision();

}



function handleNavigation()
{

	if( state == DRONE_STATE_RSCAN_START )
	{		
		
		//change points if close enough to target
		var stopThreshold : float = 100.0;
		
		var distanceFromTarget : float = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
			startIdle();
			slgd.rScanItemLocator.gameObject.SetActive( false );
			state = DRONE_STATE_RSCAN_WAIT_AT_ITEM;
			counter = 300;
		}
		
	}


	if( state == DRONE_STATE_RSCAN_WAIT_AT_ITEM )
	{
		
		counter--;
		
		if( counter <= 0 )
		{
			state = DRONE_STATE_RSCAN_RETURN;
			destination = slgd.shieldScannerCenter.position;
		}
		
	}


	if( state == DRONE_STATE_RSCAN_RETURN )
	{		
		
		//change points if close enough to target
		stopThreshold = 100.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
			slgd.rScanDroneReturned();
			deactivate();
		}
		
	}


	if( state == DRONE_STATE_FOLLOWING_PATH )
	{		
		
		//change points if close enough to target
		stopThreshold = 10.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
		
			currentPoint = dronePath.getNextPointIndex( currentPoint );
			
			destination = dronePath.getPositionForIndex(currentPoint);
			
			adjustForNewTargetPoint();

			//deactivate drones that have completed paths that leave radar
			deactivateIfOutsideRadar();
			
		}
		
	}
	
	
	if( state == DRONE_STATE_MOVE )
	{
	
		//stop if close enough to target
		stopThreshold = 10.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
			startIdle();
		}
	
	}
	
	
	if( state == DRONE_STATE_ATTK )
	{
	
		//update destination to target position
		destination = attackTarget.transform.position;
		
		distanceFromTarget = turnTowardTargetPosition();
	
	}
	
	
	if( state == DRONE_STATE_DOCK )
	{
	
		//stop if close enough to target
		stopThreshold = 100.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
		
			startIdle();
			
			attemptEnteringStratolith();
			
		}
	
	}
	
	
	
	if( state == DRONE_STATE_IDLE )
	{
	
		//do nothing
		
	}
	
	
	if( state == DRONE_STATE_DYING )
	{
	
		gameObject.transform.localScale.x *= 1.2;
		gameObject.transform.localScale.y *= 0.75;
		
		
		if( gameObject.transform.localScale.y <= 0.05 )
		{
			
			deactivate();
			
		}
		
	}

}



function deactivateIfOutsideRadar()
{

	var dif : Vector2 = position - SublayerGameDelegate.instance.shieldScannerCenter.position;
	
	var distance : float = dif.magnitude;
	
	if( distance > SublayerGameDelegate.instance.scannerWidth )
	{

		//decrement hostile drone count if hostile drone killed
		if( hackedScopeList[0] == false )
			GameManager.instance.currentStage.remainingHostileDrones -= 1;


		//deactivate
		deactivate();

	}

}



function adjustForNewTargetPoint()
{

	var dif : Vector2 = position - destination;
	
	var distance : float = dif.magnitude;
	
	speed = maxSpeed;

}



function turnTowardTargetPosition() : float
{	
	
	//find difference in position
	var pointDif : Vector2 = destination - position;
	var angleInRads : float = Mathf.Atan2( pointDif.y, pointDif.x );
	var angleInDegrees : float = angleInRads * Mathf.Rad2Deg;
	
	
	//change angle to 0 - 360 number
	angleInDegrees -= 90.0;
	
	if( angleInDegrees < 0.0 )
		angleInDegrees += 360.0;
		
		
	//make drone turn toward the smaller angle
	var angleDif : float =  angleInDegrees - direction;

	if( angleDif < -180 )
	{
		angleDif += 360.0;
	}
	else if( angleDif > 180 )
	{
		angleDif -= 360.0;
	}
	
	
	//slow down as drone approaches correct facing
	var turningAbility : float = speed * 0.025;
	
	var angleOfTurn : float = angleDif * turningAbility;
	
	direction += angleOfTurn;
	
	
	//wrap direction to be 0 to 360
	if( direction > 360.0 )
		direction -= 360.0;
	else if( direction < 0.0 )
		direction += 360.0;
	
		
	//return the distance to target
	var distanceFromTarget : float = pointDif.magnitude;
	
	return distanceFromTarget;

}



function droneCollision()
{

	//skip if this drone drone is docked or dying
	if(
		state == DRONE_STATE_PREPARING_TO_DOCK ||
		state == DRONE_STATE_DOCKED ||
		state == DRONE_STATE_PREPARING_TO_LAUNCH ||
		state == DRONE_STATE_CHARGED_TO_DEATH ||
		state == DRONE_STATE_DYING
	)
		return;

	for( var d : int = 0; d < slgd.numDrones; d++ )
	{
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip other docked and dying drones
		if(
			drone.state == DRONE_STATE_PREPARING_TO_DOCK ||
			drone.state == DRONE_STATE_DOCKED ||
			drone.state == DRONE_STATE_PREPARING_TO_LAUNCH ||
			drone.state == DRONE_STATE_CHARGED_TO_DEATH ||
			drone.state == DRONE_STATE_DYING
		)
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		var collisionRange : float = 30.0;
		
		if( distance < collisionRange )
		{
			// Damage both drones
			damageDrone( 10.0 );
			drone.damageDrone( 10.0 );
		}
		
	}
}



function findHostileDroneWithinAttackRange() : Drone
{

	for( var d : int = 0; d < slgd.numDrones; d++ )
	{
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip if not hostile
		if( drone.hackedScopeList[0] == true )
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		if( distance < attackRange )
		{
			return drone;
		}
		
	}

}



function findHackedDroneWithinAttackRange() : Drone
{

	for( var d : int = 0; d < slgd.numDrones; d++ )
	{
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip if not hacked
		if( drone.hackedScopeList[0] == false )
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		if( distance < attackRange )
		{
			return drone;
		}
		
	}

}



function startMove( _touchCoordinates : Vector2 )
{
	
	state = DRONE_STATE_MOVE;

	destination = _touchCoordinates;
	
	attackTarget = null;

}



function startDock( )
{
	
	destination = slgd.shieldScannerCenter.position;
	
	attackTarget = null;
	
	state = DRONE_STATE_DOCK;
	
}



function startAttk( _drone : Drone )
{
	
	state = DRONE_STATE_ATTK;
	
	attackTarget = _drone.gameObject;
	
	destination = _drone.position;
	
}



function startIdle()
{
	
	state = DRONE_STATE_IDLE;
	
	attackTarget = null;
	
	destination = position;
	
}



function startPowerDiversionWeap()
{

}



function startDroneDeath()
{
	
	state = DRONE_STATE_DYING;
	
	droneInfoLabel.gameObject.SetActive( false );
	
	targetIcon.gameObject.SetActive( false );
	
	targetLine.setDotState( false );

	var droneDeathMessage : String = modelString + " DRONE DESTROYED";
	SublayerGameDelegate.instance.addMessage( droneDeathMessage );
	
	//GameManager.instance.SFX_HOSTILE_DESTROYED.Play();
	
	//decrement hostile drone count if hostile drone killed
	if( hackedScopeList[0] == false )
	{
	
		GameManager.instance.currentStage.remainingHostileDrones -= 1;
		
	}
	
}




function attemptEnteringStratolith()
{

	slgd.attemptDroneDock( this );

}



function enteredStratolith()
{

	//deselect this drone if currently selected
	if( slgd.activeDrone == this )
		slgd.deselectDrone();

	droneDockingCounter = 360;
	
	state = DRONE_STATE_PREPARING_TO_DOCK;
	
	speed = 0.0;
	
	gameObject.SetActive( false );

}



function updatePosition()
{		

	//get thrust vector
	var angleInRads = direction * Mathf.Deg2Rad;
	
	var xcomp : float = -Mathf.Sin( angleInRads );
	var ycomp : float = Mathf.Cos( angleInRads );
	
	var velocity : Vector2 = Vector2( xcomp, ycomp );
	velocity.Normalize();
	
	
	
	//hacked drones gradually increase and decrease speed
	var pointDif : Vector2 = destination - position;
	
	var distance : float = pointDif.magnitude;
	
	
	//set threshold for accel/decel
	var accelThreshold : float = 0.0;
	
	if( state == DRONE_STATE_FOLLOWING_PATH )
	{
		accelThreshold = 0.0;
	}
	if( state == DRONE_STATE_IDLE )
	{
		accelThreshold = 9999.0;
	}
	if( state == DRONE_STATE_MOVE )
	{
		accelThreshold = 40.0;
	}
	else if( state == DRONE_STATE_ATTK )
	{
		accelThreshold = attackRange;
	}
	else if( state == DRONE_STATE_DOCK )
	{
		accelThreshold = 110.0;
	}
	else if( state == DRONE_STATE_CHRG )
	{
		accelThreshold = 40.0;
	}
	else if( state == DRONE_STATE_PREPARING_TO_DOCK ||
			 state == DRONE_STATE_DOCKED ||
			 state == DRONE_STATE_PREPARING_TO_LAUNCH ||
			 state == DRONE_STATE_CHARGED_TO_DEATH)
	{
		accelThreshold = 9999.0;
	}
	
	
	//make drone slow down or speed up depending on distance from target
	if( distance < accelThreshold )
	{
		speed *= decelRate;
	}
	else
	{
	
		//boost drone speed back to normal if stopped
		if( speed <= startSpeed )
			speed = startSpeed;
	
		//accel
		speed *= accelRate;
	}
	
	
	//clamp speed
	if( speed >= maxSpeed )
	{
		speed = maxSpeed;
	}
	
	
	velocity *= speed;
	

	//add velocity to position
	position += velocity;

}



function updateDroneGraphics()
{	
	
	//jitter
	var jitterOffset : Vector2 = Vector2( 0.0, 0.0 );
	
	if( jitterCounter > 0 )
	{
	
		jitterCounter--;
		
		jitterOffset.x = Random.Range( -1, 2 );
		jitterOffset.y = Random.Range( -1, 2 );
		
	}
	
	
	//update position
	
	
	//round for radar
	var roundedPosX : float = Mathf.RoundToInt( position.x + jitterOffset.x );
	var roundedPosY : float = Mathf.RoundToInt( position.y + jitterOffset.y );
	var roundedPos : Vector3 = Vector3( roundedPosX, roundedPosY, -50.0 );
	
	gameObject.transform.position = roundedPos;
	
	
	//update rotation
	icon.gameObject.transform.eulerAngles.z = direction;
	direction = icon.gameObject.transform.eulerAngles.z;
	
	
	//update position of children graphics
	droneInfoLabel.gameObject.transform.position.x = icon.transform.position.x + 40.0;
	droneInfoLabel.gameObject.transform.position.y = icon.transform.position.y;
	
	
	//destination icon
	if( state == DRONE_STATE_MOVE )
	{
	
		setDestinationIcon();
			
	}
	else
	{
		
		if( destinationIcon.gameObject.activeSelf == true )
		{
			destinationIcon.gameObject.SetActive( false );
			targetLine.setDotState( false );
		}
		
	}
	
	
	
	//target icon
	if( state == DRONE_STATE_ATTK )
	{
	
		setTargetIcon();
		
	}
	else
	{
	
		if( targetIcon.gameObject.activeSelf == true )
		{
			targetIcon.gameObject.SetActive( false );
			targetLine.setDotState( false );
		}
		
	}
	
	
	//set selection lines if selected
	if( slgd.activeDrone == this )
	{
	
		var iconOffset : float = 40.0;
		var lineLength : float = 1024.0;
		var offset : float = ( lineLength * 0.5 ) + iconOffset;
		
		
		//up
		var xpos : float = roundedPos.x;
		var ypos : float = roundedPos.y + offset;
		slgd.selectionLineUp.gameObject.transform.position = Vector2( xpos, ypos );
		
		//down
		xpos = roundedPos.x;
		ypos = roundedPos.y - offset;
		slgd.selectionLineDown.gameObject.transform.position = Vector2( xpos, ypos );
		
		//left
		xpos = roundedPos.x - offset;
		ypos = roundedPos.y;
		slgd.selectionLineLeft.gameObject.transform.position = Vector2( xpos, ypos );
		
		//right
		xpos = roundedPos.x + offset;
		ypos = roundedPos.y;
		slgd.selectionLineRight.gameObject.transform.position = Vector2( xpos, ypos );
	
	}
	
}



function setDestinationIcon()
{
	
	destinationIcon.gameObject.SetActive( true );
	
	destinationIcon.gameObject.transform.position = destination;
	
	destinationIcon.gameObject.transform.position.z = -50.0;
	
	
	//line
	var iconOffset : float = 40.0;
	var dif : Vector2 = gameObject.transform.position - destination;
	
	
	//bail if too close (don't draw inverse line)
	if( dif.magnitude < iconOffset * 2.0 )
	{
		targetLine.setDotState( false );
		return;
	}
	
	dif = dif.normalized * iconOffset;
	
	var startPos : Vector2 = gameObject.transform.position - dif;
	var endPos : Vector2 = destination + ( dif * 0.5 );
	
	targetLine.drawLineBetweenPoints( startPos, endPos );
	
}



function setTargetIcon()
{
	
	targetIcon.gameObject.SetActive( true );
	
	targetIcon.gameObject.transform.position = attackTarget.transform.position;
	
	targetIcon.gameObject.transform.position.z = -50.0;
	
	
	//line
	var iconOffset : float = 40.0;
	var dif : Vector2 = gameObject.transform.position - attackTarget.transform.position;
	
	
	//bail if too close (don't draw inverse line)
	if( dif.magnitude < iconOffset * 2.0 )
	{
		targetLine.setDotState( false );
		return;
	}
	
	dif = dif.normalized * iconOffset;
	
	var startPos : Vector2 = gameObject.transform.position - dif;
	var endPos : Vector2 = attackTarget.transform.position + dif;
	
	targetLine.drawLineBetweenPoints( startPos, endPos );

}



function handleTactical()
{

	reloadCounter--;
	
	
	//go idle if attack target dies
	if( state == DRONE_STATE_ATTK )
	{
		var targetDrone : Drone = attackTarget.gameObject.GetComponent( Drone );
		
		if( targetDrone.isActive == false || targetDrone.state == DRONE_STATE_DYING )
		{
			startIdle();
		}
		
	}
	
	
	//bail if not yet reloaded
	if( reloadCounter > 0 )
		return;
		
		
	//hostile drone fire back at null drones if reloaded
	var enemyDrone : Drone = findHackedDroneWithinAttackRange();
		
	if( enemyDrone != null )
	{
	
		if( attackNullDroneNextReload == true )
		{
			attackNullDroneNextReload = false;
			
			fireOnTarget( enemyDrone.gameObject );
			reloadCounter = reloadCounterMax;
			return;
		}
	
	}
	
	
	//bail if no attack target
	if( attackTarget == null )
		return;
		
	
	//measure distance to target
	var positionDif : Vector2 = attackTarget.transform.position - position;
	var distance : float = positionDif.magnitude;
	
	if( distance < attackRange )
	{
				
		//hack for self destruct drones
		if( droneType == DRONE_MODEL_1111 )
		{
			hostileSelfDestruct();
			return;
		}
		
		fireOnTarget( attackTarget );
		
		reloadCounter = reloadCounterMax;
	
	}

}



function fireOnTarget( _target : GameObject )
{

	var bullet : Bullet = slgd.getFreeBullet();
			
	bullet.onInit( this, _target );
	
	GameManager.instance.SFX_BULLET_FIRED.Play();

}



function hostileSelfDestruct()
{

	// if( attackTarget == slgd.shieldScannerCenter.gameObject )
	// {
	
	// 	slgd.stratolithHitByBullet( droneType );
		
	// }
	// else
	// {
	
	// 	var drone : Drone = attackTarget.GetComponent( Drone );
			
	// 	if( drone != null )
	// 	{
		
	// 		drone.hitByBullet( droneType );
			
	// 	}
		
	// }
	
	// damageDrone( 100.0 );
	
}



function deactivate()
{

	//deselect this drone if currently selected
	if( slgd.activeDrone == this )
		slgd.deselectDrone();

	isActive = false;
	
	gameObject.SetActive( false );
	
	targetLine.setDotState( false );

}



function droneSuccessfullyHacked()
{
	
	setDroneColor();
	
	startIdle();
	
	GameManager.instance.SFX_DRONE_HACKED.Play();
	
	GameManager.instance.currentStage.remainingHostileDrones -= 1;

}



function updateLabelText()
{

	droneInfoLabel.text = modelString + "\n" + health + "P";
	droneInfoLabel.Commit();

}



function hitByBullet( _bullet : Bullet )
{

	var damage : float = _bullet.damage;
	
	damageDrone( damage );
	
	GameManager.instance.SFX_HOSTILE_DESTROYED.Play();
	
	//hostile units attack hacked drones in area
	if( hackedScopeList[0] == false )
	{
	
		var drone : Drone = findHackedDroneWithinAttackRange();
		
		if( drone != null )
		{
			attackNullDroneNextReload = true;
		}
	
	}

}



function damageDrone( _damage : float )
{

	health -= _damage;
	
	updateLabelText();
	
	if( health <= 0.0 )
	{
		startDroneDeath();
		return;
	}
	
	
	jitterCounter += 10;
	
}



//////////////////////////////////////////////////////
// Power Diversion and Stats
//////////////////////////////////////////////////////



function adjustStatsForPowerDiversion()
{

	// Base stats
	bulletDamage = 0.0 + ((20.0 - 0.0) * (damageIndex / 10.0));
	reloadCounterMax = 200;
	maxSpeed = 0.0375 + ((0.15 - 0.0375) * (speedIndex / 10.0));
	maxHealth =  Math.Floor(1.0 + ((20.0 - 1.0) * (healthIndex / 10.0)));
	attackRange = 100.0 + ((500.0 - 100.0) * (rangeIndex / 10.0));

	// Diverted stats
	if( dronePowerState == DRONE_POWER_WEAP )
	{
		bulletDamage *= 1.5;
		maxSpeed *= 0.5;
		attackRange *= 0.5;
		// Drone also takes more damage
	}
	else if( dronePowerState == DRONE_POWER_VELO )
	{
		bulletDamage *= 0.5;
		maxSpeed *= 1.5;
		attackRange *= 0.5;
		// Drone also takes more damage
	}
	else if( dronePowerState == DRONE_POWER_SHLD )
	{

		bulletDamage *= 0.5;
		maxSpeed *= 0.5;
		attackRange *= 0.5;
		// Drone also takes less damage
	}
	else if( dronePowerState == DRONE_POWER_RNGE )
	{

		bulletDamage *= 0.5;
		maxSpeed *= 0.5;
		attackRange *= 1.5;
		// Drone also takes more damage
	}

}






//////////////////////////////////////////////////////
// Drone Graphics
//////////////////////////////////////////////////////


function setDroneColor()
{
	
	//Debug.Log( "setDroneColor()" );
	
	var color : Color = Color.red;
	

	if( hackedScopeList[0] == true ) //white for null units
	{
	
		color.r = 255.0 / 255.0;
		color.g = 255.0 / 255.0;
		color.b = 255.0 / 255.0;
		color.a = 0.6;
		
	}
	else //default to yellow (hostile)
	{
	
		color.r = 255.0 / 255.0;
		color.g = 239.0 / 255.0;
		color.b = 64.0 / 255.0;
		color.a = 0.8;
	}


	//set icon sprite
	if( hackedScopeList[0] == true )
	{
		icon.SetSprite( "Radar-NullUnit" );
	}
	else
	{
		icon.SetSprite( "Radar-Hostile" );
	}
	
	
	//set label color
	droneInfoLabel.color = color;
	droneInfoLabel.Commit();
	
	
	//set selection box color
	if( this == slgd.activeDrone )
	{
	
		droneSelectionBox.gameObject.SetActive( true );
		
		color.a = 0.2;
		
		if( hackedScopeList[0] == true )
		{
			droneSelectionBox.SetSprite( "Radar-SelectionNull" );
		}
		else
		{
			droneSelectionBox.SetSprite( "Radar-SelectionHostile" );
		}
		
		
		//selection lines
		slgd.selectionLineUp.color = color;
		slgd.selectionLineDown.color = color;
		slgd.selectionLineLeft.color = color;
		slgd.selectionLineRight.color = color;
		
	}
	else
	{
		droneSelectionBox.gameObject.SetActive( false );
	}
	
}






