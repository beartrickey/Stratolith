#pragma strict



//singleton ref
public static var instance : SublayerGameDelegate = null;


//other objects
public var gm : GameManager;
public var sl : Sublayer;
public var im : InputManager;


//frame
public var frameNumber : int = 0;


//base graphics
public var panel : tk2dSprite = null;

//scanner
public var shieldScannerCenter : Transform;
public static var scannerWidth : float = 540.0;

public var incomingDroneIconList = new IncomingDroneIcon[3];


//drones
public var dronePrefab : GameObject;
public static var numDrones : int = 8;
public var droneList = new Drone[numDrones];
public var activeDrone : Drone;


//misc graphics
public var dotPrefab : GameObject;


//visual effects
public var redAlarm : tk2dSprite;
public var blueAlarm : tk2dSprite;
public var radarStaticEffect : Renderer;


//selection lines
public var selectionLineUp : tk2dSprite;
public var selectionLineDown : tk2dSprite;
public var selectionLineLeft : tk2dSprite;
public var selectionLineRight : tk2dSprite;


//bullets
public var bulletPrefab : GameObject;
public static var numBullets : int = 8;
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


//drone command buttons
public var activeDroneWaitingForDestination : boolean = false;
public var activeDroneWaitingForAttackTarget : boolean = false;
public var activeDroneWaitingForSalvageTarget : boolean = false;


//docking
public var dockSlotList = new DockSlot[3];


//rscan
public var rScanCircle : tk2dSprite = null;
public var rScanItemLocator : tk2dSprite;
public var rScanButton : ButtonScript;
public var rScanModeActive : boolean;

public var rScanItemRotation : float = 0.0;
public var rScanItemLength : float = 400.0;


//Messaging
//TODO: make separate message and manager compontents for more complicated messaging system
//	-recurring
//	-custom time span
//	-message intro/outro animation

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
	
	
	// R-Scan button
	sl.addButton( rScanButton );
	rScanButton.onTouchDownInsideDelegate = rScanButtonPressed;


	// Item Locator button
	sl.addButton( rScanItemLocator.gameObject.GetComponent( ButtonScript ) );
	
	
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
	
	turnOffScopes();
	
	setScopesForScopeLevel();
	
	
	//make drones
	for( var d : int = 0; d < numDrones; d++ )
	{
		
		var droneGameObject : GameObject = GameObject.Instantiate( dronePrefab, Vector3( 0.0, 0.0, -50.0 ), dronePrefab.transform.rotation );
		droneGameObject.transform.parent = gameObject.transform;
		var drone : Drone = droneGameObject.GetComponent( Drone );
		droneList[d] = drone;
		
		drone.onInstantiate();
		
	
		var droneButton : ButtonScript = droneGameObject.GetComponent( ButtonScript );
		sl.addButton( droneButton );
		droneButton.onTouchDownInsideDelegate = selectDrone;
		droneButton.buttonTag = d;
	
	}
	
	
	
	//make bullets
	for( var b : int = 0; b < numBullets; b++ )
	{
		
		var bulletGameObject : GameObject = GameObject.Instantiate( bulletPrefab, Vector3( 0.0, 0.0, -50.0 ), bulletPrefab.transform.rotation );
		bulletGameObject.transform.parent = gameObject.transform;
		var bullet : Bullet = bulletGameObject.GetComponent( Bullet );
		bulletList[b] = bullet;
		
		bullet.onInstantiate();
	
	}
	
}



//////////////////////////////////////////////////CLEARING SCENE



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

	gm.currentStage.foundHealthItems = 0;

}



//////////////////////////////////////////////////GAME FLOW and TRANSITIONS



function startGame()
{

	GameManager.instance.SFX_NEW_RADAR_ENTITY.Play();
	
	resetVarsForNewStage();

	addSavedDronesToDockSlots();
	
	gm.currentStage.initStage();

}



function abortStage()
{

	deselectDrone();
	
	clearScene();

}



function stageSuccessfullyCleared()
{

	// update map
	gm.onStageClear();


	// save data
	PlayerData.instance.saveData();

	deselectDrone();
	
	clearScene();
		
	gm.goFromGameToGameClear();

}



