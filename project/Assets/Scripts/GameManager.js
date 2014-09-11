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


// Stage Data
public var currentStage : Stage;
public var numStages : int = 32;
public var stageList = new Stage[numStages];


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


	// Grab Stages From Scene
	var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag("Stage");
    for( var i : int = 0; i < gos.length; i++ )
    {
    	stageList[i] = gos[i].GetComponent( Stage );
    }
	
	
	//load user data
	PlayerData.instance.loadData();
	currentStage = getStageForId( PlayerData.instance.currentStageId );
	
	
	//figure out screen dimensions
	setScreenDimensions();


	// start sublayers	
	// sublayerTitleDelegate = instantiateSublayerFromResource("SublayerTitle").GetComponent( SublayerTitleDelegate );
	// sublayerTitleDelegate.gm = this;
	// sublayerTitleDelegate.onInstantiate();
	// sublayerTitleDelegate.gameObject.SetActive( true );


	sublayerMapDelegate = instantiateSublayerFromResource("SublayerMap").GetComponent( SublayerMapDelegate );
	sublayerMapDelegate.gm = this;
	sublayerMapDelegate.onInstantiate();
	sublayerMapDelegate.gameObject.SetActive( true );


	sublayerLoadingScreenDelegate = instantiateSublayerFromResource("SublayerLoadingScreen").GetComponent( SublayerLoadingScreenDelegate );
	sublayerLoadingScreenDelegate.gm = this;
	sublayerLoadingScreenDelegate.onInstantiate();
	sublayerLoadingScreenDelegate.gameObject.SetActive( false );

	activeSublayer = sublayerMapDelegate.sl;

	// start at title screen
	// activeSublayer = sublayerTitleDelegate.sl;


	// sublayerGameDelegate = instantiateSublayerFromResource("SublayerGame").GetComponent( SublayerGameDelegate );
	// sublayerGameDelegate.gm = this;
	// sublayerGameDelegate.onInstantiate();

	// // Switch to sublayergameDelegate
	// sublayerGameDelegate.gameObject.SetActive( true );
	// activeSublayer = sublayerGameDelegate.sl;
	// sublayerGameDelegate.startGame();
	

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

	// Show loading screen
	sublayerLoadingScreenDelegate.gameObject.SetActive( true );
	sublayerLoadingScreenDelegate.onInit( startLoadMapToGame, midLoadMapToGame, endLoadMapToGame );
	activeSublayer = sublayerLoadingScreenDelegate.sl;
	
}



function startLoadMapToGame()
{

	// Destroy sprite collections
	destroySpriteCollections();

	// Destroy non-game layers
	GameObject.Destroy( sublayerMapDelegate.gameObject );
	sublayerMapDelegate = null;

	// GameObject.Destroy( sublayerTitleDelegate.gameObject );
	// sublayerTitleDelegate = null;

	// Application.GarbageCollectUnusedAssets();

}



function midLoadMapToGame()
{

	Resources.UnloadUnusedAssets();
	System.GC.Collect();

	// Load sublayerGameDelegate
	sublayerGameDelegate = instantiateSublayerFromResource("SublayerGame").GetComponent( SublayerGameDelegate );
	sublayerGameDelegate.gm = this;
	sublayerGameDelegate.onInstantiate();


	// Load sublayerGameClearDelegate
	sublayerGameClearDelegate = instantiateSublayerFromResource("SublayerGameClear").GetComponent( SublayerGameClearDelegate );
	sublayerGameClearDelegate.gm = this;
	sublayerGameClearDelegate.onInstantiate();

}



function endLoadMapToGame()
{

	// Remove loading screen
	sublayerLoadingScreenDelegate.gameObject.SetActive( false );


	// Switch to sublayergameDelegate
	sublayerGameDelegate.gameObject.SetActive( true );
	activeSublayer = sublayerGameDelegate.sl;
	sublayerGameDelegate.startGame();
	
	
	//start blur in
	sublayerGameDelegate.state = SublayerGameDelegate.GAME_STATE_BLUR_IN;
	if( Application.platform != RuntimePlatform.OSXEditor && Application.platform != RuntimePlatform.IPhonePlayer )
	{
		
		fullScreenBlur.SetActive( true );
		
		fullScreenBlur.renderer.material.SetFloat( "resolution", 0.025 );
		
		fullScreenBlur.renderer.material.SetFloat( "brightness", 0.25 );
		
	}

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
	loadStages();

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
	

	// reload previous map data (what it was before stage attempt)
	loadStages();

	// Re-instantiate and init map
	// sublayerMapDelegate.loadStages();
	sublayerMapDelegate.gameObject.SetActive( true );
	activeSublayer = sublayerMapDelegate.sl;

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

	loadStages();


	// Show loading screen
	sublayerLoadingScreenDelegate.gameObject.SetActive( true );
	sublayerLoadingScreenDelegate.onInit( startLoadGameToMap, midLoadGameToMap, endLoadGameToMap );
	activeSublayer = sublayerLoadingScreenDelegate.sl;


	//audio
	BGM_TACTICAL.Stop();

	BGM_OPS.Play();

}




