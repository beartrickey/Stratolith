#pragma strict



//singleton ref
public static var instance : SublayerGameDelegate = null;


//other objects
public var gm : GameManager;
public var sl : Sublayer;
public var im : InputManager;


//frame
public var frameNumber : int = 0;


// Stratolith movement
public var worldMap : GameObject = null;
public var stratolithIcon : GameObject = null;
public var stratolithWorldPosition : Vector2 = Vector2( 0.0, 0.0 );
public var stratolithSpeed : float = 0.0;
public var stratolithMoving : boolean = false;

public var stratolithMoveButton : ButtonScript = null;
public var stratolithDirectionKnob : ButtonScript = null;
public var stratolithDestinationDirection : float = 0.0;
public var stratolithActualDirection : float = 0.0;


//base graphics
public var panel : tk2dSprite = null;
public var scopeBackground : tk2dSprite = null;

//scanner
public var shieldScannerCenter : Transform;
public static var scannerWidth : float = 540.0;

public var incomingDroneIconList = new IncomingDroneIcon[3];


//drones
public var dronePrefab : GameObject;
public static var numDrones : int = 256;
public var droneList = new Drone[numDrones];
public var activeDrone : Drone;


//misc graphics
public var dotPrefab : GameObject;


//visual effects
public var redAlarm : tk2dSprite;
public var blueAlarm : tk2dSprite;
public var radarStaticEffect : Renderer;


//selection lines
public var selectionCircle : tk2dSprite;
public var selectionLineUp : tk2dSprite;
public var selectionLineDown : tk2dSprite;
public var selectionLineLeft : tk2dSprite;
public var selectionLineRight : tk2dSprite;


// Clouds
public var cloudPrefab : GameObject;
public var numClouds : int = 8;
public var cloudList = new Cloud[numClouds];

public var windVelocity : Vector2;


//bullets
public var bulletPrefab : GameObject;
public static var numBullets : int = 16;
public var bulletList = new Bullet[numBullets];


//power
public var mainPower : float = 100.0;
public var mainCharge : float = 0.0;
public var damageCharge : float = 0.0;

public var mainPowerNeedle : tk2dSprite;
public var chargeNeedle : tk2dSprite;

public var currentPowerNeedlePosition : float = mainPower;
public var powerNeedleVelocity : float = 0.0;

public var currentChargeNeedlePosition : float = 0.0;
public var chargeNeedleVelocity : float = 0.0;


public var damageCounter : int = 0;
public var damageCounterMin : int = 180;
public var damageCounterMax : int = 360;

public var vibrationCounter : int = 0;
public var vibrationCounterMax : int = 0;


//stage flow vars
public static var GAME_STATE_BLUR_IN : int = 0;
public static var GAME_STATE_STAGE : int = 1;
public static var GAME_STATE_END_SUCCESS_DELAY : int = 2;
public static var GAME_STATE_END_FAILURE_DELAY : int = 3;
public var state : int = GAME_STATE_BLUR_IN;

public var machineStateCounter : int = 0;


//scopes
public static var resultWaveThreshold : float = 1875.0;
public var numScopes : int = 3;
public var scopeList = new Scope[numScopes];

public var activeScope : Scope = null;

public var draggingScopePhase : boolean = false;
public var draggingScopeWavelength : boolean = false;
public var draggingStratolithDirectionKnob : boolean = false;


//labels

// Conflict
public var hostileDronesRemainingLabel : tk2dTextMesh = null;

//commands
public var scopeOneLabels : GameObject = null;
public var scopeTwoLabels : GameObject = null;
public var scopeThreeLabels : GameObject = null;

public var activeCommandLabel : tk2dSprite;
public var commandRequestLabel : tk2dSprite;
public var moveCommandLabel : tk2dSprite;
public var dockCommandLabel : tk2dSprite;
public var attkCommandLabel : tk2dSprite;
public var chrgCommandLabel : tk2dSprite;

// Surge labels
public var surgeOnCommandLabel : tk2dSprite;
public var surgeOffCommandLabel : tk2dSprite;
public var surgeTitleLabel : tk2dSprite;
public var surgeStateLabel : tk2dSprite;

public static var numSurgePowerBars : int = 22;
public var surgePowerBarArray = new tk2dSprite[numSurgePowerBars];


//power diversion labels
public var powerDiversionLabel : tk2dSprite;
public var weapPowerLabel : tk2dSprite;
public var veloPowerLabel : tk2dSprite;
public var shldPowerLabel : tk2dSprite;
public var funcPowerLabel : tk2dSprite;


//drone stat labels
public var activeDroneModelLabel : tk2dTextMesh;
public var activeDronePowerLabel : tk2dTextMesh;
public var activeDroneBlueprint : tk2dSprite;

public var dronePerformanceGaugeList = new DronePerformanceGauge[4];


//drone command buttons
public var activeDroneWaitingForDestination : boolean = false;
public var activeDroneWaitingForAttackTarget : boolean = false;
public var activeDroneWaitingForSalvageTarget : boolean = false;


//docking
public var dockSlotList = new DockSlot[3];


// Cannon
public var cannonTarget : tk2dSprite = null;
public var cannonButton : ButtonScript;
public var cannonModeActive : boolean;

// Items
public var itemLocatorPrefab : GameObject = null;
public static var numItems : int = 256;
public var itemLocatorList = new ItemLocator[numItems];

public var collectedItemsLabel : tk2dTextMesh = null;
public var collectedItems : int = 0;



//print text
public var messageLabel : tk2dTextMesh;

//messages that are waiting to be printed
public var messageLineStack = new Array();

public var messageLinePrintCounterMax : int = 30; //half second
public var messageLinePrintCounter : int = 0;


//ux
public var standbyButton : ButtonScript;