function stageLost()
{

	deselectDrone();
	clearScene();
	
	gm.goFromGameToGameOver();

}



//////////////////////////////////////////////////UPDATE



function sublayerGameUpdate()
{

	frameNumber++;

	updateStateMachine();
	
	
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
	
	
	//complete r-scan if top scope is hacked
	if( 
		rScanModeActive == true &&
		scopeList[0].state == Scope.SCOPE_STATE_HACKED
	)
	{
		rScanSuccess();
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
	hostileDronesRemainingLabel.text = gm.currentStage.remainingHostileDrones.ToString("D2");;
	hostileDronesRemainingLabel.Commit();
	
	
	//game clear condition
	if( state == GAME_STATE_STAGE && gm.currentStage.remainingHostileDrones <= 0 )
	{
	
		state = GAME_STATE_END_SUCCESS_DELAY;
		machineStateCounter = 300;
		
	}
		
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
	
	
	//update rscan if active
	if( rScanModeActive == true )
	{
	
		updateRScan();
	
	}
	
	
	//update active drone stats
	if( activeDrone != null )
	{
		activeDronePowerLabel.text = activeDrone.health + "p";
		activeDronePowerLabel.Commit();
	}
	

	//drones
	for( var d : int = 0; d < numDrones; d++ )
	{
	
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
	
	
	for( d = 0; d < Stage.numDronePaths; d++ )
	{	
		
		var path : DronePath = gm.currentStage.dronePathList[d];
		
		
		// skip if path is null
		if( path == null )
			continue;
		
		
		// skip if already appeared
		if( path.delayCounter <= -1 )
			continue;
		
		
		// Find free icon and set it
		for( i = 0; i < 3; i++ )
		{
		
			var icon : IncomingDroneIcon = incomingDroneIconList[i];
			
			
			// skip if already active
			if( icon.gameObject.activeSelf == false )
			{

				// Init and display icon at edge of radar where drone will appear
				icon.dronePath = path;
				icon.gameObject.SetActive( true );

				var iconDistanceFromCenter : float = scannerWidth - 20.0;
				var firstPointPosition : Vector2 = path.getPositionForIndex(0);
				var direction : Vector2 = (firstPointPosition - shieldScannerCenter.transform.position).normalized;
				var position : Vector2 = direction * iconDistanceFromCenter;
				position += shieldScannerCenter.transform.position;
				icon.gameObject.transform.position = position;

				// Rotate icon
				var iconAngleInRads : float = Mathf.Atan2( direction.x, direction.y );
				var iconAngleInDegrees : float = iconAngleInRads * Mathf.Rad2Deg;
				iconAngleInDegrees -= 180.0;
				iconAngleInDegrees = Mathf.Abs( iconAngleInDegrees );
				icon.gameObject.transform.eulerAngles.z = iconAngleInDegrees + 180.0;

				// Position label to the inside of the radar
				var labelOffset : Vector2 = (shieldScannerCenter.transform.position - position).normalized * 50.0;
				icon.distanceLabel.gameObject.transform.position = position + labelOffset;
				icon.distanceLabel.gameObject.transform.eulerAngles.z = 0.0;

				// Update distance counter
				icon.distanceLabel.text = path.delayCounter.ToString("D2") + " MU";
				icon.distanceLabel.Commit();
				
				break;

			}
		
		}
	
	}

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
	
	
	// update waves for unhacked scopes
	if( activeScope.state == Scope.SCOPE_STATE_UNHACKED )
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
	if( Application.platform != RuntimePlatform.OSXEditor && Application.platform != RuntimePlatform.IPhonePlayer )
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
	if( Application.platform == RuntimePlatform.OSXEditor || Application.platform != RuntimePlatform.IPhonePlayer )
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
    		if( Application.platform != RuntimePlatform.OSXEditor && Application.platform != RuntimePlatform.IPhonePlayer )
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
    		
    		
    		//update stage
			if( gm.currentStage != null )
			{
				gm.currentStage.updateStage();
			}			
	
    		break;
    
    }

}



/////////////////////////////////////////////////BUTTONS



function selectDrone( _button : ButtonScript )
{

	Debug.Log( "selectDrone" );


	//disallow if in rscan mode?
	if( rScanModeActive == true )
		turnOffRScan();
	
	
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
	selectionLineUp.gameObject.SetActive( true );
	selectionLineDown.gameObject.SetActive( true );
	selectionLineLeft.gameObject.SetActive( true );
	selectionLineRight.gameObject.SetActive( true );
	
	
	//change drone stats under radar
	activeDroneModelLabel.text = activeDrone.modelString;
	activeDroneModelLabel.Commit();
	
	activeDronePowerLabel.text = activeDrone.health + "p";
	activeDronePowerLabel.Commit();
	
	
	//change blueprint
	activeDroneBlueprint.gameObject.SetActive( true );
	var spriteId : int = -1;

	if( activeDrone.droneType == Drone.DRONE_MODEL_RAND )
	{
		// Do nothing
	}
	else
	{
		spriteId = Drone.droneBlueprintSpriteId[ activeDrone.droneType ];	
	}
	
	
	if( spriteId != -1 )
		activeDroneBlueprint.SetSprite( spriteId );
	
	
	//reset drone colors
	resetDroneColors();
	
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
	
		if( droneList[d].isActive == false )
			continue;
			
		droneList[d].setDroneColor();
		
	}

}



