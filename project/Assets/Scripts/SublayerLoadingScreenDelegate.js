#pragma strict


public static var instance : SublayerLoadingScreenDelegate;


public var gm : GameManager;
public var sl : Sublayer;


public var loadingScreen : tk2dSprite = null;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerLoadingScreenUpdate;

}



function sublayerLoadingScreenUpdate()
{

}




