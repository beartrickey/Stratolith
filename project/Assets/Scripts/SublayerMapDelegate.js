#pragma strict

public static var instance : SublayerMapDelegate;


public var gm : GameManager;
public var sl : Sublayer;


// MAP STATE
public static var MAP_STATE_INTRO_1 = 0;  // Radar elements scale into existence
public static var MAP_STATE_INTRO_2 = 1;  // Stage button graphics fade in
public static var MAP_STATE_IDLE = 2;  // Player can freely interface with the map

public var mapState : int = MAP_STATE_INTRO_1;


//Stratolith
public var stratolithIcon : tk2dSprite;
public var destinationStage : Stage = null;  // stage the stratolith is going to
public var destinationSpline : DotSpline = null;
public var selectedStage : Stage = null;  // stage selected by the player
public var stratolithVelocity : float = 0.01;


// STAGE BUTTONS
public var selectionIcon : tk2dSprite;
public var stageButtonSprites : tk2dSprite[];


//PATHS
public var dotPrefab : GameObject = null;
public var stratolithSplineT : float = 0.0;
public var numSplines = 64;
public var splineList = new DotSpline[numSplines];


//BUTTONS
public var mapActionButton : ButtonScript;
public var mapActionButtonSprite : tk2dSprite;
public var standbyButton : ButtonScript;


//LABELS
public var mapActionLabel : tk2dTextMesh;
public var stageIdLabel : tk2dTextMesh;


//frame
public var frameNumber : int = 0;


//INTRO EFFECT
public var introCounter : int = 0;
public var numFadeInElements : int = 32;
public var mapFadeInElementList = new tk2dSprite[numFadeInElements];
public var fadingInElements : boolean = false;
public var fadeRate : float = 0.75;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerMapUpdate;


	// // Load saved data about stages
	// Debug.Log('Loading stages');
	// gm.loadStages();


	// //start at stage 00
	// selectedStage = gm.currentStage;


	// //update labels/graphics for current stage
	// updateMapLabels();


	// // Stratolith icon
	// stratolithIcon.gameObject.transform.position = gm.currentStage.gameObject.transform.position;
	// stratolithIcon.gameObject.SetActive( false );


	// // Selection icon
	// selectionIcon.gameObject.transform.position = gm.currentStage.gameObject.transform.position;
	// selectionIcon.gameObject.SetActive( false );
	
	
	// // Start button
	// sl.addButton( mapActionButton );
	// mapActionButton.setupButtonGraphics( "Interface-Map-CommenceOpButtonOFF-LEDon", "Interface-Map-CommenceOpButtonON-LEDon" );
	// 	mapActionButton.onTouchUpInsideDelegate = mapActionButtonPressed;


	// // Standby button
	// sl.addButton( standbyButton );
	// standbyButton.onTouchDownInsideDelegate = standbyButtonPressed;
	
	
	// // Create Stage Buttons
	// Debug.Log('Create Stage Buttons');
	// var stageButtonPrefab : GameObject = Resources.Load("MapStageButton");
	// var tempSpriteArray = new Array();
	// for( var s : int = 0; s < gm.numStages; s++ )
	// {

	// 	var stage : Stage = gm.stageList[s];

	// 	if( stage == null )
	// 		continue;

	// 	// GameObject instantiation and positioning
	// 	var stageButtonGameObject = GameObject.Instantiate( stageButtonPrefab, Vector3.zero, stageButtonPrefab.transform.rotation );
 //        stageButtonGameObject.transform.parent = SublayerMapDelegate.instance.gameObject.transform;
 //        stageButtonGameObject.transform.position = stage.gameObject.transform.position;
	

	// 	// Setup button
	// 	var stageButton : ButtonScript = stageButtonGameObject.GetComponent( ButtonScript );
	// 	sl.addButton( stageButton );
	// 	stageButton.onTouchDownInsideDelegate = stageButtonPressed;
	// 	stageButton.buttonTag = stage.stageId;


	// 	// Setup sprite
	// 	var sprite : tk2dSprite = stageButtonGameObject.GetComponent( tk2dSprite );
	// 	tempSpriteArray.Push( sprite );
	// 	sprite.color.a = 0.0;
	// 	stageButtonGameObject.SetActive( true );

	// 	if( stage.state == Stage.STAGE_STATE_CLEARED )
	// 	{
	// 		sprite.SetSprite( "Map-ConflictLocation-Played" );
	// 	}
	// 	else if( stage.state == Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED )
	// 	{
	// 		sprite.SetSprite( "Map-ConflictLocation-Unplayed" );
	// 	}
	// 	else
	// 	{
	// 		stageButtonGameObject.SetActive( false );
	// 	}
	
	// }
	// stageButtonSprites = tempSpriteArray.ToBuiltin(tk2dSprite) as tk2dSprite[];


	// // Splines
	// var gos : GameObject[];
	// gos = GameObject.FindGameObjectsWithTag("MapSpline");
 //    for( var i : int = 0; i < gos.length; i++ )
 //    {
 //    	splineList[i] = gos[i].GetComponent( DotSpline );
 //    }


	// // Fade in effect
	// resetFadeInElements();
	
}



