#pragma strict


public static var instance : SublayerTitleDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//BUTTONS
public var startButton : ButtonScript;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerTitleUpdate;
	
	
	//start button
	sl.addButton( startButton );
	startButton.onTouchDownInsideDelegate = startButtonPressed;

}



function startButtonPressed()
{

	gm.goFromTitleToMap();

}



function sublayerTitleUpdate()
{
	

}