function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerGameUpdate;
	
	
	//stat label initialization
	activeDroneModelLabel.color = Color( 0.78, 0.78, 0.78, 0.6 );
	activeDroneModelLabel.Commit();
	
	activeDronePowerLabel.color = Color( 0.78, 0.78, 0.78, 0.6 );
	activeDronePowerLabel.Commit();


	for( var p : int = 0; p < 4; p++ )
	{
		dronePerformanceGaugeList[p].onInstantiate();
	}


	// Stratolith direction knob
	sl.addButton( stratolithDirectionKnob );
	stratolithDirectionKnob.onTouchDownInsideDelegate = stratolithDirectionKnobPressed;
	stratolithDirectionKnob.knobPosition = stratolithDestinationDirection = 0.125;
	stratolithDirectionKnob.setKnobRotation();


	// Stratolith move button
	sl.addButton( stratolithMoveButton );
	stratolithMoveButton.onTouchUpInsideDelegate = stratolithMoveButtonPressed;
	stratolithMoveButton.setupButtonGraphics( "Interface-Tactical-ComButtonON2", "Interface-Tactical-ComButtonONpressed" );


	// Stratolith Position
	stratolithSpeed = 0.025;
	stratolithWorldPosition = Vector2( -3417.0, 7802.0 );
	stratolithMoving = true;


	// Cannon
	sl.addButton( cannonButton );
	cannonButton.onTouchDownInsideDelegate = cannonButtonPressed;
	
	
	//standby button
	sl.addButton( standbyButton );
	standbyButton.onTouchDownInsideDelegate = standbyButtonPressed;
	
	
	//dock slots
	for( var ds : int = 0; ds < 3; ds++ )
	{
	
		var dockLaunchButton : ButtonScript = dockSlotList[ds].dockLaunchButton;
		sl.addButton( dockLaunchButton );
		dockLaunchButton.onTouchDownInsideDelegate = dockSlotList[ds].dockLaunchButtonPressed;

		var dockExtractPowerButton : ButtonScript = dockSlotList[ds].dockExtractPowerButton;
		sl.addButton( dockExtractPowerButton );
		dockExtractPowerButton.onTouchDownInsideDelegate = dockSlotList[ds].dockExtractPowerButtonPressed;
	
	}
	

	//scopes
	for( var s : int = 0; s < numScopes; s++ )
	{
	
		scopeList[s].initScope();
		scopeList[s].index = s;
		
		var knob : ButtonScript = scopeList[s].knob;
		sl.addButton( knob );
		knob.onTouchDownInsideDelegate = wavelengthKnobPressed;
		knob.buttonTag = s;
		
		var phaseDial : ButtonScript = scopeList[s].phaseDial;
		phaseDial.onInit();
		sl.addButton( phaseDial );
		phaseDial.onTouchDownInsideDelegate = phaseDialPressed;
		phaseDial.buttonTag = s;
		
		
		//mod buttons
		for( var m : int = 0; m < 4; m++ )
		{
		
			var modButton : ButtonScript = scopeList[s].modButtonList[m];
			sl.addButton( modButton );
			modButton.setupButtonGraphics( "Interface-Tactical-ComButtonOFF", "Interface-Tactical-ComButtonOFFpressed" );
			modButton.onTouchUpInsideDelegate = modButtonPressed;
			modButton.buttonTag = s;
			modButton.buttonTagSub = m;
		
		}
		
	}

	// Surge power bars
	var surgeBarPrefab : GameObject = Resources.Load("SurgeBar");
	var surgeBarStartingPosition : Vector3 = Vector3( -107.0, -32.1, -147.5 );
	var surgeBarSpacing : Vector3 = Vector3( 10.0, 0.0, 0.0 );
	for( p = 0; p < numSurgePowerBars; p++ )
	{
		var surgeBarGameObject : GameObject = GameObject.Instantiate( surgeBarPrefab, Vector3( 0.0, 0.0, 0.0 ), surgeBarPrefab.transform.rotation );
		surgeBarGameObject.transform.parent = scopeThreeLabels.transform;
		var surgeBarSprite : tk2dSprite = surgeBarGameObject.GetComponent( tk2dSprite );
		surgePowerBarArray[p] = surgeBarSprite;

		// Set position
		surgeBarGameObject.transform.localPosition = surgeBarStartingPosition + (surgeBarSpacing * p);
		surgeBarGameObject.SetActive( false );
	}

	
	turnOffScopes();
	
	setScopesForScopeLevel();

	// Get drones from scene and add them to list
	var droneGameObjects : GameObject[];
    droneGameObjects = GameObject.FindGameObjectsWithTag("Drone");
    for( var d : int = 0; d < droneGameObjects.length; d++ )
    {
    	// Drone component
    	droneList[d] = droneGameObjects[d].GetComponent( Drone );
    	droneList[d].onInstantiate();
    	droneList[d].initPresetDrone();

    	// ButtonScript component
    	var droneButton : ButtonScript = droneGameObjects[d].GetComponent( ButtonScript );
		sl.addButton( droneButton );
		droneButton.onTouchDownInsideDelegate = selectDrone;
		droneButton.buttonTag = d;
    }


    // Item Locators
    var itemGameObjects : GameObject[];
    itemGameObjects = GameObject.FindGameObjectsWithTag("Item");
	for( var i : int = 0; i < itemGameObjects.length; i++ )
	{
		// Drone component
    	itemLocatorList[i] = itemGameObjects[i].GetComponent( ItemLocator );
    	itemLocatorList[i].onInitialize( itemGameObjects[i].transform.position );

    	// ButtonScript component
    	var itemButton : ButtonScript = itemGameObjects[i].GetComponent( ButtonScript );
		sl.addButton( itemButton );
		itemButton.onTouchDownInsideDelegate = selectItem;
	}


	// Checkpoints
    var checkpointGameObjects : GameObject[];
    checkpointGameObjects = GameObject.FindGameObjectsWithTag("Checkpoint");
	for( var c : int = 0; c < checkpointGameObjects.length; c++ )
	{
		var checkpointSprite : tk2dSprite = checkpointGameObjects[c].GetComponent( tk2dSprite );
		checkpointSprite.color.a = 0.5;

		// Color checkpoints
		var checkpoint : Checkpoint = checkpointGameObjects[c].GetComponent( Checkpoint );
		if( checkpoint.secured == false )
		{
			checkpointSprite.color.r = 255.0 / 255.0;
			checkpointSprite.color.g = 239.0 / 255.0;
			checkpointSprite.color.b = 64.0 / 255.0;
		}

	}

	
	
	// //make drones
	// for( d : int = 0; d < numDrones; d++ )
	// {
		
	// 	var droneGameObject : GameObject = GameObject.Instantiate( dronePrefab, Vector3( 0.0, 0.0, -50.0 ), dronePrefab.transform.rotation );
	// 	droneGameObject.transform.parent = worldMap.transform;
	// 	var drone : Drone = droneGameObject.GetComponent( Drone );
	// 	droneList[d] = drone;
		
	// 	drone.onInstantiate();
		
	
	// 	var droneButton : ButtonScript = droneGameObject.GetComponent( ButtonScript );
	// 	sl.addButton( droneButton );
	// 	droneButton.onTouchDownInsideDelegate = selectDrone;
	// 	droneButton.buttonTag = d;
	
	// }
	
	
	
	//make bullets
	for( var b : int = 0; b < numBullets; b++ )
	{
		
		var bulletGameObject : GameObject = GameObject.Instantiate( bulletPrefab, Vector3( 0.0, 0.0, -50.0 ), bulletPrefab.transform.rotation );
		bulletGameObject.transform.parent = worldMap.transform;
		var bullet : Bullet = bulletGameObject.GetComponent( Bullet );
		bulletList[b] = bullet;
		
		bullet.onInstantiate();
	
	}


	// Make clouds
	var windSpeed : float = Random.Range(0.0, 0.2);
	
	windVelocity = new Vector2(
		Random.Range(-windSpeed, windSpeed),
		Random.Range(-windSpeed, windSpeed)
	);

	for( c = 0; c < numClouds; c++ )
	{
		
		var scannerRadius = scannerWidth * 2.0;
		var posx : float = Random.Range(-scannerRadius, scannerRadius) + shieldScannerCenter.position.x;
		var posy : float = Random.Range(-scannerRadius, scannerRadius) + shieldScannerCenter.position.y;
		var cloudPosition : Vector3 = stratolithWorldPosition + Vector3( posx, posy, -75.0 );

		var cloudGameObject : GameObject = GameObject.Instantiate( cloudPrefab, cloudPosition, cloudPrefab.transform.rotation );
		cloudGameObject.transform.parent = worldMap.transform;
		var cloud : Cloud = cloudGameObject.GetComponent( Cloud );
		cloudList[c] = cloud;
		
		cloud.onInstantiate();
	
	}
	
}



//////////////////////////////////////////////////
// CLEARING SCENE
//////////////////////////////////////////////////



function clearScene()
{

	//clear dockslots
	for( var ds : int = 0; ds < 3; ds++ )
	{
	
		dockSlotList[ds].drone = null;
		dockSlotList[ds].dockLabel.text = "----";
		dockSlotList[ds].dockLabel.Commit();
		
		dockSlotList[ds].dockActiveLight.gameObject.SetActive( false );
		
	}


	//clear drones
	for( var d : int = 0; d < numDrones; d++ )
	{
	
		droneList[d].deactivate();
		
	}
	
	
	//clear bullets
	for( var b : int = 0; b < numBullets; b++ )
	{
	
		bulletList[b].deactivate();
		
	}


	//clear status message
	messageLineStack = new Array();
	messageLabel.text = "";
	messageLabel.Commit();

}



function resetVarsForNewStage()
{

	mainPower = 100.0;
	mainCharge = 0.0;
	damageCharge = 0.0;
	
	damageCounter = 0;
	vibrationCounter = 0;

	messageLabel.text = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";
	messageLabel.Commit();

	// gm.currentStage.foundHealthItems = 0;

}



//////////////////////////////////////////////////GAME FLOW and TRANSITIONS



function startGame()
{

	GameManager.instance.SFX_NEW_RADAR_ENTITY.Play();
	
	resetVarsForNewStage();

	addSavedDronesToDockSlots();
	
	// gm.currentStage.initStage();

}



function abortStage()
{

	deselectRadarObject();
	
	clearScene();

}



function stageSuccessfullyCleared()
{

	// update map
	gm.onStageClear();


	// save data
	PlayerData.instance.saveData();

	deselectRadarObject();
	
	clearScene();
		
	gm.goFromGameToGameClear();

}



function stageLost()
{

	deselectRadarObject();
	clearScene();
	
	gm.goFromGameToGameOver();

}



//////////////////////////////////////////////////UPDATE



