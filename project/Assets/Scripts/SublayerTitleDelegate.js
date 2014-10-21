#pragma strict


public static var instance : SublayerTitleDelegate;


public var gm : GameManager;
public var sl : Sublayer;

public var splashScreen : tk2dSprite = null;


public static var SPLASH_FRAMES : int = 180;
public static var SPLASH_FADE_FRAMES : int = 360;

public static var TITLE_STATE_SPLASH : int = 0;
public static var TITLE_STATE_SPLASH_FADE : int = 1;
public static var TITLE_STATE_MAIN_TITLE : int = 2;
public var state : int = TITLE_STATE_SPLASH;

public var counter : int = 0;


//BUTTONS
public var startButton : ButtonScript;
public var startButtonSprite : tk2dSprite = null;
public static var blinkSeconds : float = 2.14;
public static var blinkCounterMax : float = 60.0 * blinkSeconds;
public static var blinkCounter : float = 0.0;


function onInstantiate( startWithSplash : boolean )
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerTitleUpdate;
	
	
	//start button
	sl.addButton( startButton );
	startButton.onTouchDownInsideDelegate = startButtonPressed;


	// Start initial counter for splash screen
    if( startWithSplash == true )
    {

        state = TITLE_STATE_SPLASH;
        counter = SPLASH_FRAMES;

    }
    else
    {
        splashScreen.gameObject.SetActive( false );
        state = TITLE_STATE_MAIN_TITLE;
    }


}



function startButtonPressed()
{
	// Only allow button press after splash screen has faded in
	if( state == TITLE_STATE_MAIN_TITLE )
	{
//		gm.goFromTitleToMap();
        // HACK: Skip map screen for IGF demo
        gm.goFromMapToGame();
	}
}



function sublayerTitleUpdate()
{

    // Handle start button blink
    blinkCounter += 1.0;
    var blinkCounterScaled : float = blinkCounter / blinkCounterMax;
    var blinkCounterRadians : float = blinkCounterScaled * 6.28;
    var opacity : float = 0.75 + (Mathf.Sin(blinkCounterRadians) * 0.25);
    startButtonSprite.color.a = opacity;


    // Handle states
	counter--;

	switch( state )
	{

		case TITLE_STATE_SPLASH:
			if( counter <= 0 )
			{
				state = TITLE_STATE_SPLASH_FADE;
				counter = SPLASH_FADE_FRAMES;
			}
			break;

		case TITLE_STATE_SPLASH_FADE:

			splashScreen.color.a *= 0.95;

			if( splashScreen.color.a <= 0.01 )
			{
				state = TITLE_STATE_MAIN_TITLE;
			}
			break;


		default:
			return;	

	}

}




