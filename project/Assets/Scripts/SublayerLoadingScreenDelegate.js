#pragma strict


public static var instance : SublayerLoadingScreenDelegate;


public var gm : GameManager;
public var sl : Sublayer;


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




