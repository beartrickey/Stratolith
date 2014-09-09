#pragma strict


////ENUMS



////AUDIO
public var BGM_TITLE : AudioSource = null;
public var BGM_OPS : AudioSource = null;
public var BGM_TACTICAL : AudioSource = null;

public var SFX_DRONE_SELECT : AudioSource = null;
public var SFX_BUTTON_PRESS : AudioSource = null;
public var SFX_STRATOLITH_HIT : AudioSource = null;
public var SFX_BULLET_FIRED : AudioSource = null;
public var SFX_DRONE_HACKED : AudioSource = null;
public var SFX_NEW_RADAR_ENTITY : AudioSource = null;
public var SFX_HOSTILE_DESTROYED : AudioSource = null;
public var SFX_DOCK : AudioSource = null;
public var SFX_ATTK : AudioSource = null;
public var SFX_MOVE : AudioSource = null;
public var SFX_CLLD : AudioSource = null;
public var SFX_CHOOSE_TARGET : AudioSource = null;
public var SFX_NULLIFICATION_IN_PROGRESS : AudioSource = null;


////VARIABLES

//camera and screen
public var camera2D : tk2dCamera;
public var aspectRatio : float = 0.0;


//visual effects
public var fullScreenBlur : GameObject;


//sub layers:
public var sublayerTitleDelegate : SublayerTitleDelegate = null;
public var sublayerMapDelegate : SublayerMapDelegate = null;
public var sublayerGameDelegate : SublayerGameDelegate = null;
public var sublayerPauseDelegate : SublayerPauseDelegate = null;
public var sublayerCatalogDelegate : SublayerCatalogDelegate = null;
public var sublayerGameOverDelegate : SublayerGameOverDelegate = null;
public var sublayerGameClearDelegate : SublayerGameClearDelegate = null;
public var sublayerLoadingScreenDelegate : SublayerLoadingScreenDelegate = null;


public var activeSublayer: Sublayer = null;


//singleton ref
public static var instance : GameManager;




function Start()
{

	instance = this;


	Debug.Log("GameManager.Start");


	//don't delete GameManager when going between scenes
	GameObject.DontDestroyOnLoad( this );
	
	
	//limit frame rate to 60 hertz
	Application.targetFrameRate = 60.0;
	
	
	//load user data
	PlayerData.instance.loadData();
	
	
	//figure out screen dimensions
	setScreenDimensions();


	//start sublayers	
	sublayerTitleDelegate = instantiateSublayerFromResource("SublayerTitle").GetComponent( SublayerTitleDelegate );
	sublayerTitleDelegate.gm = this;
	sublayerTitleDelegate.onInstantiate();
	sublayerTitleDelegate.gameObject.SetActive( true );


	sublayerMapDelegate = instantiateSublayerFromResource("SublayerMap").GetComponent( SublayerMapDelegate );
	sublayerMapDelegate.gm = this;
	sublayerMapDelegate.onInstantiate();
	sublayerMapDelegate.gameObject.SetActive( false );


	sublayerLoadingScreenDelegate = instantiateSublayerFromResource("SublayerLoadingScreen").GetComponent( SublayerLoadingScreenDelegate );
	sublayerLoadingScreenDelegate.gm = this;
	sublayerLoadingScreenDelegate.onInstantiate();
	sublayerLoadingScreenDelegate.gameObject.SetActive( false );

	// sublayerGameDelegate.onInstantiate();
	// sublayerGameDelegate.gameObject.SetActive( false );

	// sublayerPauseDelegate.onInstantiate();
	// sublayerPauseDelegate.gameObject.SetActive( false );

	// sublayerCatalogDelegate.onInstantiate();
	// sublayerCatalogDelegate.gameObject.SetActive( false );

	// sublayerGameOverDelegate.onInstantiate();
	// sublayerGameOverDelegate.gameObject.SetActive( false );

	// sublayerGameClearDelegate.onInstantiate();
	// sublayerGameClearDelegate.gameObject.SetActive( false );


	//start at title screen
	activeSublayer = sublayerTitleDelegate.sl;

	//play title music
	BGM_TITLE.Play();
	
}



