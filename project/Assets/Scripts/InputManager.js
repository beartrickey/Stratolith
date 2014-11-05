#pragma strict



public static var keyboardEnabled : boolean = true;
public static var instance : InputManager;

public var lastTouchPosition = new Vector2[2];
public var currentTouchPosition = new Vector2[2];


public static var KNOB_PREFERENCE_RADIAL : int = 0;
public static var KNOB_PREFERENCE_VERTICAL : int = 1;

public var knobPreference : int = KNOB_PREFERENCE_VERTICAL;


function Start ()
{

	instance = this;
	
	
	Screen.showCursor = true;
	
}



function Update ()
{
	
	//copy touch position
	lastTouchPosition[0] = currentTouchPosition[0];
	lastTouchPosition[1] = currentTouchPosition[1];
	
	
	switch( Application.platform )
	{
	
		case RuntimePlatform.Android:
		case RuntimePlatform.IPhonePlayer:
		case RuntimePlatform.WP8Player:
		
			//touch
			handleTouchControls();
			
			
			
		
			break;
		
		
		case RuntimePlatform.OSXPlayer:
		case RuntimePlatform.OSXEditor:
		case RuntimePlatform.WindowsPlayer:
		case RuntimePlatform.WindowsEditor:
		case RuntimePlatform.LinuxPlayer:
		
			//mouse
			handleMouseControls();
			
			
			
			//keyboard input
			handleKeyboardControls();
			
			
			break;
		
		
		
		default:
			break;
		
	
	}

}



function handleTouchControls()
{

	//touch began
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Began )
			touchBegan(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Began )
			touchBegan(1);
	}
	
	
	//moved
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Moved )
			touchMoved(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Moved )
			touchMoved(1);
	}
	
	
	//ended
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Ended )
			touchEnded(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Ended )
			touchEnded(1);
	}

	
}



function handleMouseControls()
{

	//mouse button pressed down this frame
	if( Input.GetMouseButtonDown(0) == true )
	{
		mouseBegan();
	}
	
	
	//mouse button down
	if( Input.GetMouseButton(0) == true )
	{
		mouseMoved();
	}
	
	
	//mouse button released
	if( Input.GetMouseButtonUp(0) == true )
	{
		mouseEnded();
	}

}




function handleKeyboardControls()
{

	//DEBUG HACK
	
	//nullify drone
	if( Input.GetKey( KeyCode.H ) )
	{
	
		if( SublayerGameDelegate.instance.activeDrone != null && SublayerGameDelegate.instance.activeDrone.hackedScopeList[0] == false )
		{
			
		}
		
	}


	//Go into attk mode if A is pressed
	if( Input.GetKeyDown( KeyCode.A ) )
	{
	
		if( SublayerGameDelegate.instance.activeDrone != null && SublayerGameDelegate.instance.activeDrone.hackedScopeList[0] == true )
		{
			SublayerGameDelegate.instance.attkButtonPressed();
		}
		
	}


	//Go into attk mode if M is pressed
	if( Input.GetKeyDown( KeyCode.M ) )
	{
	
		if( SublayerGameDelegate.instance.activeDrone != null && SublayerGameDelegate.instance.activeDrone.hackedScopeList[0] == true )
		{
			SublayerGameDelegate.instance.moveButtonPressed();
		}
		
	}
	

	//kill drone
	if( Input.GetKey( KeyCode.K ) )
	{
	
		if( SublayerGameDelegate.instance.activeDrone != null )
		{
		
//			SublayerGameDelegate.instance.activeDrone.startDroneDeath();
			
		}
		
	}
	
	
	//Clear Stage
	if( Input.GetKey( KeyCode.C ) )
	{
	
		if( SublayerGameDelegate.instance.state == SublayerGameDelegate.GAME_STATE_STAGE )
		{
		
			SublayerGameDelegate.instance.stageSuccessfullyCleared();
			
		}
		
	}


	//Delete player saved data
	if( Input.GetKey( KeyCode.D ) )
	{
	
		PlayerPrefs.DeleteAll();
		
	}

}



function mouseBegan()
{

	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );

	lastTouchPosition[0] = currentTouchPosition[0] = ray.origin;

	checkForButtonTouchDownInside( ray, 0 );
	
}