//////////////////////////////////////////INTRO



// function resetFadeInElements()
// {

// 	Debug.Log("resetFadeInElements");

// 	for( var i : int = 0; i < numFadeInElements; i++ )
// 	{

// 		var element = mapFadeInElementList[i];

// 		if( element == null )
// 			continue;

// 		element.color.a = 0.0;
// 		element.scale.x = 0.0;

// 	}

// 	fadingInElements = true;

// }



// function fadeEnd()
// {

// 	// Update state
// 	mapState = MAP_STATE_INTRO_2;

// 	// Snap all elements to correct size
// 	for( var i : int = 0; i < numFadeInElements; i++ )
// 	{

// 		var element = mapFadeInElementList[i];

// 		if( element == null )
// 			continue;

// 		element.color.a = 1.0;
// 		element.scale.x = 1.0;

// 	}

// }



// function fadeInStageButtons()
// {

// 	Debug.Log("fadeInStageButtons");

// 	for( var i : int = 0; i < stageButtonSprites.length; i++ )
// 	{

// 		var sprite : tk2dSprite = stageButtonSprites[i];
// 		sprite.color.a += 0.025;

// 	}

// 	if( stageButtonSprites[0].color.a >= 1.0 )
// 	{

// 		mapState = MAP_STATE_IDLE;

// 		// Init splines
// 		initStageSplines( gm.currentStage );

// 		// Show stratolith icon
// 		stratolithIcon.gameObject.SetActive( true );

// 		// Show selection icon
// 		selectionIcon.gameObject.SetActive( true );

// 	}

// }



// function updateFadeInElements()
// {

// 	fadingInElements = false;

// 	for( var i : int = 0; i < numFadeInElements; i++ )
// 	{

// 		var element = mapFadeInElementList[i];


// 		// skip null elements
// 		if( element == null )
// 			continue;


// 		// skip elements that haven't started yet
// 		if( element.color.a == 0.0 )
// 		{
// 			fadingInElements = true;
// 			continue;
// 		}


// 		// snap
// 		if( element.color.a >= 0.99 )
// 		{
// 			element.color.a = 1.0;
// 			element.scale.x = 1.0;
// 			continue;
// 		}


// 		// increment
// 		var dif : float = 1.0 - element.color.a;
// 		var reducedDif : float = dif * fadeRate;
// 		var newScale : float = 1.0 - reducedDif;
// 		element.color.a += newScale;
// 		element.scale.x += newScale;


// 		// continue fading in
// 		if( element.color.a < 1.0 )
// 			fadingInElements = true;

// 	}