function instantiateSublayerFromResource( resourcePath : String ) : GameObject
{

	var prefab : GameObject = Resources.Load(resourcePath);
	var gameObject : GameObject = GameObject.Instantiate(prefab, prefab.transform.position, prefab.transform.rotation);
	return gameObject;

}




function setScreenDimensions()
{
	
	//device screen resolution
	var screenWidth : float = Screen.currentResolution.width;
	var screenHeight : float = Screen.currentResolution.height;
	
	var currentNativeResolutionWidth : float = camera2D.NativeResolution.x;
	var currentNativeResolutionHeight : float = camera2D.NativeResolution.y;
	
	
	//force window resolution for desktop
	if( Application.platform == RuntimePlatform.OSXPlayer ||
		Application.platform == RuntimePlatform.OSXEditor ||
		Application.platform == RuntimePlatform.WindowsPlayer ||
		Application.platform == RuntimePlatform.WindowsEditor ||
		Application.platform == RuntimePlatform.LinuxPlayer )
	{
	
		Screen.SetResolution( 1024, 768, false );
		
		screenWidth = 1024;//1440
		screenHeight = 768;//900
		
	}
	
	
	//what is the device screen aspect ratio compared to the base aspect ratio?
	var aspectRatio = screenWidth / screenHeight;
	var baseAspectRatio : float = currentNativeResolutionWidth / currentNativeResolutionHeight;
    
	Debug.Log( "aspectRatio: " + aspectRatio );
	Debug.Log( "baseAspectRatio: " + baseAspectRatio );

	var scaleDif : float = 1.0;

	//Which edge will fit first when scaling? The top edge or side edge?
	if( aspectRatio < baseAspectRatio )
	{
    
	    //layer sides will be flush with screen sides
	    scaleDif = screenWidth / currentNativeResolutionWidth;

	}
	else
	{
    
	    //layer top and bottom will be flush with screen top and bottom
	    scaleDif = screenHeight / currentNativeResolutionHeight;

	}

	
	//adjust camera's ortho size
	var currentOrthoSize : float = camera2D.CameraSettings.orthographicSize;
	var newOrthoSize : float =  currentOrthoSize / scaleDif;
	
	camera2D.CameraSettings.orthographicSize = newOrthoSize;
	
	Debug.Log( "scaleDif: " + scaleDif );
	Debug.Log( "newOrthoSize: " + newOrthoSize );

}



function Update ()
{

	//active layer update
	if( activeSublayer != null )
	{

		if( activeSublayer.sublayerUpdate != null )
		{

			activeSublayer.sublayerUpdate();

		}

	}
	
}



//////////////////////////////////////////////////TRANSITIONS



//TITLE



function goFromTitleToMap()
{

	sublayerTitleDelegate.gameObject.SetActive( false );
	
	sublayerMapDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerMapDelegate.sl;

	//audio
	BGM_TITLE.Stop();

	BGM_OPS.Play();

}




//MAP


function goFromMapToGame()
{

	sublayerMapDelegate.gameObject.SetActive( false );
	
	sublayerGameDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerGameDelegate.sl;
	
	sublayerGameDelegate.startGame();
	
	
	//start blur in
	sublayerGameDelegate.state = SublayerGameDelegate.GAME_STATE_BLUR_IN;
	if( Application.platform != RuntimePlatform.OSXEditor && Application.platform != RuntimePlatform.IPhonePlayer )
	{
		
		sublayerGameDelegate.gameObject.transform.localScale = Vector3( 0.25, 0.25, 1.0 );
		
		fullScreenBlur.SetActive( true );
		
		fullScreenBlur.renderer.material.SetFloat( "resolution", 0.025 );
		
		fullScreenBlur.renderer.material.SetFloat( "brightness", 0.25 );
		
	}


	//audio
	//BGM_OPS.Stop();

	BGM_TACTICAL.Play();
	
}