function mouseMoved()
{

	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	var rayOrigin : Vector2 = ray.origin;

	currentTouchPosition[0] = ray.origin;

	checkForButtonRolloverRolloff( ray );
	
}



function mouseEnded()
{
	
	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	
	checkForButtonTouchUpInside( ray );
	
	//stop draging shield wave
	if( SublayerGameDelegate.instance != null )
	{
		SublayerGameDelegate.instance.draggingScopePhase = false;
		SublayerGameDelegate.instance.draggingScopeWavelength = false;
		SublayerGameDelegate.instance.activeScope = null;
	}
	
}




function touchBegan( _touchIndex : int )
{

	//Debug.Log( "Touch " + _touchIndex + " began" );
	
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	lastTouchPosition[_touchIndex] = currentTouchPosition[_touchIndex] = ray.origin;
	
	
	//special case for buttons that wait for second touch
	if( Input.touchCount == 2 )
	{
		var button : ButtonScript = GameManager.instance.activeSublayer.isButtonWaitingForSecondTouch();
		
		if( button != null )
		{
			button.onTwoTouchDownInside();
			return;
		}
		
	}
	
	
	checkForButtonTouchDownInside( ray, _touchIndex );

}




function touchMoved( _touchIndex : int )
{

	//Debug.Log( "Touch " + _touchIndex + " moved" );
	
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	checkForButtonRolloverRolloff( ray );
	
	currentTouchPosition[_touchIndex] = ray.origin;

}




function touchEnded( _touchIndex : int )
{

	//Debug.Log( "Touch " + _touchIndex + " ended" );
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	checkForButtonTouchUpInside( ray );
	
	
	//in the case of multitouch, if touch[0] ends, then touch[1] will become touch[0]...
	//because of this, we need to copy over the lastTouchPosition data from element 1 to 0 :(
	if( Input.touchCount > 1 )
	{
		currentTouchPosition[0] = currentTouchPosition[1];
		lastTouchPosition[0] = lastTouchPosition[1];
		
		currentTouchPosition[1] = Vector2( -1000.0, -1000.0 );
		lastTouchPosition[1] = Vector2( -1000.0, -1000.0 );
	}
	
	if( Input.touchCount == 1 )
	{
		currentTouchPosition[0] = Vector2( -1000.0, -1000.0 );
		lastTouchPosition[0] = Vector2( -1000.0, -1000.0 );
	}
	
	
	//stop draging shield wave
	SublayerGameDelegate.instance.draggingScopePhase = false;
	SublayerGameDelegate.instance.draggingScopeWavelength = false;
	SublayerGameDelegate.instance.activeScope = null;

}



function checkForButtonTouchDownInside( _ray : Ray, _touchIndex : int )
{
	
	var buttonScript : ButtonScript = checkForButtonCollision( _ray );
	
	
	//special case for sublayerGame
	if( SublayerGameDelegate.instance != null )
	{
		if( GameManager.instance.activeSublayer == SublayerGameDelegate.instance.sl )
		{
			handleMainGameTouches( _ray, _touchIndex, buttonScript );
			return;
		}
	}
	
	
	//normal button press
	if( buttonScript != null )
		buttonScript.onTouchDownInside();
	
}