function sublayerGameUpdate()
{

	frameNumber++;

	updateStateMachine();


	// Handle stratolith direction knob
	if( draggingStratolithDirectionKnob == true )
	{

		var im : InputManager = InputManager.instance;

		if( im.knobPreference == InputManager.KNOB_PREFERENCE_VERTICAL )
		{
		
			//how far did the touch move in the y direction?
			var ydif : float = im.lastTouchPosition[0].y - im.currentTouchPosition[0].y;
			
			ydif *= -0.0025;

			stratolithDestinationDirection += ydif;
			
			//wrap value
			if( stratolithDestinationDirection < 0.0 )
			{
				stratolithDestinationDirection = 1.0 + stratolithDestinationDirection;
			}
				
			if( stratolithDestinationDirection > 1.0 )
			{
				stratolithDestinationDirection = stratolithDestinationDirection - 1.0;
			}
			
		}
		else if( im.knobPreference == InputManager.KNOB_PREFERENCE_RADIAL )
		{
		
			var dif : Vector2 = im.lastTouchPosition[0] - activeScope.knob.gameObject.transform.position;
			var angleInRads : float = Mathf.Atan2( dif.y, dif.x );
		
			var angleInDegrees : float = angleInRads * Mathf.Rad2Deg;
		
			//change angle to 0 - 360 number
			angleInDegrees += 90.0;
			
			if( angleInDegrees < 0.0 )
				angleInDegrees += 360.0;
			
			var scaledDegrees : float = angleInDegrees / 360.0;
		}

		//update dial/knob graphics
		stratolithDirectionKnob.knobPosition = stratolithDestinationDirection;
		stratolithDirectionKnob.setKnobRotation();

	}

	// Update Stratolith position
	if( stratolithMoving == true )
	{

		// The knob value goes from 0.0 to 1.0
		// The 0.0/1.0 position is at the top, which represents a upward direction (0.0/6.28 rads)
		// The 0.5 position is at the top, and represents an upward direction (3.14 rads)
		var directionInRads : float = (stratolithDestinationDirection * 6.28);
		// if( directionInRads < 0.0 )
		// 	directionInRads = 6.28 + directionInRads;

		var xcomp : float = Mathf.Sin( directionInRads );
		var ycomp : float = Mathf.Cos( directionInRads );
		
		var stratolithVelocity : Vector2 = Vector2( xcomp, ycomp );
		stratolithVelocity *= stratolithSpeed;

		stratolithWorldPosition += stratolithVelocity;
		stratolithIcon.transform.localPosition = stratolithWorldPosition;

		worldMap.transform.position = shieldScannerCenter.position - stratolithWorldPosition;

		// Checkpoint collision
		var checkpointGameObjects : GameObject[];
		checkpointGameObjects = GameObject.FindGameObjectsWithTag("Checkpoint");

		for( var c : int = 0; c < checkpointGameObjects.length; c++ )
		{

			var checkpoint : Checkpoint = checkpointGameObjects[c].GetComponent( Checkpoint );

			// Skip secured checkpoints
			if( checkpoint.secured == true )
				continue;

			// Measure distance from checkpoint
			var vectorFromCheckpoint : Vector2 = checkpointGameObjects[c].transform.localPosition - stratolithWorldPosition;
			var distanceFromCheckpoint : float = vectorFromCheckpoint.magnitude;

			if( distanceFromCheckpoint < 10.0 )
			{

				// Stop Stratolith
				stratolithMoving = false;
				stratolithMoveButton.setupButtonGraphics( "Interface-Tactical-ComButtonOFF", "Interface-Tactical-ComButtonOFFpressed" );

				// Turn checkpoint white
				var checkpointSprite : tk2dSprite = checkpointGameObjects[c].GetComponent( tk2dSprite );
				checkpointSprite.color.r = 1.0;
				checkpointSprite.color.g = 1.0;
				checkpointSprite.color.b = 1.0;

				// Secure checkpoint
				checkpoint.secured = true;

				// Give rewards

				// Save data

			}

		}


	}
	
	
	
	//handle shield dragging
	handleScopeDragging();
	
	
	//dock slots
	for( var ds : int = 0; ds < 3; ds++)
	{
	
		dockSlotList[ds].handleDroneDocking();
		
	}
	
	
	//drones
	for( var d : int = 0; d < numDrones; d++ )
	{

		if( !droneList[d] )
			continue;
	
		if( droneList[d].isActive == false )
			continue;
	
		droneList[d].updateDrone();
		
	}
	
	
	//bullets
	for( var b : int = 0; b < numBullets; b++ )
	{
	
		if( bulletList[b].isActive == false )
			continue;
			
		bulletList[b].updateBullet();
		
	}
	
	
	//update radar scanner at different rate than logic
	updateRadarGraphics();


	// Scopes
	for( var s : int = 0; s < 3; s++ )
	{
		scopeList[s].updateScope();
	}
	
	
	//vibration from damage
	handleVibration();
	
	
	//handle alarms
	handleRedAlarm();
	handleBlueAlarm();
	
	handleRadarStatic();
	
	
	//update power needle
	updatePowerNeedle();
	updateChargeNeedle();


	//update messaging
	handleMessages();
	
	
	//game over condition
	if( mainPower <= 0.0 )
	{
		
		stageLost();
	
	}


	// conflict labels
	// hostileDronesRemainingLabel.text = gm.currentStage.remainingHostileDrones.ToString("D2");;
	// hostileDronesRemainingLabel.Commit();
	
	
	//game clear condition
	// if( state == GAME_STATE_STAGE && gm.currentStage.remainingHostileDrones <= 0 )
	// {
	
	// 	state = GAME_STATE_END_SUCCESS_DELAY;
	// 	machineStateCounter = 300;
		
	// }
		
}



function updatePowerNeedle()
{

	//clamp
	if( mainPower > 100.0 )
		mainPower = 100.0;
	else if( mainPower < 0.0 )
		mainPower = 0.0;
		
		
	//difference between actual main power and current needle position
	var dif : float = mainPower - currentPowerNeedlePosition;
	var springCoefficient : float = 0.1;
	var friction : float = 0.7;
	var force : float = dif * springCoefficient;
	
	powerNeedleVelocity += force;
	powerNeedleVelocity *= friction;
	currentPowerNeedlePosition += powerNeedleVelocity;
	
		
	//figure out angle
	var leftMostAngle : float = 104.0;
	var rightMostAngle : float = -104.0;
	var angleRange : float = leftMostAngle + Mathf.Abs( rightMostAngle );
	var scaledPosition : float = currentPowerNeedlePosition * 0.01;
	
	mainPowerNeedle.gameObject.transform.eulerAngles.z = leftMostAngle - ( angleRange * scaledPosition );

}



function updateChargeNeedle()
{

	//gradually reduce negative charge caused by damage
	if( damageCharge > 0.0 )
		damageCharge -= 0.1;
		
		
	var chargeFromDocks : float = getNumberOfDocksUsed();
		
	
	//combine damage charge with main charge
	mainCharge = chargeFromDocks - damageCharge;
	

	//clamp
	if( mainCharge > 3.0 )
		mainCharge = 3.0;
	else if( mainCharge < -3.0 )
		mainCharge = -3.0;
		
		
	//difference between actual main power and current needle position
	var dif : float = mainCharge - currentChargeNeedlePosition;
	var springCoefficient : float = 0.25;
	var friction : float = 0.85;
	var force : float = dif * springCoefficient;
	
	
	//randomly apply small force
	var randomJitter : int = Random.Range( 0, 100 );
	if( randomJitter <= 2 )
	{
		force += Random.Range( -0.25, 0.25 );
	}
	
	
	chargeNeedleVelocity += force;
	chargeNeedleVelocity *= friction;
	currentChargeNeedlePosition += chargeNeedleVelocity;
	
		
	//figure out angle
	var maxAngle : float = 35.0;
	var scaledPosition : float = currentChargeNeedlePosition / 3.0; //charge needle is between -3.0 and 3.0
	
	chargeNeedle.gameObject.transform.eulerAngles.z = maxAngle * scaledPosition;

}



//////////////////////////////////////////////////
// WORLD MAP HELPER FUNCTIONS
//////////////////////////////////////////////////



function screenToWorldMapCoordinates( _screenCoordinates : Vector2 )
{

	var radarScreenCoordinates : Vector2 = _screenCoordinates - shieldScannerCenter.position;
	var worldCoordinates : Vector2 = radarScreenCoordinates + stratolithWorldPosition;
	return worldCoordinates;

}



function worldMapToScreenCoordinates( _worldMapCoordinates : Vector2 )
{

	var radarScreenCoordinates : Vector2 = _worldMapCoordinates - stratolithWorldPosition;
	var screenCoordinates : Vector2 = radarScreenCoordinates + shieldScannerCenter.position;
	return screenCoordinates;

}



////////////////////////////////////////////////MESSAGING