// 	if( fadingInElements == false )
// 		fadeEnd();

// }



// function chooseRandomFadeInElement()
// {

// 	var randIndex : int = Random.Range(0, numFadeInElements);

// 	var randElement = mapFadeInElementList[randIndex];

// 	if( randElement == null )
// 		return;

// 	if( randElement.color.a == 0.0 )
// 	{
// 		randElement.color.a = 0.01;
// 		randElement.scale.x = 0.01;
// 	}

// }



// //////////////////////////////////////////STRATOLITH RELOCATION



// function mapActionButtonPressed()
// {

// 	if( gm.currentStage != null )
// 	{

// 		if( gm.currentStage == selectedStage ) //start game
// 		{

// 			gm.goFromMapToGame();

// 			//clear all splines
// 			clearMapSplines();

// 		}
// 		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == true )
// 		{

// 			beginStratolithRelocation();

// 		}

// 	}

// }



// function stageButtonPressed( _button : ButtonScript )
// {

// 	var stageId : int = _button.buttonTag;

// 	selectedStage = gm.getStageForId( stageId );


// 	// Position and color the selection icon
// 	selectionIcon.gameObject.transform.position = selectedStage.gameObject.transform.position;

// 	if( selectedStage.state == Stage.STAGE_STATE_CLEARED )
// 		selectionIcon.SetSprite( "Map-Selection-Played" );
// 	else
// 		selectionIcon.SetSprite( "Map-Selection-Unplayed" );


// 	// Change the operation button based on stage distance
// 	if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == true || gm.currentStage == selectedStage )
// 		mapActionButton.setupButtonGraphics( "Interface-Map-CommenceOpButtonOFF-LEDon", "Interface-Map-CommenceOpButtonON-LEDon" );
// 	else
// 		mapActionButton.setupButtonGraphics( "Interface-Map-CommenceOpButtonOFF-LEDoff", "Interface-Map-CommenceOpButtonON-LEDoff" );


// 	// Update Labels
// 	updateMapLabels();

// }



// function beginStratolithRelocation()
// {

// 	destinationStage = selectedStage;

// 	setDestinationSpline();

// 	gm.currentStage = null;

// 	updateMapLabels();

// }



// function updateStratolithIconPosition()
// {

// 	// bail if no destination
// 	if( destinationStage == null )
// 		return;

// 	stratolithSplineT += stratolithVelocity;

// 	// clamp on either end
// 	if( stratolithSplineT > 1.0 )
// 		stratolithSplineT = 1.0;
// 	if( stratolithSplineT < 0.0 )
// 		stratolithSplineT = 0.0;

// 	var newStratolithPosition : Vector2 = destinationSpline.getLocationAlongSpline( stratolithSplineT );

// 	stratolithIcon.gameObject.transform.position = Vector3( newStratolithPosition.x, newStratolithPosition.y, stratolithIcon.gameObject.transform.position.z);

// 	stratolithIcon.gameObject.transform.localEulerAngles.z = destinationSpline.getTangentAtPoint(stratolithSplineT, newStratolithPosition);

// 	// stop when Stratolith gets to either end
// 	if( stratolithSplineT == 1.0 || stratolithSplineT == 0.0 )
// 	{
// 		stratolithArrivedAtNewStage();
// 	}

// }



// function stratolithArrivedAtNewStage()
// {

// 	//clear all splines
// 	clearMapSplines();

// 	gm.currentStage = destinationStage;

// 	destinationStage = null;


// 	// Change behavior based on new stage state
// 	if( gm.currentStage.state == Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED )
// 	{

// 		// Start stage immediately
// 		gm.goFromMapToGame();

// 	}
// 	else
// 	{
// 		// Don't start stage

// 		updateMapLabels();

// 		//turn on map splines for new stage
// 		initStageSplines( gm.currentStage );

// 	}

// }



// function updateMapLabels()
// {

