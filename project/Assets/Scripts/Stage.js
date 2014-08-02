#pragma strict

public static var numDronePaths : int = 32;
public var dronePathList = new DronePath[numDronePaths];
public var remainingHostileDrones : int;
public var stageId : int;
public var connectedStageIds = new int[4];

// items
public var techItems : int;
public var foundTechItems : int;

public var blackBoxItems : int;
public var foundBlackBoxItems : int;

public var healthItems : int;
public var foundHealthItems: int;

public static var STAGE_STATE_LOCKED : int = 0;
public static var STAGE_STATE_UNLOCKED_BUT_NOT_CLEARED : int = 1;
public static var STAGE_STATE_CLEARED : int = 2;
public var state : int = STAGE_STATE_LOCKED;



function initStage()
{

	//reset remaining hostile drones for stage
	remainingHostileDrones = 0;
	

	//reset path counters
	for( var i : int = 0; i < numDronePaths; i++ )
	{
	
		var dronePath : DronePath = dronePathList[ i ];
		
		
		//skip null paths
		if( dronePath == null )
			continue;
		
		
		//reset path counters
		dronePath.delayCounter = dronePath.delayTime;
		
		remainingHostileDrones += 1;
		
	}
	
}



function updateStage()
{
	
	var slgd : SublayerGameDelegate = SublayerGameDelegate.instance;
	
	var hostileDronesExist : boolean = false;


	for( var i : int = 0; i < numDronePaths; i++ )
	{
	
		var dronePath : DronePath = dronePathList[ i ];
		
		
		//skip null paths
		if( dronePath == null )
			continue;
			
		
		//paths count down to zero
		if( dronePath.delayCounter > 0 )
		{
		
			hostileDronesExist = true;
		
			dronePath.delayCounter --;
			
		}
		else if( dronePath.delayCounter == 0 )
		{
		
			dronePath.delayCounter = -1;
			hostileDronesExist = true;
			
			
			//setup new drone
			var drone : Drone = slgd.getFreeDrone();
	
			drone.initializeDrone( dronePath );
			
			dronePath.drone = drone;
			
			//GameManager.instance.SFX_NEW_RADAR_ENTITY.Play();

			//add message to stack
			SublayerGameDelegate.instance.addMessage( dronePath.message );
			
		}
		else if( dronePath.delayCounter == -1 )
		{
		
			if( dronePath.drone.isActive == true &&  dronePath.drone.hacked == false )
			{
			
				hostileDronesExist = true;
				
			}
			
		}
	
	}

}


