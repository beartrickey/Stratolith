#pragma strict

public var slgd : SublayerGameDelegate = null;

public var unlinkButton : ButtonScript = null;

public var drone : Drone = null;

public var linkNumber : int = 0;


function unlinkButtonPressed()
{

	unlinkButton.setupButtonGraphics( "Interface-Tactical-ComButtonOFF", "Interface-Tactical-ComButtonOFFpressed" );

	// Unlink drone
	drone.unlink();

	drone = null;

}

