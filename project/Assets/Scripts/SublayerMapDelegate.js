﻿#pragma strict

public static var instance : SublayerMapDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//Stratolith
public var stratolithIcon : tk2dSprite;
public var currentStage : Stage = null;  // stage the stratolith is currently on
public var destinationStage : Stage = null;  // stage the stratolith is going to
public var destinationSpline : DotSpline = null;
public var selectedStage : Stage = null;  // stage selected by the player
public var stratolithVelocity : float = 0.01;


// STAGE DOT
public var stageList = new Array();
public var stageDotPrefab : GameObject = null;


//PATHS
public var dotPrefab : GameObject = null;
public var stratolithSplineT : float = 0.0;
public var numSplines = 64;
public var splineList = new DotSpline[numSplines];


//BUTTONS
public var mapActionButton : ButtonScript;
public var standbyButton : ButtonScript;


//LABELS
public var mapActionLabel : tk2dTextMesh;
public var stageIdLabel : tk2dTextMesh;


//frame
public var frameNumber : int = 0;


//FADE IN EFFECT
public var numFadeInElements : int = 16;
public var mapFadeInElementList = new tk2dSprite[numFadeInElements];
public var fadingInElements : boolean = false;
public var fadeRate : float = 0.75;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerMapUpdate;


	//start at stage 00
	selectedStage = gm.currentStage;


	//update labels/graphics for current stage
	updateMapLabels();

	stratolithIcon.gameObject.transform.position = gm.currentStage.gameObject.transform.position;
	
	
	//start button
	sl.addButton( mapActionButton );
	mapActionButton.onTouchDownInsideDelegate = mapActionButtonPressed;
	
	
	// Create Stage Dots and Buttons
	// for( var s : int = 0; s < gm.numStages; s++ )
	// {

		// if( stageList[s] == null )
		// 	continue;
	
		// var stageButton : ButtonScript = stageList[s].gameObject.GetComponent( ButtonScript );
		// sl.addButton( stageButton );
		// stageButton.onTouchDownInsideDelegate = stageButtonPressed;
		// stageButton.buttonTag = stageList[s].stageId;
	
	// }


	//splines
	var gos : GameObject[];
	gos = GameObject.FindGameObjectsWithTag("MapSpline");
    for( var i : int = 0; i < gos.length; i++ )
    {
    	splineList[i] = gos[i].GetComponent( DotSpline );
    }

    initStageSplines( gm.currentStage );


	sl.addButton( standbyButton );
	standbyButton.onTouchDownInsideDelegate = standbyButtonPressed;
	
}



//////////////////////////////////////////STRATOLITH RELOCATION



function mapActionButtonPressed()
{

	if( gm.currentStage != null )
	{

		if( gm.currentStage == selectedStage ) //start game
		{

			gm.goFromMapToGame();

			//clear all splines
			clearMapSplines();

		}
		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == true )
		{

			beginStratolithRelocation();

		}

	}

}



function stageButtonPressed( _button : ButtonScript )
{

	var stageId : int = _button.buttonTag;

	selectedStage = gm.getStageForId( stageId );

	updateMapLabels();

}



function beginStratolithRelocation()
{

	destinationStage = selectedStage;

	setDestinationSpline();

	currentStage = null;

	updateMapLabels();

}



function updateStratolithIconPosition()
{

	// bail if no destination
	if( destinationStage == null )
		return;

	stratolithSplineT += stratolithVelocity;

	// clamp on either end
	if( stratolithSplineT > 1.0 )
		stratolithSplineT = 1.0;
	if( stratolithSplineT < 0.0 )
		stratolithSplineT = 0.0;

	var newStratolithPosition : Vector2 = destinationSpline.getLocationAlongSpline( stratolithSplineT );

	stratolithIcon.gameObject.transform.position = Vector3( newStratolithPosition.x, newStratolithPosition.y, stratolithIcon.gameObject.transform.position.z);

	stratolithIcon.gameObject.transform.localEulerAngles.z = destinationSpline.getTangentAtPoint(stratolithSplineT, newStratolithPosition);

	// stop when Stratolith gets to either end
	if( stratolithSplineT == 1.0 || stratolithSplineT == 0.0 )
	{
		stratolithArrivedAtNewStage();
	}

}



function stratolithArrivedAtNewStage()
{
	Debug.Log('stratolithArrivedAtNewStage');

	//clear all splines
	clearMapSplines();

	gm.currentStage = destinationStage;

	destinationStage = null;

	updateMapLabels();

	//turn on map splines for new stage
	initStageSplines( gm.currentStage );

}