// 	//selected stage label
// 	stageIdLabel.text = "stage_" + selectedStage.stageId.ToString("D2");
// 	stageIdLabel.Commit();


// 	//action labels
// 	if( gm.currentStage != null )
// 	{

// 		if( gm.currentStage == selectedStage )
// 		{
// 			//start game if stratolith currently over stage
// 			// mapActionLabel.text = "Start Operation";
// 		}
// 		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == true ) //relocate
// 		{
// 			//move to new stage as long as it's not locked
// 			// mapActionLabel.text = "Relocate";
// 		}
// 		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == false ) //show nothing
// 		{
// 			//don't move to locked stages
// 			// mapActionLabel.text = "----";
// 		}

// 	}
// 	else if( destinationStage != null )
// 	{

// 		if( selectedStage == destinationStage )
// 		{
// 			// mapActionLabel.text = "- Relocation In Progress -";
// 		}

// 	}


// 	// mapActionLabel.Commit();

// }



// //////////////////////////////////////////STANDBY



// function standbyButtonPressed()
// {

// 	gm.goFromMapToStandby();

// }



// //////////////////////////////////////////UPDATE



function sublayerMapUpdate()
{

	//frame
	frameNumber++;


// 	//update stratotlith icon
// 	updateStratolithIconPosition();


// 	//update splines
// 	updateMapSplines();


// 	//fade in
// 	if( mapState == MAP_STATE_INTRO_1 )
// 	{

// 		updateFadeInElements();

// 		// if( frameNumber % 2 == 0 )
// 		chooseRandomFadeInElement();

// 	}
// 	else if( mapState == MAP_STATE_INTRO_2 )
// 	{

// 		fadeInStageButtons();

// 	}

}



// //////////////////////////////////////SPLINES



// function initStageSplines( startStage : Stage )
// {

// 	for( var i : int = 0; i < numSplines; i++ )
// 	{

// 		// Skip null elements
// 		if( splineList[i] == null )
// 		{
// 			continue;
// 		}

// 		if(
// 			( splineList[i].stageA == startStage && gm.canRelocateBetweenStages( startStage, splineList[i].stageB ) == true ) ||
// 			( splineList[i].stageB == startStage && gm.canRelocateBetweenStages( startStage, splineList[i].stageA ) == true )
// 		)
// 		{

// 			splineList[i].initSpline( startStage );

// 		}

// 	}

// }



// function setDestinationSpline()
// {

// 	// Figures out which spline to use for moving between currentStage and destinationStage

// 	for( var i : int = 0; i < numSplines; i++ )
// 	{

// 		if( splineList[i] == null )
// 			continue;

// 		if( splineList[i].stageA == gm.currentStage && splineList[i].stageB == destinationStage )
// 		{

// 			stratolithVelocity = Mathf.Abs( stratolithVelocity );
// 			stratolithSplineT = 0.0;
// 			destinationSpline = splineList[i];
// 			return;

// 		}
// 		else if( splineList[i].stageA == destinationStage && splineList[i].stageB == gm.currentStage )
// 		{

// 			stratolithVelocity = -1 * Mathf.Abs( stratolithVelocity );
// 			stratolithSplineT = 1.0;
// 			destinationSpline = splineList[i];
// 			return;

// 		}

// 	}

// }



// function updateMapSplines()
// {

// 	for( var i : int = 0; i < numSplines; i++ )
// 	{

// 		if( splineList[i] == null )
// 			continue;


// 		if( splineList[i].splineDotList[0] != null )
// 		{

// 			splineList[i].updateSpline();

// 		}

// 	}

// }



// function clearMapSplines()
// {

// 	for( var i : int = 0; i < numSplines; i++ )
// 	{

// 		if( splineList[i] == null )
// 			continue;


// 		if( splineList[i].splineDotList[0] != null )
// 		{

// 			splineList[i].cleanSpline();

// 		}

// 	}

// }





