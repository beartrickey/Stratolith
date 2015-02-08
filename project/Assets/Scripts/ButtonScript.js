#pragma strict


public var buttonEnabled : boolean = true;

public var sublayer : Sublayer;


public var onTouchDownInsideDelegate : function( ButtonScript ) = null;
public var onRolloverDelegate : function( ButtonScript ) = null;
public var onTouchUpInsideDelegate : function( ButtonScript ) = null;
public var onButtonRepeatDelegate : function() = null;
public var onTwoTouchDownInsideDelegate : function() = null;

public var spriteComponent : tk2dSprite = null;

public var upTextureId : int = -1;
public var downTextureId : int = -1;


//knobs
public var isJogDial : boolean = false;
public var knobPosition : float = 0.5; //for dials..goes between 0.0 and 1.0
public var knobLeftmostAngle : float = 140.0;
public var knobRightmostAngle : float = -140.0;
public var knobAngleRange : float = Mathf.Abs( knobLeftmostAngle - knobRightmostAngle );
public var knobSensitivity : float = 0.003; //multiply by touch move distance
public var onKnobMovedDelegate : function( float ) = null;


//toggle switches
public var isToggleSwitch : boolean = false;
public var toggleState : boolean = false;


public var buttonRepeatCounterMax : int = 6;
public var buttonRepeatCounter : int = buttonRepeatCounterMax;
public var buttonRepeatAccelThreshold : int = 6;


public var waitingForSecondTouchInside : boolean = false;
public var isDown : boolean = false;
public var wasDownLastFrame : boolean = false;
public var framesHeldDown : int = 0;


public var onPressSFX : AudioSource = null;
public var onReleaseSFX : AudioSource = null;
public var onTouchUpInsideSFX : AudioSource = null;
public var onButtonRepeatSFX : AudioSource = null;

public var buttonTag : int;
public var buttonTagSub : int;



function onInit()
{
    spriteComponent = gameObject.GetComponent( tk2dSprite );
}



function setupButtonGraphics( _upTexture : String, _downTexture : String )
{

    spriteComponent = gameObject.GetComponent( tk2dSprite );
    
    upTextureId = spriteComponent.GetSpriteIdByName( _upTexture );
    
    downTextureId = spriteComponent.GetSpriteIdByName( _downTexture );
    
    spriteComponent.SetSprite( upTextureId );
    
}



function onKnobMoved( _touchDisplacement : float )
{

	if( onKnobMovedDelegate != null )
	{
		
		knobPosition -= _touchDisplacement * knobSensitivity;
		
		
		if( isJogDial == true ) //wrap position
		{
			wrapJogDial();	
		}
		else //clamp position
		{
			clampKnobPosition();
		}
		
		setKnobRotation();
		
		onKnobMovedDelegate( _touchDisplacement );
		
	}

}



function wrapJogDial()
{

	if( knobPosition < 0.0 )
	{
		knobPosition = 1.0 + knobPosition;
	}
		
	if( knobPosition > 1.0 )
	{
		knobPosition = knobPosition - 1.0;
	}
	
}



function clampKnobPosition()
{

	if( knobPosition < 0.0 )
		knobPosition = 0.0;
		
	if( knobPosition > 1.0 )
		knobPosition = 1.0;
		
}



function setKnobRotation()
{

	gameObject.transform.eulerAngles.z = knobLeftmostAngle - ( knobAngleRange * knobPosition );

}



function onTouchDownInside()
{

	waitingForSecondTouchInside = true;

	if( onTouchDownInsideDelegate != null )
	{
		onTouchDownInsideDelegate( this );
	}
	
}



function onTwoTouchDownInside()
{

	if( onTwoTouchDownInsideDelegate != null )
	{
		onTwoTouchDownInsideDelegate();
	}
	
}



function onTouchUpInside()
{

	//set these to off to prevent rolloff from being called later
    wasDownLastFrame = false;
    isDown = false;
    waitingForSecondTouchInside = false;


	//reset move counter to prevent skips
    buttonRepeatCounter = buttonRepeatCounterMax * 3;

        
    //ml->playSFX( onTouchUpInsideSFX );
    
    if( spriteComponent != null && isToggleSwitch == false && upTextureId != -1 )
    {
    	spriteComponent.SetSprite( upTextureId );
    }
    
    
    if( onTouchUpInsideDelegate != null )
	{
	
		if( onButtonRepeatSFX != null )
			onButtonRepeatSFX.Play();
		
		onTouchUpInsideDelegate( this );
		
	}
    
}



function onRollover()
{

    if( onPressSFX != null )
		onPressSFX.Play();
    
    if( spriteComponent != null && isToggleSwitch == false && downTextureId != -1 )
    {
    	spriteComponent.SetSprite( downTextureId );
    }
    
    
    if( onRolloverDelegate != null )
    {
    	onRolloverDelegate( this );
    }
    
    //reset frames down
    framesHeldDown = 0;
    
}



function onRolloff()
{

    if( onReleaseSFX != null )
		onReleaseSFX.Play();
    
    if( spriteComponent != null && isToggleSwitch == false && upTextureId != -1 )
    {
    	spriteComponent.SetSprite( upTextureId );
    }
    
}



function checkButtonState()
{

    if( wasDownLastFrame == false && isDown == true )
    {
    
        onRollover();
        
        wasDownLastFrame = true;
        
    }
    
    
    if( wasDownLastFrame == true && isDown == false )
    {
    
        onRolloff();
        
        wasDownLastFrame = false;
        waitingForSecondTouchInside = false;
        
    }
    
}



function handleButtonRepeat()
{

    buttonRepeatCounter--;
    
    //button fires again when repeat counter ends
    if( buttonRepeatCounter == 0 )
    {
        //if player held down button for several frames, speed up repeat rate
        framesHeldDown++;
        
        if( framesHeldDown > buttonRepeatAccelThreshold )
        {
            buttonRepeatCounter = buttonRepeatCounterMax * 0.75f; //speed up repeat rate
        }
        else
        {
            buttonRepeatCounter = buttonRepeatCounterMax; //normal repeat rate
        }
        
        
        //play sfx
        if( onButtonRepeatSFX != null )
			onButtonRepeatSFX.Play();
        
        //execute function
        onButtonRepeatDelegate();

    }
    
}



function updateButton()
{

	//check state for rollover / rolloff
    checkButtonState();
    

    //repeat held button press if needed
    if( onButtonRepeatDelegate != null )
    {
    	if( isDown == true )
    	{
    		handleButtonRepeat();
    	}
    }

}



function toggle( _state : boolean )
{

	toggleState = _state;

	if( _state == true )
	{
		spriteComponent.SetSprite( downTextureId );
	}
	else
	{
		spriteComponent.SetSprite( upTextureId );
	}

}