function updateMapLabels()
{

	//selected stage label
	stageIdLabel.text = "stage_" + selectedStage.stageId.ToString("D2");
	stageIdLabel.Commit();


	//action labels
	if( gm.currentStage != null )
	{

		if( gm.currentStage == selectedStage )
		{
			//start game if stratolith currently over stage
			// mapActionLabel.text = "Start Operation";
		}
		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == true ) //relocate
		{
			//move to new stage as long as it's not locked
			// mapActionLabel.text = "Relocate";
		}
		else if( gm.canRelocateBetweenStages( gm.currentStage, selectedStage ) == false ) //show nothing
		{
			//don't move to locked stages
			// mapActionLabel.text = "----";
		}

	}
	else if( destinationStage != null )
	{

		if( selectedStage == destinationStage )
		{
			// mapActionLabel.text = "- Relocation In Progress -";
		}

	}


	// mapActionLabel.Commit();

}



//////////////////////////////////////////STANDBY



function standbyButtonPressed()
{

	gm.goFromMapToStandby();

}



//////////////////////////////////////////UPDATE



function sublayerMapUpdate()
{

	//frame
	frameNumber++;


	//update stratotlith icon
	updateStratolithIconPosition();


	//update splines
	updateMapSplines();


	//fade in
	if( fadingInElements == true )
	{

		updateFadeInElements();

		if( frameNumber % 2 == 0 )
			chooseRandomFadeInElement();

	}

}



//////////////////////////////////////FADE IN EFFECT



function resetFadeInElements()
{

	for( var i : int = 0; i < numFadeInElements; i++ )
	{

		var element = mapFadeInElementList[i];

		if( element == null )
			continue;

		element.color.a = 0.0;
		element.scale.x = 0.0;

	}

	fadingInElements = true;

}



function snapAllFadeInElements()
{

	for( var i : int = 0; i < numFadeInElements; i++ )
	{

		var element = mapFadeInElementList[i];

		if( element == null )
			continue;

		element.color.a = 1.0;
		element.scale.x = 1.0;

	}

}



function updateFadeInElements()
{

	fadingInElements = false;

	for( var i : int = 0; i < numFadeInElements; i++ )
	{

		var element = mapFadeInElementList[i];


		// skip null elements
		if( element == null )
			continue;


		// skip elements that haven't started yet
		if( element.color.a == 0.0 )
		{
			fadingInElements = true;
			continue;
		}


		// snap
		if( element.color.a >= 0.99 )
		{
			element.color.a = 1.0;
			element.scale.x = 1.0;
			continue;
		}


		// increment
		var dif : float = 1.0 - element.color.a;
		var reducedDif : float = dif * fadeRate;
		var newScale : float = 1.0 - reducedDif;
		element.color.a += newScale;
		element.scale.x += newScale;


		// continue fading in
		if( element.color.a < 1.0 )
			fadingInElements = true;

	}

	if( fadingInElements == false )
		snapAllFadeInElements();

}



function chooseRandomFadeInElement()
{

	var randIndex : int = Random.Range(0, numFadeInElements);

	var randElement = mapFadeInElementList[randIndex];

	if( randElement == null )
		return;

	if( randElement.color.a == 0.0 )
	{
		randElement.color.a = 0.01;
		randElement.scale.x = 0.01;
	}

}



//////////////////////////////////////SPLINES



function initStageSplines( startStage : Stage )
{

	for( var i : int = 0; i < numSplines; i++ )
	{

		// Skip null elements
		if( splineList[i] == null )
			continue;


		if(
			( splineList[i].stageA == startStage && gm.canRelocateBetweenStages( startStage, splineList[i].stageB ) == true ) ||
			( splineList[i].stageB == startStage && gm.canRelocateBetweenStages( startStage, splineList[i].stageA ) == true )
		)
		{

			splineList[i].initSpline( startStage );

		}

	}

}



function setDestinationSpline()
{

	// Figures out which spline to use for moving between currentStage and destinationStage

	for( var i : int = 0; i < numSplines; i++ )
	{

		if( splineList[i] == null )
			continue;

		if( splineList[i].stageA == gm.currentStage && splineList[i].stageB == destinationStage )
		{

			stratolithVelocity = Mathf.Abs( stratolithVelocity );
			stratolithSplineT = 0.0;
			destinationSpline = splineList[i];
			return;

		}
		else if( splineList[i].stageA == destinationStage && splineList[i].stageB == currentStage )
		{

			stratolithVelocity = -1 * Mathf.Abs( stratolithVelocity );
			stratolithSplineT = 1.0;
			destinationSpline = splineList[i];
			return;

		}

	}

}



function updateMapSplines()
{

	for( var i : int = 0; i < numSplines; i++ )
	{

		if( splineList[i] == null )
			continue;


		if( splineList[i].splineDotList[0] != null )
		{

			splineList[i].updateSpline();

		}

	}

}



function clearMapSplines()
{

	for( var i : int = 0; i < numSplines; i++ )
	{

		if( splineList[i] == null )
			continue;


		if( splineList[i].splineDotList[0] != null )
		{

			splineList[i].cleanSpline();

		}

	}

}






