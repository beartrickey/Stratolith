#pragma strict


public var dockLabel : tk2dTextMesh;

public var dockActiveLight : tk2dSprite;

public var extractingPower : Boolean = false;
public var dockExtractPowerButton : ButtonScript;
public var dockExtractPowerButtonSprite : tk2dSprite;

public var dockLaunchButton : ButtonScript;
public var dockLaunchButtonSprite : tk2dSprite;

public var drone : Drone;

public var frameNumber : int;



function handleDroneDocking()
{

	//bail if no drone
	if( drone == null )
		return;
	
	
	//state machine
	drone.droneDockingCounter--;
	
	
	switch( drone.state )
	{
	
		case Drone.DRONE_STATE_PREPARING_TO_DOCK:
			
			//change state
			if( drone.droneDockingCounter <= 0 )
				startDock();
			
			break;
			
			
			
		case Drone.DRONE_STATE_DOCKED:
			
			//take drone health
			frameNumber++;


			//handle power extraction
			handlePowerExtraction();
			
			break;
			

		case Drone.DRONE_STATE_PREPARING_TO_LAUNCH:
			
			//change state
			if( drone.droneDockingCounter <= 0 )
				endLaunching();
			
			break;
			
			
		case Drone.DRONE_STATE_CHARGED_TO_DEATH:
			
			//change state
			if( drone.droneDockingCounter <= 0 )
				ejectDeadDrone();
			
			break;
			
			
	}

}



function handlePowerExtraction()
{

	if( extractingPower == false )
		return;

	//discard drone if out of health
	if( drone.health <= 0.0 )
	{
		startDroneDeath();
		return;
	}


	//pull charge from drone
	if( SublayerGameDelegate.instance.mainPower < 100.0 )
	{

		//transfer one point of energy to stratolith every second
		if( frameNumber % 60 == 0 )
		{

			drone.health -= 1.0;
			
			SublayerGameDelegate.instance.mainPower += 1.0;
			
			
			//label
			dockLabel.text = drone.modelString + " " + drone.health + "P";
			dockLabel.Commit();

		}

	}
	else
	{

		//turn off power extraction when powe is at 100%
		dockExtractPowerButtonSprite.SetSprite( "Interface-Tactical-DockExtractPowerOFF" );
		extractingPower = false;

	}

}


function startPreparingToDock( _drone : Drone )
{

	//change drone state
	drone = _drone;
	
	drone.enteredStratolith();

	//label
	dockLabel.text = "DOCK";
	dockLabel.Commit();
	
}



function startDock()
{

	//drone
	drone.state = Drone.DRONE_STATE_DOCKED;
	
	
	//graphics
	dockActiveLight.gameObject.SetActive( true );
	
	//label
	dockLabel.text = drone.modelString + " " + drone.health + "P";
	dockLabel.Commit();
	

	//send message
	var docksCompleteMessage : String = drone.modelString + " DOCK COMPLETE";
	SublayerGameDelegate.instance.addMessage( docksCompleteMessage );
	
}



function startPreparingToLaunch()
{

	//change drone state
	drone.droneDockingCounter = 360;
	drone.state = Drone.DRONE_STATE_PREPARING_TO_LAUNCH;


	//label
	dockLabel.text = "LAUNCH";
	dockLabel.Commit();
	
	
	//graphics
	dockActiveLight.gameObject.SetActive( false );
	
	dockLaunchButtonSprite.SetSprite( "Interface-Tactical-DockLaunchON" );
}



function endLaunching()
{

	// Change drone state
	drone.gameObject.SetActive( true );

	// Set drone's position next to Stratolith
	drone.position = SublayerGameDelegate.instance.stratolithWorldPosition;
			
	drone.startIdle();
	
	drone.updateLabelText(); //update label with new health reading
	
	var launchCompleteMessage : String = drone.modelString + " LAUNCH COMPLETE";
	SublayerGameDelegate.instance.addMessage( launchCompleteMessage );
			
	drone = null;
	
	
	//change graphics
	dockActiveLight.gameObject.SetActive( false );


	//label
	dockLabel.text = "----";
	dockLabel.Commit();

	dockLaunchButtonSprite.SetSprite( "Interface-Tactical-DockLaunchOFF" );
	
}



function dockLaunchButtonPressed()
{

	//does this slot have a drone to launch?
	if( drone != null && drone.state == Drone.DRONE_STATE_DOCKED )
	{
		startPreparingToLaunch();
	}

}



function dockExtractPowerButtonPressed()
{

	//does this slot have a drone to launch?
	if( drone != null && drone.state == Drone.DRONE_STATE_DOCKED )
	{

		if( extractingPower == true )
		{

			dockExtractPowerButtonSprite.SetSprite( "Interface-Tactical-DockExtractPowerOFF" );
			extractingPower = false;

		}
		else
		{

			dockExtractPowerButtonSprite.SetSprite( "Interface-Tactical-DockExtractPowerON" );
			extractingPower = true;

		}

	}

}



function startDroneDeath()
{

	drone.state = Drone.DRONE_STATE_CHARGED_TO_DEATH;
	
	drone.droneDockingCounter = 360;
	
	dockLabel.text = drone.modelString + " " + "DONE";
	dockLabel.Commit();
	
	dockActiveLight.gameObject.SetActive( false );
	
	dockLaunchButtonSprite.SetSprite( "Interface-Tactical-DockLaunchOFF" );
	dockExtractPowerButtonSprite.SetSprite( "Interface-Tactical-DockExtractPowerOFF" );

	//send message
	var droneDeathMessage : String = drone.modelString + " POWER DEPLETED";
	SublayerGameDelegate.instance.addMessage( droneDeathMessage );
	
}



function ejectDeadDrone()
{
	
	drone.deactivate();
	
	drone = null;
	
	dockLabel.text = "----";
	dockLabel.Commit();
	
}






