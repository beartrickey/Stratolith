#pragma strict

public var numDronePaths : int = 32;
public var dronePathList = new DronePath[numDronePaths];



function updateAssault()
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
		if( dronePath.delayTime > 0 )
		{
		
			hostileDronesExist = true;
		
			dronePath.delayTime --;
			
		}
		else if( dronePath.delayTime == 0 )
		{
		
			dronePath.delayTime = -1;
			hostileDronesExist = true;
			
			
			//setup new drone
			var drone : Drone = slgd.getFreeDrone();
	
			drone.initializeDrone( dronePath );
			
			dronePath.drone = drone;
			
		}
		else if( dronePath.delayTime == -1 )
		{
		
			if( dronePath.drone.isActive == true &&  dronePath.drone.hacked == false )
			{
			
				hostileDronesExist = true;
				
			}
			
		}
	
	}

}