function addMessage( _message : String )
{

	var newMessageStack = new Array( _message.Split("\n"[0]) ); //this is a stupid hack because Split isn't properly supported by Unity

	for( var i : int = 0; i < newMessageStack.length; i++ )
	{
		newMessageStack[i] = "# " + newMessageStack[i]; //add # to beginning of each line
	}

	newMessageStack.Unshift(" "); //add blank line to beginning of new message stack

	messageLineStack = messageLineStack.Concat( newMessageStack );

	Debug.Log( messageLineStack.length );

}



function handleMessages()
{

	//bail if no messages in stacks
	if( messageLineStack.length == 0 )
		return;


	//decrement
	messageLinePrintCounter--;


	//bail if message counter is still counting down
	if( messageLinePrintCounter > 0 )
		return;


	//reset counter
	messageLinePrintCounter = messageLinePrintCounterMax;

	
	//grab label text
	var messageLabelLines = new Array( messageLabel.text.Split("\n"[0]) );
	
	
	//remove top line
	messageLabelLines.Shift();
	
	
	//add new line to bottom
	messageLabelLines.Push( messageLineStack.Shift() );
	
	
	//update label
	messageLabel.text = messageLabelLines.Join("\n");
	messageLabel.Commit();


}



function updateRadarGraphics()
{

	//skip N frames
	//if( frameNumber % 30 != 0 ) //only update radar graphics every N frames
	//	return;

	// Update clouds
	for( var c : int = 0; c < numClouds; c++ )
	{
		cloudList[c].updateCloud();
	}
	
	
	//update rscan if active
	if( cannonModeActive == true )
	{
	
		updateCannon();
	
	}


	// Update itemLocators
	for( var il : int = 0; il < numItems; il++ )
	{

		if( !itemLocatorList[il] )
			continue;
	
		if( itemLocatorList[il].isActive == false )
			continue;
	
		itemLocatorList[il].updateItemLocator();
		
	}
	
	
	//update active drone stats
	if( activeDrone != null )
	{
		activeDronePowerLabel.text = activeDrone.health.ToString("F0") + "p";
		activeDronePowerLabel.Commit();
	}
	

	//drones
	for( var d : int = 0; d < numDrones; d++ )
	{

		if( !droneList[d] )
			continue;
	
		if( droneList[d].isActive == false )
			continue;
	
		droneList[d].updateDroneGraphics();
		
	}
	
	
	//bullets
	for( var b : int = 0; b < numBullets; b++ )
	{
	
		if( bulletList[b].isActive == false )
			continue;
			
		bulletList[b].updateBulletGraphics();
		
	}
	
	
	//incoming drone icons
	for( var i : int = 0; i < 3; i++ )
	{
		incomingDroneIconList[i].gameObject.SetActive( false );
	}
	
	
	// for( d = 0; d < Stage.numDronePaths; d++ )
	// {	
		
	// 	var path : DronePath = gm.currentStage.dronePathList[d];
		
		
	// 	// skip if path is null
	// 	if( path == null )
	// 		continue;
		
		
	// 	// skip if already appeared
	// 	if( path.delayCounter <= -1 )
	// 		continue;
		
		
		// Find free icon and set it
		// for( i = 0; i < 3; i++ )
		// {
		
		// 	var icon : IncomingDroneIcon = incomingDroneIconList[i];
			
			
		// 	// skip if already active
		// 	if( icon.gameObject.activeSelf == false )
		// 	{

		// 		// Init and display icon at edge of radar where drone will appear
		// 		icon.dronePath = path;
		// 		icon.gameObject.SetActive( true );

		// 		var iconDistanceFromCenter : float = scannerWidth - 20.0;
		// 		var firstPointPosition : Vector2 = path.getPositionForIndex(0);
		// 		var direction : Vector2 = (firstPointPosition - shieldScannerCenter.transform.position).normalized;
		// 		var position : Vector2 = direction * iconDistanceFromCenter;
		// 		position += shieldScannerCenter.transform.position;
		// 		icon.gameObject.transform.position = position;

		// 		// Rotate icon
		// 		var iconAngleInRads : float = Mathf.Atan2( direction.x, direction.y );
		// 		var iconAngleInDegrees : float = iconAngleInRads * Mathf.Rad2Deg;
		// 		iconAngleInDegrees -= 180.0;
		// 		iconAngleInDegrees = Mathf.Abs( iconAngleInDegrees );
		// 		icon.gameObject.transform.eulerAngles.z = iconAngleInDegrees + 180.0;

		// 		// Position label to the inside of the radar
		// 		var labelOffset : Vector2 = (shieldScannerCenter.transform.position - position).normalized * 50.0;
		// 		icon.distanceLabel.gameObject.transform.position = position + labelOffset;
		// 		icon.distanceLabel.gameObject.transform.eulerAngles.z = 0.0;

		// 		// Update distance counter
		// 		icon.distanceLabel.text = path.delayCounter.ToString("D2") + " MU";
		// 		icon.distanceLabel.Commit();
				
		// 		break;

		// 	}
		
		// }
	
	// }

}



function handleScopeDragging()
{

	//bail if no active scope
	if( activeScope == null )
		return;


	var im : InputManager = InputManager.instance;

	if( draggingScopePhase == true )
	{
		
		//how far did the touch move in the x direction?
		var xdif : float = im.lastTouchPosition[0].x - im.currentTouchPosition[0].x;
		
		xdif *= 0.0025;
		
		activeScope.hackWaveData.phaseKnob += xdif;
		
		//wrap value
		if( activeScope.hackWaveData.phaseKnob < 0.0 )
		{
			activeScope.hackWaveData.phaseKnob = 1.0 + activeScope.hackWaveData.phaseKnob;
		}
			
		if( activeScope.hackWaveData.phaseKnob > 1.0 )
		{
			activeScope.hackWaveData.phaseKnob = activeScope.hackWaveData.phaseKnob - 1.0;
		}
		
	}
	else if( draggingScopeWavelength == true )
	{
		
		if( im.knobPreference == InputManager.KNOB_PREFERENCE_VERTICAL )
		{
		
			//how far did the touch move in the y direction?
			var ydif : float = im.lastTouchPosition[0].y - im.currentTouchPosition[0].y;
			
			ydif *= -0.0025;
			
			activeScope.hackWaveData.waveLengthKnob += ydif;
			
			
			//clamp value
			if( activeScope.hackWaveData.waveLengthKnob < 0.0 )
				activeScope.hackWaveData.waveLengthKnob = 0.0;
			
			if( activeScope.hackWaveData.waveLengthKnob > 1.0 )
				activeScope.hackWaveData.waveLengthKnob = 1.0;
			
		}
		else if( im.knobPreference == InputManager.KNOB_PREFERENCE_RADIAL )
		{
		
			var dif : Vector2 = im.lastTouchPosition[0] - activeScope.knob.gameObject.transform.position;
			var angleInRads : float = Mathf.Atan2( dif.y, dif.x );
		
			var angleInDegrees : float = angleInRads * Mathf.Rad2Deg;
		
			//change angle to 0 - 360 number
			angleInDegrees += 90.0;
			
			if( angleInDegrees < 0.0 )
				angleInDegrees += 360.0;
				
			Debug.Log( angleInDegrees );
			
			
			var scaledDegrees : float = angleInDegrees / 360.0;
			
			activeScope.hackWaveData.waveLengthKnob = 1.0 - scaledDegrees;
			
		}
		
	}
			
	
	
	//update dial/knob graphics
	activeScope.updatePhaseDialGraphics();
	
	activeScope.knob.knobPosition = activeScope.hackWaveData.waveLengthKnob;
	activeScope.knob.setKnobRotation();
	
	if( cannonModeActive == false && activeDrone == null )
		return;
	
	// update waves for unhacked scopes
	if( activeScope.state == Scope.SCOPE_STATE_UNHACKED)
		onHackWaveChanged();

}



function onHackWaveChanged()
{

	//update hacking wave
	activeScope.hackWaveData.calculateWave();
	activeScope.hackWave.updateWave( activeScope.hackWaveData );
		
	
	//update result wave
	activeScope.updateResultWave();	
	activeScope.resultWave.drawResultWave();
	
	
	//snap and change color
	if( activeScope.areaUnderCurve < resultWaveThreshold )
	{
		activeScope.startSuccessfulHackSequence();
	}

}



///////////////////////////////////////////////////////////////////////////
// DRONES
///////////////////////////////////////////////////////////////////////////



