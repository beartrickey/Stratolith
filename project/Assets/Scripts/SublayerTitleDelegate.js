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



function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerTitleUpdate;
	
	
	//start button
	sl.addButton( startButton );
	startButton.onTouchDownInsideDelegate = startButtonPressed;


	// Start initial counter for splash screen
	state = TITLE_STATE_SPLASH;
	counter = SPLASH_FRAMES;

}



function startButtonPressed()
{
	// Only allow button press after splash screen has faded in
	if( state == TITLE_STATE_MAIN_TITLE )
	{
		gm.goFromTitleToMap();
	}
}



function sublayerTitleUpdate()
{

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