function goFromMapToStandby()
{
	
	Debug.Log( "goFromMapToStandby" );

	sublayerCatalogDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerCatalogDelegate.sl;

	sublayerCatalogDelegate.standbyButton.onTouchDownInsideDelegate = sublayerCatalogDelegate.standbyButtonPressed_map;
	
	sublayerCatalogDelegate.abortOperationButton.onTouchDownInsideDelegate = null;

}



//GAME



function goFromGameToCatalog()
{

	Debug.Log( "goFromGameToCatalog" );
	
	sublayerCatalogDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerCatalogDelegate.sl;

	sublayerCatalogDelegate.standbyButton.onTouchDownInsideDelegate = sublayerCatalogDelegate.standbyButtonPressed_game;
	
	sublayerCatalogDelegate.abortOperationButton.onTouchDownInsideDelegate = sublayerCatalogDelegate.abortOperationButtonPressed;

}



function resetStage()
{
	
	sublayerGameDelegate.deselectDrone();
	
	sublayerGameDelegate.clearScene();
	
	sublayerGameDelegate.resetVarsForNewStage();
	
	sublayerGameDelegate.startGame();
	
	
	sublayerCatalogDelegate.gameObject.SetActive( false );
	sublayerGameDelegate.gameObject.SetActive( true );
	activeSublayer = sublayerGameDelegate.sl;

}



//PAUSING



function goFromGameToPause()
{

	Debug.Log( "goFromGameToPause" );
	
	sublayerPauseDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerPauseDelegate.sl;

}



function goFromPauseToGame()
{

	Debug.Log( "goFromPauseToGame" );
	
	sublayerPauseDelegate.gameObject.SetActive( false );
	
	activeSublayer = sublayerGameDelegate.sl;

}



//STANDBY



function goFromCatalogToGame()
{

	Debug.Log( "goFromCatalogToGame" );
	
	sublayerCatalogDelegate.gameObject.SetActive( false );
	
	activeSublayer = sublayerGameDelegate.sl;

}



function goFromStandbyToMap()
{
	
	sublayerCatalogDelegate.gameObject.SetActive( false );
	
	activeSublayer = sublayerMapDelegate.sl;


	//audio
	BGM_TACTICAL.Stop();

	BGM_OPS.Play();

}



function goFromCatalogToGameOver()
{

	sublayerGameDelegate.abortStage();

	sublayerGameDelegate.gameObject.SetActive( false );

	sublayerCatalogDelegate.gameObject.SetActive( false );
	
	sublayerGameOverDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerGameOverDelegate.sl;

	// reload previous map data (what it was before stage attempt)
	sublayerMapDelegate.loadStages();

}



//GAME OVER



function goFromGameToGameOver()
{

	sublayerGameDelegate.abortStage();

	sublayerGameDelegate.gameObject.SetActive( false );
	
	sublayerGameOverDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerGameOverDelegate.sl;

}



function goFromGameOverToMap()
{

	sublayerGameOverDelegate.gameObject.SetActive( false );
	
	sublayerMapDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerMapDelegate.sl;


	// reload previous map data (what it was before stage attempt)
	sublayerMapDelegate.loadStages();

	//audio
	BGM_TACTICAL.Stop();

	BGM_OPS.Play();

}



//GAME CLEAR



function goFromGameToGameClear()
{

	sublayerGameDelegate.gameObject.SetActive( false );
	
	sublayerGameClearDelegate.gameObject.SetActive( true );
	
	activeSublayer = sublayerGameClearDelegate.sl;

}



function goFromGameClearToMap()
{

	sublayerGameClearDelegate.gameObject.SetActive( false );
	
	sublayerMapDelegate.gameObject.SetActive( true );

	sublayerMapDelegate.loadStages();
	
	activeSublayer = sublayerMapDelegate.sl;


	//audio
	BGM_TACTICAL.Stop();

	BGM_OPS.Play();

}


