#pragma strict


public static var instance : SublayerPauseDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//BUTTONS
public var unpauseButton : ButtonScript;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerPauseUpdate;
	
	
	//HACK: unpause by pressing r-scan button
	sl.addButton( unpauseButton );
	unpauseButton.onTouchDownInsideDelegate = unpauseButtonPressed;
	
}



function unpauseButtonPressed()
{

	gm.goFromPauseToGame();

}



function sublayerPauseUpdate()
{

	

}