function handleMainGameTouches( _ray : Ray, _touchIndex : int, _buttonScript : ButtonScript )
{
	
	var slgd : SublayerGameDelegate = SublayerGameDelegate.instance;
	
	//deselect drone when no pending command and touched inside radar
	if( slgd.activeDroneWaitingForDestination == false &&
		slgd.activeDroneWaitingForAttackTarget == false &&
		slgd.activeDroneWaitingForSalvageTarget == false &&
		wasTouchInsideRadarCircle( _ray ) == true &&
		_buttonScript == null )
	{
		slgd.deselectDrone();
	}

	
	//case when active drone waiting to MOVE
	if( slgd.activeDroneWaitingForDestination == true )
	{
	
		//cancel select destination state if touch outside of radar circle
		if( wasTouchInsideRadarCircle( _ray ) == true )
		{
			
			//set new waypoint
			slgd.turnOffCommandRequest();
			slgd.activeDrone.startMove( currentTouchPosition[0] );
			GameManager.instance.SFX_CHOOSE_TARGET.Play();
			return;
			
		}
		
	}


	// Case when active drone waiting to select SLVG target
	if( slgd.activeDroneWaitingForSalvageTarget == true )
	{
	
		//bail if no button has been pressed this point
		if( _buttonScript == null )
		{
			return;
		}

		//select item as salvage target
		var itemLocator : ItemLocator = _buttonScript.gameObject.GetComponent( ItemLocator );

		if( itemLocator != null )
		{

			//target selected item
			slgd.turnOffCommandRequest();
			slgd.activeDrone.startSlvg( itemLocator );
			GameManager.instance.SFX_CHOOSE_TARGET.Play();

			return;

		}

	}

	
	//case when active drone waiting for ATTK
	if( slgd.activeDroneWaitingForAttackTarget == true )
	{

		//bail if no button has been pressed this point
		if( _buttonScript == null )
		{
			return;
		}
		

		//select drone as attack target
		var drone : Drone = _buttonScript.gameObject.GetComponent( Drone );
		
		
		if( drone != null )
		{
		
			//skip if not a hostile drone
			if( drone.hackedScopeList[0] == true )
				return;
		
		
			//target selected drone
			slgd.turnOffCommandRequest();
			slgd.activeDrone.startAttk( drone );
			GameManager.instance.SFX_CHOOSE_TARGET.Play();
			
			return;
			
		}
	
	}
	
	
	//normal button press
	if( _buttonScript != null )
		_buttonScript.onTouchDownInside();
	
}



function wasTouchInsideRadarCircle( _ray : Ray ) : boolean
{

	var touchPosition : Vector2 = _ray.origin;
	
	var dif : Vector2 = SublayerGameDelegate.instance.shieldScannerCenter.position - touchPosition;
	
	var distance : float = dif.magnitude;

	
	if( distance < SublayerGameDelegate.scannerWidth )
	{
		return true;
	}
	
	return false;

}




function checkForButtonRolloverRolloff( _ray : Ray )
{

	//bail if dragging a knob/dial
	if( SublayerGameDelegate.instance != null )
	{
		if( SublayerGameDelegate.instance.draggingScopePhase == true || SublayerGameDelegate.instance.draggingScopePhase == true )
		{
			return;
		}
	}

	var buttonScript : ButtonScript = checkForButtonCollision( _ray );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;

}




function checkForButtonTouchUpInside( _ray : Ray )
{

	//bail if dragging a knob/dial
	if( SublayerGameDelegate.instance != null )
	{
		if( SublayerGameDelegate.instance.draggingScopePhase == true || SublayerGameDelegate.instance.draggingScopePhase == true )
		{
			return;
		}
	}
	

	var buttonScript : ButtonScript = checkForButtonCollision( _ray );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;
		
		
	//click button
    buttonScript.onTouchUpInside();

}




function checkForButtonCollision( _ray : Ray ) : ButtonScript
{

	//reset all buttons
	GameManager.instance.activeSublayer.resetAllButtons();
	
	var hitList : RaycastHit[] = Physics.RaycastAll( _ray, 1000 );
	
	//Debug.Log( "hitList Length : " + hitList.length );
	
	
	//bail if nothing hit
	if( hitList.length <= 0 )
		return;
	
	
	//Debug.Log( "hitList.length" + hitList.length );
	
	//loop through hit list for any buttons on screen
	var closestButton : ButtonScript = null;
	var closestDistance : float = 9999.99;
	
	
	for( var i : int = 0; i < hitList.length; i++ )
	{
	
		var hit : RaycastHit = hitList[i];
		
		var buttonScript : ButtonScript = hit.collider.GetComponent( ButtonScript );
		
		
		//skip if null
		if( buttonScript == null )
			continue;
			
		
		//skip if not child of active layer
		if( buttonScript.sublayer != GameManager.instance.activeSublayer )
			continue;
			
		
		//skip if not enabled
		if( buttonScript.buttonEnabled == false )
			continue;
			
		
		//store closest button
		if( hit.distance < closestDistance )
		{
			closestButton = buttonScript;
			closestDistance = hit.distance;
		}
        
	}
	
	
	//use closest button
	if( closestButton != null )
	{
	
		//register as being down
    	closestButton.isDown = true;
    	
    	return closestButton;
    	
    }
	
	
	return null;	

}