function randomDroneGenerator()
{

	// Position
	var randGenerate : int = Random.Range( 0, 4000 );
	if( randGenerate != 0 )
		return;

	var randDirection : float = Random.Range(0.0, 6.28);

	var position : Vector2 = Vector2(
		Mathf.Sin(randDirection) * scannerWidth,
		Mathf.Cos(randDirection) * scannerWidth
	);
	position += stratolithWorldPosition;


	// Instantiate drone object
	var drone : Drone = makeNewDrone( position );


	// Hackable or not?
	var randHackable : int = Random.Range(0, 2);


	// If player has no hacked drones, give them one
	if( getNullifiedDroneCount() == 0 )
		randHackable = 1;


	// If player has max null drone count, give them a non-hackable one
	var maxNullDroneCount : int = PlayerData.instance.dockLevel + 4;
	if( getNullifiedDroneCount() >=  maxNullDroneCount )
		randHackable = 0;

	// Drone stats
	var randDroneHashTable : Hashtable = Drone.getDroneWithAttributes( 12, randHackable );
	drone.initRandomDrone( randDroneHashTable );

}



function getFreeDrone() : Drone
{

	for( var d : int = 0; d < numDrones; d++ )
	{
		if( droneList[d].isActive == false )
		{
			return droneList[d];
		}
	}
	
	return null;
}



function getNullifiedDroneCount() : int
{

	var nullifiedDroneCount : int = 0;

	for( var d : int = 0; d < numDrones; d++ )
	{
		if( !droneList[d] )
			continue;

		if( droneList[d].isActive == false )
			continue;

		if( droneList[d].hackedScopeList[0] == true )
			nullifiedDroneCount++;

	}
	
	return nullifiedDroneCount;
}



function makeNewDrone( _position : Vector2 ) : Drone
{

	// Find a free space in the list
	for( var d : int = 0; d < numDrones; d++ )
	{

		// Skip array elements that exist
		if( droneList[d] )
			continue;
		
		var droneGameObject : GameObject = GameObject.Instantiate(
			dronePrefab,
			Vector3( 0.0, 0.0, 0.0 ),
			dronePrefab.transform.rotation
		);

		droneGameObject.transform.parent = worldMap.transform;
		droneGameObject.transform.localPosition = _position;

		droneList[d] = droneGameObject.GetComponent( Drone );
		droneList[d].onInstantiate();

    	// ButtonScript component
    	var droneButton : ButtonScript = droneGameObject.GetComponent( ButtonScript );
		sl.addButton( droneButton );
		droneButton.onTouchDownInsideDelegate = selectDrone;
		droneButton.buttonTag = d;

		return droneList[d];

	}

	return null;

}



///////////////////////////////////////////////////////////////////////////
// BULLETS
///////////////////////////////////////////////////////////////////////////



function getFreeBullet() : Bullet
{

	for( var b : int = 0; b < numBullets; b++ )
	{
		if( bulletList[b].isActive == false )
		{
			return bulletList[b];
		}
	}
	
	return null;
}



function stratolithHitByBullet( _bullet : Bullet )
{

	vibrationCounter = Random.Range( 20, 40 );
	
	var damage : float = _bullet.damage;
	
	mainPower -= damage;
	
	damageCharge = 3.0;
	
	
	//show radar static
	if(
		Application.platform != RuntimePlatform.OSXEditor &&
		Application.platform != RuntimePlatform.IPhonePlayer &&
		Application.platform != RuntimePlatform.OSXWebPlayer
    )
	{

		radarStaticEffect.gameObject.SetActive( true );
		radarStaticEffect.material.SetInt( "numLines", 5 );
		radarStaticEffect.material.SetFloat( "hOffset", 0.005 );

	}
	
	
	//show red alarm
	redAlarm.gameObject.SetActive( true );
	redAlarm.color.a = 0.75;
	
	
	//sfx
	GameManager.instance.SFX_STRATOLITH_HIT.Play();

}



function handleVibration()
{

	//bail if no vibration counter
	if( vibrationCounter <= 0 )
	{
		
		Camera.main.transform.localPosition = Vector3( 0.0, 0.0, Camera.main.transform.localPosition.z );
	
		return;
	}
		
		
	var randX : float = Random.Range( -vibrationCounter, vibrationCounter );
	var randY : float = Random.Range( -vibrationCounter, vibrationCounter );
	
	
	Camera.main.transform.localPosition = Vector3( randX, randY, Camera.main.transform.localPosition.z );
	
	vibrationCounter--;

}



function handleRadarStatic()
{

	//skip effect if in editor
	if(
		Application.platform != RuntimePlatform.OSXEditor ||
		Application.platform != RuntimePlatform.IPhonePlayer ||
		Application.platform != RuntimePlatform.OSXWebPlayer
	)
		return;


	if( radarStaticEffect.gameObject.activeSelf == false )
		return;
		
	var vPos : float = radarStaticEffect.material.GetFloat( "vOffset" );
	
	//slowly regain horizontal balance
	if( mainPower > 50.0 )
	{
		var hOffset : float = radarStaticEffect.material.GetFloat( "hOffset" );
		hOffset *= 0.99;
		radarStaticEffect.material.SetFloat( "hOffset", hOffset );
		
		if( hOffset <= 0.00001 )
			radarStaticEffect.gameObject.SetActive( false );
	}
	else if( mainPower <= 50.0 )
	{
		
		var severityLevel : float = ( 60.0 - mainPower ) * 0.1;
		
		hOffset = 0.001 * severityLevel;
		
		var vOffset : float = vPos - ( 0.0005 * severityLevel );
		
		radarStaticEffect.material.SetFloat( "hOffset", hOffset );
		
		radarStaticEffect.material.SetFloat( "vOffset", vOffset );
		
		radarStaticEffect.material.SetInt( "numLines", severityLevel );
	
	}

}



function handleRedAlarm()
{

	if( redAlarm.gameObject.activeSelf == false )
		return;
	

	if( redAlarm.color.a > 0.0 )
	{
	
		redAlarm.color.a -= 0.01;
	
	}
	else
	{
		redAlarm.gameObject.SetActive( false );
	}

}


function handleBlueAlarm()
{

	if( mainPower < 25.0 )
	{
	
		blueAlarm.gameObject.SetActive( true );
		blueAlarm.color.a = 0.5;
		
		blueAlarm.gameObject.transform.position.x += 100.0;
		
		if( blueAlarm.gameObject.transform.position.x > 2048.0 )
		{
			blueAlarm.gameObject.transform.position.x = -2048.0;
		}
	
	}
	else
	{
		blueAlarm.gameObject.transform.position.x = -2048.0;
		blueAlarm.gameObject.SetActive( false );
	}

}



function updateStateMachine()
{

	switch( state )
    {
    
    
    	case GAME_STATE_BLUR_IN:
    	
    		var rate : float = 1.025;
    		
    		gameObject.transform.localScale.x *= rate;
    		gameObject.transform.localScale.y *= rate;
    		
    		
    		//bluriness
    		//don't worry about blur if in editor
    		if(
    			Application.platform != RuntimePlatform.OSXEditor &&
    			Application.platform != RuntimePlatform.IPhonePlayer &&
    			Application.platform != RuntimePlatform.OSXWebPlayer
    		)
			{
	    		var blurResolution : float = gm.fullScreenBlur.renderer.material.GetFloat( "resolution" );	
	    		blurResolution *= 0.9;
	    		gm.fullScreenBlur.renderer.material.SetFloat( "resolution", blurResolution );
	    		
	    		
	    		//brightness
	    		var brightness : float = gm.fullScreenBlur.renderer.material.GetFloat( "brightness" );	
	    		brightness *= rate;
	    		gm.fullScreenBlur.renderer.material.SetFloat( "brightness", brightness );
    		}
    		
    		//end condition
    		if( gameObject.transform.localScale.x >= 1.0 )
    		{
    			
    			gameObject.transform.localScale = Vector3( 1.0, 1.0, 1.0 );
    			
    			gm.fullScreenBlur.SetActive( false );
    		
    			state = GAME_STATE_STAGE;
    		
    		}
    		
    		break;

    	case GAME_STATE_END_SUCCESS_DELAY:

    		machineStateCounter--;

    		if( machineStateCounter <= 0 )
    		{
    			stageSuccessfullyCleared();
    		}

    		break;
    
    
    	case GAME_STATE_STAGE:

    		randomDroneGenerator();
	
    		break;
    
    }

}



/////////////////////////////////////////////////BUTTONS



