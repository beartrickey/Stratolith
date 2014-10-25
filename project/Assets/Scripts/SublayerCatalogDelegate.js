#pragma strict


public static var instance : SublayerCatalogDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//BUTTONS
public var standbyButton : ButtonScript;
public var abortOperationButton : ButtonScript;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerCatalogUpdate;
	
	
	//HACK: unpause by pressing r-scan button
	sl.addButton( standbyButton );
	standbyButton.onTouchDownInsideDelegate = standbyButtonPressed_map;
	
	
	sl.addButton( abortOperationButton );
	abortOperationButton.onTouchDownInsideDelegate = abortOperationButtonPressed;
	
}



function standbyButtonPressed_map()
{

	gm.goFromStandbyToMap();

}



function standbyButtonPressed_game()
{

	gm.goFromCatalogToGame();

}



function abortOperationButtonPressed()
{

	gm.goFromCatalogToGameOver();

}



function sublayerCatalogUpdate()
{

	

}




