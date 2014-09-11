#pragma strict


public static var instance : SublayerLoadingScreenDelegate;
public static var loadingFrames : int = 180; // 3 seconds
public var loadingCounter : int = 0;

public var gm : GameManager;
public var sl : Sublayer;


public var loadStartFunction : function() = null;
public var loadEndFunction : function() = null;


function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerLoadingScreenUpdate;

}



function onInit( startFunc : function(), endFunc : function() )
{

	//reset loading counter
	loadingCounter = 0;

	loadStartFunction = startFunc;
	loadEndFunction = endFunc;

}



function sublayerLoadingScreenUpdate()
{
	
	loadingCounter++;

	if( loadingCounter == 2 )
	{
		loadStartFunction();
	}


	if( loadingCounter >= loadingFrames )
	{
		loadEndFunction();
	}

}