function selectDrone( _button : ButtonScript )
{

	// Debug.Log( "selectDrone" );

	if( cannonModeActive == true )
		turnOffCannon();
	
	//play audio
	GameManager.instance.SFX_BUTTON_PRESS.Play();

	var buttonIndex : int = _button.buttonTag;
	
	var drone : Drone = droneList[buttonIndex];
	
	activeDroneWaitingForDestination = false;
	
	activeDroneWaitingForAttackTarget = false;

	activeDroneWaitingForSalvageTarget = false;
	
	activeDrone = drone;

	// reset scope states (will turn back on later based on drone hack state)
	turnOffScopes();

	connectActiveDroneToScopes();
	
	//turn selection lines on
	setSelectionLines( drone.hackedScopeList[0] );
	updateSelectionLines( drone.gameObject.transform.position );
	
	//change drone stats under radar
	activeDroneModelLabel.text = activeDrone.modelString;
	activeDroneModelLabel.Commit();
	
	activeDronePowerLabel.text = activeDrone.health.ToString("F0") + "p";
	activeDronePowerLabel.Commit();

	setActiveDronePerformanceGauges();	
	
	//change blueprint
	activeDroneBlueprint.gameObject.SetActive( true );
	// var droneHashtable : System.Collections.Hashtable = getDroneWithModelNumber(drone.modelString);

	activeDroneBlueprint.SetSprite(
			Drone.getDroneWithModelNumber(drone.modelString)["texture"] as String
	);


    // HACK: SFX for IGF build
    if( activeDrone.hackedScopeList[0] == false && activeDrone.hackedScopeList[1] == false )
        gm.SFX_NULLIFICATION_IN_PROGRESS.Play();
    else
        gm.SFX_NULLIFICATION_IN_PROGRESS.Stop();	

	
	//reset drone colors
	resetDroneColors();
	
}



function setActiveDronePerformanceGauges()
{

	// Drone performance gauges
	for( var p : int = 0; p < 4; p++ )
	{

		// Base Value
		var baseString : String = "" + activeDrone.modelString[p];
		var baseValue : int = parseInt( baseString );

		// Actual Value
		var actualValue : int = baseValue;

		if( p == 0 )
			actualValue = activeDrone.damageIndex;
		if( p == 1 )
			actualValue = activeDrone.velocityIndex;
		if( p == 2 )
			actualValue = activeDrone.rangeIndex;
		if( p == 3 )
			actualValue = activeDrone.shieldIndex;

		// Boost
		var boost : boolean = false;
		if( p == 0 && activeDrone.dronePowerState == Drone.DRONE_POWER_WEAP )
			boost = true;
		if( p == 1 && activeDrone.dronePowerState == Drone.DRONE_POWER_VELO )
			boost = true;
		if( p == 2 && activeDrone.dronePowerState == Drone.DRONE_POWER_RNGE )
			boost = true;
		if( p == 3 && activeDrone.dronePowerState == Drone.DRONE_POWER_SHLD )
			boost = true;

		dronePerformanceGaugeList[p].setGauge( baseValue, actualValue, boost );
	}

}



function connectActiveDroneToScopes()
{

	for( var i : int = 0; i < 3; i++ )
	{

		// Attach and set hacked flag
		activeDrone.scopeList[i] = scopeList[i];
		scopeList[i].drone = activeDrone;

		if( activeDrone.hackedScopeList[i] == true )
		{
			scopeList[i].setForHackedState();
		}
		else
		{
			scopeList[i].resetWaves();
		}

	}
	
}



function disconnectDroneFromScopes()
{

	for( var i : int = 0; i < 3; i++ )
	{

		activeDrone.scopeList[i] = null;
		scopeList[i].drone = null;

	}

}



function resetDroneColors()
{

	for( var d : int = 0; d < numDrones; d++ )
	{

		if( !droneList[d] )
			continue;
	
		if( droneList[d].isActive == false )
			continue;
			
		droneList[d].setDroneColor();
		
	}

}



function deselectRadarObject()
{

	if( activeDrone )
	{
		activeDroneWaitingForDestination = false;
	
		activeDroneWaitingForAttackTarget = false;

		activeDroneWaitingForSalvageTarget = false;

		disconnectDroneFromScopes();
		
		activeDrone = null;

		//stop audio
		GameManager.instance.SFX_NULLIFICATION_IN_PROGRESS.Stop();

	}
	
	turnOffScopes();
	
	resetDroneColors();
	
	
	//turn selection lines off
	selectionCircle.gameObject.SetActive( false );
	selectionLineUp.gameObject.SetActive( false );
	selectionLineDown.gameObject.SetActive( false );
	selectionLineLeft.gameObject.SetActive( false );
	selectionLineRight.gameObject.SetActive( false );
	
	
	//change drone stats under radar
	activeDroneModelLabel.text = "----";
	activeDroneModelLabel.Commit();
	
	activeDronePowerLabel.text = "----";
	activeDronePowerLabel.Commit();
	
	activeDroneBlueprint.gameObject.SetActive( false );

	for( var p : int = 0; p < 4; p++ )
	{
		dronePerformanceGaugeList[p].turnGaugeOff();
	}

}



///////////////////////////////////////////////////////////////////////////
// Radar
///////////////////////////////////////////////////////////////////////////



function updateSelectionLines( _position : Vector2 )
{

	var iconOffset : float = 40.0;
	var lineLength : float = 1024.0;
	var offset : float = ( lineLength * 0.5 ) + iconOffset;

	// Circle
	selectionCircle.gameObject.transform.position = _position;
	
	// Up
	var xpos : float = _position.x;
	var ypos : float = _position.y + offset;
	selectionLineUp.gameObject.transform.position = Vector2( xpos, ypos );
	
	// Down
	xpos = _position.x;
	ypos = _position.y - offset;
	selectionLineDown.gameObject.transform.position = Vector2( xpos, ypos );
	
	// Left
	xpos = _position.x - offset;
	ypos = _position.y;
	selectionLineLeft.gameObject.transform.position = Vector2( xpos, ypos );
	
	// Right
	xpos = _position.x + offset;
	ypos = _position.y;
	selectionLineRight.gameObject.transform.position = Vector2( xpos, ypos );

}



function setSelectionLines( _hacked : boolean )
{

	var color : Color = Color(1.0, 1.0, 1.0, 0.2);

	if( _hacked )
	{
		// White
		selectionCircle.SetSprite( "Radar-SelectionNull" );
	}
	else
	{
		// Yellow
		selectionCircle.SetSprite( "Radar-SelectionHostile" );
		color.r = 255.0 / 255.0;
		color.g = 239.0 / 255.0;
		color.b = 64.0 / 255.0;
		color.a = 0.2;
	}


	// Selection Line Color
	selectionLineUp.color = color;
	selectionLineDown.color = color;
	selectionLineLeft.color = color;
	selectionLineRight.color = color;


	// Selection Line visibility
	selectionCircle.gameObject.SetActive( true );
	selectionLineUp.gameObject.SetActive( true );
	selectionLineDown.gameObject.SetActive( true );
	selectionLineLeft.gameObject.SetActive( true );
	selectionLineRight.gameObject.SetActive( true );

}


///////////////////////////////////////////////////////////////////////////
// Scopes
///////////////////////////////////////////////////////////////////////////



function setScopesForScopeLevel()
{

	if( PlayerData.instance.scopeLevel == 1 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = true;
		scopeList[2].locked = true;
		scopeBackground.SetSprite( "Interface-Tactical-State1" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 126.7359, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 128.9894, -225.0 );
	}
	else if( PlayerData.instance.scopeLevel == 2 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = false;
		scopeList[2].locked = true;
		scopeBackground.SetSprite( "Interface-Tactical-State2" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 332.5808, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 335.1377, -225.0 );

		scopeList[1].gameObject.transform.position = Vector3( 613.5668, -77.90067, 0.0 );
		scopeTwoLabels.transform.position = Vector3( 490.4458, -65.882, -225.0 );
	}
	else if( PlayerData.instance.scopeLevel == 3 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = false;
		scopeList[2].locked = false;

		scopeBackground.SetSprite( "Interface-Tactical-State3" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 537.2813, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 537.2813, -225.0 );

		scopeList[1].gameObject.transform.position = Vector3( 613.5668, 127.4803, 0.0 );
		scopeTwoLabels.transform.position = Vector3( 490.4458, 139.4803, -225.0 );

		scopeList[2].gameObject.transform.position = Vector3( 613.5668, -283.0268, 0.0 );
		scopeThreeLabels.transform.position = Vector3( 496.415, -272.2209, -225.0 );
	}
	
	
	//set panel
	for( var s : int = 0; s < 3; s++ )
	{
	
		if( scopeList[s].locked == true )
		{
		
			scopeList[s].gameObject.SetActive( false );
			scopeList[s].knob.gameObject.SetActive( false );
			scopeList[s].phaseDial.gameObject.SetActive( false );
			scopeList[s].modButtonList[0].gameObject.SetActive( false );
			scopeList[s].modButtonList[1].gameObject.SetActive( false );
			scopeList[s].modButtonList[2].gameObject.SetActive( false );
			scopeList[s].modButtonList[3].gameObject.SetActive( false );
			
		}
		else
		{
		
			scopeList[s].gameObject.SetActive( true );
			scopeList[s].knob.gameObject.SetActive( true );
			scopeList[s].phaseDial.gameObject.SetActive( true );
			scopeList[s].modButtonList[0].gameObject.SetActive( true );
			scopeList[s].modButtonList[1].gameObject.SetActive( true );
			scopeList[s].modButtonList[2].gameObject.SetActive( true );
			scopeList[s].modButtonList[3].gameObject.SetActive( true );
			
		}
	
	}

}



