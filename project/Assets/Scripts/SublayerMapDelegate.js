#pragma strict

public static var instance : SublayerMapDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//Stratolith
public var stratolithIcon : tk2dSprite;
public var currentStage : Stage = null;  // stage the stratolith is currently on
public var destinationStage : Stage = null;  // stage the stratolith is going to
public var selectedStage : Stage = null;  // stage selected by the player


//STAGES
public var numStages : int = 32;
public var stageList = new Stage[numStages];


//BUTTONS
public var mapActionButton : ButtonScript;
public var standbyButton : ButtonScript;


//LABELS
public var mapActionLabel : tk2dTextMesh;
public var stageIdLabel : tk2dTextMesh;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerMapUpdate;


	//start at stage 00
	currentStage = getStageForId( PlayerData.instance.currentStageId );
	selectedStage = getStageForId( PlayerData.instance.currentStageId );


	//update labels/graphics for current stage
	updateMapLabels();

	stratolithIcon.gameObject.transform.position = currentStage.gameObject.transform.position;
	
	
	//start button
	sl.addButton( mapActionButton );
	mapActionButton.onTouchDownInsideDelegate = mapActionButtonPressed;
	
	
	//stage buttons
	for( var s : int = 0; s < numStages; s++ )
	{

		if( stageList[s] == null )
			continue;
	
		var stageButton : ButtonScript = stageList[s].gameObject.GetComponent( ButtonScript );
		sl.addButton( stageButton );
		stageButton.onTouchDownInsideDelegate = stageButtonPressed;
		stageButton.buttonTag = stageList[s].stageId;
	
	}


	//load data
	loadStages();


	sl.addButton( standbyButton );
	standbyButton.onTouchDownInsideDelegate = standbyButtonPressed;
	
}



//////////////////////////////////////////STRATOLITH RELOCATION



function mapActionButtonPressed()
{

	if( currentStage != null )
	{

		if( currentStage == selectedStage ) //start game
		{

			gm.goFromMapToGame();

		}
		else if( currentStage != selectedStage &&
				areStagesConnected( currentStage, selectedStage ) == true &&
				selectedStage.state != Stage.STAGE_STATE_LOCKED ) //relocate
		{

			beginStratolithRelocation();

		}

	}

}



function stageButtonPressed( _button : ButtonScript )
{

	var stageId : int = _button.buttonTag;

	selectedStage = getStageForId( stageId );

	updateMapLabels();

}



function beginStratolithRelocation()
{

	destinationStage = selectedStage;

	currentStage = null;

	updateMapLabels();

}



function updateStratolithIconPosition()
{

	//bail if no destination
	if( destinationStage == null )
		return;


	//move toward stage
	var dif : Vector2 = destinationStage.gameObject.transform.position - stratolithIcon.gameObject.transform.position;

	var speed : float = 0.75;

	var velocity : Vector2 = dif.normalized * speed;

	stratolithIcon.gameObject.transform.position += velocity;


	//stop
	if( dif.magnitude <= 5.0 )
	{

		stratolithArrivedAtNewStage();

	}

}



function stratolithArrivedAtNewStage()
{

	currentStage = destinationStage;

	destinationStage = null;

	updateMapLabels();

}



function updateMapLabels()
{

	//selected stage label
	stageIdLabel.text = "stage_" + selectedStage.stageId.ToString("D2");
	stageIdLabel.Commit();


	//action labels
	if( currentStage != null )
	{

		if( currentStage == selectedStage )
		{
			//start game if stratolith currently over stage
			mapActionLabel.text = "Start Operation";
		}
		else if( currentStage != selectedStage &&
				areStagesConnected( currentStage, selectedStage ) == true &&
				selectedStage.state != Stage.STAGE_STATE_LOCKED ) //relocate
		{
			//move to new stage as long as it's not locked
			mapActionLabel.text = "Relocate";
		}
		else if( areStagesConnected( currentStage, selectedStage ) == false ||
				selectedStage.state == Stage.STAGE_STATE_LOCKED ) //show nothing
		{
			//don't move to locked stages
			mapActionLabel.text = "----";
		}

	}
	else if( destinationStage != null )
	{

		if( selectedStage == destinationStage )
		{
			mapActionLabel.text = "- Relocation In Progress -";
		}

	}


	mapActionLabel.Commit();

}



//////////////////////////////////////////STANDBY



function standbyButtonPressed()
{

	Debug.Log("hi");

	gm.goFromMapToStandby();

}



//////////////////////////////////////////UPDATE



function sublayerMapUpdate()
{


	//update stratotlith icon
	updateStratolithIconPosition();
	

}



//////////////////////////////////////STAGE MANAGEMENT



function onStageClear()
{

	currentStage.state = Stage.STAGE_STATE_CLEARED;

	unlockCurrentStageConnections();

}



function getStageForId( _id : int )
{

	for(  var i : int = 0; i < numStages; i++ )
	{

		if( stageList[i] == null )
			continue;

		if( stageList[i].stageId == _id )
			return stageList[i];

	}

	return null;

}



function areStagesConnected( _stageA : Stage, _stageB : Stage ) : boolean
{

	for(  var i : int = 0; i < 4; i++ )
	{

		if( _stageA.connectedStageIds[i] == _stageB.stageId )
			return true;

	}

	return false;

}



function unlockCurrentStageConnections()
{

	//unlocks any locked connected stages
	//unlocked and cleared stages don't change state

	for( var i : int = 0; i < 4; i++ )
	{

		var connectedStage = getStageForId( currentStage.connectedStageIds[i] );


		//skip null stages
		if( connectedStage == null )
			continue;

		if( connectedStage.state == Stage.STAGE_STATE_LOCKED )
			connectedStage.state = Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED;

	}

}



//////////////////////////////////////STAGE DATA



function loadStages()
{

    //copy data from stageData to stageList
	for( var i : int = 0; i < numStages; i++ )
	{
	
		stageList[i].state = PlayerData.instance.stageData[i].state;
		stageList[i].foundTechItems = PlayerData.instance.stageData[i].foundTechItems;
		stageList[i].foundBlackBoxItems = PlayerData.instance.stageData[i].foundBlackBoxItems;
	
	}
    
}