function startLoadGameToMap()
{

	// Destroy sprite collections
	destroySpriteCollections();


	// Destroy game layers
	GameObject.Destroy( sublayerGameDelegate.gameObject );
	sublayerGameDelegate = null;

	GameObject.Destroy( sublayerGameClearDelegate.gameObject );
	sublayerGameClearDelegate = null;

}



function midLoadGameToMap()
{

	Resources.UnloadUnusedAssets();
	System.GC.Collect();

	// Load sublayerTitleDelegate
	sublayerTitleDelegate = instantiateSublayerFromResource("SublayerTitle").GetComponent( SublayerTitleDelegate );
	sublayerTitleDelegate.gm = this;
	sublayerTitleDelegate.onInstantiate();
	sublayerTitleDelegate.gameObject.SetActive( false );
	

	// Load sublayerMapDelegate
	sublayerMapDelegate = instantiateSublayerFromResource("SublayerMap").GetComponent( SublayerMapDelegate );
	sublayerMapDelegate.gm = this;
	sublayerMapDelegate.onInstantiate();

}



function endLoadGameToMap()
{

	// Remove loading screen
	sublayerLoadingScreenDelegate.gameObject.SetActive( false );


	// Switch to sublayergameDelegate
	sublayerMapDelegate.gameObject.SetActive( true );
	activeSublayer = sublayerMapDelegate.sl;

	BGM_TACTICAL.Play();

}



function destroySpriteCollections()
{

	// Destroy sprite collections

	// SublayerGame
	if( sublayerGameDelegate != null )
	{

		// Large sprite collection
    	GameObject.DestroyImmediate( sublayerGameDelegate.panel.gameObject.renderer.material.mainTexture, true );

    	// Small sprite collection
    	GameObject.DestroyImmediate( sublayerGameDelegate.mainPowerNeedle.gameObject.renderer.material.mainTexture, true );

    }

    // SublayerMap
    if( sublayerMapDelegate != null )
	{
		
		// Large sprite collection 2
    	GameObject.DestroyImmediate( sublayerMapDelegate.stratolithIcon.gameObject.renderer.material.mainTexture, true );

    	// Small sprite collection
    	// GameObject.DestroyImmediate( sublayerMapDelegate.mainPowerNeedle.gameObject.renderer.material.mainTexture, true );

    }

}



//////////////////////////////////////STAGE MANAGEMENT



function onStageClear()
{

	currentStage.state = Stage.STAGE_STATE_CLEARED;

	unlockCurrentStageConnections();

}



function getStageForId( _id : int )
{

	for(  var i : int = 0; i < numStages; i++ )
	{

		if( stageList[i] == null )
			continue;

		if( stageList[i].stageId == _id )
			return stageList[i];

	}

	return null;

}



function canRelocateBetweenStages( startStage : Stage, endStage : Stage ) : boolean
{

	// Must be different stages
	if( startStage == endStage )
		return false;


	// Don't allow relocation to locked stage
	if( endStage.state == Stage.STAGE_STATE_LOCKED )
		return false;


	// Don't allow relocation between two STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED stages
	if( startStage.state == Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED && endStage.state == Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED )
		return false;


	// Are stages actually connected?
	return areStagesConnected( startStage, endStage );

}



function areStagesConnected( _stageA : Stage, _stageB : Stage ) : boolean
{

	for(  var i : int = 0; i < 4; i++ )
	{

		if( _stageA.connectedStageIds[i] == _stageB.stageId )
			return true;

	}

	return false;

}



function unlockCurrentStageConnections()
{

	//unlocks any locked connected stages
	//unlocked and cleared stages don't change state

	for( var i : int = 0; i < 4; i++ )
	{

		var connectedStage = getStageForId( currentStage.connectedStageIds[i] );


		//skip null stages
		if( connectedStage == null )
			continue;

		if( connectedStage.state == Stage.STAGE_STATE_LOCKED )
			connectedStage.state = Stage.STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED;

	}

}



//////////////////////////////////////STAGE DATA



function loadStages()
{

    //copy data from stageData to stageList, setup graphics
	for( var i : int = 0; i < numStages; i++ )
	{

		if( PlayerData.instance.stageData[i] == null )
			continue;
	
		var stageId : int = PlayerData.instance.stageData[i].stageId;

		var stage : Stage = getStageForId( stageId );
		stage.state = PlayerData.instance.stageData[i].state;
		stage.foundTechItems = PlayerData.instance.stageData[i].foundTechItems;
		stage.foundBlackBoxItems = PlayerData.instance.stageData[i].foundBlackBoxItems;
	
	}
    
}


