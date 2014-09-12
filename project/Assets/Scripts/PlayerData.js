#pragma strict

import System;
import System.Runtime.Serialization.Formatters.Binary;
import System.IO;
import System.Collections.Generic;

public static var instance : PlayerData;


public var scopeLevel : int = 1;
public var dockLevel : int = 1;
public var currentStageId : int = 0;


public var dockedDroneData = new List.<DockedDroneData>();
public var stageData = new List.<StageData>();



class DockedDroneData
{

	var droneType : int = -1;

}


class StageData
{

	var stageId : int = -1;

	var state : int = 0;

	var foundTechItems : int = 0;

	var foundBlackBoxItems : int = 0;

}



function Start()
{

	instance = this;

}



function loadData()
{

	Debug.Log("loading data");
	
	
	scopeLevel = PlayerPrefs.GetInt( "scopeLevel", 1 );

	dockLevel = PlayerPrefs.GetInt( "dockLevel", 1 );

	currentStageId = PlayerPrefs.GetInt( "currentStageId", 0 );

	
	//STAGE DATA
	var tempStageData = deserialize( "stageData" );
	
	//don't corrupt stageData if data doesn't exist
	if( tempStageData != null )
		stageData = tempStageData;
		
		
	//DOCK DATA
	var tempDockedDroneData = deserialize( "dockedDroneData" );
	
	//don't corrupt dockedDroneData if data doesn't exist
	if( tempDockedDroneData != null )
	{

		dockedDroneData = tempDockedDroneData;

	}
	else
	{
		for( var d = 0; d < 3; d++ )
		{

			dockedDroneData[d].droneType = -1;
		
		}
	}

}



function saveData()
{

	PlayerPrefs.SetInt( "scopeLevel", scopeLevel );

	PlayerPrefs.SetInt( "dockLevel", dockLevel );

	PlayerPrefs.SetInt( "currentStageId", GameManager.instance.currentStage.stageId );


	//docked drone data
	var dockSlotList = SublayerGameDelegate.instance.dockSlotList;

	for( var d = 0; d < 3; d++ )
	{

		if( dockSlotList[d].gameObject.activeSelf == false || dockSlotList[d].drone == null)
		{

			Debug.Log( "dock has no drone" );
			dockedDroneData[d].droneType = -1;

		}
		else
		{

			Debug.Log( "saving docked drone of type: " + dockSlotList[d].drone.droneType );
			dockedDroneData[d].droneType = dockSlotList[d].drone.droneType;

		}
	
	}

	serialize( dockedDroneData, "dockedDroneData" );


	//stage data
	for( var i = 0; i < GameManager.instance.numStages; i++ )
	{
		if( GameManager.instance.stageList[i] == null )
			continue;
	
		stageData[i].stageId = GameManager.instance.stageList[i].stageId;
		stageData[i].state = GameManager.instance.stageList[i].state;
		stageData[i].foundTechItems = GameManager.instance.stageList[i].foundTechItems;
		stageData[i].foundBlackBoxItems = GameManager.instance.stageList[i].foundBlackBoxItems;
	
	}

	serialize( stageData, "stageData" );

	PlayerPrefs.Save();

}



function serialize( _var, _varName )
{

	//Get a binary formatter
    var b = new BinaryFormatter();
    
    
    //Create an in memory stream
    var m = new MemoryStream();
    
    
    //Save the stages
    b.Serialize( m, _var );
    
    
    //Add it to player prefs
    PlayerPrefs.SetString( _varName, Convert.ToBase64String( m.GetBuffer() ) );

}



function deserialize( _varName ) : Object
{

	//Get the data
    var data = PlayerPrefs.GetString( _varName );
    
    
    //If not blank then load it
    if( !String.IsNullOrEmpty( data ) )
    {
    
        //Binary formatter for loading back
        var b = new BinaryFormatter();
        
        
        //Create a memory stream with the data
    	var m = new MemoryStream( Convert.FromBase64String( data ) );
    	
    	
    	//Load back the stage data
    	return b.Deserialize( m );
    	
    }

    return null;

}