function phaseDialPressed( _button : ButtonScript )
{

	Debug.Log( "phaseDialPressed" );

	var buttonIndex : int = _button.buttonTag;
	
	activeScope = scopeList[buttonIndex];
	
	draggingScopePhase = true;

}



function wavelengthKnobPressed( _button : ButtonScript )
{

	var buttonIndex : int = _button.buttonTag;
	
	activeScope = scopeList[buttonIndex];

	draggingScopeWavelength = true;

}



function modButtonPressed( _button : ButtonScript )
{

	var scopeIndex : int = _button.buttonTag;
	
	var buttonIndex : int = _button.buttonTagSub;
	
	activeScope = scopeList[scopeIndex];


	//play audio
	GameManager.instance.SFX_BUTTON_PRESS.Play();
	
	
	//For drones
	if( activeDrone != null )
	{

		//drone hacked (buttons are drone commands)
		if( activeScope.state == Scope.SCOPE_STATE_HACKED )
		{
		
			droneCommandButtonPressed( scopeIndex, buttonIndex );
		
		}
		else if( activeScope.state == Scope.SCOPE_STATE_UNHACKED )
		{

			waveModulationButtonPressed( buttonIndex );

		}

	}
		
		
	//for rscan
	if( cannonModeActive == true )
	{
		waveModulationButtonPressed( buttonIndex );
	}

}



function waveModulationButtonPressed( _buttonIndex : int )
{

	if( activeScope.hackWaveData.waveType == _buttonIndex )
	{
		return;
	}
	else
	{
		activeScope.hackWaveData.waveType = _buttonIndex;
	}
	
	
	//update graphics
	activeScope.resetModButtonGraphics();
	
	onHackWaveChanged();

}



function droneCommandButtonPressed( _scopeIndex : int, _buttonIndex : int )
{

	//drone commands
	if( _scopeIndex == 0 )
	{

		if( _buttonIndex == 0 ) //attk
		{
			attkButtonPressed();
		}
		else if( _buttonIndex == 1 ) //move
		{
			moveButtonPressed();
		}
		else if( _buttonIndex == 2 ) //slvg
		{
			slvgButtonPressed();
		}
		else if( _buttonIndex == 3 ) //dock
		{
			dockButtonPressed();
		}

		scopeList[0].setForHackedState();

	}
	
	
	//power diversion buttons
	if( _scopeIndex == 1 )
	{
	
		if( activeDrone.dronePowerState == _buttonIndex )
		{

			// Turn off power diversion
			activeDrone.dronePowerState = Drone.DRONE_POWER_NONE;

			// Turn off surge as well
			if( activeDrone.hackedScopeList[2] == true )
			{
				activeDrone.surgeState = Drone.SURGE_STATE_RECHARGING;
				scopeList[2].setForHackedState();
			}
			
		}
		else
		{
			activeDrone.dronePowerState = _buttonIndex;
		}

		// Update drone
		activeDrone.adjustStatsForPowerDiversion();

		setActiveDronePerformanceGauges();
		
		scopeList[1].setForHackedState();


		// Update surge if available
		if( activeDrone.hackedScopeList[2] == true )
		{
			scopeList[2].setForHackedState();
		}
		
	}


	// Surge buttons
	if( _scopeIndex == 2 )
	{

		
		if( _buttonIndex == 1 )  // ON Button
		{
		
			// Do nothing if no power diversion is in use, surge is already on, or surge is recharging
			if(
				activeDrone.dronePowerState == Drone.DRONE_POWER_NONE ||
				activeDrone.surgeState == Drone.SURGE_STATE_ON
			)
			{
				return;
			}
			

			// Turn on
			activeDrone.surgeState = Drone.SURGE_STATE_ON;
			
		}
		else if( _buttonIndex == 2 )  // OFF Button
		{

			// Set to recharging (Drone will turn to "ready" state when recharging finishes)
			activeDrone.surgeState = Drone.SURGE_STATE_RECHARGING;
		
		}


		// Update drone after state change
		activeDrone.adjustStatsForPowerDiversion();

		setActiveDronePerformanceGauges();
		
		scopeList[2].setForHackedState();

	}
	
}



function turnOffScopes()
{

	for( var s : int = 0; s < numScopes; s++ )
	{
		
		scopeList[s].defenseWave.gameObject.SetActive( false );
		scopeList[s].hackWave.gameObject.SetActive( false );
		scopeList[s].resultWave.gameObject.SetActive( false );
		scopeList[s].cannotNullifyLabel.gameObject.SetActive( false );
		scopeList[s].activeLight.SetSprite( "Interface-Tactical-WaveActiveLightOFF" );
		
		for( var i : int = 0; i < 4; i++ )
		{
			scopeList[s].setWaveTypeIconVisibility( false );
		}
	
	}

	hideCommandLabels();

}



/////////////////COMMANND BUTTONS



function hideCommandLabels()
{

	// Basic commands
	activeCommandLabel.gameObject.SetActive( false );
	commandRequestLabel.gameObject.SetActive( false );
	
	moveCommandLabel.gameObject.SetActive( false );
	dockCommandLabel.gameObject.SetActive( false );
	attkCommandLabel.gameObject.SetActive( false );
	chrgCommandLabel.gameObject.SetActive( false );
	
	
	// Power diversion
	powerDiversionLabel.gameObject.SetActive( false );
	veloPowerLabel.gameObject.SetActive( false );
	weapPowerLabel.gameObject.SetActive( false );
	shldPowerLabel.gameObject.SetActive( false );
	funcPowerLabel.gameObject.SetActive( false );


	// Surge
	surgeOnCommandLabel.gameObject.SetActive( false );
	surgeOffCommandLabel.gameObject.SetActive( false );
	surgeTitleLabel.gameObject.SetActive( false );
	surgeStateLabel.gameObject.SetActive( false );

	for( var p : int = 0; p < numSurgePowerBars; p++ )
	{
		surgePowerBarArray[p].gameObject.SetActive( false );
	}
	
}



function turnOffCommandRequest()
{

	commandRequestLabel.gameObject.SetActive( false );
	activeDroneWaitingForDestination = false;
	activeDroneWaitingForAttackTarget = false;
	activeDroneWaitingForSalvageTarget = false;

}



function attkButtonPressed()
{

	if( activeDroneWaitingForAttackTarget == true ) //cancel ATTK command
	{
	
		turnOffCommandRequest();
		activeDrone.startIdle();
		
	}
	else
	{
	
		activeDroneWaitingForAttackTarget = true;
		activeDroneWaitingForDestination = false;
		scopeList[0].setForHackedState();
		
		GameManager.instance.SFX_ATTK.Play();
		
	}
	
}



function moveButtonPressed()
{
	
	if( activeDroneWaitingForDestination == true ) //cancel MOVE command
	{
	
		turnOffCommandRequest();
		activeDrone.startIdle();
		
	}
	else
	{
	
		activeDroneWaitingForAttackTarget = false;
		activeDroneWaitingForDestination = true;
		activeDroneWaitingForSalvageTarget = false;
		scopeList[0].setForHackedState();
		
		GameManager.instance.SFX_MOVE.Play();
		
	}
	
}



