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

	if( dronePathList[0] == null )
		generateStage();


	//reset remaining hostile drones for stage
	remainingHostileDrones = 0;
	

	//reset path counters
	for( var i : int = 0; i < numDronePaths; i++ )
	{
	
		var dronePath : DronePath = dronePathList[i];
		
		
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
			dronePath.drone = drone;
	
			if( dronePath.droneType == 99 )
			{

				var hackable : boolean = false;

				if( i % 2 == 0 )
					hackable = true;

				var damage : float = Math.Floor(Random.Range(2.0, 6.0));
				var speed : float = Random.Range(0.15, 0.0375);
				var health : float = Math.Floor(Random.Range(1.0, 20.0));
				var range : float = Math.Floor(Random.Range(100.0, 500.0));

				dronePath.drone.initRandomDrone( hackable, damage, speed, health, range, dronePath );

			}
			else
			{
				drone.initializeDrone( dronePath );
			}
			
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



function generateStage()
{

	// Theme
		// Circle Long Range Attack
		// Circle Medium Range Attack
		// Few strong drones to protect against many weak drones
		// Big bruiser to be taken down by many small drones
		// Linear Convoy
		// Hasami attack
		// Friendly drone(s) in encounter getting attacked by enemies
		// Tokkou Attack
		// Mixed attack
	var STAGE_THEME_CIRCLE_LONG : int = 0;
	var STAGE_THEME_CIRCLE_MEDIUM : int = 1;
	var STAGE_THEME_CIRCLE_CLOSE : int = 2;
	var STAGE_THEME_LINEAR : int = 4;

	var randTheme : int = Random.Range(0, 3);

	// Difficulty
	// attackRange = _range;
	// modelString = "????";
	// health = _health;
	// reloadCounterMax = 200;
	// maxSpeed = _speed;
	// bulletDamage = _damage;
	// nullifiable = _hackable;

	// num drones
	var numDrones : int = Random.Range(4, 8);

	// Drone Path Prefab
	var dronePathPrefab : GameObject = Resources.Load("DronePath");

	for( var i : int = 0; i < numDrones; i++ )
	{

		// Path
		var dpgo : GameObject = GameObject.Instantiate( dronePathPrefab, Vector3.zero, dronePathPrefab.transform.rotation );
		dronePathList[i] = dpgo.GetComponent( DronePath );
		dronePathList[i].delayTime = i * 600;
		dronePathList[i].pathTemplate = GameManager.instance.pathTemplateList[Random.Range(0, 8)];
		dronePathList[i].pathRotation = Random.Range(0.0, 360.0);

		// Drone
		dronePathList[i].droneType = Drone.DRONE_MODEL_RAND;
		dronePathList[i].message = "HELLZ YEAH!";

	}

}









