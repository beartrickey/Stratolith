#pragma strict


public static var instance : SublayerGameClearDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//BUTTONS
public var continueButton : ButtonScript;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerGameClearUpdate;
	
	
	//start button
	sl.addButton( continueButton );
	continueButton.onTouchDownInsideDelegate = continueButtonPressed;
	
}



function continueButtonPressed()
{

	gm.goFromGameClearToMap();

}



function sublayerGameClearUpdate()
{

	

}