function dockButtonPressed()
{

	if( activeDrone.state == activeDrone.DRONE_STATE_DOCK )
	{
	
		turnOffCommandRequest();
		activeDrone.startIdle();
		
	}
	else
	{
	
		turnOffCommandRequest();	
		activeDrone.startDock();
		
		GameManager.instance.SFX_DOCK.Play();
		
	}

}



function slvgButtonPressed()
{
	
	if( activeDroneWaitingForSalvageTarget == true ) //cancel SLVG command
	{
	
		turnOffCommandRequest();
		activeDrone.startIdle();
		
	}
	else
	{
	
		activeDroneWaitingForAttackTarget = false;
		activeDroneWaitingForDestination = false;
		activeDroneWaitingForSalvageTarget = true;
		scopeList[0].setForHackedState();
		
		GameManager.instance.SFX_CLLD.Play();
		
	}
	
}



/////////////////DOCKING



function addSavedDronesToDockSlots()
{

	Debug.Log("addSavedDronesToDockSlots");

	for( var d : int = 0; d < 3; d++ )
	{

		if( PlayerData.instance.dockedDroneData[d] == null )
		{
			Debug.Log("dockedDroneData doesn't exist");
			continue;
		}

		var modelString = PlayerData.instance.dockedDroneData[d].modelString;

		if( modelString == "" )
		{
			Debug.Log("dockedDroneData -1");
			continue;
		}


		//setup new drone
		Debug.Log("setting up drone of type: " + modelString);
		var drone : Drone = getFreeDrone();
		drone.initializeDockedDrone( modelString );

		addDroneToFreeDockSlot( drone );

	}

}



function attemptDroneDock( _drone : Drone )
{

	addDroneToFreeDockSlot( _drone );

}



function addDroneToFreeDockSlot( _drone : Drone ) : boolean
{

	for( var d : int = 0; d < PlayerData.instance.dockLevel; d++ )
	{
	
		if( dockSlotList[d].drone == null )
		{

			// Remove any collected items from drone.
			if( _drone.hasItem )
			{
				_drone.hasItem = false;
				_drone.itemGraphic.gameObject.SetActive( false );
				collectedItems += 1;
				collectedItemsLabel.text = "ITEMS: " +  collectedItems.ToString("D3");
				collectedItemsLabel.Commit();
			} 
		
			dockSlotList[d].startPreparingToDock( _drone );
			return;
			
		}
		
	}

	//send message if unable
	var docksFullMessage : String = "UNABLE TO DOCK\nDOCKS FULL";
	addMessage( docksFullMessage );

}



function getNumberOfDocksUsed() : int
{

	var numDockSlotsUsed : int = 0;
	
	for( var d : int = 0; d < 3; d++ )
	{
	
		if( dockSlotList[d].drone != null )
		{
		
			//is drone actually giving power to Stratolith?
			if( dockSlotList[d].drone.health > 0.0 && mainPower < 100.0 )
			{
				numDockSlotsUsed++;
			}
			
		}
		
	}
	
	return numDockSlotsUsed;
	
}



///////////////////////////////////////////////////////////////////////////
// Items
///////////////////////////////////////////////////////////////////////////



function selectItem( _buttonScript : ButtonScript )
{

	var item : ItemLocator = _buttonScript.gameObject.GetComponent( ItemLocator );

	deselectRadarObject();

	if( cannonModeActive == true )
		turnOffCannon();
	
	//play audio
	GameManager.instance.SFX_BUTTON_PRESS.Play();
	
	
	//change drone stats under radar
	activeDroneModelLabel.text = "----";
	activeDroneModelLabel.Commit();
	
	activeDronePowerLabel.text = "----";
	activeDronePowerLabel.Commit();

	setSelectionLines( true );
	updateSelectionLines( item.gameObject.transform.position );

}



function makeNewItem( _position : Vector2 ) : ItemLocator
{

	// Find a free space in the list
	for( var i : int = 0; i < numItems; i++ )
	{

		// Skip array elements that exist
		if( itemLocatorList[i] )
			continue;
		
		var itemGameObject : GameObject = GameObject.Instantiate(
			itemLocatorPrefab,
			Vector3( 0.0, 0.0, 0.0 ),
			itemLocatorPrefab.transform.rotation
		);

		itemGameObject.transform.parent = worldMap.transform;

		itemLocatorList[i] = itemGameObject.GetComponent( ItemLocator );
    	itemLocatorList[i].onInitialize( _position );

    	// ButtonScript component
    	var itemButton : ButtonScript = itemGameObject.GetComponent( ButtonScript );
		sl.addButton( itemButton );
		itemButton.onTouchDownInsideDelegate = selectItem;

		return itemLocatorList[i];

	}

	return null;

}



function getFreeItem() : ItemLocator
{

	for( var i : int = 0; i < numItems; i++ )
	{

		if( !itemLocatorList[i] )
			continue;

		if( itemLocatorList[i].isActive == true )
			continue;

		return itemLocatorList[i];

	}

	return null;

}



function placeItemAtPosition( _position : Vector2 )
{

	var item : ItemLocator = makeNewItem( _position );

}



function onDroneCollectItem( _drone : Drone )
{

	// Skip if item has been deactivated
	if( _drone.targetItem.isActive == false )
		return;


	// Deactivate target item
	_drone.targetItem.deactivate();


	// Change drone graphic
	_drone.hasItem = true;
	_drone.itemGraphic.gameObject.SetActive( true );

}

///////////////////////////////////////////////////////////////////////////
// Stratolith movement
///////////////////////////////////////////////////////////////////////////



function stratolithDirectionKnobPressed( _button )
{

	Debug.Log( "stratolithDirectionKnobPressed" );
	
	draggingStratolithDirectionKnob = true;

}



function stratolithMoveButtonPressed( _button )
{

	Debug.Log( "stratolithMoveButtonPressed" );
	
	if( stratolithMoving == true )
	{
		stratolithMoving = false;
		stratolithMoveButton.setupButtonGraphics( "Interface-Tactical-ComButtonOFF", "Interface-Tactical-ComButtonOFFpressed" );
	}
	else
	{
		stratolithMoving = true;
		stratolithMoveButton.setupButtonGraphics( "Interface-Tactical-ComButtonON2", "Interface-Tactical-ComButtonONpressed" );
	}
	

}



///////////////////////////////////////////////////////////////////////////
// Cannon
///////////////////////////////////////////////////////////////////////////



function updateCannon()
{

	var maxLength : float = scannerWidth;
	var length : float = maxLength * scopeList[0].knob.knobPosition;
	var rotation : float = scopeList[0].hackWaveData.phaseKnob * 6.28;

	var xcomp : float = Mathf.Sin( rotation ) * length;
	var ycomp : float = Mathf.Cos( rotation ) * length;

	cannonTarget.gameObject.transform.position = shieldScannerCenter.position + Vector3( xcomp, ycomp );

}



function cannonButtonPressed()
{


	if( cannonModeActive == true )
	{
	
		turnOffCannon();
		
	}
	else
	{
	
		cannonModeActive = true;
		
		deselectRadarObject();
		
		// scopeList[0].resetWaves();


		// activate circle
		cannonTarget.gameObject.SetActive( true );
		

	}

}



function turnOffCannon()
{

	var position : Vector2 = cannonTarget.gameObject.transform.position;

	// Check for nearby drone to disable
	for( var d : int = 0; d < numDrones; d++ )
	{
		
		var drone : Drone = droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
			
			
		//skip other docked and dying drones
		if(
			drone.state == Drone.DRONE_STATE_PREPARING_TO_DOCK ||
			drone.state == Drone.DRONE_STATE_DOCKED ||
			drone.state == Drone.DRONE_STATE_PREPARING_TO_LAUNCH ||
			drone.state == Drone.DRONE_STATE_CHARGED_TO_DEATH ||
			drone.state == Drone.DRONE_STATE_DYING
		)
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		var collisionRange : float = 50.0;
		
		if( distance < collisionRange )
		{

			if( drone.hackedScopeList[0] == false )
			{

				// Hack drone
				// drone.hackedScopeList[0] = true;
				// drone.startIdle();
				// GameManager.instance.currentStage.remainingHostileDrones -= 1;
				// drone.setDroneColor();
				// GameManager.instance.SFX_DRONE_HACKED.Play();

				// Damage drone
				drone.damageDrone( 20.0 );

			}

		}
		
	}


	cannonModeActive = false;  // Toggle off state

	cannonTarget.gameObject.SetActive( false );  // Toggle off circle

	turnOffScopes();

}



//STANDBY BUTTON



function standbyButtonPressed()
{

	gm.goFromGameToCatalog();

}