function deselectDrone()
{

	if( activeDrone == null )
		return;
	
	activeDroneWaitingForDestination = false;
	
	activeDroneWaitingForAttackTarget = false;

	activeDroneWaitingForSalvageTarget = false;
	
	// activeDrone.turnOffAllCommandButtonGraphics();

	disconnectDroneFromScopes();
	
	activeDrone = null;
	
	turnOffScopes();
	
	resetDroneColors();
	
	
	//turn selection lines off
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
	
	
	//stop audio
	GameManager.instance.SFX_NULLIFICATION_IN_PROGRESS.Stop();

}



// function droneSuccessfullyHacked()
// {

// 	//drone changes
// 	activeDrone.droneSuccessfullyHacked();
	
	
// 	//ui changes
// 	hideScopeButtons();
	// activeDrone.resetCommandButtonGraphics();


// 	//message

// 	var droneHackMessage : String = activeDrone.modelString + " DRONE NULLIFIED";
// 	addMessage( droneHackMessage );
	
	
// 	//stop audio
// 	GameManager.instance.SFX_NULLIFICATION_IN_PROGRESS.Stop();

// }



///////////////////////SCOPES



function setScopesForScopeLevel()
{

	if( PlayerData.instance.scopeLevel == 1 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = true;
		scopeList[2].locked = true;
		panel.SetSprite( "Interface-Tactical-State1Base" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 126.7359, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 128.9894, -225.0 );
	}
	else if( PlayerData.instance.scopeLevel == 2 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = false;
		scopeList[2].locked = true;
		panel.SetSprite( "Interface-Tactical-State2Base" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 332.5808, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 335.1377, -225.0 );

		scopeList[1].gameObject.transform.position = Vector3( 613.5668, -77.90067, 0.0 );
		scopeTwoLabels.transform.position = Vector3( 490.4458, -77.90067, -225.0 );
	}
	else if( PlayerData.instance.scopeLevel == 3 )
	{
		scopeList[0].locked = false;
		scopeList[1].locked = false;
		scopeList[2].locked = false;

		panel.SetSprite( "Interface-Tactical-State3Base" );

		scopeList[0].gameObject.transform.position = Vector3( 613.5668, 537.2813, 0.0 );
		scopeOneLabels.transform.position = Vector3( 490.4458, 537.2813, -225.0 );

		scopeList[1].gameObject.transform.position = Vector3( 613.5668, 127.4803, 0.0 );
		scopeTwoLabels.transform.position = Vector3( 490.4458, 127.4803, -225.0 );

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
	if( rScanModeActive == true )
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
		
			activeDrone.dronePowerState = -1; //turn off power diversion
			
		}
		else
		{
		
			activeDrone.dronePowerState = _buttonIndex;
			
		}

		activeDrone.adjustStatsForPowerDiversion();
		
		scopeList[1].setForHackedState();
		
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

	activeCommandLabel.gameObject.SetActive( false );
	commandRequestLabel.gameObject.SetActive( false );
	
	moveCommandLabel.gameObject.SetActive( false );
	dockCommandLabel.gameObject.SetActive( false );
	attkCommandLabel.gameObject.SetActive( false );
	chrgCommandLabel.gameObject.SetActive( false );
	
	
	powerDiversionLabel.gameObject.SetActive( false );
	
	veloPowerLabel.gameObject.SetActive( false );
	weapPowerLabel.gameObject.SetActive( false );
	shldPowerLabel.gameObject.SetActive( false );
	funcPowerLabel.gameObject.SetActive( false );
	
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

		var droneType = PlayerData.instance.dockedDroneData[d].droneType;

		if( droneType == -1 )
		{
			Debug.Log("dockedDroneData -1");
			continue;
		}


		//setup new drone
		Debug.Log("setting up drone of type: " + droneType);
		var drone : Drone = getFreeDrone();
		drone.initializeDockedDrone( droneType );

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
// R SCAN BUTTON
///////////////////////////////////////////////////////////////////////////



function rScanButtonPressed()
{

	//HACK: Pause for Alex TGS build
	// gm.goFromGameToPause();
	// return;


	if( rScanModeActive == true )
	{
	
		turnOffRScan();
		
	}
	else
	{
	
		rScanModeActive = true;
		
		deselectDrone();
		
		scopeList[0].resetWaves();


		// activate circle
		rScanCircle.gameObject.SetActive( true );
		rScanCircle.color.a = 0.25;
		

		//randomize item position
		rScanItemRotation = Random.Range( 0.0, 6.28 );
		rScanItemLength = Random.Range( 200.0, (scannerWidth - 50.0) );
		// Debug.Log( 'rScanItemRotation: ' + rScanItemRotation );


		//set locator position
		rScanItemLocator.gameObject.transform.position = getRScanItemPosition();

	}

}



function getRScanItemPosition() : Vector3
{
	var xcomp : float = Mathf.Sin( rScanItemRotation ) * rScanItemLength;
	var ycomp : float = Mathf.Cos( rScanItemRotation ) * rScanItemLength;

	return shieldScannerCenter.position + Vector3( xcomp, ycomp );
}



function updateRScan()
{

	// Rate
	var maxAreaUnderGraph : float = 25000.0;
	var minAreaUnderGraph : float = resultWaveThreshold + 250.0;
	var totalPossibleArea : float = maxAreaUnderGraph - minAreaUnderGraph;
	var scaledCloseness : float = 1.0 - ((scopeList[0].areaUnderCurve - minAreaUnderGraph) / totalPossibleArea);

	var baseRate : float = 1.01;
	var rate : float = baseRate + (scaledCloseness * 0.075);


	// Increase cirlce size
	rScanCircle.gameObject.transform.localScale.x *= rate;
	rScanCircle.gameObject.transform.localScale.y *= rate;


	// Reset back to center
	if( rScanCircle.gameObject.transform.localScale.x > 11.0 )
	{
		rScanCircle.gameObject.transform.localScale.x = 1.0;
		rScanCircle.gameObject.transform.localScale.y = 1.0;
	}

}



function rScanSuccess()
{

	turnOffRScan();

	rScanItemLocator.gameObject.SetActive( true );


	//update messag
	var rScanSuccessMessage : String = "R-SCAN COMPLETE:\nSEND SALVAGE DRONE ";
	addMessage( rScanSuccessMessage );

}



function onDroneCollectItem( _drone : Drone )
{

	_drone.hasItem = true;
	_drone.itemGraphic.gameObject.SetActive( true );
	rScanItemLocator.gameObject.SetActive( false );

}



function turnOffRScan()
{

	rScanModeActive = false;  // Toggle off state

	rScanCircle.gameObject.SetActive( false );  // Toggle off circle

	turnOffScopes();

}



//STANDBY BUTTON



function standbyButtonPressed()
{

	gm.goFromGameToCatalog();

}



